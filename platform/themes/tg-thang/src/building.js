import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { scrollProgress, sceneAt } from './motion-state.mjs';

const stage = document.querySelector('.building-stage');
const section = document.getElementById('he-thong');
const range = document.getElementById('floor-separation');
const output = document.getElementById('floor-value');
const reset = document.getElementById('building-reset');
const status = stage.querySelector('.model-label');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const floors = [];
let renderer, camera, scene, building, initialized = false, available = false, visible = false;
let frame = 0, yaw = -.35, pitch = .52, separation = 0, reveal = 1, pointer = null, moved = false;
let size = [0,0];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function buildFloor(index) {
  const group = new THREE.Group();
  const geometry = [];
  const box = (x,y,z,w,h,d) => { const shape = new THREE.BoxGeometry(w,h,d); shape.translate(x,y,z); geometry.push(shape); };
  const xs = [-3.6,-1.2,1.2,3.6], zs = [-5,-2.5,0,2.5,5], height = 2.4;
  for (const x of xs) for (const z of zs) {
    if (Math.abs(x) === 3.6 || Math.abs(z) === 5) box(x,height/2,z,.075,height,.075);
  }
  for (const y of [0,height]) {
    for (const x of xs) box(x,y,0,.05,.06,10);
    for (const z of zs) box(0,y,z,7.2,.06,.05);
  }
  for (const side of [-1,1]) for (const z of [-3.75,-1.25,1.25,3.75]) {
    box(side*3.6,1.2,z,.045,height,.045);
    box(side*3.6,.8,z,.04,.04,2.5);
    box(side*3.6,1.8,z,.04,.04,2.5);
  }
  // Interior partitions and the circulation core keep the drawing readable.
  for (const x of [-1.2,1.2]) for (let z=-5;z<=5;z+=1) box(x,1.2,z,.025,height,.025);
  for (const z of [-2.5,2.5]) for (let x=-3.6;x<=3.6;x+=.6) box(x,1.2,z,.025,height,.025);
  for (let step = 0; step < 12; step++) box(0,.2*step,-1.7+step*.28,1.1,.035,.3);
  const merged = mergeGeometries(geometry);
  geometry.forEach(shape => shape.dispose());
  group.add(new THREE.Mesh(merged, new THREE.MeshBasicMaterial({color:'#ff5949',transparent:true})));
  const slab = new THREE.Mesh(new THREE.BoxGeometry(7.2,.05,10), new THREE.MeshBasicMaterial({color:'#ff5949',transparent:true,opacity:.12,depthWrite:false}));
  group.add(slab);
  group.position.y = index * height;
  floors.push(group);
  return group;
}

