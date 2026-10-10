import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const vehicleAssetBase = new URL('.', document.currentScript.src);

const hosts = Object.fromEntries([...document.querySelectorAll('[data-vehicle-scene]')].map(el => [el.dataset.vehicleScene, el]));
const offsets = {
  chassis: [0, 0, 0], roof: [0, 1.65, 0], hood: [0, 0.95, 1.05],
  engineCover: [0, 1.15, -1.05], engine: [0, 0.55, -0.3],
  front: [0, 0.16, 1.6], rear: [0, 0.15, -1.5],
  doorLeft: [-1.35, 0.3, 0], doorRight: [1.35, 0.3, 0],
  frontLeft: [-1.25, 0.1, 0.35], frontRight: [1.25, 0.1, 0.35],
  rearLeft: [-1.25, 0.1, -0.35], rearRight: [1.25, 0.1, -0.35],
};
let renderer, scene, camera, vehicle, assembledVehicle, companions = [], paintMaterial, fillLight;
let latest = { scene: 'hero', progress: 0, paint: 'blue', mobile: false };
let activeHost, size = [0, 0], ready = false;
const statuses = [...document.querySelectorAll('.model-status')];
function status(text) { statuses.forEach(el => el.textContent = text); }

// The original CAD-derived asset has X along its length, Y up, Z across.
// Group related meshes before merging draw calls; the assembled geometry stays exact.
function partFor(mesh, box) {
  const c = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const name = mesh.name, mat = mesh.material.name;
  if (/ENGINE|TRANSMISSION/.test(name)) return 'engine';
  if (/Wheel|rims|Rubber/.test(mat) || /3DWheel/.test(name))
    return `${c.x < 1.4 ? 'front' : 'rear'}${c.z < 0 ? 'Left' : 'Right'}`;
  if (name.includes('7021') || name.includes('1427')) return 'roof';
  if (name.includes('7419')) return 'hood';
  if (name.includes('391') && mat === 'MAT_CarpaintMain') return 'engineCover';
  if (c.x > 3.15 && size.x < 1.5) return 'rear';
  if (c.x < -0.48 && size.x < 1.8) return 'front';
  if (Math.abs(c.z) > 0.72 && c.x > 0.25 && c.x < 2.3 && size.z < 0.65)
    return c.z < 0 ? 'doorLeft' : 'doorRight';
  return 'chassis';
}

