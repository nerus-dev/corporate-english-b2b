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
await copyFile(path.join(root,'integration.html'),path.join(dist,'integration.html'));
for(const file of ['gsap.min.js','ScrollTrigger.min.js']){
  // Source maps are not required at runtime. Remove references to avoid optional requests.
  const source=await readFile(path.join(root,'node_modules/gsap/dist',file),'utf8');
  await writeFile(path.join(dist,'vendor',file),source.replace(/\/\/# sourceMappingURL=.*$/gm,''));
}
const gsapPackage=JSON.parse(await readFile(path.join(root,'node_modules/gsap/package.json'),'utf8'));
await writeFile(path.join(dist,'vendor/GSAP-LICENSE.txt'),`GSAP ${gsapPackage.version}\n${gsapPackage.license}\nCopyright and license notices are also preserved in each vendor script.\n`);
await writeFile(path.join(dist,'.nojekyll'),'');
// Content revisions prevent a CDN from mixing new HTML with old scripts/styles.
for(const htmlFile of ['index.html','integration.html']){
  let builtHtml=await readFile(path.join(dist,htmlFile),'utf8');
  for(const [,url] of builtHtml.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)){
    if(url.endsWith('.html'))continue;
    const bytes=await readFile(path.join(dist,url));
    const revision=createHash('sha256').update(bytes).digest('hex').slice(0,12);
    builtHtml=builtHtml.replaceAll(`"${url}"`,`"${url}?v=${revision}"`);
  }
  await writeFile(path.join(dist,htmlFile),builtHtml);
}
const content=vm.runInNewContext(`${await readFile(path.join(root,'src/content.js'),'utf8')}; CONTENT`);
const integration=vm.runInNewContext(`${await readFile(path.join(root,'src/integration-content.js'),'utf8')}; INTEGRATION_CONTENT`);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notes=`<!doctype html><html lang="hy"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Խոսնակի նշումներ · ${escape(content.organization)}</title><style>body{max-width:850px;margin:60px auto;padding:0 25px;font:18px/1.9 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans Armenian","Noto Sans",Arial,sans-serif;background:#ffffff;color:#111411}h1{font-size:30px}h2{font-size:23px;color:#2f772b;margin-top:50px}a{color:#285f25}li{margin-bottom:10px}@media print{body{background:white;color:black}h2{color:black}}</style><h1>${escape(content.projectTitle)}</h1><p>Խոսնակի նշումներ · ${escape(content.organization)}</p><a href="./index.html">← Ներկայացում</a>${content.notes.map((note,i)=>`<section><h2>${String(i).padStart(2,'0')} / ${escape(content.chapters[i])}</h2><p>${escape(note)}</p>${i===4?`<p><strong>${escape(content.smartGoal)}</strong></p>`:''}</section>`).join('')}<h2>Նախագծի բոլոր խնդիրները</h2><ol>${content.taskDetail.flatMap((task,i)=>i===6?['Գտնել պիլոտային փորձարկման մասնակից ընկերություններ','Անցկացնել առնվազն 2 պիլոտային փորձարկում']:task).map(x=>`<li>${escape(x)}</li>`).join('')}</ol><h2>Ավարտի չափանիշներ · բոլորը միաժամանակ</h2><ol>${content.completion.map(x=>`<li>${escape(x)}</li>`).join('')}</ol><h2>Աշխատանքի սահմաններ</h2><p>${escape(content.scopeIn)}</p><p>${escape(content.scopeOut)}</p><p>Նախագիծը չի ներառում մեծ կայք, ամբողջական ավտոմատացում կամ երկարաժամկետ օպերացիոն աշխատանք։</p><h2>Ռիսկեր և արձագանք</h2>${content.risks.map((x,i)=>`<p>${escape(x)} → ${escape(content.mitigations[i])}</p>`).join('')}</html>`;
await writeFile(path.join(dist,'speaker-notes.html'),notes);
const integrationNotes=`<!doctype html><html lang="hy"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Առաջադրանք 2 · Խոսնակի նշումներ · ${escape(integration.organization)}</title><style>body{max-width:900px;margin:60px auto;padding:0 25px;font:18px/1.85 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans Armenian","Noto Sans",Arial,sans-serif;color:#111411}h1{font-size:34px}h2{font-size:23px;color:#2f772b;margin-top:48px}a{color:#2f772b}@media print{body{margin:20px auto}h2{color:#111}}</style><h1>${escape(integration.title)}</h1><p>${escape(integration.project)} · ${escape(integration.organization)}</p><p><a href="./integration.html">← Ներկայացում</a> · <a href="./index.html">Առաջադրանք 1</a></p>${integration.notes.map((note,i)=>`<section><h2>${String(i+1).padStart(2,'0')} / ${escape(integration.chapters[i])}</h2><p>${escape(note)}</p></section>`).join('')}<h2>Աղբյուրների շրջանակ</h2>${integration.sources.map(source=>`<p><strong>${escape(source[0])}</strong> — ${escape(source[1])}</p>`).join('')}</html>`;
await writeFile(path.join(dist,'integration-notes.html'),integrationNotes);
console.log('Built dist: Assignment 1 (11 scenes) + Assignment 2 (13 scenes), notes, local assets.');
