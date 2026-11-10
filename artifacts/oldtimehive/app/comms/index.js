import { api, mutate } from "../store.js";
import { icons as ic } from "../icons.js";
import {
  startCall, accept, decline, hangup, toggleMute, toggleCamera, flipCamera,
  toggleSpeaker, setMinimized, currentCall, onCallChange, onCallHistory,
  onCallEnded, installSignaling, duration,
} from "./calls.js";
import { openVoiceNote, closeVoiceNote, voiceBody, bindVoice } from "./voice-notes.js";
import { maintainSignalConnection } from "./signaling.js";

let ctxRef = { toast() {}, esc: value => String(value ?? "") };
let tick = null;
let postCallSummary = null;

export function mountComms(ctx) {
  ctxRef = ctx || ctxRef;
  installSignaling();
  onCallHistory((convoId, label) => {
    import("../chat.js").then(module => module.logCall(convoId, label));
  });
  onCallEnded(call => {
    postCallSummary = { ...call, phase: "rating", rating: 0, message: "" };
    draw();
  });
  onCallChange(draw);
  if (!tick) tick = setInterval(() => {
    maintainSignalConnection();
    if (currentCall()) draw();
  }, 1000);
  draw();
}

export function placeCall(ctx, convoId, video) {
  ctxRef = ctx || ctxRef;
  startCall(convoId, video).catch(error => ctxRef.toast(error.message || "Call failed"));
}

export { openVoiceNote, closeVoiceNote, voiceBody, bindVoice };

