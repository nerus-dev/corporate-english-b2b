(()=>{
const deck = /** @type {HTMLElement|null} */ (document.querySelector('#deck'));
/** @param {string|number} value */
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char] ?? char));
/** @param {number} number @param {string} eyebrow @param {string} title @param {string} [sub] */
const heading = (number, eyebrow, title, sub = '') => `<header class="slide-heading"><p>${String(number).padStart(2,'0')} · ${esc(eyebrow)}</p><h1>${title}</h1>${sub ? `<div class="slide-sub">${sub}</div>` : ''}</header>`;
/** @param {string[]} items @param {string} [className] */
const simpleCards = (items, className = 'simple-cards') => `<div class="${className}">${items.map((item,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(item)}</strong></article>`).join('')}</div>`;
/** @param {string[]} items */
const flow = items => `<div class="flow">${items.map((item,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(item)}</strong></article>${i<items.length-1?'<i>→</i>':''}`).join('')}</div>`;

const scenes = [
  `<div class="opening-mark">02</div>${heading(1,'Ելակետ','Նույն նախագիծը։<br><em>Նոր՝ իրագործման պլան։</em>','Առաջադրանք 1-ում արդեն հիմնավորել ենք գաղափարը և ընտրել ճկուն մոտեցումը։')}<div class="project-line"><span>Նախագիծ</span><strong>${esc(INTEGRATION_CONTENT.project)}</strong><small>${esc(INTEGRATION_CONTENT.organization)}</small></div><p class="section-label">Թիրախներ են, ոչ արդեն ստացված արդյունքներ</p><div class="target-row">${INTEGRATION_CONTENT.targets.map(x=>`<strong>${esc(x)}</strong>`).join('')}</div>`,
  `${heading(2,'Առաջադրանք 2','Մեկ պարզ և<br><em>իրագործելի պլան։</em>','Այս անգամ չենք կրկնում գաղափարի հիմնավորումը, SMART նպատակը կամ ճկուն մոտեցման ընտրությունը։')}<div class="big-question">Ո՞վ → ի՞նչ → ե՞րբ → ի՞նչ արդյունքով</div><p class="bottom-line">Բոլոր աշխատանքները կապում ենք մեկ հերթականության մեջ։</p>`,
  `${heading(3,'Նախագծի սահմանները','Ի՞նչ ենք անում,<br><em>ի՞նչ՝ ոչ։</em>')}<div class="two-columns"><section><h2>Նախագծի մեջ է</h2>${simpleCards(INTEGRATION_CONTENT.boundariesIn,'mini-list')}</section><section class="muted"><h2>Նախագծից դուրս է</h2>${simpleCards(INTEGRATION_CONTENT.boundariesOut,'mini-list')}</section></div><p class="bottom-line"><b>Տարբերությունը․</b> ծառայության ստեղծումն ու փորձարկումը նախագիծ է, մշտական դասավանդումը՝ ընթացիկ աշխատանք։</p>`,
  `${heading(4,'Կարիքների ուսումնասիրություն','Զանգում ենք MekStep-ի<br><em>B2B հաճախորդների բազայով։</em>','Վաճառքի պատասխանատուն բացահայտում է կարիքը։')}<div class="question-grid">${INTEGRATION_CONTENT.needQuestions.map(q=>`<div>${esc(q)}</div>`).join('')}</div><div class="answer-bar"><span>Պետք է ստանանք</span><strong>կարիքների նկարագիր՝ ըստ ոլորտների և մասնագիտական դերերի</strong></div>`,
  `${heading(5,'Ուղղության ընտրություն','Ծրագիրը՝ ըստ ոլորտի,<br><em>ոչ ըստ յուրաքանչյուր ընկերության։</em>','Միավորում ենք կրկնվող կարիքները և ընտրում ամենապահանջված ուղղությունը։')}<div class="direction-list">${INTEGRATION_CONTENT.directions.map((x,i)=>`<div><span>0${i+1}</span><strong>${esc(x)}</strong></div>`).join('')}</div><p class="bottom-line accent">Առաջին պիլոտի համար ընտրում ենք մեկ առաջնային ուղղություն։</p>`,
  `${heading(6,'Սպասվող արդյունքներ','Ի՞նչ պետք է պատրաստ լինի<br><em>նախագծի վերջում։</em>','Սրանք նախատեսվող արդյունքներ են։')} ${simpleCards(INTEGRATION_CONTENT.results)}`,
  `${heading(7,'Աշխատանքի բաժանում','Վեց մաս։<br><em>Մեկ ամբողջական նախագիծ։</em>')}<div class="work-grid">${INTEGRATION_CONTENT.workBlocks.map(x=>`<article><span>${esc(x[0])}</span><h2>${esc(x[1])}</h2><p>${esc(x[2])}</p></article>`).join('')}</div>`,
  `${heading(8,'Պիլոտի ընթացք','Փոքր խմբով<br><em>ստուգում ենք ծրագիրը։</em>','Պիլոտը չի անցկացվում ամբողջ ընկերության կամ բոլոր խմբերի համար։')}${flow(INTEGRATION_CONTENT.pilotSteps)}`,
  `${heading(9,'Աշխատանքի հերթականություն','Մի քայլի արդյունքը՝<br><em>հաջորդ քայլի հիմք։</em>')}${flow(INTEGRATION_CONTENT.sequence)}<p class="bottom-line">B2B շփումները սկսվում են առաջին շաբաթից, որպեսզի որոշումների համար ժամանակ մնա։</p>`,
  `${heading(10,'6-շաբաթյա պլան','Շաբաթ առ շաբաթ՝<br><em>հստակ արդյունք։</em>')}<div class="week-grid">${INTEGRATION_CONTENT.weeks.map(x=>`<article><span>Շաբաթ ${esc(x[0])}</span><strong>${esc(x[1])}</strong></article>`).join('')}</div><div class="manager-followup"><span>+ 1 շաբաթ</span><strong>Ընկերության ղեկավարի հետադարձ կապ</strong></div>`,
  `${heading(11,'Որակի ստուգում','Ինչպե՞ս ենք հասկանում,<br><em>որ ծրագիրն աշխատում է։</em>')}<div class="quality-grid">${INTEGRATION_CONTENT.qualityChecks.map((x,i)=>`<article><span>0${i+1}</span><h2>${esc(x[0])}</h2><p>${esc(x[1])}</p></article>`).join('')}</div><p class="bottom-line accent">Նպատակ՝ տեսանելի գործնական արդյունք և ընդլայնման հիմք։</p>`,
  `${heading(12,'Թիմը','Հինգ դեր։<br><em>Երեք պատասխանատու կողմ։</em>')}<div class="role-list">${INTEGRATION_CONTENT.roles.map((x,i)=>`<article><span>0${i+1}</span><div><h2>${esc(x[0])}</h2><p>${esc(x[1])}</p></div></article>`).join('')}</div>`,
  `${heading(13,'Ռիսկեր','Խնդիրը տեսնում ենք<br><em>մինչև այն առաջանա։</em>')}<div class="risk-list">${INTEGRATION_CONTENT.risks.map((x,i)=>`<article><span>0${i+1}</span><strong>${esc(x[0])}</strong><p>${esc(x[1])}</p></article>`).join('')}</div>`,
  `${heading(14,'Աշխատանքի տրամաբանություն','Ինչ ունենք → ինչ ենք անում →<br><em>ինչ ենք ստանում։</em>','Բարդ տերմինների փոխարեն՝ ամբողջ կապը մեկ պարզ աղյուսակում։')}<div class="work-table"><div class="table-head"><span>Բաժին</span><span>Ինչ ունենք</span><span>Ինչ ենք անում</span><span>Ինչ ենք ստանում</span></div>${INTEGRATION_CONTENT.workMap.map(row=>`<div class="table-row">${row.map((x,i)=>`<${i===0?'strong':'span'}>${esc(x)}</${i===0?'strong':'span'}>`).join('')}</div>`).join('')}</div>`,
  `${heading(15,'Փոփոխությունների կառավարում','Փոփոխությունը՝<br><em>միայն գնահատումից հետո։</em>')}${flow(INTEGRATION_CONTENT.changeSteps)}<p class="bottom-line">Որոշումը հաստատում է նախագծի ղեկավարը և թարմացնում ընդհանուր պլանը։</p>`,
  `${heading(16,'Ավարտի չափանիշներ','Ե՞րբ է նախագիծը<br><em>իրականում ավարտված։</em>','Բոլոր կետերը պետք է կատարված լինեն։')}<div class="check-grid">${INTEGRATION_CONTENT.completion.map(x=>`<div><span>✓</span><strong>${esc(x)}</strong></div>`).join('')}</div><div class="final-bar"><strong>Հաջորդ փուլ</strong><span>մշտական վաճառք և դասավանդում՝ որպես MekStep-ի ընթացիկ գործունեություն</span></div>`
];

if (deck) deck.innerHTML = scenes.map((html,i)=>`<section class="slide${i===0?' active':''}" id="scene-${String(i+1).padStart(2,'0')}" aria-label="${esc(INTEGRATION_CONTENT.chapters[i])}" ${i===0?'':'inert hidden'}><div class="slide-inner">${html}</div></section>`).join('');

const slides = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('.slide')]);
const previous = /** @type {HTMLButtonElement|null} */ (document.querySelector('#previous'));
const next = /** @type {HTMLButtonElement|null} */ (document.querySelector('#next'));
const statusNumber = document.querySelector('#scene-number');
const statusName = document.querySelector('#scene-name');
const progress = /** @type {HTMLElement|null} */ (document.querySelector('.deck-progress span'));
const mascot = /** @type {HTMLElement|null} */ (document.querySelector('.mascot-step'));
const hint = document.querySelector('.gesture-hint');
const toc = /** @type {HTMLElement|null} */ (document.querySelector('#toc'));
const tocOpen = /** @type {HTMLButtonElement|null} */ (document.querySelector('.toc-open'));
const tocClose = /** @type {HTMLButtonElement|null} */ (document.querySelector('.toc-close'));
const scrim = /** @type {HTMLElement|null} */ (document.querySelector('.toc-scrim'));
const tocList = /** @type {HTMLElement|null} */ (document.querySelector('#toc-list'));
let active = DeckNavigation.fromHash(location.hash,slides.length);
let locked = false;
/** @type {{x:number,y:number,id:number}|null} */
let pointerStart = null;
let suppressClickUntil = 0;

