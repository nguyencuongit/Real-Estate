const {test} = require('node:test');
const assert = require('node:assert/strict');
const {journeyState,giftState,ritualState,progressFor} = require('../public/motion-state.js');

test('journey opens the circular portrait and hands interaction to its visible invitation', () => {
    assert.equal(journeyState(0).radius, 0);
    assert.equal(journeyState(0).invitationOpacity, 0);
    assert.equal(journeyState(1).radius, 115);
    assert.equal(journeyState(1).center, 50);
    assert.equal(journeyState(1).titleOpacity, 0);
    assert.equal(journeyState(1).invitationOpacity, 1);
    assert.ok(journeyState(.4).radius > journeyState(.2).radius);
});
test('scroll geometry clamps both ends and avoids division by zero in static layout', () => {
    assert.equal(progressFor(100, 2400, 800), 0);
    assert.equal(progressFor(-800, 2400, 800), .5);
    assert.equal(progressFor(-4000, 2400, 800), 1);
    assert.equal(progressFor(0, 800, 800), 0);
});
test('gift transforms are reversible instead of accumulating rotations', () => {
    const first = giftState(.25);
    giftState(.9);
    assert.deepEqual(giftState(.25), first);
    assert.equal(giftState(1).rotateY, 0);
    assert.ok(giftState(0).lift > giftState(1).lift);
});
test('ritual wipe reaches every panel and its final endpoint without an invalid index', () => {
    assert.deepEqual(ritualState(-1), {index:0,mix:0});
    assert.deepEqual(ritualState(.25), {index:0,mix:.5});
    assert.deepEqual(ritualState(.5), {index:1,mix:0});
    assert.deepEqual(ritualState(1), {index:2,mix:0});
    assert.deepEqual(ritualState(2), {index:2,mix:0});
});
