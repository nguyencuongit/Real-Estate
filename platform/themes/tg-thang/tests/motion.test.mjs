import test from 'node:test';
import assert from 'node:assert/strict';
import { scrollProgress, sceneAt, solutionStackLayout } from '../src/motion-state.mjs';

test('a pinned scene follows scroll from entry to exit, including reverse scrolling', () => {
  assert.equal(scrollProgress(100, 1800, 720), 0);
  assert.equal(scrollProgress(-540, 1800, 720), .5);
  assert.equal(scrollProgress(-1080, 1800, 720), 1);
  assert.equal(scrollProgress(-2000, 1800, 720), 1);
  assert.equal(scrollProgress(-270, 1800, 720), .25);
  assert.ok(Number.isFinite(scrollProgress(0, 400, 720)));
});
test('the model changes from plan to an assembled perspective while scrolling', () => {
  const start = sceneAt(0), middle = sceneAt(.5), end = sceneAt(1);
  assert.ok(start.pitch > 1.4);
  assert.equal(start.reveal, 0);
  assert.equal(end.reveal, 1);
  assert.ok(middle.separation > .5);
  assert.equal(end.separation, 0);
  assert.ok(end.yaw - start.yaw > Math.PI / 2);
  assert.deepEqual(sceneAt(-1), start);
  assert.deepEqual(sceneAt(2), end);
});
test('reduced motion keeps an assembled, stationary model at any scroll position', () => {
  assert.deepEqual(sceneAt(0, true), sceneAt(1, true));
  assert.equal(sceneAt(.5, true).separation, 0);
  assert.equal(sceneAt(.5, true).reveal, 1);
});
test('solutions still stack in a desktop preview below 700 pixels high', () => {
  const layout = solutionStackLayout({width:1440,height:650,header:88,contentHeight:340});
  assert.equal(layout.enabled,true);
  assert.ok(88 + layout.gap * 3 + layout.cardHeight <= 650);
  assert.equal(solutionStackLayout({width:1280,height:600,header:76,contentHeight:340}).enabled,true);
});
test('stacking never crops content on small screens or when motion is reduced', () => {
  assert.equal(solutionStackLayout({width:390,height:844,header:68,contentHeight:600}).enabled,false);
  assert.equal(solutionStackLayout({width:1440,height:450,header:88,contentHeight:340}).enabled,false);
  assert.equal(solutionStackLayout({width:1440,height:800,header:88,contentHeight:340,reduced:true}).enabled,false);
});