function prepareVehicle(original) {
  original.updateMatrixWorld(true);
  const normalization = new THREE.Matrix4().makeRotationY(Math.PI / 2)
    .multiply(new THREE.Matrix4().makeTranslation(-1.28667, 0.11091, -0.00334));
  const batches = new Map();
  let originalMeshes = 0;
  original.traverse(mesh => {
    if (!mesh.isMesh) return;
    originalMeshes++;
    const box = new THREE.Box3().setFromObject(mesh);
    const part = partFor(mesh, box);
    let geometry = mesh.geometry.clone();
    const matrix = normalization.clone().multiply(mesh.matrixWorld);
    geometry.applyMatrix4(matrix);
    if (geometry.index) geometry = geometry.toNonIndexed();
    for (const name of Object.keys(geometry.attributes)) {
      if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name);
    }
    if (!geometry.attributes.normal) geometry.computeVertexNormals();
    if (!geometry.attributes.uv) geometry.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count * 2), 2));
    // Bake mirrored CAD transforms without reversing visible triangle faces.
    if (matrix.determinant() < 0) {
      for (const attribute of Object.values(geometry.attributes)) {
        const array = attribute.array, itemSize = attribute.itemSize;
        for (let i = 0; i < attribute.count; i += 3)
          for (let k = 0; k < itemSize; k++) {
            const a = (i + 1) * itemSize + k, b = (i + 2) * itemSize + k;
            const value = array[a]; array[a] = array[b]; array[b] = value;
          }
      }
    }
    const center = geometry.boundingBox ? geometry.boundingBox.getCenter(new THREE.Vector3()) : new THREE.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(center);
    const cell = [center.x, center.y, center.z].map(value => Math.round(value / 0.48));
    const key = `${part}:${mesh.material.uuid}:${cell.join(',')}`;
    if (!batches.has(key)) batches.set(key, { part, material: mesh.material, geometries: [], center: center.clone() });
    batches.get(key).geometries.push(geometry);
  });
  const car = new THREE.Group();
  for (const batch of batches.values()) {
    const geometry = mergeGeometries(batch.geometries);
    if (!geometry) throw new Error('Unable to merge vehicle geometry');
    batch.geometries.forEach(g => g.dispose());
    const mesh = new THREE.Mesh(geometry, batch.material);
    mesh.name = batch.part;
    const outward = new THREE.Vector3(batch.center.x * 1.6, Math.max(0.1, batch.center.y - 0.2) * 1.6, batch.center.z * 0.7);
    mesh.userData.offset = new THREE.Vector3(...offsets[batch.part]).multiplyScalar(1.25).add(outward);
    mesh.userData.delay = (Math.abs(batch.center.z) * 0.065 + Math.abs(batch.center.x) * 0.08) % 0.25;
    mesh.frustumCulled = true;
    car.add(mesh);
  }
  const materials = new Set(car.children.map(m => m.material));
  for (const material of materials) {
    material.envMapIntensity = 0.3;
    material.roughness = Math.max(material.roughness, 0.32);
    if ('specularIntensity' in material) material.specularIntensity = 0.35;
    if (material.specularColor) {
      const specular = material.specularColor;
      specular.setRGB(Math.min(specular.r, 1), Math.min(specular.g, 1), Math.min(specular.b, 1));
    }
    if (!material.map && Math.max(material.color.r, material.color.g, material.color.b) < 0.012)
      material.color.setRGB(0.012, 0.014, 0.018);
    if (material.name === 'MAT_CarpaintMain') {
      paintMaterial = material;
      material.metalness = 0.3;
      material.roughness = 0.38;
      material.clearcoat = 0.3;
      material.clearcoatRoughness = 0.17;
    }
    if (material.name === 'Vetro') {
      material.transparent = true;
      material.opacity = 0.18;
      material.depthWrite = false;
      material.roughness = 0.12;
    }
  }
  document.body.dataset.vehicleMeshes = `${originalMeshes} → ${car.children.length}`;
  return car;
}

function assembledCar(source) {
  const buckets = new Map();
  for (const mesh of source.children) {
    if (!buckets.has(mesh.material)) buckets.set(mesh.material, []);
    buckets.get(mesh.material).push(mesh.geometry);
  }
  const result = new THREE.Group();
  for (const [material, geometries] of buckets)
    result.add(new THREE.Mesh(mergeGeometries(geometries), material));
  return result;
}

function createShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 63);
  gradient.addColorStop(0, 'rgba(0,0,0,0.9)');
  gradient.addColorStop(0.65, 'rgba(0,0,0,0.5)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 7), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthWrite:false}));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.012;
  scene.add(shadow);
}

function render(state = latest) {
  latest = state;
  const orbit = document.getElementById('vehicle-orbit').open;
  if (!ready || document.hidden || !hosts[orbit ? 'orbit' : state.scene]) return;
  const host = hosts[orbit ? 'orbit' : state.scene];
  if (activeHost !== host) {
    host.prepend(renderer.domElement); activeHost = host;
    renderer.domElement.setAttribute('aria-label', orbit ? 'Mô hình Lamborghini Revuelto 3D xoay 360 độ' : 'Mô hình Lamborghini Revuelto 3D theo vị trí cuộn');
  }
  const width = host.clientWidth, height = host.clientHeight;
  if (!width || !height) return;
  if (size[0] !== width || size[1] !== height) {
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 600 ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    size = [width, height];
  }
  const pose = orbit ? window.VantaOrbit.getPose(width / height) : window.VantaMotion.vehiclePose(state.scene, state.progress, state.mobile);
  fillLight.intensity = !orbit && state.scene === 'explode' ? 1.8 : 0.7;
  camera.aspect = width / height; camera.fov = pose.fov;
  camera.position.fromArray(pose.camera);
  camera.lookAt(...pose.target); camera.updateProjectionMatrix();
  vehicle.rotation.y = pose.rotation;
  vehicle.visible = !orbit && state.scene === 'explode';
  assembledVehicle.visible = !vehicle.visible;
  assembledVehicle.rotation.y = pose.rotation;
  vehicle.position.set(0, 0, 0);
  if (vehicle.visible) for (const mesh of vehicle.children) {
    const separation = THREE.MathUtils.smoothstep(pose.explode, mesh.userData.delay, 1);
    mesh.position.copy(mesh.userData.offset).multiplyScalar(separation);
  }
  paintMaterial.color.set({ blue: '#2c5d94', violet: '#7050a1', lime: '#b6d831' }[state.paint] || '#2c5d94');
  companions.forEach((car, i) => {
    car.visible = !orbit && state.scene === 'finale';
    car.position.set((i ? 1 : -1) * 2.65, 0, 0.75);
    car.rotation.y = (i ? 1 : -1) * 0.08;
  });
  renderer.render(scene, camera);
  host.dataset.pose = JSON.stringify({camera:pose.camera.map(n=>+n.toFixed(2)),explode:+pose.explode.toFixed(3),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles});
}

