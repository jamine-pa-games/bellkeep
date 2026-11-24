/* 資源、探索、王國地圖 */
/* ======================= RESOURCES / EXPLORATION / KINGDOM MAP ======================= */
const MATN={wood:'木材',stone:'石材',iron:'鐵礦',gold:'金幣'};
const matIcon=k=>k==='gold'?uiIcon('coin'):uiIcon(k);
function townLv(){return S.done.length+Object.keys(BLDS).reduce((a,k)=>a+Math.max(0,bl(k)-BLDS[k].start),0)}
const archOK=()=>S.done.length>=1;
const qgAvail=()=>['emma'].concat(S.done.length>=1?['ben']:[],S.done.length>=2?['god']:[]);
function tent(sc,x,z,i){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=i*1.3;sc.add(g);const c=new THREE.Mesh(G.cone(1.6,2.3,4),tm([0xd8c8a0,0xc8a878,0xb8c0a8][i%3],{flat:1}));c.position.y=1.15;c.rotation.y=PI/4;c.castShadow=true;g.add(c);const fl=new THREE.Mesh(G.box(.8,1.2,.05),tm(0x5a3a20));fl.position.set(0,.6,1.1);fl.rotation.x=-.42;g.add(fl);const pole=new THREE.Mesh(G.cyl(.04,.04,.6,4),tm(0x5a3a20));pole.position.y=2.5;g.add(pole)}
function makeNode(sc,x,z,type){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=Math.random()*TAU;sc.add(g);
  if(type==='wood'){for(let i=0;i<3;i++){const l=new THREE.Mesh(G.cyl(.22,.22,1.6,8),tm(0x8a5a30,{flat:1}));l.rotation.z=PI/2;l.position.set(0,i===2?.6:.22,i===2?0:(i?-.24:.24));l.castShadow=true;g.add(l);const e=new THREE.Mesh(G.cyl(.18,.18,.03,8),tm(0xe0b07a));e.rotation.z=PI/2;e.position.set(.81,l.position.y,l.position.z);g.add(e)}}
  else if(type==='stone'){for(let i=0;i<4;i++){const s2=new THREE.Mesh(G.dode(.3+Math.random()*.2),tm(0xb0aca4,{flat:1}));s2.position.set(rand(-.4,.4),.25,rand(-.4,.4));s2.castShadow=true;g.add(s2)}}
  else{const rock=new THREE.Mesh(G.dode(.55),tm(0x4a4450,{flat:1}));rock.position.y=.35;rock.castShadow=true;g.add(rock);for(let i=0;i<4;i++){const o=new THREE.Mesh(G.oct(.16),tm(0xd87a3a,{e:0x6a2a0a}));o.position.set(rand(-.35,.35),.45+rand(0,.3),rand(-.35,.35));g.add(o)}}
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:texGround('glow'),color:type==='wood'?0xc8ff8a:type==='stone'?0xdfe8ff:0xffa060,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.5}));gl.scale.set(2.6,2.6,1);gl.position.y=.6;g.add(gl);
  return{g,gl,x,z,type,got:false}}
