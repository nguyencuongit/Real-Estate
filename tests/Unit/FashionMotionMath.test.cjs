const test = require('node:test');
const assert = require('node:assert/strict');
const motion = require('../../platform/themes/fashion/public/motion-math.js');

test('horizontal collections stay at their bounds before and after the pinned interval', () => {
    assert.equal(motion.travel(1000, 2000, 720, 82), 0);
    assert.equal(motion.travel(82, 2000, 720, 82), 0);
    assert.equal(motion.travel(-558, 2000, 720, 82), .5);
    assert.equal(motion.travel(-1500, 2000, 720, 82), 1);
});
test('short sections and invalid video metadata have safe static fallbacks', () => {
    assert.equal(motion.travel(-20, 500, 720, 82), 0);
    assert.equal(motion.clamp(NaN), 0);
    assert.equal(motion.seek(1, 2, Infinity), 0);
    assert.equal(motion.seek(1, 2, 0), 0);
});
test('rotation wraps forward and backward without seeking beyond a video duration', () => {
    assert.equal(motion.seek(7.5, 1, 8), .5);
    assert.equal(motion.seek(.5, -1, 8), 7.5);
    assert.equal(motion.seek(0, 16, 8), 0);
});

test('scene entrances finish at the viewport boundary and reverse cleanly', () => {
    assert.equal(motion.entrance(900,720),0);
    assert.equal(motion.entrance(720,720),0);
    assert.equal(motion.entrance(360,720),.5);
    assert.equal(motion.entrance(0,720),1);
    assert.equal(motion.entrance(-100,720),1);
    assert.equal(motion.entrance(82,720,82),1);
    assert.equal(motion.entrance(0,0),0);
    assert.equal(motion.smooth(.5),.5);
    assert.equal(motion.smooth(-2),0);
    assert.equal(motion.smooth(2),1);
});
