/* 實體、戰鬥、玩家更新、鏡頭、HUD、操作 */
/* ======================= ENTITIES ======================= */
let EN_LIST=[];let PROJ=[];let TELE=[];let DROPS=[];let TURRETS=[];let BOSS=null;
function playerStats(){const lv=S.lv;const C=CLS[S.cls];let atk=34*Math.pow(1.12,lv-1)*C.atk,hp=320*Math.pow(1.13,lv-1)*C.hp,crit=.08;for(const k in S.eq){const it=S.eq[k];if(!it)continue;const m=1+.12*(it.up||0);atk+=(it.atk||0)*m;hp+=(it.hp||0)*m;crit+=(it.crit||0)}atk*=1+.06*rk('patk');hp*=(1+.08*rk('php'))*(1+.05*bl('wall'));crit+=.03*rk('pcrit');const rg=(S.reg||[]).length;atk*=1+.04*rg;hp*=1+.05*rg;if(rg>=12)crit+=.1;if(S.crown){atk*=1.15;hp*=1.15}const av=advInfo();if(av){const M2={paladin:[1,1.2],berserker:[1.15,.9],ranger:[1.05,1],sniper:[1.1,1],bishop:[1,1.15],astral:[1.15,1],gunner:[1.1,1.05],machinist:[1.05,1.05]}[av.k];atk*=M2[0];hp*=M2[1];if(av.awake){atk*=1.3;hp*=1.3}}return{atk:Math.round(atk),hp:Math.round(hp),crit:Math.min(.6,crit)}}
function makePlayer(){const m=makeChibi(LOOKS[S.cls]);scene.add(m.root);const st=playerStats();
  const ring=new THREE.Mesh(RINGG,addM(0x8fe0ff,.5));ring.material.userData.keep=true;ring.rotation.x=-PI/2;ring.scale.setScalar(.75);ring.position.y=.05;m.root.add(ring);
  P={m,pos:m.root.position,face:0,vx:0,vz:0,hp:st.hp,max:st.hp,atk:st.atk,crit:st.crit,cd:[0,0,0,0,0],frenzy:0,atkT:0,anim:0,dodge:0,inv:0,guard:0,regen:0,flash:0,dead:false,pots:S.potMax||3,revives:bl('church')?(bl('church')>=3?2:1):0,buff:0,tacCd:0,moveAmt:0,t:0,lock:0};return P}
function refreshStats(){if(!P)return;const st=playerStats();const f=P.hp/P.max;P.max=st.hp;P.hp=Math.round(st.hp*f);P.atk=st.atk;P.crit=st.crit}
function spawnEnemy(type,x,z,elite){const b=EN[type];const Z=W.Z;const m=buildEnemy(type);m.root.position.set(x,0,z);m.root.rotation.y=0;scene.add(m.root);
  const zm=b.boss?1:Z.m;const hp=b.hp*zm*(elite?3:1)*(b.boss?1.25:1.3);
  const e={type,b,m,pos:m.root.position,hp,max:hp,atk:b.atk*zm*(elite?1.5:1)*(b.boss?2.1:2.6),spd:b.spd,rng:b.rng,r:b.r*(elite?1.3:1),atkT:rand(.5,1.5),wind:0,anim:0,flash:0,stun:0,aggro:b.boss,boss:!!b.boss,elite,xp:Math.round(b.xp*Math.pow(1.55,Z.idx)*(elite?3:1)),gold:Math.round(b.gold*Math.pow(1.22,Z.idx)*(elite?3:1)*.6),dead:false,t:rand(0,5),kb:new THREE.Vector3(),abT:2.5,abI:0,phase:1,busy:0};
  if(elite)m.root.scale.multiplyScalar(1.3);
  if(!e.boss){const el=document.createElement('div');el.className='ehp'+(elite?' el':'');el.innerHTML='<i></i>';ov.appendChild(el);e.bar=el}
  if(type==='trialKnight'){e.hp=e.max=Math.round(P.atk*(W.trial&&W.trial.tier===2?160:110));e.atk=P.max*.07}
  EN_LIST.push(e);PB.emit({x,y:.5,z},6,type==='golemling'?0x9a7aff:0xff6a2a,2,.6,1,0,1);return e}
function dist2(a,b){const dx=a.x-b.x,dz=a.z-b.z;return dx*dx+dz*dz}
function nearestEnemy(p,range){let best=null,bd=range*range;for(const e of EN_LIST){if(e.dead)continue;const d=dist2(p,e.pos)-e.r*e.r;if(d<bd){bd=d;best=e}}return best}
function hitEnemy(e,raw,o={}){if(e.dead)return 0;const crit=Math.random()<P.crit+(o.critB||0);let d=Math.round(raw*rand(.9,1.1)*(crit?(advK()==='sniper'?2.4:1.8):1));e.hp-=d;e.flash=.1;{const ls=.03*rk('berserk')+(advK()==='paladin'?.02:0)+(P&&P.frenzy>0?.1:0);if(ls&&P&&!P.dead&&P.hp<P.max)P.hp=Math.min(P.max,P.hp+d*ls)}
  const hp=e.pos.clone();hp.y=0;dmgNum(hp,crit?d+'!':d,crit?'cr':'',(e.boss?3.5:2)*(e.m.root.scale.x>1.5?1.4:1));
  if(crit){SFX.crit();hitStop=Math.max(hitStop,.05);shake(.12,.12)}else SFX.hit();
  PS.emit({x:e.pos.x,y:1,z:e.pos.z},crit?14:6,o.col||0xfff0c0,crit?6:4,.35,1,8);
  if(o.kb&&!e.boss){const dx=e.pos.x-P.pos.x,dz=e.pos.z-P.pos.z,l=Math.hypot(dx,dz)||1;e.kb.set(dx/l*o.kb,0,dz/l*o.kb)}
  if(o.stun&&!e.boss)e.stun=Math.max(e.stun,o.stun);
  e.aggro=true;if(e.hp<=0)killEnemy(e);return d}
function killEnemy(e){e.dead=true;e.hp=0;if(e.bar)e.bar.remove();
  PB.emit({x:e.pos.x,y:.8,z:e.pos.z},e.boss?40:10,e.type==='golemling'||e.type==='golem'?0x9a7aff:0xff7a3a,e.boss?8:4,.7,2,6,1);PS.emit({x:e.pos.x,y:.8,z:e.pos.z},e.boss?60:8,0xffd8a0,e.boss?10:5,.5,2,10,1);
  const root=e.m.root;fx(new THREE.Group(),.45,(f,k)=>{root.scale.setScalar(root.scale.x*(1-k*.15));root.position.y=-k*.6;if(k>=.95)scene.remove(root)});
  setTimeout(()=>{scene&&scene.remove(root)},600);
  gainXP(Math.round(e.xp*(1+.15*bl('train'))));qProg('kill',e.type);if(e.elite)qProg('elite');if(e.keyHolder&&W.type==='zone'){W.hasKey=true;banner('','取得寶庫鑰匙');SFX.loot();questZone()}if(e.type==='mimic'&&W.type==='zone'){W.chestOpen++;qProg('chest');dropItem(e.pos,clamp(rollRarity(Math.min(W.Z.idx,2),2),2,4));questZone()}if(e.gold){dropGold(e.pos,e.gold)}
  const zi=W.Z.idx;if(!e.boss&&Math.random()<(e.elite?.5:.06))dropItem(e.pos,rollRarity(zi,e.elite?1:0));
  if(e.boss)bossDefeated(e)}
