const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const { chromium } = require('playwright')
const fixture = {id:'offline-fixture',version:1,createdAt:'2026-11-08T00:00:00Z',architecturalStyle:{name:'Custom Builder',description:'Synthetic fixture',influences:[]},floors:[{id:'f1',level:0,height:3,rooms:[{id:'r1',name:'Bedroom',type:'bedroom',position:{x:0,y:0,z:0},dimensions:{width:5,height:3,depth:4},shape:'rect',rotation:0,color:'#FDF8E2',materialPreset:'concrete',furniture:[],windows:[],doors:[]}]}],totalArea:20,palette:['#FDF8E2'],notes:'Synthetic offline fixture'}
;(async () => {
 const server = spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3213'],{stdio:'ignore',env:{...process.env,MISTRAL_API_KEY:''}})
 let browser
 try {
  let ready=false
  for(let i=0;i<100;i++){try{await fetch('http://127.0.0.1:3213');ready=true;break}catch{await new Promise(r=>setTimeout(r,100))}}
  assert.ok(ready,'local production server starts')
  browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader'],...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})})
  const page=await browser.newPage({viewport:{width:1280,height:900}})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:3213')&&!route.request().url().includes('/api/')?route.continue():route.abort())
  await page.goto('http://127.0.0.1:3213',{waitUntil:'domcontentloaded'})
  await page.evaluate(f=>localStorage.setItem('ai-architect-design',JSON.stringify({state:{design:f},version:0})),fixture)
  await page.goto('http://127.0.0.1:3213/builder',{waitUntil:'domcontentloaded'})
  await page.waitForSelector('canvas');await page.waitForTimeout(1500)
  const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('ai-architect-design')).state.design)
  assert.equal((await stored()).id,fixture.id,'hydration must not erase a saved design')
  assert.equal((await stored()).floors[0].rooms.length,1)
  const asset=page.locator('[role="button"]').filter({hasText:'Bedroom'}).first();const box=await asset.boundingBox();assert.ok(box)
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(750,450,{steps:25});await page.waitForTimeout(400);await page.mouse.up()
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('ai-architect-design')).state.design.floors[0].rooms.length===2)
  await page.waitForTimeout(1500)
  const labels=await page.locator('#html-root').innerText();assert.ok(labels.includes('Bedroom'),'room label remains projected after sidebar drag')
  const coordinates=await page.locator('#html-root').evaluate(el=>[...el.querySelectorAll('span')].filter(e=>e.textContent==='Bedroom').map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y}}))
  assert.ok(coordinates.length>=2);assert.ok(coordinates.every(p=>Number.isFinite(p.x)&&p.x>240&&p.x<1280&&p.y>0&&p.y<900),'camera must remain valid after sidebar drag')
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('canvas');await page.waitForTimeout(1000)
  assert.equal((await stored()).floors[0].rooms.length,2,'both rooms survive reload')
  assert.deepEqual(errors,[])
  for(const path of ['/api/quiz','/api/architect','/api/architect/plan']){
   const r=await fetch('http://127.0.0.1:3213'+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(path==='/api/architect'?{mode:'CREATE'}:{})});assert.equal(r.status,400,path)
  }
  console.log('Browser: saved hydration, sidebar drag, projected room labels, reload, no page errors, and three HTTP guards passed. No provider requests.')
 } finally {if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1})
