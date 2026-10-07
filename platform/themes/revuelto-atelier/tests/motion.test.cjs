const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  damp,
  sceneProgress,
  storyWeights,
  cinematicState,
} = require("../public/motion.js");

test("scroll progress is bounded and reverses at the same document position", () => {
  assert.equal(sceneProgress(-100, 200, 1000), 0);
  assert.equal(sceneProgress(700, 200, 1000), 0.5);
  assert.equal(sceneProgress(1500, 200, 1000), 1);
  assert.equal(sceneProgress(700, 200, 1000), 0.5);
});
test("damping responds consistently at 60 Hz and 120 Hz", () => {
  let slow = 0,
    fast = 0;
  for (let i = 0; i < 60; i++) slow = damp(slow, 1, 14, 1 / 60);
  for (let i = 0; i < 120; i++) fast = damp(fast, 1, 14, 1 / 120);
  assert.ok(Math.abs(slow - fast) < 1e-9);
  assert.ok(slow > 0.999);
  assert.equal(damp(0.8, 0.2, 14, 0), 0.8);
});
test("story crossfades always preserve a visible chapter", () => {
  for (let i = 0; i <= 100; i++) {
    const weights = storyWeights(i / 100);
    assert.equal(weights.length, 3);
    assert.ok(weights.every((w) => w >= 0 && w <= 1));
    assert.ok(Math.abs(weights.reduce((a, b) => a + b, 0) - 1) < 1e-9);
  }
  assert.deepEqual(storyWeights(0), [1, 0, 0]);
  assert.deepEqual(storyWeights(1), [0, 0, 1]);
});
test("exterior opens the cinematic scene and interior ends it", () => {
  const start = cinematicState(0),
    end = cinematicState(1);
  assert.equal(start.interior, 0);
  assert.equal(start.heading, 1);
  assert.equal(end.interior, 1);
  assert.equal(end.heading, 0);
  assert.equal(end.interiorHeading, 1);
});
