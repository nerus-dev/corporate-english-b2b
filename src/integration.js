(()=>{
const deck = /** @type {HTMLElement|null} */ (document.querySelector('#deck'));
/** @param {string|number} value */
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char] ?? char));
/** @param {string} text @param {string} [className] */
const tag = (text, className = '') => `<span class="tag ${className}">${esc(text)}</span>`;
/** @param {string} number @param {string} eyebrow @param {string} title @param {string} [sub] */
const heading = (number, eyebrow, title, sub = '') => `<header class="slide-heading"><p>${esc(number)} · ${esc(eyebrow)}</p><h1>${title}</h1>${sub ? `<div class="slide-sub">${sub}</div>` : ''}</header>`;
/** @param {string[]} items @param {string} [className] */
const list = (items, className = 'line-list') => `<div class="${className}">${items.map(item => `<div>${esc(item)}</div>`).join('')}</div>`;

const scenes = [
  `<div class="opening-mark">02</div>${heading('Առաջադրանք 2','Ինտեգրված պլանավորում','Նույն նախագիծը։<br><em>Նոր կառավարման շերտ։</em>','<span class="continuation">Շարունակություն առաջադրանք 1-ից</span>')}<div class="opening-project"><span>Նախագիծ</span><strong>${esc(INTEGRATION_CONTENT.project)}</strong><small>${esc(INTEGRATION_CONTENT.organization)}</small></div><p class="opening-question">Ինչպե՞ս ենք scope-ը, ժամանակը, որակը, ռեսուրսը, ռիսկն ու ֆինանսը դարձնում մեկ իրագործելի պլան։</p>`,
  `${heading('02','Ինտեգրում','Մեկ փոփոխություն։<br><em>Վեց ազդեցություն։</em>')}<div class="domain-system"><div class="domain-center">Որոշում</div>${INTEGRATION_CONTENT.domains.map((d,i)=>`<div class="domain domain-${i}"><strong>${esc(d[0])}</strong><span>${esc(d[1])}</span></div>`).join('')}</div><p class="bottom-line">Փոփոխությունը հաստատվում է միայն ամբողջ ազդեցությունը տեսնելուց հետո։</p>`,
  `${heading('03','Հայաստանի բիզնես միջավայր','Ո՞ւմ հետ ենք<br><em>ստուգում վարկածը։</em>','Ոլորտային համատեքստը հիմք է ընտրության համար․ պահանջարկը դեռ պետք է ապացուցվի։')}<div class="evidence-grid">${INTEGRATION_CONTENT.evidence.map((row,i)=>`<article class="evidence-item"><span>0${i+1}</span><strong>${esc(row[0])}</strong><p>${esc(row[1])}</p></article>`).join('')}</div><div class="source-strip">Շուկայի փաստ ≠ MekStep-ի ապացուցված պահանջարկ</div>`,
  `${heading('04','Scope','Հստակ սահմանը<br><em>պաշտպանում է պլանը։</em>','<span class="carry-label">Նախորդից ընդունված թիրախներ</span>'+INTEGRATION_CONTENT.acceptedTargets.map(x=>tag(x)).join(''))}<div class="scope-columns"><section><h2>Ներառված է</h2>${list(INTEGRATION_CONTENT.scopeIn)}</section><section class="excluded"><h2>Դուրս է</h2>${list(INTEGRATION_CONTENT.scopeOut)}</section></div><div class="deliverable-row">${INTEGRATION_CONTENT.deliverables.map((x,i)=>`<span><b>0${i+1}</b>${esc(x)}</span>`).join('')}</div>`,
  `${heading('05','WBS','Ամբողջ աշխատանքը՝<br><em>վեց արդյունքային ճյուղով։</em>')}<div class="wbs-root"><span>0.0</span><strong>Corporate English B2B</strong></div><div class="wbs-grid">${INTEGRATION_CONTENT.wbs.map(row=>`<article><span>${esc(row[0])}</span><h2>${esc(row[1])}</h2><p>${esc(row[2])}</p></article>`).join('')}</div><p class="bottom-line">Ամենացածր փաթեթը ունի պատասխանատու, գնահատում և ստուգելի ելք։</p>`,
  `${heading('06','Work package','Ինչպե՞ս է ճյուղը<br><em>դառնում կառավարելի աշխատանք։</em>')}<div class="package-title"><span>5.0</span><strong>Պիլոտային ստուգում</strong></div><div class="package-flow">${INTEGRATION_CONTENT.packageExample.map((row,i)=>`<article><span>${esc(row[0])}</span><h2>${esc(row[1])}</h2><p>${esc(row[2])}</p>${i<2?'<i>→</i>':''}</article>`).join('')}</div><div class="package-meta"><span>Պատասխանատու</span><b>Պիլոտ / տվյալների դեր</b><span>Ավարտ</span><b>2 փաստագրված փորձարկում + feedback</b></div>`,
  `${heading('07','Կախվածություններ','Հերթականությունը<br><em>արդյունքից է ծնվում։</em>')}<div class="dependency-flow">${INTEGRATION_CONTENT.dependencies.map((x,i)=>`<div><span>0${i+1}</span><strong>${esc(x)}</strong>${i<4?'<i>→</i>':''}</div>`).join('')}</div><div class="parallel-track"><span>Զուգահեռ հոսք</span><strong>Վաղ B2B շփում · գնորդ · բյուջե · պիլոտի օրացույց</strong></div><p class="bottom-line">Վաճառքային շփումը սկսվում է առաջին շաբաթից, որովհետև գնման ցիկլը կարող է երկար լինել։</p>`,
  `${heading('08','6 շաբաթվա ներսում','Հինգ դարպաս։<br><em>Հինգ ապացույց։</em>','Roadmap-ը չենք կրկնում․ ստուգում ենք՝ արդյո՞ք կարելի է անցնել հաջորդ փուլ։')}<div class="gate-track">${INTEGRATION_CONTENT.gates.map((g,i)=>`<article><span>${esc(g[0])}</span><strong>${esc(g[1])}</strong><p>${esc(g[2])}</p><div class="gate-status">${i===4?'ՀԱՆՁՆԵԼ':'ԱՆՑՆԵԼ'}</div></article>`).join('')}</div><p class="gate-rule">Ապացույց չկա → աշխատանքը վերադասավորվում է → թիրախը արդյունք չի հայտարարվում</p>`,
  `${heading('09','Որակ','Չափում ենք<br><em>իրական աշխատանքը։</em>')}<div class="quality-loop">${INTEGRATION_CONTENT.quality.map((q,i)=>`<article><span>0${i+1}</span><h2>${esc(q[0])}</h2><p>${esc(q[1])}</p></article>`).join('')}</div><div class="quality-rule"><strong>Կարող ենք ասել</strong><span>աշխատանքային առաջադրանքի կատարումը բարելավվել է</span><strong>Չենք պնդում</strong><span>6 շաբաթում ամբողջ CEFR մակարդակը բարձրացել է</span></div>`,
  `${heading('10','Ռեսուրս + ֆինանս','Ո՞վ, ե՞րբ և<br><em>ինչ արժեքով։</em>')}<div class="resource-layout"><div class="roles">${INTEGRATION_CONTENT.roles.map((r,i)=>`<article><span>0${i+1}</span><strong>${esc(r[0])}</strong><p>${esc(r[1])}</p></article>`).join('')}</div><div class="cost-card"><p>Ուղղակի արժեք</p><strong>${esc(INTEGRATION_CONTENT.costFormula)}</strong><i>↓</i><p>Գին</p><strong>արժեք + մարժա + գնորդի արձագանք</strong><small>Թիվը հաստատվում է իրական տվյալներով</small></div></div>`,
  `${heading('11','Ռիսկի ինտեգրում','Դասավանդողը<br><em>հասանելի չէ։</em>','Մեկ ռիսկը տարածվում է ամբողջ պլանի վրա։')}<div class="risk-core">Ռիսկ</div><div class="risk-impact">${INTEGRATION_CONTENT.riskImpact.map((r,i)=>`<article style="--i:${i}"><strong>${esc(r[0])}</strong><span>${esc(r[1])}</span></article>`).join('')}</div><div class="risk-response"><span>Արձագանք</span><strong>պահուստային մասնագետ + նախապես ստուգված փորձնական դաս</strong></div>`,
  `${heading('12','ITTO','Մուտքը վերածվում է<br><em>ստուգելի արդյունքի։</em>')}<div class="itto-table"><div class="itto-head"><span>Գործունեություն</span><span>Inputs</span><span>Tools & Techniques</span><span>Outputs</span></div>${INTEGRATION_CONTENT.itto.map(row=>`<div class="itto-row">${row.map((x,i)=>`<${i===0?'strong':'span'}>${esc(x)}</${i===0?'strong':'span'}>`).join('')}</div>`).join('')}</div><p class="bottom-line">Յուրաքանչյուր output հաջորդ գործունեության input է։</p>`,
  `${heading('13','Ինտեգրված որոշում','Feedback-ից՝<br><em>հանձնելի ծառայություն։</em>')}<div class="decision-flow"><div><span>01</span><strong>Պիլոտի տվյալ</strong></div><i>→</i><div><span>02</span><strong>Ազդեցության գնահատում</strong></div><i>→</i><div><span>03</span><strong>Հաստատված փոփոխություն</strong></div><i>→</i><div><span>04</span><strong>Օպերացիոն հանձնում</strong></div></div><div class="final-proof"><p>Առաջադրանքի պահանջները փակված են</p><div>${['Scope','WBS','Փոխկապեր','ITTO'].map(x=>tag(x,'complete')).join('')}</div><small>2 պիլոտը և 1+ վճարող ընկերությունը մնում են թիրախ, մինչև փաստացի իրականացվեն։</small></div><div class="sources-mini">${INTEGRATION_CONTENT.sources.map(s=>`<span><b>${esc(s[0])}</b>${esc(s[1])}</span>`).join('')}</div>`
];

