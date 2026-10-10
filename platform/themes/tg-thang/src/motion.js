import { setupSolutionsMotion } from './solutions-motion.js';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.max(0, Math.min(1, value));
const animations = new Set();

// Content remains visible by default. Only intersecting headings are animated;
// an interrupted animation always restores the final, readable state.
function animate(element, frames, options) {
  if (reduced.matches) return;
  const animation = element.animate(frames, options);
  animations.add(animation);
  animation.finished.catch(() => {}).finally(() => { animations.delete(animation); animation.cancel(); });
}
const headingObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    headingObserver.unobserve(entry.target);
    entry.target.querySelectorAll('.motion-line').forEach((line, index) => {
      animate(line.querySelector('.motion-ink'), [{opacity:0},{opacity:0,offset:.35},{opacity:1,offset:.36},{opacity:1}], {duration:850,delay:index*90,fill:'backwards'});
      animate(line.querySelector('.motion-mask'), [
        {transform:'scaleX(0)',transformOrigin:'left'},
        {transform:'scaleX(1)',transformOrigin:'left',offset:.35},
        {transform:'scaleX(1)',transformOrigin:'right',offset:.5},
        {transform:'scaleX(0)',transformOrigin:'right'},
      ], {duration:850,delay:index*90,easing:'cubic-bezier(.65,0,.25,1)',fill:'backwards'});
    });
  }
}, {rootMargin:'0px 0px -8% 0px',threshold:0});
document.querySelectorAll('main h1, main h2, #giai-phap h3, .value-intro h2, .contact-block h2').forEach(heading => {
  if (heading.closest('.statement')) return;
  const lines = [[]];
  [...heading.childNodes].forEach(node => node.nodeName === 'BR' ? lines.push([]) : lines.at(-1).push(node));
  heading.setAttribute('aria-label', lines.map(nodes => nodes.map(n => n.textContent).join('')).join(' '));
  const wrapped = lines.map(nodes => {
    const line = document.createElement('span'); line.className = 'motion-line'; line.setAttribute('aria-hidden','true');
    const ink = document.createElement('span'); ink.className = 'motion-ink'; ink.append(...nodes);
    const mask = document.createElement('span'); mask.className = 'motion-mask';
    line.append(ink,mask); return line;
  });
  heading.replaceChildren(...wrapped); headingObserver.observe(heading);
});

const statement = document.querySelector('.statement');
const statementTitle = statement.querySelector('h2');
statementTitle.setAttribute('aria-label',statementTitle.innerText.replace(/\n/g,' '));
const statementWords = [];
[...statementTitle.childNodes].forEach(node => {
  if (node.nodeType !== Node.TEXT_NODE) return;
  const fragment = document.createDocumentFragment();
  node.textContent.split(/(\s+)/).forEach(word => {
    if (!word.trim()) {fragment.append(document.createTextNode(word));return;}
    const span=document.createElement('span');span.className='statement-word';span.textContent=word;span.setAttribute('aria-hidden','true');
    statementWords.push(span);fragment.append(span);
  });
  node.replaceWith(fragment);
});

// Roll only the label; arrows and the native button's accessible name stay intact.
document.querySelectorAll('.outline-button:not(#projects-all), .solid-button').forEach(button => {
  if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label',[...button.childNodes].filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('aria-hidden') !== 'true')).map(node => node.textContent).join(' ').trim());
  [...button.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()).forEach(node => {
    const label = document.createElement('span');label.className='button-label';
    label.dataset.label=node.textContent.trim();label.textContent=node.textContent.trim();node.replaceWith(label);
  });
});

const photos = [...document.querySelectorAll('.wide-photo, .approach-photo, .company>figure')];
photos.forEach(figure => {
  figure.classList.add('motion-photo');
  const target=figure.querySelector('figcaption span:last-child');
  figure.addEventListener('pointermove',event => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    const rect=figure.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    figure.style.setProperty('--cursor-x',`${x}px`);figure.style.setProperty('--cursor-y',`${y}px`);
    if (figure.matches('.approach-photo') && target) target.textContent=`X: ${Math.round(x)} / Y: ${Math.round(y)}`;
  },{passive:true});
});
const video=document.getElementById('construction-video');
const videoButton=document.getElementById('video-toggle');
let videoVisible=false, videoPausedByUser=false;
function updateVideo() {
  if (!video) return;
  if (videoVisible && !videoPausedByUser && !reduced.matches && !document.hidden) {
    video.play().catch(() => {videoButton.hidden=false;});
  } else video.pause();
}
if (video) {
  new IntersectionObserver(entries => {videoVisible=entries[0].isIntersecting;updateVideo();},{threshold:.15}).observe(video);
  video.addEventListener('playing',() => {videoButton.textContent='Tạm dừng video Ⅱ';videoButton.setAttribute('aria-pressed','false');});
  video.addEventListener('pause',() => {videoButton.textContent='Phát video ▶';videoButton.setAttribute('aria-pressed','true');});
  video.addEventListener('error',() => {video.hidden=true;videoButton.hidden=true;});
  videoButton.addEventListener('click',() => {
    videoPausedByUser=!video.paused;
    if (video.paused) video.play().catch(() => {}); else video.pause();
  });
}

const system=document.getElementById('he-thong'),header=document.querySelector('.site-header');
document.querySelectorAll('.menu-grid nav a').forEach((link,index) => link.style.setProperty('--menu-index',index));
let frame=0;
function drawScroll() {
  frame=0;
  const height=innerHeight;
  const rect=statement.getBoundingClientRect();
  const progress=clamp((height*.85-rect.top)/Math.max(1,rect.height*.75));
  statementWords.forEach((word,index) => {word.style.opacity=reduced.matches?1:.2+.8*clamp(progress*statementWords.length-index);});
  for (const figure of photos) {
    const rect=figure.getBoundingClientRect();
    if(rect.bottom<0 || rect.top>height) continue;
    const progress=clamp((height-rect.top)/(height+rect.height));
    figure.style.setProperty('--photo-shift',reduced.matches?'0%':`${(progress-.5)*12}%`);
  }
  const dark=system.getBoundingClientRect();
  header.classList.toggle('over-dark',dark.top<=header.clientHeight && dark.bottom>header.clientHeight);
}
function requestScroll() {if(!frame && !document.hidden) frame=requestAnimationFrame(drawScroll);}
window.addEventListener('scroll',requestScroll,{passive:true});
window.addEventListener('resize',requestScroll);
document.addEventListener('visibilitychange',() => {updateVideo();requestScroll();});
reduced.addEventListener('change',() => {animations.forEach(animation => animation.cancel());updateVideo();requestScroll();});
requestScroll();
setupSolutionsMotion({animate,reduced});
