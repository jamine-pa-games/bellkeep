/* 轉職聖殿、多瑙河橋、地區怪物與場景、傳說武器、魂之號角、轉職、村民委託 */
/* ---------- temple, bridge, zmey, craftsman helpers ---------- */
const ritaOn=()=>S.cls==='rita'||!!(MATE&&MATE.id==='rita');
const matMul=()=>(ritaOn()?1.5:1)*(1+.15*rk('pmat'));
const BRIDGE={gold:8000,wood:120,stone:90,iron:40};
SYM.mine=function(x){x.beginPath();x.arc(0,8,24,PI,0);x.lineTo(26,16);x.lineTo(-26,16);x.closePath();x.fill();for(let i=0;i<5;i++){const a=PI+i*PI/4;x.save();x.translate(Math.cos(a)*30,8+Math.sin(a)*30);x.rotate(a+PI/2);x.fillRect(-4,-6,8,12);x.restore()}x.beginPath();x.arc(0,-2,6,0,TAU);x.fillStyle='#ff5a2a';x.fill()};
SYM.pmat=SYM.slam;SYM.forge=SYM.turret;
STORY.temple=[['priest','我是艾德蕾，轉職聖殿的祭司。聖殿裡供奉著十二聖騎士留下的道路。','calm'],['priest','劍、弓、聖歌、火藥——每一條路走到某個地方，都會分成兩條。選了，就不能回頭。','calm'],['priest','等你準備好了（角色 Lv20、完成第一部），就來接受試煉吧。','smile']];
STORY.bridge=[['rita','大家退後！木頭先上，石墩再灌，最後用鐵把它們鉚在一起。','smile'],['nar','芮塔在河岸上忙了三天三夜。巨人留下的石墩還在，她只是把三百年前斷掉的地方，一段一段接回去。'],['nar','第四天早上，橋通了。橋頭的石頭上，刻著兩個名字：葛倫、芮塔。'],['rita','爸爸畫了一半的橋，我把它蓋完了。','smile'],['ivy','過了河，就是保加利亞的龍城。','calm']];
function templePanel(){if(advPanelIfReady())return;const a=advInfo();let msg;
  if(!a)msg=`艾德蕾：「轉職，是選擇你要成為什麼樣的人。」<br>轉職條件：角色 Lv20（目前 ${S.lv}）・完成第一部。`;
  else if(a.awake)msg=`艾德蕾：「你已經走到「${a.an}」的盡頭了。剩下的路，只能自己走。」`;
  else msg=`艾德蕾：「${a.n}的盡頭，還有一扇門。」<br>覺醒條件：角色 Lv36（目前 ${S.lv}）・王者之裝 6 件（目前 ${(S.reg||[]).length}）。`;
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>轉職聖殿</h2><div class="sub">${msg}</div><div class="shop">${ADV[S.cls].map(o=>`<div class="si"><img src="${skIcon(o.ult)}" alt=""><div style="flex:1;min-width:0"><b>${o.n}${a&&a.k===o.k?'　<span style="color:#8fe0a0">你的道路</span>':''}</b><small>${o.d}<br><span style="color:#ffd06a">奧義「${o.un}」：${o.ud}</span><br>覺醒後：${o.an}</small></div></div>`).join('')}</div>`);$('#px').onclick=closePanel}
function addZmey(){const m=makeWyrm();const g=m.root;const S0=1.5;g.scale.setScalar(S0);const c=W.arena;let ft=3;const hp=new THREE.Vector3();
  fx(g,1e6,(f,k,dt)=>{const t=performance.now()/1000;g.position.set(c.x,0,c.z);m.segs.forEach((s,i)=>{const an=t*.3-i*.3;s.position.set(Math.cos(an)*12/S0,(6.5+Math.sin(t*.9+i*.6)*.9)/S0,Math.sin(an)*12/S0);s.rotation.y=-an});
    ft-=dt||0;if(ft<=0){ft=5+Math.random()*3;m.segs[0].getWorldPosition(hp);PS.emit({x:hp.x,y:hp.y,z:hp.z},26,0xff7a2a,4,.7,0,-2,.6);flashLight(hp.clone(),0xff7a2a,3,.3)}})}

/* ---------- regional monsters ---------- */
Object.assign(EN,{
 giant:{name:'山巨人',hp:900,atk:40,spd:2.1,rng:2.6,xp:60,gold:16,r:1.3,slam:1},
 giantrock:{name:'巨人投石手',hp:620,atk:34,spd:2.2,rng:9,xp:50,gold:14,r:1.1,ranged:1,rock:1,pc:0x9a9488,pg:0x5a4a3a},
 yeti:{name:'雪原雪人',hp:700,atk:36,spd:2.6,rng:2.4,xp:48,gold:12,r:1.1,slam:1},
 frostwolf:{name:'霜狼',hp:170,atk:18,spd:5.4,rng:1.7,xp:14,gold:4,r:.7},
 dragonkin:{name:'龍裔戰士',hp:460,atk:32,spd:3,rng:2,xp:34,gold:11,r:.75},
 drakeling:{name:'幼龍',hp:280,atk:26,spd:3.6,rng:7,xp:28,gold:9,r:.8,ranged:1,fire:1,pc:0xffc04a,pg:0xff5a1a},
 drowned:{name:'溺亡水手',hp:260,atk:24,spd:2.9,rng:1.8,xp:20,gold:7,r:.6},
 crab:{name:'裏海巨蟹',hp:520,atk:28,spd:2.4,rng:1.9,xp:30,gold:10,r:.9},
 scorp:{name:'沙漠巨蠍',hp:380,atk:28,spd:3.4,rng:1.9,xp:26,gold:9,r:.9},
 sandwraith:{name:'沙之亡靈',hp:240,atk:26,spd:3.2,rng:7.5,xp:24,gold:8,r:.6,ranged:1,fire:1,pc:0xfff0b0,pg:0xd8a040},
 yaksha:{name:'夜叉',hp:420,atk:34,spd:3.4,rng:2,xp:32,gold:10,r:.75},
 brick:{name:'塔磚傀儡',hp:560,atk:34,spd:2.2,rng:2.2,xp:32,gold:10,r:1,slam:1},
 babbler:{name:'亂語祭司',hp:260,atk:28,spd:3,rng:8,xp:26,gold:9,r:.6,ranged:1,fire:1,pc:0xe8c0ff,pg:0x9a4aff}});
const tintM=(m,c,a)=>{const C=new THREE.Color(c);m.M.list.forEach(x=>x.color.lerp(C,a));return m};
const CHB=(o,sc)=>makeChibi(Object.assign({skin:0xd8b8a0,hair:0x3a2a20,eye:0x222222,outfit:0x6a6a6a,trim:0xb0a080,pants:0x3a3a3a,boots:0x2a2a2a,style:'bald',weapon:'sword'},o),sc);
function makeCrab(col,tail){const M=MatSet();const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  M.part(body,G.sph(.55,14,10),col,0,.55,0,{sc:[1.3,.55,1]});
  for(const s of[-1,1]){M.part(body,G.cyl(.04,.04,.3,5),col,s*.18,.85,.35);M.part(body,G.sph(.07,6,6),0x111111,s*.18,1.02,.35,{ol:false});
    const cl=new THREE.Group();cl.position.set(s*.75,.6,.5);body.add(cl);M.part(cl,G.sph(.24,10,8),col,0,0,.2,{sc:[.8,.6,1.3]});M.part(cl,G.cone(.09,.38,5),col,s*.1,0,.55,{rot:[PI/2,0,0]})}
  const legs=[];for(const [s,zz] of [[-1,.15],[1,.15],[-1,-.3],[1,-.3]]){const Lg=new THREE.Group();Lg.position.set(s*.62,.5,zz);body.add(Lg);M.part(Lg,G.cyl(.05,.04,.75,5),col,s*.22,-.25,0,{rot:[0,0,s*.75]});legs.push(Lg)}
  if(tail){[[0,.62,-.7],[0,.98,-1],[0,1.38,-1.05],[0,1.7,-.86],[0,1.86,-.52]].forEach((p,i)=>M.part(body,G.sph(.17-i*.015,8,6),col,p[0],p[1],p[2]));M.part(body,G.cone(.09,.4,6),0x2a1a10,0,1.72,-.24,{rot:[2.3,0,0]})}
  return{root,body,legs,arms:[],M,kind:'quad'}}
function wingsTail(m,col){const b=m.body||m.root;m.M.part(b,G.cone(.16,1.1,6),col,0,.55,-.55,{rot:[-1.9,0,0]});for(const s of[-1,1])m.M.part(b,G.cone(.55,1.2,3),col,s*.6,1.55,-.35,{rot:[.3,0,s*1.15],sc:[1,1,.18]});return m}
const _be2=buildEnemy2;
buildEnemy2=function(type){switch(type){
  case 'giant':return CHB({skin:0xc89a78,hair:0x6a4a28,eye:0x3a2a1a,outfit:0x7a5a3a,trim:0xb08a50,pants:0x4a3a2a,boots:0x2a2018,weapon:'bighammer'},2);
  case 'giantrock':{const m=CHB({skin:0xd0a080,hair:0x8a5a30,outfit:0x5a6a3a,trim:0xa08a50,style:'messy',weapon:'hammer'},1.7);m.M.part(m.body||m.root,G.dode(.42),0x9a9488,.55,1.9,.2);return m}
  case 'yeti':return CHB({skin:0xeef4ff,hair:0xffffff,eye:0x3a7ad0,outfit:0xdfe8f4,trim:0xbfd8f0,pants:0xdfe8f4,boots:0xbfd0e8,weapon:'bighammer',horns:1},1.9);
  case 'frostwolf':return tintM(makeWolf(false),0xbfe4ff,.6);
  case 'dragonkin':return wingsTail(CHB({skin:0xb04a2a,hair:0x3a1010,eye:0xffd04a,outfit:0x5a1a10,trim:0xf0c35a,pants:0x3a1010,boots:0x2a0a08,style:'helm',horns:1,weapon:'axe'},1.15),0xa83a22);
  case 'drakeling':{const m=tintM(makeWyrm(),0xd04a2a,.55);m.root.scale.setScalar(.42);return m}
  case 'drowned':return CHB({skin:0x8ab0a0,hair:0x2a3a3a,eye:0x6affd0,outfit:0x2a4a5a,trim:0x8a9a8a,style:'messy',weapon:'sword'},1.05);
  case 'crab':return makeCrab(0xc8502a,false);
  case 'scorp':return makeCrab(0xc89a4a,true);
  case 'sandwraith':return CHB({skin:0xd8c8a0,hair:0xe8dcc0,eye:0x6affff,outfit:0xc8b890,trim:0xa09070,pants:0xc8b890,boots:0xa09070,weapon:'staff'},1.05);
  case 'yaksha':return CHB({skin:0x3a6ab0,hair:0x1a1a3a,eye:0xffd04a,outfit:0x8a1a2a,trim:0xf0c35a,style:'messy',horns:1,weapon:'axe'},1.25);
  case 'brick':{const m=makeGolem(false,0x9a5a3a,0xffb04a);m.root.scale.setScalar(1.25);return m}
  case 'babbler':return CHB({skin:0xd8b8a0,hair:0x2a1a3a,eye:0xc07aff,outfit:0x3a1a4a,trim:0xb07aff,style:'long',weapon:'staff'},1.05)}
  return _be2(type)};

/* ---------- regional scenery ---------- */
const PRP={
 pillar(sc,x,z,r,h,c){const m=new THREE.Mesh(G.cyl(1.4,1.6,h,10),tm(c,{flat:1}));m.position.set(x,h/2,z);m.castShadow=true;sc.add(m);const cap=new THREE.Mesh(G.box(3.8,.9,3.8),tm(c,{flat:1}));cap.position.set(x,h+.45,z);cap.castShadow=true;sc.add(cap)},
 box(sc,x,z,w,h,d,c,ry=0){const m=new THREE.Mesh(G.box(w,h,d),tm(c,{flat:1}));m.position.set(x,h/2,z);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;sc.add(m);return m},
 glow(sc,x,y,z,c,s=2){const g=new THREE.Sprite(new THREE.SpriteMaterial({map:texGround('glow'),color:c,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.7}));g.scale.set(s,s,1);g.position.set(x,y,z);sc.add(g)}};
const ZPROP={
 giant1(sc,x,z,r){const q=r();
   if(q<.35){const h=r()<.4?5+r()*4:13+r()*6;PRP.pillar(sc,x,z,r,h,0xb8a888)}
   else if(q<.6){for(let i=0;i<3;i++)PRP.box(sc,x+i*.4,z-i*2.6,4.2,2.4*(i+1),2.6,0xa89a80)}
   else if(q<.8){const sw=new THREE.Group();sw.position.set(x,0,z);sw.rotation.set(r()*.3-.15,r()*3,r()*.4-.2);sc.add(sw);const bl=new THREE.Mesh(G.box(.5,9,1.5),tm(0x9aa0a8,{flat:1}));bl.position.y=3.5;bl.castShadow=true;sw.add(bl);const gd=new THREE.Mesh(G.box(.7,.6,4),tm(0x7a5a30,{flat:1}));gd.position.y=8.2;sw.add(gd);const hd=new THREE.Mesh(G.cyl(.35,.35,2.2,8),tm(0x5a3a20));hd.position.y=9.6;sw.add(hd)}
   else{const hm=new THREE.Mesh(new THREE.SphereGeometry(2.3,16,10,0,TAU,0,PI/2),tm(0x8a6a4a,{flat:1}));hm.position.set(x,0,z);hm.rotation.set(r()*.6,r()*3,r()*.4);hm.castShadow=true;sc.add(hm);const vs=new THREE.Mesh(G.box(3.2,.3,.6),tm(0x5a4030));vs.position.set(x,1,z+2);sc.add(vs)}},
 giant2(sc,x,z,r){const q=r();
   if(q<.3){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r()*3;sc.add(g);const bm=tm(0xe8dcc0,{flat:1});for(let i=0;i<5;i++)for(const s2 of[-1,1]){const rb=new THREE.Mesh(new THREE.TorusGeometry(1.6-i*.15,.12,5,10,PI*.8),bm);rb.position.set(s2*.1,0,i*1.1-2.2);rb.rotation.set(0,s2>0?0:PI,PI/2+s2*.2);rb.rotation.y=PI/2;rb.rotation.x=s2*.25;g.add(rb)}const sk=new THREE.Mesh(G.box(1.2,.9,2),bm);sk.position.set(0,.45,3.6);g.add(sk);for(const s2 of[-1,1]){const hn=new THREE.Mesh(G.cone(.15,1.2,5),bm);hn.position.set(s2*.4,1.2,3.2);hn.rotation.x=-.8;g.add(hn)}}
   else if(q<.55){const g=new THREE.Group();g.position.set(x,0,z);sc.add(g);const p=new THREE.Mesh(G.cyl(.08,.1,5,6),tm(0x3a2a1a));p.position.y=2.5;g.add(p);const f=new THREE.Mesh(G.box(.06,2.6,1.4),tm(0x9a1a10));f.position.set(0,3.4,.7);g.add(f);const e=new THREE.Mesh(G.box(.07,.6,.6),tm(0xf0c35a,{e:0x6a4a00}));e.position.set(0,3.6,.7);g.add(e)}
   else if(q<.8){const c=new THREE.Mesh(new THREE.PlaneGeometry(.5,3+r()*3),new THREE.MeshBasicMaterial({color:0xff6a1a}));c.rotation.set(-PI/2,0,r()*3);c.position.set(x,.04,z);sc.add(c);PRP.glow(sc,x,.3,z,0xff5a1a,3)}
   else rockP(sc,x,z,1+r(),0x5a2a22)},
 ice(sc,x,z,r){const g=new THREE.Group();g.position.set(x,0,z);sc.add(g);const n=3+(r()*4|0);for(let i=0;i<n;i++){const h=1.5+r()*3.5;const c=new THREE.Mesh(G.cone(.35+r()*.4,h,5),tm(0xbfe8ff,{e:0x2a5a7a}));c.position.set(r()*2-1,h/2,r()*2-1);c.rotation.set(r()*.4-.2,0,r()*.4-.2);c.castShadow=true;g.add(c)}},
 sea(sc,x,z,r){if(r()<.25){ship(sc,x,z,r()*3);return}const g=new THREE.Group();g.position.set(x,0,z);sc.add(g);const rk=new THREE.Mesh(G.dode(.8),tm(0x5a6a6a,{flat:1}));rk.position.y=.4;g.add(rk);for(let i=0;i<4;i++){const w=new THREE.Mesh(G.cone(.08,1+r(),4),tm(0x3a7a4a));w.position.set(r()-.5,.7,r()-.5);w.rotation.z=r()*.6-.3;g.add(w)}},
 persia(sc,x,z,r){const q=r();
   if(q<.45){const h=7+r()*3;const c=new THREE.Mesh(G.cyl(.45,.55,h,12),tm(0xe0c89a,{flat:1}));c.position.set(x,h/2,z);c.castShadow=true;sc.add(c);for(const s2 of[-1,1]){const b=new THREE.Mesh(G.box(1.1,.9,.8),tm(0xc8a878,{flat:1}));b.position.set(x+s2*.7,h+.4,z);sc.add(b);const hn=new THREE.Mesh(G.cone(.12,.5,5),tm(0xc8a878));hn.position.set(x+s2*1.1,h+1,z);sc.add(hn)}}
   else if(q<.75){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.z=r()*.3-.15;sc.add(g);const tr=new THREE.Mesh(G.cyl(.16,.22,5,6),tm(0x8a6a3a,{flat:1}));tr.position.y=2.5;g.add(tr);for(let i=0;i<7;i++){const lf=new THREE.Mesh(G.cone(.35,2.2,3),tm(0x4a8a3a,{flat:1}));lf.position.y=5;lf.rotation.set(1.9,i/7*TAU,0);lf.position.add(new THREE.Vector3(Math.sin(i/7*TAU)*.7,0,Math.cos(i/7*TAU)*.7));g.add(lf)}}
   else{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r()*3;sc.add(g);const sm2=tm(0xd0b888,{flat:1});const bd=new THREE.Mesh(G.box(1.4,1.8,3),sm2);bd.position.y=1.6;g.add(bd);const hd=new THREE.Mesh(G.box(1.2,1.4,1),sm2);hd.position.set(0,2.8,1.8);g.add(hd);const bd2=new THREE.Mesh(G.box(1,1.2,.5),tm(0x8a6a4a,{flat:1}));bd2.position.set(0,2,2.4);g.add(bd2);for(const s2 of[-1,1]){const wg=new THREE.Mesh(G.box(.15,1.6,2.4),sm2);wg.position.set(s2*.78,2.6,-.2);wg.rotation.z=s2*.2;g.add(wg)}const bs=new THREE.Mesh(G.box(1.6,.7,3.4),sm2);bs.position.y=.35;g.add(bs)}},
 desert(sc,x,z,r){const q=r();
   if(q<.45){const d=new THREE.Mesh(G.sph(2+r()*2,12,8),tm(0xe0c088,{flat:1}));d.scale.y=.28;d.position.set(x,0,z);d.receiveShadow=true;sc.add(d)}
   else if(q<.8){const n=2+(r()*3|0);for(let i=0;i<n;i++)PRP.box(sc,x+i*1.6,z+r()-.5,1.6,1+r()*2.2,.9,0xc8a070,r()*.3)}
   else tree(sc,x,z,.9+r()*.4,'dead')},
 tibet(sc,x,z,r){const q=r();
   if(q<.4){const g=new THREE.Group();g.position.set(x,0,z);sc.add(g);const b=new THREE.Mesh(G.box(2.4,1,2.4),tm(0xf4efe2,{flat:1}));b.position.y=.5;g.add(b);const d=new THREE.Mesh(G.sph(1.1,12,8),tm(0xf4efe2,{flat:1}));d.position.y=1.5;d.castShadow=true;g.add(d);const sp=new THREE.Mesh(G.cone(.3,1.6,8),tm(0xf0c35a,{e:0x5a3a00}));sp.position.y=3.2;g.add(sp)}
   else if(q<.75){const a=[x,z],b2=[x+r()*6-3,z+r()*6-3];for(const p of[a,b2]){const pl=new THREE.Mesh(G.cyl(.06,.06,3.6,5),tm(0x5a3a20));pl.position.set(p[0],1.8,p[1]);sc.add(pl)}const cols=[0x3a6ad0,0xf4efe2,0xc8302a,0x3aa04a,0xf0c35a];for(let i=0;i<10;i++){const t=(i+.5)/10;const f=new THREE.Mesh(G.box(.35,.45,.04),tm(cols[i%5]));f.position.set(lerp(a[0],b2[0],t),3.3-Math.sin(t*PI)*.6,lerp(a[1],b2[1],t));f.rotation.y=Math.atan2(b2[0]-a[0],b2[1]-a[1])+PI/2;sc.add(f)}}
   else{for(let i=0;i<4;i++){const st=new THREE.Mesh(G.box(.9-i*.15,.25,.7-i*.1),tm(i%2?0x8a8a94:0x6a6a74,{flat:1}));st.position.set(x,.12+i*.25,z);st.rotation.y=r();sc.add(st)}}},
 babel(sc,x,z,r){const q=r();
   if(q<.45){const w=3+r()*3,h=2+r()*4;const m=PRP.box(sc,x,z,w,h,.9,0x9a5a3a,r()*3);const cols=[0xffb04a,0x8ad0ff,0xc07aff,0x8fe0a0];for(let i=0;i<4;i++){const gl=new THREE.Mesh(G.box(.35,.35,.05),addM(cols[i],1));gl.position.set((r()-.5)*(w-.6),.6+r()*(h-1)-h/2,.47);m.add(gl)}}
   else if(q<.7){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r()*3;sc.add(g);const bm=tm(0x8a4a2a,{flat:1});for(const s2 of[-1,1]){const p=new THREE.Mesh(G.box(.9,5,.9),bm);p.position.set(s2*2,2.5,0);p.castShadow=true;g.add(p)}const ar=new THREE.Mesh(new THREE.TorusGeometry(2,.45,6,12,PI),bm);ar.position.y=5;g.add(ar)}
   else{for(let i=0;i<3;i++){const b=new THREE.Mesh(G.box(1.2,.5,.6),tm(0xa86a42,{flat:1}));b.position.set(x+r()*2-1,2+r()*3,z+r()*2-1);b.rotation.set(r(),r(),r());sc.add(b)}PRP.glow(sc,x,2.5,z,0xffa040,3)}}};
ZPROP.frost1=ZPROP.frost2=ZPROP.demon2=ZPROP.ice;ZPROP.casp1=ZPROP.casp2=ZPROP.sea;ZPROP.pers1=ZPROP.pers2=ZPROP.persia;ZPROP.loul1=ZPROP.loul2=ZPROP.desert;ZPROP.demon1=ZPROP.tibet;ZPROP.deep1=ZPROP.deep2=ZPROP.deep3=ZPROP.babel;
const ZLAND={
 giant1(sc,a){const c=0x9a8a70;PRP.box(sc,a.x,a.z-a.r-4,12,3,6,c);PRP.box(sc,a.x,a.z-a.r-7,12,16,1.6,c);for(const s2 of[-1,1]){PRP.box(sc,a.x+s2*6.5,a.z-a.r-4,1.6,6,6,c);PRP.pillar(sc,a.x+s2*(a.r+3),a.z-4,null,18,0xb8a888)}const cr=new THREE.Mesh(G.cyl(2.2,2.6,1,8),tm(0xf0c35a,{e:0x4a3000}));cr.position.set(a.x,16.5,a.z-a.r-7);sc.add(cr)},
 giant2(sc,a){for(const s2 of[-1,1]){const m=makeWyrm();tintM(m,0x6a6460,.85);const g=m.root;g.position.set(a.x+s2*(a.r+2.5),0,a.z+a.r-2);g.scale.setScalar(1.3);g.rotation.y=s2>0?-PI/2:PI/2;m.segs.forEach((sg,i)=>{const an=i*.75;sg.position.set(Math.cos(an)*1.6*(1-i*.05),.9+i*.42,Math.sin(an)*1.6*(1-i*.05))});m.segs[0].position.set(0,4.6,1.2);sc.add(g);PRP.box(sc,a.x+s2*(a.r+2.5),a.z+a.r-2,4,.8,4,0x5a4a44)}}};

/* ---------- legendary weapons & the soul horn ---------- */
function legPre(range,rate){const tg=nearestEnemy(P.pos,range+.5);if(!tg)return null;faceTo(tg.pos.x,tg.pos.z);P.anim=.32;P.atkT=rate*(advK()==='berserker'?.65:1)*(P.frenzy>0?.5:1);return{tg,A:atkNow()}}
function swingHit(range,arc,col,each){SFX.swing();vSlash(P.pos,P.face,col,range+.2);setTimeout(()=>{if(!P)return;for(const e of EN_LIST){if(e.dead)continue;const dx=e.pos.x-P.pos.x,dz=e.pos.z-P.pos.z;const d=Math.hypot(dx,dz)-e.r;if(d>range)continue;let a=Math.atan2(dx,dz)-P.face;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)<arc||d<.6)each(e)}},90)}
function swordWave(A){const f=new THREE.Vector3(Math.sin(P.face),0,Math.cos(P.face));const g=new THREE.Group();g.position.set(P.pos.x+f.x,1,P.pos.z+f.z);g.rotation.y=P.face;const mats=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(1.1-i*.18,.09,4,18,PI*.85),new THREE.MeshBasicMaterial({color:new THREE.Color().setHSL(((performance.now()/900)+i*.33)%1,1,.65),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.set(PI/2,0,PI*.075);g.add(m);mats.push(m.material)}const hit=new Set();
  fx(g,.55,(F,k,dt)=>{g.position.addScaledVector(f,22*(dt||.016));mats.forEach((m,i)=>{m.color.setHSL((k*2+i*.33)%1,1,.65);m.opacity=1-k*.6});for(const e of EN_LIST){if(e.dead||hit.has(e))continue;if(dist2(g.position,e.pos)<(1.2+e.r)**2){hit.add(e);hitEnemy(e,A,{kb:2,col:0xffffff})}}})}
function lightArrows(A,tg){const n=3+((Math.random()*3)|0);const f=new THREE.Vector3(tg.pos.x-P.pos.x,0,tg.pos.z-P.pos.z).normalize();const sd=new THREE.Vector3(f.z,0,-f.x);SFX.shoot();
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*.75;const g=new THREE.Group();g.position.set(P.pos.x+sd.x*off,1,P.pos.z+sd.z*off);g.rotation.y=Math.atan2(f.x,f.z);const c=new THREE.Mesh(G.box(.06,.06,1.6),new THREE.MeshBasicMaterial({color:0xfffbe0}));g.add(c);const gl=new THREE.Mesh(G.box(.24,.24,2.4),addM(0xffe07a,.55));g.add(gl);
    fx(g,.32,(F,k,dt)=>{if(g.done)return;g.position.addScaledVector(f,52*(dt||.016));for(const e of EN_LIST){if(e.dead)continue;if(dist2(g.position,e.pos)<(e.r+.55)**2){g.done=1;g.visible=false;hitEnemy(e,A*.4,{col:0xffe07a});explode(new THREE.Vector3(g.position.x,0,g.position.z),1.8,A*.32,0xffd06a);break}}})}}
let SUMM=[];
function summonMinion(A){SUMM=SUMM.filter(s=>s.alive&&s.m.root.parent===scene);if(SUMM.length>=3)return;const sk=Math.random()<.5;
  const m=sk?CHB({skin:0xeeeadf,hair:0xeeeadf,eye:0x6affd0,outfit:0x9a9a8a,trim:0x6a6a5a,pants:0x8a8a7a,boots:0x5a5a4a,weapon:'sword'},.85):tintM(makeImp(),0x5aa04a,.65);
  const a=Math.random()*TAU;m.root.position.set(P.pos.x+Math.cos(a)*2,0,P.pos.z+Math.sin(a)*2);const s={m,pos:m.root.position,alive:true,cd:.4,t:0,anim:0};SUMM.push(s);
  vPillar(s.pos,0x8fe0a0,.8,3,.5);vRing(s.pos,0x8fe0a0,.2,1.6,.4);PS.emit({x:s.pos.x,y:.3,z:s.pos.z},14,0x6a5a4a,2,.5,2,4,.4);toast(sk?'骷髏兵從地底爬了出來':'地精前來助戰',900);
  fx(m.root,15,(F,k,dt)=>{dt=dt||.016;s.t+=dt;if(F.life<.2||mode!=='zone'){s.alive=false;return}const tg=nearestEnemy(s.pos,12);let mv=0;
    if(tg){const dx=tg.pos.x-s.pos.x,dz=tg.pos.z-s.pos.z,d=Math.hypot(dx,dz);m.root.rotation.y=Math.atan2(dx,dz);if(d>tg.r+1){s.pos.x+=dx/d*5.5*dt;s.pos.z+=dz/d*5.5*dt;mv=1}else{s.cd-=dt;if(s.cd<=0){s.cd=.9;s.anim=.3;hitEnemy(tg,A*.55,{kb:1,col:0x8fe0a0})}}}
    else{const dx=P.pos.x-s.pos.x,dz=P.pos.z-s.pos.z,d=Math.hypot(dx,dz);if(d>3){s.pos.x+=dx/d*6*dt;s.pos.z+=dz/d*6*dt;mv=1;m.root.rotation.y=Math.atan2(dx,dz)}}
    if(s.anim>0)s.anim-=dt;animModel(m,s.t,mv,s.anim>0?s.anim/.3:0,dt)})}
const LEGW={
 rainbow(){const full=P.hp>=P.max-1;const L=legPre(full?11:2.4,.5);if(!L)return;const {tg,A}=L;if(Math.sqrt(dist2(P.pos,tg.pos))-tg.r<2.6)swingHit(2.4,1.1,0xcfe8ff,e=>hitEnemy(e,A,{kb:3}));if(full){swordWave(A*1.1);tone(900,.08,'triangle',.02,.5)}},
 ruin(){const L=legPre(2.8,.7);if(!L)return;const {A}=L;if(Math.random()<.2){SFX.swing();vSlash(P.pos,P.face,0x8a8a8a,3);dmgNum(P.pos,'MISS','tx',2.6);return}swingHit(2.8,1.3,0xff6a4a,e=>hitEnemy(e,A*1.3,{kb:4,critB:.3,col:0xff6a4a}));shake(.06,.08)},
 pope(){const L=legPre(9,.6);if(!L)return;const {tg,A}=L;SFX.shoot();shoot('orb',tg,A*.85);P.popeT=P.popeT||0;if(gt-P.popeT>5){P.popeT=gt;summonMinion(A)}},
 swift(){const L=legPre(12,.45);if(!L)return;lightArrows(L.A,L.tg)},
 titan(){const L=legPre(2.8,.75);if(!L)return;const {A}=L;P.titanN=(P.titanN||0)+1;swingHit(2.8,1.2,0xe0c080,e=>hitEnemy(e,A*1.5,{kb:3,col:0xe0c080}));
   if(P.titanN%5===0){setTimeout(()=>{if(!P)return;explode(P.pos.clone(),4.5,A*2,0xc8a060,{big:1,kb:3});vRing(P.pos,0xf0d090,1,6,.5,.1);for(const e of EN_LIST)if(!e.dead&&dist2(P.pos,e.pos)<(4.5+e.r)**2)e.stun=Math.max(e.stun,e.boss?.3:rand(.3,.8));banner('','震地！')},150)}}};
function soulHorn(){P.soul=10;P.inv=10;P.soulT=0;P.soulA=0;tone(196,1.6,'sawtooth',.05);tone(294,1.4,'sawtooth',.04,0,.3);tone(392,1.2,'sawtooth',.03,0,.6);vPillar(P.pos,0x8ad8ff,2,12,1.2);vRing(P.pos,0x8ad8ff,.5,10,1);shake(.3,.4);banner('魂之號角','無敵 10 秒・身體不受控制')}
function soulTick(dt){P.soul-=dt;P.inv=Math.max(P.inv,.15);P.soulT-=dt;if(P.soulT<=0||!P.soulDir){P.soulT=.4+Math.random()*.6;const tg=Math.random()<.6?nearestEnemy(P.pos,16):null;const a=tg?Math.atan2(tg.pos.x-P.pos.x,tg.pos.z-P.pos.z)+rand(-.9,.9):Math.random()*TAU;P.soulDir=[Math.sin(a),Math.cos(a)]}
  if(Math.random()<.7)PS.emit({x:P.pos.x+rand(-.6,.6),y:rand(.3,2),z:P.pos.z+rand(-.6,.6)},1,0x8ad8ff,.8,.6,2,0,.3);
  P.soulA-=dt;if(P.soulA<=0){P.soulA=.16;const list=EN_LIST.filter(e=>!e.dead&&dist2(e.pos,P.pos)<144);const A=atkNow();if(list.length){const e=list[(Math.random()*list.length)|0];vBolt(new THREE.Vector3(P.pos.x,1.6,P.pos.z),new THREE.Vector3(e.pos.x,1,e.pos.z),0x8ad8ff,.2);hitEnemy(e,A*1.1,{kb:1.5,col:0x8ad8ff})}else{const a=Math.random()*TAU;vBolt(new THREE.Vector3(P.pos.x,1.6,P.pos.z),new THREE.Vector3(P.pos.x+Math.sin(a)*5,0,P.pos.z+Math.cos(a)*5),0x8ad8ff,.2)}}
  if(P.soul<=0){P.inv=.6;P.soulDir=null;toast('魂力散去了',1400)}
  return P.soulDir}
Object.defineProperty(TAC.horn,'n',{get:()=>S&&S.done.length>=6?'魂之號角':'羅蘭號角'});
Object.defineProperty(TAC.horn,'d',{get:()=>S&&S.done.length>=6?'吹響羅蘭的號角，召來十二聖騎士的魂力：10 秒內無敵、連續放出魂之雷擊，但身體不受控制，會自己亂衝亂打。':'吹響號角：10 秒內攻擊 +40%，並震暈周圍敵人。'});
/* ---------- class advancement ---------- */
const ADV={
 ivy:[{k:'paladin',n:'聖騎士',d:'所有傷害的 2% 轉為生命；生命 +20%。',ult:'judgement',un:'聖鐘審判',ud:'金色光柱轟擊周圍，回復一半生命並展開護盾。',an:'鐘之守護者'},{k:'berserker',n:'狂戰士',d:'攻擊速度 +35%、攻擊 +15%，生命 -10%。',ult:'feast',un:'血之狂宴',ud:'8 秒內攻速加倍、傷害 +50%、吸血 10%。',an:'血鐘戰神'}],
 roan:[{k:'ranger',n:'遊俠',d:'普攻一次射出三支箭；攻擊 +5%。',ult:'storm',un:'千箭風暴',ud:'3 秒內，周圍降下不停的箭雨。',an:'風之遊俠王'},{k:'sniper',n:'狙擊手',d:'暴擊傷害 1.8 → 2.4 倍；普攻貫穿；攻擊 +10%。',ult:'dawn',un:'破曉一擊',ud:'射出貫穿 30 公尺的光束，18 倍傷害。',an:'破曉之眼'}],
 sera:[{k:'bishop',n:'大主教',d:'出征時每 4 秒回復 4% 生命；生命 +15%。',ult:'angel',un:'天使降臨',ud:'完全回復、3 秒無敵、持續回血，周圍敵人暈眩。',an:'聖鳴大主教'},{k:'astral',n:'星術師',d:'法球爆炸範圍加倍；攻擊 +15%。',ult:'meteor',un:'流星雨',ud:'對附近敵人連續砸下 8 顆流星。',an:'星之預言者'}],
 rita:[{k:'gunner',n:'火砲大師',d:'炸彈範圍 +60%、傷害 +20%；攻擊 +10%。',ult:'barrage',un:'齊射',ud:'對附近敵人連續投出 10 顆火藥桶。',an:'雷霆砲神'},{k:'machinist',n:'機械師',d:'出征時有一座砲塔一直跟著你射擊。',ult:'mega',un:'巨型砲台',ud:'架設 15 秒的巨型砲台，射速極快。',an:'鋼鐵造物主'}]};
const ULTSYM={judgement:'guard',feast:'berserk',storm:'rain',dawn:'pierce',angel:'song',meteor:'star',barrage:'keg',mega:'turret'};
for(const k in ULTSYM){SYM[k]=SYM[ULTSYM[k]];SKC[k]='#e09a1a'}
function advInfo(){const a=S.adv&&S.adv[S.cls];if(!a)return null;const d=ADV[S.cls].find(x=>x.k===a.k);return d?Object.assign({},d,{awake:a.awake}):null}
const advK=()=>{const a=S.adv&&S.adv[S.cls];return a?a.k:null};
function advReady(){const a=advInfo();if(!a)return S.lv>=20&&S.done.length>=6;return!a.awake&&S.lv>=36&&(S.reg||[]).length>=6}
function advPanelIfReady(){if(!advReady())return false;const a=advInfo();
  if(!a){panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>轉職試煉</h2><div class="sub">艾德蕾：「你已經走過整個洛塔林了。選一條路吧——選了，就不能回頭。」<br>通過試煉騎士的考驗，就能轉職，並學會奧義。</div><div class="shop">${ADV[S.cls].map(o=>`<div class="si"><img src="${skIcon(o.ult)}" alt=""><div style="flex:1;min-width:0"><b>${o.n}</b><small>${o.d}<br><span style="color:#ffd06a">奧義「${o.un}」：${o.ud}</span></small><div class="row" style="margin-top:6px"><button class="btn red" data-tr="${o.k}">接受試煉</button></div></div></div>`).join('')}</div>`);
    $('#px').onclick=closePanel;document.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{closePanel();goTrial(b.dataset.tr,1)})}
  else{panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>覺醒試煉</h2><div class="sub">王者之裝在共鳴。艾德蕾：「${a.n}的盡頭，還有一扇門。」<br>覺醒為「<b style="color:var(--gold)">${a.an}</b>」：攻擊與生命 +30%，奧義威力 ×1.5、冷卻縮短。</div><div class="row"><button class="btn red" id="awk">接受覺醒試煉</button></div>`);$('#px').onclick=closePanel;$('#awk').onclick=()=>{closePanel();goTrial(a.k,2)}}
  return true}
function goTrial(path,tier){const ci=Math.min(S.done.length,BOUNTY.length-1);const Zb=ZONES[BOUNTY[ci].zone];ZONES.trial.idx=Zb.idx;ZONES.trial.m=Zb.m;fadeTo(()=>{mode='zone';setWorld(buildZone('trial','trialKnight'));W.trial={path,tier};P.pos.set(0,0,4);P.face=PI;updCam(0,true);hudOn();spawnMate();$('#skills').style.opacity=1;$('#quest').hidden=false;questZone();banner(tier===1?'轉職試煉':'覺醒試煉','試煉之間')})}
function trialWin(e){BOSS=null;slowMo=1.6;SFX.bell();$('#bossBar').hidden=true;for(const o of EN_LIST)if(o!==e&&!o.dead){o.hp=0;killEnemy(o)}for(const T of TELE)scene.remove(T.g);TELE=[];if(W.wall){scene.remove(W.wall);W.wall=null}W.arenaLocked=false;openPortal();const t=W.trial;S.adv=S.adv||{};if(t.tier===1)S.adv[S.cls]={k:t.path,awake:0};else S.adv[S.cls].awake=1;save();refreshStats();setupSkillButtons();hudSkills();const a=advInfo();banner(t.tier===1?'轉職成功':'覺醒',t.tier===1?a.n:a.an);vPillar(P.pos,0xffe08a,2,12,1.4);setTimeout(()=>say([['nar',t.tier===1?`${CH[S.cls].name}成為了「${a.n}」。\n奧義「${a.un}」已解鎖——右下角多了一顆金色的奧義按鈕（鍵盤 4）。`:`${CH[S.cls].name}覺醒為「${a.an}」。\n攻擊與生命 +30%，奧義威力提升、冷卻縮短。`]]),1600)}
const ULT={
 judgement(A){SFX.bell();vPillar(P.pos,0xffe08a,7,14,1.2);vRing(P.pos,0xffe08a,1,8,1);flashLight(P.pos,0xffe08a,8,.5);shake(.4,.4);for(const e of EN_LIST)if(!e.dead&&dist2(P.pos,e.pos)<(7+e.r)**2)hitEnemy(e,A*10,{kb:5,stun:2,col:0xffe08a});P.hp=Math.min(P.max,P.hp+P.max*.5);P.guard=4;if(P.guardFx)scene.remove(P.guardFx);P.guardFx=guardDome()},
 feast(){SFX.cast();P.frenzy=8;vRing(P.pos,0xff3a2a,1,6,.8);vPillar(P.pos,0xff3a2a,1.4,6,.8)},
 storm(A){let n=0;const iv=setInterval(()=>{if(!P||n>=15||mode!=='zone'){clearInterval(iv);return}n++;for(let k=0;k<6;k++){const a=Math.random()*TAU,rr=Math.random()*8;const p=new THREE.Vector3(P.pos.x+Math.cos(a)*rr,0,P.pos.z+Math.sin(a)*rr);vBeam(new THREE.Vector3(p.x+.6,6,p.z-.6),new THREE.Vector3(p.x,.1,p.z),0xcfffb0,.06,.12)}for(const e of EN_LIST)if(!e.dead&&dist2(P.pos,e.pos)<(8+e.r)**2)hitEnemy(e,A*.9,{col:0xcfffb0});SFX.shoot()},200)},
 dawn(A,tg,fwd){const a=new THREE.Vector3(P.pos.x,1,P.pos.z),b=a.clone().addScaledVector(fwd,30);vBeam(a,b,0xfff0a0,1.2,.6);vBeam(a,b,0xffffff,.4,.4);flashLight(P.pos,0xfff0a0,8,.4);shake(.3,.3);SFX.boom();for(const e of EN_LIST){if(e.dead)continue;const lx=e.pos.x-P.pos.x,lz=e.pos.z-P.pos.z;const al=lx*fwd.x+lz*fwd.z,pe=Math.abs(lx*fwd.z-lz*fwd.x);if(al>-1&&al<30&&pe<1.8+e.r)hitEnemy(e,A*18,{kb:6,critB:.5,col:0xfff0a0})}},
 angel(){SFX.bell();P.hp=P.max;P.regen=10;P.inv=3;P.guard=6;vPillar(P.pos,0xffffff,2,12,1.5);PB.emit({x:P.pos.x,y:2,z:P.pos.z},50,0xffffff,4,1.5,4,0,2);for(const e of EN_LIST)if(!e.dead&&!e.boss&&dist2(P.pos,e.pos)<100)e.stun=Math.max(e.stun,3)},
 meteor(A){const list=EN_LIST.filter(e=>!e.dead).sort((a,b)=>dist2(a.pos,P.pos)-dist2(b.pos,P.pos)).slice(0,8);const tg=list.length?list.map(e=>e.pos.clone()):[P.pos.clone()];for(let i=0;i<8;i++){const c=tg[i%tg.length].clone().add(new THREE.Vector3(rand(-2,2),0,rand(-2,2)));c.y=0;setTimeout(()=>{if(mode!=='zone')return;const met=new THREE.Mesh(G.sph(.8,12,8),addM(0xffb05a,1));met.position.set(c.x+5,14,c.z-5);scene.add(met);fx(met,.7,(f,k)=>{met.position.set(c.x+5*(1-k),14*(1-k)+.5,c.z-5*(1-k));if(k>=.98&&!f.done){f.done=1;explode(c,3.6,A*4,0xffa04a,{big:1,kb:3})}})},i*160)}},
 barrage(A){const list=EN_LIST.filter(e=>!e.dead).sort((a,b)=>dist2(a.pos,P.pos)-dist2(b.pos,P.pos)).slice(0,10);for(let i=0;i<10;i++){const e=list[i%Math.max(1,list.length)];const c=e?e.pos.clone():P.pos.clone().add(new THREE.Vector3(rand(-6,6),0,rand(-6,6)));c.y=0;setTimeout(()=>{if(mode==='zone')lob(c,A*3,3.2,0xff6a2a,.6,{big:1,kb:3})},i*120)}},
 mega(){SFX.cast();const T=spawnTurret();if(T){T.t=15;T.mega=1;T.g.scale.setScalar(1.9)}}};
function useUlt(){const a=advInfo();if(!a||!P||P.dead||mode!=='zone')return;if(P.cd[4]>0)return;P.cd[4]=a.awake?28:40;const tg=nearestEnemy(P.pos,14);if(tg)faceTo(tg.pos.x,tg.pos.z);P.anim=.5;const fwd=new THREE.Vector3(Math.sin(P.face),0,Math.cos(P.face));ULT[a.ult](atkNow()*(a.awake?1.5:1),tg,fwd);banner('奧義',a.un);hudSkills()}
$('#sk4').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();au();useUlt()});

/* ---------- village request chains (each villager has a short story, then it ends) ---------- */
const QCH={
 emma:[{k:'kill',en:'wolf',n:8,t:'狼群又來偷羊了……拜託幫我趕走 8 隻燼狼。',gold:150},{k:'kill',en:'imp',n:12,t:'灰燼小鬼燒了我家的穀倉。再幫我一次：擊敗 12 隻灰燼小鬼。',gold:300},{k:'chest',n:3,t:'我想重新種麥子，可是種子都被搶走了。聽說寶箱裡常藏著種子袋——幫我打開 3 個寶箱吧。',gold:500,fin:{name:'艾瑪的麥穗護符',slot:'charm'},end:'艾瑪在鎮外重新種起了麥田：「明年秋天，第一塊麵包是你們的。」'}],
 ben:[{k:'chest',n:2,t:'修道院的經書被劫掠者藏進了寶箱。請替我打開 2 個寶箱，把殘頁帶回來。',gold:300},{k:'kill',en:'golemling',n:10,t:'坑道裡的結晶傀儡是褻瀆之物。請擊敗 10 個結晶傀儡。',gold:500},{k:'elite',n:4,t:'最後幾頁經書，在精英怪物身上。打倒 4 個精英，把它們帶回來。',gold:800,fin:{name:'班尼迪的經書護符',slot:'charm'},end:'班尼迪把經書重新抄好，送了一本給瑟拉：「願鐘聲為妳指路。」'}],
 god:[{k:'elite',n:3,t:'年輕人，想讓人相信你？去打倒 3 個精英給我看。',gold:400},{k:'kill',en:'raider',n:15,t:'掠奪兵殺了我的戰友。替他們討回來：擊敗 15 個赤燼掠奪兵。',gold:700},{k:'kill',en:'knight',n:15,t:'鐵騎……我年輕時也是騎士。擊敗 15 個赤燼鐵騎，讓我知道這把劍該交給誰。',gold:1200,fin:{name:'老兵戈弗雷的劍',slot:'weapon'},end:'戈弗雷把他年輕時的佩劍交給你：「我這輩子沒當上英雄。這把劍，換你們來。」'}]};
function ensureQuests(){S.q=S.q||{};S.qi=S.qi||{};for(const g of qgAvail()){if(S.q[g])continue;const i=S.qi[g]||0;if(i<QCH[g].length)S.q[g]=Object.assign({},QCH[g][i],{p:0})}}
TEV[6]={t:'第十三聲',lines:[['nar','聖鳴響了十三聲。最後一聲，在大陸的另一端，喚醒了別的東西。'],['oren','十二聖騎士的魂被號角喚醒了，卻沒有回到鐘裡。他們散落在大陸各處——北方的冰原、巨人的山城、多瑙河的龍城、裏海、古波斯、樓蘭、妖魔之地。','calm'],['oren','你們聽過大帝的佩劍「喜悅」嗎？劍柄裡封著一截聖槍的槍尖。大帝死後，那截槍尖跟著羅德蘭的影子，上了天之柱。','calm'],['oren','每一位聖騎士都守著一件「王者之裝」。集齊十二件的人，才能在天之柱上把聖槍拿回來。','calm'],['oren','打開地圖，切換到「世界」吧。還有——鎮子西北邊，轉職聖殿的門開了。去找祭司艾德蕾。','smile']],gold:6000};
TEV[12]={t:'半數王者之裝',lines:[['nar','六件王者之裝在暮鐘鎮的教堂裡發出微光，鎮上的人排隊來看。'],['oren','聖騎士們認可了你們。王者之裝湊滿六件，轉職聖殿就能為你們舉行覺醒試煉了。','smile']],gold:12000};
TEV[19]={t:'沉沒的巴別塔',lines:[['nar','聖槍被放在教堂的祭壇上。每到黃昏，槍尖就會轉向地面。'],['sera','塔在呼喚。這是最後一段路了。','calm']],gold:20000};
const WLOC=[
 {id:'home',n:'洛塔林王國',x:.13,y:.52,t:'link',to:'lotharin',d:'你們的故鄉。暮鐘鎮在王國的最南邊。'},
 {id:'c6',n:'冰峽灣',x:.30,y:.15,t:'main',bi:6},{id:'c7',n:'永凍城塞',x:.47,y:.09,t:'main',bi:7},
 {id:'c8',n:'巨人之城',x:.38,y:.45,t:'main',bi:8},{id:'bridge',n:'多瑙河斷橋',x:.30,y:.385,t:'bridge',d:''},{id:'c9',n:'龍城',x:.215,y:.425,t:'main',bi:9},
 {id:'c10',n:'裏海岸',x:.56,y:.42,t:'main',bi:10},{id:'c11',n:'沉沒之港',x:.63,y:.56,t:'main',bi:11},
 {id:'c12',n:'波斯波利斯',x:.56,y:.72,t:'main',bi:12},{id:'c13',n:'萬國之門',x:.45,y:.65,t:'main',bi:13},
 {id:'c14',n:'樓蘭古都',x:.80,y:.42,t:'main',bi:14},{id:'c15',n:'羅布泊',x:.91,y:.34,t:'main',bi:15},
 {id:'c16',n:'妖魔之地',x:.80,y:.61,t:'main',bi:16},{id:'c17',n:'雪域神殿',x:.92,y:.70,t:'main',bi:17},
 {id:'c18',n:'天之柱',x:.74,y:.80,t:'main',bi:18},
 {id:'gate',n:'巴別塔之門',x:.66,y:.88,t:'link',to:'deep',req:()=>!!S.crown,d:'天之柱底部的裂縫，通往沉進地心的巴別塔。握著聖槍的人才能通過。'}];
const DLOC=[{id:'up',n:'返回地表',x:.5,y:.07,t:'link',to:'world',d:'沿著塔的台階往上，回到天之柱。'},{id:'c19',n:'燃燒之階',x:.28,y:.32,t:'main',bi:19},{id:'c20',n:'亂語迴廊',x:.72,y:.52,t:'main',bi:20},{id:'c21',n:'塔頂之間',x:.48,y:.82,t:'main',bi:21}];
function drawPins(x,LL,sel,X,Y,lab,tc='#2a1a0a'){for(const L of LL){const px=X(L.x),py=Y(L.y);const open=locOpen(L),done=L.t==='main'&&S.done.includes(L.bi);const col=L.t==='bridge'?(brOK()?'#8a6a3a':'#d07a1a'):L.t==='link'?'#6a4ab0':L.t==='base'?'#3a6a9a':L.t==='ex'?'#4a8a3a':done?'#c89a2a':'#b8301e';
  if(sel===L.id){x.beginPath();x.arc(px,py,31,0,TAU);x.lineWidth=5;x.strokeStyle='#fff';x.stroke()}
  x.beginPath();x.arc(px,py,21,0,TAU);x.fillStyle=open?col:'#9a9080';x.fill();x.lineWidth=4;x.strokeStyle='#2a1a0a';x.stroke();
  x.fillStyle='#fff';x.font='900 22px "Noto Sans TC",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(L.t==='link'?'⇄':!open?'?':L.t==='bridge'?(brOK()?'✓':'⚒'):done?'✓':'⚔',px,py+1);x.textBaseline='alphabetic';lab(open?L.n:'？？？',L.x,L.y+.048,20,open?tc:'#8a7a6a')}}
function mkLab(x,X,Y,bg){return(t,px,py,sz,col)=>{x.font=`900 ${sz}px "Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='alphabetic';x.lineWidth=6;x.strokeStyle=bg;x.strokeText(t,X(px),Y(py));x.fillStyle=col;x.fillText(t,X(px),Y(py))}}
function drawWorld(cv,sel){const x=cv.getContext('2d'),w=cv.width,h=cv.height,X=v=>v*w,Y=v=>v*h;const r=rng(1453);const lab=mkLab(x,X,Y,'#f4e6c2dd');
  x.fillStyle='#9fb4ae';x.fillRect(0,0,w,h);x.strokeStyle='#ffffff55';x.lineWidth=2;for(let i=0;i<120;i++){const px=r()*w,py=r()*h;x.beginPath();x.arc(px,py,9,PI*1.15,PI*1.85);x.stroke()}
  const L0=[[0,.32],[.08,.24],[.16,.22],[.20,.08],[.30,.05],[.40,.02],[.55,.03],[.70,0],[1,0],[1,1],[.82,1],[.72,.93],[.64,.86],[.56,.82],[.44,.80],[.34,.84],[.24,.78],[.14,.82],[0,.76]];const pts=[];for(let i=0;i<L0.length-1;i++){const a=L0[i],b=L0[i+1];pts.push(a);if(a[0]<1&&b[0]<1||a[1]<1&&b[1]<1)for(let k=1;k<4;k++){const t=k/4;pts.push([lerp(a[0],b[0],t)+(r()-.5)*.016,lerp(a[1],b[1],t)+(r()-.5)*.012])}}pts.push(L0[L0.length-1]);
  const land=()=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(p[0]),Y(p[1])):x.moveTo(X(p[0]),Y(p[1])));x.closePath()};
  land();const lgd=x.createRadialGradient(w*.55,h*.5,w*.1,w*.55,h*.5,w);lgd.addColorStop(0,'#f4e6c2');lgd.addColorStop(1,'#d2b886');x.fillStyle=lgd;x.fill();x.lineWidth=5;x.strokeStyle='#6a5030';x.stroke();
  x.save();land();x.clip();const ig=x.createLinearGradient(0,0,0,Y(.2));ig.addColorStop(0,'#ffffffdd');ig.addColorStop(1,'#ffffff00');x.fillStyle=ig;x.fillRect(0,0,w,Y(.2));for(let i=0;i<2400;i++){x.fillStyle=r()<.5?'#00000012':'#ffffff1c';x.fillRect(r()*w,r()*h,2,2)}
  for(let i=0;i<300;i++){const a=r()*TAU,rr=Math.sqrt(r());x.fillStyle='#c8a46a88';x.fillRect(X(.84)+Math.cos(a)*rr*X(.1),Y(.42)+Math.sin(a)*rr*Y(.05),3,3);x.fillRect(X(.52)+Math.cos(a)*rr*X(.08),Y(.70)+Math.sin(a)*rr*Y(.05),3,3)}x.restore();
  const sea=(cx,cy,rx,ry,rot)=>{x.beginPath();x.ellipse(X(cx),Y(cy),X(rx),Y(ry),rot,0,TAU);x.fillStyle='#9fb4ae';x.fill();x.lineWidth=4;x.strokeStyle='#6a5030';x.stroke()};
  sea(.30,.53,.07,.03,.1);sea(.58,.50,.035,.075,.15);sea(.20,.66,.11,.03,-.05);
  const mts=(cx,cy,sx,sy,n,c)=>{for(let i=0;i<n;i++){const mx=X(cx+(r()-.5)*sx),my=Y(cy+(r()-.5)*sy);const s=12+r()*14;x.beginPath();x.moveTo(mx-s,my+s*.6);x.lineTo(mx,my-s);x.lineTo(mx+s,my+s*.6);x.closePath();x.fillStyle=c;x.fill();x.lineWidth=2.5;x.strokeStyle='#5a4028';x.stroke();x.beginPath();x.moveTo(mx,my-s);x.lineTo(mx+s*.32,my-s*.32);x.lineTo(mx-s*.12,my-s*.42);x.closePath();x.fillStyle='#fff8e8';x.fill()}};
  mts(.43,.45,.14,.04,16,'#b89a6a');mts(.84,.68,.3,.14,40,'#c0a880');mts(.74,.79,.04,.04,4,'#d8d0c0');
  for(let i=0;i<24;i++){const fx2=X(.28+(r()-.5)*.2),fy=Y(.20+(r()-.5)*.08);x.beginPath();x.moveTo(fx2,fy-9);x.lineTo(fx2+6,fy+5);x.lineTo(fx2-6,fy+5);x.closePath();x.fillStyle='#5a7a5a';x.fill()}
  x.save();x.setLineDash([9,8]);x.lineWidth=3.5;const order=WLOC.filter(l=>l.t==='main');let prev=WLOC[0];for(const L of order){x.strokeStyle=locOpen(L)?'#8a3a1a':'#8a6a4a55';x.beginPath();x.moveTo(X(prev.x),Y(prev.y));x.lineTo(X(L.x),Y(L.y));x.stroke();prev=L}x.restore();
  lab('北 方 極 寒 之 地',.40,.21,24,'#2a4a6a');lab('巨 人 山 脈',.40,.52,18,'#5a4028');lab('裏 海',.61,.50,18,'#2a4a4a');lab('古 波 斯',.50,.78,20,'#7a4a1a');lab('塔 克 拉 瑪 干',.86,.47,17,'#7a4a1a');lab('世 界 屋 脊',.86,.77,20,'#5a4028');lab('內 海',.20,.67,18,'#2a4a4a');
  x.save();x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(X(.03),Y(.34));x.bezierCurveTo(X(.12),Y(.40),X(.22),Y(.35),X(.30),Y(.385));x.bezierCurveTo(X(.35),Y(.41),X(.33),Y(.47),X(.30),Y(.505));x.lineWidth=10;x.strokeStyle='#6a5030';x.stroke();x.lineWidth=6;x.strokeStyle='#9fc0c4';x.stroke();x.restore();lab('多 瑙 河',.12,.355,15,'#2a4a5a');
  drawPins(x,WLOC,sel,X,Y,lab);lab('世界全圖',.30,.965,30,'#5a2a0a')}