if (deck) deck.innerHTML = scenes.map((html, i) => `<section class="slide${i === 0 ? ' active' : ''}" id="scene-${String(i + 1).padStart(2, '0')}" aria-label="${esc(INTEGRATION_CONTENT.chapters[i])}" ${i === 0 ? '' : 'inert hidden'}><div class="slide-inner">${html}</div></section>`).join('');

const slides = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('.slide')]);
const previous = /** @type {HTMLButtonElement|null} */ (document.querySelector('#previous'));
const next = /** @type {HTMLButtonElement|null} */ (document.querySelector('#next'));
const statusNumber = /** @type {HTMLElement|null} */ (document.querySelector('#scene-number'));
const statusName = /** @type {HTMLElement|null} */ (document.querySelector('#scene-name'));
const progress = /** @type {HTMLElement|null} */ (document.querySelector('.deck-progress span'));
const mascot = /** @type {HTMLElement|null} */ (document.querySelector('.mascot-step'));
const hint = /** @type {HTMLElement|null} */ (document.querySelector('.gesture-hint'));
const toc = /** @type {HTMLElement|null} */ (document.querySelector('#toc'));
const tocOpen = /** @type {HTMLButtonElement|null} */ (document.querySelector('.toc-open'));
const tocClose = /** @type {HTMLButtonElement|null} */ (document.querySelector('.toc-close'));
const scrim = /** @type {HTMLElement|null} */ (document.querySelector('.toc-scrim'));
const tocList = /** @type {HTMLElement|null} */ (document.querySelector('#toc-list'));
let active = DeckNavigation.fromHash(location.hash, slides.length);
let locked = false;
/** @type {number|null} */
let touchY = null;