function draw() {
  let root = document.getElementById("ot-call");
  const call = currentCall();
  if (!call && !postCallSummary) { root?.remove(); return; }
  if (!root) {
    root = document.createElement("div");
    root.id = "ot-call";
    document.body.appendChild(root);
  }
  if (!call) {
    root.className = "ot-call ot-call-post";
    drawPostCall(root, postCallSummary);
    return;
  }
  postCallSummary = null;
  const peer = api.user(call.peer);
  const name = ctxRef.esc(peer?.name || "Contact");
  const avatar = ctxRef.esc(peer?.avatar || "");
  if (call.minimized) {
    root.className = "ot-call min";
    root.dataset.signature = `min:${call.id}:${call.phase}`;
    root.innerHTML = `<button id="ot-restore" type="button" aria-label="Return to call"><span class="ot-min-dot"></span><span>${name}</span><small>${call.phase === "connected" ? duration() : ctxRef.esc(callStatus(call.phase))}</small></button>`;
    root.querySelector("#ot-restore").onclick = () => setMinimized(false);
    attachStreams(root, call);
    return;
  }
  root.className = "ot-call";
  const signature = JSON.stringify([call.id, call.phase, call.video, call.muted, call.speaker, call.cameraOn, name, call.detail]);
  if (root.dataset.signature === signature && root.querySelector(".ot-call-active")) {
    const timer = root.querySelector("[data-call-duration]");
    if (timer) timer.textContent = call.phase === "connected" ? duration() : callStatus(call.phase);
    const detail = root.querySelector("[data-call-detail]");
    if (detail) detail.textContent = call.detail || "";
    attachStreams(root, call);
    return;
  }
  root.dataset.signature = signature;
  const status = callStatus(call.phase);
  root.innerHTML = `<section class="ot-card ot-call-active ${call.video ? "is-video" : "is-voice"}">
    <div class="ot-call-backdrop" aria-hidden="true"><img src="${avatar}" alt="" /></div>
    <header class="ot-call-top">
      <div class="ot-call-top-actions">
        <button id="ot-min" type="button" aria-label="Minimize call" title="Minimize">${ic.back}</button>
      </div>
    </header>
    <div class="ot-call-stage">
      <img class="ot-call-avatar" src="${avatar}" alt="" />
      <video id="ot-remote" autoplay playsinline></video>
      <div class="ot-call-shade"></div>
      <div class="ot-call-copy">
        <h2>${name}</h2>
        <p data-call-duration>${call.phase === "connected" ? duration() : ctxRef.esc(status)}</p>
        <small data-call-detail>${ctxRef.esc(call.detail || "")}</small>
        <button id="ot-audio-enable" class="ot-call-audio-enable" type="button" hidden>Tap to enable call audio</button>
      </div>
      <audio id="ot-remote-audio" autoplay playsinline aria-hidden="true"></audio>
      <div class="ot-self-view" id="ot-self-view" ${call.video ? "" : "hidden"}>
        <video id="ot-local" autoplay playsinline muted ${call.cameraOn ? "" : "hidden"}></video>
        <span class="ot-self-off" ${call.cameraOn ? "hidden" : ""}>Camera off</span>
        <span class="ot-self-label">YOU</span>
      </div>
    </div>
    <section class="ot-call-controls">
      <div class="ot-call-actions">
        ${call.phase === "incoming" ? `<button id="ot-no" class="ot-control ot-decline" type="button" aria-label="Decline call"><span>${ic.close}</span><small>Decline</small></button><button id="ot-yes" class="ot-control ot-accept" type="button" aria-label="Answer call"><span>${ic.phone}</span><small>Answer</small></button>` : `
          <button id="ot-mute" class="ot-control ${call.muted ? "is-selected" : ""}" type="button" aria-label="${call.muted ? "Unmute microphone" : "Mute microphone"}" aria-pressed="${call.muted}"><span>${call.muted ? ic.mute : ic.mic}</span><small>${call.muted ? "Unmute" : "Mute"}</small></button>
          <button id="ot-spk" class="ot-control ${call.speaker ? "is-selected" : ""}" type="button" aria-label="${call.speaker ? "Switch to earpiece" : "Switch to speaker"}" aria-pressed="${call.speaker}" title="${call.speaker ? "Speaker" : "Earpiece"}"><span>${call.speaker ? ic.volume : ic.mute}</span><small>${call.speaker ? "Speaker" : "Earpiece"}</small></button>
          ${call.video ? `<button id="ot-cam" class="ot-control ${call.cameraOn ? "" : "is-selected"}" type="button" aria-label="${call.cameraOn ? "Turn camera off" : "Turn camera on"}" aria-pressed="${call.cameraOn}"><span>${ic.videoCall}</span><small>${call.cameraOn ? "Camera" : "Video off"}</small></button><button id="ot-flip" class="ot-control" type="button" aria-label="Flip camera"><span>${ic.flip}</span><small>Flip</small></button>` : `<button id="ot-addcam" class="ot-control" type="button" aria-label="Turn video on"><span>${ic.videoCall}</span><small>Video</small></button>`}
          <button id="ot-end" class="ot-control ot-end-call" type="button" aria-label="End call"><span>${ic.phone}</span><small>${call.phase === "failed" ? "Close" : "End"}</small></button>`}
      </div>
      <p class="ot-call-privacy"><span></span>${call.phase === "incoming" ? "Only answer calls from people you know." : "Your conversation stays between you and your friend."}</p>
    </section>
  </section>`;
  root.querySelector("#ot-yes")?.addEventListener("click", accept);
  root.querySelector("#ot-no")?.addEventListener("click", decline);
  root.querySelector("#ot-mute")?.addEventListener("click", toggleMute);
  root.querySelector("#ot-spk")?.addEventListener("click", toggleSpeaker);
  root.querySelector("#ot-cam")?.addEventListener("click", toggleCamera);
  root.querySelector("#ot-flip")?.addEventListener("click", () => flipCamera());
  root.querySelector("#ot-addcam")?.addEventListener("click", () => import("./calls.js").then(module => module.addVideo()));
  root.querySelector("#ot-min")?.addEventListener("click", () => setMinimized(true));
  root.querySelector("#ot-end")?.addEventListener("click", hangup);
  attachStreams(root, call);
}

function callStatus(phase) {
  return ({
    incoming: "Incoming call",
    outgoing: "Calling…",
    ringing: "Calling…",
    connecting: "Connecting…",
    connected: "In conversation",
    failed: "Call failed",
  })[phase] || phase;
}

function attachStreams(root, call) {
  const remote = root.querySelector("#ot-remote");
  const remoteAudio = root.querySelector("#ot-remote-audio");
  const enableAudio = root.querySelector("#ot-audio-enable");
  const local = root.querySelector("#ot-local");
  if (remote && remote.srcObject !== call.remoteStream) remote.srcObject = call.remoteStream;
  if (remote) remote.muted = true;
  if (remoteAudio && remoteAudio.srcObject !== call.remoteStream) remoteAudio.srcObject = call.remoteStream;
  if (remoteAudio && call.phase !== "incoming" && call.remoteStream?.getAudioTracks().length) {
    remoteAudio.play().then(() => {
      if (enableAudio) enableAudio.hidden = true;
    }).catch(() => {
      if (enableAudio) enableAudio.hidden = false;
    });
  }
  if (enableAudio) enableAudio.onclick = () => {
    remoteAudio?.play().then(() => { enableAudio.hidden = true; }).catch(() => {});
  };
  if (local && call.localStream && local.srcObject !== call.localStream) local.srcObject = call.localStream;
  if (remote) {
    const hasVideo = call.remoteStream?.getVideoTracks().some(track => track.readyState === "live");
    remote.hidden = !hasVideo;
    const avatar = root.querySelector(".ot-call-avatar");
    if (avatar) avatar.hidden = !!hasVideo;
    root.querySelector(".ot-call-active")?.classList.toggle("has-remote-video", !!hasVideo);
  }
  if (local) {
    local.hidden = !call.cameraOn || !call.localStream?.getVideoTracks().some(track => track.readyState === "live");
    const off = root.querySelector(".ot-self-off");
    if (off) off.hidden = !local.hidden;
  }
  const selfView = root.querySelector(".ot-self-view");
  if (selfView) selfView.hidden = !call.video;
}

