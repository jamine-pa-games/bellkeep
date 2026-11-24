/* 流程、標題與選角、主迴圈 */
/* ======================= FLOW ======================= */
function clearWorld(){EPROJ=[];MATE=null;for(const e of EN_LIST)if(e.bar)e.bar.remove();EN_LIST=[];PROJ=[];TELE=[];DROPS=[];TURRETS=[];BOSS=null;ov.innerHTML='';DNS.length=0;$('#bossBar').hidden=true;if(P&&P.guardFx)P.guardFx=null}
function setWorld(w){clearWorld();W=w;scene=w.sc;makePlayer()}
function fadeTo(fn){$('#fade').classList.add('on');setTimeout(()=>{fn();setTimeout(()=>$('#fade').classList.remove('on'),80)},380)}
function goTown(){for(const d of DROPS){if(d.kind==='item')pickItem(d.it);else S.gold+=d.n}DROPS=[];fadeTo(()=>{mode='town';setWorld(buildTown());P.pos.set(0,0,9);P.face=PI;updCam(0,true);hudOn();$('#quest').hidden=false;$('#quest').innerHTML=!S.merch&&S.done.length===0?'<b>目前目標</b>打開右上角「地圖」，先去暮鐘近郊探索、收集木材':S.done.length>=BOUNTY.length?'<b>《暮鐘戰記》完</b>重複討伐懸賞，收集傳說裝備':S.done.length===9&&!brOK()?'<b>目前目標</b>多瑙河的橋斷了：備齊材料，打開地圖點「多瑙河斷橋」請芮塔蓋橋':S.done.length===3&&!S.seen.p2?'<b>第二部「赤燼王」開始</b>到懸賞板接受卷四「冰湖之戰」':`<b>目前目標</b>到懸賞板接受${BOUNTY[Math.min(S.done.length,BOUNTY.length-1)].vol}「${BOUNTY[Math.min(S.done.length,BOUNTY.length-1)].title}」`;$('#skills').style.opacity=.5;ensureQuests();const rdq=Object.values(S.q).filter(q=>q.p>=q.n).length;$('#quest').innerHTML+=rdq?`<br><span style="color:#8fe0a0">${rdq} 件委託可以交付</span>`:(archOK()?`<br><span style="color:#cdbb98">帶著金幣與材料找建築師哈特擴建城鎮</span>`:'');if(advReady())$('#quest').innerHTML+='<br><span style="color:#ffd06a">★ 去轉職聖殿找祭司艾德蕾：轉職／覺醒試煉</span>';townEvent();save()})}
function goZone(bi){const b=BOUNTY[bi];fadeTo(()=>{mode='zone';setWorld(buildZone(b.zone,b.boss));if(b.zone==='giant2')addZmey();P.pos.set(0,0,4);P.face=PI;updCam(0,true);hudOn();spawnMate();$('#skills').style.opacity=1;$('#quest').hidden=false;questZone();
  const intro=()=>{banner(ZONES[b.zone].name,b.title);if(!S.seen.joy){S.seen.joy=1;$('#joyHint').hidden=false;setTimeout(()=>toast('會自動攻擊附近的敵人。右下角是技能、翻滾與道具。',3400),1600)}};
  if(!S.seen['v'+bi]){S.seen['v'+bi]=1;save();showCard(bi,()=>say(STORY['z'+bi],intro))}else intro()})}
function hudOn(){$('#hud').hidden=false;$('#title').hidden=true;$('#sel').hidden=true;setupSkillButtons();hudStats();hudSkills();curNPC=null;$('#act').hidden=true}

/* ======================= TITLE & SELECT ======================= */
let titleW=null,selScene=null,selModel=null,selCls='ivy',selFromTown=false;
function showTitle(){mode='title';titleW=buildTown();W=titleW;scene=titleW.sc;P=null;$('#hud').hidden=true;$('#title').hidden=false;if(S.cls){$('#contB').hidden=false;$('#newB').classList.add('dk');$('#contB').classList.remove('dk')}}
function buildSelect(){const sc=new THREE.Scene();sc.background=new THREE.Color(0x1a1420);sc.fog=new THREE.Fog(0x1a1420,10,30);
  sc.add(new THREE.HemisphereLight(0xffe8d0,0x302030,.7));const sp=new THREE.SpotLight(0xfff0d0,1.6,30,.5,.6);sp.position.set(2,10,6);sp.castShadow=true;sc.add(sp);sc.add(sp.target);const rim=new THREE.PointLight(0x8a6aff,1.2,12);rim.position.set(-3,3,-3);sc.add(rim);
  const ped=new THREE.Mesh(G.cyl(1.6,1.8,.5,32),tm(0x5a4a5a));ped.position.y=-.25;ped.receiveShadow=true;sc.add(ped);const ring=new THREE.Mesh(new THREE.RingGeometry(1.7,1.9,48),new THREE.MeshBasicMaterial({color:0xf0c35a}));ring.rotation.x=-PI/2;ring.position.y=.01;sc.add(ring);
  for(let i=0;i<6;i++){const a=PI+i/5*PI;const p=new THREE.Mesh(G.box(.5,5,.5),tm(0x3a2e3a,{flat:1}));p.position.set(Math.cos(a)*6,2.5,Math.sin(a)*4-2);sc.add(p)}
  FX=[];PS=new Parts(300,.3);PB=new Parts(10,1);sc.add(PS.pts);
  return sc}
