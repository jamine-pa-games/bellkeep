/* 存檔、音效、3D 場景、材質、對話頭像、職業與基本資料（BOUNTY、怪物 EN、卷首故事） */
'use strict';
const $=s=>document.querySelector(s);
const PI=Math.PI,TAU=PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,rand=(a,b)=>a+Math.random()*(b-a);
const easeOut=k=>1-Math.pow(1-k,3);
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function shade(hex,a){let n=parseInt(hex.slice(1),16),r=n>>16,gg=n>>8&255,b=n&255;const f=a<0?0:255,t=Math.abs(a);r=Math.round(r+(f-r)*t);gg=Math.round(gg+(f-gg)*t);b=Math.round(b+(f-b)*t);return'#'+((1<<24)|(r<<16)|(gg<<8)|b).toString(16).slice(1)}

/* ======================= SAVE ======================= */
const KEY='bellkeep-3d-v1';
const DEF={cls:null,lv:1,xp:0,gold:60,eq:{weapon:null,armor:null,charm:null},bag:[],done:[],intro:false,mute:false,seen:{},skr:{1:1,2:1,3:1},pas:{atk:0,hp:0,crit:0,spd:0},stock:{fire:2,horn:1,holy:1},tac:'fire',potMax:3,mat:{wood:0,stone:0,iron:0},merch:0,adv:{},reg:[],crown:0,qi:{},tree:{},slots:[null,null,null],bld:{},evt:0,mate:null};
let S=null;
function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&j.cls){S=Object.assign(JSON.parse(JSON.stringify(DEF)),j)}}catch(e){}if(!S)S=JSON.parse(JSON.stringify(DEF))}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ======================= AUDIO ======================= */
let AC=null;
function au(){if(S&&S.mute)return null;try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){return null}return AC}
function tone(f,d=.15,type='square',v=.05,slide=0,delay=0){const a=au();if(!a)return;const t0=a.currentTime+delay;const o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t0+d);gn.gain.setValueAtTime(v,t0);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(gn).connect(a.destination);o.start(t0);o.stop(t0+d+.02)}
function noise(d=.2,v=.08,f=800){const a=au();if(!a)return;const n=a.sampleRate*d,b=a.createBuffer(1,n,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<n;i++)c[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=b;const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.value=f;const gn=a.createGain();gn.gain.value=v;s.connect(fl).connect(gn).connect(a.destination);s.start()}
const SFX={hit:()=>{noise(.06,.05,2400);tone(220,.05,'square',.02,.5)},crit:()=>{noise(.1,.08,3200);tone(880,.12,'square',.03,.5)},boom:()=>{noise(.5,.18,500);tone(80,.5,'sawtooth',.06,.4)},swing:()=>noise(.1,.04,1600),shoot:()=>tone(900,.08,'triangle',.03,.4),cast:()=>{tone(520,.25,'triangle',.04,2);tone(780,.3,'sine',.03,1.5,.05)},hurt:()=>{tone(160,.25,'sawtooth',.06,.5)},coin:()=>{tone(1320,.06,'square',.025);tone(1760,.1,'square',.025,0,.05)},loot:()=>{[660,880,1100,1320].forEach((f,i)=>tone(f,.18,'triangle',.04,0,i*.06))},lvl:()=>{[523,659,784,1046,1318].forEach((f,i)=>tone(f,.3,'square',.035,0,i*.08))},bell:()=>{tone(196,2.2,'sine',.09);tone(392.7,1.6,'sine',.035);tone(588,1.2,'sine',.02)},tap:()=>tone(720,.04,'square',.02),dodge:()=>noise(.15,.05,900),warn:()=>tone(300,.3,'square',.03,.7)};

/* ======================= THREE SETUP ======================= */
const cv=$('#gl');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const cam=new THREE.PerspectiveCamera(40,1,.1,220);
function resize(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.7?46:38;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const GRAD=(()=>{const t=new THREE.DataTexture(new Uint8Array([95,175,255]),3,1,THREE.LuminanceFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t})();
const OUTM=new THREE.MeshBasicMaterial({color:0x1a1210,side:THREE.BackSide});
const GC={};
const G={sph:(r,w=18,h=14)=>GC['s'+r+w]||(GC['s'+r+w]=new THREE.SphereGeometry(r,w,h)),cyl:(a,b,h,s=12)=>GC['c'+a+b+h+s]||(GC['c'+a+b+h+s]=new THREE.CylinderGeometry(a,b,h,s)),box:(x,y,z)=>GC['b'+x+y+z]||(GC['b'+x+y+z]=new THREE.BoxGeometry(x,y,z)),cone:(r,h,s=8)=>GC['k'+r+h+s]||(GC['k'+r+h+s]=new THREE.ConeGeometry(r,h,s)),ico:(r,d=0)=>GC['i'+r+d]||(GC['i'+r+d]=new THREE.IcosahedronGeometry(r,d)),dode:r=>GC['d'+r]||(GC['d'+r]=new THREE.DodecahedronGeometry(r,0)),oct:r=>GC['o'+r]||(GC['o'+r]=new THREE.OctahedronGeometry(r,0)),tor:(r,t,a=TAU)=>GC['t'+r+t+a]||(GC['t'+r+t+a]=new THREE.TorusGeometry(r,t,6,20,a))};
const RINGG=new THREE.RingGeometry(.86,1,56),DISKG=new THREE.CircleGeometry(1,48),PLANEG=new THREE.PlaneGeometry(1,1);
const SMC={};
function tm(c,o={}){const k=c+'|'+(o.e||0)+'|'+(o.flat?1:0)+'|'+(o.map?o.map.uuid:'');if(SMC[k])return SMC[k];return SMC[k]=o.flat?new THREE.MeshLambertMaterial({color:c,emissive:o.e||0,flatShading:true}):new THREE.MeshToonMaterial({color:c,gradientMap:GRAD,emissive:o.e||0,map:o.map||null})}
function addM(c,o=1){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})}
// per-character material set (so hit flashes are per character)
function MatSet(){const list=[],cache={};const get=(c,e)=>{const k=c+'|'+(e||0);if(cache[k])return cache[k];const m=new THREE.MeshToonMaterial({color:c,gradientMap:GRAD,emissive:e||0});m.userData.e0=new THREE.Color(e||0);list.push(m);return cache[k]=m};
  return{list,get,part(par,geo,c,x,y,z,o={}){const m=new THREE.Mesh(geo,o.basic?new THREE.MeshBasicMaterial({color:c,transparent:!!o.op,opacity:o.op||1}):get(c,o.e));m.position.set(x,y,z);if(o.rot)m.rotation.set(o.rot[0],o.rot[1],o.rot[2]);if(o.sc)m.scale.set(o.sc[0],o.sc[1],o.sc[2]);m.castShadow=o.shadow!==false&&!o.basic;par.add(m);if(o.ol!==false&&!o.basic){const ol=new THREE.Mesh(geo,OUTM);ol.scale.setScalar(1+(o.ow||.08));m.add(ol)}return m},
  flash(v){for(const m of list){if(v>0)m.emissive.setRGB(v,v,v);else m.emissive.copy(m.userData.e0)}}}}

/* ======================= TEXTURES ======================= */
function ctex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}t.anisotropy=4;return t}
function noiseFill(x,w,h,cols,n,sz,seed){const r=rng(seed);for(let i=0;i<n;i++){x.fillStyle=cols[(r()*cols.length)|0];const s=sz*(.5+r());x.globalAlpha=.25+r()*.5;x.beginPath();x.ellipse(r()*w,r()*h,s,s*(.6+r()*.6),r()*PI,0,TAU);x.fill()}x.globalAlpha=1}
const TEX={};
function texGround(kind){if(TEX[kind])return TEX[kind];let t;
  if(kind==='grass')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#5f9a44';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#4e8638','#6eaa4e','#7fb85a','#467a32'],420,9,1);const r=rng(2);for(let i=0;i<500;i++){x.strokeStyle=r()<.5?'#3e7028':'#8cc866';x.globalAlpha=.6;const px=r()*w,py=r()*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+r()*3-1.5,py-4-r()*4);x.stroke()}x.globalAlpha=1;for(let i=0;i<14;i++){x.fillStyle=['#f6e07a','#fff','#e88aa0'][i%3];x.fillRect(r()*w,r()*h,3,3)}},[14,14]);
  if(kind==='dgrass')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#4a7038';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#3c602e','#56804a','#5e7a40','#3a5228','#6a6a3a'],420,10,3)},[14,14]);
  if(kind==='dirt')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#b08a5a';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#9a7448','#c49a68','#8a6a40','#d0aa78'],500,7,4);const r=rng(5);for(let i=0;i<60;i++){x.fillStyle='#7a5a38';x.beginPath();x.arc(r()*w,r()*h,2+r()*3,0,TAU);x.fill()}},[3,20]);
  if(kind==='cobble')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#5a5448';x.fillRect(0,0,w,h);const r=rng(6);const s=32;for(let yy=0;yy<h;yy+=s/1.4){for(let xx=-s;xx<w+s;xx+=s){const ox=((yy/(s/1.4))|0)%2?s/2:0;const cx=xx+ox+r()*4,cy=yy+r()*3;const c=['#a89a82','#9a8c74','#b4a68e','#8e826c','#a49474'][(r()*5)|0];const gr=x.createLinearGradient(cx,cy,cx,cy+s/1.6);gr.addColorStop(0,shade(c,.15));gr.addColorStop(1,shade(c,-.2));x.fillStyle=gr;x.beginPath();x.roundRect?x.roundRect(cx+2,cy+2,s-5,s/1.4-4,6):x.rect(cx+2,cy+2,s-5,s/1.4-4);x.fill()}}noiseFill(x,w,h,['#00000055','#ffffff22'],120,4,7)},[10,10]);
  if(kind==='mine')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#4a4458';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#3a3448','#5a5468','#2e2a3a','#625a70'],520,10,8);const r=rng(9);x.strokeStyle='#2a2434';x.lineWidth=2;for(let i=0;i<10;i++){let px=r()*w,py=r()*h;x.beginPath();x.moveTo(px,py);for(let j=0;j<5;j++){px+=r()*30-15;py+=r()*30-15;x.lineTo(px,py)}x.stroke()}},[12,12]);
  if(kind==='ash')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#4a3632';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#3a2824','#5a423a','#2e201c','#6a4a3a'],520,10,10);const r=rng(11);x.lineWidth=2;for(let i=0;i<9;i++){let px=r()*w,py=r()*h;x.strokeStyle='#ff6a2a';x.shadowColor='#ff8a3a';x.shadowBlur=6;x.beginPath();x.moveTo(px,py);for(let j=0;j<5;j++){px+=r()*26-13;py+=r()*26-13;x.lineTo(px,py)}x.stroke()}x.shadowBlur=0},[12,12]);
  if(kind==='flag')t=ctex(64,128,(x,w,h)=>{x.fillStyle='#2f5a8a';x.fillRect(0,0,w,h);x.fillStyle='#f0c35a';x.fillRect(0,0,w,6);x.beginPath();x.arc(32,50,14,0,TAU);x.fill();x.fillStyle='#2f5a8a';x.beginPath();x.arc(32,50,8,0,TAU);x.fill()});
  if(kind==='awning')t=ctex(64,64,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#f4efe2':'#c8402e';x.fillRect(i*8,0,8,h)}});
  if(kind==='wall')t=ctex(128,128,(x,w,h)=>{x.fillStyle='#efe0c0';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#e0ceaa','#f6ead0'],80,8,12);x.fillStyle='#5a3a22';x.fillRect(0,0,w,8);x.fillRect(0,h-8,w,8);x.fillRect(0,0,8,h);x.fillRect(w-8,0,8,h);x.save();x.translate(w/2,h/2);x.rotate(.78);x.fillRect(-4,-90,8,180);x.rotate(-1.56);x.fillRect(-4,-90,8,180);x.restore()});
  if(kind==='roof')t=ctex(128,128,(x,w,h)=>{x.fillStyle='#b84a32';x.fillRect(0,0,w,h);for(let yy=0;yy<h;yy+=12){x.fillStyle='#8a2e1e';x.fillRect(0,yy+10,w,2);for(let xx=((yy/12)%2)*8;xx<w;xx+=16){x.fillStyle='#a03e28';x.fillRect(xx,yy,1,10)}}});
  if(kind==='roofB')t=ctex(128,128,(x,w,h)=>{x.fillStyle='#3a6a8a';x.fillRect(0,0,w,h);for(let yy=0;yy<h;yy+=12){x.fillStyle='#24485e';x.fillRect(0,yy+10,w,2);for(let xx=((yy/12)%2)*8;xx<w;xx+=16){x.fillStyle='#2e5a74';x.fillRect(xx,yy,1,10)}}});
  if(kind==='stone')t=ctex(128,128,(x,w,h)=>{x.fillStyle='#8e8a84';x.fillRect(0,0,w,h);for(let yy=0;yy<h;yy+=16){for(let xx=((yy/16)%2)*16;xx<w;xx+=32){x.fillStyle=['#9a968e','#86827a','#a29e94'][(xx+yy)%3];x.fillRect(xx+1,yy+1,30,14)}}});
  if(kind==='glow')t=ctex(64,64,(x,w,h)=>{const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#fff');gr.addColorStop(.25,'#ffffffcc');gr.addColorStop(1,'#fff0');x.fillStyle=gr;x.fillRect(0,0,w,h)});
  if(kind==='swirl')t=ctex(128,128,(x,w,h)=>{const gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'#fff8e0');gr.addColorStop(.4,'#f0a83a');gr.addColorStop(1,'#6a1a0a00');x.fillStyle=gr;x.fillRect(0,0,w,h);x.strokeStyle='#fff6';x.lineWidth=3;for(let i=0;i<5;i++){x.beginPath();x.arc(64,64,12+i*10,i,i+2.2);x.stroke()}});
  if(kind==='ice')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#bcd8ea';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#a8c8e0','#d8ecf6','#9ec0d8'],300,14,21);const r=rng(22);x.strokeStyle='#ffffffaa';x.lineWidth=1.5;for(let i=0;i<14;i++){let px=r()*w,py=r()*h;x.beginPath();x.moveTo(px,py);for(let j=0;j<4;j++){px+=r()*40-20;py+=r()*40-20;x.lineTo(px,py)}x.stroke()}},[12,12]);
  if(kind==='snowp')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#eef3f6';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#dfe8ee','#ffffff','#cfdae2'],420,9,23)},[4,4]);
  if(kind==='sand')t=ctex(256,256,(x,w,h)=>{x.fillStyle='#d8c49a';x.fillRect(0,0,w,h);noiseFill(x,w,h,['#c8b088','#e6d4ae','#bfa47a'],520,7,24)},[12,12]);
  if(kind==='planks')t=ctex(256,256,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=['#9a6a3a','#8a5a30','#a8744a'][i%3];x.fillRect(0,i*32,w,32);x.fillStyle='#4a2a12';x.fillRect(0,i*32,w,2);for(let k=0;k<3;k++)x.fillRect((i*67+k*90)%w,i*32,2,32)}noiseFill(x,w,h,['#00000022','#ffffff11'],160,6,25)},[4,4]);
  return TEX[kind]=t}

/* ======================= PORTRAITS (story) ======================= */
const CH={
  ivy:{name:'伊芙',role:'守',skin:'#f6d6bd',hair:'#6b3f27',hi:'#b0744a',eye:'#3f6fae',out:'#7d97ad',trim:'#e0c27c',style:'bob',acc:'armor'},
  roan:{name:'洛安',role:'攻',skin:'#ecc9a8',hair:'#2a2830',hi:'#5f5c78',eye:'#3c7d4c',out:'#4a6b3e',trim:'#c7a067',style:'messy',acc:'scarf'},
  sera:{name:'瑟拉',role:'輔',skin:'#f8e2d2',hair:'#dcd6ce',hi:'#ffffff',eye:'#8b4f6e',out:'#6b3346',trim:'#d9b46c',style:'long',acc:'braid'},
  rita:{name:'芮塔',role:'工',skin:'#f3cfb0',hair:'#d4672f',hi:'#f7a466',eye:'#2f8b84',out:'#7b5a3c',trim:'#e3b04d',style:'pony',acc:'goggles'},
  oren:{name:'歐倫',role:'鐘守',skin:'#e6c2a2',hair:'#dcdcd6',hi:'#ffffff',eye:'#5a5a5a',out:'#4c4036',trim:'#b89a5a',style:'elder',acc:'beard'},
  gen:{name:'赤燼將軍',role:'',skin:'#3a2a28',hair:'#241818',hi:'#5a3030',eye:'#ff5a32',out:'#3a1716',trim:'#b8452c',style:'helm',acc:'helm'},
  king:{name:'赤燼王 羅德蘭',role:'',skin:'#3a2a28',hair:'#241818',hi:'#5a3030',eye:'#ffb03a',out:'#5a1010',trim:'#f0c35a',style:'helm',acc:'helm'},
  priest:{name:'艾德蕾',role:'祭司',skin:'#f3d6c0',hair:'#e8e0d0',hi:'#ffffff',eye:'#6a5aa8',out:'#f4efe2',trim:'#e0b84a',style:'long',acc:'braid'},
  gren:{name:'葛倫',role:'',skin:'#d9b08c',hair:'#5a3a28',hi:'#8a8a84',eye:'#2f8b84',out:'#3a1716',trim:'#b8452c',style:'elder2',acc:'stubble'}
};
function drawPortrait(cv,id,expr,crop){
  const p=CH[id],x=cv.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);
  if(crop){const k=cv.width/112;x.setTransform(k,0,0,k,-44*k,-50*k)}else{const k=cv.width/200;x.setTransform(k,0,0,k,0,0)}
  x.lineJoin='round';x.lineCap='round';const OL='#2a1712';
  const fs=(fill,lw=3)=>{x.fillStyle=fill;x.fill();x.lineWidth=lw;x.strokeStyle=OL;x.stroke()};
  const hairG=()=>{const gr=x.createLinearGradient(0,40,0,170);gr.addColorStop(0,p.hi);gr.addColorStop(.28,p.hair);gr.addColorStop(1,shade(p.hair,-.35));return gr};
  x.beginPath();
  if(p.style==='long'){x.moveTo(50,92);x.quadraticCurveTo(26,170,36,240);x.lineTo(164,240);x.quadraticCurveTo(174,170,150,92);x.closePath();fs(hairG())}
  else if(p.style==='pony'){x.moveTo(132,62);x.quadraticCurveTo(196,64,182,150);x.quadraticCurveTo(176,176,160,186);x.quadraticCurveTo(170,140,146,104);x.closePath();fs(hairG());x.beginPath();x.moveTo(50,96);x.quadraticCurveTo(46,140,60,156);x.lineTo(140,156);x.quadraticCurveTo(154,140,150,96);x.closePath();fs(shade(p.hair,-.2))}
  else if(p.style==='bob'){x.moveTo(48,96);x.quadraticCurveTo(40,152,60,170);x.lineTo(140,170);x.quadraticCurveTo(160,152,152,96);x.closePath();fs(shade(p.hair,-.15))}
  else if(p.style==='messy'){x.moveTo(52,96);x.quadraticCurveTo(46,140,58,152);x.lineTo(142,152);x.quadraticCurveTo(154,140,148,96);x.closePath();fs(shade(p.hair,-.15))}
  x.beginPath();x.moveTo(14,240);x.quadraticCurveTo(22,188,74,180);x.lineTo(126,180);x.quadraticCurveTo(178,188,186,240);x.closePath();
  const og=x.createLinearGradient(0,180,0,240);og.addColorStop(0,p.out);og.addColorStop(1,shade(p.out,-.35));fs(og);
  x.beginPath();x.moveTo(78,180);x.lineTo(100,214);x.lineTo(122,180);x.lineWidth=5;x.strokeStyle=p.trim;x.stroke();
  x.beginPath();x.moveTo(88,150);x.lineTo(88,184);x.quadraticCurveTo(100,194,112,184);x.lineTo(112,150);x.closePath();fs(shade(p.skin,-.08),2.5);
  x.beginPath();x.moveTo(88,166);x.quadraticCurveTo(100,174,112,164);x.lineTo(112,152);x.lineTo(88,152);x.closePath();x.fillStyle=shade(p.skin,-.2);x.fill();
  if(p.acc==='armor'){for(const s of[-1,1]){x.beginPath();x.ellipse(100+s*62,198,30,18,s*.35,0,TAU);const ag=x.createLinearGradient(0,180,0,216);ag.addColorStop(0,'#e3e9ee');ag.addColorStop(1,'#7c8a98');fs(ag)}x.beginPath();x.arc(100,222,7,0,TAU);fs(p.trim,2)}
  if(p.acc==='scarf'){x.beginPath();x.moveTo(70,176);x.quadraticCurveTo(100,198,130,176);x.lineTo(134,192);x.quadraticCurveTo(100,214,66,192);x.closePath();fs('#3f8a52');x.beginPath();x.moveTo(118,196);x.lineTo(132,240);x.lineTo(112,240);x.lineTo(106,200);x.closePath();fs('#367a47')}
  if(p.acc==='braid'){for(let i=0;i<6;i++){x.beginPath();x.ellipse(60-i*1.5,140+i*16,11,10,0,0,TAU);fs(i%2?p.hair:shade(p.hair,-.1),2.5)}}
  if(p.acc==='helm'||p.acc==='stubble'){for(const s of[-1,1]){x.beginPath();x.moveTo(100+s*40,184);x.lineTo(100+s*84,196);x.lineTo(100+s*80,222);x.lineTo(100+s*44,206);x.closePath();fs('#4a2420')}}
  x.beginPath();x.moveTo(56,96);x.bezierCurveTo(56,140,80,170,100,172);x.bezierCurveTo(120,170,144,140,144,96);x.bezierCurveTo(144,58,56,58,56,96);
  if(p.style==='helm'){fs('#1a0e0e')}else{fs(p.skin)}
  if(p.style!=='helm'){
    for(const s of[-1,1]){x.beginPath();x.ellipse(100+s*45,116,6,10,0,0,TAU);fs(p.skin,2.5)}
    x.beginPath();x.moveTo(56,96);x.bezierCurveTo(56,140,80,170,100,172);x.bezierCurveTo(120,170,144,140,144,96);x.fillStyle=p.skin;x.fill();
    x.fillStyle='#f0808040';for(const s of[-1,1]){x.beginPath();x.ellipse(100+s*27,140,9,5,0,0,TAU);x.fill()}
    const ey=p.style==='elder'||p.style==='elder2'?122:120;
    for(const s of[-1,1]){const cx=100+s*22,cy=ey;
      if(expr==='closed'||(p.style==='elder'&&expr!=='surprised')){x.beginPath();x.moveTo(cx-10,cy);x.quadraticCurveTo(cx,cy+(expr==='closed'?7:4),cx+10,cy);x.lineWidth=3;x.strokeStyle=OL;x.stroke();if(p.style==='elder'){x.beginPath();x.moveTo(cx-12,cy-9);x.quadraticCurveTo(cx,cy-15,cx+12,cy-10);x.lineWidth=6;x.strokeStyle='#e8e8e0';x.stroke()}continue}
      const ry=p.style==='elder2'?9:13;
      x.beginPath();x.ellipse(cx,cy,10,ry,0,0,TAU);x.fillStyle='#fff';x.fill();
      const ig=x.createLinearGradient(0,cy-ry,0,cy+ry);ig.addColorStop(0,shade(p.eye,-.5));ig.addColorStop(.55,p.eye);ig.addColorStop(1,shade(p.eye,.45));
      x.beginPath();x.ellipse(cx-s*1,cy+1,7.5,ry-2,0,0,TAU);x.fillStyle=ig;x.fill();
      x.beginPath();x.ellipse(cx-s*1,cy+2,3.4,ry*.4,0,0,TAU);x.fillStyle=shade(p.eye,-.7);x.fill();
      x.fillStyle='#fff';x.beginPath();x.arc(cx-3,cy-4,3.2,0,TAU);x.fill();x.beginPath();x.arc(cx+3,cy+5,1.4,0,TAU);x.fill();
      x.beginPath();x.moveTo(cx-12,cy-ry+5);x.quadraticCurveTo(cx,cy-ry-5,cx+12,cy-ry+4);x.lineTo(cx+s*15,cy-ry+2);x.lineWidth=4;x.strokeStyle=OL;x.stroke();
      x.beginPath();const by=cy-ry-9;
      if(expr==='angry'){x.moveTo(cx+s*11,by-3);x.lineTo(cx-s*9,by+4)}else if(expr==='sad'||expr==='worried'){x.moveTo(cx+s*11,by+3);x.lineTo(cx-s*9,by-3)}else{x.moveTo(cx-10,by+1);x.quadraticCurveTo(cx,by-3,cx+10,by+1)}
      x.lineWidth=3;x.strokeStyle=shade(p.hair,-.4);x.stroke();
      if(expr==='sad'){x.fillStyle='#9fd0ff';x.beginPath();x.ellipse(cx+s*4,cy+16,2.2,3.5,0,0,TAU);x.fill()}
    }
    x.beginPath();x.moveTo(100,138);x.lineTo(98,142);x.lineWidth=2;x.strokeStyle=shade(p.skin,-.3);x.stroke();
    x.beginPath();x.lineWidth=2.5;x.strokeStyle='#7a2e26';
    if(expr==='smile'){x.moveTo(92,151);x.quadraticCurveTo(100,159,108,151);x.stroke()}
    else if(expr==='surprised'){x.ellipse(100,154,4,5,0,0,TAU);x.fillStyle='#7a2e26';x.fill()}
    else if(expr==='sad'){x.moveTo(93,156);x.quadraticCurveTo(100,151,107,156);x.stroke()}
    else if(expr==='angry'){x.moveTo(93,154);x.lineTo(107,152);x.stroke()}
    else{x.moveTo(95,153);x.quadraticCurveTo(100,155,105,153);x.stroke()}
    if(p.acc==='beard'){x.beginPath();x.moveTo(70,140);x.quadraticCurveTo(72,190,100,206);x.quadraticCurveTo(128,190,130,140);x.quadraticCurveTo(116,158,100,150);x.quadraticCurveTo(84,158,70,140);fs('#ececE6')}
    if(p.acc==='stubble'){x.fillStyle='#5a3a2855';for(let i=0;i<40;i++){const a=PI*(.15+.7*(i/40)),r=40;x.fillRect(100+Math.cos(a)*r*.9,118+Math.sin(a)*r*1.1,1.6,1.6)}x.beginPath();x.moveTo(74,108);x.lineTo(92,128);x.lineWidth=2;x.strokeStyle='#8a4a3a';x.stroke()}
  }
  x.beginPath();
  if(p.style==='helm'){
    x.moveTo(48,124);x.bezierCurveTo(40,40,160,40,152,124);x.lineTo(152,150);x.lineTo(130,140);x.lineTo(100,152);x.lineTo(70,140);x.lineTo(48,150);x.closePath();
    const hg=x.createLinearGradient(0,40,0,150);hg.addColorStop(0,'#6a5a5c');hg.addColorStop(1,'#241a1c');fs(hg);
    x.beginPath();x.moveTo(64,116);x.lineTo(136,116);x.lineTo(132,126);x.lineTo(68,126);x.closePath();fs('#0a0404',2);
    x.fillStyle=p.eye;x.shadowColor=p.eye;x.shadowBlur=12;x.fillRect(76,118,14,5);x.fillRect(110,118,14,5);x.shadowBlur=0;
    for(const s of[-1,1]){x.beginPath();x.moveTo(100+s*44,70);x.quadraticCurveTo(100+s*74,40,100+s*66,8);x.quadraticCurveTo(100+s*60,44,100+s*36,58);x.closePath();fs('#c8b89a')}
  } else if(p.style==='elder'){
    x.moveTo(54,118);x.quadraticCurveTo(50,92,60,84);x.lineTo(66,104);x.closePath();x.moveTo(146,118);x.quadraticCurveTo(150,92,140,84);x.lineTo(134,104);x.closePath();fs(p.hair);
  } else {
    const B={bob:[[150,122],[142,98],[130,110],[118,86],[106,106],[94,84],[82,106],[70,92],[60,112],[50,124]],
      messy:[[150,116],[146,94],[134,108],[126,82],[112,104],[100,80],[88,104],[74,86],[64,108],[50,118]],
      long:[[150,130],[146,100],[132,96],[118,104],[104,92],[92,104],[78,96],[66,104],[56,128],[50,132]],
      pony:[[148,112],[140,92],[128,104],[116,84],[102,102],[90,86],[78,104],[66,94],[58,112],[52,116]],
      elder2:[[146,104],[138,92],[124,98],[110,88],[96,96],[82,90],[70,96],[58,100],[54,108],[54,108]]}[p.style];
    x.moveTo(50,B[9][1]);x.bezierCurveTo(36,36,164,36,150,B[0][1]);
    for(let i=1;i<B.length;i++){const a=B[i-1],b=B[i];x.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2-4,b[0],b[1])}
    x.closePath();fs(hairG());
    if(p.style==='messy'){for(const [a,b,c] of[[70,62,58],[96,52,40],[124,58,52]]){x.beginPath();x.moveTo(a-12,b+8);x.lineTo(a+8,c-6);x.lineTo(a+8,b+6);x.closePath();fs(p.hair,2.5)}}
    x.beginPath();x.arc(100,94,40,PI*1.16,PI*1.42);x.lineWidth=5;x.strokeStyle=p.hi+'cc';x.stroke();
    if(p.acc==='braid'){x.beginPath();x.moveTo(62,84);x.quadraticCurveTo(100,70,138,84);x.lineWidth=3;x.strokeStyle='#e6c46a';x.stroke();x.beginPath();x.moveTo(100,74);x.lineTo(105,81);x.lineTo(100,88);x.lineTo(95,81);x.closePath();fs('#a04a8a',2)}
    if(p.acc==='goggles'){x.beginPath();x.moveTo(54,80);x.quadraticCurveTo(100,58,146,80);x.lineWidth=7;x.strokeStyle='#5a3a24';x.stroke();for(const s of[-1,1]){x.beginPath();x.arc(100+s*17,68,12,0,TAU);const lg=x.createRadialGradient(100+s*17-4,64,2,100+s*17,68,12);lg.addColorStop(0,'#c8fff2');lg.addColorStop(1,'#2f8b84');fs(lg,3.5)}}
  }
}