window.VantaVehicle = { render };
async function initialize() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
    renderer.domElement.className = 'vehicle-canvas';
    renderer.domElement.setAttribute('aria-label', 'Mô hình Lamborghini Revuelto 3D theo vị trí cuộn');
    renderer.domElement.setAttribute('role', 'img');
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#070808');
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    scene.environment = pmrem.fromScene(environment, 0.04).texture;
    environment.dispose(); pmrem.dispose();
    camera = new THREE.PerspectiveCamera(35, 1, 0.015, 80);
    fillLight = new THREE.HemisphereLight('#d9e9ff', '#151515', 0.7); scene.add(fillLight);
    const key = new THREE.DirectionalLight('#fff4df', 2.2); key.position.set(-3, 6, 6); scene.add(key);
    const rim = new THREE.DirectionalLight('#a3c9ff', 0.65); rim.position.set(5, 3, -4); scene.add(rim);
    const interior = new THREE.PointLight('#fff1db', 0.4, 3, 2); interior.position.set(0, 0.97, 0.4); scene.add(interior);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({color:'#111416'}));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.007; scene.add(floor);
    scene.fog = new THREE.Fog('#070808', 15, 35);
    createShadow();
    status('ĐANG TẢI REVUELTO 3D…');
    const gltf = await new GLTFLoader().loadAsync(new URL('models/revuelto.glb', vehicleAssetBase).href, event => {
      if (event.total) status(`ĐANG TẢI REVUELTO 3D · ${Math.round(event.loaded / event.total * 100)}%`);
    });
    vehicle = prepareVehicle(gltf.scene); scene.add(vehicle);
    assembledVehicle = assembledCar(vehicle); scene.add(assembledVehicle);
    companions = ['#363d42', '#171c28'].map(color => {
      const car = assembledVehicle.clone(true);
      for (const mesh of car.children) if (mesh.material === paintMaterial) {
        mesh.material = paintMaterial.clone(); mesh.material.color.set(color);
      }
      car.visible = false; scene.add(car); return car;
    });
    ready = true;
    document.body.classList.add('vehicle-ready');
    document.body.dataset.vehicleState = 'ready';
    status('REVUELTO · 3D EXPERIENCE');
    render();
    document.dispatchEvent(new Event('vehicle-ready'));
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault(); ready = false; document.body.classList.remove('vehicle-ready');
      renderer.domElement.hidden = true;
      document.body.dataset.vehicleState = 'unavailable'; status('CẢNH 3D TẠM DỪNG · TẢI LẠI TRANG ĐỂ THỬ LẠI');
      document.dispatchEvent(new Event('vehicle-unavailable'));
    });
  } catch (error) {
    if (renderer) renderer.domElement.hidden = true;
    document.body.dataset.vehicleState = 'unavailable';
    status(location.protocol === 'file:' ? 'MỞ “CHAY-WEBSITE.CMD” TRONG THƯ MỤC ĐỂ XEM CẢNH 3D' : 'KHÔNG TẢI ĐƯỢC CẢNH 3D · VUI LÒNG TẢI LẠI TRANG');
    console.warn('Revuelto 3D could not initialize:', error.message);
    document.dispatchEvent(new Event('vehicle-unavailable'));
  }
}
initialize();
