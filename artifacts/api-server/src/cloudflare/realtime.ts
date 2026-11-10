import { createHash,randomBytes } from "node:crypto";
import { ApiError,blocked,json,rows,type Database } from "./runtime";
import { mentionRecipients } from "./social";
export interface RealtimeNamespace {
  idFromName(name:string):unknown;
  get(id:unknown):{fetch(request:Request):Promise<Response>};
}
interface RealtimeEnv {DB:Database;REALTIME:RealtimeNamespace}
interface Socket extends WebSocket {serializeAttachment(value:unknown):void;deserializeAttachment():unknown}
interface ObjectState {
  acceptWebSocket(socket:Socket,tags?:string[]):void;
  getWebSockets():Socket[];
  setWebSocketAutoResponse(pair:unknown):void;
}
declare const WebSocketPair:{new():{0:Socket;1:Socket}};
declare const WebSocketRequestResponsePair:{new(request:string,response:string):unknown};
const digest=(value:string)=>createHash("sha256").update(value).digest("hex");
const sessionHash=(request:Request)=>digest((request.headers.get("authorization")??"").replace(/^Bearer\s+/i,"").trim());
export async function realtimeTicket(request:Request,env:RealtimeEnv,userId:string){
  const ticket=randomBytes(24).toString("base64url"),hash=sessionHash(request),now=Date.now(),expiresAt=now+60000;
  const result=await env.DB.batch([
    env.DB.prepare("DELETE FROM realtime_tickets WHERE user_id=? AND expires_at<=?").bind(userId,now),
    env.DB.prepare(`INSERT INTO realtime_tickets(token_hash,user_id,session_hash,expires_at)
      SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM sessions WHERE token_hash=? AND user_id=? AND expires_at>?)`)
      .bind(digest(ticket),userId,hash,expiresAt,hash,userId,now),
  ]);
  if(result[1].meta?.changes!==1)throw new ApiError(401,"Your session has expired. Sign in again.");
  return json({ticket,expiresAt});
}
export async function realtimeUpgrade(request:Request,env:RealtimeEnv){
  if(request.headers.get("upgrade")?.toLowerCase()!=="websocket")throw new ApiError(400,"We couldn’t connect to live updates. Please reconnect.");
  const ticket=new URL(request.url).searchParams.get("ticket")??"";
  if(!/^[A-Za-z0-9_-]{32}$/.test(ticket))throw new ApiError(401,"A fresh connection ticket is required.");
  const row=await env.DB.prepare(`DELETE FROM realtime_tickets WHERE token_hash=? AND expires_at>?
    AND EXISTS(SELECT 1 FROM sessions s WHERE s.token_hash=realtime_tickets.session_hash AND s.user_id=realtime_tickets.user_id AND s.expires_at>?)
    RETURNING user_id,session_hash`).bind(digest(ticket),Date.now(),Date.now()).first<{user_id:string;session_hash:string}>();
  if(!row)throw new ApiError(401,"This connection ticket expired or was already used.");
  const headers=new Headers(request.headers);
  headers.set("X-Oldtime-User",row.user_id);headers.set("X-Oldtime-Session",row.session_hash);
  return env.REALTIME.get(env.REALTIME.idFromName(row.user_id)).fetch(new Request("https://oldtime-realtime.internal/connect",{headers}));
}
export async function dispatchRealtime(env:RealtimeEnv,userId:string,chatId?:string|null){
  const response=await env.REALTIME.get(env.REALTIME.idFromName(userId)).fetch(new Request("https://oldtime-realtime.internal/update",{
    method:"POST",body:JSON.stringify({userId,chatId}),
  }));
  if(!response.ok)throw new Error("A real-time update could not be delivered.");
}
type CallSignalType="invite"|"ringing"|"answer"|"accept"|"reject"|"end"|"ice"|"ice-restart-request";
interface CallSignal {callId:string;type:CallSignalType;to:string;conversationId:string;payload:Record<string,unknown>}
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const callSignalTypes=new Set<CallSignalType>(["invite","ringing","answer","accept","reject","end","ice","ice-restart-request"]);
const maxSignalBytes=24_000;
const isRecord=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==="object"&&!Array.isArray(value);
function validDescription(value:unknown,type:"offer"|"answer"){
  return isRecord(value)&&value.type===type&&typeof value.sdp==="string"&&value.sdp.length>0&&value.sdp.length<=18_000
    &&Object.keys(value).every(key=>key==="type"||key==="sdp");
}
function validCandidate(value:unknown){
  return isRecord(value)&&typeof value.candidate==="string"&&value.candidate.length<=4096
    &&(value.sdpMid===undefined||value.sdpMid===null||typeof value.sdpMid==="string"&&value.sdpMid.length<=256)
    &&(value.sdpMLineIndex===undefined||value.sdpMLineIndex===null||Number.isInteger(value.sdpMLineIndex)&&Number(value.sdpMLineIndex)>=0&&Number(value.sdpMLineIndex)<=65535)
    &&(value.usernameFragment===undefined||value.usernameFragment===null||typeof value.usernameFragment==="string"&&value.usernameFragment.length<=256)
    &&Object.keys(value).every(key=>["candidate","sdpMid","sdpMLineIndex","usernameFragment"].includes(key));
}
function validCallSignal(value:unknown):value is CallSignal {
  if(!isRecord(value)||!uuidPattern.test(String(value.callId??""))||!uuidPattern.test(String(value.to??""))
    ||!uuidPattern.test(String(value.conversationId??""))||typeof value.type!=="string"||!callSignalTypes.has(value.type as CallSignalType)
    ||!isRecord(value.payload))return false;
  const payload=value.payload,keys=Object.keys(payload);
  if(JSON.stringify(payload).length>20_000)return false;
  switch(value.type as CallSignalType){
    case "invite":
      return payload.convoId===value.conversationId&&typeof payload.video==="boolean"
        &&(payload.retry===undefined||typeof payload.retry==="boolean")&&validDescription(payload.offer,"offer")
        &&keys.every(key=>["convoId","video","retry","offer"].includes(key));
    case "answer":
      return validDescription(payload.answer,"answer")&&keys.length===1&&keys[0]==="answer";
    case "ice":
      return validCandidate(payload.candidate)&&keys.length===1&&keys[0]==="candidate";
    case "reject":
      return typeof payload.reason==="string"&&payload.reason.length<=80&&keys.length===1&&keys[0]==="reason";
    case "end":
      return (payload.reason===undefined||typeof payload.reason==="string"&&payload.reason.length<=80)
        &&keys.every(key=>key==="reason");
    default:
      return keys.length===0;
  }
}
type OpenMicSignalKind="offer"|"answer"|"ice"|"moderation";
interface OpenMicSignal {roomId:string;to:string;kind:OpenMicSignalKind;payload:Record<string,unknown>}
function validOpenMicSignal(value:unknown):value is OpenMicSignal{
  if(!isRecord(value)||!uuidPattern.test(String(value.roomId??""))||!uuidPattern.test(String(value.to??""))
    ||typeof value.kind!=="string"||!["offer","answer","ice","moderation"].includes(value.kind)||!isRecord(value.payload))return false;
  const payload=value.payload,keys=Object.keys(payload);
  if(JSON.stringify(payload).length>20_000)return false;
  if(value.kind==="offer"||value.kind==="answer"){
    return validDescription(payload.description,value.kind)&&keys.length===1&&keys[0]==="description";
  }
  if(value.kind==="ice")return validCandidate(payload.candidate)&&keys.length===1&&keys[0]==="candidate";
  return ["mute","allow-mic","remove"].includes(String(payload.action))&&uuidPattern.test(String(payload.targetUserId??""))
    &&keys.length===2&&keys.includes("action")&&keys.includes("targetUserId");
}
export function parseOpenMicSignalMessage(raw:string|ArrayBuffer):OpenMicSignal|null{
  const text=typeof raw==="string"?raw:new TextDecoder().decode(raw);
  if(new TextEncoder().encode(text).byteLength>maxSignalBytes+512)return null;
  try{const envelope=JSON.parse(text) as {event?:unknown;data?:unknown};
    return envelope?.event==="open-mic:signal"&&validOpenMicSignal(envelope.data)?envelope.data:null;
  }catch{return null;}
}
export function parseCallSignalMessage(raw:string|ArrayBuffer):CallSignal|null{
  const text=typeof raw==="string"?raw:new TextDecoder().decode(raw);
  if(new TextEncoder().encode(text).byteLength>maxSignalBytes)return null;
  try{
    const envelope=JSON.parse(text) as {event?:unknown;data?:unknown};
    return envelope?.event==="call:signal"&&validCallSignal(envelope.data)?envelope.data:null;
  }catch{return null;}
}
async function validCallPair(db:Database,conversationId:string,from:string,to:string){
  if(from===to)return false;
  const members=await rows<{user_id:string}>(db,"SELECT user_id FROM chat_members WHERE conversation_id=? LIMIT 3",conversationId);
  return members.length===2&&members.some(member=>member.user_id===from)&&members.some(member=>member.user_id===to)
    &&!await blocked(db,from,to);
}
function sendCallError(socket:Socket,signal:CallSignal,message:string){
  try{socket.send(JSON.stringify({event:"call:signal",data:{
    callId:signal.callId,type:"transport-error",from:"server",to:"",conversationId:signal.conversationId,
    payload:{message:message.slice(0,160)},
  }}));}catch{}
}