function drawPostCall(root, call) {
  if (!call) return;
  const signature = `post:${call.id}:${call.phase}`;
  if (root.dataset.signature === signature && root.querySelector(".ot-post-call")) return;
  root.dataset.signature = signature;
  const peer = api.user(call.peer);
  const name = ctxRef.esc(peer?.name || "your friend");
  const avatar = ctxRef.esc(peer?.avatar || "");
  if (call.phase === "thanks") {
    root.innerHTML = `<section class="ot-card ot-post-call ot-post-thanks">
      <div class="ot-post-brand">CALL ENDED</div>
      <div class="ot-thanks-mark">${ic.check}</div>
      <span class="ot-call-eyebrow">A MOMENT TOGETHER</span>
      <h2>Thanks for<br />showing up.</h2>
      <button type="button" id="ot-post-done" class="ot-post-primary">Done</button>
    </section>`;
    root.querySelector("#ot-post-done").onclick = dismissPostCall;
    return;
  }
  root.innerHTML = `<section class="ot-card ot-post-call">
    <div class="ot-post-brand">CALL ENDED · ${ctxRef.esc(call.duration || "0:00")}</div>
    <div class="ot-post-content">
      <div class="ot-post-avatar"><img src="${avatar}" alt="" /><span>${ic.check}</span></div>
      <span class="ot-call-eyebrow">A MOMENT TOGETHER</span>
      <h2>How was your<br />call with ${name}?</h2>
      <div class="ot-call-stars" role="radiogroup" aria-label="Rate your call">
        ${[1, 2, 3, 4, 5].map(value => `<button type="button" data-call-rating="${value}" role="radio" aria-checked="${call.rating === value}" aria-label="${value} star${value === 1 ? "" : "s"}" class="${call.rating >= value ? "on" : ""}">${ic.star}</button>`).join("")}
      </div>
      <label class="ot-call-note-label" for="ot-call-note">Leave a note <span>OPTIONAL</span></label>
      <textarea id="ot-call-note" maxlength="240" placeholder="Add a thought about this call…">${ctxRef.esc(call.message || "")}</textarea>
      <small class="ot-call-note-count">${(call.message || "").length}/240</small>
      <button type="button" id="ot-post-save" class="ot-post-primary" ${call.rating ? "" : "disabled"}>Save feedback ${ic.check}</button>
      <button type="button" id="ot-post-skip" class="ot-post-skip">Not now</button>
    </div>
  </section>`;
  root.querySelectorAll("[data-call-rating]").forEach(button => {
    button.onclick = () => {
      call.rating = Number(button.dataset.callRating);
      root.querySelectorAll("[data-call-rating]").forEach(star => {
        const active = Number(star.dataset.callRating) <= call.rating;
        star.classList.toggle("on", active);
        star.setAttribute("aria-checked", String(Number(star.dataset.callRating) === call.rating));
      });
      root.querySelector("#ot-post-save").disabled = !call.rating;
    };
  });
  const note = root.querySelector("#ot-call-note");
  note.oninput = () => {
    call.message = note.value;
    root.querySelector(".ot-call-note-count").textContent = `${note.value.length}/240`;
  };
  root.querySelector("#ot-post-save").onclick = () => {
    if (!call.rating) return;
    try {
      mutate(db => {
        db.callFeedback = Array.isArray(db.callFeedback) ? db.callFeedback : [];
        db.callFeedback.unshift({
          id: call.id, user: api.me()?.id || "", peer: call.peer, convoId: call.convoId,
          video: call.video, durationSeconds: call.seconds, rating: call.rating,
          message: String(call.message || "").trim().slice(0, 240), created: Date.now(),
        });
      });
      call.message = String(call.message || "").trim().slice(0, 240);
      call.phase = "thanks";
      draw();
    } catch (error) {
      ctxRef.toast(error.message || "Feedback could not be saved");
    }
  };
  root.querySelector("#ot-post-skip").onclick = dismissPostCall;
}

function dismissPostCall() {
  postCallSummary = null;
  draw();
}