function dropGold(p,n){const c=new THREE.Mesh(G.cyl(.18,.18,.06,12),tm(0xf0c35a,{e:0x6a4a00}));c.rotation.x=PI/2;c.position.set(p.x+rand(-.6,.6),.4,p.z+rand(-.6,.6));scene.add(c);DROPS.push({kind:'gold',n,mesh:c,t:0,vy:4})}
function rollRarity(zi,bonus){const r=Math.random();const base=r<.62?0:r<.88?1:r<.97?2:r<.995?3:4;return clamp(base+bonus,0,4)}
function makeItem(rar,zi,slot,wt){slot=slot||['weapon','armor','charm'][(Math.random()*3)|0];const ib=34*Math.pow(1.12,expLv(zi)-1),hb=320*Math.pow(1.13,expLv(zi)-1);const m=RAR[rar].m;const it={id:Math.random().toString(36).slice(2,8),slot,rar,up:0,zi};
  if(slot==='weapon'){const wts=['base','base','base','boomerang','spear','crossbow','axes'];if(!wt&&zi>=6&&rar>=3&&Math.random()<.25)wt=LEGS[(Math.random()*5)|0];wt=wt||wts[(Math.random()*wts.length)|0];it.wt=wt;it.ik=wt==='base'?BASEIK[S.cls]:WT[wt].ik;it.atk=Math.round(ib*.3*m*rand(.9,1.1)*(WT[wt]&&WT[wt].leg?1.15:1));it.name=(WT[wt]&&WT[wt].leg?'':rar===4?'暮鐘・':PREF[rar])+(wt==='base'?CLS[S.cls].wnoun:WT[wt].n)}
  if(slot==='armor'){it.hp=Math.round(hb*.25*m*rand(.9,1.1));it.name=(rar===4?'暮鐘・':PREF[rar])+['皮甲','鎖甲','戰袍','聖鎧','守望之鎧'][rar]}
  if(slot==='charm'){it.crit=+((.01+rar*.012)).toFixed(3);it.atk=Math.round(ib*.1*m);it.name=(rar===4?'暮鐘・':PREF[rar])+['護符','項鍊','指環','鐘紋護符','最後的鳴響'][rar]}
  return it}
function dropItem(p,rar,slot){const it=makeItem(rar,W.Z?W.Z.idx:0,slot);const col=new THREE.Color(RAR[rar].c);const g=new THREE.Group();g.position.set(p.x+rand(-.8,.8),0,p.z+rand(-.8,.8));const gem=new THREE.Mesh(G.oct(.28),tm(col.getHex(),{e:col.clone().multiplyScalar(.6).getHex()}));gem.position.y=.6;g.add(gem);
  const beam=new THREE.Mesh(G.cyl(.25,.4,6,12,1),addM(col.getHex(),.45));beam.position.y=3;g.add(beam);scene.add(g);DROPS.push({kind:'item',it,mesh:g,gem,beam,t:0});if(rar>=3){SFX.loot();vRing(g.position,col.getHex(),.2,3,.8)}}
function gainXP(n){S.xp+=n;let up=false;while(S.xp>=xpNeed(S.lv)){S.xp-=xpNeed(S.lv);S.lv++;up=true}if(up){refreshStats();P.hp=P.max;SFX.lvl();vPillar(P.pos,0xffe08a,1.2,8,1.2);vRing(P.pos,0xffe08a,.5,4,.8);PB.emit({x:P.pos.x,y:1,z:P.pos.z},30,0xffe08a,4,1,4,2,1);banner('LEVEL UP','等級 '+S.lv);setTimeout(()=>toast('獲得技藝點！點右上角「技藝」學習新能力',2800),900);save()}hudStats()}
const xpNeed=lv=>Math.round(60*Math.pow(1.38,lv-1));
function hurtPlayer(raw,src){if(P.dead||P.inv>0||mode!=='zone')return;let d=raw*(P.guard>0?.4:1);d=Math.round(d*rand(.9,1.1));P.hp-=d;P.flash=.15;dmgNum(P.pos,d,'hurt',2.3);SFX.hurt();shake(.18,.15);$('#redV').style.boxShadow='inset 0 0 90px #ff1a0aaa';setTimeout(()=>$('#redV').style.boxShadow='inset 0 0 80px #ff000000',180);
  if(P.hp<=0){if(P.revives>0){P.revives--;P.hp=Math.round(P.max*.5);P.inv=2;vPillar(P.pos,0xffe08a,1.6,8,1.2);vRing(P.pos,0xffe08a,.5,6,.8);SFX.bell();banner('聖鐘庇佑','你重新站了起來');for(const e of EN_LIST)if(!e.dead&&!e.boss&&dist2(P.pos,e.pos)<49)e.stun=Math.max(e.stun,2)}else{P.hp=0;playerDie()}}hudStats()}

/* ======================= TELEGRAPHS (boss mechanics) ======================= */
function teleCircle(p,r,dur,dmg,col=0xff3a1a,onBoom){const g=new THREE.Group();g.position.set(p.x,.06,p.z);const base=new THREE.Mesh(DISKG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,depthWrite:false}));base.rotation.x=-PI/2;base.scale.setScalar(r);g.add(base);const edge=new THREE.Mesh(RINGG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8,depthWrite:false}));edge.rotation.x=-PI/2;edge.scale.setScalar(r);edge.position.y=.01;g.add(edge);const fill=new THREE.Mesh(DISKG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.32,depthWrite:false}));fill.rotation.x=-PI/2;fill.position.y=.02;g.add(fill);scene.add(g);
  TELE.push({g,fill,t:0,dur,update(k){fill.scale.setScalar(Math.max(.01,r*k));edge.material.opacity=.5+.4*Math.sin(k*30)},done(){if(dist2(P.pos,g.position)<r*r)hurtPlayer(dmg);vSphere(g.position,col===0xff3a1a?0xff7a3a:col,r,.4,.3);vRing(g.position,0xffd08a,r*.3,r*1.1,.4);PB.emit({x:g.position.x,y:.5,z:g.position.z},12,0xff7a3a,r*1.6,.5,3,6,r*.4);shake(.2,.2);SFX.boom();onBoom&&onBoom()}})}
function teleRect(p,ang,len,w,dur,dmg,onDone){const g=new THREE.Group();g.position.set(p.x,.06,p.z);g.rotation.y=ang;const mk=(o,y)=>{const m=new THREE.Mesh(PLANEG,new THREE.MeshBasicMaterial({color:0xff3a1a,transparent:true,opacity:o,depthWrite:false}));m.rotation.x=-PI/2;m.position.y=y;g.add(m);return m};const base=mk(.18,0);base.scale.set(w,len,1);base.position.z=len/2;const fill=mk(.35,.01);scene.add(g);
  TELE.push({g,fill,t:0,dur,update(k){fill.scale.set(w,Math.max(.01,len*k),1);fill.position.z=len*k/2},done(){const lx=P.pos.x-g.position.x,lz=P.pos.z-g.position.z;const fx_=Math.sin(ang),fz=Math.cos(ang);const along=lx*fx_+lz*fz,perp=Math.abs(lx*fz-lz*fx_);if(along>-.5&&along<len&&perp<w/2+.3)hurtPlayer(dmg);onDone&&onDone()}})}