if (tocList) tocList.innerHTML = INTEGRATION_CONTENT.chapters.map((chapter, i) => `<button type="button" data-index="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(chapter)}</button>`).join('');

/** @param {number} index @param {boolean} [updateHash] */
function render(index, updateHash = true) {
  const target = DeckNavigation.clamp(index, slides.length);
  if (target === active && slides[target]?.classList.contains('active')) return;
  slides.forEach((slide, i) => {
    const selected = i === target;
    slide.hidden = false;
    slide.toggleAttribute('inert', !selected);
    slide.classList.toggle('active', selected);
    slide.classList.toggle('before', i < target);
    if (!selected) setTimeout(() => { if (!slide.classList.contains('active')) slide.hidden = true; }, 460);
  });
  active = target;
  if (statusNumber) statusNumber.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  if (statusName) statusName.textContent = INTEGRATION_CONTENT.chapters[active];
  if (progress) progress.style.transform = `scaleX(${(active + 1) / slides.length})`;
  if (mascot) {
    mascot.style.left = `${6 + active / Math.max(1, slides.length - 1) * 88}%`;
    const sprite = /** @type {HTMLElement|null} */ (mascot.querySelector('div'));
    if (sprite) sprite.style.backgroundPosition = `${-(active % 4) * 100}% 0`;
  }
  if (previous) previous.disabled = active === 0;
  if (next) next.disabled = active === slides.length - 1;
  document.querySelectorAll('#toc-list button').forEach((button, i) => button.classList.toggle('current', i === active));
  document.body.classList.add('has-moved');
  if (updateHash) history.replaceState(null, '', DeckNavigation.hash(active));
}

