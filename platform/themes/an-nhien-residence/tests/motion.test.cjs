const test = require('node:test');
const assert = require('node:assert/strict');
const { progress, damp, chapter, motionModes, normalizePhone, validPhone, coverPoint } = require('../public/motion.js');

test('building anchors follow cover cropping and the image vertical alignment', () => {
  assert.deepEqual(coverPoint(1200, 800, 2400, 1600, .1, .5), {x:120, y:400});
  const wide = coverPoint(1600, 900, 2400, 1600, .1, .5);
  assert.equal(wide.x, 160);
  assert.ok(Math.abs(wide.y - 440) < 1e-8);
  const phone = coverPoint(390, 844, 2400, 1600, .1, .5);
  assert.ok(phone.x < 0, 'a cropped-out tower must not be moved onto another building');
  assert.equal(phone.y, 422);
  const mobileVilla = coverPoint(320, 844, 2400, 1600, .666, .66, .62);
  assert.ok(mobileVilla.x > 24 && mobileVilla.x < 296, 'mobile framing keeps the villa anchor visible');
});

test('short laptop windows keep chapters animated; small screens keep vertical motion', () => {
  assert.deepEqual(motionModes(1280, 650, false, false), {enabled:true, page:true, living:true, horizontal:true});
  assert.deepEqual(motionModes(1366, 600, false, false), {enabled:true, page:false, living:true, horizontal:false});
  assert.deepEqual(motionModes(390, 650, false, false), {enabled:true, page:true, living:false, horizontal:false});
  assert.equal(motionModes(320, 500, false, false).enabled, true);
});
test('pause and reduced motion disable every chapter animation', () => {
  const off = {enabled:false, page:false, living:false, horizontal:false};
  assert.deepEqual(motionModes(1440, 900, true, false), off);
  assert.deepEqual(motionModes(1440, 900, false, true), off);
});

test('scroll progress is bounded and reversible', () => {
  assert.equal(progress(-100, 0, 500), 0);
  assert.equal(progress(900, 0, 500), 1);
  assert.equal(progress(250, 0, 500), 0.5);
  assert.equal(progress(250, 0, 0), 0);
});
test('time-based smoothing agrees at 60 and 120 updates per second', () => {
  let a = 0, b = 0;
  for (let i = 0; i < 60; i++) a = damp(a, 1, 12, 1 / 60);
  for (let i = 0; i < 120; i++) b = damp(b, 1, 12, 1 / 120);
  assert.ok(Math.abs(a - b) < 1e-10);
});
test('three editorial chapters have stable holds and bounded indices', () => {
  assert.equal(chapter(0), 0);
  assert.equal(chapter(0.2), 0);
  assert.equal(chapter(0.5), 1);
  assert.equal(chapter(0.85), 2);
  assert.equal(chapter(1), 2);
});
test('Vietnamese phone validation accepts formatting and refuses incomplete numbers', () => {
  assert.equal(normalizePhone('+84 912 345 678'), '0912345678');
  assert.ok(validPhone('0912 345 678'));
  assert.ok(validPhone('+84 912 345 678'));
  assert.ok(!validPhone('1234'));
  assert.ok(!validPhone('09123456789'));
});