function updTele(dt){for(let i=TELE.length-1;i>=0;i--){const T=TELE[i];T.t+=dt;const k=clamp(T.t/T.dur,0,1);T.update(k);if(k>=1){T.done();scene.remove(T.g);TELE.splice(i,1)}}}

/* ======================= COMBAT: PLAYER ======================= */
const input={x:0,z:0,keys:{}};
function faceTo(tx,tz){P.face=Math.atan2(tx-P.pos.x,tz-P.pos.z)}
function autoAttack(){const C=CLS[S.cls];const w=S.eq.weapon;if(w&&LEGW[w.wt]){LEGW[w.wt]();return}const wt=w&&w.wt&&WT[w.wt]?w.wt:null;const range=wt?WT[wt].range:C.range,rate=wt?WT[wt].rate:C.rate;const tg=nearestEnemy(P.pos,range+.5);if(!tg)return;faceTo(tg.pos.x,tg.pos.z);P.anim=.32;P.atkT=rate*(advK()==='berserker'?.65:1)*(P.frenzy>0?.5:1);const A=atkNow();
  if(wt==='boomerang'){SFX.swing();throwBoomerang(tg,A);return}
  if(wt==='spear'){SFX.swing();const f=new THREE.Vector3(Math.sin(P.face),0,Math.cos(P.face));vBeam(new THREE.Vector3(P.pos.x,1,P.pos.z),new THREE.Vector3(P.pos.x+f.x*4.6,1,P.pos.z+f.z*4.6),0xe0f0ff,.14,.16);vRing(new THREE.Vector3(P.pos.x+f.x*4.4,0,P.pos.z+f.z*4.4),0xe0f0ff,.2,1,.2,1);for(const e of EN_LIST){if(e.dead)continue;const lx=e.pos.x-P.pos.x,lz=e.pos.z-P.pos.z;const al=lx*f.x+lz*f.z,pe=Math.abs(lx*f.z-lz*f.x);if(al>-.5&&al<4.6+e.r&&pe<.8+e.r)hitEnemy(e,A*1.2,{kb:2})}return}
  if(wt==='crossbow'){SFX.shoot();shoot('bolt',tg,A*.72);return}
  if(wt==='axes'){SFX.swing();for(let k=-1;k<=1;k++){shoot('axe',tg,A*.62,{life:.5});const a=P.face+k*.28;PROJ[PROJ.length-1].dir.set(Math.sin(a),0,Math.cos(a))}return}
  if(C.kind==='melee'){SFX.swing();vSlash(P.pos,P.face,0xcfe8ff,2.4);setTimeout(()=>{if(!P)return;for(const e of EN_LIST){if(e.dead)continue;const dx=e.pos.x-P.pos.x,dz=e.pos.z-P.pos.z;const d=Math.hypot(dx,dz)-e.r;if(d>C.range)continue;let a=Math.atan2(dx,dz)-P.face;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)<1.1||d<.6)hitEnemy(e,A,{kb:3})}},90)}
  else if(C.kind==='arrow'){SFX.shoot();if(advK()==='ranger'){for(let k=-1;k<=1;k++){shoot('arrow',tg,A*.8);const a=P.face+k*.2;PROJ[PROJ.length-1].dir.set(Math.sin(a),0,Math.cos(a))}}else shoot('arrow',tg,A,{pierce:advK()==='sniper'?1:0})}
  else if(C.kind==='orb'){SFX.shoot();shoot('orb',tg,A)}
  else if(C.kind==='bomb'){SFX.shoot();const gn=advK()==='gunner';lob(tg.pos,A*(gn?1.2:1),2.6*(gn?1.6:1),0xff8a3a,.55,{burn:1})}}
function shoot(kind,tg,dmg,o={}){const fr=o.from||P.pos;const start=new THREE.Vector3(fr.x+(o.from?0:Math.sin(P.face)*.5),1.1,fr.z+(o.from?0:Math.cos(P.face)*.5));let mesh;
  if(kind==='arrow'||kind==='bolt'){mesh=new THREE.Group();const s=new THREE.Mesh(G.box(.05,.05,kind==='bolt'?.6:.9),new THREE.MeshBasicMaterial({color:o.big?0xc8ffb0:kind==='bolt'?0xd8e8ff:0xfff6d0}));mesh.add(s);if(o.big){const gl=new THREE.Mesh(G.box(.25,.25,1.6),addM(0x8aff7a,.6));mesh.add(gl)}}
  else if(kind==='axe'){mesh=new THREE.Group();const h=new THREE.Mesh(G.box(.06,.06,.6),tm(0x6a4020));mesh.add(h);const hd=new THREE.Mesh(G.box(.05,.3,.26),tm(0xd8e0e8));hd.position.set(0,.1,.24);mesh.add(hd)}
  else{mesh=new THREE.Mesh(G.sph(.22,12,10),addM(0xd8a0ff,.95));const in_=new THREE.Mesh(G.sph(.1,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));mesh.add(in_)}
  mesh.position.copy(start);scene.add(mesh);const dir=new THREE.Vector3(tg?tg.pos.x-start.x:Math.sin(P.face),0,tg?tg.pos.z-start.z:Math.cos(P.face)).normalize();
  PROJ.push({kind,mesh,tg,dmg,dir,spd:{arrow:28,bolt:36,axe:18}[kind]||16,life:o.life||1.2,pierce:o.pierce,hit:new Set(),o})}
function lob(target,dmg,r,col,dur,o={}){const fr=o.from||P.pos;const s=new THREE.Vector3(fr.x,1.4,fr.z);const e=new THREE.Vector3(target.x,0,target.z);const m=new THREE.Mesh(G.sph(o.big?.36:.2,10,8),tm(0x2a2420));const fuse=new THREE.Mesh(G.sph(o.big?.14:.08,6,6),addM(0xffb04a,1));fuse.position.y=o.big?.36:.2;m.add(fuse);scene.add(m);PROJ.push({kind:'lob',mesh:m,s,e,t:0,dur,dmg,r,col,o})}
function explode(p,r,dmg,col,o={}){if(o.burn){const sc0=scene,pp={x:p.x,y:0,z:p.z};let n=0;const iv=setInterval(()=>{if(scene!==sc0||n++>=4){clearInterval(iv);return}PS.emit({x:pp.x,y:.3,z:pp.z},6,0xff7a2a,r*.8,.45,2,2,r*.4);for(const e of EN_LIST)if(!e.dead&&dist2(pp,e.pos)<(r+e.r)**2)hitEnemy(e,dmg*.12,{col:0xff7a2a})},450)}vSphere(p,col,r,.45,.4);vRing(p,0xffe0a0,r*.2,r*1.2,.45,.08,.7);vDisk(p,0x3a1a0a,r*.8,.8,.35);PB.emit({x:p.x,y:.6,z:p.z},o.big?30:12,col,r*2.2,.55,3,5,r*.3);PS.emit({x:p.x,y:.6,z:p.z},o.big?24:8,0xffc080,r*3,.45,4,10,r*.3);flashLight(p,col,o.big?6:2.5,.3);if(o.big){SFX.boom();shake(.3,.25)}else noise(.15,.06,700);
  for(const e of EN_LIST){if(e.dead)continue;if(dist2(p,e.pos)<(r+e.r)*(r+e.r))hitEnemy(e,dmg,{kb:o.kb||2,col,stun:o.stun})}}