// One object per account; voice/video media stays peer-to-peer and signaling is transient.
// Hibernation and automatic heartbeats keep idle connections from consuming CPU.
export class OldtimeRealtime {
  constructor(private state:ObjectState,private env:RealtimeEnv){
    state.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping","pong"));
  }
  async fetch(request:Request){
    if(request.method==="GET"&&request.headers.get("upgrade")?.toLowerCase()==="websocket"){
      const userId=request.headers.get("X-Oldtime-User"),hash=request.headers.get("X-Oldtime-Session");
      if(!userId||!hash||!/^[a-f0-9]{64}$/.test(hash))return json({error:"Unauthorized connection."},401);
      const active=await this.env.DB.prepare("SELECT id FROM sessions WHERE user_id=? AND token_hash=? AND expires_at>?").bind(userId,hash,Date.now()).first();
      if(!active)return json({error:"Your session expired."},401);
      if(this.state.getWebSockets().filter(s=>s.readyState===1).length>=12)return json({error:"Too many open connections. Close an unused Oldtime tab."},429);
      const pair=new WebSocketPair();this.state.acceptWebSocket(pair[1]);
      pair[1].serializeAttachment({sessionHash:hash,userId});
      return new Response(null,{status:101,webSocket:pair[0]} as ResponseInit&{webSocket:Socket});
    }
    if(request.method==="POST"&&new URL(request.url).pathname==="/call-relay")return this.relayCall(request);
    if(request.method==="POST"&&new URL(request.url).pathname==="/open-mic-relay")return this.relayOpenMic(request);
    if(request.method!=="POST"||new URL(request.url).pathname!=="/update")return json({error:"Method not allowed."},405);
    const sockets=this.state.getWebSockets();if(!sockets.length)return new Response(null,{status:204});
    const input=await request.json() as {userId:string;chatId?:string|null};
    const active=new Set((await rows<{token_hash:string}>(this.env.DB,"SELECT token_hash FROM sessions WHERE user_id=? AND expires_at>?",input.userId,Date.now())).map(s=>s.token_hash));
    for(const socket of sockets){
      if(socket.readyState!==1)continue;
      const attachment=socket.deserializeAttachment() as {sessionHash?:string}|null;
      try{
        if(!attachment?.sessionHash||!active.has(attachment.sessionHash)){
          socket.send(JSON.stringify({event:"session:expired"}));
          socket.close(1008,"Your session expired.");continue;
        }
        if(input.chatId!==undefined)socket.send(JSON.stringify({event:"chat:changed",data:{conversationId:input.chatId}}));
        socket.send(JSON.stringify({event:"notifications:changed"}));
      }catch{try{socket.close(1011,"Reconnect to receive updates.");}catch{}}
    }
    return new Response(null,{status:204});
  }
  private async relayCall(request:Request){
    const text=await request.text();
    if(new TextEncoder().encode(text).byteLength>maxSignalBytes+512)return json({error:"Invalid call signal."},400);
    let body:unknown;try{body=JSON.parse(text);}catch{return json({error:"Invalid call signal."},400);}
    if(!isRecord(body)||!validCallSignal(body.signal)||!uuidPattern.test(String(body.from??""))
      ||typeof body.fromSessionHash!=="string"||!/^[a-f0-9]{64}$/.test(body.fromSessionHash))return json({error:"Invalid call signal."},400);
    const signal=body.signal,from=body.from as string;
    const senderActive=await this.env.DB.prepare("SELECT 1 FROM sessions WHERE user_id=? AND token_hash=? AND expires_at>?")
      .bind(from,body.fromSessionHash,Date.now()).first();
    if(!senderActive||!await validCallPair(this.env.DB,signal.conversationId,from,signal.to))return json({error:"Call is no longer available."},403);
    for(const socket of this.state.getWebSockets()){
      if(socket.readyState!==1)continue;
      const attachment=socket.deserializeAttachment() as {sessionHash?:string;userId?:string}|null;
      if(attachment?.userId!==signal.to||!attachment.sessionHash)continue;
      const targetActive=await this.env.DB.prepare("SELECT 1 FROM sessions WHERE user_id=? AND token_hash=? AND expires_at>?")
        .bind(signal.to,attachment.sessionHash,Date.now()).first();
      if(!targetActive){
        try{socket.send(JSON.stringify({event:"session:expired"}));socket.close(1008,"Your session expired.");}catch{}
        continue;
      }
      try{socket.send(JSON.stringify({event:"call:signal",data:{
        ...signal,from,to:signal.to,convoId:signal.conversationId,
      }}));}catch{try{socket.close(1011,"Reconnect to receive updates.");}catch{}}
    }
    return new Response(null,{status:204});
  }
  async webSocketMessage(socket:Socket,message:string|ArrayBuffer){
    if(message==="ping")return;
    const openMicSignal=parseOpenMicSignalMessage(message);
    if(openMicSignal){await this.handleOpenMicSignal(socket,openMicSignal);return;}
    const signal=parseCallSignalMessage(message);
    if(!signal){socket.close(1008,"Invalid call signal.");return;}
    const attachment=socket.deserializeAttachment() as {
      sessionHash?:string;userId?:string;signalWindowStart?:number;signalCount?:number;
      inviteWindowStart?:number;inviteCount?:number;
    }|null;
    if(!attachment?.userId||!attachment.sessionHash){socket.close(1008,"Reconnect to call.");return;}
    const now=Date.now();
    const active=await this.env.DB.prepare("SELECT 1 FROM sessions WHERE user_id=? AND token_hash=? AND expires_at>?")
      .bind(attachment.userId,attachment.sessionHash,now).first();
    if(!active){
      try{socket.send(JSON.stringify({event:"session:expired"}));}catch{}
      socket.close(1008,"Your session expired.");return;
    }
    const windowStart=Number(attachment.signalWindowStart)||now;
    const signalCount=now-windowStart>10_000?1:(Number(attachment.signalCount)||0)+1;
    const nextWindowStart=now-windowStart>10_000?now:windowStart;
    if(signalCount>120){socket.close(1008,"Too many call signals.");return;}
    let inviteWindowStart=Number(attachment.inviteWindowStart)||now;
    let inviteCount=Number(attachment.inviteCount)||0;
    if(signal.type==="invite"&&!signal.payload.retry){
      if(now-inviteWindowStart>60_000){inviteWindowStart=now;inviteCount=0;}
      inviteCount++;
      if(inviteCount>5){socket.close(1008,"Too many call attempts.");return;}
    }
    socket.serializeAttachment({...attachment,signalWindowStart:nextWindowStart,signalCount,
      inviteWindowStart,inviteCount});
    if(!await validCallPair(this.env.DB,signal.conversationId,attachment.userId,signal.to)){
      sendCallError(socket,signal,"Calls are only available between chat members.");
      return;
    }
    const target=this.env.REALTIME.get(this.env.REALTIME.idFromName(signal.to));
    try{
      const response=await target.fetch(new Request("https://oldtime-realtime.internal/call-relay",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({signal,from:attachment.userId,fromSessionHash:attachment.sessionHash}),
      }));
      if(!response.ok)sendCallError(socket,signal,"Could not connect this call. Please try again.");
    }catch{sendCallError(socket,signal,"Could not connect this call. Please try again.");}
  }
  private async handleOpenMicSignal(socket:Socket,signal:OpenMicSignal){
    const attachment=socket.deserializeAttachment() as {sessionHash?:string;userId?:string;openMicWindowStart?:number;openMicSignalCount?:number}|null;
    if(!attachment?.userId||!attachment.sessionHash){socket.close(1008,"Reconnect to Open Mic.");return;}
    const now=Date.now(),sender=attachment.userId;
    const session=await this.env.DB.prepare("SELECT 1 FROM sessions WHERE user_id=? AND token_hash=? AND expires_at>?")
      .bind(sender,attachment.sessionHash,now).first();
    if(!session){socket.close(1008,"Your session expired.");return;}
    if(sender===signal.to)return;
    const room=await this.env.DB.prepare("SELECT owner_id,status,updated_at FROM open_mic_rooms WHERE id=?")
      .bind(signal.roomId).first<{owner_id:string;status:string;updated_at:number}>();
    if(!room||room.status!=="live"||room.updated_at<now-6*60*60*1000)return;
    const senderMember=await this.env.DB.prepare("SELECT 1 FROM open_mic_participants WHERE room_id=? AND user_id=? AND last_seen_at>?")
      .bind(signal.roomId,sender,now-90_000).first();
    if(!senderMember)return;
    const windowStart=Number(attachment.openMicWindowStart)||now;
    const count=now-windowStart>10_000?1:(Number(attachment.openMicSignalCount)||0)+1;
    if(count>300){socket.close(1008,"Too many Open Mic signals.");return;}
    socket.serializeAttachment({...attachment,openMicWindowStart:now-windowStart>10_000?now:windowStart,openMicSignalCount:count});
    const recipientMember=await this.env.DB.prepare("SELECT 1 FROM open_mic_participants WHERE room_id=? AND user_id=? AND last_seen_at>?")
      .bind(signal.roomId,signal.to,now-90_000).first();
    if(signal.kind==="moderation"){
      const action=String(signal.payload.action),targetId=String(signal.payload.targetUserId);
      if(room.owner_id!==sender)return;
      const targetMember=await this.env.DB.prepare("SELECT host_muted FROM open_mic_participants WHERE room_id=? AND user_id=?")
        .bind(signal.roomId,targetId).first<{host_muted:number}>();
      const targetBan=await this.env.DB.prepare("SELECT 1 FROM open_mic_room_bans WHERE room_id=? AND user_id=?")
        .bind(signal.roomId,targetId).first();
      if(action==="remove"&&!targetBan)return;
      if(action==="mute"&&(!targetMember||targetMember.host_muted!==1))return;
      if(action==="allow-mic"&&(!targetMember||targetMember.host_muted!==0))return;
      if(!recipientMember&&!(action==="remove"&&signal.to===targetId))return;
    }else{
      if(!recipientMember||await blocked(this.env.DB,sender,signal.to)||await blocked(this.env.DB,signal.to,sender))return;
    }
    const target=this.env.REALTIME.get(this.env.REALTIME.idFromName(signal.to));
    try{
      const response=await target.fetch(new Request("https://oldtime-realtime.internal/open-mic-relay",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({roomId:signal.roomId,from:sender,kind:signal.kind,payload:signal.payload}),
      }));
      if(!response.ok)try{socket.send(JSON.stringify({event:"open-mic:delivery-error",data:{roomId:signal.roomId,to:signal.to}}));}catch{}
    }catch{}
  }
  private async relayOpenMic(request:Request){
    const text=await request.text();
    if(new TextEncoder().encode(text).byteLength>maxSignalBytes+512)return json({error:"Invalid Open Mic signal."},400);
    let input:unknown;try{input=JSON.parse(text);}catch{return json({error:"Invalid Open Mic signal."},400);}
    if(!isRecord(input)||!uuidPattern.test(String(input.roomId??""))||!uuidPattern.test(String(input.from??""))
      ||typeof input.kind!=="string"||!["offer","answer","ice","moderation"].includes(input.kind)||!isRecord(input.payload))
      return json({error:"Invalid Open Mic signal."},400);
    const sockets=this.state.getWebSockets();
    const attachments=sockets.map(socket=>socket.deserializeAttachment() as {sessionHash?:string;userId?:string}|null);
    const targetUser=attachments.find(item=>item?.userId)?.userId||"";
    if(!targetUser)return json({error:"Room recipient is offline."},404);
    const now=Date.now(),sender=input.from as string,kind=input.kind as OpenMicSignalKind;
    const payload=input.payload as Record<string,unknown>;
    const room=await this.env.DB.prepare("SELECT owner_id,status,updated_at FROM open_mic_rooms WHERE id=?")
      .bind(input.roomId).first<{owner_id:string;status:string;updated_at:number}>();
    if(!room||room.status!=="live"||room.updated_at<now-6*60*60*1000)return json({error:"Room ended."},404);
    const senderMember=await this.env.DB.prepare("SELECT 1 FROM open_mic_participants WHERE room_id=? AND user_id=? AND last_seen_at>?")
      .bind(input.roomId,sender,now-90_000).first();
    if(!senderMember)return json({error:"Sender left the room."},403);
    const recipientMember=await this.env.DB.prepare("SELECT 1 FROM open_mic_participants WHERE room_id=? AND user_id=? AND last_seen_at>?")
      .bind(input.roomId,targetUser,now-90_000).first();
    if(kind==="moderation"){
      if(room.owner_id!==sender||!uuidPattern.test(String(payload.targetUserId??"")))return json({error:"Only the host can moderate."},403);
      const moderatedId=String(payload.targetUserId);
      if(payload.action==="remove"){
        const banned=await this.env.DB.prepare("SELECT 1 FROM open_mic_room_bans WHERE room_id=? AND user_id=?").bind(input.roomId,moderatedId).first();
        if(!banned||(!recipientMember&&targetUser!==moderatedId))return json({error:"Removal is not confirmed."},403);
      }else{
        const moderated=await this.env.DB.prepare("SELECT host_muted FROM open_mic_participants WHERE room_id=? AND user_id=?")
          .bind(input.roomId,moderatedId).first<{host_muted:number}>();
        if(!moderated||moderated.host_muted!==(payload.action==="mute"?1:0)||!recipientMember)
          return json({error:"Mute state changed."},403);
      }
    }else{
      if(!recipientMember||await blocked(this.env.DB,sender,targetUser)||await blocked(this.env.DB,targetUser,sender))
        return json({error:"Room membership changed."},403);
    }
    for(const socket of sockets){
      if(socket.readyState!==1)continue;
      const attachment=socket.deserializeAttachment() as {sessionHash?:string;userId?:string}|null;
      if(attachment?.userId!==targetUser||!attachment.sessionHash)continue;
      const active=await this.env.DB.prepare("SELECT 1 FROM sessions WHERE user_id=? AND token_hash=? AND expires_at>?")
        .bind(targetUser,attachment.sessionHash,now).first();
      if(!active){try{socket.close(1008,"Your session expired.");}catch{}continue;}
      try{socket.send(JSON.stringify({event:"open-mic:signal",data:{roomId:input.roomId,from:sender,kind,payload}}));}catch{}
    }
    return new Response(null,{status:204});
  }
  // Acknowledge peer close frames explicitly so the hibernating socket finishes
  // its close handshake instead of leaving the client stuck in CLOSING.
  webSocketClose(socket:Socket,code:number,reason:string){socket.close(code===1005?1000:code,reason.slice(0,100));}
  webSocketError(socket:Socket){socket.close(1011,"Reconnect to receive updates.");}
}
export async function notifyRealtime(request:Request,response:Response,env:RealtimeEnv){
  const path=new URL(request.url).pathname.replace(/^\/api(?=\/|$)/,"");
  if(!/^\/(chats(?:\/|$)|posts(?:\/|$)|relationships\/|stories(?:\/|$)|notifications(?:\/|$)|creator\/content(?:\/|$))/.test(path))return;
  // Clone only bodies needed for recipient selection, before the first await.
  // Consume that branch immediately; never tee large account/media responses.
  const details=(path==="/chats"||path==="/posts"||/\/comments$/.test(path)&&request.method==="POST")
    ?response.clone().json().catch(()=>({})):Promise.resolve({});
  const user=await env.DB.prepare("SELECT user_id FROM sessions WHERE token_hash=? AND expires_at>?").bind(sessionHash(request),Date.now()).first<{user_id:string}>();
  if(!user)return;
  const recipients=new Map<string,string|null|undefined>([[user.user_id,undefined]]);
  const chat=/^\/chats\/([^/]+)/.exec(path),post=/^\/posts\/([^/]+)/.exec(path),story=/^\/stories\/([^/]+)/.exec(path);
  if(path==="/chats"||chat){
    const input=path==="/chats"?await details as {chat?:{id?:string}}:null,id=chat?.[1]??input?.chat?.id;
    if(id){
      const peers=await rows<{user_id:string}>(env.DB,"SELECT user_id FROM chat_members WHERE conversation_id=? LIMIT 200",id);
      for(const peer of peers)if(!path.endsWith("/state")||peer.user_id===user.user_id)recipients.set(peer.user_id,id);
    }
  }else if(post){
    const owner=await env.DB.prepare("SELECT author_id,visibility FROM posts WHERE id=?").bind(post[1]).first<{author_id:string;visibility:string}>();
    if(owner)recipients.set(owner.author_id,undefined);
    if(/\/comments$/.test(path)&&request.method==="POST"){
      const comment=await details as {body?:string;parentId?:string};
      if(owner&&comment.body)for(const recipient of await mentionRecipients(env.DB,user.user_id,comment.body,owner.visibility,owner.author_id))recipients.set(recipient.id,undefined);
      if(comment.parentId){
        const parent=await env.DB.prepare("SELECT user_id FROM post_comments WHERE id=? AND post_id=?").bind(comment.parentId,post[1]).first<{user_id:string}>();
        if(parent)recipients.set(parent.user_id,undefined);
      }
    }
  }else if(story){
    const owner=await env.DB.prepare("SELECT author_id FROM stories WHERE id=?").bind(story[1]).first<{author_id:string}>();
    if(owner)recipients.set(owner.author_id,undefined);
  }else if(path==="/posts"&&request.method==="POST"){
    const input=await details as {post?:{text?:string;visibility?:string}};
    if(input.post?.text)for(const recipient of await mentionRecipients(env.DB,user.user_id,input.post.text,input.post.visibility??"close-friends"))recipients.set(recipient.id,undefined);
  }else{
    const relationship=/^\/relationships\/(?:follow|follow-requests|friend-requests|friends)\/([^/]+)/.exec(path);
    if(relationship)recipients.set(relationship[1],undefined);
  }
  await Promise.all([...recipients].slice(0,200).map(([id,chatId])=>dispatchRealtime(env,id,chatId)));
}
