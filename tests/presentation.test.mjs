import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {spawn, execFileSync} from 'node:child_process';
import {request} from 'node:http';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=relative=>readFile(path.join(root,relative),'utf8');
const contentSource=await read('src/content.js');
const content=vm.runInNewContext(`${contentSource}; CONTENT`);
const nav=vm.runInNewContext(`${await read('src/navigation.js')}; StoryNavigation`);

test('navigation advances and reverses across scene boundaries without changing anchors',()=>{
  const anchors=[0,100,260,500];
  for(const key of ['ArrowDown','PageDown']){
    assert.equal(nav.target(anchors,0,key),100);
    assert.equal(nav.target(anchors,140,key),260);
    assert.equal(nav.target(anchors,500,key),500);
  }
  for(const key of ['ArrowUp','PageUp']){
    assert.equal(nav.target(anchors,260,key),100);
    assert.equal(nav.target(anchors,140,key),100);
    assert.equal(nav.target(anchors,0,key),0);
  }
  assert.deepEqual(anchors,[0,100,260,500]);
  assert.equal(nav.target(anchors,140,'Home'),0);
  assert.equal(nav.target(anchors,140,'End'),500);
});

test('navigation tolerance avoids reselecting near-identical anchors',()=>{
  assert.equal(nav.target([0,100,200],96,'ArrowDown'),200);
  assert.equal(nav.target([0,100,200],95,'ArrowDown'),100);
  assert.equal(nav.target([0,100,200],104,'ArrowUp'),0);
  assert.equal(nav.target([0,100,200],105,'ArrowUp'),100);
  for(const key of ['Home','End','ArrowDown','ArrowUp','PageDown','PageUp'])assert.equal(nav.target([],0,key),0);
  for(const key of ['Enter','Escape',' ','Tab','a'])assert.equal(nav.target([0,100],50,key),null);
});

test('content preserves complete academic narrative and prospective goals',()=>{
  assert.equal(content.chapters.length,11);
  assert.equal(content.notes.length,11);
  assert.ok(content.notes.every(note=>note.length>80));
  assert.equal(content.formation.length,6);
  assert.equal(content.formationDetail.length,6);
  assert.equal(content.tasks.length,10);
  assert.equal(content.taskDetail.length,10);
  assert.match(content.taskDetail[6],/Գտնել.*անցկացնել.*2/);
  assert.equal(content.completion.length,8);
  assert.equal(new Set(content.completion).size,8);
  assert.equal(content.roadmap.length,6);
  assert.equal(content.risks.length,content.mitigations.length);
  assert.equal(content.weeks,6);
  assert.equal(content.pilots,2);
  assert.equal(content.clients,'1+');
  assert.equal(content.organization,'MekStep');
  assert.match(content.smartGoal,/6 շաբաթվա.*առնվազն 2.*առնվազն 1/);
  assert.match(content.notes[0],/նպատակներ են, ոչ արդեն ձեռք բերված արդյունքներ/);
  assert.match(content.notes[1],/ստուգման ենթակա/);
  assert.match(content.notes[7],/մեկ ուսանողը Project Manager/);
  assert.match(content.notes[10],/բոլոր ավարտի չափանիշները.*միաժամանակ/);
  assert.equal(contentSource.split(content.organization).length-1,1,'Organization must be configurable in one constant');
});

test('rendered story produces all eleven scenes in order',async()=>{
  const source=await read('src/main.js');
  const prefix=source.slice(0,source.indexOf('const organization ='));
  const story={innerHTML:''};
  vm.runInNewContext(`${contentSource}; ${prefix}`,{document:{querySelector:selector=>selector==='#story'?story:null}});
  const ids=[...story.innerHTML.matchAll(/<section id="scene-(\d+)"/g)].map(match=>Number(match[1]));
  assert.deepEqual(ids,Array.from({length:11},(_,i)=>i));
  assert.match(story.innerHTML,/Ուսուցում՝ հարմարեցված աշխատանքի իրական իրավիճակներին/);
});

