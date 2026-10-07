const {test} = require('node:test');
const assert = require('node:assert/strict');
const {orbitPose, rotateOrbit, orbitZoom} = require('../public/motion.js');

test('a complete 360 degree drag returns to the same camera position', () => {
  const start = {yaw:.7, pitch:.25, zoom:1};
  const rotated = rotateOrbit(start, 800, 0, 800);
  const a = orbitPose(start, 1.6), b = orbitPose(rotated, 1.6);
  a.camera.forEach((value, i) => assert.ok(Math.abs(value - b.camera[i]) < 1e-8));
  assert.ok(rotated.yaw >= 0 && rotated.yaw < Math.PI * 2);
});
test('rotation allows every side and keeps the camera above the floor', () => {
  const start = {yaw:0, pitch:.2, zoom:1};
  const side = orbitPose(rotateOrbit(start, -200, 0, 800), 1.6);
  assert.ok(side.camera[0] > 0);
  assert.ok(Math.abs(side.camera[2]) < 1e-8);
  assert.ok(rotateOrbit(start, 0, -10000, 800).pitch >= .08);
  assert.ok(rotateOrbit(start, 0, 10000, 800).pitch <= 1.05);
});
test('zoom stays bounded and portrait screens fit the entire car', () => {
  assert.equal(orbitZoom(.01), .65);
  assert.equal(orbitZoom(100), 1.65);
  const state = {yaw:0, pitch:.2, zoom:1};
  const wide = orbitPose(state, 1.6), phone = orbitPose(state, .6);
  assert.ok(phone.camera[2] > wide.camera[2]);
  assert.equal(phone.explode, 0);
});