/* ======================= CLASSES / DATA ======================= */
const HEROES=['ivy','roan','sera','rita'];
const CLS={
  ivy:{job:'聖鐘騎士',title:'鐘樓的盾',stars:{輸出:2,生存:3,難度:1},range:2.3,rate:.5,kind:'melee',hp:1.25,atk:1,desc:'聖鐘騎士團最年輕的騎士，誓言守護每一個走在路上的人。近身揮砍、生命最高，最適合第一次玩。',wnoun:'長劍',
    sk:[{n:'旋風斬',ic:'whirl',cd:5,d:'原地旋轉三圈，砍中周圍所有敵人'},{n:'盾擊衝鋒',ic:'charge',cd:7,d:'舉盾向前衝刺，撞飛並暈眩路上的敵人'},{n:'鐘之守護',ic:'guard',cd:16,d:'6 秒內受到傷害 -60%，並回復 30% 生命'}]},
  roan:{job:'長弓手',title:'霧中的弓',stars:{輸出:3,生存:1,難度:2},range:11,rate:.42,kind:'arrow',hp:.9,atk:1.08,desc:'獵戶出身的長弓手。祖父說：一千個農夫拉滿弓，也能讓騎士下馬。射程最遠、單體輸出最高。',wnoun:'長弓',
    sk:[{n:'穿雲箭',ic:'pierce',cd:5,d:'射出貫穿一整排敵人的巨箭'},{n:'箭雨',ic:'rain',cd:8,d:'在目標區域降下持續的箭雨'},{n:'後躍連射',ic:'leap',cd:7,d:'向後跳開，扇形射出五支箭'}]},
  sera:{job:'聖歌少女',title:'聽鐘的人',stars:{輸出:2,生存:2,難度:3},range:10,rate:.62,kind:'orb',hp:.95,atk:1.05,desc:'邊境村莊的牧羊少女，說自己聽得見聖鳴的聲音。追蹤法球、範圍法術，還能治療自己。',wnoun:'法杖',
    sk:[{n:'暮光雷',ic:'bolt',cd:4,d:'落雷擊中目標，並連鎖跳到附近敵人'},{n:'星落',ic:'star',cd:9,d:'召喚流星砸向目標，造成巨大範圍傷害'},{n:'聖歌',ic:'song',cd:12,d:'回復 40% 生命並持續回血，周圍敵人暈眩'}]},
  rita:{job:'火砲工匠',title:'拆鐘的手',stars:{輸出:3,生存:2,難度:2},range:8,rate:.85,kind:'bomb',hp:1,atk:1.1,desc:'王國火砲工坊的學徒，父親是十年前失蹤的總工匠。炸彈會讓地面燃燒，還能埋地雷、架砲塔。隊伍裡有她：陷阱自動拆除、寶箱多拆出材料，斷掉的橋也只有她蓋得起來。',wnoun:'戰鎚',
    sk:[{n:'火藥桶',ic:'keg',cd:6,d:'投出火藥桶，大範圍爆炸並擊退'},{n:'自動砲塔',ic:'turret',cd:14,d:'架設 9 秒自動射擊的砲塔'},{n:'撼地鎚',ic:'slam',cd:8,d:'重鎚砸地，震暈周圍敵人'}]}
};
const LOOKS={
  ivy:{skin:0xf6d6bd,hair:0x6b3f27,eye:0x2f5a9a,outfit:0x7d97ad,trim:0xe0c27c,pants:0x3a4050,boots:0x5a3a22,style:'bob',weapon:'sword'},
  roan:{skin:0xecc9a8,hair:0x2a2830,eye:0x2c6a3c,outfit:0x4a6b3e,trim:0xc7a067,pants:0x4a3a2a,boots:0x3a2a1a,style:'messy',weapon:'bow',scarf:0x3f8a52},
  sera:{skin:0xf8e2d2,hair:0xe8e2da,eye:0x8b4f6e,outfit:0x6b3346,trim:0xd9b46c,pants:0x4a2434,boots:0x3a2020,style:'long',weapon:'staff',skirt:1},
  rita:{skin:0xf3cfb0,hair:0xd4672f,eye:0x2f8b84,outfit:0x7b5a3c,trim:0xe3b04d,pants:0x4a3a2a,boots:0x2a2018,style:'pony',weapon:'hammer'},
  oren:{skin:0xe6c2a2,hair:0xe8e8e2,eye:0x333333,outfit:0x4c4036,trim:0xb89a5a,pants:0x3a3028,boots:0x2a2018,style:'elder',weapon:'none',skirt:1},
  smith:{skin:0xd8a880,hair:0x3a2418,eye:0x222222,outfit:0x6a4a3a,trim:0x8a8a84,pants:0x3a3028,boots:0x2a2018,style:'bald',weapon:'hammer',apron:1},
  vill:{skin:0xf0c8a8,hair:0x8a5a3a,eye:0x333333,outfit:0xc89a5a,trim:0xefe0b0,pants:0x5a4a3a,boots:0x3a2a20,style:'bob',weapon:'none'},
  merchant:{skin:0xf0c8a8,hair:0x5a3a28,eye:0x3a5a3a,outfit:0x3a7a5a,trim:0xf0c35a,pants:0x3a3028,boots:0x2a2018,style:'long',weapon:'none',skirt:1},
  knight:{skin:0x9a8f86,hair:0x6a7480,eye:0xffcc4a,outfit:0x5a6a7a,trim:0xb8452c,pants:0x3a3a44,boots:0x2a2a30,style:'helm',weapon:'sword'},
  xbow:{skin:0x8a7f76,hair:0x5b5560,eye:0xffcc4a,outfit:0x6a2a2a,trim:0x3a2a2a,pants:0x3a2a2a,boots:0x2a1d1a,style:'helm',weapon:'bow'},
  icelord:{skin:0xb8c8d8,hair:0xdfeaff,eye:0x6ad0ff,outfit:0x6a8aa8,trim:0xdfeaff,pants:0x3a4a5a,boots:0x2a3440,style:'helm',weapon:'bighammer',horns:1,cape:0x2a4a6a},
  admiral:{skin:0x8a7a6a,hair:0x1a1a1a,eye:0xffa040,outfit:0x1a1a2a,trim:0xf0c35a,pants:0x2a2a2a,boots:0x140a0a,style:'helm',weapon:'axe',cape:0x101018},
  emberking:{skin:0x2a1c1c,hair:0x3a3440,eye:0xffb03a,outfit:0x5a1010,trim:0xf0c35a,pants:0x2a1212,boots:0x140a0a,style:'helm',weapon:'bighammer',horns:1,cape:0x8a1a10,crown:1},
  raider:{skin:0x8a7f76,hair:0x5b5560,eye:0xffcc4a,outfit:0x8c2f25,trim:0x3a2a2a,pants:0x3a2a2a,boots:0x2a1d1a,style:'helm',weapon:'axe'},
  general:{skin:0x2a1c1c,hair:0x3a3440,eye:0xff5a32,outfit:0x3a1716,trim:0xb8452c,pants:0x2a1212,boots:0x140a0a,style:'helm',weapon:'bighammer',horns:1,cape:0x5a1414}
};
const RAR=[{n:'普通',c:'#d8d8d0',m:1},{n:'精良',c:'#6ee08a',m:1.25},{n:'稀有',c:'#5aa8ff',m:1.55},{n:'史詩',c:'#c77dff',m:1.95},{n:'傳說',c:'#ff9a3a',m:2.5}];
const expLv=zi=>zi<=5?2+zi*3.8:21+(zi-5)*2;
const PREF=['生鏽的','精鋼','霧銀','赤燼','暮鐘'];
const ZONES={
  forest:{name:'霧林修道院',idx:0,ground:'dgrass',fog:0x30402f,bg:0x30402f,sun:0xffd8a0,sunI:.95,hemi:[0xbad0a0,0x3a3020,.6],enemies:['imp','wolf','imp'],m:1,boss:'wolfking',props:'forest'},
  mine:{name:'聖奧蘭坑道',idx:1,ground:'mine',fog:0x221d34,bg:0x221d34,sun:0xc8b8ff,sunI:.7,hemi:[0x8a7ac0,0x2a2030,.6],enemies:['imp','golemling','raider'],m:2.3,boss:'golem',props:'mine'},
  gate:{name:'隆瑟瓦隘口',idx:2,ground:'ash',fog:0x3a1812,bg:0x3a1812,sun:0xff9a6a,sunI:.9,hemi:[0xff9a7a,0x3a1a12,.55],enemies:['raider','wolf','raider','golemling'],m:4.6,boss:'general',props:'gate'},
  ice:{name:'白湖',idx:3,ground:'ice',fog:0x8aa0b8,bg:0x8aa0b8,sun:0xe8f0ff,sunI:.85,hemi:[0xdfeaff,0x5a6a80,.65],enemies:['knight','wolf','xbow'],m:7,boss:'icelord'},
  harbor:{name:'卡萊灣碼頭',idx:4,ground:'sand',fog:0x3a3a4a,bg:0x3a3a4a,sun:0xffc890,sunI:.85,hemi:[0xc0c8e0,0x4a3a2a,.6],enemies:['raider','xbow','knight'],m:10,boss:'admiral'},
  outskirts:{name:'暮鐘近郊',idx:0,style:'forest',ground:'grass',fog:0x3a4a3a,bg:0x3a4a3a,sun:0xffe0b0,sunI:1,hemi:[0xd0e0b0,0x3a3020,.65],enemies:['imp','wolf'],m:.7,mat:'wood'},
  quarry:{name:'灰岩丘陵',idx:1,style:'quarry',ground:'dgrass',fog:0x4a4038,bg:0x4a4038,sun:0xffd8a0,sunI:.95,hemi:[0xd0c8b0,0x3a3028,.6],enemies:['wolf','raider','imp'],m:1.7,mat:'stone'},
  oldmine:{name:'舊礦坑',idx:2,style:'mine',ground:'mine',fog:0x221d34,bg:0x221d34,sun:0xc8b8ff,sunI:.7,hemi:[0x8a7ac0,0x2a2030,.6],enemies:['golemling','imp','raider'],m:2.8,mat:'iron'},
  citadel:{name:'王都北牆',idx:5,ground:'cobble',fog:0x2a1414,bg:0x2a1414,sun:0xff8a5a,sunI:.85,hemi:[0xff9a7a,0x2a1010,.55],enemies:['knight','xbow','golemling','raider'],m:14,boss:'emberking'}
};
const BOUNTY=[
  {zone:'forest',boss:'wolfking',vol:'卷一',title:'霧林之誓',name:'北海狼王 芬里斯',short:'狼王芬里斯',reward:180,lv:2,diff:1,col:'#ff7a3a',relic:'第一截鐘舌',desc:'北方的劫掠者乘龍頭長船而來，燒毀了霧林修道院。他們的首領騎著一頭鬃毛燃火的巨狼，第一截鐘舌就掛在牠的脖子上。狼王會猛衝、召喚狼群、在地上留下火焰。'},
  {zone:'mine',boss:'golem',vol:'卷二',title:'坑道與城牆',name:'攻城魔像「破城者」',short:'破城者',reward:420,lv:5,diff:2,col:'#9a7aff',relic:'第二截鐘舌',desc:'聖奧蘭城被赤燼軍圍困一百八十天。敵人在城牆下挖掘坑道，坑道深處，一具以火藥與結晶驅動的攻城魔像，正等著把城牆從底下炸塌。'},
  {zone:'gate',boss:'general',vol:'卷三',title:'隘口的號角',name:'赤燼將軍',short:'赤燼將軍',reward:900,lv:9,diff:3,col:'#ff4a2a',relic:'最後一截鐘舌',desc:'隆瑟瓦隘口——三百年前十二聖騎士戰死的地方。戴角盔的將軍守在這裡，手裡握著一把工匠的撼城鎚。最後一截鐘舌就在他身上。'},
  {zone:'ice',boss:'icelord',vol:'卷四',title:'冰湖之戰',name:'鐵騎團長 霜鬃',short:'霜鬃',reward:1500,lv:13,diff:3,col:'#6ad0ff',relic:'刻著聖騎士紋章的劍',desc:'赤燼鐵騎團在結冰的白湖上集結。團長「霜鬃」全身重甲，會舉槍衝鋒、把冰面砸出裂縫。注意地上的藍色冰裂，弩手會從遠處放冷箭。'},
  {zone:'harbor',boss:'admiral',vol:'卷五',title:'狂風與火船',name:'黑帆提督',short:'黑帆提督',reward:2400,lv:17,diff:3,col:'#ffa040',relic:'黑帆提督的海圖',desc:'黑帆艦隊的登陸部隊攻上了卡萊灣碼頭。提督會呼叫艦砲齊射，整片碼頭都會落下砲彈；他的弩手射穿過三座城的城門。'},
  {zone:'citadel',boss:'emberking',vol:'卷六',title:'最後的城牆',name:'赤燼王 羅德蘭',short:'赤燼王',reward:4000,lv:21,diff:3,col:'#ff3a1a',relic:'羅德蘭的象牙號角',desc:'赤燼王從北牆一扇沒關上的小門攻進了王都。他會揮動巨鎚、召喚火焰與巨砲轟擊。這是最後一戰。'}
];
const CARDS=[
  {vol:'卷　一',title:'霧林之誓',date:'暮曆一四二八年・霜月',text:'霧林修道院的鐘樓燒了三天三夜。\n倖存的修士說，劫掠者乘著龍頭長船而來，\n領頭的人騎著一頭燃燒的狼。'},
  {vol:'卷　二',title:'坑道與城牆',date:'暮曆一四二九年・春',text:'聖奧蘭城被圍的第一百八十天，城裡的人吃光了最後一匹馬。\n城外，赤燼軍的工兵日夜挖掘，要從地底炸開城牆。\n城牆上有人說，他們聽見了鐘聲。'},
  {vol:'卷　三',title:'隘口的號角',date:'暮曆一四二九年・夏',text:'隆瑟瓦。\n三百年前，聖騎士羅蘭在這裡拒絕吹響號角，直到最後一刻。\n三百年後，有人在同一個隘口，等著他們。'},
  {vol:'卷　四',title:'冰湖之戰',date:'暮曆一四二九年・冬',text:'聖鳴重新響起後的第一場雪，赤燼王的鐵騎團越過了北境。\n他們選擇在結冰的白湖上決戰——\n重甲騎士相信，冰會撐住他們。'},
  {vol:'卷　五',title:'狂風與火船',date:'暮曆一四三○年・夏',text:'一百三十艘黑帆戰艦，排成新月形，駛向卡萊灣。\n王國沒有艦隊。\n芮塔說：那就讓他們的船，燒給他們看。'},
  {vol:'卷　六',title:'最後的城牆',date:'暮曆一四三○年・秋',text:'王都的三重城牆屹立了三百年。\n赤燼王帶來一門能把石彈射過半座城的巨砲。\n而北牆上有一扇小門，那天夜裡，沒有人記得把它關上。'}
];
const EN={
  mimic:{name:'擬態寶箱',hp:500,atk:36,spd:4.2,rng:1.8,xp:45,gold:40,r:.8},
  knight:{name:'赤燼鐵騎',hp:420,atk:30,spd:2.7,rng:1.9,xp:30,gold:10,r:.7},
  xbow:{name:'赤燼弩手',hp:180,atk:24,spd:3,rng:8,xp:20,gold:7,r:.6,ranged:1},
  icelord:{name:'鐵騎團長 霜鬃',hp:30000,atk:120,spd:3.4,rng:3.6,xp:2600,gold:0,r:2.2,boss:1,ab:['charge','ice','slam','summon','charge','nova']},
  admiral:{name:'黑帆提督',hp:46000,atk:150,spd:3.2,rng:3.6,xp:4200,gold:0,r:2.2,boss:1,ab:['cannon','slam','summon','charge','cannon','nova']},
  emberking:{name:'赤燼王 羅德蘭',hp:70000,atk:185,spd:3.3,rng:4,xp:7000,gold:0,r:2.6,boss:1,ab:['slam','fire','cannon','charge','nova','summon','slam']},
  imp:{name:'灰燼小鬼',hp:95,atk:12,spd:3.3,rng:1.3,xp:9,gold:3,r:.5},
  wolf:{name:'燼狼',hp:150,atk:16,spd:5,rng:1.7,xp:13,gold:4,r:.7},
  raider:{name:'赤燼掠奪兵',hp:230,atk:22,spd:3.1,rng:1.8,xp:18,gold:6,r:.6},
  golemling:{name:'結晶傀儡',hp:420,atk:30,spd:2.2,rng:2,xp:26,gold:9,r:.9},
  wolfking:{name:'北海狼王 芬里斯',hp:3400,atk:30,spd:4.6,rng:3,xp:220,gold:0,r:2,boss:1,ab:['charge','fire','summon','bite','charge']},
  golem:{name:'攻城魔像「破城者」',hp:9500,atk:55,spd:2.4,rng:3.6,xp:520,gold:0,r:2.6,boss:1,ab:['slam','nova','rocks','summon','slam']},
  general:{name:'赤燼將軍',hp:21000,atk:85,spd:3.1,rng:3.6,xp:1200,gold:0,r:2.2,boss:1,ab:['slam','charge','nova','fire','summon','slam']}
};

