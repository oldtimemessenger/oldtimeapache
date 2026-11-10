import { api, requestCloudApi } from "./store.js";

const SDK_URL="https://cdn.jsdelivr.net/npm/livekit-client@2.23.0/dist/livekit-client.umd.min.js";
let sdkPromise=null, active=null;
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const roomPath=id=>`/api/open-mic/rooms/${encodeURIComponent(id)}`;
function sdk(){
  if(window.LivekitClient)return Promise.resolve(window.LivekitClient);
  if(sdkPromise)return sdkPromise;
  sdkPromise=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-open-mic-sdk]');
    const script=existing||document.createElement("script");
    const fail=()=>{sdkPromise=null;reject(new Error("Open Mic audio could not load. Check your connection and try again."));};
    script.addEventListener("load",()=>window.LivekitClient?resolve(window.LivekitClient):fail(),{once:true});
    script.addEventListener("error",fail,{once:true});
    if(!existing){script.src=SDK_URL;script.async=true;script.crossOrigin="anonymous";script.referrerPolicy="no-referrer";script.dataset.openMicSdk="true";document.head.append(script);}
  });
  return sdkPromise;
}
function button(label,action,icon,extra=""){
  return `<button type="button" class="om-button ${extra}" data-om-action="${action}" aria-label="${esc(label)}"><span class="om-button-icon" aria-hidden="true">${icon}</span><span>${esc(label)}</span></button>`;
}
const micIcon='<svg viewBox="0 0 24 24"><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5m-4 0h8"/></svg>';
const speakerIcon='<svg viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6m2.5-9a9 9 0 0 1 0 12"/></svg>';
const closeIcon='<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const shareIcon='<svg viewBox="0 0 24 24"><path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/></svg>';
const moreIcon='<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>';
function avatar(person){
  const initials=String(person?.name||person?.username||"O").trim().split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase();
  return `<span class="om-avatar" aria-hidden="true">${esc(initials||"O")}</span>`;
}
function disposeTimers(state){
  clearInterval(state.heartbeat);clearInterval(state.poll);
  state.heartbeat=null;state.poll=null;
}
function removeOverlay(state){
  disposeTimers(state);
  if(state.room){void state.room.disconnect();state.room=null;}
  state.root?.remove();
  if(active===state)active=null;
}
function createOverlay(){
  const root=document.createElement("div");
  root.className="open-mic-overlay";
  root.id="open-mic-overlay";
  root.innerHTML=`<section class="om-shell" role="dialog" aria-modal="true" aria-label="Open Mic">
    <header class="om-topbar"><div class="om-brand"><span class="om-brand-mark">${micIcon}</span><span><b>Open Mic</b><small>Live conversations, together</small></span></div>
      <button class="om-close" type="button" data-om-action="close" aria-label="Close Open Mic">${closeIcon}</button></header>
    <main class="om-content" id="om-content"><div class="om-loading"><span class="om-pulse"></span><b>Finding live rooms</b><small>Connecting to the Old Time stage…</small></div></main>
    <div class="om-audio-dock" id="om-audio-dock" aria-hidden="true"></div>
  </section>`;
  document.body.append(root);
  return root;
}
async function loadLobby(state){
  state.view="lobby";state.busy=false;
  state.root.querySelector("#om-content").innerHTML='<div class="om-loading"><span class="om-pulse"></span><b>Finding live rooms</b><small>One moment…</small></div>';
  try{
    const data=await requestCloudApi("/api/open-mic/rooms");
    if(active!==state)return;
    state.audioReady=!!data.audioReady;state.rooms=Array.isArray(data.rooms)?data.rooms:[];
    renderLobby(state);
  }catch(error){if(active===state)renderLobby(state,error.message||"Live rooms could not load.");}
}
function renderLobby(state,error=""){
  const rooms=state.rooms||[];
  state.root.querySelector("#om-content").innerHTML=`
    <section class="om-lobby-intro"><span class="om-eyebrow"><i></i> OLD TIME AUDIO</span><h1>Make room for<br/><em>the conversation.</em></h1>
      <p>Drop into a live room, listen in, or take the mic. No hand-raising. Just join the conversation.</p>
      <button class="om-create-trigger" type="button" data-om-action="show-create">${micIcon}<span><b>Start a room</b><small>Bring people together</small></span><span class="om-arrow">↗</span></button>
    </section>
    <section class="om-room-section"><div class="om-section-head"><div><span class="om-eyebrow">HAPPENING NOW</span><h2>Live rooms</h2></div><button type="button" class="om-refresh" data-om-action="refresh">Refresh</button></div>
      ${error?`<p class="om-error" role="alert">${esc(error)}</p>`:rooms.length?'<div class="om-room-list">'+rooms.map(room=>`<article class="om-room-card"><div class="om-room-card-top"><span class="om-live-pill"><i></i> LIVE</span><span class="om-listener-count">${Number(room.participantCount)||0} listening</span></div><h3>${esc(room.title)}</h3><p>${esc(room.topic||"Open conversation")}</p><div class="om-room-footer"><span class="om-host-line">${avatar(room.host)}<span><b>${esc(room.host?.name||"Old Time host")}</b><small>HOST</small></span></span><button type="button" class="om-join" data-om-action="join" data-room-id="${esc(room.id)}">Join room <span>↗</span></button></div></article>`).join("")+'</div>':'<div class="om-empty"><span class="om-empty-mark">'+micIcon+'</span><b>It's quiet in here.</b><p>Start the first room and bring your people together.</p></div>'}
    </section>
    ${!state.audioReady?'<p class="om-config-note">The Open Mic audio server is not connected yet. Room discovery is ready; live audio will unlock when the self-hosted audio service is configured.</p>':""}
    ${error?"":""}`;
}
function renderCreate(state){
  state.view="create";
  state.root.querySelector("#om-content").innerHTML=`<section class="om-create-page"><button class="om-back" type="button" data-om-action="back">← Back to rooms</button>
    <span class="om-eyebrow">HOST A CONVERSATION</span><h1>Start your<br/><em>Open Mic.</em></h1>
    <p class="om-muted">Give the room a name people can find. Everyone who joins can speak or listen immediately.</p>
    <form class="om-create-form" id="om-create-form"><label>Room title<input name="title" maxlength="80" minlength="3" required placeholder="What are we talking about?" /></label>
      <label>Topic <span>Optional</span><input name="topic" maxlength="140" placeholder="Music, culture, sports, anything…" /></label>
      <label>Room discovery<select name="visibility"><option value="public">Public — anyone can find it</option><option value="unlisted">Unlisted — join with the link</option></select></label>
      <button class="om-primary" type="submit" ${state.audioReady?"":"disabled"}>Start room <span>↗</span></button>
      ${state.audioReady?"":'<small class="om-config-note">Live audio is waiting for the server setup. You can return when it is ready.</small>'}
      <p class="om-form-error" id="om-form-error" role="alert"></p></form></section>`;
}
function renderRoom(state){
  const room=state.roomInfo||{},people=state.participants||[],me=api.me(),activeIds=state.activeSpeakers||new Set();
  const local=people.find(person=>person.id===me?.id);
  const host=state.role==="host";
  const activePeople=people.filter(person=>activeIds.has(person.id));
  const listeners=people.filter(person=>!activeIds.has(person.id));
  state.view="room";
  state.root.querySelector("#om-content").innerHTML=`
    <section class="om-live-room">
      <div class="om-live-heading"><button class="om-back" type="button" data-om-action="back">← Rooms</button><span class="om-live-pill"><i></i> LIVE NOW</span><button class="om-icon-action" type="button" data-om-action="share" aria-label="Share room">${shareIcon}</button></div>
      <div class="om-room-title"><span class="om-eyebrow">${host?"YOUR ROOM":"YOU'RE IN THE ROOM"}</span><h1>${esc(room.title||"Open Mic")}</h1><p>${esc(room.topic||"Open conversation")}</p></div>
      <div class="om-stage"><div class="om-stage-top"><span>ON THE MIC</span><span>${activePeople.length} speaking</span></div>
        <div class="om-stage-people">${(activePeople.length?activePeople:people.filter(person=>person.role==="host")).slice(0,8).map(person=>`<div class="om-stage-person ${activeIds.has(person.id)?"is-speaking":""}">${avatar(person)}<b>${esc(person.name)}</b><small>${person.role==="host"?"HOST":activeIds.has(person.id)?"SPEAKING":"ON STAGE"}</small></div>`).join("")||'<p class="om-stage-empty">Your voice can start the conversation.</p>'}</div>
      </div>
      <div class="om-audience-head"><div><span class="om-eyebrow">IN THE ROOM</span><h2>${people.length} people here</h2></div><span class="om-audience-note">Everyone can speak</span></div>
      <div class="om-people-list">${people.map(person=>`<div class="om-person-row"><span class="om-person-avatar ${activeIds.has(person.id)?"is-speaking":""}">${avatar(person)}</span><span class="om-person-copy"><b>${esc(person.name)}</b><small>${person.role==="host"?"HOST":activeIds.has(person.id)?"ON MIC":"LISTENING"}</small></span>${person.id===me?.id?'<span class="om-you-tag">YOU</span>':host&&person.role!=="host"?`<div class="om-person-actions"><button type="button" data-om-action="${person.hostMuted?"allow-mic":"mute"}" data-user-id="${esc(person.id)}">${person.hostMuted?"Allow mic":"Mute"}</button><button type="button" data-om-action="remove" data-user-id="${esc(person.id)}" aria-label="Remove ${esc(person.name)}">×</button></div>`:""}</div>`).join("")}</div>
      <footer class="om-control-dock">
        <div class="om-mic-status"><span class="om-status-dot ${state.micOn?"is-on":""}"></span><span>${local?.hostMuted?"The host muted your mic":state.micOn?"Your mic is live":"You're listening"}</span></div>
        <div class="om-controls">${button(state.micOn?"Mute":"Unmute","mic",micIcon,`om-mic-button ${state.micOn?"is-on":""}`)}
          ${button("Audio output","audio",speakerIcon,"om-secondary-button")}
          ${button(host?"End room":"Leave room",host?"end":"leave",closeIcon,"om-leave-button")}</div>
      </footer>
    </section>`;
}
async function connect(state,payload){
  const LK=await sdk();
  if(active!==state)return;
  if(!LK?.Room||!LK?.RoomEvent)throw new Error("The Open Mic audio engine is unavailable in this browser.");
  const room=new LK.Room({adaptiveStream:true,dynacast:true});
  state.room=room;state.roomInfo=payload.room;state.role=payload.role||"listener";
  state.participants=payload.participants||[];state.micOn=false;
  const dock=state.root.querySelector("#om-audio-dock");
  const refresh=()=>{if(active===state&&state.view==="room")renderRoom(state);};
  room.on(LK.RoomEvent.TrackSubscribed,(track)=>{
    if(track.kind!==LK.Track.Kind.Audio)return;
    const element=track.attach();element.autoplay=true;element.playsInline=true;
    element.dataset.openMicAudio="true";dock.append(element);
    void element.play().catch(()=>{state.audioBlocked=true;});
  });
  room.on(LK.RoomEvent.TrackUnsubscribed,track=>track.detach().forEach(element=>element.remove()));
  room.on(LK.RoomEvent.ActiveSpeakersChanged,speakers=>{
    state.activeSpeakers=new Set(speakers.map(person=>person.identity));
    refresh();
  });
  room.on(LK.RoomEvent.ParticipantConnected,refresh);
  room.on(LK.RoomEvent.ParticipantDisconnected,refresh);
  room.on(LK.RoomEvent.Disconnected,()=>{
    if(active!==state||state.leaving)return;
    state.room=null;disposeTimers(state);
    renderLobby(state,"You were disconnected from the live room. Rejoin when you're ready.");
  });
  await room.connect(payload.serverUrl,payload.token);
  if(active!==state){await room.disconnect();return;}
  await room.localParticipant.setMicrophoneEnabled(false);
  state.connected=true;
  await refreshDetails(state);
  renderRoom(state);
  state.heartbeat=setInterval(()=>{void requestCloudApi(`${roomPath(state.roomInfo.id)}/heartbeat`,{method:"POST",body:{}}).catch(()=>{});},20_000);
  state.poll=setInterval(()=>{void refreshDetails(state);},8_000);
}
async function refreshDetails(state){
  if(active!==state||!state.roomInfo)return;
  try{
    const details=await requestCloudApi(roomPath(state.roomInfo.id));
    if(active!==state)return;
    state.roomInfo=details.room;state.participants=details.participants||[];
    if(details.room.status!=="live")throw new Error("The host ended this room.");
    if(state.view==="room")renderRoom(state);
  }catch(error){
    if(active!==state)return;
    if(error.message?.includes("ended")||error.message?.includes("unavailable")){
      state.leaving=true;disposeTimers(state);await state.room?.disconnect();state.room=null;
      renderLobby(state,"This room has ended.");
    }
  }
}
async function join(state,id){
  if(state.busy)return;state.busy=true;
  try{
    const payload=await requestCloudApi(`${roomPath(id)}/join`,{method:"POST",body:{}});
    if(active!==state)return;
    state.view="connecting";
    state.root.querySelector("#om-content").innerHTML='<div class="om-loading"><span class="om-pulse"></span><b>Joining the room</b><small>Preparing your audio…</small></div>';
    await connect(state,payload);
  }catch(error){state.busy=false;renderLobby(state,error.message||"Could not join this room.");}
}
async function create(state,form){
  if(state.busy)return;state.busy=true;
  const data=Object.fromEntries(new FormData(form).entries());
  try{
    const payload=await requestCloudApi("/api/open-mic/rooms",{method:"POST",body:data});
    if(active!==state)return;
    state.view="connecting";
    state.root.querySelector("#om-content").innerHTML='<div class="om-loading"><span class="om-pulse"></span><b>Opening your room</b><small>Getting the stage ready…</small></div>';
    await connect(state,payload);
  }catch(error){
    state.busy=false;
    const target=state.root.querySelector("#om-form-error");
    if(target)target.textContent=error.message||"The room could not be created.";
    else renderLobby(state,error.message||"The room could not be created.");
  }
}
async function moderate(state,targetUserId,action){
  try{await requestCloudApi(`${roomPath(state.roomInfo.id)}/moderate`,{method:"POST",body:{targetUserId,action}});await refreshDetails(state);}
  catch(error){renderRoom(state);state.root.querySelector(".om-form-error")?.replaceChildren(document.createTextNode(error.message||"Moderation failed."));}
}
async function leave(state,end=false){
  if(state.leaving)return;state.leaving=true;disposeTimers(state);
  const id=state.roomInfo?.id,room=state.room;
  try{
    if(end&&id)await requestCloudApi(roomPath(id),{method:"DELETE"});
    else if(id)await requestCloudApi(`${roomPath(id)}/leave`,{method:"POST",body:{}});
  }catch{}
  await room?.disconnect();state.room=null;state.connected=false;state.leaving=false;
  await loadLobby(state);
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
    if(action==="mic"){
      if(!state.room||state.localMutedByHost)return;
      try{await state.room.localParticipant.setMicrophoneEnabled(!state.micOn);state.micOn=!state.micOn;renderRoom(state);}
      catch(error){state.micError=error.message||"Microphone access was denied.";renderRoom(state);state.root.querySelector(".om-mic-status").textContent=state.micError;}
    }
    if(["mute","allow-mic","remove"].includes(action))await moderate(state,target.dataset.userId,action);
    if(action==="leave")await leave(state,false);
    if(action==="end"&&confirm("End this Open Mic room for everyone?"))await leave(state,true);
    if(action==="audio"){
      state.audioEnabled=true;
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
  if(active){active.root.focus?.();return active;}
  const root=createOverlay(),state={root,room:null,roomInfo:null,participants:[],activeSpeakers:new Set(),role:"listener",
    view:"lobby",busy:false,leaving:false,micOn:false,heartbeat:null,poll:null,rooms:[],audioReady:false};
  active=state;bind(state);
  if(!api.me())renderLobby(state,"Sign in to join or host an Open Mic room.");
  else if(roomId)void join(state,roomId);
  else void loadLobby(state);
  return state;
}