function campCleared(){openPortal();SFX.bell();banner('探索完成','走進傳送門回到暮鐘鎮');if(W.zk==='outskirts'&&!S.merch){S.merch=1;save();setTimeout(()=>say(STORY.merch),900)}}
function goExplore(zk){fadeTo(()=>{mode='zone';setWorld(buildZone(zk,null));P.pos.set(0,0,4);P.face=PI;updCam(0,true);hudOn();spawnMate();$('#skills').style.opacity=1;$('#quest').hidden=false;questZone();banner('探索',ZONES[zk].name);if(zk==='outskirts'&&!S.seen.ex0){S.seen.ex0=1;save();setTimeout(()=>say(STORY.ex0),1300)}})}
const SHOPREQ={fire:0,holy:1,horn:2,boomerang:1,spear:2,crossbow:3,axes:4};
const ROUTE=['','霧林道路','聖奧蘭商路','北境隘道','白湖冰路','卡萊灣海路','王都大道'];
const lockRow=(n,ik,rar,req)=>`<div class="si lk"><img src="${itemIcon(ik,rar)}" alt=""><div><b>${n}</b><small>🔒 開通「${ROUTE[req]}」後才會進貨（完成${BOUNTY[req-1].vol}）</small></div></div>`;
const LOC=[
 {id:'base',n:'暮鐘鎮',x:.52,y:.80,t:'base',d:'王國最南方的邊境小鎮，你們的根據地。一個月前被劫掠者燒成廢墟，正一點一點重建。'},
 {id:'outskirts',n:'暮鐘近郊',x:.34,y:.86,t:'ex',zone:'outskirts',req:0,d:'鎮外的橡樹林，木材最多。最近小鬼成群出沒，聽說有一支商隊被困在林子深處。'},
 {id:'quarry',n:'灰岩丘陵',x:.74,y:.84,t:'ex',zone:'quarry',req:1,d:'鎮東的採石場，盛產石材。燼狼在廢棄的採石坑裡築了巢。'},
 {id:'oldmine',n:'舊礦坑',x:.74,y:.60,t:'ex',zone:'oldmine',req:2,d:'王都南方的廢棄鐵礦，結晶傀儡在坑道裡遊蕩。可以挖到鐵礦。'},
 {id:'b0',n:'霧林修道院',x:.24,y:.48,t:'main',bi:0},
 {id:'b1',n:'聖奧蘭',x:.42,y:.58,t:'main',bi:1},
 {id:'b2',n:'隆瑟瓦隘口',x:.52,y:.19,t:'main',bi:2},
 {id:'b3',n:'白湖',x:.84,y:.32,t:'main',bi:3},
 {id:'b4',n:'卡萊灣',x:.22,y:.26,t:'main',bi:4},
 {id:'b5',n:'王都',x:.60,y:.42,t:'main',bi:5}];
