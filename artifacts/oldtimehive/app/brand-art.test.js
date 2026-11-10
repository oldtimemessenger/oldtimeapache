import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {inflateSync} from "node:zlib";

test("the published opening artwork is committed as a valid JPEG",()=>{
  const image=readFileSync(new URL("../public/brand/oldtime-opening-red.jpeg",import.meta.url));
  assert.equal(image[0],0xff,"opening artwork has a JPEG signature");
  assert.equal(image[1],0xd8,"opening artwork has a JPEG signature");
  assert.ok(image.length>10_000,"opening artwork is a complete, non-empty image");
});

test("the entrance artwork is committed and the feather cutout retains transparency",()=>{
  const image=readFileSync(new URL("../public/brand/oldtime-entrance.jpeg",import.meta.url));
  assert.equal(image[0],0xff,"entrance artwork has a JPEG signature");
  assert.equal(image[1],0xd8,"entrance artwork has a JPEG signature");
  assert.ok(image.length>10_000,"entrance artwork is a complete, non-empty image");
  const index=readFileSync(new URL("../index.html",import.meta.url),"utf8");
  assert.match(index,/src="brand\/oldtime-feather\.png"/);
  const logo=readFileSync(new URL("../public/brand/oldtime-feather.png",import.meta.url));
  assert.equal(logo[25],6,"launch mark is an RGBA PNG");
  assert.ok(logo.readUInt32BE(16)<1152 && logo.readUInt32BE(20)<1712,"launch mark is cropped to the feather");
});

test("the login logo has real transparency instead of a blue rectangular background",()=>{
  const png=readFileSync(new URL("../public/brand/oldtime-login-red.png",import.meta.url));
  assert.equal(png.subarray(1,4).toString(),"PNG");
  assert.equal(png[25],6,"RGBA pixels");
  assert.equal(png[28],0,"non-interlaced PNG");
  const chunks=[];
  for(let offset=8;offset+12<=png.length;){
    const length=png.readUInt32BE(offset);
    if(png.subarray(offset+4,offset+8).toString()==="IDAT") chunks.push(png.subarray(offset+8,offset+8+length));
    offset+=length+12;
  }
  // For the first pixel, all PNG filter predictors are zero.
  assert.equal(inflateSync(Buffer.concat(chunks))[4],0,"top-left background is fully transparent");
});

test("the transparent feather stays in branding and the app icon, not the Home header",()=>{
  const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
  const icon=readFileSync(new URL("../public/brand/oldtime-app-icon.png",import.meta.url));
  const svg=readFileSync(new URL("../app-icon.svg",import.meta.url),"utf8");
  const manifest=JSON.parse(readFileSync(new URL("../manifest.json",import.meta.url),"utf8"));
  assert.match(app,/brand\/oldtime-feather\.png/);
  assert.doesNotMatch(app,/class="home-brand-mark"|class="home-brand-lockup"/);
  assert.equal(icon[25],6,"app icon keeps its transparent RGBA background");
  assert.equal(icon.readUInt32BE(16),512);
  assert.match(svg,/brand\/oldtime-app-icon\.png/);
  assert.equal(manifest.theme_color,"#1456d9");
  assert.equal(manifest.icons[1].purpose,"any");
});
