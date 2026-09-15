import {mkdir,copyFile,cp,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
await mkdir(path.join(dist,'vendor'),{recursive:true});
await cp(path.join(root,'src'),path.join(dist,'src'),{recursive:true,filter:source=>!source.endsWith('.d.ts')});
await cp(path.join(root,'public'),dist,{recursive:true});
await copyFile(path.join(root,'index.html'),path.join(dist,'index.html'));
for(const file of ['gsap.min.js','ScrollTrigger.min.js']){
  // Source maps are not required at runtime. Remove references to avoid optional requests.
  const source=await readFile(path.join(root,'node_modules/gsap/dist',file),'utf8');
  await writeFile(path.join(dist,'vendor',file),source.replace(/\/\/# sourceMappingURL=.*$/gm,''));
}
const gsapPackage=JSON.parse(await readFile(path.join(root,'node_modules/gsap/package.json'),'utf8'));
await writeFile(path.join(dist,'vendor/GSAP-LICENSE.txt'),`GSAP ${gsapPackage.version}\n${gsapPackage.license}\nCopyright and license notices are also preserved in each vendor script.\n`);
await writeFile(path.join(dist,'.nojekyll'),'');
// Content revisions prevent a CDN from mixing new HTML with old scripts/styles.
let builtHtml=await readFile(path.join(dist,'index.html'),'utf8');
for(const [,url] of builtHtml.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)){
  if(url.endsWith('.html'))continue; // Notes are a page, generated below, not a runtime asset.
  const bytes=await readFile(path.join(dist,url));
  const revision=createHash('sha256').update(bytes).digest('hex').slice(0,12);
  builtHtml=builtHtml.replaceAll(`"${url}"`,`"${url}?v=${revision}"`);
}
await writeFile(path.join(dist,'index.html'),builtHtml);
const content=vm.runInNewContext(`${await readFile(path.join(root,'src/content.js'),'utf8')}; CONTENT`);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notes=`<!doctype html><html lang="hy"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Խոսնակի նշումներ · ${escape(content.organization)}</title><style>body{max-width:850px;margin:60px auto;padding:0 25px;font:18px/1.9 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans Armenian","Noto Sans",Arial,sans-serif;background:#0b100c;color:#eee}h1{font-size:30px}h2{font-size:23px;color:#65cb5e;margin-top:50px}a{color:#c3edbe}li{margin-bottom:10px}@media print{body{background:white;color:black}h2{color:black}}</style><h1>${escape(content.projectTitle)}</h1><p>Խոսնակի նշումներ · ${escape(content.organization)}</p><a href="./index.html">← Ներկայացում</a>${content.notes.map((note,i)=>`<section><h2>${String(i).padStart(2,'0')} / ${escape(content.chapters[i])}</h2><p>${escape(note)}</p>${i===4?`<p><strong>${escape(content.smartGoal)}</strong></p>`:''}</section>`).join('')}<h2>Նախագծի բոլոր խնդիրները</h2><ol>${content.taskDetail.flatMap((task,i)=>i===6?['Գտնել պիլոտային փորձարկման մասնակից ընկերություններ','Անցկացնել առնվազն 2 պիլոտային փորձարկում']:task).map(x=>`<li>${escape(x)}</li>`).join('')}</ol><h2>Ավարտի չափանիշներ · բոլորը միաժամանակ</h2><ol>${content.completion.map(x=>`<li>${escape(x)}</li>`).join('')}</ol><h2>Աշխատանքի սահմաններ</h2><p>${escape(content.scopeIn)}</p><p>${escape(content.scopeOut)}</p><p>Նախագիծը չի ներառում մեծ կայք, ամբողջական ավտոմատացում կամ երկարաժամկետ օպերացիոն աշխատանք։</p><h2>Ռիսկեր և արձագանք</h2>${content.risks.map((x,i)=>`<p>${escape(x)} → ${escape(content.mitigations[i])}</p>`).join('')}</html>`;
await writeFile(path.join(dist,'speaker-notes.html'),notes);
console.log('Built dist: 11 scenes, local GSAP, notes, no runtime network dependencies.');
