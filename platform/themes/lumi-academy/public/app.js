'use strict';
(() => {
  const {plans,modules,wrapIndex,sceneProgress,projectProgress,validEmail} = LumiCourse;
  const money = value => new Intl.NumberFormat('vi-VN').format(value)+'đ';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, activeModule = -1, scrollFrame = 0, geometry = [], chapters = [];
  const motionToggle = document.getElementById('motion-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const curriculum = document.getElementById('curriculum');
  const preview = document.getElementById('preview-dialog');
  const enroll = document.getElementById('enroll-dialog');
  const projectDialog = document.getElementById('project-dialog');
  const projectSection=document.getElementById('projects'),projectStage=document.querySelector('.projects-stage');
  const projectWindow=document.querySelector('.project-window'),projectCards=[...document.querySelectorAll('.project-card')];
  const projectPosition=document.getElementById('project-position');
  const art=document.querySelector('.journey-art');
  let scrollObjects=[],titleObjects=[],projectGeometry=null,projectIndex=-1,headerHeight=86;
  modules.forEach((item,index) => {
    const detail = document.createElement('details');
    detail.dataset.module = index;
    detail.open = index === 0;
    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="chapter-number">${String(index+1).padStart(2,'0')}</span><span class="chapter-heading">${item.title}<small>${item.count} bài học · ${item.hours}</small></span><span class="chapter-plus">+</span>`;
    const list = document.createElement('ol'); list.className = 'lesson-list';
    item.lessons.forEach((title,lesson) => {
      const li = document.createElement('li'); const button = document.createElement('button');
      const text = document.createElement('span');text.textContent = `${String(lesson+1).padStart(2,'0')} / ${title}`;
      const tag = document.createElement('i');tag.textContent = index === 0 && lesson < 3 ? 'HỌC THỬ ↗' : 'XEM NỘI DUNG ↗';
      button.append(text,tag);button.addEventListener('click',event => {
        if (index===0 && lesson<3) showLesson(lesson,event.currentTarget);
        else showOutline(item,title,event.currentTarget);
      });li.append(button);list.append(li);
    });
    detail.append(summary,list);detail.addEventListener('toggle',() => {if(detail.open) setModule(index);measure();});curriculum.append(detail);
  });
  function setModule(index) {
    if(activeModule===index)return;
    activeModule=index;
    const item=modules[index];
    document.getElementById('chapter-label').textContent=`CHƯƠNG ${String(index+1).padStart(2,'0')} / ${item.tag}`;
    document.getElementById('chapter-title').textContent=item.title;
    document.getElementById('chapter-summary').textContent=item.description;
    document.querySelector('.journey-visual').style.setProperty('--chapter-progress',`${(index+1)/modules.length*100}%`);
  }
  function openDialog(dialog,opener) {
    document.querySelectorAll('dialog[open]').forEach(item=>item.close());
    dialog.opener=opener;dialog.showModal();
  }
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('close',()=>{dialog.opener?.focus({preventScroll:true});stopPractice();measure();});
  });
  function toggleMenu(open) {
    mobileMenu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');
  }
  menuToggle.addEventListener('click',()=>toggleMenu(mobileMenu.hidden));
  mobileMenu.querySelectorAll('a,button').forEach(item=>item.addEventListener('click',()=>toggleMenu(false)));
  addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){toggleMenu(false);menuToggle.focus();}});
  function measure() {
    headerHeight=document.querySelector('.site-header').offsetHeight;
    projectSection.classList.toggle('scroll-projects',!paused&&!reduced.matches&&innerHeight>=680);
    document.body.classList.add('measuring');
    const rect=element=>({element,top:element.getBoundingClientRect().top+scrollY,height:element.offsetHeight});
    geometry=[...document.querySelectorAll('[data-reveal]')].map(element=>{
      const item=rect(element),siblings=[...element.parentElement.children].filter(e=>e.hasAttribute('data-reveal'));
      item.delay=siblings.indexOf(element)*36;return item;
    });
    chapters=[...curriculum.children].map(rect);
    scrollObjects=[...document.querySelectorAll('[data-scroll],[data-parallax]')].map(element=>{
      const anchor=element.hasAttribute('data-parallax')?element.closest('section')||element:element;
      return {...rect(anchor),element};
    });
    titleObjects=[...document.querySelectorAll('.section-heading h2')].map(rect);
    projectGeometry={...rect(projectSection),stageHeight:projectStage.offsetHeight,viewportWidth:projectWindow.clientWidth,travel:Math.max(0,projectWindow.scrollWidth-projectWindow.clientWidth),step:projectCards[0].offsetWidth+parseFloat(getComputedStyle(document.querySelector('.project-track')).gap)};
    document.body.classList.remove('measuring');requestScroll();
  }
  function renderScroll() {
    scrollFrame=0;
    document.querySelector('.site-header').classList.toggle('is-scrolled',scrollY>20);
    const enabled=!paused&&!reduced.matches;
    geometry.forEach(item=>{
      const p=enabled?sceneProgress(scrollY+innerHeight,item.top+40+item.delay,innerHeight*.46):1;
      const t=p*p*(3-2*p);
      item.element.style.setProperty('--reveal-opacity',.12+t*.88);
      item.element.style.setProperty('--reveal-y',`${(1-t)*104}px`);
      item.element.style.setProperty('--reveal-scale',.92+t*.08);
      item.element.style.setProperty('--reveal-tilt',`${(1-t)*8}deg`);
    });
    titleObjects.forEach(item=>{
      const p=enabled?sceneProgress(scrollY+innerHeight,item.top+24,innerHeight*.52):1;
      item.element.style.setProperty('--title-cut',`${(1-p)*100}%`);
    });
    const inView=chapters.findIndex(item=>item.top+item.height>scrollY+innerHeight*.42);
    if(inView>=0&&chapters[0].top<scrollY+innerHeight*.7&&chapters.at(-1).top+chapters.at(-1).height>scrollY)setModule(inView);
    const first=chapters[0];
    const p=first&&enabled?sceneProgress(scrollY+innerHeight,first.top,innerHeight+chapters.at(-1).top+chapters.at(-1).height-first.top):.5;
    art.style.setProperty('--art-turn',`${enabled?p*260:0}deg`);art.style.setProperty('--art-float',`${enabled?(p-.5)*120:0}px`);
    art.style.setProperty('--art-scale',enabled?.86+p*.28:1);
    scrollObjects.forEach(item=>{
      const p=sceneProgress(scrollY+innerHeight,item.top,item.height+innerHeight),t=enabled?p-.5:0;
      const el=item.element;
      if(el.hasAttribute('data-parallax')){
        el.style.setProperty('--scroll-y',`${t*Number(el.dataset.parallax)}px`);
        el.style.setProperty('--scroll-turn',`${t*Number(el.dataset.turn||0)}deg`);
      }else{
        el.style.setProperty('--section-progress',enabled?p:.5);
        el.style.setProperty('--scroll-y',`${t*(el.dataset.scroll==='hero'?-110:-64)}px`);
        el.style.setProperty('--scroll-turn',`${el.dataset.scroll==='lesson'?t*-20:0}deg`);
        el.style.setProperty('--scroll-scale',el.dataset.scroll==='ending'&&enabled?.82+p*.26:1);
        if(el.dataset.scroll==='ribbon')el.style.setProperty('--ribbon-x',`${t*-220}px`);
        if(el.dataset.scroll==='ending')el.style.setProperty('--ending-round',`${enabled?(1-p)*72:0}px`);
      }
    });
    if(projectGeometry&&projectSection.classList.contains('scroll-projects')){
      const g=projectGeometry,p=projectProgress(scrollY,g.top,g.height,g.stageHeight,headerHeight);
      projectSection.style.setProperty('--project-x',`${-p*g.travel}px`);
      projectSection.style.setProperty('--project-progress',p);
      projectCards.forEach((card,index)=>{
        const distance=Math.max(-1,Math.min(1,(index*g.step-p*g.travel)/g.viewportWidth));
        card.style.setProperty('--card-turn',`${distance*9}deg`);
        card.style.setProperty('--card-scale',1-Math.abs(distance)*.08);
        card.style.setProperty('--project-art-y',`${distance*36}px`);
      });
      const index=Math.round(p*(projectCards.length-1));
      if(index!==projectIndex){projectIndex=index;projectPosition.textContent=`${String(index+1).padStart(2,'0')} / 03`;}
    }else{
      projectCards.forEach(card=>{card.style.setProperty('--card-turn','0deg');card.style.setProperty('--card-scale',1);card.style.setProperty('--project-art-y','0px');});
    }
  }
  function requestScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(renderScroll);}
  function updateMotion(){
    document.body.classList.toggle('motion-enabled',!paused&&!reduced.matches);
    document.body.classList.toggle('motion-paused',paused||reduced.matches);
    motionToggle.setAttribute('aria-pressed',String(paused));
    motionToggle.setAttribute('aria-label',paused?'Tiếp tục hoạt ảnh':'Tạm dừng hoạt ảnh');motionToggle.textContent=paused?'▷':'Ⅱ';motionToggle.disabled=reduced.matches;
    window.LumiScene?.setPaused(paused||reduced.matches);if(paused||reduced.matches)stopPractice();measure();
    cubeButton.disabled=paused||reduced.matches;
    cubeButton.textContent=cubeButton.disabled?'Hoạt ảnh đã tạm dừng':practiceFrame?'Ⅱ Dừng hoạt ảnh':'▷ Chạy hoạt ảnh';
  }
  motionToggle.addEventListener('click',()=>{paused=!paused;updateMotion();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;updateMotion();});
  addEventListener('scroll',requestScroll,{passive:true});addEventListener('resize',()=>{if(innerWidth>900)toggleMenu(false);measure();});document.fonts.ready.then(measure);
  const sampleLessons=[
    {title:'Một điểm trong không gian.',description:'Một vật thể 3D có vị trí theo ba trục: X (ngang), Y (dọc), Z (chiều sâu). Kéo thanh góc xoay để nhìn thấy các mặt khác nhau của hình khối.',code:'cube.position.set(0, 0, 0);\n// X: ngang · Y: dọc · Z: chiều sâu'},
    {title:'Một góc nhìn mới.',description:'Camera quyết định cách chúng ta nhìn một vật thể. Rotation thay đổi hướng của vật thể. Thử các góc 0°, 45° và 90° — cùng một khối nhưng bạn sẽ thấy những mặt khác nhau.',code:'cube.rotation.y = Math.PI / 4;\n// 45 độ = π / 4 radian'},
    {title:'Cho hình khối chuyển động.',description:'Thay đổi góc xoay từng chút một theo thời gian tạo nên hoạt ảnh. Bấm “Chạy hoạt ảnh” để thử. Bạn có thể dừng và chọn một góc bất kỳ bằng thanh trượt.',code:'function animate(time) {\n  cube.rotation.y = time * 0.001;\n  requestAnimationFrame(animate);\n}'}
  ];
  let lessonIndex=0,practiceFrame=0,practiceTime=0,practiceAngle=25;
  const lessonTabs=[...document.querySelectorAll('[data-lesson]')];
  const cube=document.getElementById('practice-cube'),angle=document.getElementById('cube-angle'),cubeButton=document.getElementById('cube-animate');
  function chooseLesson(index){
    lessonIndex=wrapIndex(index,3);const item=sampleLessons[lessonIndex];
    lessonTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===lessonIndex));tab.tabIndex=i===lessonIndex?0:-1;});
    document.getElementById('lesson-panel').setAttribute('aria-labelledby',`lesson-tab-${lessonIndex}`);
    document.getElementById('lesson-count').textContent=`BÀI ${String(lessonIndex+1).padStart(2,'0')} / 03`;
    document.getElementById('lesson-title').textContent=item.title;document.getElementById('lesson-description').textContent=item.description;document.getElementById('lesson-code').textContent=item.code;
    document.getElementById('lesson-next').innerHTML=lessonIndex===2?'Xem khóa học <span>↗</span>':'Bài tiếp theo <span>→</span>';
  }
  function showLesson(index,opener){chooseLesson(index);openDialog(preview,opener);}
  document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',event=>showLesson(Number(button.dataset.preview || 0),event.currentTarget)));
  lessonTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>chooseLesson(index));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
      event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?2:wrapIndex(index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1),3);chooseLesson(next);lessonTabs[next].focus();
    });
  });
  document.getElementById('lesson-next').addEventListener('click',()=>{if(lessonIndex<2)chooseLesson(lessonIndex+1);else{preview.close();document.getElementById('pricing').scrollIntoView({behavior:paused?'instant':'smooth'});}});
  function setAngle(value){practiceAngle=value;cube.style.setProperty('--cube-angle',`${value}deg`);angle.value=Math.round(value);document.getElementById('angle-value').textContent=`${Math.round(value)}°`;}
  function stopPractice(){cancelAnimationFrame(practiceFrame);practiceFrame=0;practiceTime=0;cubeButton.setAttribute('aria-pressed','false');cubeButton.textContent='▷ Chạy hoạt ảnh';}
  function animatePractice(time){
    if(!preview.open||document.hidden||paused||reduced.matches){stopPractice();return;}
    const dt=practiceTime?Math.min((time-practiceTime)/1000,.05):0;practiceTime=time;
    setAngle(wrapIndex(practiceAngle+dt*45+180,360)-180);practiceFrame=requestAnimationFrame(animatePractice);
  }
  angle.addEventListener('input',()=>{stopPractice();setAngle(Number(angle.value));});
  cubeButton.addEventListener('click',()=>{if(practiceFrame)stopPractice();else if(!paused&&!reduced.matches){cubeButton.setAttribute('aria-pressed','true');cubeButton.textContent='Ⅱ Dừng hoạt ảnh';practiceFrame=requestAnimationFrame(animatePractice);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPractice();});
  const planSelect=document.getElementById('selected-plan');
  function updatePlan(){const item=plans[planSelect.value];document.getElementById('selected-facts').textContent=`${item.lessons} bài · ${item.hours} giờ`;document.getElementById('selected-price').textContent=money(item.price);}
  document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>{
    document.getElementById('enroll-form').hidden=false;document.getElementById('enroll-result').hidden=true;planSelect.value=button.dataset.plan;updatePlan();openDialog(enroll,button);
  }));planSelect.addEventListener('change',updatePlan);
  document.getElementById('learner-email').addEventListener('input',event=>event.target.setCustomValidity(''));
  document.getElementById('enroll-form').addEventListener('submit',event=>{
    event.preventDefault();const email=document.getElementById('learner-email'),name=document.getElementById('learner-name');
    if(!validEmail(email.value)){email.setCustomValidity('Vui lòng nhập email đầy đủ, ví dụ ban@example.com.');email.reportValidity();return;}
    if(!name.value.trim()){name.setCustomValidity('Vui lòng nhập tên của bạn.');name.reportValidity();return;}
    const result=document.getElementById('enroll-result');result.replaceChildren();result.className='enroll-result';
    const title=document.createElement('h3');title.textContent=`Hẹn gặp bạn, ${name.value.trim()}!`;
    const description=document.createElement('p');description.textContent=`Bạn vừa chọn ${plans[planSelect.value].name} — ${money(plans[planSelect.value].price)}. Đây là kết quả đăng ký mẫu, chưa có đơn hàng hoặc khoản thanh toán nào được tạo.`;
    const note=document.createElement('p');note.textContent='Thông tin không được gửi đi hay lưu vào máy chủ.';
    const button=document.createElement('button');button.className='button';button.textContent='Trở lại khám phá ↗';button.addEventListener('click',()=>enroll.close());
    result.append(title,description,note,button);event.target.hidden=true;result.hidden=false;
  });document.getElementById('learner-name').addEventListener('input',event=>event.target.setCustomValidity(''));
  const projects=[
    {title:'Một góc của riêng bạn.',description:'Tạo một căn phòng bằng các hình khối đơn giản: bàn làm việc, màn hình, ghế và cây. Thử nhiều bảng màu và thiết lập ánh sáng để tìm được không khí bạn muốn.',skills:['Geometry và bố cục không gian','Material, ánh sáng và bóng đổ','Điều khiển camera và chuyển bảng màu']},
    {title:'Vũ trụ trong trình duyệt.',description:'Sắp xếp hình khối, tạo quỹ đạo cho các vật thể và điều khiển nhịp chuyển động bằng thời gian. Một bài thực hành về toán đơn giản và chuyển động có chủ đích.',skills:['Quỹ đạo bằng sin và cos','Particles và vòng lặp animation','Điều chỉnh tốc độ và độ sâu']},
    {title:'Chuyển động thành cảm xúc.',description:'Tạo các họa tiết và làm bề mặt chuyển động theo thời gian. Thử màu sắc, biên độ sóng và phản hồi theo con trỏ.',skills:['Vertex và fragment shader','Uniforms, màu sắc và noise','Kết nối shader với thời gian và con trỏ']}
  ];
  function showProject(index,opener,tag){const item=projects[index];document.getElementById('project-tag').textContent=tag||`DỰ ÁN ${String(index+1).padStart(2,'0')} / CONCEPT THỰC HÀNH`;document.getElementById('project-title').textContent=item.title;document.getElementById('project-description').textContent=item.description;const list=document.getElementById('project-skills');list.replaceChildren();item.skills.forEach(text=>{const li=document.createElement('li');li.textContent=text;list.append(li);});openDialog(projectDialog,opener);}
  function showOutline(module,title,opener){
    document.getElementById('project-tag').textContent=`${module.tag} / NỘI DUNG DỰ KIẾN`;
    document.getElementById('project-title').textContent=title;
    document.getElementById('project-description').textContent=`${module.description} Bài này thuộc lộ trình concept, chưa có video giảng dạy. Bạn có thể thử ba bài thực hành miễn phí.`;
    const list=document.getElementById('project-skills');list.replaceChildren();
    [module.title,`${module.count} bài trong chương · ${module.hours}`,'Ứng dụng kiến thức vào dự án thực hành'].forEach(text=>{const li=document.createElement('li');li.textContent=text;list.append(li);});openDialog(projectDialog,opener);
  }
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>showProject(Number(button.dataset.project),button)));
  function goToProject(index,behavior='smooth'){
    const g=projectGeometry,p=Math.max(0,Math.min(1,index/(projectCards.length-1)));
    scrollTo({top:g.top-headerHeight+p*(g.height-g.stageHeight),behavior});
  }
  function slideProjects(direction){
    if(projectSection.classList.contains('scroll-projects'))goToProject(projectIndex+direction);
    else projectWindow.scrollBy({left:direction*(projectCards[0].clientWidth+28),behavior:paused?'instant':'smooth'});
  }
  projectWindow.addEventListener('focusin',event=>{
    if(projectSection.classList.contains('scroll-projects')&&event.target.matches('[data-project]:focus-visible'))goToProject(Number(event.target.dataset.project),'instant');
  });
  document.getElementById('project-prev').addEventListener('click',()=>slideProjects(-1));document.getElementById('project-next').addEventListener('click',()=>slideProjects(1));
  document.querySelectorAll('.faq details').forEach(detail=>detail.addEventListener('toggle',measure));
  updateMotion();setModule(0);
})();