function updProj(dt){for(let i=PROJ.length-1;i>=0;i--){const pr=PROJ[i];
    if(pr.kind==='boom'){pr.mesh.rotation.y+=dt*22;if(pr.out){pr.mesh.position.addScaledVector(pr.dir,17*dt);pr.d+=17*dt;if(pr.d>=9.5){pr.out=false;pr.hit=new Set()}}else{const v=new THREE.Vector3(P.pos.x-pr.mesh.position.x,0,P.pos.z-pr.mesh.position.z);const l=v.length();if(l<.8||pr.d>45){scene.remove(pr.mesh);PROJ.splice(i,1);continue}pr.d+=19*dt;pr.mesh.position.addScaledVector(v.divideScalar(l),19*dt)}if(Math.random()<.5)PS.emit(pr.mesh.position,1,0xf0d0a0,.3,.2,0,0,.1);for(const e of EN_LIST){if(e.dead||pr.hit.has(e))continue;if(dist2(pr.mesh.position,e.pos)<(e.r+.7)**2){pr.hit.add(e);hitEnemy(e,pr.dmg,{kb:1.2,col:0xf0d0a0})}}continue}
    if(pr.kind==='lob'){pr.t+=dt;const k=clamp(pr.t/pr.dur,0,1);pr.mesh.position.lerpVectors(pr.s,pr.e,k);pr.mesh.position.y=lerp(pr.s.y,.3,k)+Math.sin(k*PI)*3;pr.mesh.rotation.x+=dt*10;if(Math.random()<.6)PS.emit(pr.mesh.position,1,0xffb04a,.5,.3,0,0,.1);if(k>=1){explode(pr.e,pr.r,pr.dmg,pr.col,pr.o);scene.remove(pr.mesh);PROJ.splice(i,1)}continue}
    if(pr.tg&&!pr.tg.dead&&pr.kind==='orb'){const d=new THREE.Vector3(pr.tg.pos.x-pr.mesh.position.x,0,pr.tg.pos.z-pr.mesh.position.z).normalize();pr.dir.lerp(d,.2).normalize()}
    pr.mesh.position.addScaledVector(pr.dir,pr.spd*dt);pr.mesh.lookAt(pr.mesh.position.x+pr.dir.x,pr.mesh.position.y,pr.mesh.position.z+pr.dir.z);if(pr.kind==='axe')pr.mesh.rotateX(gt*28);pr.life-=dt;
    if(pr.kind==='orb')PS.emit(pr.mesh.position,2,0xc890ff,.4,.3,0,0,.1);if(pr.o.big)PS.emit(pr.mesh.position,3,0xa8ff9a,.6,.3,0,0,.2);
    let gone=pr.life<=0;
    for(const e of EN_LIST){if(e.dead||pr.hit.has(e))continue;if(dist2(pr.mesh.position,e.pos)<(e.r+.4)*(e.r+.4)){pr.hit.add(e);if(pr.kind==='orb'){explodeSmall(pr.mesh.position,pr.dmg)}else hitEnemy(e,pr.dmg,{kb:pr.o.big?2:.6,col:pr.o.big?0xa8ff9a:0xfff0c0});if(!pr.pierce){gone=true;break}}}
    if(gone){scene.remove(pr.mesh);PROJ.splice(i,1)}}}
function explodeSmall(p,dmg){vSphere(p,0xc890ff,1.1,.25,1);PS.emit(p,8,0xd8b0ff,3,.3,1,4,.2);for(const e of EN_LIST){if(e.dead)continue;if(dist2(p,e.pos)<((advK()==='astral'?2.6:1.3)+e.r)**2)hitEnemy(e,dmg,{col:0xd8b0ff})}}
function useSkill(i){if(!P||P.dead||mode!=='zone'&&mode!=='town')return;if(i===0){if(P.cd[0]>0)return;dodge();return}const id=S.slots[i-1];if(!id){toast('這格還沒有技能。升級後打開「技藝」學習，就會自動裝上。');return}if(P.cd[i]>0||P.lock>0)return;if(mode==='town'){toast('在城鎮裡不需要戰鬥，去懸賞板接任務吧。');return}
  const nd=NODE[id];P.cd[i]=nd.cd*cdMult(id);const tg=nearestEnemy(P.pos,14);if(tg)faceTo(tg.pos.x,tg.pos.z);P.anim=.4;const fwd=new THREE.Vector3(Math.sin(P.face),0,Math.cos(P.face));const A=atkNow()*skMult(id);SKF[id](A,tg,fwd,i);hudSkills()}
function teleFriendly(c,r,d){const m=new THREE.Mesh(RINGG,addM(0xffb05a,.8));m.rotation.x=-PI/2;m.position.set(c.x,.08,c.z);m.scale.setScalar(r);fx(m,d,(f,k)=>{m.material.opacity=.8*(.5+.5*Math.sin(k*30))});return m}
function guardDome(){const m=new THREE.Mesh(G.sph(1.3,20,14),addM(0xffe08a,.25));scene.add(m);return m}
function spawnTurret(at){const g=new THREE.Group();if(at)g.position.copy(at);else g.position.copy(P.pos).addScaledVector(new THREE.Vector3(Math.sin(P.face),0,Math.cos(P.face)),1.5);g.position.y=0;const b=new THREE.Mesh(G.cyl(.4,.5,.5,8),tm(0x7a5a3a,{flat:1}));b.position.y=.25;b.castShadow=true;g.add(b);const head=new THREE.Group();head.position.y=.75;g.add(head);const hb=new THREE.Mesh(G.sph(.3,10,8),tm(0x8a8a94));head.add(hb);const bar=new THREE.Mesh(G.cyl(.08,.1,.7,6),tm(0x4a4a54));bar.rotation.x=PI/2;bar.position.z=.4;head.add(bar);scene.add(g);vRing(g.position,0x8fd0ff,.3,2,.4);const T0={g,head,t:9+3*rk('forge'),cd:0};TURRETS.push(T0);return T0}
function updTurrets(dt){for(let i=TURRETS.length-1;i>=0;i--){const T=TURRETS[i];T.t-=dt;T.cd-=dt;if(T.follow){const tx=P.pos.x+Math.cos(P.face)*1.7,tz=P.pos.z-Math.sin(P.face)*1.7;T.g.position.x=lerp(T.g.position.x,tx,.06);T.g.position.z=lerp(T.g.position.z,tz,.06)}const tg=nearestEnemy(T.g.position,10);if(tg){T.head.rotation.y=Math.atan2(tg.pos.x-T.g.position.x,tg.pos.z-T.g.position.z);if(T.cd<=0){T.cd=T.mega?.14:.35;const a=new THREE.Vector3(T.g.position.x,.8,T.g.position.z);vBeam(a,new THREE.Vector3(tg.pos.x,1,tg.pos.z),0x8fd0ff,.06,.08);hitEnemy(tg,P.atk*(T.mega?2.2:.7)*(1+.25*rk('forge')),{col:0x8fd0ff});tone(1400,.03,'square',.01)}}if(T.t<=0){PB.emit({x:T.g.position.x,y:.5,z:T.g.position.z},10,0x8fd0ff,2,.5,1,0,.5);scene.remove(T.g);TURRETS.splice(i,1)}}}
function dodge(){if(!P||P.dead)return;P.cd[0]=2.6;let dx=input.x,dz=input.z;if(Math.hypot(dx,dz)<.1){dx=Math.sin(P.face);dz=Math.cos(P.face)}const l=Math.hypot(dx,dz);P.dash={dir:new THREE.Vector3(dx/l,0,dz/l),t:.3,spd:22};P.inv=.38;P.face=Math.atan2(dx,dz);SFX.dodge();PS.emit({x:P.pos.x,y:.3,z:P.pos.z},10,0xffffff,2,.3,0,0,.4);hudSkills()}
function usePotion(){if(!P||P.dead||mode!=='zone')return;if(P.pots<=0){toast('回復藥用完了');return}if(P.hp>=P.max){toast('生命已滿');return}P.pots--;const h=Math.round(P.max*.35*(1+.1*bl('church')));P.hp=Math.min(P.max,P.hp+h);dmgNum(P.pos,'+'+h,'heal');vPillar(P.pos,0x8fffb0,1,3,.6);SFX.coin();hudStats();hudSkills()}

