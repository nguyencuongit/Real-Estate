import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneProgress, artOffsets, coverPoint, welcomeFrame, galleryPose } from '../public/motion-state.mjs';

test('pinned scene clamps its progress and tracks scroll in both directions', () => {
    assert.equal(sceneProgress(200, 2100, 700), 0);
    assert.equal(sceneProgress(-700, 2100, 700), .5);
    assert.equal(sceneProgress(-1800, 2100, 700), 1);
    assert.equal(sceneProgress(-350, 2100, 700), .25);
    assert.equal(sceneProgress(-1, 700, 700), 0);
});
test('six art photos rise at different speeds; reduced motion stays still', () => {
    const start = artOffsets(0);
    const end = artOffsets(1);
    assert.equal(start.length, 6);
    assert.ok(start[0] > end[0]);
    assert.ok(start[1] > end[1]);
    assert.notEqual(end[0], end[4]);
    assert.deepEqual(artOffsets(.7, true), [0, 0, 0, 0, 0, 0]);
});

test('welcome image expands before its information card enters and reverses on scroll back', () => {
    assert.deepEqual(welcomeFrame(0), { width: 20, height: 40, card: 0 });
    assert.deepEqual(welcomeFrame(.5), { width: 60, height: 70, card: 0 });
    assert.deepEqual(welcomeFrame(1), { width: 100, height: 100, card: 1 });
    assert.equal(welcomeFrame(.9).card, .5);
    assert.equal(welcomeFrame(.6).card, 0);
    assert.deepEqual(welcomeFrame(.2, true), { width: 100, height: 100, card: 1 });
});
test('gallery cards tilt in the direction of their position, keeping the middle card straight', () => {
    assert.deepEqual(galleryPose(0), { y: 0, angle: 0, imageX: 0 });
    const left = galleryPose(-1), right = galleryPose(1);
    assert.ok(left.angle < 0 && right.angle > 0);
    assert.equal(left.y, -right.y);
    assert.ok(right.imageX < 0);
    assert.deepEqual(galleryPose(2), galleryPose(1));
});
test('hotspots remain anchored to image coordinates when cover crops the image', () => {
    assert.deepEqual(coverPoint(1440, 900, 1440, 900, .5, .5), { x: 720, y: 450, visible: true });
    assert.deepEqual(coverPoint(400, 600, 1440, 900, .5, .5), { x: 200, y: 300, visible: true });
    assert.equal(coverPoint(400, 600, 1440, 900, .9, .5).visible, false);
    assert.equal(coverPoint(1440, 500, 1440, 900, .5, .05).visible, false);
});