const brOK=()=>!!S.bridge||S.done.includes(9);
const locOpen=L=>L.t==='link'?(!L.req||L.req()):L.t==='base'?true:L.t==='bridge'?S.done.length>=9||S.done.includes(9):L.t==='ex'?S.done.length>=L.req:L.bi<=S.done.length&&(L.bi!==9||brOK());
function drawKingdom(cv,sel){const x=cv.getContext('2d'),w=cv.width,h=cv.height,X=v=>v*w,Y=v=>v*h;const r=rng(1428);
  x.fillStyle='#9fb4ae';x.fillRect(0,0,w,h);x.strokeStyle='#ffffff55';x.lineWidth=2;for(let i=0;i<80;i++){const px=r()*w*.36,py=r()*h;x.beginPath();x.arc(px,py,9,PI*1.15,PI*1.85);x.stroke()}
  const L0=[[.36,0],[.31,.07],[.34,.12],[.27,.16],[.21,.19],[.15,.22],[.17,.29],[.12,.35],[.15,.43],[.10,.51],[.14,.59],[.09,.67],[.13,.76],[.08,.86],[.12,.94],[.07,1]];const pts=[];for(let i=0;i<L0.length-1;i++){const a=L0[i],b=L0[i+1];pts.push(a);for(let k=1;k<4;k++){const t=k/4;pts.push([lerp(a[0],b[0],t)+(r()-.5)*.014,lerp(a[1],b[1],t)+(r()-.5)*.01])}}pts.push(L0[L0.length-1],[1,1],[1,0]);
  const land=()=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(p[0]),Y(p[1])):x.moveTo(X(p[0]),Y(p[1])));x.closePath()};
  land();const lgd=x.createRadialGradient(w*.6,h*.6,w*.1,w*.6,h*.6,w*.95);lgd.addColorStop(0,'#f4e6c2');lgd.addColorStop(1,'#d2b886');x.fillStyle=lgd;x.fill();
  x.save();land();x.clip();const eg=x.createLinearGradient(0,0,0,Y(.17));eg.addColorStop(0,'#7a2a1acc');eg.addColorStop(1,'#7a2a1a00');x.fillStyle=eg;x.fillRect(0,0,w,Y(.17));for(let i=0;i<2600;i++){x.fillStyle=r()<.5?'#00000012':'#ffffff1c';x.fillRect(r()*w,r()*h,2,2)}x.restore();
  land();x.lineWidth=5;x.strokeStyle='#6a5030';x.stroke();x.save();x.setLineDash([2,8]);x.lineWidth=2;x.strokeStyle='#6a503088';x.translate(-8,0);land();x.stroke();x.restore();
  for(let i=0;i<10;i++){const fx2=X(.42+r()*.56),fy=Y(.025+r()*.06);x.beginPath();x.moveTo(fx2,fy+11);x.quadraticCurveTo(fx2+9,fy,fx2,fy-13);x.quadraticCurveTo(fx2-9,fy,fx2,fy+11);x.fillStyle='#c8401e';x.fill()}
  for(let i=0;i<54;i++){const mx=X(.36+r()*.64),my=Y(.12+r()*.08);if(Math.abs(mx-X(.52))<X(.04))continue;const s=14+r()*16;x.beginPath();x.moveTo(mx-s,my+s*.6);x.lineTo(mx,my-s);x.lineTo(mx+s,my+s*.6);x.closePath();x.fillStyle='#b89a6a';x.fill();x.lineWidth=2.5;x.strokeStyle='#5a4028';x.stroke();x.beginPath();x.moveTo(mx,my-s);x.lineTo(mx+s*.32,my-s*.32);x.lineTo(mx-s*.12,my-s*.42);x.closePath();x.fillStyle='#fff8e8';x.fill()}
  x.save();x.setLineDash([10,6]);x.lineWidth=3;x.strokeStyle='#a8301e99';x.beginPath();x.moveTo(X(.34),Y(.225));x.bezierCurveTo(X(.55),Y(.24),X(.75),Y(.21),X(1),Y(.235));x.stroke();x.restore();
  const RV=[[1,.50],[.86,.47],[.72,.51],[.58,.48],[.44,.55],[.32,.53],[.20,.57],[.11,.56]];x.beginPath();x.moveTo(X(RV[0][0]),Y(RV[0][1]));for(let i=1;i<RV.length;i++){const q=RV[i-1],p=RV[i];x.quadraticCurveTo(X(q[0]),Y(q[1]),X((q[0]+p[0])/2),Y((q[1]+p[1])/2))}x.lineTo(X(.11),Y(.56));x.lineWidth=8;x.strokeStyle='#6a8a8a';x.stroke();x.lineWidth=3.5;x.strokeStyle='#b4ccc8';x.stroke();
  x.beginPath();x.ellipse(X(.84),Y(.32),X(.085),Y(.045),-.2,0,TAU);x.fillStyle='#d4e4e8';x.fill();x.lineWidth=3;x.strokeStyle='#6a8a8a';x.stroke();
  const forest=(cx,cy,n,sp)=>{for(let i=0;i<n;i++){const fx2=X(cx+(r()-.5)*sp),fy=Y(cy+(r()-.5)*sp*.7);x.fillStyle='#5a3a20';x.fillRect(fx2-1.5,fy+5,3,6);x.beginPath();x.arc(fx2,fy,8,0,TAU);x.fillStyle='#7a9a5a';x.fill();x.lineWidth=2;x.strokeStyle='#3a4a2a';x.stroke()}};
  forest(.24,.44,28,.15);forest(.33,.90,22,.12);forest(.88,.72,16,.12);forest(.68,.28,12,.1);forest(.30,.70,10,.08);
  for(let i=0;i<9;i++){const hx=X(.75+(r()-.5)*.14),hy=Y(.86+(r()-.5)*.05);x.beginPath();x.arc(hx,hy,13,PI,0);x.fillStyle='#c8b088';x.fill();x.lineWidth=2;x.strokeStyle='#6a5030';x.stroke()}
  const base=LOC[0];for(const L of LOC.slice(1)){const open=locOpen(L);x.save();x.setLineDash([9,8]);x.lineWidth=open?4.5:2;x.strokeStyle=open?'#8a3a1a':'#8a6a4a55';x.beginPath();x.moveTo(X(base.x),Y(base.y));x.quadraticCurveTo(X((base.x+L.x)/2+.05),Y((base.y+L.y)/2+.02),X(L.x),Y(L.y));x.stroke();x.restore()}
  const lab=(t,px,py,sz,col)=>{x.font=`900 ${sz}px "Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='alphabetic';x.lineWidth=6;x.strokeStyle='#f4e6c2dd';x.strokeText(t,X(px),Y(py));x.fillStyle=col;x.fillText(t,X(px),Y(py))};
  lab('赤 燼 之 地',.70,.06,32,'#7a1a0a');lab('北 境 山 脈',.82,.235,20,'#5a4028');lab('西　海',.07,.40,26,'#2a4a4a');lab('洛 瓦 河',.82,.455,18,'#2a4a4a');
  for(const L of LOC){const px=X(L.x),py=Y(L.y);const open=locOpen(L),done=L.t==='main'&&S.done.includes(L.bi);const col=L.t==='base'?'#3a6a9a':L.t==='ex'?'#4a8a3a':done?'#c89a2a':'#b8301e';
    if(sel===L.id){x.beginPath();x.arc(px,py,31,0,TAU);x.lineWidth=5;x.strokeStyle='#fff';x.stroke();x.beginPath();x.arc(px,py,36,0,TAU);x.lineWidth=2;x.strokeStyle='#2a1a0a';x.stroke()}
    x.beginPath();x.arc(px,py,21,0,TAU);x.fillStyle=open?col:'#9a9080';x.fill();x.lineWidth=4;x.strokeStyle='#2a1a0a';x.stroke();
    x.fillStyle='#fff';x.font='900 22px "Noto Sans TC",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(L.t==='base'?'⌂':!open?'?':L.t==='ex'?'✦':done?'✓':'⚔',px,py+1);
    lab(open?L.n:'？？？',L.x,L.y+.048,21,open?'#2a1a0a':'#6a5a4a')}
  const cx=X(.88),cy=Y(.93);x.save();x.translate(cx,cy);for(let i=0;i<8;i++){x.rotate(PI/4);x.beginPath();x.moveTo(0,-(i%2?22:40));x.lineTo(7,0);x.lineTo(-7,0);x.closePath();x.fillStyle=i%2?'#c8a870':'#6a4a2a';x.fill()}x.restore();x.font='900 20px "Noto Serif TC",serif';x.fillStyle='#2a1a0a';x.textAlign='center';x.fillText('北',cx,cy-48);
  lab('洛塔林王國全圖',.50,.985,30,'#5a2a0a')}
let mapSel='base',mapTab='lotharin';
const MAPS={lotharin:{n:'洛塔林王國',L:()=>LOC,draw:(c,s2)=>drawKingdom(c,s2)},world:{n:'世界',L:()=>WLOC,draw:(c,s2)=>drawWorld(c,s2),open:()=>S.done.length>=6},deep:{n:'地心・巴別塔',L:()=>DLOC,draw:(c,s2)=>drawDeep(c,s2),open:()=>!!S.crown}};
function mapPanel(){const M=MAPS[mapTab];const LL=M.L();const L=LL.find(l=>l.id===mapSel)||LL[0];const open=locOpen(L);let info='';
  if(L.t==='base')info=`<div class="eb2">根據地</div><h3>${L.n}</h3><p>${L.d}</p><div class="row"><span class="own">你在這裡</span></div>`;
  else if(L.t==='link')info=`<div class="eb2">通往其他地圖</div><h3>${open?L.n:'？？？'}</h3><p>${open?L.d:'還沒有辦法通過。'}</p><div class="row">${open?`<button class="btn" id="goL">切換到「${MAPS[L.to].n}」</button>`:''}</div>`;
  else if(L.t==='bridge'){const c=BRIDGE;info=`<div class="eb2">工匠任務・芮塔</div><h3>${open?L.n:'？？？'}</h3><p>${!open?'打倒巨人之城的費朗布拉斯、拿到巨人的造橋圖之後，才能動工。':brOK()?'芮塔蓋的新橋。橋頭的石頭上刻著兩個名字：葛倫、芮塔。':'三百年前斷掉的古橋，對岸就是保加利亞的龍城。芮塔拿著巨人的造橋圖：「材料備齊，我就能把橋蓋起來。」'}</p>${open&&!brOK()?`<div class="row">${costH(c)}</div><div class="row"><button class="btn red" id="brB" ${canPayB(c)?'':'disabled'}>請芮塔蓋橋</button><span class="own">${canPayB(c)?'材料齊了！':'材料不夠：去探索區域或主線關卡採集'}</span></div>`:''}`}
  else if(L.t==='ex'){const Z=ZONES[L.zone];info=`<div class="eb2">探索區域・盛產${MATN[Z.mat]}</div><h3>${open?L.n:'？？？'}</h3><p>${open?L.d:`尚未開放：${['','完成卷一','完成卷二'][L.req]}後解鎖。`}</p><div class="row">${open?'<button class="btn" id="goL">前往探索</button>':''}</div>`}
  else{const b=BOUNTY[L.bi],done=S.done.includes(L.bi);info=`<div class="eb2">主線・${b.vol}「${open?b.title:'？？？'}」</div><h3>${open?L.n:'？？？'}</h3><p>${open?b.desc:L.bi===9&&S.done.length>=9?'多瑙河上的橋斷了，過不去。先點地圖上的「多瑙河斷橋」，請芮塔把橋蓋起來。':'前一卷完成之後，才會知道這裡發生了什麼。'}</p><div class="row">${open?`<button class="btn red" id="goL">${done?'再次討伐':'出征'}</button><span class="own">建議等級 ${b.lv}・目標：${b.name}</span>`:''}</div>`}
  const tabs=Object.entries(MAPS).filter(([k,m])=>!m.open||m.open());
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>${M.n}</h2>${tabs.length>1?`<div class="tabs2" style="margin:0 0 8px">${tabs.map(([k,m])=>`<button class="tb ${k===mapTab?'on':''}" data-mt="${k}">${m.n}</button>`).join('')}</div>`:''}<div class="sub">點地圖上的地點查看。紅色是主線戰役，綠色是收集材料的探索區域，紫色可以切換地圖。</div><canvas id="kmap" width="720" height="960"></canvas><div class="minfo">${info}</div>`);
  const cv=$('#kmap');M.draw(cv,mapSel);$('#px').onclick=closePanel;
  document.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{mapTab=b.dataset.mt;mapSel=MAPS[mapTab].L()[0].id;SFX.tap();mapPanel()});
  cv.onclick=e=>{const rc=cv.getBoundingClientRect();const u=(e.clientX-rc.left)/rc.width,v=(e.clientY-rc.top)/rc.height;let best=null,bd=.005;for(const l of LL){const d=(l.x-u)**2+((l.y-v)*1.33)**2;if(d<bd){bd=d;best=l}}if(best){mapSel=best.id;SFX.tap();mapPanel();$('.minfo').scrollIntoView({block:'nearest'})}};
  const bb=$('#brB');if(bb)bb.onclick=()=>{const c=BRIDGE;if(!canPayB(c))return;S.gold-=c.gold;for(const k of['wood','stone','iron'])S.mat[k]-=c[k];S.bridge=1;save();SFX.lvl();closePanel();say(STORY.bridge,()=>{toast('龍城開放了！',2400);mapSel='c9';mapPanel()})};
  const gb=$('#goL');if(gb)gb.onclick=()=>{if(L.t==='link'){mapTab=L.to;mapSel=MAPS[mapTab].L()[0].id;SFX.tap();mapPanel();return}closePanel();if(L.t==='ex')goExplore(L.zone);else goZone(L.bi)};
  if(!S.seen.map){S.seen.map=1;save();say([['nar','洛塔林王國。北方群山的後面是赤燼之地；西邊是大海；洛瓦河由東向西，把王國分成兩半。'],['oren','暮鐘鎮在王國最南邊。要把三截鐘舌找回來，你們得走遍整個王國。先從鎮外的近郊開始吧。','calm']])}
  else if(mapTab==='world'&&!S.seen.wmap){S.seen.wmap=1;save();say([['nar','大陸比洛塔林大得多。北方是終年冰封的極寒之地，往東是巨人的山脈、像海一樣的裏海、古波斯的沙漠、絲路上的樓蘭，最後是世界屋脊。'],['nar','十二位聖騎士，就在這條路上等著。']])}}

