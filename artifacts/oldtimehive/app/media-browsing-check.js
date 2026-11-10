import assert from "node:assert/strict";

export async function verifyMediaBrowsingControls(page) {
  await page.locator('.nav [data-tab="communities"]').click();
  await page.locator(".community-screen .stories-feed-scroll").waitFor({state:"visible"});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.evaluate(async()=>{
    const stage=document.createElement("div");
    stage.style.cssText="position:fixed;left:-20px;top:-20px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
    const video=document.createElement("video");
    video.muted=true;video.playsInline=true;video.style.cssText="width:1px;height:1px";
    stage.append(video);
    document.body.append(stage);
    const canvas=document.createElement("canvas");
    canvas.width=160;canvas.height=90;
    const context=canvas.getContext("2d");
    const draw=()=>{context.fillStyle="#a92536";context.fillRect(0,0,160,90);context.fillStyle="#fff";context.fillText(String(Date.now()),8,40);};
    draw();
    const timer=setInterval(draw,60);
    const stream=canvas.captureStream(15);
    video.srcObject=stream;
    window.floatCheck={video,stream,timer,before:0};
    await video.play();
    await new Promise(resolve=>setTimeout(resolve,300));
    const before=video.currentTime;
    const card=document.createElement("article");
    card.className="community-post-card";
    card.innerHTML='<div class="community-post-media"><button type="button" class="community-post-media-item" data-stories-post="float-check"><video muted playsinline style="width:100%;height:240px"></video></button><button type="button" class="clip-float-control" data-video-float="float-check" aria-label="Continue video in a floating player">Float</button></div>';
    card.querySelector("video").replaceWith(video);
    window.floatCheck.before=before;
    document.querySelector(".stories-feed-scroll").append(card);
    card.querySelector("[data-video-float]").click();
    stage.remove();
  });
  const player=page.locator('[data-testid="floating-video-player"]');
  await player.waitFor({state:"visible"});
  assert.equal(await page.evaluate(()=>document.querySelector(".ot-video-float video")===window.floatCheck.video),true);
  await page.waitForFunction(()=>window.floatCheck.video.currentTime>window.floatCheck.before+.2);
  await page.evaluate(()=>{
    const card=document.createElement("article");
    card.className="community-post-card";
    card.dataset.id="photo-no-float";
    card.innerHTML='<div class="community-post-media"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="><button type="button" class="clip-float-control" data-video-float="photo-no-float">Float</button></div>';
    document.querySelector(".stories-feed-scroll").append(card);
  });
  await page.locator('[data-video-float="photo-no-float"]').click();
  assert.equal(await page.locator('[data-testid="floating-video-player"]').count(),1,
    "image content cannot create or replace the floating video player");
  assert.equal(await page.evaluate(()=>document.querySelector(".ot-video-float video")===window.floatCheck.video),true);
  await page.locator('.community-post-card[data-id="photo-no-float"]').evaluate(node=>node.remove());
  assert.equal(await player.locator("video[controls]").count(),0,"the mini-player uses one pause control instead of duplicate native controls");
  const ratio=await page.evaluate(()=>{
    const video=window.floatCheck.video;
    const bounds=document.querySelector(".ot-video-float").getBoundingClientRect();
    return {player:bounds.width/bounds.height,source:video.videoWidth/video.videoHeight};
  });
  assert.ok(Math.abs(ratio.player-ratio.source)<.06,
    "the mini-player preserves the video's source aspect ratio");
  const positionBefore=await player.boundingBox();
  const dragHandle=await page.locator("[data-video-drag]").boundingBox();
  await page.mouse.move(dragHandle.x+dragHandle.width/2,dragHandle.y+dragHandle.height/2);
  await page.mouse.down();
  await page.mouse.move(dragHandle.x+dragHandle.width/2-42,dragHandle.y+dragHandle.height/2+36,{steps:5});
  await page.mouse.up();
  const positionAfter=await player.boundingBox();
  assert.ok(Math.abs(positionAfter.x-positionBefore.x)>20 || Math.abs(positionAfter.y-positionBefore.y)>20,
    "the floating video can be dragged to another place on the screen");
  await page.locator("[data-video-play]").click();
  await page.waitForFunction(()=>window.floatCheck.video.paused);
  assert.equal(await page.locator("[data-video-play]").getAttribute("aria-label"),"Play video");
  await page.locator("[data-video-play]").click();
  await page.waitForFunction(()=>!window.floatCheck.video.paused);
  await page.locator("[data-video-expand]").click();
  assert.match(await player.getAttribute("class"),/is-expanded/);
  const expanded=await player.evaluate(element=>{
    const rect=element.getBoundingClientRect();
    return {left:rect.left,top:rect.top,width:rect.width,height:rect.height,
      viewportWidth:window.innerWidth,viewportHeight:window.innerHeight,
      objectFit:getComputedStyle(element.querySelector("video")).objectFit};
  });
  assert.ok(expanded.left<=1 && expanded.top<=1
    && expanded.width>=expanded.viewportWidth-1 && expanded.height>=expanded.viewportHeight-1,
    "Expand restores the video over the full screen");
  assert.equal(expanded.objectFit,"contain","full-screen playback keeps the complete video visible without cropping");
  await page.locator("[data-video-expand]").click();
  await page.locator('.nav [data-tab="updates"]').click();
  await page.waitForFunction(()=>!document.querySelector(".community-screen"));
  assert.equal(await player.count(),1);
  assert.equal(await page.evaluate(()=>window.floatCheck.video.isConnected&&!window.floatCheck.video.paused),true);
  await page.screenshot({path:"/tmp/oldtime-floating-video-verified.png"});
  await page.locator("[data-video-close]").click();
  await player.waitFor({state:"detached"});
  assert.equal(await page.evaluate(()=>window.floatCheck.video.paused&&!window.floatCheck.video.isConnected),true);
  await page.evaluate(()=>{
    window.floatCheck.stream.getTracks().forEach(track=>track.stop());
    clearInterval(window.floatCheck.timer);
  });
}