function requestDraw() {
  if (available && visible && !document.hidden && !frame) frame = requestAnimationFrame(draw);
}
function draw() {
  frame = 0;
  if (!available || !visible || document.hidden) return;
  const width = stage.clientWidth, height = stage.clientHeight;
  if (!width || !height) return;
  const aspect = width / height;
  if (size[0] !== width || size[1] !== height) {
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.setSize(width,height,false);
    size = [width,height];
  }
  const distance = (26 + separation * 7) / Math.min(1,Math.max(.5,aspect));
  camera.aspect = aspect;
  camera.position.set(Math.sin(.7)*Math.cos(pitch)*distance,4+Math.sin(pitch)*distance,Math.cos(.7)*Math.cos(pitch)*distance);
  camera.lookAt(0,3.4+separation*2,0); camera.updateProjectionMatrix();
  building.rotation.y = yaw;
  floors.forEach((floor,index) => {
    floor.position.y = index * (2.4 + separation * 2.8);
    floor.visible = index === 0 || reveal > .01;
    floor.children[0].material.opacity = index === 0 ? 1 : reveal;
    floor.children[1].material.opacity = .12 * (index === 0 ? 1 : reveal);
  });
  renderer.render(scene,camera);
  stage.dataset.angle = (yaw * 180 / Math.PI).toFixed(1);
  stage.dataset.separation = separation.toFixed(2);
  stage.dataset.calls = String(renderer.info.render.calls);
  stage.dataset.pitch = pitch.toFixed(2);
  stage.dataset.reveal = reveal.toFixed(2);
}
function fallback() {
  available = false;
  stage.classList.remove('building-ready');
  stage.dataset.state = 'unavailable';
  if (renderer) renderer.domElement.hidden = true;
  range.disabled = true; reset.disabled = true;
  status.textContent = 'PHỐI CẢNH 2D / TRÌNH DUYỆT CHƯA HỖ TRỢ CẢNH 3D';
}
function initialize() {
  initialized = true;
  try {
    renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setClearColor('#0e0e11');
    renderer.domElement.setAttribute('aria-label','Phối cảnh khung nhà TG Thang 3D');
    renderer.domElement.setAttribute('role','img');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40,1,.1,100);
    building = new THREE.Group();
    for (let i=0;i<3;i++) building.add(buildFloor(i));
    scene.add(building);
    const grid = new THREE.GridHelper(18,18,'#783830','#2a1b1b');
    grid.position.y = -.4; scene.add(grid);
    stage.prepend(renderer.domElement);
    available = true; stage.dataset.state = 'ready';
    stage.classList.add('building-ready'); range.disabled = false; reset.disabled = false;
    status.textContent = 'TG.001 / KHUNG NHÀ 3 TẦNG / MÔ HÌNH 3D';
    renderer.domElement.addEventListener('webglcontextlost',event => {event.preventDefault(); fallback();});
    followScroll();
  } catch (error) { fallback(); console.warn('TG Thang 3D:',error.message); }
}
new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  if (visible && !initialized) initialize();
  requestDraw();
},{rootMargin:'250px'}).observe(stage);
new ResizeObserver(requestDraw).observe(stage);
range.addEventListener('input',() => {moved=true;reveal=1;separation=Number(range.value)/100;output.textContent=`${range.value}%`;requestDraw();});
function resetView() { moved=false; followScroll(); }
reset.addEventListener('click',resetView);
stage.addEventListener('pointerdown',event => {
  if (!available || event.button !== 0 || pointer) return;
  stage.focus({preventScroll:true}); stage.setPointerCapture(event.pointerId);
  pointer={id:event.pointerId,x:event.clientX,y:event.clientY};
});
stage.addEventListener('pointermove',event => {
  if (!pointer || pointer.id !== event.pointerId) return;
  moved=true; reveal=1; yaw+=(event.clientX-pointer.x)*.008;
  pitch=clamp(pitch+(event.clientY-pointer.y)*.003,.15,1.15);
  pointer.x=event.clientX;pointer.y=event.clientY;requestDraw();
});
['pointerup','pointercancel','lostpointercapture'].forEach(name => stage.addEventListener(name,() => {pointer=null;}));
stage.addEventListener('keydown',event => {
  if (!available) return;
  if (event.key==='Home') {event.preventDefault();resetView();return;}
  if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
  event.preventDefault();moved=true;reveal=1;
  if(event.key==='ArrowLeft')yaw-=.15;
  if(event.key==='ArrowRight')yaw+=.15;
  if(event.key==='ArrowUp')pitch=clamp(pitch-.06,.15,1.15);
  if(event.key==='ArrowDown')pitch=clamp(pitch+.06,.15,1.15);
  requestDraw();
});
function followScroll() {
  if (!visible || !available || moved) return;
  const rect=section.getBoundingClientRect();
  const state=sceneAt(scrollProgress(rect.top,rect.height,innerHeight),reduced.matches);
  ({yaw,pitch,separation,reveal}=state);
  range.value=String(Math.round(separation*100));output.textContent=`${range.value}%`;
  requestDraw();
}
window.addEventListener('scroll',followScroll,{passive:true});
window.addEventListener('resize',followScroll);
reduced.addEventListener('change',() => {moved=false;followScroll();});
document.addEventListener('visibilitychange',() => {cancelAnimationFrame(frame);frame=0;requestDraw();});
