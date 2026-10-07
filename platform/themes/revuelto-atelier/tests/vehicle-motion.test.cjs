const test = require('node:test');
const assert = require('node:assert/strict');
const { vehiclePose, chapterMotion } = require('../public/motion.js');

test('camera travels from exterior through windshield into cabin continuously', () => {
  const opening = vehiclePose('hero', 0);
  const cabin = vehiclePose('hero', 1);
  assert.ok(opening.camera[2] > 6);
  assert.ok(cabin.camera[2] < 0.9);
  assert.ok(cabin.camera[1] > 0.8 && cabin.camera[1] < 1.2);
  let last = opening;
  for (let i = 1; i <= 1000; i++) {
    const pose = vehiclePose('hero', i / 1000);
    assert.ok(Math.hypot(...pose.camera.map((v, j) => v - last.camera[j])) < 0.1);
    last = pose;
  }
});

test('exploded view assembles at both ends and holds separated components in the middle', () => {
  assert.equal(vehiclePose('explode', 0).explode, 0);
  assert.equal(vehiclePose('explode', 1).explode, 0);
  assert.equal(vehiclePose('explode', 0.55).explode, 1);
  for (const progress of [0.48, 0.55, 0.65, 0.72])
    assert.equal(vehiclePose('explode', progress).explode, 1);
  assert.ok(vehiclePose('explode', 0.9).explode < 0.3);
});

test('chapter wipe reveals each next image while retaining the outgoing image behind it', () => {
  const mid = chapterMotion(0.33);
  assert.equal(mid[0].reveal, 1);
  assert.ok(mid[1].reveal > 0 && mid[1].reveal < 1);
  assert.equal(mid[2].reveal, 0);
  assert.equal(chapterMotion(1)[2].reveal, 1);
});

test('chapter copy changes sequentially so paragraphs never overlap', () => {
  for (let i = 0; i <= 1000; i++) {
    const chapters = chapterMotion(i / 1000);
    assert.ok(chapters.filter(chapter => chapter.text > 0).length <= 1);
  }
  assert.equal(chapterMotion(0.5)[1].text, 1);
  assert.equal(chapterMotion(0.9)[2].text, 1);
});
