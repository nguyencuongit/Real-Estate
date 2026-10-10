import { solutionStackLayout } from './motion-state.mjs';

export function setupSolutionsMotion({animate,reduced}) {
  const section=document.getElementById('giai-phap');
  const stack=section.querySelector('.solution-stack');
  const bodies=[...stack.querySelectorAll('.solution-body')];
  const media=[...stack.querySelectorAll('.solution-media')];
  const tags=[...section.querySelectorAll('.section-tag')];
  const header=document.querySelector('.site-header');

  tags.forEach(tag => {
    const nodes=[...tag.childNodes].filter(node => node.nodeType===Node.TEXT_NODE);
    const text=nodes.map(node => node.textContent).join('').trim();
    const accessible=document.createElement('span');accessible.className='motion-tag-label';accessible.textContent=text;
    const letters=document.createElement('span');letters.className='tag-letters';letters.setAttribute('aria-hidden','true');
    [...text].forEach(character => {
      const letter=document.createElement('span');letter.className='tag-letter';letter.textContent=character===' '?'\u00a0':character;letters.append(letter);
    });
    nodes.forEach(node => node.remove());tag.prepend(accessible,letters);
  });

  const observer=new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target=entry.target;
      // A clipping animation changes the intersection itself. Observe entry
      // once so the reveal cannot repeatedly restart and keep an image masked.
      observer.unobserve(target);
      target.dataset.motionEntered='true';
      if (target.classList.contains('section-tag')) {
        target.querySelectorAll('.tag-letter').forEach((letter,index) => animate(letter,
          [{transform:'translateY(110%)'},{transform:'translateY(0)'}],
          {duration:500,delay:index*24,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
      } else if (target.classList.contains('solution-media')) {
        animate(target,[{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0)'}],
          {duration:900,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
      } else {
        animate(target,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],
          {duration:650,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
      }
    });
  },{rootMargin:'0px 0px -10% 0px',threshold:.1});
  [...tags,...media,...bodies.map(body => body.querySelector('p'))].forEach(target => observer.observe(target));

  // Measure the text, rather than assuming that all desktop windows are tall.
  // Fall back to the normal flow whenever the entire card cannot fit.
  function layout() {
    const contentHeight=Math.max(...bodies.map(body => {
      const style=getComputedStyle(body);
      const children=[...body.children];
      return parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)
        + children.reduce((height,child) => height+child.offsetHeight,0)
        + parseFloat(style.rowGap)*(children.length-1)
        + parseFloat(getComputedStyle(body.querySelector('h3')).marginBottom)+2;
    }));
    const state=solutionStackLayout({width:innerWidth,height:innerHeight,header:header.clientHeight,contentHeight,reduced:reduced.matches});
    stack.style.setProperty('--stack-gap',`${state.gap}px`);
    stack.style.setProperty('--solution-height',`${state.cardHeight}px`);
    stack.classList.toggle('can-stack',state.enabled);
  }
  new ResizeObserver(layout).observe(section.querySelector('.section-heading'));
  bodies.forEach(body => new ResizeObserver(layout).observe(body));
  document.fonts.ready.then(layout);
  window.addEventListener('resize',layout);
  reduced.addEventListener('change',() => {layout();requestScroll();});

  let frame=0;
  function drawScroll() {
    frame=0;
    media.forEach(figure => {
      const rect=figure.getBoundingClientRect();
      if (rect.bottom<0 || rect.top>innerHeight) return;
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
      figure.querySelector('img').style.transform=reduced.matches?'none':`translateY(${(progress-.5)*28}px) scale(1.08)`;
    });
  }
  function requestScroll() {if(!frame) frame=requestAnimationFrame(drawScroll);}
  window.addEventListener('scroll',requestScroll,{passive:true});
  window.addEventListener('resize',requestScroll);
  layout();requestScroll();
}