function openSelect(fromTown){selFromTown=fromTown;mode='select';if(!selScene)selScene=buildSelect();scene=selScene;$('#title').hidden=true;$('#hud').hidden=true;$('#sel').hidden=false;selCls=S.cls||'ivy';
  $('#selL').innerHTML=HEROES.map(h=>`<div class="cls ${h===selCls?'on':''}" data-c="${h}" role="button" tabindex="0"><div><b>${CH[h].name}</b>${CLS[h].job.slice(-2)}</div></div>`).join('');
  document.querySelectorAll('.cls').forEach(el=>el.onclick=()=>{selCls=el.dataset.c;SFX.tap();document.querySelectorAll('.cls').forEach(x=>x.classList.toggle('on',x===el));showSel()});showSel()}
function showSel(){if(selModel)selScene.remove(selModel.root);selModel=makeChibi(LOOKS[selCls],1.2);selScene.add(selModel.root);selModel.t=0;const C=CLS[selCls];
  $('#selR').innerHTML=`<div class="rl">${C.job}</div><h3>${CH[selCls].name}</h3><p>${C.desc}</p><dl>${Object.entries(C.stars).map(([k,v])=>`<dt>${k}</dt><dd>${'★'.repeat(v)}${'☆'.repeat(3-v)}</dd>`).join('')}</dl><div class="skrow">${C.sk.map(s=>`<img src="${skIcon(s.ic)}" alt="${s.n}" title="${s.n}">`).join('')}</div>`;
  PS.emit({x:0,y:1.5,z:0},30,0xf0c35a,3,.8,2,2,1);SFX.swing()}
$('#selGo').addEventListener('click',()=>{SFX.lvl();const first=!S.cls;S.cls=selCls;if(first&&!S.eq.weapon)S.eq.weapon=makeItem(0,0,'weapon','base');save();$('#sel').hidden=true;if(first){say(STORY.intro1,()=>goTown())}else goTown()});
$('#newB').addEventListener('click',()=>{au();if(S.cls){panel(`<h2>重新開始？</h2><div class="sub">目前的進度（等級 ${S.lv}、${S.done.length} 張懸賞）會被清除。</div><div class="row"><button class="btn dk" id="pN">取消</button><button class="btn red" id="pY">重新開始</button></div>`);$('#pN').onclick=closePanel;$('#pY').onclick=()=>{closePanel();S=JSON.parse(JSON.stringify(DEF));save();openSelect(false)};return}openSelect(false)});
$('#contB').addEventListener('click',()=>{au();SFX.bell();goTown()});

/* ======================= MAIN LOOP ======================= */
let last=performance.now(),gt=0,hudT=0;
function frame(now){requestAnimationFrame(frame);let dt=Math.min(.05,(now-last)/1000);last=now;
  if(hitStop>0){hitStop-=dt;dt*=.08}if(slowMo>0){slowMo-=dt;dt*=.35}
  if(D||CARD||!$('#panel').hidden)dt*=mode==='zone'?0:1;
  gt+=dt;const t=gt;
  if(mode==='title'&&titleW){const a=t*.08;cam.position.set(Math.sin(a)*22,11,Math.cos(a)*22-2);cam.lookAt(0,2,-4);titleW.update(dt,t);PS.update(dt);PB.update(dt);updFX(dt);R.render(titleW.sc,cam);return}
  if(mode==='select'&&selScene){if(selModel){selModel.t+=dt;selModel.root.rotation.y+=dt*.6;animModel(selModel.m||selModel,selModel.t,0,0,dt)}cam.position.set(0,3.2,11);cam.lookAt(0,2.2,0);if(Math.random()<.3)PS.emit({x:rand(-1.5,1.5),y:0,z:rand(-1.5,1.5)},1,0xf0c35a,.2,2,1,0,.1);PS.update(dt);R.render(selScene,cam);return}
  if(!W||!P){if(W)R.render(W.sc,cam);return}
  if(dt>0){updPlayer(dt,t);if(mode==='zone'){updEnemies(dt,t);updProj(dt);updEProj(dt);updMate(dt);updTele(dt);updTurrets(dt);updDrops(dt,t)}W.update(dt,t);updFX(dt);PS.update(dt);PB.update(dt);for(const l of FLASHL){if(l.userData.t>0){l.userData.t-=dt;l.intensity=l.userData.i*Math.max(0,l.userData.t/l.userData.d)}else l.intensity=0}}
  updCam(Math.max(dt,.001));updDN(Math.max(dt,.016));updWorldTags();updAct();
  hudT+=dt;if(hudT>.1){hudT=0;hudStats();hudSkills();drawMinimap()}
  R.render(W.sc,cam)}

load();if(S.done.length>=1&&!S.merch)S.merch=1;S.mat=S.mat||{wood:0,stone:0,iron:0};$('#muteBtn').style.opacity=S.mute?.4:1;
showTitle();requestAnimationFrame(frame);
window.__bk={get S(){return S},get P(){return P},goZone,goTown,openSelect,useSkill,spawnEnemy,get W(){return W},get EN(){return EN_LIST}};