test('production build is self-contained and includes full speaker notes',async()=>{
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'pipe'});
  const html=await read('dist/index.html');
  const notes=await read('dist/speaker-notes.html');
  for(const document of [html,notes]){
    assert.match(document,/lang="hy"/);
    for(const [,url] of document.matchAll(/(?:src|href)="([^"]+)"/g)){
      if(url.startsWith('#'))continue;
      assert.ok(!/^(?:https?:)?\/\//.test(url),`External runtime resource: ${url}`);
      assert.ok((await stat(path.join(root,'dist',url))).isFile(),`Missing resource ${url}`);
    }
  }
  assert.equal((notes.match(/<section>/g)||[]).length,11);
  const lists=[...notes.matchAll(/<ol>([\s\S]*?)<\/ol>/g)].map(match=>(match[1].match(/<li>/g)||[]).length);
  assert.deepEqual(lists,[11,8]);
  assert.ok(notes.includes(content.smartGoal));
  assert.ok(notes.includes(content.scopeOut));
  for(const note of content.notes)assert.ok(notes.includes(note));
  for(const resource of ['src/styles.css','src/main.js','src/content.js']){
    assert.doesNotMatch(await read(`dist/${resource}`),/(?:fetch\s*\(|XMLHttpRequest|url\(\s*['"]?https?:)/);
  }
  for(const vendor of ['gsap.min.js','ScrollTrigger.min.js'])assert.ok((await stat(path.join(root,'dist/vendor',vendor))).size>10000);
});

function get(port,url,method='GET'){
  return new Promise((resolve,reject)=>{
    const req=request({host:'127.0.0.1',port,path:url,method},res=>{
      let body='';res.setEncoding('utf8');res.on('data',chunk=>body+=chunk);
      res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
    });req.on('error',reject);req.end();
  });
}

test('static server handles pages, assets, HEAD, missing files and traversal',{timeout:15000},async()=>{
  const reservation=createServer();
  await new Promise(resolve=>reservation.listen(0,'127.0.0.1',resolve));
  const port=reservation.address().port;
  await new Promise(resolve=>reservation.close(resolve));
  const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Server readiness timeout')),8000);
      child.stdout.on('data',chunk=>{if(String(chunk).includes('Presentation ready')){clearTimeout(timer);resolve();}});
      child.once('error',error=>{clearTimeout(timer);reject(error);});
      child.once('exit',code=>{clearTimeout(timer);reject(new Error(`Server exited: ${code}`));});
    });
    const home=await get(port,'/');
    assert.equal(home.status,200);assert.match(home.body,/<main id="story"/);
    assert.match(home.headers['content-type'],/text\/html; charset=utf-8/);
    assert.equal((await get(port,'/assets/mekstep-logo.jpg')).headers['content-type'],'image/jpeg');
    assert.equal((await get(port,'/assets/mekstep-icon.png')).headers['content-type'],'image/png');
    for(const url of ['/src/main.js','/src/styles.css','/vendor/gsap.min.js','/assets/mark.svg','/speaker-notes.html'])assert.equal((await get(port,url)).status,200,url);
    const head=await get(port,'/','HEAD');
    assert.equal(head.status,200);assert.equal(head.body,'');assert.equal(head.headers['content-length'],home.headers['content-length']);
    assert.equal((await get(port,'/missing-resource')).status,404);
    assert.equal((await get(port,'/src')).status,404);
    assert.equal((await get(port,'/%ZZ')).status,404);
    for(const url of ['/%2e%2e%2fpackage.json','/..%5cpackage.json'])assert.ok([403,404].includes((await get(port,url)).status),url);
    assert.equal((await get(port,'/','POST')).status,405);
  }finally{
    const exited=new Promise(resolve=>child.once('exit',resolve));
    child.kill();await exited;
  }
});
