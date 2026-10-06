import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const host = document.getElementById('scene-host');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}
catch {document.getElementById('scene-status').textContent='Trình duyệt không hỗ trợ WebGL. Nội dung khóa học và học thử vẫn dùng được.';}
if (renderer) initialize();

function initialize() {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4,4,4,-4,.1,100);
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<641?1.25:1.5));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  host.append(renderer.domElement);host.classList.add('scene-ready');
  host.tabIndex=0;host.setAttribute('role','group');
  host.setAttribute('aria-label','Phòng 3D tương tác. Kéo ngang hoặc dùng phím mũi tên trái và phải để xoay góc nhìn.');
  scene.add(new THREE.HemisphereLight(0xffffff,0xc6c1df,1.8));
  const sun=new THREE.DirectionalLight(0xfff4e5,3.2);sun.position.set(3,7,4);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-4;sun.shadow.camera.right=4;sun.shadow.camera.top=4;sun.shadow.camera.bottom=-4;sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;sun.shadow.blurSamples=4;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xc1d2ff,1.5);fill.position.set(-4,3,-1);scene.add(fill);
  const root=new THREE.Group();scene.add(root);
  const accentMaterials=[],floaters=[],satellites=[];
  const color={white:0xfff9ed,cream:0xf0e4cc,blue:0x618bf2,dark:0x293946,mint:0x8bc69d,green:0x548b63,peach:0xffb68f,pink:0xe3a7bd};
  function material(value,roughness=.6){return new THREE.MeshStandardMaterial({color:value,roughness,metalness:.05});}
  const mat={};Object.entries(color).forEach(([key,value])=>mat[key]=material(value));
  const accent=material(color.blue);accentMaterials.push(accent);
  const floors=material(0xe9dbc3);
  function mesh(parent,geometry,material,x,y,z,rotation) {
    const item=new THREE.Mesh(geometry,material);item.position.set(x,y,z);if(rotation)item.rotation.set(...rotation);item.castShadow=true;item.receiveShadow=true;parent.add(item);return item;
  }
  function box(parent,w,h,d,x,y,z,m=mat.white,r=.035){return mesh(parent,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/4,h/4,d/4)),m,x,y,z);}
  function sphere(parent,r,x,y,z,m=mat.mint){return mesh(parent,new THREE.SphereGeometry(r,24,16),m,x,y,z);}
  function cylinder(parent,rt,rb,h,x,y,z,m=mat.white){return mesh(parent,new THREE.CylinderGeometry(rt,rb,h,32),m,x,y,z);}
  function torus(parent,r,t,x,y,z,m=mat.peach,rotation=[Math.PI/2,0,0]){return mesh(parent,new THREE.TorusGeometry(r,t,12,64),m,x,y,z,rotation);}
  function panelTexture(kind) {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=384;const ctx=canvas.getContext('2d');
    if(kind==='screen') {
      ctx.fillStyle='#193674';ctx.fillRect(0,0,512,384);ctx.strokeStyle='#2b4c8b';ctx.lineWidth=1;
      for(let i=0;i<512;i+=32){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,384);ctx.stroke();}
      for(let i=0;i<384;i+=32){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(512,i);ctx.stroke();}
      ctx.font='800 70px Arial';ctx.fillStyle='#f5f5e8';ctx.fillText('lumi.',54,138);
      ctx.font='18px monospace';ctx.fillStyle='#a3d6b3';ctx.fillText('const idea = new World();',56,205);ctx.fillText('idea.makeItYours();',56,240);
      ctx.fillStyle='#ffba8d';ctx.beginPath();ctx.arc(404,93,29,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#809ef7';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(335,248);ctx.lineTo(425,198);ctx.lineTo(470,264);ctx.lineTo(380,314);ctx.closePath();ctx.stroke();
    } else if(kind==='poster') {
      ctx.fillStyle='#ffcfaa';ctx.fillRect(0,0,512,384);ctx.fillStyle='#e2876b';ctx.beginPath();ctx.arc(258,202,126,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f9f4e8';ctx.font='800 102px Arial';ctx.textAlign='center';ctx.fillText('MAKE',256,166);ctx.fillText('SPACE.',256,275);
      ctx.font='14px Arial';ctx.fillStyle='#624933';ctx.fillText('FOR YOUR NEXT BIG IDEA',256,342);
    } else {
      const sky=ctx.createLinearGradient(0,0,0,384);sky.addColorStop(0,'#c9e5ff');sky.addColorStop(1,'#e7eeff');ctx.fillStyle=sky;ctx.fillRect(0,0,512,384);
      ctx.fillStyle='#ffddac';ctx.beginPath();ctx.arc(340,85,48,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a2c9c5';ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(160,188);ctx.lineTo(300,340);ctx.lineTo(400,250);ctx.lineTo(512,300);ctx.lineTo(512,384);ctx.lineTo(0,384);ctx.fill();
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:texture});
  }
  const room=new THREE.Group();root.add(room);
  box(room,4.9,.22,4.7,0,-.13,0,floors,.1);
  box(room,4.75,3.35,.13,0,1.62,-2.26,material(0xc7d8f5));
  box(room,.13,3.35,4.65,-2.32,1.62,0,mat.cream);
  box(room,4.7,.12,.06,0,.07,-2.15,mat.white);box(room,.06,.12,4.4,-2.2,.07,0,mat.white);
  // Window and its framing, on the open left wall.
  const windowGroup=new THREE.Group();windowGroup.position.set(-2.23,2.02,-.7);windowGroup.rotation.y=Math.PI/2;room.add(windowGroup);
  box(windowGroup,1.85,1.54,.08,0,0,0,mat.white);
  mesh(windowGroup,new THREE.PlaneGeometry(1.6,1.32),panelTexture('sky'),0,0,.045);
  box(windowGroup,.055,1.38,.06,0,0,.075,mat.white);box(windowGroup,1.7,.055,.06,0,0,.075,mat.white);
  box(windowGroup,1.95,.1,.22,0,-.78,.04,mat.white);
  // Rug and desk.
  box(room,2.85,.028,2.25,.35,.013,.42,material(0xc6ddd7),.06);
  for(let i=0;i<6;i++)box(room,2.5,.008,.04,.35,.032,-.44+i*.34,mat.white,.005);
  const desk=new THREE.Group();desk.position.set(.12,0,-.68);room.add(desk);
  box(desk,2.38,.13,1.02,0,1.16,0,mat.white,.06);
  for(const x of [-.95,.95])for(const z of [-.35,.35])box(desk,.08,1.13,.08,x,.57,z,accent,.016);
  box(desk,.58,.075,.27,-.15,1.27,.2,mat.dark,.035);
  for(let i=0;i<5;i++)box(desk,.45,.016,.012,-.15,1.312,.11+i*.04,mat.white,.004);
  box(desk,.14,.045,.22,.45,1.254,.21,mat.white,.03);
  box(desk,.32,.055,.23,-.04,1.29,-.24,accent);box(desk,.1,.22,.08,-.04,1.4,-.25,accent);
  box(desk,1.23,.82,.1,-.04,1.87,-.28,mat.white,.05);
  mesh(desk,new THREE.PlaneGeometry(1.1,.68),panelTexture('screen'),-.04,1.87,-.221);
  // Mug and a stack of books.
  cylinder(desk,.09,.09,.18,.9,1.32,.13,mat.peach);torus(desk,.072,.022,1.015,1.33,.13,mat.peach,[0,0,0]);
  box(desk,.36,.05,.3,-.91,1.255,-.16,mat.pink);box(desk,.36,.05,.3,-.88,1.31,-.16,mat.mint);
  // Task lamp.
  cylinder(desk,.12,.12,.035,-.93,1.26,.23,mat.blue);box(desk,.035,.52,.035,-.93,1.54,.23,mat.blue,.008);
  const arm=box(desk,.035,.34,.035,-.81,1.83,.23,mat.blue,.008);arm.rotation.z=-.85;
  const shade=mesh(desk,new THREE.ConeGeometry(.14,.18,32),mat.peach,-.7,1.91,.23);shade.rotation.z=-.45;
  // Rounded chair, with legs and a pillow.
  const chair=new THREE.Group();chair.position.set(.3,0,.64);chair.rotation.y=-.22;room.add(chair);
  box(chair,.76,.15,.74,0,.63,0,mat.peach,.1);box(chair,.78,.87,.14,0,1.08,.32,mat.peach,.08);
  box(chair,.6,.52,.06,0,1.13,.222,material(0xffd1ad),.025);
  for(const x of [-.28,.28])for(const z of [-.23,.23]){const leg=box(chair,.045,.57,.045,x,.28,z,mat.dark,.012);leg.rotation.z=x*.25;}
  // Planter and sculptural leaves.
  cylinder(room,.28,.21,.49,1.62,.255,-1.48,mat.peach);cylinder(room,.24,.24,.015,1.62,.51,-1.48,material(0x6e7254));
  for(let i=0;i<7;i++){
    const a=i*2.4,dx=Math.cos(a)*.16,dz=Math.sin(a)*.16;
    const stem=box(room,.018,.95,.018,1.62+dx,.92,-1.48+dz,mat.green,.004);stem.rotation.z=Math.cos(a)*.16;
    const leaf=sphere(room,.2,1.62+dx*2,1.05+(i%3)*.25,-1.48+dz*2,i%2?mat.mint:mat.green);leaf.scale.set(.8,2.2,.38);leaf.rotation.set(.2*Math.sin(a),a,Math.cos(a)*.65);
  }
  // Floating wall shelves, books and a small sculpture.
  for(let level=0;level<2;level++){
    box(room,1.65,.08,.35,-1.16,1.85+level*.7,-2.02,mat.white);
    box(room,.05,.25,.18,-1.72,1.73+level*.7,-2.05,mat.blue);box(room,.05,.25,.18,-.62,1.73+level*.7,-2.05,mat.blue);
    for(let i=0;i<5;i++){const book=box(room,.105,.31+(i%2)*.11,.2,-1.75+i*.15,2.055+level*.7,-2.035,[mat.peach,mat.mint,mat.pink,mat.blue,mat.white][i]);book.rotation.z=i===4?-.12:0;}
  }
  torus(room,.16,.055,-.72,2.75,-1.96,mat.peach,[0,0,0]);
  box(room,1.14,1.03,.055,1.02,2.35,-2.145,mat.white);mesh(room,new THREE.PlaneGeometry(1.04,.93),panelTexture('poster'),1.02,2.35,-2.109);
  // Small side table and paper notebook.
  cylinder(room,.34,.34,.075,-1.49,.59,.93,mat.white);cylinder(room,.04,.07,.55,-1.49,.29,.93,mat.mint);
  box(room,.26,.04,.31,-1.49,.656,.93,mat.blue);sphere(room,.075,-1.38,.75,.86,mat.peach);
  // Two floating wire shapes above the room.
  const wireCube=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.43,.43,.43)),new THREE.LineBasicMaterial({color:0xdd7c52}));wireCube.position.set(-.22,3.05,-1.4);room.add(wireCube);floaters.push({object:wireCube,y:3.05,speed:.5});
  const wireDiamond=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(.28)),new THREE.LineBasicMaterial({color:0x487862}));wireDiamond.position.set(.3,3.35,-1.2);room.add(wireDiamond);floaters.push({object:wireDiamond,y:3.35,speed:.7});
  // Scene 02: a tiny orbital playground.
  const orbit=new THREE.Group();root.add(orbit);orbit.visible=false;
  cylinder(orbit,2.3,2.3,.18,0,0,0,material(0xc6e3d1));cylinder(orbit,1.94,1.94,.02,0,.105,0,mat.white);
  cylinder(orbit,.55,.68,.32,0,.26,0,mat.peach);cylinder(orbit,.2,.28,.75,0,.7,0,mat.white);
  const planet=sphere(orbit,.86,0,1.83,0,accent);
  const ring=torus(orbit,1.31,.095,0,1.83,0,mat.peach,[Math.PI/2+.35,.15,0]);
  torus(orbit,1.74,.012,0,1.83,0,mat.green,[Math.PI/2+.15,.55,0]);
  for(let i=0;i<5;i++){
    const object=sphere(orbit,.12+(i%3)*.06,0,0,0,[mat.peach,mat.white,mat.mint][i%3]);satellites.push({object,r:1.4+i*.12,phase:i*1.4,y:1.6+(i%2)*.55});
    const baseX=Math.cos(i*1.4)*1.65,baseZ=Math.sin(i*1.4)*1.65;cylinder(orbit,.12,.15,.32,baseX,.25,baseZ,mat.blue);
  }
  // Scene 03: a wave and a sculptural knot.
  const lab=new THREE.Group();root.add(lab);lab.visible=false;
  box(lab,4.8,.18,4.4,0,0,0,material(0xf1d1b9),.09);
  const waveGeometry=new THREE.PlaneGeometry(3.8,3.4,28,24);waveGeometry.rotateX(-Math.PI/2);
  const wave=mesh(lab,waveGeometry,material(0x7aafe7),0,.33,0);wave.material.side=THREE.DoubleSide;
  const waveBase=Float32Array.from(waveGeometry.attributes.position.array);
  cylinder(lab,.46,.6,.24,0,.55,0,mat.white);
  const knot=mesh(lab,new THREE.TorusKnotGeometry(.64,.17,96,14,2,3),mat.peach,0,1.7,0);floaters.push({object:knot,y:1.7,speed:.26});
  for(let i=0;i<4;i++){const item=mesh(lab,new THREE.IcosahedronGeometry(.22,0),i%2?mat.mint:accent,Math.cos(i*1.6)*1.6,1.1,Math.sin(i*1.6)*1.4);floaters.push({object:item,y:1.1,speed:.5+i*.1});}
  const scenes=[room,orbit,lab];
  const titles=['01 / GÓC SÁNG TẠO','02 / QUỸ ĐẠO Ý TƯỞNG','03 / PHÒNG THÍ NGHIỆM'];
  let sceneIndex=0,paused=reduced.matches,onscreen=true,frame=0,last=0,time=0,yaw=.76,targetYaw=.76,drag=null,scrollInfluence=0,canvasHeight=500,canvasTop=0;
  function updateScroll(){scrollInfluence=LumiCourse.sceneProgress(scrollY,Math.max(0,canvasTop-innerHeight*.45),canvasHeight*.95);requestRender();}
  function resize(){
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;canvasHeight=h;
    canvasTop=host.getBoundingClientRect().top+scrollY;
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<641?1.25:1.5));renderer.setSize(w,h,false);
    const aspect=w/h,view=Math.max(innerWidth<641?6.1:6.8,7.2/aspect);camera.left=-view*aspect/2;camera.right=view*aspect/2;camera.top=view/2;camera.bottom=-view/2;camera.updateProjectionMatrix();updateScroll();
  }
  function requestRender(){if(!frame&&onscreen&&!document.hidden)frame=requestAnimationFrame(render);}
  function render(now){
    frame=0;if(document.hidden||!onscreen){last=0;return;}
    const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused&&!reduced.matches)time+=dt;
    yaw+= (targetYaw-yaw)*(paused?1:1-Math.exp(-dt*10));
    const progress=paused||reduced.matches?0:scrollInfluence,tilt=progress*.8,viewYaw=yaw+progress*.52;
    camera.position.set(Math.sin(viewYaw)*8.4,5.8+tilt,Math.cos(viewYaw)*8.4);camera.lookAt(0,1.18,0);
    const zoom=1+progress*(innerWidth<641?-.04:.06);
    if(camera.zoom!==zoom){camera.zoom=zoom;camera.updateProjectionMatrix();}
    host.dataset.scrollTurn=(progress*.52).toFixed(3);
    root.rotation.y=!paused?Math.sin(time*.3)*.025:0;
    floaters.forEach((item,index)=>{item.object.position.y=item.y+(!paused?Math.sin(time*1.3+index)*.08:0);item.object.rotation.y=time*item.speed;item.object.rotation.z=Math.sin(time*.5+index)*.12;});
    satellites.forEach(item=>{const a=time*.34+item.phase;item.object.position.set(Math.cos(a)*item.r,item.y+Math.sin(a)*.17,Math.sin(a)*item.r);});
    planet.rotation.y=time*.2;ring.rotation.z=Math.sin(time*.4)*.06;
    if(sceneIndex===2){const positions=waveGeometry.attributes.position;for(let i=0;i<positions.count;i++){const x=waveBase[i*3],z=waveBase[i*3+2];positions.setY(i,Math.sin(x*2+time)*Math.cos(z*2+time*.6)*.16);}positions.needsUpdate=true;waveGeometry.computeVertexNormals();}
    renderer.render(scene,camera);
    if((!paused&&!reduced.matches)||Math.abs(targetYaw-yaw)>.001)requestRender();else last=0;
  }
  function chooseScene(index){
    sceneIndex=LumiCourse.wrapIndex(index,scenes.length);scenes.forEach((item,i)=>item.visible=i===sceneIndex);
    host.dataset.scene=String(sceneIndex+1);document.getElementById('scene-title').textContent=titles[sceneIndex];
    document.getElementById('scene-number').innerHTML=`${String(sceneIndex+1).padStart(2,'0')} <i>/ 03</i>`;
    document.getElementById('scene-status').textContent=titles[sceneIndex];targetYaw=.76;requestRender();
  }
  document.getElementById('scene-prev').addEventListener('click',()=>chooseScene(sceneIndex-1));document.getElementById('scene-next').addEventListener('click',()=>chooseScene(sceneIndex+1));
  document.querySelectorAll('[data-color]').forEach(button=>button.addEventListener('click',()=>{
    const values={blue:color.blue,peach:color.peach,mint:color.mint};accentMaterials.forEach(item=>item.color.setHex(values[button.dataset.color]));
    document.querySelectorAll('[data-color]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));host.dataset.color=button.dataset.color;requestRender();
  }));
  host.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,y:event.clientY,id:event.pointerId};});
  host.addEventListener('pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(event.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx))return;targetYaw=THREE.MathUtils.clamp(targetYaw-dx*.006,.15,1.4);drag.x=event.clientX;drag.y=event.clientY;requestRender();});
  const endDrag=()=>drag=null;host.addEventListener('pointerup',endDrag);host.addEventListener('pointercancel',endDrag);host.addEventListener('pointerleave',endDrag);
  host.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;event.preventDefault();targetYaw=event.key==='Home'?.76:THREE.MathUtils.clamp(targetYaw+(event.key==='ArrowLeft'?-.15:.15),.15,1.4);requestRender();});
  addEventListener('scroll',()=>{if(onscreen)updateScroll();},{passive:true});
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;if(onscreen){last=0;updateScroll();}else{cancelAnimationFrame(frame);frame=0;last=0;}},{threshold:0}).observe(host);
  document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;host.classList.remove('scene-ready');document.getElementById('scene-status').textContent='Cảnh 3D tạm ngừng do WebGL mất kết nối. Nội dung còn lại vẫn đọc được.';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{host.classList.add('scene-ready');resize();});
  window.LumiScene={setPaused(value){paused=value;last=0;requestRender();}};
  paused=document.body.classList.contains('motion-paused');chooseScene(0);resize();
}