/* ======================= COMBAT: ENEMIES & BOSS ======================= */
function updEnemies(dt,t){for(const e of EN_LIST){if(e.dead)continue;e.t+=dt;if(e.flash>0){e.flash-=dt;e.m.M.flash(e.flash>0?.9:0)}
    const dx=P.pos.x-e.pos.x,dz=P.pos.z-e.pos.z,d=Math.hypot(dx,dz);
    if(e.kb.lengthSq()>.01){e.pos.addScaledVector(e.kb,dt);e.kb.multiplyScalar(Math.pow(.02,dt))}
    if(e.boss){updBoss(e,dt,d,dx,dz);continue}
    if(e.stun>0){e.stun-=dt;animModel(e.m,e.t,0,0,dt);continue}
    if(!e.aggro&&d<11)e.aggro=true;
    let mv=0;
    if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.anim=.3;if(e.b.ranged){if(!P.dead)enemyShoot(e)}else if(e.b.slam){shake(.12,.12)}else if(d<e.rng+.6&&!P.dead)hurtPlayer(e.atk);}}
    else if(e.aggro&&!P.dead){e.m.root.rotation.y=Math.atan2(dx,dz);if(e.b.ranged&&d<3.5){e.pos.x-=dx/d*e.spd*dt*.8;e.pos.z-=dz/d*e.spd*dt*.8;mv=1}if(d>e.rng){const sp=e.spd*dt;e.pos.x+=dx/d*sp;e.pos.z+=dz/d*sp;mv=1}else{e.atkT-=dt;if(e.atkT<=0){if(e.b.slam){e.atkT=rand(2,2.8);e.wind=.9;teleCircle({x:e.pos.x+dx/d*1.4,z:e.pos.z+dz/d*1.4},2.4+e.r*.5,.9,e.atk*1.5,0xff8a2a)}else{e.atkT=rand(1.1,1.6);e.wind=.45}e.m.M.flash(.35)}}}
    if(e.anim>0)e.anim-=dt;
    for(const o of EN_LIST){if(o===e||o.dead)continue;const ox=e.pos.x-o.pos.x,oz=e.pos.z-o.pos.z,od=Math.hypot(ox,oz),mn=e.r+o.r;if(od<mn&&od>.001){const push=(mn-od)*.5;e.pos.x+=ox/od*push;e.pos.z+=oz/od*push}}
    if(d<e.r+.5&&d>.001){const push=e.r+.5-d;e.pos.x-=dx/d*push;e.pos.z-=dz/d*push}
    W.bound(e.pos);
    animModel(e.m,e.t,mv,e.wind>0?0:e.anim/.3*(e.anim>0?1:0),dt);
    if(e.wind>0&&Math.random()<.3)PS.emit({x:e.pos.x,y:1.4,z:e.pos.z},1,0xff3a1a,.5,.3,0,0,.2)}
  EN_LIST=EN_LIST.filter(e=>!e.dead)}
function updBoss(e,dt,d,dx,dz){const b=e.b;e.busy-=dt;if(e.stunF)e.stunF-=dt;
  if(e.phase===1&&e.hp<e.max*.5){e.phase=2;banner('PHASE 2',e.b.name+'暴怒了');SFX.bell();e.spd*=1.25;vRing(e.pos,0xff3a1a,1,10,.8);shake(.3,.5);{const bi=BOUNTY.findIndex(b=>b.boss===e.type);if(STORY['ph'+bi])say(STORY['ph'+bi])}}
  if(e.charging){const c=e.charging;c.t-=dt;e.pos.addScaledVector(c.dir,c.spd*dt);PS.emit({x:e.pos.x,y:.4,z:e.pos.z},3,0xff7a3a,2,.4,1,0,1);if(d<e.r+.8&&!c.hit){c.hit=true;hurtPlayer(e.atk*1.6)}W.bound(e.pos);animModel(e.m,e.t+=dt*1.5,1,0,dt);if(c.t<=0)e.charging=null;return}
  let mv=0;e.t+=dt;
  if(e.busy<=0){e.abT-=dt*(e.phase===2?1.5:1);
    if(e.abT<=0){const ab=b.ab[e.abI%b.ab.length];e.abI++;e.abT=e.phase===2?2.2:3;bossAbility(e,ab,d,dx,dz);}
    else{e.m.root.rotation.y=Math.atan2(dx,dz);if(d>e.rng){const sp=e.spd*dt;e.pos.x+=dx/d*sp;e.pos.z+=dz/d*sp;mv=1}else{e.atkT-=dt;if(e.atkT<=0){e.atkT=1.6;e.anim=.5;const tp=e.pos.clone().addScaledVector(new THREE.Vector3(dx/d,0,dz/d),e.rng*.6);teleCircle(tp,1.8,.55,e.atk,0xff3a1a);e.busy=.6}}}}
  if(e.anim>0)e.anim-=dt;
  if(d<e.r+.5&&d>.001){const push=e.r+.5-d;P.pos.x+=dx/d*push;P.pos.z+=dz/d*push}
  W.bound(e.pos);animModel(e.m,e.t,mv,e.anim>0?e.anim/.5:0,dt);bossHud(e)}
