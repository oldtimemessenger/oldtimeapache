import { randomUUID } from "node:crypto";
import { ApiError, blocked, body as readBody, json, object, rows, type Database } from "./runtime";

export interface OpenMicConfig {
  serverUrl?: string;
  apiKey?: string;
  apiSecret?: string;
}
type RoomRow = {
  id:string; owner_id:string; title:string; topic:string; visibility:"public"|"unlisted";
  status:"live"|"ended"; created_at:number; updated_at:number; owner_name:string; owner_username:string;
  participant_count?:number;
};
type ParticipantRow = {
  user_id:string; role:"host"|"listener"; host_muted:number; joined_at:number;
  last_seen_at:number; display_name:string; username:string;
};
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().replace(/[\u0000-\u001f\u007f]/g,"").slice(0,max):"";
const now=()=>Date.now();
const liveKitReady=(config:OpenMicConfig)=>!!(config.serverUrl&&config.apiKey&&config.apiSecret);
function base64url(value:Uint8Array){
  let binary="";for(let i=0;i<value.length;i++)binary+=String.fromCharCode(value[i]);
  return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function encoded(value:unknown){return base64url(new TextEncoder().encode(JSON.stringify(value)));}
async function signJwt(payload:Record<string,unknown>,secret:string){
  const header=encoded({alg:"HS256",typ:"JWT"}),body=encoded(payload),input=header+"."+body;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const signature=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(input)));
  return input+"."+base64url(signature);
}
async function participantToken(config:OpenMicConfig,roomId:string,userId:string,canPublish:boolean){
  const issued=Math.floor(now()/1000);
  return signJwt({
    iss:config.apiKey,sub:userId,nbf:issued-5,iat:issued,exp:issued+300,
    video:{roomJoin:true,room:roomId,canPublish,canSubscribe:true,canPublishData:true},
  },config.apiSecret!);
}
async function adminToken(config:OpenMicConfig,roomId:string){
  const issued=Math.floor(now()/1000);
  return signJwt({
    iss:config.apiKey,sub:"oldtime-open-mic-service",nbf:issued-5,iat:issued,exp:issued+300,
    video:{roomAdmin:true,room:roomId},
  },config.apiSecret!);
}
function httpBase(serverUrl:string){
  return serverUrl.replace(/^wss:/i,"https:").replace(/^ws:/i,"http:").replace(/\/$/,"");
}
async function liveKitAdmin(config:OpenMicConfig,roomId:string,method:"UpdateParticipant"|"RemoveParticipant"|"DeleteRoom",payload:Record<string,unknown>){
  if(!liveKitReady(config))throw new ApiError(503,"Open Mic audio is being prepared. Please try again later.");
  const token=await adminToken(config,roomId);
  const response=await fetch(`${httpBase(config.serverUrl!)}/twirp/livekit.RoomService/${method}`,{
    method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},
    body:JSON.stringify(payload),
  });
  if(!response.ok&&!(response.status===404&&(method==="DeleteRoom"||method==="RemoveParticipant")))throw new ApiError(502,"Open Mic could not update the live audio room. Please retry.");
  return response;
}
async function roomRow(db:Database,id:string){
  return db.prepare(`SELECT r.*,u.display_name AS owner_name,u.username AS owner_username
    FROM open_mic_rooms r JOIN users u ON u.id=r.owner_id WHERE r.id=? LIMIT 1`).bind(id).first<RoomRow>();
}
async function participant(db:Database,roomId:string,userId:string){
  return db.prepare("SELECT role,host_muted FROM open_mic_participants WHERE room_id=? AND user_id=?")
    .bind(roomId,userId).first<{role:"host"|"listener";host_muted:number}>();
}
async function visibleTo(db:Database,room:RoomRow,userId:string){
  return !await blocked(db,userId,room.owner_id)&&!await blocked(db,room.owner_id,userId);
}
async function roomDetails(db:Database,room:RoomRow,userId:string){
  const people=await rows<ParticipantRow>(db,`SELECT p.user_id,p.role,p.host_muted,p.joined_at,p.last_seen_at,
    u.display_name,u.username FROM open_mic_participants p JOIN users u ON u.id=p.user_id
    WHERE p.room_id=? AND p.last_seen_at>? ORDER BY CASE p.role WHEN 'host' THEN 0 ELSE 1 END,p.joined_at ASC LIMIT 500`,
    room.id,now()-90_000);
  const safePeople=[];
  for(const person of people)if(person.user_id===userId||(!await blocked(db,userId,person.user_id)&&!await blocked(db,person.user_id,userId))){
    safePeople.push({id:person.user_id,name:person.display_name||person.username,username:person.username,
      role:person.role,hostMuted:!!person.host_muted,joinedAt:person.joined_at});
  }
  return {room:{id:room.id,title:room.title,topic:room.topic,visibility:room.visibility,status:room.status,
    createdAt:room.created_at,host:{id:room.owner_id,name:room.owner_name,username:room.owner_username},
    participantCount:safePeople.length},participants:safePeople};
}
function requireUuid(value:string){if(!uuidPattern.test(value))throw new ApiError(404,"This Open Mic room is unavailable.");}
async function getRoom(db:Database,id:string,userId:string){
  requireUuid(id);
  const room=await roomRow(db,id);
  if(!room||room.status!=="live"||room.updated_at<now()-6*60*60*1000)throw new ApiError(404,"This Open Mic room has ended or is unavailable.");
  if(!await visibleTo(db,room,userId))throw new ApiError(404,"This Open Mic room is unavailable.");
  return room;
}
async function listRooms(db:Database,userId:string){
  const found=await rows<RoomRow>(db,`SELECT r.*,u.display_name AS owner_name,u.username AS owner_username,
    (SELECT COUNT(*) FROM open_mic_participants p WHERE p.room_id=r.id AND p.last_seen_at>?) AS participant_count
    FROM open_mic_rooms r JOIN users u ON u.id=r.owner_id
    WHERE r.status='live' AND r.visibility='public' AND r.updated_at>? ORDER BY r.updated_at DESC LIMIT 40`,
    now()-90_000,now()-6*60*60*1000);
  const result=[];
  for(const room of found)if(await visibleTo(db,room,userId))result.push({
    id:room.id,title:room.title,topic:room.topic,host:{name:room.owner_name,username:room.owner_username},
    participantCount:Number(room.participant_count)||0,createdAt:room.created_at,
  });
  return result;
}
async function createRoom(request:Request,db:Database,userId:string,config:OpenMicConfig){
  if(!liveKitReady(config))throw new ApiError(503,"Open Mic audio is being prepared. The live audio server is not connected yet.");
  const input=object(await readBody(request,8*1024));
  const title=clean(input?.title,80),topic=clean(input?.topic,140),visibility=input?.visibility==="unlisted"?"unlisted":"public";
  if(title.length<3)throw new ApiError(400,"Give your Open Mic room a title of at least 3 characters.");
  const active=await db.prepare("SELECT id FROM open_mic_rooms WHERE owner_id=? AND status='live' AND updated_at>? LIMIT 1")
    .bind(userId,now()-6*60*60*1000).first();
  if(active)throw new ApiError(409,"You already host an Open Mic room. End it before starting another.");
  const id=randomUUID(),timestamp=now();
  await db.batch([
    db.prepare(`INSERT INTO open_mic_rooms(id,owner_id,title,topic,visibility,status,created_at,updated_at)
      VALUES(?,?,?,?,?,'live',?,?)`).bind(id,userId,title,topic,visibility,timestamp,timestamp),
    db.prepare(`INSERT INTO open_mic_participants(room_id,user_id,role,host_muted,joined_at,last_seen_at)
      VALUES(?,?,'host',0,?,?)`).bind(id,userId,timestamp,timestamp),
  ]);
  const user=await db.prepare("SELECT display_name FROM users WHERE id=?").bind(userId).first<{display_name:string}>();
  const token=await participantToken(config,id,userId,true);
  return json({serverUrl:config.serverUrl,token,room:{id,title,topic,visibility,status:"live",
    host:{id:userId,name:user?.display_name||"Host"},participantCount:1},role:"host"},201);
}
async function joinRoom(db:Database,id:string,userId:string,config:OpenMicConfig){
  if(!liveKitReady(config))throw new ApiError(503,"Open Mic audio is being prepared. The live audio server is not connected yet.");
  const room=await getRoom(db,id,userId);
  const banned=await db.prepare("SELECT 1 FROM open_mic_room_bans WHERE room_id=? AND user_id=?").bind(id,userId).first();
  if(banned)throw new ApiError(403,"The host removed you from this room.");
  const existing=await participant(db,id,userId);
  const count=await db.prepare("SELECT COUNT(*) AS total FROM open_mic_participants WHERE room_id=? AND last_seen_at>?")
    .bind(id,now()-90_000).first<{total:number}>();
  if(!existing&&(Number(count?.total)||0)>=500)throw new ApiError(409,"This room has reached its current audience limit.");
  const timestamp=now();
  await db.prepare(`INSERT INTO open_mic_participants(room_id,user_id,role,host_muted,joined_at,last_seen_at)
    VALUES(?,?,'listener',0,?,?) ON CONFLICT(room_id,user_id) DO UPDATE SET last_seen_at=excluded.last_seen_at`)
    .bind(id,userId,timestamp,timestamp).run();
  await db.prepare("UPDATE open_mic_rooms SET updated_at=? WHERE id=?").bind(timestamp,id).run();
  const current=await participant(db,id,userId);
  const details=await roomDetails(db,room,userId);
  const token=await participantToken(config,id,userId,!current?.host_muted);
  return json({serverUrl:config.serverUrl,token,room:details.room,participants:details.participants,role:current?.role||"listener",canPublish:!current?.host_muted},200);
}
async function heartbeat(db:Database,id:string,userId:string){
  const room=await getRoom(db,id,userId);
  const result=await db.prepare("UPDATE open_mic_participants SET last_seen_at=? WHERE room_id=? AND user_id=?")
    .bind(now(),id,userId).run();
  if(!result.meta?.changes)throw new ApiError(403,"Join this room before sending a presence update.");
  if(room.owner_id===userId)await db.prepare("UPDATE open_mic_rooms SET updated_at=? WHERE id=?").bind(now(),id).run();
  return json({ok:true});
}
async function leaveRoom(db:Database,id:string,userId:string,config:OpenMicConfig){
  const room=await getRoom(db,id,userId);
  const current=await participant(db,id,userId);
  if(!current) return json({ok:true});
  if(room.owner_id===userId){
    await liveKitAdmin(config,id,"DeleteRoom",{room:id});
    const timestamp=now();
    await db.prepare("UPDATE open_mic_rooms SET status='ended',ended_at=?,updated_at=? WHERE id=?")
      .bind(timestamp,timestamp,id).run();
    return json({ok:true,ended:true});
  }
  await db.prepare("DELETE FROM open_mic_participants WHERE room_id=? AND user_id=?").bind(id,userId).run();
  return json({ok:true});
}
async function moderate(request:Request,db:Database,room:RoomRow,userId:string,config:OpenMicConfig){
  if(room.owner_id!==userId)throw new ApiError(403,"Only the room host can manage participants.");
  const input=object(await readBody(request,8*1024));
  const target=clean(input?.targetUserId,64),action=input?.action;
  if(!uuidPattern.test(target)||!["mute","allow-mic","remove"].includes(String(action)))throw new ApiError(400,"Choose a valid participant and moderation action.");
  if(target===userId)throw new ApiError(400,"You cannot moderate your own host microphone.");
  const existing=await participant(db,room.id,target);
  if(!existing)throw new ApiError(404,"That participant is no longer in the room.");
  if(action==="remove"){
    await liveKitAdmin(config,room.id,"RemoveParticipant",{room:room.id,identity:target});
    await db.batch([
      db.prepare("INSERT OR IGNORE INTO open_mic_room_bans(room_id,user_id,created_at) VALUES(?,?,?)").bind(room.id,target,now()),
      db.prepare("DELETE FROM open_mic_participants WHERE room_id=? AND user_id=?").bind(room.id,target),
    ]);
  }else{
    const muted=action==="mute";
    await liveKitAdmin(config,room.id,"UpdateParticipant",{
      room:room.id,identity:target,permission:{canPublish:!muted,canSubscribe:true,canPublishData:true},
    });
    await db.prepare("UPDATE open_mic_participants SET host_muted=? WHERE room_id=? AND user_id=?")
      .bind(muted?1:0,room.id,target).run();
  }
  return json({ok:true});
}
export async function openMicRequest(request:Request,db:Database,userId:string,path:string,config:OpenMicConfig){
  const parts=path.split("/").filter(Boolean);
  if(parts[0]!=="open-mic")throw new ApiError(404,"Open Mic route not found.");
  if(parts.length===2&&parts[1]==="rooms"&&request.method==="GET")return json({rooms:await listRooms(db,userId),audioReady:liveKitReady(config)});
  if(parts.length===2&&parts[1]==="rooms"&&request.method==="POST")return createRoom(request,db,userId,config);
  if(parts.length>=3&&parts[1]==="rooms"){
    const id=parts[2],room=await getRoom(db,id,userId);
    if(parts.length===3&&request.method==="GET"){
      const details=await roomDetails(db,room,userId);return json(details);
    }
    if(parts.length===4&&parts[3]==="join"&&request.method==="POST")return joinRoom(db,id,userId,config);
    if(parts.length===4&&parts[3]==="heartbeat"&&request.method==="POST")return heartbeat(db,id,userId);
    if(parts.length===4&&parts[3]==="leave"&&request.method==="POST")return leaveRoom(db,id,userId,config);
    if(parts.length===4&&parts[3]==="moderate"&&request.method==="POST")return moderate(request,db,room,userId,config);
    if(parts.length===3&&request.method==="DELETE"){
      if(room.owner_id!==userId)throw new ApiError(403,"Only the room host can end this room.");
      await liveKitAdmin(config,id,"DeleteRoom",{room:id});
      const timestamp=now();
      await db.prepare("UPDATE open_mic_rooms SET status='ended',ended_at=?,updated_at=? WHERE id=?")
        .bind(timestamp,timestamp,id).run();
      return json({ok:true,ended:true});
    }
  }
  throw new ApiError(404,"Open Mic route not found.");
}
export const __openMicTest={encoded,signJwt,participantToken,adminToken,liveKitReady};
