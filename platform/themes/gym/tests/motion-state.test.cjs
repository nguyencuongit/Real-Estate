const test = require('node:test');
const assert = require('node:assert/strict');
const motion = require('../public/motion-state.js');

test('pinned journey stays at its endpoints outside the scroll range', () => {
    assert.equal(motion.progress(120, 2400, 720), 0);
    assert.equal(motion.progress(-840, 2400, 720), 0.5);
    assert.equal(motion.progress(-3000, 2400, 720), 1);
    assert.equal(motion.progress(0, 500, 720), 0);
});
test('trainer panels enter in order and return when scrolling backward', () => {
    assert.deepEqual([0, 1, 2, 3].map(index => motion.panelOffset(index, 0, 4)), [0, 100, 100, 100]);
    assert.deepEqual([0, 1, 2, 3].map(index => motion.panelOffset(index, 0.5, 4)), [0, 0, 50, 100]);
    assert.deepEqual([0, 1, 2, 3].map(index => motion.panelOffset(index, 1, 4)), [0, 0, 0, 0]);
    assert.equal(motion.panelOffset(2, 0.5, 4), 50);
});
test('active trainer remains within bounds', () => {
    assert.equal(motion.activePanel(-1, 4), 0);
    assert.equal(motion.activePanel(1 / 3, 4), 1);
    assert.equal(motion.activePanel(2, 4), 3);
});
test('carousel wraps in both directions', () => {
    assert.equal(motion.wrap(-1, 5), 4);
    assert.equal(motion.wrap(5, 5), 0);
    assert.equal(motion.wrap(12, 5), 2);
});