if (tocList) tocList.innerHTML = INTEGRATION_CONTENT.chapters.map((chapter,i)=>`<button type="button" data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span>${esc(chapter)}</button>`).join('');

/** @param {number} index @param {boolean} [updateHash] */
function render(index,updateHash=true){
  const target=DeckNavigation.clamp(index,slides.length);
  if(target===active && slides[target]?.classList.contains('active')) return;
  slides.forEach((slide,i)=>{
    const selected=i===target;
    slide.hidden=false;
    slide.toggleAttribute('inert',!selected);
    slide.classList.toggle('active',selected);
    slide.classList.toggle('before',i<target);
    if(!selected)setTimeout(()=>{if(!slide.classList.contains('active'))slide.hidden=true;},440);
  });
  active=target;
  if(statusNumber)statusNumber.textContent=`${String(active+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  if(statusName)statusName.textContent=INTEGRATION_CONTENT.chapters[active];
  if(progress)progress.style.transform=`scaleX(${(active+1)/slides.length})`;
  if(mascot){
    mascot.style.left=`${6+active/Math.max(1,slides.length-1)*88}%`;
    const sprite=/** @type {HTMLElement|null} */(mascot.querySelector('div'));
    if(sprite)sprite.style.backgroundPosition=`${-(active%4)*100}% 0`;
  }
  if(previous)previous.disabled=active===0;
  if(next)next.disabled=active===slides.length-1;
  document.querySelectorAll('#toc-list button').forEach((button,i)=>button.classList.toggle('current',i===active));
  document.body.classList.add('has-moved');
  if(updateHash)history.replaceState(null,'',DeckNavigation.hash(active));
}
/** @param {string} direction */
function move(direction){render(DeckNavigation.target(active,slides.length,direction));}
function closeToc(){if(toc)toc.hidden=true;if(scrim)scrim.hidden=true;tocOpen?.setAttribute('aria-expanded','false');}
function openToc(){if(toc)toc.hidden=false;if(scrim)scrim.hidden=false;tocOpen?.setAttribute('aria-expanded','true');tocClose?.focus();}
/** @param {EventTarget|null} target */
function interactiveTarget(target){return target instanceof Element && Boolean(target.closest('button,a,[role="button"]'));}

previous?.addEventListener('click',()=>move('previous'));
next?.addEventListener('click',()=>move('next'));
tocOpen?.addEventListener('click',openToc);
tocClose?.addEventListener('click',closeToc);
scrim?.addEventListener('click',closeToc);
tocList?.addEventListener('click',event=>{const button=/** @type {HTMLButtonElement|null} */((event.target instanceof Element?event.target.closest('button[data-index]'):null));if(button){render(Number(button.dataset.index));closeToc();}});

addEventListener('keydown',event=>{
  if(toc&&!toc.hidden&&event.key==='Escape'){closeToc();return;}
  /** @type {Record<string,string>} */
  const directions={ArrowRight:'next',ArrowDown:'next',PageDown:'next',' ':'next',ArrowLeft:'previous',ArrowUp:'previous',PageUp:'previous',Home:'first',End:'last'};
  const direction=directions[event.key];
  if(direction){event.preventDefault();move(direction);}
});
addEventListener('wheel',event=>{
  if((toc&&!toc.hidden)||Math.abs(event.deltaY)<14||locked)return;
  event.preventDefault();locked=true;move(event.deltaY>0?'next':'previous');
  setTimeout(()=>{locked=false;},650);
},{passive:false});

deck?.addEventListener('pointerdown',event=>{
  if(interactiveTarget(event.target))return;
  pointerStart={x:event.clientX,y:event.clientY,id:event.pointerId};
  deck.setPointerCapture?.(event.pointerId);
});
deck?.addEventListener('pointerup',event=>{
  if(!pointerStart||pointerStart.id!==event.pointerId)return;
  const dx=event.clientX-pointerStart.x;
  const dy=event.clientY-pointerStart.y;
  pointerStart=null;
  if(Math.max(Math.abs(dx),Math.abs(dy))>60){
    suppressClickUntil=Date.now()+500;
    move(Math.abs(dx)>Math.abs(dy)?(dx<0?'next':'previous'):(dy<0?'next':'previous'));
  }
});
deck?.addEventListener('pointercancel',()=>{pointerStart=null;});
deck?.addEventListener('click',event=>{
  if(Date.now()<suppressClickUntil||interactiveTarget(event.target)||(toc&&!toc.hidden))return;
  move(event.clientX<innerWidth/2?'previous':'next');
});
addEventListener('hashchange',()=>render(DeckNavigation.fromHash(location.hash,slides.length),false));

render(active,false);
if(hint)setTimeout(()=>hint.classList.add('soften'),7000);
})();
