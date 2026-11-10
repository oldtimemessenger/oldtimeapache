import { api, requestCloudApi } from "./store.js";
import { iceServers } from "./comms/config.js";
import { publishOpenMic, subscribeOpenMic, setCallTransportActive, waitForCallSignaling } from "./comms/signaling.js";

let active=null;
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const roomPath=id=>`/api/open-mic/rooms/${encodeURIComponent(id)}`;
const micIcon='<svg viewBox="0 0 24 24"><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5m-4 0h8"/></svg>';
const speakerIcon='<svg viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6m2.5-9a9 9 0 0 1 0 12"/></svg>';
const closeIcon='<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const shareIcon='<svg viewBox="0 0 24 24"><path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/></svg>';
function avatar(person){
  const initials=String(person?.name||person?.username||"O").trim().split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase();
  return `<span class="om-avatar" aria-hidden="true">${esc(initials||"O")}</span>`;
}
function button(label,action,icon,extra=""){
  return `<button type="button" class="om-button ${extra}" data-om-action="${action}" aria-label="${esc(label)}"><span class="om-button-icon" aria-hidden="true">${icon}</span><span>${esc(label)}</span></button>`;
}
function disposeTimers(state){
  clearInterval(state.heartbeat);clearInterval(state.poll);
  state.heartbeat=null;state.poll=null;
}
function closePeers(state){
  for(const peer of state.peers.values()){
    try{peer.pc.close();}catch{}
    peer.audio?.remove();
  }
  state.peers.clear();
}
function removeOverlay(state){
  disposeTimers(state);closePeers(state);
  state.unsubscribe?.();state.unsubscribe=null;
  setCallTransportActive(false);
  state.root?.remove();if(active===state)active=null;
}
function createOverlay(){
  const root=document.createElement("div");root.className="open-mic-overlay";root.id="open-mic-overlay";
  root.innerHTML=`<section class="om-shell" role="dialog" aria-modal="true" aria-label="Open Mic">
    <header class="om-topbar"><div class="om-brand"><span class="om-brand-mark">${micIcon}</span><span><b>Open Mic</b><small>Live conversations, together</small></span></div>
      <button class="om-close" type="button" data-om-action="close" aria-label="Close Open Mic">${closeIcon}</button></header>
    <main class="om-content" id="om-content"><div class="om-loading"><span class="om-pulse"></span><b>Finding live rooms</b><small>Connecting to the Old Time stage…</small></div></main>
    <div class="om-audio-dock" id="om-audio-dock" aria-hidden="true"></div>
  </section>`;
  document.body.append(root);return root;
}
async function loadLobby(state,error=""){
  if(active!==state)return;
  state.view="lobby";state.busy=false;
  state.root.querySelector("#om-content").innerHTML='<div class="om-loading"><span class="om-pulse"></span><b>Finding live rooms</b><small>One moment…</small></div>';
  try{
    const data=await requestCloudApi("/api/open-mic/rooms");
    if(active!==state)return;
    state.rooms=Array.isArray(data.rooms)?data.rooms:[];
    renderLobby(state,error);
  }catch(failure){if(active===state)renderLobby(state,failure.message||"Live rooms could not load.");}
}
function renderLobby(state,error=""){
  const rooms=state.rooms||[];
  state.root.querySelector("#om-content").innerHTML=`
    <section class="om-lobby-intro"><span class="om-eyebrow"><i></i> OLD TIME AUDIO</span><h1>Make room for<br/><em>the conversation.</em></h1>
      <p>Drop into a live room, listen in, or take the mic. No hand-raising. Just join the conversation.</p>
      <button class="om-create-trigger" type="button" data-om-action="show-create">${micIcon}<span><b>Start a room</b><small>Bring people together</small></span><span class="om-arrow">↗</span></button>
    </section>
    <section class="om-room-section"><div class="om-section-head"><div><span class="om-eyebrow">HAPPENING NOW</span><h2>Live rooms</h2></div><button type="button" class="om-refresh" data-om-action="refresh">Refresh</button></div>
      ${error?`<p class="om-error" role="alert">${esc(error)}</p>`:rooms.length?'<div class="om-room-list">'+rooms.map(room=>`<article class="om-room-card"><div class="om-room-card-top"><span class="om-live-pill"><i></i> LIVE</span><span class="om-listener-count">${Number(room.participantCount)||0} in room</span></div><h3>${esc(room.title)}</h3><p>${esc(room.topic||"Open conversation")}</p><div class="om-room-footer"><span class="om-host-line">${avatar(room.host)}<span><b>${esc(room.host?.name||"Old Time host")}</b><small>HOST</small></span></span><button type="button" class="om-join" data-om-action="join" data-room-id="${esc(room.id)}">Join room <span>↗</span></button></div></article>`).join("")+'</div>':'<div class="om-empty"><span class="om-empty-mark">'+micIcon+'</span><b>It’s quiet in here.</b><p>Start the first room and bring your people together.</p></div>'}
    </section><p class="om-config-note">Open Mic uses direct peer-to-peer audio. Rooms support up to eight people to keep live conversation responsive without a paid audio provider.</p>`;
}
function renderCreate(state){
  state.view="create";
  state.root.querySelector("#om-content").innerHTML=`<section class="om-create-page"><button class="om-back" type="button" data-om-action="back">← Back to rooms</button>
    <span class="om-eyebrow">HOST A CONVERSATION</span><h1>Start your<br/><em>Open Mic.</em></h1>
    <p class="om-muted">Give the room a name people can find. Everyone who joins can speak or listen immediately.</p>
    <form class="om-create-form" id="om-create-form"><label>Room title<input name="title" maxlength="80" minlength="3" required placeholder="What are we talking about?" /></label>
      <label>Topic <span>Optional</span><input name="topic" maxlength="140" placeholder="Music, culture, sports, anything…" /></label>
      <label>Room discovery<select name="visibility"><option value="public">Public — anyone can find it</option><option value="unlisted">Unlisted — join with the link</option></select></label>
      <button class="om-primary" type="submit">Start room <span>↗</span></button><p class="om-form-error" id="om-form-error" role="alert"></p></form></section>`;
}
function renderRoom(state){
  const room=state.roomInfo||{},people=state.participants||[],myId=api.cloudAccountId();
  const local=people.find(person=>person.id===myId);
  state.localMutedByHost=!!local?.hostMuted;
  if(state.localMutedByHost)state.micOn=false;
  const host=state.role==="host";
  state.view="room";
  state.root.querySelector("#om-content").innerHTML=`
    <section class="om-live-room">
      <div class="om-live-heading"><span class="om-back-label">LIVE ROOM</span><span class="om-live-pill"><i></i> LIVE NOW</span><button class="om-icon-action" type="button" data-om-action="share" aria-label="Share room">${shareIcon}</button></div>
      <div class="om-room-title"><span class="om-eyebrow">${host?"YOUR ROOM":"YOU'RE IN THE ROOM"}</span><h1>${esc(room.title||"Open Mic")}</h1><p>${esc(room.topic||"Open conversation")}</p></div>
      <div class="om-stage"><div class="om-stage-top"><span>IN THE CONVERSATION</span><span>${people.filter(person=>person.micOn).length} mics on</span></div>
        <div class="om-stage-people">${people.slice(0,8).map(person=>`<div class="om-stage-person ${person.micOn?"is-speaking":""}">${avatar(person)}<b>${esc(person.name)}</b><small>${person.role==="host"?"HOST":person.micOn?"MIC ON":"LISTENING"}</small></div>`).join("")||'<p class="om-stage-empty">Your voice can start the conversation.</p>'}</div>
      </div>
      <div class="om-audience-head"><div><span class="om-eyebrow">IN THE ROOM</span><h2>${people.length} people here</h2></div><span class="om-audience-note">Everyone can speak</span></div>
      <div class="om-people-list">${people.map(person=>`<div class="om-person-row"><span class="om-person-avatar ${person.micOn?"is-speaking":""}">${avatar(person)}</span><span class="om-person-copy"><b>${esc(person.name)}</b><small>${person.role==="host"?"HOST":person.micOn?"MIC ON":"LISTENING"}</small></span>${person.id===myId?'<span class="om-you-tag">YOU</span>':host&&person.role!=="host"?`<div class="om-person-actions"><button type="button" data-om-action="${person.hostMuted?"allow-mic":"mute"}" data-user-id="${esc(person.id)}">${person.hostMuted?"Allow mic":"Mute"}</button><button type="button" data-om-action="remove" data-user-id="${esc(person.id)}" aria-label="Remove ${esc(person.name)}">×</button></div>`:""}</div>`).join("")}</div>
      <p class="om-form-error" id="om-room-error" role="alert"></p>
      <footer class="om-control-dock"><div class="om-mic-status"><span class="om-status-dot ${state.micOn?"is-on":""}"></span><span>${local?.hostMuted?"The host muted your mic":state.micOn?"Your mic is live":"You're listening"}</span></div>
        <div class="om-controls">${button(state.micOn?"Mute":"Unmute","mic",micIcon,`om-mic-button ${state.micOn?"is-on":""}`)}${button("Enable audio","audio",speakerIcon,"om-secondary-button")}${button(host?"End room":"Leave room",host?"end":"leave",closeIcon,"om-leave-button")}</div>
      </footer>
    </section>`;
}
function sendSignal(state,to,kind,payload){
  const ok=publishOpenMic({roomId:state.roomInfo.id,to,kind,payload});
  if(!ok)throw new Error("Live signaling is reconnecting. Please try again.");
}
function attachPeer(state,person,initiator){
  if(active!==state||person.id===api.cloudAccountId()||state.peers.has(person.id))return state.peers.get(person.id);
  const pc=new RTCPeerConnection(iceServers());
  const transceiver=pc.addTransceiver("audio",{direction:"sendrecv"});
  const peer={id:person.id,pc,sender:transceiver.sender,pendingIce:[],audio:null,initiator};
  state.peers.set(person.id,peer);
  pc.onicecandidate=event=>{
    if(event.candidate&&active===state)try{sendSignal(state,person.id,"ice",{candidate:event.candidate.toJSON()});}catch{}
  };
  pc.ontrack=event=>{
    if(active!==state)return;
    const track=event.track;
    if(!peer.audio){
      const audio=document.createElement("audio");audio.autoplay=true;audio.playsInline=true;
      audio.dataset.openMicAudio="true";audio.dataset.peerId=person.id;
      state.root.querySelector("#om-audio-dock").append(audio);peer.audio=audio;
    }
    const stream=event.streams?.[0]||new MediaStream([track]);
    peer.audio.srcObject=stream;
    void peer.audio.play().catch(()=>{state.audioBlocked=true;});
  };
  pc.onconnectionstatechange=()=>{
    if(active!==state)return;
    if(pc.connectionState==="failed"||pc.connectionState==="closed"){
      peer.audio?.remove();state.peers.delete(person.id);
    }
    state.root.querySelector(".om-live-heading")?.classList.toggle("om-reconnecting",[...state.peers.values()].some(p=>p.pc.connectionState==="disconnected"));
  };
  if(state.localStream?.getAudioTracks()[0])void transceiver.sender.replaceTrack(state.micOn?state.localStream.getAudioTracks()[0]:null);
  if(initiator)void makeOffer(state,peer);
  return peer;
}
async function makeOffer(state,peer){
  try{
    const offer=await peer.pc.createOffer();await peer.pc.setLocalDescription(offer);
    if(active===state)sendSignal(state,peer.id,"offer",{description:peer.pc.localDescription.toJSON()});
  }catch(error){state.connectionError=error.message||"Could not connect a participant."; }
}
async function onSignal(state,signal){
  if(active!==state||!state.roomInfo||signal.roomId!==state.roomInfo.id)return;
  const from=signal.from;
  if(signal.kind==="moderation"){
    const action=signal.payload?.action;
    if(action==="remove"){state.leaving=true;await leave(state,false,true,"The host removed you from this room.");return;}
    if(action==="mute"){
      state.localMutedByHost=true;state.micOn=false;
      state.localStream?.getAudioTracks().forEach(track=>track.enabled=false);
      for(const peer of state.peers.values())await peer.sender.replaceTrack(null).catch(()=>{});
      renderRoom(state);return;
    }
    if(action==="allow-mic"){state.localMutedByHost=false;renderRoom(state);return;}
  }
  const person=state.participants.find(item=>item.id===from);
  if(!person)return;
  const peer=attachPeer(state,person,api.cloudAccountId()<from);
  if(!peer)return;
  try{
    if(signal.kind==="offer"){
      await peer.pc.setRemoteDescription(signal.payload.description);
      for(const candidate of peer.pendingIce.splice(0))await peer.pc.addIceCandidate(candidate).catch(()=>{});
      const answer=await peer.pc.createAnswer();await peer.pc.setLocalDescription(answer);
      sendSignal(state,from,"answer",{description:peer.pc.localDescription.toJSON()});
    }else if(signal.kind==="answer"){
      await peer.pc.setRemoteDescription(signal.payload.description);
      for(const candidate of peer.pendingIce.splice(0))await peer.pc.addIceCandidate(candidate).catch(()=>{});
    }else if(signal.kind==="ice"){
      const candidate=new RTCIceCandidate(signal.payload.candidate);
      if(peer.pc.remoteDescription)await peer.pc.addIceCandidate(candidate).catch(()=>{});
      else peer.pendingIce.push(candidate);
    }
  }catch(error){state.connectionError=error.message||"A participant could not connect.";}
}
function syncPeers(state){
  if(active!==state)return;
  const present=new Set(state.participants.map(person=>person.id));
  for(const [id,peer] of state.peers)if(!present.has(id)){peer.pc.close();peer.audio?.remove();state.peers.delete(id);}
  for(const person of state.participants){
    if(person.id===api.cloudAccountId()||state.peers.has(person.id))continue;
    attachPeer(state,person,api.cloudAccountId()<person.id);
  }
}
async function refreshDetails(state){
  if(active!==state||!state.roomInfo)return;
  try{
    const details=await requestCloudApi(roomPath(state.roomInfo.id));
    if(active!==state)return;
    state.roomInfo=details.room;state.participants=details.participants||[];
    const local=state.participants.find(person=>person.id===api.cloudAccountId());
    if(local?.hostMuted){state.localMutedByHost=true;state.micOn=false;state.localStream?.getAudioTracks().forEach(track=>track.enabled=false);await Promise.all([...state.peers.values()].map(peer=>peer.sender.replaceTrack(null).catch(()=>{})));}
    if(state.view==="room"){syncPeers(state);renderRoom(state);}
  }catch(error){
    if(active!==state)return;
    if(error.message?.includes("ended")||error.message?.includes("unavailable")||error.message?.includes("removed")){
      await leave(state,false,true,error.message?.includes("removed")?"The host removed you from this room.":"This room has ended.");
    }
  }
}
async function enterRoom(state,payload){
  state.roomInfo=payload.room;state.role=payload.role||"listener";
  state.participants=payload.participants||[];state.peers=new Map();state.micOn=false;state.localStream=null;
  setCallTransportActive(true);
  state.unsubscribe=subscribeOpenMic(signal=>void onSignal(state,signal));
  await waitForCallSignaling();
  if(active!==state)return;
  state.view="room";state.busy=false;
  syncPeers(state);renderRoom(state);
  state.heartbeat=setInterval(()=>{void requestCloudApi(`${roomPath(state.roomInfo.id)}/heartbeat`,{method:"POST",body:{micOn:state.micOn}}).catch(()=>{});},20_000);
  state.poll=setInterval(()=>{void refreshDetails(state);},8_000);
}
async function join(state,id){
  if(state.busy)return;state.busy=true;
  try{
    const payload=await requestCloudApi(`${roomPath(id)}/join`,{method:"POST",body:{}});
    if(active!==state)return;
    await enterRoom(state,payload);
  }catch(error){
    state.busy=false;disposeTimers(state);closePeers(state);state.unsubscribe?.();state.unsubscribe=null;setCallTransportActive(false);
    try{await requestCloudApi(`${roomPath(id)}/leave`,{method:"POST",body:{}});}catch{}
    state.roomInfo=null;state.participants=[];await loadLobby(state,error.message||"Could not join this room.");
  }
}
async function create(state,form){
  if(state.busy)return;state.busy=true;
  const data=Object.fromEntries(new FormData(form).entries());let payload=null;
  try{
    payload=await requestCloudApi("/api/open-mic/rooms",{method:"POST",body:data});
    if(active!==state)return;
    await enterRoom(state,payload);
  }catch(error){
    state.busy=false;disposeTimers(state);closePeers(state);state.unsubscribe?.();state.unsubscribe=null;setCallTransportActive(false);
    if(payload?.room?.id)try{await requestCloudApi(roomPath(payload.room.id),{method:"DELETE"});}catch{}
    state.roomInfo=null;state.participants=[];
    const target=state.root.querySelector("#om-form-error");
    if(target)target.textContent=error.message||"The room could not be created.";
    else await loadLobby(state,error.message||"The room could not be created.");
  }
}
async function toggleMic(state){
  if(!state.roomInfo||state.localMutedByHost)return;
  try{
    if(!state.micOn){
      if(!state.localStream){
        state.localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      }
      const track=state.localStream.getAudioTracks()[0];
      if(!track)throw new Error("Your microphone is unavailable.");
      track.enabled=true;
      await Promise.all([...state.peers.values()].map(peer=>peer.sender.replaceTrack(track)));
      state.micOn=true;
    }else{
      state.micOn=false;
      state.localStream?.getAudioTracks().forEach(track=>track.enabled=false);
      await Promise.all([...state.peers.values()].map(peer=>peer.sender.replaceTrack(null)));
    }
    renderRoom(state);
    void requestCloudApi(`${roomPath(state.roomInfo.id)}/heartbeat`,{method:"POST",body:{micOn:state.micOn}}).catch(()=>{});
  }catch(error){
    state.micOn=false;renderRoom(state);
    const notice=state.root.querySelector("#om-room-error");if(notice)notice.textContent=error.name==="NotAllowedError"?"Allow microphone access in your browser to speak.":error.message||"Microphone could not start.";
  }
}
async function moderate(state,targetUserId,action){
  try{
    await requestCloudApi(`${roomPath(state.roomInfo.id)}/moderate`,{method:"POST",body:{targetUserId,action}});
    sendSignal(state,targetUserId,"moderation",{action});
    await refreshDetails(state);
  }catch(error){
    const notice=state.root.querySelector("#om-room-error");if(notice)notice.textContent=error.message||"Moderation failed.";
  }
}
async function leave(state,end=false,skipRequest=false,message=""){
  if(state.leaving)return;state.leaving=true;disposeTimers(state);
  const id=state.roomInfo?.id;
  if(!skipRequest&&id)try{
    if(end)await requestCloudApi(roomPath(id),{method:"DELETE"});
    else await requestCloudApi(`${roomPath(id)}/leave`,{method:"POST",body:{}});
  }catch{}
  closePeers(state);state.unsubscribe?.();state.unsubscribe=null;
  state.localStream?.getTracks().forEach(track=>track.stop());state.localStream=null;
  setCallTransportActive(false);
  state.roomInfo=null;state.participants=[];state.micOn=false;state.role="listener";state.leaving=false;
  await loadLobby(state,message);
}
async function share(state){
  const url=new URL(location.href);url.searchParams.set("openMic",state.roomInfo.id);
  try{
    if(navigator.share)await navigator.share({title:state.roomInfo.title,text:"Join my Open Mic room on Old Time",url:url.href});
    else{await navigator.clipboard.writeText(url.href);state.root.querySelector(".om-live-heading")?.insertAdjacentHTML("beforeend",'<span class="om-copy-note">Link copied</span>');}
  }catch{}
}
function bind(state){
  state.root.addEventListener("click",async event=>{
    const target=event.target.closest("[data-om-action]");if(!target||state.busy)return;
    const action=target.dataset.omAction;
    if(action==="close"){if(state.roomInfo)await leave(state,state.role==="host");else removeOverlay(state);}
    if(action==="refresh")await loadLobby(state);
    if(action==="show-create")renderCreate(state);
    if(action==="back"){if(state.roomInfo)await leave(state,state.role==="host");else await loadLobby(state);}
    if(action==="join")await join(state,target.dataset.roomId);
    if(action==="share")await share(state);
    if(action==="mic")await toggleMic(state);
    if(["mute","allow-mic","remove"].includes(action))await moderate(state,target.dataset.userId,action);
    if(action==="leave")await leave(state,false);
    if(action==="end"&&confirm("End this Open Mic room for everyone?"))await leave(state,true);
    if(action==="audio"){
      state.root.querySelectorAll("[data-open-mic-audio]").forEach(element=>void element.play().catch(()=>{}));
      target.classList.toggle("is-on");
    }
  });
  state.root.addEventListener("submit",event=>{
    if(event.target.id!=="om-create-form")return;
    event.preventDefault();void create(state,event.target);
  });
}
export function openMic({roomId=""}={}){
  roomId=roomId||new URL(location.href).searchParams.get("openMic")||"";
  if(active){active.root.focus?.();return active;}
  const root=createOverlay(),state={root,roomInfo:null,participants:[],peers:new Map(),view:"lobby",busy:false,leaving:false,micOn:false,
    heartbeat:null,poll:null,rooms:[],role:"listener",localStream:null,unsubscribe:null};
  active=state;bind(state);
  if(!api.me()||api.authMode()!=="cloud")void loadLobby(state,"Sign in to an online Old Time account to join or host an Open Mic room.");
  else if(roomId)void join(state,roomId);
  else void loadLobby(state);
  return state;
}