function drawDeep(cv,sel){const x=cv.getContext('2d'),w=cv.width,h=cv.height,X=v=>v*w,Y=v=>v*h;const r=rng(9999);const lab=mkLab(x,X,Y,'#1a0a0acc');
  const g=x.createRadialGradient(w*.5,h*.55,w*.1,w*.5,h*.55,w);g.addColorStop(0,'#4a1a14');g.addColorStop(1,'#0e0608');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<60;i++){x.beginPath();x.arc(r()*w,r()*h,10+r()*40,0,TAU);x.fillStyle=r()<.5?'#00000044':'#5a2a1a33';x.fill()}
  x.lineWidth=6;for(let i=0;i<6;i++){let px=r()*w,py=r()*h;x.strokeStyle='#ff6a2acc';x.shadowColor='#ff8a3a';x.shadowBlur=14;x.beginPath();x.moveTo(px,py);for(let k=0;k<6;k++){px+=r()*120-60;py+=r()*120-60;x.lineTo(px,py)}x.stroke()}x.shadowBlur=0;
  for(let i=0;i<30;i++){const px=r()*w,py=r()*h;x.beginPath();x.moveTo(px,py-14);x.lineTo(px+6,py);x.lineTo(px,py+14);x.lineTo(px-6,py);x.closePath();x.fillStyle='#b07aff';x.fill()}
  for(let i=0;i<9;i++){const ww=(.66-i*.065)*w,yy=Y(.13+i*.083),hh=Y(.07);x.fillStyle=i%2?'#5a2a1acc':'#6e3622cc';x.fillRect(w/2-ww/2,yy,ww,hh);x.strokeStyle='#ffb08a66';x.lineWidth=2;x.strokeRect(w/2-ww/2,yy,ww,hh);for(let k=1;k<6;k++){x.fillStyle='#ffcf7a44';x.fillRect(w/2-ww/2+ww*k/6-4,yy+hh*.3,8,hh*.4)}}
  x.save();x.setLineDash([9,8]);x.lineWidth=3.5;let prev=DLOC[0];for(const L of DLOC.slice(1)){x.strokeStyle=locOpen(L)?'#ffb08a':'#ffb08a44';x.beginPath();x.moveTo(X(prev.x),Y(prev.y));x.lineTo(X(L.x),Y(L.y));x.stroke();prev=L}x.restore();
  drawPins(x,DLOC,sel,X,Y,mkLab(x,X,Y,'#1a0a0acc'),'#ffe0c0');const lb=mkLab(x,X,Y,'#1a0a0acc');lb('地心・沉沒的巴別塔',.5,.965,30,'#ffb08a')}