function bossAbility(e,ab,d,dx,dz){const ph2=e.phase===2;const A=e.atk;e.anim=.6;
  if(ab==='slam'){e.busy=1.2;teleCircle(P.pos.clone(),ph2?4.4:3.6,1.05,A*2,0xff3a1a);if(ph2)setTimeout(()=>{if(BOSS===e&&!e.dead)teleCircle(P.pos.clone(),3.2,.9,A*1.6)},500)}
  if(ab==='nova'){e.busy=1.6;teleCircle(e.pos.clone(),ph2?8:7,1.4,A*2.2,0xff3a1a);toast('遠離 Boss！',900)}
  if(ab==='fire'||ab==='rocks'||ab==='ice'||ab==='cannon'){e.busy=1;const cn=ab==='cannon';const n=cn?(ph2?11:7):(ph2?7:4);const sp=cn?7:5;const col={rocks:0xb08aff,ice:0x6ad0ff,cannon:0xffa040}[ab]||0xff5a1a;if(cn){toast('艦砲齊射！快移動！',1000);SFX.warn()}for(let i=0;i<n;i++){const p=new THREE.Vector3(P.pos.x+(i?rand(-sp,sp):0),0,P.pos.z+(i?rand(-sp,sp):0));setTimeout(()=>{if(BOSS===e&&!e.dead)teleCircle(p,cn?2.4:2,cn?1.3:1.1,A*1.3,col)},i*(cn?90:120))}}
  if(ab==='charge'){e.busy=1.6;const ang=Math.atan2(dx,dz);e.m.root.rotation.y=ang;const len=Math.min(20,d+6);teleRect(e.pos.clone(),ang,len,e.r*1.6,1,0,()=>{if(BOSS!==e||e.dead)return;e.charging={dir:new THREE.Vector3(Math.sin(ang),0,Math.cos(ang)),t:len/24,spd:24,hit:false};SFX.boom();shake(.2,.3)});SFX.warn()}
  if(ab==='cross'){e.busy=1.4;const base=Math.atan2(dx,dz)+(Math.random()<.5?0:PI/4);for(let i=0;i<4;i++)teleRect(e.pos.clone(),base+i*PI/2,16,2.6,1.1,A*1.6);if(ph2)setTimeout(()=>{if(BOSS===e&&!e.dead)for(let i=0;i<4;i++)teleRect(e.pos.clone(),base+PI/4+i*PI/2,16,2.6,1.1,A*1.6)},700);SFX.warn()}
  if(ab==='chase'){e.busy=1.2;const n=ph2?7:5;for(let i=0;i<n;i++)setTimeout(()=>{if(BOSS===e&&!e.dead)teleCircle(P.pos.clone(),2.2,.75,A*1.2,0xff3a6a)},i*330)}
  if(ab==='summon'){e.busy=1.2;const t={wolfking:'wolf',golem:'golemling',icelord:'knight',admiral:'xbow',lavagiant:'golemling',wyrm:'imp',ogier:'knight',berenger:'knight',ferumbras:'golemling',engelier:'golemling',renaud:'xbow',bradamante:'xbow',astolfo:'raider',girart:'raider',naimes:'imp',turpin:'knight',malagigi:'imp',oliver:'knight',shadow:'knight',abyss:'golemling',trialKnight:'knight'}[e.type]||'raider';const n=ph2?3:2;vRing(e.pos,0xff5a2a,1,6,.6);for(let i=0;i<n;i++){const a=i/n*TAU;spawnEnemy(t,e.pos.x+Math.cos(a)*4,e.pos.z+Math.sin(a)*4,false).aggro=true}SFX.bell()}
  if(ab==='bite'){e.busy=.8;const tp=e.pos.clone().addScaledVector(new THREE.Vector3(dx/d,0,dz/d),2.6);teleCircle(tp,2.4,.6,A*1.6)}}
function startBossIntro(){if(!W.bossKey)return;const bk=W.bossKey,A=W.arena;vRing(new THREE.Vector3(A.x,0,A.z),0xff5a2a,1,A.r,.8);
  const wall=new THREE.Mesh(new THREE.CylinderGeometry(A.r,A.r,4,64,1,true),addM(0xff5a2a,.16));wall.position.set(A.x,2,A.z);wall.material.userData.keep=true;scene.add(wall);W.wall=wall;
  const e=spawnEnemy(bk,A.x,A.z-6,false);e.aggro=true;BOSS=e;e.busy=2.5;SFX.bell();shake(.3,.6);banner('BOSS',EN[bk].name);bossHud(e);$('#bossBar').hidden=false;$('#quest').hidden=true;
  {const bi0=BOUNTY.findIndex(b=>b.boss===bk);const ln=bi0<0?[['nar','試煉騎士舉起了劍：「讓我看看，你配不配得上那個名字。」']]:STORY['b'+bi0];if(ln)setTimeout(()=>say(ln),900)}}
function bossHud(e){$('#bossN').textContent=e.b.name+(e.phase===2?'・暴怒':'');const k=Math.max(0,e.hp/e.max)*100;$('#bossBar i').style.width=k+'%';$('#bossBar u').style.width=k+'%';$('#bossBar s').textContent=Math.ceil(Math.max(0,e.hp))+' / '+Math.round(e.max)}
function bossDefeated(e){if(W.trial){trialWin(e);return}BOSS=null;slowMo=1.6;SFX.bell();banner('VICTORY','討伐成功');shake(.4,.6);$('#bossBar').hidden=true;for(const o of EN_LIST)if(o!==e&&!o.dead){o.hp=0;killEnemy(o)}for(const T of TELE)scene.remove(T.g);TELE=[];
  const bi=BOUNTY.findIndex(b=>b.boss===e.type);const first=!S.done.includes(bi);const zi=W.Z.idx;
  {const br=clamp((bi<2?1:bi<6?2:3)+(bi>=19||Math.random()<.2?1:0),1,4);dropItem(e.pos,br,'weapon');dropItem(e.pos,clamp(rollRarity(0,1),1,3),null)}
  for(let i=0;i<8;i++)dropGold(e.pos,Math.round(BOUNTY[bi].reward/8));
  if(W.wall){scene.remove(W.wall);W.wall=null}W.arenaLocked=false;openPortal();
  if(first){S.done.push(bi);{const lg={6:'rainbow',8:'titan',10:'swift',12:'ruin',14:'pope'}[bi];if(lg){const it=makeItem(4,ZONES[BOUNTY[bi].zone].idx,'weapon',lg);pickItem(it);setTimeout(()=>banner('傳說武器',it.name),2600)}}if(bi>=6&&bi<=17){S.reg=S.reg||[];if(!S.reg.includes(bi-6))S.reg.push(bi-6)}if(bi===18)S.crown=1;refreshStats();save()}
  setTimeout(()=>{if(mode!=='zone')return;const post=STORY['post'+bi];const fin=()=>{panel(`<h2>討伐完成</h2><div class="sub">${BOUNTY[bi].name}　懸賞金 ${BOUNTY[bi].reward} 金幣已撿起${first?'，並取得「'+BOUNTY[bi].relic+'」':''}。<br>地上的裝備會自動飛到你身邊。撿完後走進金色傳送門，或直接按「回暮鐘鎮」。</div><div class="row"><button class="btn dk" id="pStay">繼續撿裝備</button><button class="btn" id="pHome">回暮鐘鎮</button></div>`);$('#pStay').onclick=closePanel;$('#pHome').onclick=()=>{closePanel();goTown()}};if(first&&post)say(post,fin);else fin()},3200)}

/* ======================= DROPS ======================= */
function updDrops(dt,t){for(let i=DROPS.length-1;i>=0;i--){const d=DROPS[i];d.t+=dt;
    if(d.kind==='gold'){if(d.vy!==undefined){d.mesh.position.y+=d.vy*dt;d.vy-=14*dt;if(d.mesh.position.y<.25){d.mesh.position.y=.25;d.vy=undefined}}d.mesh.rotation.z+=dt*4;const dd=dist2(d.mesh.position,P.pos);if(d.t>.5&&dd<16){d.mesh.position.lerp(new THREE.Vector3(P.pos.x,1,P.pos.z),.25);if(dd<.6){S.gold+=d.n;SFX.coin();scene.remove(d.mesh);DROPS.splice(i,1);hudStats()}}}
    else{d.gem.rotation.y+=dt*2;d.gem.position.y=.7+Math.sin(t*3)*.15;d.beam.material.opacity=.3+.15*Math.sin(t*4);if(d.t>2.2&&!BOSS&&!EN_LIST.length&&W.bossSpawned){d.mesh.position.lerp(new THREE.Vector3(P.pos.x,0,P.pos.z),Math.min(1,dt*3))}if(d.t>.6&&dist2(d.mesh.position,P.pos)<2.2){pickItem(d.it);scene.remove(d.mesh);DROPS.splice(i,1)}}}}
