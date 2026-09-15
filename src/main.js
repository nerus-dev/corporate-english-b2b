/* Local GSAP globals are loaded before this script. Content has no animation logic. */
/// <reference path="./vendor.d.ts" />
const $ = (/** @type {string} */ selector) => document.querySelector(selector);
const esc = (/** @type {string | number} */ value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char] ?? char));
const line = '<svg class="draw-line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30H1000"/></svg>';
const dot = '<i class="dot" aria-hidden="true"></i>';
/** @param {string} label @param {string} title @param {string} [sub] */
const heading = (label,title,sub='') => `<header class="scene-heading"><p class="eyebrow">${label}</p><h2>${title}</h2>${sub ? `<p class="subtitle">${sub}</p>`:''}</header>`;
const metrics = () => `<p class="target-label">Նախագծի թիրախային արդյունքները</p><div class="metrics"><div class="metric"><strong>${CONTENT.weeks}</strong><span>շաբաթ</span></div><div class="metric"><strong>${CONTENT.pilots}</strong><span>պիլոտ</span></div><div class="metric"><strong>${CONTENT.clients}</strong><span>վճարող ընկերություն</span></div></div>`;
const scenes = [
  `<div class="opening-copy"><p class="eyebrow">Նոր B2B ուղղություն</p><h1>Corporate<br><span>English</span><sup>↗</sup></h1><p class="project-definition">Նախագիծ՝ ${CONTENT.projectTitle}</p><p class="project-duration">Ժամկետ՝ 6 շաբաթ</p></div><div class="signal" aria-hidden="true"><svg viewBox="0 0 600 600"><defs><linearGradient id="signal-gradient" x2="1" y2="1"><stop stop-color="#65cb5e"/><stop offset="1" stop-color="#c3edbe"/></linearGradient></defs><circle class="signal-ring" cx="300" cy="300" r="205"/><circle class="signal-ring inner" cx="300" cy="300" r="140"/><path class="signal-path" d="M65 405L180 290L290 365L415 190L545 115"/><g class="signal-dots"><circle cx="65" cy="405" r="7"/><circle cx="180" cy="290" r="7"/><circle cx="290" cy="365" r="7"/><circle cx="415" cy="190" r="7"/><circle cx="545" cy="115" r="9"/></g></svg><span class="signal-label">Նոր հնարավորություն</span></div>`,
  `${heading('01 / Հնարավորություն','Անգլերենը՝<br><em>աշխատանքային գործիք</em>')}<div class="opportunity-map"><div class="people"><svg viewBox="0 0 210 155" aria-label="Ընկերության աշխատակիցներ" role="img">${[40,105,170].map((x,i)=>`<g opacity="${i===1?1:0.55}"><circle cx="${x}" cy="${i===1?36:48}" r="17"/><path d="M${x-25} 135v-42q25-30 50 0v42"/></g>`).join('')}</svg><span>Աշխատակիցներ</span></div><div class="gap"><span class="gap-before">Ընդհանուր գիտելիք</span><div class="bridge-line"></div><strong class="gap-after">Կիրառական կարիք</strong></div><div class="work-scenarios">${CONTENT.work.map((x,i)=>`<div class="work-item"><span class="work-icon">${['↗','@','▤','⇄'][i]}</span>${x}</div>`).join('')}</div></div><p class="scene-bottom reveal">Կարիքների տարբերությունը՝ նոր ծառայության հնարավորություն</p>`,
  `${heading('02 / Գաղափարի ձևավորում','Կարիքից՝ <em>նախագիծ</em>')}<div class="formation"><div class="formation-track">${line}${CONTENT.formation.map((x,i)=>`<div class="formation-node"><span class="node-index">0${i+1}</span>${dot}<h3>${x}</h3><p>${CONTENT.formationDetail[i]}</p></div>`).join('')}</div></div><div class="idea-reasons"><span>Կոնկրետ B2B կարիք</span><i>→</i><span>Արագ MVP փորձարկում</span><i>→</i><span>Չափելի շուկայական արձագանք</span></div><p class="formation-result">Corporate English B2B ծառայություն</p>`,
  `${heading('03 / Ի՞նչ ենք ստեղծում','Լեզու՝ իրական<br><em>աշխատանքի համար</em>')}<div class="engine-flow"><div class="company"><svg viewBox="0 0 110 130" role="img" aria-label="Ընկերություն"><path d="M15 115V25h60v90M75 55h22v60M0 115h110M31 44h10m12 0h10M31 62h10m12 0h10M31 80h10m12 0h10M40 115V98h18v17"/></svg><span>Ընկերության<br>իրավիճակներ</span></div><div class="engine-wire">→</div><div class="engine"><span class="eyebrow">Հարմարեցվող ծրագիր</span><strong>Corporate<br>English</strong><span class="engine-tag">B2B ծառայություն / MVP</span></div><div class="engine-wire">→</div><div class="engine-output">${CONTENT.work.map(x=>`<span class="reveal">${x}</span>`).join('')}</div></div><p class="scene-bottom reveal">Ուսուցում՝ հարմարեցված աշխատանքի իրական իրավիճակներին</p>`,
  `${heading('04 / SMART նպատակ','Հստակ վերջնակետ։<br><em>Չափելի արդյունք։</em>')}${metrics()}<div class="smart-letters">${['S','M','A','R','T'].map((x,i)=>`<span>${x}<small>${['Ծառայություն','Չափելի','MVP ծավալ','Պահանջարկի ստուգում','6 շաբաթ'][i]}</small></span>`).join('')}</div><p class="scene-bottom smart-summary">Մշակել → փորձարկել → շուկա դուրս բերել</p>`,
  `${heading('05 / Հիմնական խնդիրներ','Նպատակին տանող <em>ճանապարհը</em>')}<div class="travel-window tasks-window"><div class="task-track">${line}${CONTENT.tasks.map((x,i)=>`<div class="task-node"><span class="node-index">${String(i+1).padStart(2,'0')}</span>${dot}<h3>${x}</h3><p>${CONTENT.taskDetail[i]}</p></div>`).join('')}</div></div><div class="track-caption"><span>Հետազոտություն</span><span class="accent">→</span><span>Առաջին վաճառք</span></div>`,
  `${heading('06 / Ինչո՞ւ է նախագիծ','Ստեղծել։ Փորձարկել։<br><em>Ավարտել։</em>')}<div class="proof-principles">${CONTENT.principles.map(x=>`<span class="reveal">${x}</span>`).join('')}</div><div class="project-boundary"><div class="bounded"><span class="boundary-label">Սկիզբ</span><div class="bounded-line">${dot}<strong>${CONTENT.weeks} շաբաթ</strong>${dot}</div><span class="boundary-label">Նոր արդյունք</span></div><div class="operations"><div class="operations-line"></div><span>Շարունակական ուսուցում →</span></div></div><div class="boundary-copy"><p>Corporate English B2B ծառայության ստեղծումն ու շուկա դուրսբերումը՝ <em>նախագիծ է։</em></p><p class="operations-copy">Ծառայության հետագա մշտական իրականացումը՝ <em>օպերացիոն գործունեություն է։</em></p></div>`,
  `${heading('07 / Մեկ ուսանող · մի քանի դեր','Պահել ամբողջը<br><em>մեկ տրամաբանության մեջ</em>')}<div class="pm-system"><svg viewBox="0 0 700 430" aria-hidden="true">${CONTENT.pm.map((_,i)=>{const a=i*Math.PI/4;return `<line x1="350" y1="215" x2="${350+270*Math.cos(a)}" y2="${215+175*Math.sin(a)}"/>`;}).join('')}<ellipse cx="350" cy="215" rx="270" ry="175"/></svg><div class="pm-center"><span class="pm-symbol">◎</span><strong>Project Manager</strong><small>Կառավարում + հիմնական իրականացում</small></div>${CONTENT.pm.map((x,i)=>{const a=i*Math.PI/4;return `<span class="orbit-node" style="--x:${50+38.57*Math.cos(a)}%;--y:${50+40.7*Math.sin(a)}%">${x}</span>`;}).join('')}</div>`,
  `${heading('08 / Կառավարման մոտեցում','Հստակություն և <em>ճկունություն</em>')}<div class="approaches"><div class="waterfall"><h3>Waterfall</h3><svg viewBox="0 0 360 95" aria-hidden="true"><path d="M10 20h100v25h120v25h120"/><circle cx="10" cy="20" r="5"/><circle cx="350" cy="70" r="5"/></svg><p>Պլան → մշակում → մեկնարկ</p><small>Միայն կոշտ պլան՝ չստուգված լուծման ռիսկ</small></div><div class="agile"><h3>Agile</h3><svg viewBox="0 0 360 95" aria-hidden="true"><path d="M95 45c0-45 170-45 170 0s-170 50-170 0m-10 8 10-10 10 10"/></svg><p>MVP → փորձարկում → Feedback ↻</p><small>Ընկերությունների արձագանքով բարելավվող ծառայություն</small></div></div><div class="agile-result"><strong>Agile<span>↗</span></strong><p>Ընտրված մոտեցում՝ Agile / ճկուն</p><div class="agile-contract"><span>Փորձարկել<small>MVP → պիլոտներ → ընկերությունների Feedback</small></span><i>+</i><span>Բարելավել<small>Ծրագիր · ձևաչափ · գին · առաջարկ<br>→ վերջնական ծառայություն</small></span></div></div>`,
  `${heading('09 / Իրականացման պլան','Վեց շաբաթ՝<br><em>գաղափարից մինչև վաճառք</em>')}<div class="travel-window roadmap-window"><div class="roadmap-track">${line}${CONTENT.roadmap.map((x,i)=>`<div class="week-node"><span class="week-number"><small>ՇԱԲԱԹ</small>0${i+1}</span>${dot}<h3>${x[0]}</h3><p>${x[1]}</p>${i===4?`<span class="week-note">${CONTENT.pilots} պիլոտ → Feedback</span>`:''}</div>`).join('')}</div></div><p class="scene-bottom">Պլանը սահմանված է։ Ծառայությունը՝ բաց բարելավման համար։</p>`,
  `<div class="final-pre">${heading('10 / Թիրախային արդյունք','Գաղափարը՝ <em>ստուգված ծառայություն</em>')}${metrics()}</div><div class="final-statement"><span class="final-symbol" aria-hidden="true">↗</span><p class="eyebrow">Նախագծի թիրախային արդյունքը</p><h2>Փորձարկված և շուկա<br>դուրս բերված<br><em>Corporate English B2B</em><br>ծառայություն</h2><p class="final-flow">Գաղափար <span>→</span> Փորձարկում <span>→</span> Մեկնարկ</p><p class="final-criteria">Ծրագիր + գին + առաջարկ · ${CONTENT.pilots} պիլոտ + Feedback<br>Բարելավում + ${CONTENT.clients} հաճախորդ + վաճառքի պատրաստ տարբերակ</p></div>`
];
const story = $('#story');
if (story) story.innerHTML = scenes.map((html,i)=>`<section id="scene-${i}" class="scene scene-${i}" aria-label="${esc(CONTENT.chapters[i])}"><div class="stage"><div class="scene-inner">${html}</div></div></section>`).join('');
const organization = $('#organization');
if (organization) organization.textContent = CONTENT.organization;
document.title = `${CONTENT.organization} · Corporate English B2B`;
const sections = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('.scene')]);
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const compactQuery = matchMedia('(max-width: 700px)');
let activeScene = 0;
let updatePending = false;
const mascot = /** @type {HTMLElement|null} */ ($('.mascot-position'));
const mascotSprite = /** @type {HTMLElement|null} */ ($('.mascot-sprite'));
/** Scroll positions at which each fixed scene has fully entered. */
let fixedAnchors = /** @type {number[]} */ ([]);
let fixedStarts = /** @type {number[]} */ ([]);
let storyDuration = 0;
function syncFixedAnchors() {
  const distance = Math.max(0,document.documentElement.scrollHeight-innerHeight);
  fixedAnchors = fixedStarts.map((time,i)=>i===0?0:(time+.55)/storyDuration*distance);
}
function updateProgress() {
  updatePending = false;
  const y = scrollY;
  activeScene = fixedAnchors.length
    ? fixedAnchors.reduce((current,position,i)=>position <= y+4 ? i : current,0)
    : sections.reduce((current,section,i)=>section.offsetTop <= y + innerHeight * .42 ? i : current,0);
  const number = $('#chapter-number');
  const name = $('#chapter-name');
  if (number) number.textContent = String(activeScene).padStart(2,'0');
  if (name) name.textContent = CONTENT.chapters[activeScene] ?? '';
  const max = document.documentElement.scrollHeight-innerHeight;
  const progress = max > 0 ? Math.min(100,y/max*100) : 100;
  const bar = /** @type {HTMLElement|null} */ ($('.progress > div'));
  if (bar) bar.style.transform = `scaleX(${progress/100})`;
  $('.progress')?.setAttribute('aria-valuenow',String(Math.round(progress)));
  // Transparent walking frames advance with scroll distance and rest when it stops.
  if (mascot && mascotSprite) {
    mascot.style.left = `${progress}%`;
    const frame = motionQuery.matches ? 0 : Math.floor(Math.max(0,y)/28)%4;
    mascotSprite.style.backgroundPosition = `${frame/3*100}% 50%`;
  }
  document.body.classList.toggle('past-opening',y>innerHeight*.5);
}
addEventListener('scroll',()=>{if(!updatePending){updatePending=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress);
/** @returns {number[]} */
function anchors(){return fixedAnchors.length ? fixedAnchors : sections.map(s=>s.offsetTop);}
addEventListener('keydown',event=>{
  const target = event.target;
  if (event.altKey||event.ctrlKey||event.metaKey||target instanceof HTMLElement && (target.isContentEditable||/INPUT|TEXTAREA|SELECT|BUTTON/.test(target.tagName))) return;
  const targetY = StoryNavigation.target(anchors(),scrollY,event.key);
  if(targetY===null)return;
  event.preventDefault();
  const y = event.key==='End' ? document.documentElement.scrollHeight-innerHeight : targetY;
  window.scrollTo({top:y,behavior:motionQuery.matches?'instant':'smooth'});
});
$('.skip')?.addEventListener('click',event=>{
  if(!fixedAnchors.length)return;
  event.preventDefault();
  window.scrollTo({top:fixedAnchors[1],behavior:'instant'});
  sections[1].setAttribute('tabindex','-1');
  sections[1].focus({preventScroll:true});
});
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0,0);

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 701px)',()=>{
    document.body.classList.add('animated');
    const master = gsap.timeline({paused:true});
    const stages = sections.map(section=>section.querySelector('.stage'));
    gsap.set(stages,{autoAlpha:0});
    gsap.set(stages[0],{autoAlpha:1});
    fixedStarts = [];
    let cursor = 0;
    sections.forEach((section,i)=>{
      const q = (/** @type {string} */ selector)=>section.querySelectorAll(selector);
      const tl = gsap.timeline();
      tl.to({}, {duration:.2});
      if(i===0){
        tl.fromTo(q('.signal-path'),{strokeDashoffset:800},{strokeDashoffset:0,duration:2},0);
        tl.from(q('.signal-dots circle'),{opacity:.15,scale:.2,transformOrigin:'center',stagger:.17,duration:.7},0);
        tl.to(q('.signal-ring'),{rotation:35,scale:.88,transformOrigin:'center',duration:2},0);
        tl.to(q('.signal'),{x:-70,scale:1.06,duration:1},1.2);
      }
      if(i===1){tl.from(q('.work-item'),{opacity:.1,x:40,stagger:.15,duration:.5},.1);tl.from(q('.bridge-line'),{scaleX:0,transformOrigin:'left',duration:1},.4);tl.from(q('.gap-after'),{opacity:0,y:12,duration:.5},.8);}
      if(i===2){tl.from(q('.formation-node'),{opacity:.05,y:24,stagger:.3,duration:.4},0);tl.from(q('.draw-line path'),{strokeDashoffset:1000,duration:1.8},0);tl.from(q('.formation-result'),{opacity:0,y:18,duration:.4},1.8);}
      if(i===3){tl.from(q('.engine'),{scale:.88,opacity:.2,duration:.8},0);tl.from(q('.engine-wire'),{scaleX:0,stagger:.4,duration:.8},.1);}
      if(i===4){tl.from(q('.metric'),{opacity:.06,y:32,stagger:.6,duration:.5},0);tl.from(q('.smart-letters > span'),{opacity:0,y:12,stagger:.15,duration:.4},1.5);tl.from(q('.smart-summary'),{opacity:0,duration:.5},2.3);}
      if(i===5||i===9){const track=/** @type {HTMLElement} */(section.querySelector(i===5?'.task-track':'.roadmap-track'));const viewport=/** @type {HTMLElement} */(track.parentElement);tl.to(track,{x:()=>-Math.max(0,track.scrollWidth-viewport.clientWidth+32),ease:'none',duration:i===5?5:4},.2);}
      if(i===6){tl.from(q('.bounded-line'),{scaleX:.2,transformOrigin:'left',duration:1},0);tl.from(q('.operations-line'),{opacity:0,x:30,duration:.8},1.2);}
      if(i===7){tl.from(q('.orbit-node'),{opacity:.03,scale:.7,stagger:.2,duration:.6},0);tl.from(q('.pm-system line'),{opacity:0,stagger:.15,duration:.6},0);}
      if(i===8){tl.to(q('.waterfall'),{xPercent:30,opacity:0,scale:.7,duration:1},.6);tl.to(q('.agile'),{xPercent:-30,opacity:0,scale:.7,duration:1},.6);tl.from(q('.agile-result'),{opacity:0,scale:.86,y:25,duration:1},1.3);}
      if(i===10){tl.to(q('.final-pre'),{opacity:0,y:-50,duration:.9},.4);tl.from(q('.final-statement'),{opacity:0,y:55,duration:1},1.1);}
      if(q('.reveal').length)tl.from(q('.reveal'),{opacity:.05,y:15,stagger:.14,duration:.6},.2);
      tl.to({}, {duration:.65});
      fixedStarts.push(cursor);
      master.addLabel(`scene-${i}`,cursor);
      if(i>0){
        master.fromTo(stages[i],{autoAlpha:0},{autoAlpha:1,duration:.55,ease:'power1.inOut',immediateRender:false},cursor);
        master.fromTo(q('.scene-inner'),{y:24},{y:0,duration:.65,ease:'power2.out',immediateRender:false},cursor);
      }
      master.add(tl,cursor+.3);
      cursor += tl.duration()+.3;
      if(i<sections.length-1){
        master.to(stages[i],{autoAlpha:0,duration:.45,ease:'power1.inOut'},cursor);
        master.to(q('.scene-inner'),{y:-18,duration:.45,ease:'power1.inOut'},cursor);
        cursor += .4;
      }
    });
    storyDuration = master.duration();
    const setStoryHeight = ()=>{
      gsap.set(story,{height:innerHeight*(storyDuration*.7+1)});
      syncFixedAnchors();
    };
    setStoryHeight();
    ScrollTrigger.addEventListener('refreshInit',setStoryHeight);
    ScrollTrigger.create({
      trigger:story,start:'top top',end:'bottom bottom',animation:master,
      scrub:true,invalidateOnRefresh:true,onRefresh:syncFixedAnchors,
      onUpdate:()=>{
        // Invisible layers must not intercept input or remain in the accessibility tree.
        stages.forEach(stage=>{
          if(stage instanceof HTMLElement) stage.inert=Number(gsap.getProperty(stage,'opacity'))<.5;
        });
      }
    });
    return ()=>{
      ScrollTrigger.removeEventListener('refreshInit',setStoryHeight);
      fixedAnchors=[];fixedStarts=[];
      stages.forEach(stage=>{if(stage instanceof HTMLElement)stage.inert=false;});
      document.body.classList.remove('animated');
    };
  });
} else {
  document.body.classList.add('static-mode');
}
updateProgress();
// ScrollTrigger refresh and browser restoration may run after deferred scripts.
// Reset after that lifecycle, including back-forward cache restores.
addEventListener('pageshow',()=>{
  requestAnimationFrame(()=>{
    if(typeof ScrollTrigger!=='undefined') ScrollTrigger.clearScrollMemory('manual');
    window.scrollTo({top:0,behavior:'instant'});
    updateProgress();
  });
});