/** @param {string} direction */
function move(direction) {
  const target = DeckNavigation.target(active, slides.length, direction);
  if (target === active) return;
  render(target);
}

function closeToc() { if(toc)toc.hidden = true; if(scrim)scrim.hidden = true; tocOpen?.setAttribute('aria-expanded', 'false'); tocOpen?.focus(); }
function openToc() { if(toc)toc.hidden = false; if(scrim)scrim.hidden = false; tocOpen?.setAttribute('aria-expanded', 'true'); tocClose?.focus(); }

previous?.addEventListener('click', () => move('previous'));
next?.addEventListener('click', () => move('next'));
tocOpen?.addEventListener('click', openToc);
tocClose?.addEventListener('click', closeToc);
scrim?.addEventListener('click', closeToc);
tocList?.addEventListener('click', event => { const target=/** @type {HTMLElement|null} */(event.target); const button=/** @type {HTMLButtonElement|null} */(target?.closest('button[data-index]')??null); if (button) { render(Number(button.dataset.index)); closeToc(); } });

addEventListener('keydown', event => {
  if (toc && !toc.hidden && event.key === 'Escape') { closeToc(); return; }
  /** @type {Record<string,string>} */
  const directions = {ArrowRight:'next', ArrowDown:'next', PageDown:'next', ArrowLeft:'previous', ArrowUp:'previous', PageUp:'previous', Home:'first', End:'last'};
  const direction = directions[event.key];
  if (direction) { event.preventDefault(); move(direction); }
});

addEventListener('wheel', event => {
  if ((toc && !toc.hidden) || Math.abs(event.deltaY) < 14 || locked) return;
  event.preventDefault();
  locked = true;
  move(event.deltaY > 0 ? 'next' : 'previous');
  setTimeout(() => { locked = false; }, 650);
}, {passive:false});

addEventListener('touchstart', event => { touchY = event.changedTouches[0]?.clientY ?? null; }, {passive:true});
addEventListener('touchend', event => {
  if (touchY === null) return;
  const delta = touchY - (event.changedTouches[0]?.clientY ?? touchY);
  if (Math.abs(delta) > 48) move(delta > 0 ? 'next' : 'previous');
  touchY = null;
}, {passive:true});
addEventListener('hashchange', () => render(DeckNavigation.fromHash(location.hash, slides.length), false));

render(active, false);
if (hint) setTimeout(() => hint.classList.add('soften'), 5000);
})();