function pickItem(it){if(S.bag.length>=40){S.gold+=salvage(it);toast('背包滿了，自動分解成金幣');return}S.bag.push(it);save();SFX.loot();const el=document.createElement('div');el.style.setProperty('--rc',RAR[it.rar].c);el.innerHTML=`<img src="${itemImg(it)}" alt="">獲得【${RAR[it.rar].n}】${it.name}`;$('#loot').appendChild(el);setTimeout(()=>el.remove(),3000);
  const cur=S.eq[it.slot];if(!cur||itemScore(it)>itemScore(cur))$('#bagBtn').classList.add('new')}
const itemScore=it=>it?(it.atk||0)*3*(1+.12*(it.up||0))+(it.hp||0)*.4*(1+.12*(it.up||0))+(it.crit||0)*600:0;
const salvage=it=>Math.round(4*(1+it.rar*1.5)*Math.pow(1.2,it.zi||0)*(1+.15*(bl('market')-1))*(1+.06*(it.up||0)));

/* ======================= PLAYER UPDATE ======================= */
function updPlayer(dt,t){if(P.dead)return;P.t+=dt;
  for(let i=0;i<4;i++)if(P.cd[i]>0)P.cd[i]=Math.max(0,P.cd[i]-dt);
  if(P.inv>0)P.inv-=dt;if(P.lock>0)P.lock-=dt;if(P.buff>0){P.buff-=dt;if(Math.random()<.4)PS.emit({x:P.pos.x,y:.5,z:P.pos.z},1,0xf0c35a,.5,.6,2,0,.5)}if(P.tacCd>0)P.tacCd-=dt;if(P.cd[4]>0)P.cd[4]=Math.max(0,P.cd[4]-dt);if(P.frenzy>0){P.frenzy-=dt;if(Math.random()<.5)PS.emit({x:P.pos.x,y:1,z:P.pos.z},1,0xff3a2a,.6,.5,1,0,.4)}if(advK()==='bishop'&&mode==='zone'){P.bishT=(P.bishT||0)+dt;if(P.bishT>4){P.bishT=0;if(P.hp<P.max){const h=Math.round(P.max*.04);P.hp=Math.min(P.max,P.hp+h);dmgNum(P.pos,'+'+h,'heal')}}}if(P.guard>0){P.guard-=dt;if(P.guardFx){P.guardFx.position.set(P.pos.x,1,P.pos.z);P.guardFx.material.opacity=.15+.1*Math.sin(t*6)}if(P.guard<=0&&P.guardFx){scene.remove(P.guardFx);P.guardFx=null}}
  if(P.regen>0){P.regen-=dt;P.hp=Math.min(P.max,P.hp+P.max*.04*dt)}
  if(P.flash>0){P.flash-=dt;P.m.M.flash(P.flash>0?.8:0)}
  let ix=input.x,iz=input.z;const k=input.keys;if(k.KeyA||k.ArrowLeft)ix-=1;if(k.KeyD||k.ArrowRight)ix+=1;if(k.KeyW||k.ArrowUp)iz-=1;if(k.KeyS||k.ArrowDown)iz+=1;let il=Math.hypot(ix,iz);if(il>1){ix/=il;iz/=il}if(P.soul>0){[ix,iz]=soulTick(dt);il=1}
  let mv=0;
  if(P.dash){P.dash.t-=dt;P.pos.addScaledVector(P.dash.dir,P.dash.spd*dt);if(Math.random()<.8)PS.emit({x:P.pos.x,y:.6,z:P.pos.z},2,0xcfe8ff,.5,.25,0,0,.3);if(P.dash.t<=0)P.dash=null;mv=1}
  else if(P.lock<=0&&il>.08){const sp=8.6*(1+.05*rk('pspd'))*Math.min(1,il)*(S.eq.weapon&&S.eq.weapon.wt==='titan'&&!(P.soul>0)?.8:1)*(P.soul>0?1.15:1);P.pos.x+=ix*sp*dt;P.pos.z+=iz*sp*dt;mv=Math.min(1,il);if(P.anim<=0)P.face=Math.atan2(ix,iz)}
  for(const o of W.obs){const dx=P.pos.x-o.x,dz=P.pos.z-o.z,d=Math.hypot(dx,dz);if(d<o.r+.4&&d>.001){P.pos.x=o.x+dx/d*(o.r+.4);P.pos.z=o.z+dz/d*(o.r+.4)}}
  W.bound(P.pos);
  const cur=P.m.root.rotation.y;let df=P.face-cur;df=Math.atan2(Math.sin(df),Math.cos(df));P.m.root.rotation.y=cur+df*Math.min(1,dt*16);
  if(P.anim>0)P.anim-=dt;
  if(mode==='zone'){P.atkT-=dt;if(P.atkT<=0&&P.lock<=0&&!P.dash)autoAttack()}
  P.moveAmt=lerp(P.moveAmt,mv,.25);animModel(P.m,P.t,P.moveAmt,P.anim>0?P.anim/.32:0,dt);
  if(P.dash)P.m.body.rotation.x=lerp(P.m.body.rotation.x,.5,.3);else P.m.body.rotation.x*=.8}
function playerDie(){P.dead=true;const lost=Math.floor(S.gold*.2);S.gold-=lost;save();slowMo=1.2;P.m.root.rotation.z=PI/2;P.m.root.position.y=.3;banner('','你倒下了');setTimeout(()=>{if(mode!=='zone')return;panel(`<h2>你倒下了</h2><div class="sub">慌亂中你掉了 ${lost} 金幣（身上的 20%），撿到的裝備會保留。<br>${bl('church')?'':'修好聖鐘教堂，出征時倒下就能復活一次。<br>'}回城鎮換上更好的裝備、找鐵匠強化，再來挑戰。<br>小提示：地上出現紅圈時按「翻滾」躲開。</div><div class="row"><button class="btn" id="pHome">回暮鐘鎮</button></div>`);$('#pHome').onclick=()=>{closePanel();goTown()}},1800)}

/* ======================= CAMERA ======================= */
const camT=new THREE.Vector3();let camOff=new THREE.Vector3(0,17.5,13);
function updCam(dt,snap){if(!P)return;const near=BOSS?new THREE.Vector3(0,21,15.5):new THREE.Vector3(0,17.5,13);if(innerWidth/innerHeight<.7)near.multiplyScalar(1.12);camOff.lerp(near,snap?1:dt*2);
  camT.lerp(new THREE.Vector3(P.pos.x,0,P.pos.z),snap?1:Math.min(1,dt*6));cam.position.copy(camT).add(camOff);if(shakeT>0){shakeT-=dt;cam.position.x+=rand(-1,1)*shakeA;cam.position.y+=rand(-1,1)*shakeA}else shakeA=0;cam.lookAt(camT.x,camT.y+.8,camT.z);
  W.sun.position.set(camT.x+8,18,camT.z+6);W.sun.target.position.set(camT.x,0,camT.z)}

