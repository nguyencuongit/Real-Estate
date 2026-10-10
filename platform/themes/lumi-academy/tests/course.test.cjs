const test = require('node:test');
const assert = require('node:assert/strict');
const {plans, modules, wrapIndex, sceneProgress, validEmail, lessonTotal} = require('../public/course-data.js');
test('bundle includes the two courses without double-counting lessons or time', () => {
  assert.equal(plans.bundle.lessons, plans.foundation.lessons + plans.motion.lessons);
  assert.equal(plans.bundle.hours, plans.foundation.hours + plans.motion.hours);
  assert.ok(plans.bundle.price < plans.foundation.price + plans.motion.price);
  assert.equal(lessonTotal(modules), plans.bundle.lessons);
});
test('scene navigation wraps at both ends', () => {
  assert.equal(wrapIndex(-1,3),2);
  assert.equal(wrapIndex(3,3),0);
  assert.equal(wrapIndex(1,3),1);
});
test('scroll scene progress stays bounded and reverses', () => {
  assert.equal(sceneProgress(-100,100,500),0);
  assert.equal(sceneProgress(350,100,500),.5);
  assert.equal(sceneProgress(900,100,500),1);
  assert.equal(sceneProgress(300,100,0),0);
});
test('email rejects incomplete addresses and accepts a normal learner address', () => {
  assert.ok(validEmail('hocvien@example.com'));
  assert.ok(!validEmail('hocvien@'));
  assert.ok(!validEmail('a b@example.com'));
});

const {projectProgress} = require('../public/course-data.js');
test('pinned gallery reaches every project on desktop and phone and reverses', () => {
  for (const [sectionHeight,stageHeight,header] of [[1700,634,86],[1800,772,72]]) {
    const top=2000,travel=sectionHeight-stageHeight;
    assert.equal(projectProgress(top-header,top,sectionHeight,stageHeight,header),0);
    assert.equal(projectProgress(top-header+travel/2,top,sectionHeight,stageHeight,header),.5);
    assert.equal(projectProgress(top-header+travel,top,sectionHeight,stageHeight,header),1);
    assert.equal(projectProgress(top-header+travel/4,top,sectionHeight,stageHeight,header),.25);
    assert.equal(projectProgress(top+sectionHeight,top,sectionHeight,stageHeight,header),1);
  }
  assert.equal(projectProgress(0,2000,600,600,72),0);
});