/* ======================= HUD ======================= */
function hudStats(){if(!P)return;$('#hpB i').style.width=(P.hp/P.max*100)+'%';$('#hpB s').textContent=Math.ceil(P.hp)+' / '+P.max;$('#xpB i').style.width=(S.xp/xpNeed(S.lv)*100)+'%';$('#meN').innerHTML=CH[S.cls].name+`<span>LV${S.lv}</span>`;$('#gold').textContent=S.gold;$('#mW').textContent=S.mat.wood||0;$('#mS').textContent=S.mat.stone||0;$('#mI').textContent=S.mat.iron||0;$('#treeBtn').classList.toggle('new',freePts()>0)}
function hudSkills(){if(!P)return;for(let i=0;i<4;i++){const el=$('#sk'+i);const id=i?S.slots[i-1]:null;const max=i===0?2.6:id?NODE[id].cd*cdMult(id):1;const p=P.cd[i]/max;el.querySelector('.cd').style.setProperty('--p',p);el.querySelector('.ct').textContent=P.cd[i]>0?Math.ceil(P.cd[i]):'';if(el.dataset.was==='1'&&P.cd[i]<=0){el.classList.remove('ready');void el.offsetWidth;el.classList.add('ready')}el.dataset.was=P.cd[i]>0?'1':'0'}$('#potN').textContent=P.pots;$('#tacN').textContent=S.stock[S.tac]||0;{const el=$('#sk4');if(!el.hidden){const a=advInfo();if(a){const mx=a.awake?28:40;el.querySelector('.cd').style.setProperty('--p',P.cd[4]/mx);el.querySelector('.ct').textContent=P.cd[4]>0?Math.ceil(P.cd[4]):''}}}}
function setupSkillButtons(){[1,2,3].forEach(i=>{const el=$('#sk'+i);const id=S.slots[i-1];el.querySelector('span').textContent=id?'':'＋';el.querySelector('small').textContent=id?NODE[id].n:'空';el.style.backgroundImage=id?`url(${skIcon(id)})`:'none';el.classList.toggle('empty',!id);el.setAttribute('aria-label',id?NODE[id].n:'空的技能欄')});$('#sk0').style.backgroundImage=`url(${skIcon('dodge')})`;$('#sk0').querySelector('span').textContent='';$('#skP').style.backgroundImage=`url(${itemIcon('potion',null)})`;const t=TAC[S.tac]||TAC.fire;$('#skT').style.backgroundImage=`url(${itemIcon(t.ik,null)})`;$('#skT').setAttribute('aria-label',t.n);$('#icBag').src=uiIcon('bag');$('#icTree').src=uiIcon('tree');$('#icBook').src=uiIcon('book');$('#icHome').src=uiIcon('home');{const a=advInfo();const u=$('#sk4');u.hidden=!a;if(a){u.style.backgroundImage=`url(${skIcon(a.ult)})`;u.querySelector('small').textContent=a.un}}$('#icMap').src=uiIcon('map');$('#mapBtn').hidden=mode!=='town';$('#imW').src=uiIcon('wood');$('#imS').src=uiIcon('stone');$('#imI').src=uiIcon('iron');$('#homeBtn').hidden=mode!=='zone';drawPortrait($('#meP'),S.cls,'calm',true)}
$('#skT').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();au();useTac()});
['0','1','2','3'].forEach(i=>{const el=$('#sk'+i);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();au();useSkill(+i)})});
$('#skP').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();usePotion()});
function updWorldTags(){if(!W)return;
  for(const e of EN_LIST){if(!e.bar||e.dead)continue;const [x,y,ok]=toScreen(e.pos,e.type==='golemling'?2.6:e.type==='wolf'?2:e.type==='imp'?1.5:2.6);e.bar.style.left=x+'px';e.bar.style.top=y+'px';e.bar.style.display=ok&&e.hp<e.max?'':'none';e.bar.firstChild.style.width=(e.hp/e.max*100)+'%'}
  if(W.type==='town'){for(const n of W.npcs){if(!n.tag){n.tag=document.createElement('div');n.tag.className='tag3';n.tag.innerHTML=(n.act==='bounty'&&n.board?'<b>!</b>':n.act==='talk'&&!S.intro?'<b>?</b>':n.act==='temple'&&advReady()?'<b class="ok">★</b>':n.act==='quest'?(S.q&&S.q[n.g]&&S.q[n.g].p>=S.q[n.g].n?'<b class="ok">✓</b>':'<b class="qq">!</b>'):n.name==='建築師 哈特'?'<b class="qq">⚒</b>':'')+n.name;ov.appendChild(n.tag)}const [x,y,ok]=toScreen({x:n.x,y:0,z:n.z},n.board?3:2.6);n.tag.style.left=x+'px';n.tag.style.top=y+'px';n.tag.style.display=ok?'':'none'}}}
function nearNPC(){if(!W||W.type!=='town'||!P)return null;let best=null,bd=6.5;for(const n of W.npcs){const d=dist2(P.pos,n);if(d<bd){bd=d;best=n}}return best}
let curNPC=null;
function updAct(){const n=nearNPC();if(n!==curNPC){curNPC=n;$('#act').hidden=!n||mode!=='town';if(n)$('#actB').textContent={bounty:'查看懸賞',smith:'強化裝備',shop:'商店',quest:'委託',build:'城鎮建設',tavern:'酒館同伴',map:'打開地圖',talk:'對話',mate:'對話',vill:'對話'}[n.act]}}
$('#actB').addEventListener('click',()=>{SFX.tap();if(!curNPC)return;interact(curNPC)});

/* ======================= INPUT ======================= */
const joy=$('#joy'),knob=$('#knob');let joyId=null,jx=0,jy=0;
$('#game').addEventListener('pointerdown',e=>{au();if(mode!=='town'&&mode!=='zone')return;if(e.target.closest('.sk,#act,#res,#menu,#mats,#panel,#dlg,#me,#card,#mm,.btn'))return;if(e.clientX>innerWidth*.55)return;joyId=e.pointerId;jx=e.clientX;jy=e.clientY;joy.style.left=jx+'px';joy.style.top=jy+'px';joy.classList.add('on');$('#joyHint').hidden=true;knob.style.transform='';try{e.target.setPointerCapture(e.pointerId)}catch(_){}});
addEventListener('pointermove',e=>{if(e.pointerId!==joyId)return;let dx=e.clientX-jx,dy=e.clientY-jy;let l=Math.hypot(dx,dy);const mx=50;if(l>mx){jx=e.clientX-dx/l*mx;jy=e.clientY-dy/l*mx;joy.style.left=jx+'px';joy.style.top=jy+'px';dx=dx/l*mx;dy=dy/l*mx;l=mx}knob.style.transform=`translate(${dx}px,${dy}px)`;const m=clamp((l-5)/20,0,1);input.x=l?dx/l*m:0;input.z=l?dy/l*m:0});
const endJoy=e=>{if(e.pointerId!==joyId)return;joyId=null;input.x=input.z=0;joy.classList.remove('on')};
addEventListener('pointerup',endJoy);addEventListener('pointercancel',endJoy);
addEventListener('keydown',e=>{input.keys[e.code]=true;if(e.code==='Space'){e.preventDefault();useSkill(0)}if(e.code==='Digit1'||e.code==='KeyJ')useSkill(1);if(e.code==='Digit2'||e.code==='KeyK')useSkill(2);if(e.code==='Digit3'||e.code==='KeyL')useSkill(3);if(e.code==='Digit4'||e.code==='KeyU')useUlt();if(e.code==='KeyQ')usePotion();if(e.code==='KeyR')useTac();if(e.code==='KeyE'&&curNPC&&mode==='town')interact(curNPC);if(e.code==='Enter'&&D)dlgNext()});
addEventListener('keyup',e=>{input.keys[e.code]=false});

