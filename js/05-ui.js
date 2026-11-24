/* 面板、對話、商店、技能樹、建築、同伴、委託 */
/* ======================= UI: PANELS ======================= */
function panel(html){const p=$('#panel');p.innerHTML='<div class="pn">'+html+'</div>';p.hidden=false;input.x=input.z=0}
function closePanel(){$('#panel').hidden=true}
$('#panel').addEventListener('pointerdown',e=>{if(e.target.id==='panel')closePanel()});
let toastT;function toast(t,ms=2200){const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,ms)}
function banner(sm,big){const o=$('#ban');if(o)o.remove();const el=document.createElement('div');el.id='ban';el.innerHTML=(sm?`<small>${sm}</small>`:'')+`<div>${big}</div>`;$('#game').appendChild(el);setTimeout(()=>el.remove(),2500)}
let selB=0;
function bountyPanel(){selB=Math.min(S.done.length,BOUNTY.length-1);const draw=()=>{const b=BOUNTY[selB];const lock=selB>S.done.length||(selB===9&&!brOK());const done=S.done.includes(selB);
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>懸賞板</h2><div class="sub">完成懸賞可以拿到大量金幣與裝備，也會揭開暮鐘的秘密。</div><div class="tabs2" style="margin:0 0 8px">${[1,2,3].filter(pt=>pt===1||S.done.length>=(pt===2?6:19)).map(pt=>`<button class="tb ${partOf(selB)===pt?'on':''}" data-pt="${pt}">${['','第一部・洛塔林','第二部・十二武士','第三部・地心'][pt]}</button>`).join('')}</div><div class="wanted">${BOUNTY.map((bb,i)=>partOf(i)!==partOf(selB)?'':`<div class="wp ${i===selB?'sel':''} ${i>S.done.length||(i===9&&!brOK())?'lock':''} ${S.done.includes(i)?'done':''}" data-b="${i}"><img src="${makeWanted(bb,false).toDataURL()}" alt="${bb.name}"></div>`).join('')}</div>
  <div class="bd"><h3>${b.vol}・${b.title}</h3><div style="color:#ffb08a;font-weight:900">討伐目標：${b.name}</div><div><span class="stars">${'★'.repeat(b.diff)}${'☆'.repeat(3-b.diff)}</span>　地點：${ZONES[b.zone].name}　建議等級 ${b.lv}（你目前 ${S.lv}）</div><div style="margin-top:4px;color:#e8dcc0">${b.desc}</div></div>
  <div class="row">${lock?`<span style="color:#ff9a7a;font-weight:700">${selB===9&&S.done.length>=9?'多瑙河的橋斷了——打開地圖，點「多瑙河斷橋」請芮塔蓋橋':'先完成前一張懸賞'}</span>`:`<button class="btn red" id="pGo">${done?'再次討伐':'接受懸賞並出發'}</button>`}<span style="font-size:12px;color:#bba886">${S.lv<b.lv&&!lock?'等級不足時會比較吃力，可以先強化裝備':''}</span></div>`);
  $('#px').onclick=closePanel;document.querySelectorAll('[data-pt]').forEach(b=>b.onclick=()=>{const pt=+b.dataset.pt;selB=Math.min(pt===1?0:pt===2?6:19,S.done.length);SFX.tap();draw()});document.querySelectorAll('.wp').forEach(el=>el.onclick=()=>{selB=+el.dataset.b;SFX.tap();draw()});const go=$('#pGo');if(go)go.onclick=()=>{closePanel();goZone(selB)}};draw()}
let bagSel=null;
let bagTab='all';
function bagPanel(){$('#bagBtn').classList.remove('new');const st=playerStats();const slotN={weapon:'武器',armor:'防具',charm:'飾品'};const ord=['weapon','armor','charm'];
  const better=it=>itemScore(it)>itemScore(S.eq[it.slot]);
  const itHTML=(it,cls='',attr='')=>it?`<div class="it ${cls}" style="--rc:${RAR[it.rar].c}" ${attr}><img class="ic" src="${itemImg(it)}" alt=""><div class="nm">${it.name}</div>${it.up?`<div class="lv">+${it.up}</div>`:''}${attr&&better(it)?'<div class="bt2" title="比目前裝備好">▲</div>':''}</div>`:`<div class="it ${cls}" ${attr}><div class="ic" style="background:#222;box-shadow:none">—</div><div class="nm" style="color:#888">未裝備</div></div>`;
  const statLine=it=>{if(!it)return'';const m=1+.12*(it.up||0);return[it.atk?`攻擊 +${Math.round(it.atk*m)}`:'',it.hp?`生命 +${Math.round(it.hp*m)}`:'',it.crit?`暴擊 +${Math.round(it.crit*100)}%`:''].filter(Boolean).join('　')};
  const list=S.bag.filter(it=>bagTab==='all'||it.slot===bagTab).sort((a,b)=>(ord.indexOf(a.slot)-ord.indexOf(b.slot))||(b.rar-a.rar)||(itemScore(b)-itemScore(a)));
  const worse=S.bag.filter(it=>!better(it));const worseG=worse.reduce((a,it)=>a+salvage(it),0);
  let det='';if(bagSel){const it=S.bag.find(x=>x.id===bagSel);if(it){const cur=S.eq[it.slot];const diff=itemScore(it)-itemScore(cur);det=`<div class="det"><div class="nm" style="color:${RAR[it.rar].c}">【${RAR[it.rar].n}】${it.name}</div><div>${statLine(it)}</div>${it.wt&&WT[it.wt]?`<div style="color:#8fd0ff;font-size:12px">${WT[it.wt].d}</div>`:''}<div style="color:#bba886;font-size:12px">目前${slotN[it.slot]}：${cur?cur.name+'（'+statLine(cur)+'）':'無'}</div><div class="${diff>=0?'up':'dw'}" style="font-weight:700">${diff>=0?'▲ 比目前的好':'▼ 比目前的差'}</div><div class="row" style="margin-top:8px"><button class="btn" id="eqB">裝備</button><button class="btn dk" id="slB">賣出 +${salvage(it)} 金</button></div></div>`}}
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>${CH[S.cls].name}・${CLS[S.cls].job}</h2><dl class="stat"><dt>等級</dt><dd>${S.lv}</dd><dt>攻擊</dt><dd>${st.atk}</dd><dt>生命</dt><dd>${st.hp}</dd><dt>暴擊</dt><dd>${Math.round(st.crit*100)}%</dd></dl>
  <div class="slots" style="margin-top:12px">${ord.map(k=>itHTML(S.eq[k])).join('')}</div>
  <div class="tabs2">${[['all','全部'],['weapon','武器'],['armor','防具'],['charm','飾品']].map(([k,n])=>`<button class="tb ${bagTab===k?'on':''}" data-tb="${k}">${n} ${k==='all'?S.bag.length+'/40':S.bag.filter(i=>i.slot===k).length}</button>`).join('')}</div>
  <div class="bag">${list.length?list.map(it=>itHTML(it,it.id===bagSel?'sel':'',`data-i="${it.id}"`)).join(''):'<div style="grid-column:1/-1;color:#888;font-size:13px">這裡還沒有裝備。打倒敵人、打開寶箱都會掉落裝備。</div>'}</div>${det}
  <div class="row">${S.bag.length?'<button class="btn" id="autoEq">一鍵換上最強</button>':''}${worse.length?`<button class="btn dk" id="sellW">賣掉 ${worse.length} 件較差的 +${worseG} 金</button>`:''}<button class="btn dk" id="chg">更換英雄</button></div>
  <div class="sub" style="margin:8px 0 0">${(S.reg||[]).length||S.done.length>=6?`</div><div class="tlab">王者之裝 ${(S.reg||[]).length} / 12${S.crown?'・聖槍':''}</div><div class="regs">${P2B.slice(0,12).map((b,i)=>`<div class="rg ${(S.reg||[]).includes(i)?'':'no'}" title="${b[5]}"><img src="${itemIcon(['armor','armor','armor','armor','sword','armor','horn','armor','ring','amulet','amulet','armor'][i],4,4)}" alt=""><span>${b[5].replace(/之.*/,'')}</span></div>`).join('')}</div><div class="sub" style="margin:4px 0 0">每件：攻擊 +4%、生命 +5%。集滿 12 件：暴擊 +10%。`:''}綠色 ▲ 代表比你身上的好。賣裝備換來的金幣，可以拿去建設城鎮、強化裝備。</div>`);
  $('#px').onclick=closePanel;document.querySelectorAll('[data-tb]').forEach(b=>b.onclick=()=>{bagTab=b.dataset.tb;SFX.tap();bagPanel()});
  document.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{bagSel=el.dataset.i;SFX.tap();bagPanel()});
  const eq=$('#eqB');if(eq)eq.onclick=()=>{const i=S.bag.findIndex(x=>x.id===bagSel);const it=S.bag[i];const cur=S.eq[it.slot];S.eq[it.slot]=it;S.bag.splice(i,1);if(cur)S.bag.push(cur);bagSel=null;refreshStats();hudStats();save();SFX.loot();bagPanel()};
  const sl=$('#slB');if(sl)sl.onclick=()=>{const i=S.bag.findIndex(x=>x.id===bagSel);S.gold+=salvage(S.bag[i]);S.bag.splice(i,1);bagSel=null;SFX.coin();save();hudStats();bagPanel()};
  const sw=$('#sellW');if(sw)sw.onclick=()=>{S.gold+=worseG;S.bag=S.bag.filter(it=>better(it));bagSel=null;SFX.coin();save();hudStats();toast(`賣出 ${worse.length} 件，獲得 ${worseG} 金幣`);bagPanel()};
  const ae=$('#autoEq');if(ae)ae.onclick=()=>{for(const k of ord){let best=S.eq[k];for(const it of S.bag)if(it.slot===k&&itemScore(it)>itemScore(best))best=it;if(best&&best!==S.eq[k]){const cur=S.eq[k];S.bag=S.bag.filter(x=>x!==best);if(cur)S.bag.push(cur);S.eq[k]=best}}refreshStats();hudStats();save();SFX.loot();bagPanel()};
  $('#chg').onclick=()=>{if(mode!=='town'){toast('回到城鎮才能更換英雄');return}closePanel();openSelect(true)}}
$('#bagBtn').addEventListener('click',()=>{SFX.tap();bagSel=null;bagPanel()});$('#treeBtn').addEventListener('click',()=>{SFX.tap();treePanel()});$('#chrBtn').addEventListener('click',()=>{SFX.tap();chronPanel()});$('#mapBtn').addEventListener('click',()=>{SFX.tap();mapPanel()});$('#homeBtn').addEventListener('click',()=>{SFX.tap();if(mode!=='zone')return;panel(`<h2>回到暮鐘鎮？</h2><div class="sub">這次討伐的進度不會保留，但已經撿到的金幣和裝備都會帶回去。</div><div class="row"><button class="btn dk" id="hN">繼續作戰</button><button class="btn" id="hY">回暮鐘鎮</button></div>`);$('#hN').onclick=closePanel;$('#hY').onclick=()=>{closePanel();goTown()}});
$('#mm').addEventListener('click',()=>{$('#mm').classList.toggle('big');SFX.tap()});
$('#muteBtn').addEventListener('click',()=>{S.mute=!S.mute;save();$('#muteBtn').style.opacity=S.mute?.4:1});
function smithPanel(){const slotN={weapon:'武器',armor:'防具',charm:'飾品'};const cost=it=>Math.round(40*Math.pow(1.55,it.up||0)*(1+it.rar*.5)*(1-.05*(bl('smith')-1)));const cap=4+2*bl('smith');
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>鐵匠 布蘭</h2><div class="sub">「把裝備拿來，我幫你敲得更硬。每強化一級，數值 +12%。」</div>
  <div class="slots">${['weapon','armor','charm'].map(k=>{const it=S.eq[k];if(!it)return`<div class="it"><div class="ic" style="background:#222;box-shadow:none">—</div><div class="nm" style="color:#888">沒有${slotN[k]}</div></div>`;const c=cost(it),max=(it.up||0)>=cap;return`<div class="it" style="--rc:${RAR[it.rar].c}"><img class="ic" src="${itemImg(it)}" alt=""><div class="nm">${it.name}</div><div class="lv">+${it.up||0}</div><button class="btn" style="margin-top:6px;padding:6px 8px;font-size:12px;width:100%" data-up="${k}" ${max||S.gold<c?'disabled':''}>${max?'已滿':'強化 '+c+'金'}</button></div>`}).join('')}</div>
  <div class="sub" style="margin-top:12px">目前金幣：${S.gold}。強化上限 +${cap}，在建築師哈特那裡升級鐵匠鋪可以提高。</div>`);
  $('#px').onclick=closePanel;document.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const it=S.eq[b.dataset.up];const c=cost(it);if(S.gold<c)return;S.gold-=c;it.up=(it.up||0)+1;SFX.lvl();refreshStats();hudStats();save();vPillar(P.pos,0xffb04a,1,4,.6);PS.emit({x:6.6,y:1,z:.6},20,0xffb04a,4,.5,3,8,.3);smithPanel()})}
function interact(n){if(n.act==='temple'){if(!S.seen.temple){S.seen.temple=1;save();say(STORY.temple,templePanel)}else templePanel();return}if(n.act==='map'){mapPanel();return}if(n.act==='quest'){ensureQuests();questPanel(n.g);return}if(n.act==='build'){buildPanel();return}if(n.act==='tavern'){matePanel();return}if(n.act==='shop')shopPanel();else if(n.act==='bounty')bountyPanel();else if(n.act==='smith')smithPanel();else if(n.act==='talk'){if(!S.intro)say(STORY.intro2,()=>{S.intro=true;save();toast('去左邊的懸賞板看看吧！',2600);W.npcs.forEach(n=>{if(n.tag){n.tag.remove();n.tag=null}})});else say([['oren',['聖鳴沉默的每一夜，赤燼的旗幟就往南推一里。','鐘舌一共三截。你們已經取回 '+S.done.length+' 截了。','鐵匠布蘭的手藝不錯，把裝備交給他強化吧。'][(Math.random()*3)|0],'calm']])}
  else if(n.act==='mate'){const id=W.npcs.find(x=>x===n).look;const L={ivy:['要出發了嗎？我會守好鎮子，你只管往前。','被圍住的時候別硬撐，翻滾出去再打。'],roan:['林子裡的狼群會繞到你背後。','祖父在大戰裡活下來，靠的不是勇氣，是比敵人多射一箭。'],sera:['我又聽見那個鐘聲了……從北方。','受傷了就回來，我會為你唱歌。'],rita:['帶我出門的話，地上的尖刺陷阱我順手拆掉，寶箱也能多拆出材料。','鐵匠布蘭是我爸的老朋友，強化找他準沒錯。','商人瑪蒂那裡有迴力鏢，扔出去還會飛回來，超好玩！']}[id];say([[id,L[(Math.random()*L.length)|0],'smile']])}
  else say([['nar',['村民：「聽說北方人的長船，船頭都刻著龍。」','村民：「聖奧蘭城已經被圍了快半年……」','村民：「老人說，聖鳴原本有十二個音，一個音是一位聖騎士。」'][(Math.random()*3)|0]]])}

/* ======================= DIALOGUE ======================= */
let D=null;
function say(lines,done){D={lines,i:0,done,typing:null,full:''};$('#dlg').hidden=false;input.x=input.z=0;$('#pL').classList.add('dim');$('#pR').classList.add('dim');showLine()}
function showLine(){const [who,text,expr]=D.lines[D.i];const box=$('#dB');box.className='box'+(who==='nar'?' nar':'');
  if(who!=='nar'){const right=['oren','gen','gren','king'].includes(who);const pc=right?$('#pR'):$('#pL'),ot=right?$('#pL'):$('#pR');drawPortrait(pc,who,expr||'calm');pc.classList.remove('dim');ot.classList.add('dim');box.classList.toggle('r',right);$('#dW').textContent=CH[who].name}else{$('#pL').classList.add('dim');$('#pR').classList.add('dim')}
  let n=0;$('#dT').textContent='';clearInterval(D.typing);D.full=text;D.typing=setInterval(()=>{n++;$('#dT').textContent=text.slice(0,n);if(n%3===0&&who!=='nar')tone(who==='gen'?160:520+((n*37)%120),.03,'square',.012);if(n>=text.length){clearInterval(D.typing);D.typing=null}},24)}
function dlgNext(){if(!D)return;if(D.typing){clearInterval(D.typing);D.typing=null;$('#dT').textContent=D.full;return}D.i++;if(D.i>=D.lines.length)endSay();else showLine()}
function endSay(){if(!D)return;clearInterval(D.typing);const d=D.done;D=null;$('#dlg').hidden=true;if(d)d()}
$('#dlg').addEventListener('click',e=>{if(e.target.id==='dS')return;dlgNext()});$('#dS').addEventListener('click',e=>{e.stopPropagation();endSay()});
const STORY={
  intro1:[['nar','《暮鐘戰記》・卷首'],['nar','暮曆一四二八年，洛塔林王國。\n北方群山的另一邊，赤燼王的戰鼓已經響了一整個夏天。'],['nar','三百年前，大帝夏洛曼的後衛軍在隆瑟瓦隘口遭到伏擊。\n十二聖騎士全數戰死，連同他們沒有吹響的號角。'],['nar','大帝把十二把斷劍熔成一口巨鐘，掛在王都，取名「聖鳴」。\n只要聖鳴響起，北方的敵人就不敢越過群山。'],['nar','直到這個秋天。\n鐘舌被人折成三截，帶往北方。王都的鐘，啞了。'],['nar','暮鐘鎮，王國最南方的邊境小鎮。一個月前，劫掠者把這裡燒成了廢墟。\n如今只剩一座斷了頂的鐘樓，和幾頂帳篷。'],['nar','史官後來寫道：\n挺身而出的是四個年輕人，他們之中沒有一個是貴族。']],
  intro2:[['oren','你們來了。我是歐倫，聖鐘騎士團最後一個還拿得動劍的老頭。','calm'],['oren','三截鐘舌在三個人手上：劫掠霧林的北海狼王、圍攻聖奧蘭的攻城魔像，還有守著隆瑟瓦隘口的赤燼將軍。','calm'],['ivy','國王呢？王國的騎士呢？','angry'],['oren','國王病了，貴族們忙著把金子運往南方。王國現在需要的不是一支軍隊……是一個讓人願意再相信一次的故事。','sad'],['sera','……我又聽見了。那口鐘在叫我們的名字。','worried'],['roan','我祖父是長弓手。他說：一千個農夫拉滿弓，也能讓騎士下馬。','calm'],['rita','攻城魔像就交給我，我會讓它見識什麼叫真正的火藥。','smile'],['oren','鎮子燒了，可是人還在。先到鎮外的近郊看看——那裡有木材，也有人需要幫忙。','calm'],['oren','右上角的「地圖」畫著整個王國。懸賞令貼在告示板上，準備好了就從北門出發。','calm']],
  z3:[['roan','冰層很厚……可是撐不住穿全身鎧甲的騎士。','calm'],['ivy','把他們引到湖心。我們輕裝，他們不是。','angry']],
  b3:[['nar','湖心的冰面上，鐵騎團長「霜鬃」拄著巨鎚等著。他的鎧甲結滿了冰，像一座會走路的城堡。'],['sera','他身上……有聖騎士的氣息。','worried']],
  ph3:[['nar','冰面開始崩裂。霜鬃怒吼著，把巨鎚砸進冰層。']],
  post3:[['nar','冰面在霜鬃腳下裂開，鐵騎團長連同他的鎧甲沉入白湖。'],['ivy','他留下的劍……劍柄上刻著十二聖騎士的紋章。','surprised'],['sera','這把劍在說話。它說：「第十三個人回來了。」','worried'],['roan','第十三個？十二聖騎士……不是只有十二個人嗎？','calm'],['nar','史官記下：白湖之役，鐵騎團全軍覆沒。重甲沒有保護他們，反而把他們拖進了湖底。']],
  z4:[['rita','風向對了。只要把火船放進他們的新月陣，整支艦隊就會自己亂掉。','smile'],['ivy','先清掉碼頭上的登陸部隊，再去找提督。','calm']],
  b4:[['nar','燃燒的旗艦撞上了碼頭，一個披著黑色斗篷的人跳了下來。'],['roan','黑帆提督……小心他的艦砲，整片碼頭都在射程裡。','angry']],
  ph4:[['nar','暴風雨來了。黑帆提督大笑：「風不是你們的，是我的！」']],
  post4:[['nar','火船衝進新月陣，黑帆艦隊在暴風中四散。卡萊灣的夜空被照成了白晝。'],['rita','提督的海圖上……畫著王都的北牆，還有一扇小門。','surprised'],['ivy','那是早就廢棄的北門小徑。如果沒人守……','worried'],['sera','赤燼王要親自來了。','calm'],['nar','史官記下：黑帆艦隊出航一百三十艘，回到北方的不到一半。打敗它的，一半是火，一半是風。']],
  z5:[['ivy','城門守住了，可是北邊那扇小門……開著。','angry'],['rita','巨砲又在裝填了，每一發都能打掉一段城牆。','worried'],['sera','我聽見十二個聲音……還有第十三個，在火裡哭。','sad']],
  b5:[['king','三百年了。我在隆瑟瓦吹響號角，一遍又一遍，直到喉嚨流出血來。','calm'],['king','沒有人來。大帝來的時候，只看見我的屍體，和十二把斷劍。','angry'],['ivy','你是……第十三個聖騎士？','surprised'],['king','他們把我們的劍熔進鐘裡，說那是榮耀。那不是榮耀，是牢籠。今天，我要把這座城連同那口鐘，一起燒掉。','angry']],
  ph5:[['king','聽見了嗎？那是我的號角。三百年來，它只為我自己而響！','angry']],
  post5:[['nar','赤燼王跪倒在城牆的缺口前，身上的火焰一點一點熄滅。'],['roan','……這是你的號角吧。','calm'],['nar','洛安舉起那支象牙號角，用盡全力吹響。'],['nar','王都的聖鳴回應了。接著是十二聲——從北方的群山、從白湖、從卡萊灣、從隆瑟瓦——十二位聖騎士的回應。'],['king','……有人……回應了。','sad'],['sera','這一次，號角有人聽見了。','sad'],['nar','火焰熄滅的地方，只剩下一個疲倦的老騎士。他望著北方笑了笑，閉上了眼睛。'],['nar','《暮鐘戰記》第一部・完\n……但聖鳴響起的第十三聲，在大陸的另一端，喚醒了別的東西。']],
  ex0:[['ivy','這片林子的木頭，夠蓋好幾間房子了。','smile'],['rita','路上看到木頭堆、石頭堆就撿起來，回鎮上都用得到。','calm'],['roan','林子深處有煙……有人被困住了。','worried']],
  merch:[['nar','小鬼的營地裡，一輛翻倒的馬車旁，縮著一個年輕女人。'],['nar','「我是商人瑪蒂，商隊被困在這裡三天了……謝謝你們！」'],['nar','「暮鐘鎮？我跟你們回去。不過我的貨不多——等你們把通往各地的路打通，我就能進更多好東西。」']],
  z0:[['roan','修道院的鐘……他們連鐘都要燒。','angry'],['ivy','跟緊我。劫掠者喜歡從兩側包抄。','calm']],
  z1:[['rita','這些坑道是照著工兵手冊挖的……挖的人非常懂城牆。','worried'],['sera','城牆上的人在等我們。我們不能讓他們失望。','calm']],
  z2:[['ivy','這裡就是隆瑟瓦……聖騎士的墳墓。','sad'],['rita','我爸十年前跟著北征隊來過這裡，再也沒有回來。','sad'],['roan','那就替他把這條路走完。','calm']],
  b0:[['nar','焦黑的修道院前，巨狼從煙霧裡走了出來。牠背上的騎手早已斷氣，牠卻還在守著他。'],['ivy','鐘舌就掛在牠脖子上……準備迎戰！','angry']],
  b1:[['nar','坑道盡頭，一具三人高的魔像在成排的火藥桶之間站了起來。胸口的結晶，像心臟一樣跳動。'],['rita','那個設計……是工坊的手稿！誰把它造出來的？','surprised']],
  b2:[['gen','回去吧，洛塔林的孩子。聖鳴不是你們以為的那種鐘。','calm'],['ivy','你們燒了霧林修道院、圍了聖奧蘭，還敢說這種話？','angry'],['gen','國王的騎士在哪裡？十年前，我們在這個隘口吹了三天號角，援軍一個也沒來。','angry'],['rita','……那把鎚子……那是我爸的撼城鎚！','surprised']],
  ph0:[['nar','芬里斯仰天長嚎，鬃毛上的火焰竄成了一面旗幟。']],
  ph1:[['rita','胸口的結晶是火藥室！打那裡，它就會從裡面炸開！','angry']],
  ph2:[['gen','……還不夠！讓我看看，你們能不能承受隘口的重量！','angry']],
  post0:[['nar','狼王倒在修道院的廢墟前。牠的頸上，掛著第一截鐘舌。'],['sera','它在發熱……像是有心跳。','worried'],['roan','背面刻著字：「給第一個敲鐘的人——當你聽見它，你就不再是一個人。」','calm'],['ivy','北方人從不留俘虜。可是這頭狼……一直守著牠的騎手。','sad'],['nar','史官記下：霧林之役，四人，無一陣亡。\n王都的酒館裡，第一次有人唱起他們的名字。'],['nar','修道院的地窖裡，關著一個滿身灰塵的男人。'],['nar','「建築師哈特。劫掠者抓我來修他們的長船。」他看了看四人，「聽說暮鐘鎮燒了？帶我回去，我幫你們把它蓋回來。」']],
  post1:[['nar','破城者倒下的瞬間，坑道裡的火藥沒有爆炸——芮塔在最後一刻剪斷了引信。'],['rita','魔像的設計圖……署名是「葛倫」。是我爸。','surprised'],['rita','他還活著，而且……在替赤燼王造兵器？','sad'],['sera','城牆上的人在歡呼。聖奧蘭的圍，解了。','smile'],['ivy','不管你父親站在哪一邊，答案都在隆瑟瓦。','calm'],['nar','史官記下：聖奧蘭之圍第一百八十七天，城門打開。\n走在解圍軍最前面的是一個牧羊少女，她手裡沒有劍，只有一面旗。']],
  post2:[['gren','……芮塔。你長大了。','sad'],['rita','爸……為什麼？','surprised'],['gren','十年前，北征隊在這個隘口等了三天。我們吹了號角，一遍又一遍。援軍沒有來。','sad'],['gren','赤燼王找到我時，我只剩一口氣。他問我：你守護的王國，值得嗎？','calm'],['ivy','所以你把鐘舌交給了他。','angry'],['gren','不。我戴上這頂頭盔，是為了在北方阻止他。聖鳴不是牆，是鎖——三百年來它鎖住的，是十二聖騎士的靈魂。','calm'],['sera','……所以我聽見的不是鐘聲，是他們在呼救。','sad'],['gren','拿著最後一截鐘舌回王都去。在敲響它之前，先想清楚：你們要的是一道牆，還是一個自由的王國。','calm'],['nar','那天夜裡，四人帶著三截鐘舌回到王都。\n聖鳴重新響起的時候，北方的赤燼王，第一次露出了笑容。'],['nar','《暮鐘戰記》第一部・完\n第二部「赤燼王」，開始。']]
};
const CHRON={vol:[
  {t:'卷首・聖鳴',ok:()=>true,p:'三百年前，大帝夏洛曼的後衛軍在隆瑟瓦隘口遭到伏擊，十二聖騎士全數戰死。\n大帝把十二把斷劍熔成一口巨鐘，取名「聖鳴」。只要它響起，北方的敵人就不敢越過群山。\n暮曆一四二八年秋，聖鳴的鐘舌被折成三截，帶往北方。',h:'史實原型：查理曼大帝（742–814）與傳說中的「十二聖騎士」，出自中世紀法國的查理曼傳奇。'},
  {t:'卷一・霧林之誓',ok:()=>S.done.includes(0),hint:'完成懸賞「北海狼王 芬里斯」後解鎖',p:'北方的劫掠者乘龍頭長船而來，燒毀霧林修道院。四人在廢墟前擊倒了守著騎手屍體的狼王芬里斯，取回第一截鐘舌。\n王都的酒館裡，第一次有人唱起他們的名字。',h:'史實原型：793 年維京人劫掠英格蘭東北的林迪斯法恩修道院。這次襲擊通常被視為「維京時代」的開端。'},
  {t:'卷二・坑道與城牆',ok:()=>S.done.includes(1),hint:'完成懸賞「攻城魔像「破城者」」後解鎖',p:'聖奧蘭城被圍第一百八十天。赤燼軍在城牆下挖掘坑道，坑道深處藏著以火藥驅動的攻城魔像。\n芮塔在最後一刻剪斷引信；瑟拉舉著旗走在解圍軍最前面。魔像的設計圖上，署名是「葛倫」。',h:'史實原型：1428–1429 年英法百年戰爭中的「奧爾良之圍」。聖女貞德於 1429 年 5 月率軍解圍，成為戰爭的轉捩點。中世紀攻城時，挖掘坑道破壞城牆是常見戰術。'},
  {t:'卷三・隘口的號角',ok:()=>S.done.includes(2),hint:'完成懸賞「赤燼將軍」後解鎖',p:'隆瑟瓦隘口。十年前，北征隊在這裡吹了三天號角，援軍沒有來。\n將軍摘下頭盔，是芮塔的父親葛倫。他說：聖鳴不是牆，是鎖，鎖住的是十二聖騎士的靈魂。\n三截鐘舌回到王都。聖鳴重新響起的那一夜，赤燼王笑了。',h:'史實原型：778 年的隆塞斯瓦列斯山口戰役。史詩《羅蘭之歌》描寫聖騎士羅蘭直到最後一刻才吹響號角求援，後衛全軍覆沒。'},
  {t:'卷四・冰湖之戰',ok:()=>S.done.includes(3),hint:'完成懸賞「鐵騎團長 霜鬃」後解鎖',p:'聖鳴重響後的第一場雪，赤燼鐵騎團在結冰的白湖上與四人決戰。重甲沒有保護他們，反而讓冰面崩裂。霜鬃留下一把刻著十二聖騎士紋章的劍，劍說：第十三個人回來了。',h:'史實原型：1242 年的「冰湖戰役」。諾夫哥羅德的亞歷山大・涅夫斯基在結冰的楚德湖上擊敗利沃尼亞騎士團。騎士連人帶甲落入冰湖的情節，多半出自後世的傳說與電影。'},
  {t:'卷五・狂風與火船',ok:()=>S.done.includes(4),hint:'完成懸賞「黑帆提督」後解鎖',p:'一百三十艘黑帆戰艦以新月陣駛向卡萊灣。芮塔把燃燒的火船放進敵陣，暴風雨隨後趕到。提督的海圖上，畫著王都北牆一扇被遺忘的小門。',h:'史實原型：1588 年的西班牙無敵艦隊。英國人在加萊外海放出火船打散新月陣形，接著在格拉沃利訥海戰重創艦隊；返航途中又遭暴風雨，損失慘重。'},
  {t:'卷六・最後的城牆',ok:()=>S.done.includes(5),hint:'完成懸賞「赤燼王 羅德蘭」後解鎖',p:'赤燼王帶著巨砲來到王都的三重城牆前，從一扇沒關上的小門攻進城裡。他是三百年前在隆瑟瓦吹號角吹到最後一刻的第十三位聖騎士。洛安吹響了他的號角——這一次，有人回應。',h:'史實原型：1453 年君士坦丁堡陷落。鄂圖曼軍以巨砲轟擊狄奧多西城牆；據史家杜卡斯記載，城牆上的克爾克門未被關上，讓敵軍得以入城。'}],
 who:[
  {id:'ivy',ok:()=>true,p:'聖鐘騎士團最年輕的騎士。父母死於北方的劫掠，被騎士團收養。她相信騎士的劍不是為國王揮的，是為走在路上的每一個人。',h:'原型參考：中世紀的醫院騎士團等騎士修會，以保護朝聖者、照顧病人為誓言。'},
  {id:'roan',ok:()=>true,p:'獵戶之子，話少，眼睛比誰都利。祖父曾是長弓手，從一場以弓勝騎的大戰中活著回來。',h:'原型參考：英格蘭長弓手。1415 年的亞金科特戰役中，長弓手讓法國重裝騎士大敗。'},
  {id:'sera',ok:()=>true,p:'邊境村莊的牧羊少女，從小就聽得見別人聽不見的鐘聲。她不會用劍，但她走到哪裡，人們就願意跟到哪裡。',h:'原型參考：聖女貞德（約 1412–1431），出身東雷米村的農家少女，自述聽見神的聲音，帶領法軍解救奧爾良。'},
  {id:'rita',ok:()=>true,p:'王國火砲工坊的學徒，什麼都想拆開來看。父親葛倫是工坊的總工匠，十年前隨北征隊出發，再也沒有回來。',h:'原型參考：法國的比羅兄弟（Jean 與 Gaspard Bureau），15 世紀中葉改良攻城火砲，幫助法國在百年戰爭末期取勝。'},
  {id:'oren',ok:()=>true,p:'聖鐘騎士團的老團長，年輕時曾隨大軍遠征。他是王都裡少數還記得聖鳴原本聲音的人。',h:'原型參考：查理曼傳奇中的十二聖騎士，以及《羅蘭之歌》裡勸羅蘭吹響號角的戰友奧利維耶。'},
  {id:'king',ok:()=>S.done.includes(5),hint:'完成卷六後解鎖',p:'三百年前隆瑟瓦後衛軍的第十三位聖騎士。他吹號角吹到最後一刻，援軍沒有來。怨恨讓他化為赤燼，率領北方的大軍回來。',h:'角色原型：《羅蘭之歌》的羅蘭。他起初拒絕吹響號角求援，等到吹響時已太遲。本作反過來寫：吹了號角卻沒有人來的人，會變成什麼？'},
  {id:'gren',ok:()=>S.done.includes(2),hint:'完成卷三後解鎖',p:'王國火砲工坊的前總工匠，芮塔的父親。十年前在隆瑟瓦隘口等不到援軍，被赤燼王救起。他戴上角盔，是為了在北方阻止一場更大的災難。',h:'角色構想：《羅蘭之歌》裡的加納隆是出賣後衛軍的叛徒；葛倫的故事反過來問：被王國拋棄的人，算不算背叛？'}
]};

/* ======================= NEW WEAPONS / ITEMS / PANELS ======================= */
function throwBoomerang(tg,dmg){const m=new THREE.Group();for(const s of[-1,1]){const b=new THREE.Mesh(G.box(.55,.09,.16),tm(0xb07a3a));b.position.x=s*.22;b.rotation.y=s*.55;m.add(b)}const tip=new THREE.Mesh(G.box(.12,.1,.18),tm(0xe04a3a));m.add(tip);m.position.set(P.pos.x,1.1,P.pos.z);scene.add(m);const dir=new THREE.Vector3(tg.pos.x-P.pos.x,0,tg.pos.z-P.pos.z).normalize();PROJ.push({kind:'boom',mesh:m,dir,dmg,d:0,out:true,hit:new Set(),o:{}})}
function useTac(){if(!P||P.dead||mode!=='zone')return;const k=S.tac;if(!k||!(S.stock[k]>0)){toast('沒有戰術道具了，回城找商人瑪蒂購買');return}if(P.tacCd>0)return;S.stock[k]--;P.tacCd=1;save();const A=atkNow();
  if(k==='fire'){const tg=nearestEnemy(P.pos,12);const c=tg?tg.pos.clone():P.pos.clone().add(new THREE.Vector3(Math.sin(P.face)*5,0,Math.cos(P.face)*5));c.y=0;lob(c,A*2.5,3,0xff6a2a,.6,{big:1});setTimeout(()=>{if(mode!=='zone')return;const disk=new THREE.Mesh(DISKG,addM(0xff4a1a,.45));disk.rotation.x=-PI/2;disk.position.set(c.x,.06,c.z);disk.scale.setScalar(3);let acc=0;fx(disk,3,(f,k2,dt)=>{disk.material.opacity=.4*(1-k2)+.08*Math.sin(gt*20);if(Math.random()<.7)PS.emit({x:c.x+rand(-2.5,2.5),y:.2,z:c.z+rand(-2.5,2.5)},1,Math.random()<.5?0xff6a2a:0xffc04a,.8,.6,2,0,.2);acc+=dt;if(acc>.5){acc=0;for(const e of EN_LIST)if(!e.dead&&dist2(c,e.pos)<(3+e.r)**2)hitEnemy(e,A*.45,{col:0xff8a3a})}})},620)}
  if(k==='horn'&&S.done.length>=6)soulHorn();else if(k==='horn'){P.buff=10;tone(196,1.4,'sawtooth',.05);tone(294,1.2,'sawtooth',.035,0,.25);tone(392,1,'sawtooth',.025,0,.5);vRing(P.pos,0xf0c35a,.5,9,.9);vPillar(P.pos,0xf0c35a,1.4,6,.8);for(const e of EN_LIST)if(!e.dead&&!e.boss&&dist2(P.pos,e.pos)<64)e.stun=Math.max(e.stun,2);banner('','羅蘭號角')}
  if(k==='holy'){const h=Math.round(P.max*.3);P.hp=Math.min(P.max,P.hp+h);P.regen=6;P.inv=.5;dmgNum(P.pos,'+'+h,'heal');vPillar(P.pos,0x8ad8ff,1.2,6,.8);vRing(P.pos,0x8ad8ff,.5,4,.6);SFX.bell()}
  hudStats();hudSkills()}
function shopPanel(){const zi=Math.min(S.done.length,BOUNTY.length-1);const wp=['boomerang','spear','crossbow','axes'];const wPrice=Math.round(150*(1+zi*1.2));const bagCost=80*(S.potMax-2);
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>商人 瑪蒂</h2><div class="sub">「路通了，貨才進得來。」<br>已開通的商路：${ROUTE.slice(1,S.done.length+1).join('、')||'還沒有'}<br>金幣：<b style="color:var(--gold)">${S.gold}</b></div>
  <div class="tlab">戰術道具・出征時按右下角使用（鍵盤 R）</div><div class="shop">${Object.entries(TAC).map(([k,t])=>S.done.length<SHOPREQ[k]?lockRow(t.n,t.ik,null,SHOPREQ[k]):`<div class="si ${S.tac===k?'on':''}"><img src="${itemIcon(t.ik,null)}" alt=""><div><b>${t.n}</b> <span class="own">持有 ${S.stock[k]||0}</span><small>${t.d}</small><div class="row" style="margin-top:6px"><button class="btn" data-buy="${k}" ${S.gold<t.price?'disabled':''}>${t.price} 金</button><button class="btn dk" data-tac="${k}" ${S.tac===k?'disabled':''}>${S.tac===k?'使用中':'帶上它'}</button></div></div></div>`).join('')}
  <div class="si"><img src="${itemIcon('potion',null)}" alt=""><div><b>藥劑腰包</b> <span class="own">每次出征 ${S.potMax} 瓶回復藥</span><small>多帶一瓶回復藥，最多 6 瓶。</small><div class="row" style="margin-top:6px">${S.potMax<6?`<button class="btn" id="bPot" ${S.gold<bagCost?'disabled':''}>${bagCost} 金</button>`:'<span class="own">已達上限</span>'}</div></div></div></div>
  <div class="tlab">武器架・任何職業都能用（升級市集會提高品質）</div><div class="shop">${wp.map(w=>S.done.length<SHOPREQ[w]?lockRow(WT[w].n,WT[w].ik,1,SHOPREQ[w]):`<div class="si"><img src="${itemIcon(WT[w].ik,1)}" alt=""><div><b>${WT[w].n}</b><small>${WT[w].d}</small><div class="row" style="margin-top:6px"><button class="btn" data-wp="${w}" ${S.gold<wPrice?'disabled':''}>${wPrice} 金</button></div></div></div>`).join('')}</div>`);
  $('#px').onclick=closePanel;
  document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const k=b.dataset.buy;if(S.gold<TAC[k].price)return;S.gold-=TAC[k].price;S.stock[k]=(S.stock[k]||0)+1;SFX.coin();save();hudStats();hudSkills();shopPanel()});
  document.querySelectorAll('[data-tac]').forEach(b=>b.onclick=()=>{S.tac=b.dataset.tac;SFX.tap();save();setupSkillButtons();hudSkills();shopPanel()});
  const bp=$('#bPot');if(bp)bp.onclick=()=>{if(S.gold<bagCost)return;S.gold-=bagCost;S.potMax++;if(P)P.pots=S.potMax;SFX.coin();save();hudStats();hudSkills();shopPanel()};
  document.querySelectorAll('[data-wp]').forEach(b=>b.onclick=()=>{if(S.gold<wPrice)return;S.gold-=wPrice;const it=makeItem([0,1,1,2,2,3][bl('market')],zi,'weapon',b.dataset.wp);pickItem(it);save();hudStats();shopPanel();toast(`買下了 ${it.name}，打開背包裝備它`)})}
let chTab='vol';
function chronPanel(){const L=CHRON[chTab];panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>暮鐘戰記</h2><div class="sub">史官記下的每一場戰役，以及每一個走進戰記的人。</div><div class="row" style="margin:0 0 4px"><button class="btn ${chTab==='vol'?'':'dk'}" data-ct="vol" style="padding:6px 16px;font-size:13px">戰役</button><button class="btn ${chTab==='who'?'':'dk'}" data-ct="who" style="padding:6px 16px;font-size:13px">人物</button></div>
  ${L.map(e=>{const ok=e.ok();const t=chTab==='vol'?e.t:CH[e.id].name+(CLS[e.id]?'・'+CLS[e.id].job:e.id==='oren'?'・騎士團長':'');return ok?`<div class="lr">${chTab==='who'?`<canvas data-por="${e.id}" width="112" height="112"></canvas>`:''}<h3>${t}</h3><p>${e.p}</p></div>`:`<div class="lr lk"><h3>？？？</h3><p>${e.hint||''}</p></div>`}).join('')}`);
  $('#px').onclick=closePanel;document.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{chTab=b.dataset.ct;SFX.tap();chronPanel()});document.querySelectorAll('[data-por]').forEach(c=>drawPortrait(c,c.dataset.por,'calm',true))}
let CARD=null;
function showCard(bi,done){const c=CARDS[bi];const el=document.createElement('div');el.id='card';el.innerHTML=`<div><div class="v">${c.vol}</div><h1>${c.title}</h1><div class="d">${c.date}</div><div class="orn"></div><p>${c.text}</p><div class="tap">TAP TO CONTINUE</div></div>`;$('#game').appendChild(el);CARD=el;SFX.bell();el.addEventListener('click',()=>{el.remove();CARD=null;if(done)done()})}
function roseTex(){return TEX.rose||(TEX.rose=ctex(128,128,(x,w,h)=>{x.fillStyle='#1a1410';x.fillRect(0,0,w,h);const cs=['#4a6aff','#ff5a4a','#ffd04a','#6ad06a','#c86aff'];for(let r=3;r>0;r--){for(let i=0;i<12;i++){x.beginPath();x.moveTo(64,64);x.arc(64,64,r*20,i/12*TAU,(i+1)/12*TAU);x.closePath();x.fillStyle=cs[(i+r)%5];x.fill();x.lineWidth=3;x.strokeStyle='#1a1410';x.stroke()}}x.beginPath();x.arc(64,64,10,0,TAU);x.fillStyle='#fff0a0';x.fill()}))}

/* ======================= SKILL TREE (branching, unlock by prerequisite) ======================= */
const TREE=[
 {k:'sword',n:'劍術',d:'近身作戰：範圍斬擊、衝鋒、震地與吸血。',c:'#4a98ff',ic:'whirl',nodes:[
  {id:'whirl',tier:1,a:1,n:'旋風斬',cd:5,max:3,lv:2,d:'原地旋轉三圈，砍中周圍所有敵人。'},
  {id:'patk',tier:2,n:'鋒刃',max:5,lv:4,req:'whirl',d:r=>`攻擊 +${r*6}%`},
  {id:'charge',tier:2,a:1,n:'盾擊衝鋒',cd:7,max:3,lv:4,req:'whirl',d:'舉盾向前衝刺，撞飛並暈眩路上的敵人。'},
  {id:'slam',tier:3,a:1,n:'撼地鎚',cd:8,max:3,lv:7,req:'charge',d:'重擊地面，震暈周圍敵人。'},
  {id:'berserk',tier:4,n:'狂戰之心',max:3,lv:11,req:'slam',d:r=>`造成傷害的 ${r*3}% 轉為生命`}]},
 {k:'bow',n:'射術',d:'遠距射擊：貫穿、暴擊、箭雨與後躍連射。',c:'#5ac85a',ic:'pierce',nodes:[
  {id:'pierce',tier:1,a:1,n:'穿雲箭',cd:5,max:3,lv:2,d:'射出貫穿一整排敵人的巨箭。'},
  {id:'pcrit',tier:2,n:'鷹眼',max:5,lv:4,req:'pierce',d:r=>`暴擊率 +${r*3}%`},
  {id:'rain',tier:2,a:1,n:'箭雨',cd:8,max:3,lv:4,req:'pierce',d:'在目標區域降下持續的箭雨。'},
  {id:'leap',tier:3,a:1,n:'後躍連射',cd:7,max:3,lv:7,req:'rain',d:'向後跳開，扇形射出五支箭。'},
]},
 {k:'craft',n:'工藝',d:'芮塔的火藥與機關：會燃燒的火藥桶、地雷、砲塔，還有多拿材料的工匠之手。',c:'#ff8a3a',ic:'keg',nodes:[
  {id:'keg',tier:1,a:1,n:'火藥桶',cd:6,max:3,lv:2,d:'投出火藥桶，大範圍爆炸、擊退，並讓地面燃燒。'},
  {id:'mine',tier:2,a:1,n:'地雷陣',cd:10,max:3,lv:4,req:'keg',d:'在身邊埋下 3 顆地雷，敵人一靠近就爆炸燃燒（12 秒）。'},
  {id:'pmat',tier:2,n:'工匠之手',max:5,lv:4,req:'keg',d:r=>`採集與寶箱的材料 +${r*15}%`},
  {id:'turret',tier:3,a:1,n:'自動砲塔',cd:14,max:3,lv:7,req:'keg',d:'架設自動射擊的砲塔。'},
  {id:'forge',tier:4,n:'砲塔改良',max:3,lv:11,req:'turret',d:r=>`砲塔多撐 ${r*3} 秒、傷害 +${r*25}%`}]},
 {k:'arc',n:'秘法',d:'法術與聖歌：落雷、治療、流星與守護。',c:'#9a6aff',ic:'bolt',nodes:[
  {id:'bolt',tier:1,a:1,n:'暮光雷',cd:4,max:3,lv:2,d:'落雷擊中目標，並連鎖跳到附近敵人。'},
  {id:'php',tier:2,n:'堅毅',max:5,lv:4,req:'bolt',d:r=>`生命 +${r*8}%`},
  {id:'song',tier:2,a:1,n:'聖歌',cd:12,max:3,lv:4,req:'bolt',d:'回復 40% 生命並持續回血，周圍敵人暈眩。'},
  {id:'star',tier:3,a:1,n:'星落',cd:9,max:3,lv:7,req:'song',d:'召喚流星砸向目標，造成巨大範圍傷害。'},
  {id:'guard',tier:4,a:1,n:'鐘之守護',cd:16,max:3,lv:11,req:'star',d:'6 秒內受到傷害 -60%，並回復 30% 生命。'}]}
];
const NODE={};TREE.forEach(b=>b.nodes.forEach(n=>{n.br=b.k;NODE[n.id]=n}));
NODE.pspd={id:'pspd',n:'疾行',max:3,lv:3,d:r=>`移動速度 +${r*5}%`};
const rk=id=>(S&&S.tree&&S.tree[id])||0;
const skMult=id=>1+.25*(Math.max(1,rk(id))-1),cdMult=id=>1-.08*(Math.max(1,rk(id))-1);
const freePts=()=>Math.max(0,(S.lv-1)-Object.values(S.tree||{}).reduce((a,b)=>a+b,0));
const nodeOpen=n=>S.lv>=n.lv&&(!n.req||rk(n.req)>=1);
const canLearn=n=>nodeOpen(n)&&rk(n.id)<n.max&&freePts()>0;
const SKF={
 whirl(A){SFX.swing();P.lock=.45;let n=0;const iv=setInterval(()=>{if(!P||n>=3){clearInterval(iv);return}n++;vSlash(P.pos,P.face+n*2.1,0x9ad8ff,3.4,.25,2);vRing(P.pos,0x9ad8ff,.5,3.4,.3,.2,.7);for(const e of EN_LIST)if(!e.dead&&dist2(P.pos,e.pos)<(3.4+e.r)**2)hitEnemy(e,A*.9,{kb:2.5,col:0x9ad8ff})},120)},
 charge(A,tg,fwd){SFX.swing();P.lock=.3;P.inv=.35;const st=P.pos.clone();P.dash={dir:fwd.clone(),t:.26,spd:26};setTimeout(()=>{if(!P)return;vBeam(new THREE.Vector3(st.x,1,st.z),new THREE.Vector3(P.pos.x,1,P.pos.z),0xffe08a,.5,.3);for(const e of EN_LIST){if(e.dead)continue;const lx=e.pos.x-st.x,lz=e.pos.z-st.z;const al=lx*fwd.x+lz*fwd.z,pe=Math.abs(lx*fwd.z-lz*fwd.x);if(al>-1&&al<8.5&&pe<1.6+e.r)hitEnemy(e,A*2.6,{kb:5,stun:1.2,col:0xffe08a})}shake(.15,.15)},260)},
 guard(A){SFX.cast();SFX.bell();P.guard=6;P.hp=Math.min(P.max,P.hp+P.max*.3);dmgNum(P.pos,'+'+Math.round(P.max*.3),'heal');vPillar(P.pos,0xffe08a,1.6,5,.8);vRing(P.pos,0xffe08a,.5,5,.6);if(P.guardFx)scene.remove(P.guardFx);P.guardFx=guardDome()},
 pierce(A,tg){SFX.shoot();shoot('arrow',tg,A*4.2,{big:1,pierce:1,life:.9});vRing(P.pos,0xa8ff9a,.3,1.6,.3,1)},
 rain(A,tg,fwd){const c=tg?tg.pos.clone():P.pos.clone().addScaledVector(fwd,6);vRing(c,0x8fd0ff,3.6,3.6,1.6,.08,.6);let n=0;const iv=setInterval(()=>{if(n>=7||!P){clearInterval(iv);return}n++;for(let k=0;k<5;k++){const a=Math.random()*TAU,r=Math.random()*3.5;const p=new THREE.Vector3(c.x+Math.cos(a)*r,0,c.z+Math.sin(a)*r);vBeam(new THREE.Vector3(p.x+.6,5,p.z-.6),new THREE.Vector3(p.x,.1,p.z),0xcfe8ff,.05,.12);PS.emit({x:p.x,y:.2,z:p.z},2,0xcfe8ff,2,.2,1,5,.1)}for(const e of EN_LIST)if(!e.dead&&dist2(c,e.pos)<(3.6+e.r)**2)hitEnemy(e,A*.75,{col:0x8fd0ff});SFX.shoot()},200)},
 leap(A,tg,fwd){P.inv=.4;P.dash={dir:fwd.clone().multiplyScalar(-1),t:.22,spd:22};setTimeout(()=>{if(!P)return;for(let k=-2;k<=2;k++){const a=P.face+k*.22;shoot('arrow',null,A*1.5,{life:.7});PROJ[PROJ.length-1].dir.set(Math.sin(a),0,Math.cos(a))}SFX.shoot()},230)},
 bolt(A,tg,fwd,i){SFX.cast();const list=EN_LIST.filter(e=>!e.dead).sort((a,b)=>dist2(a.pos,P.pos)-dist2(b.pos,P.pos)).slice(0,4);if(!list.length){P.cd[i]=.5;return}let prev=new THREE.Vector3(P.pos.x,1.8,P.pos.z);list.forEach((e,k)=>{setTimeout(()=>{if(e.dead)return;const tp=new THREE.Vector3(e.pos.x,1,e.pos.z);vBolt(new THREE.Vector3(e.pos.x+.3,9,e.pos.z),tp,0xd8b0ff,.25);vBolt(prev,tp,0xb890ff,.2);prev=tp;vRing(e.pos,0xd8b0ff,.3,2,.3);flashLight(e.pos,0xb890ff,3,.15);hitEnemy(e,A*(2.6-k*.3),{stun:.4,col:0xd8b0ff});tone(1200-k*150,.1,'sawtooth',.03,.4)},k*110)})},
 star(A,tg,fwd){const c=tg?tg.pos.clone():P.pos.clone().addScaledVector(fwd,6);teleFriendly(c,3.8,.9);SFX.cast();const met=new THREE.Mesh(G.sph(.7,14,10),addM(0xffb05a,1));met.position.set(c.x+5,14,c.z-5);scene.add(met);fx(met,.9,(f,k)=>{met.position.set(c.x+5*(1-k),14*(1-k)+.5,c.z-5*(1-k));PS.emit(met.position,4,0xffb05a,1,.4,0,0,.3);if(k>=.98&&!f.done){f.done=1;explode(c,4,A*5.2,0xffa04a,{big:1,kb:4})}})},
 song(A){SFX.cast();SFX.bell();const h=Math.round(P.max*.4);P.hp=Math.min(P.max,P.hp+h);P.regen=5;dmgNum(P.pos,'+'+h,'heal');vPillar(P.pos,0x8fffb0,1.4,6,1);vRing(P.pos,0x8fffb0,.5,6,.8);PB.emit({x:P.pos.x,y:.5,z:P.pos.z},26,0x8fffb0,2,1.2,3,0,1.5);for(const e of EN_LIST)if(!e.dead&&!e.boss&&dist2(P.pos,e.pos)<36)e.stun=Math.max(e.stun,1.5)},
 keg(A,tg,fwd){const c=tg?tg.pos.clone():P.pos.clone().addScaledVector(fwd,6);lob(c,A*4.2,3.6,0xff6a2a,.7,{big:1,kb:4,burn:1})},
 mine(A){SFX.cast();const sc0=scene;const ms=[];for(let k=0;k<3;k++){const a=P.face+(k-1)*1.4;const p=new THREE.Vector3(P.pos.x+Math.sin(a)*2.4,0,P.pos.z+Math.cos(a)*2.4);const m=new THREE.Mesh(G.sph(.34,10,6),tm(0x3a3430));m.scale.y=.45;m.position.set(p.x,.1,p.z);const l=new THREE.Mesh(G.sph(.11,6,6),addM(0xff3a1a,1));l.position.y=.32;m.add(l);sc0.add(m);vRing(p,0xff8a3a,.2,1.6,.3);ms.push({m,p,l,on:1})}let t=0;const iv=setInterval(()=>{t+=.1;if(scene!==sc0||mode!=='zone'){clearInterval(iv);return}for(const o of ms){if(!o.on)continue;o.l.visible=((t*4)|0)%2===0;const near=EN_LIST.some(e=>!e.dead&&dist2(o.p,e.pos)<(1.7+e.r)**2);if(t>12||near){o.on=0;sc0.remove(o.m);if(near)explode(o.p,3,A*2.8,0xff6a2a,{big:1,kb:3,burn:1})}}if(!ms.some(o=>o.on))clearInterval(iv)},100)},
 turret(){SFX.cast();spawnTurret()},
 slam(A,tg,fwd){P.lock=.5;P.anim=.5;setTimeout(()=>{if(!P)return;const c=P.pos.clone().addScaledVector(fwd,1);explode(c,4.2,A*3,0xf0c35a,{big:1,kb:5,stun:1});vRing(c,0xf0c35a,1,6,.5,.1)},280)}
};
let treeTab=null;
function treePanel(){const pts=freePts();if(!treeTab)treeTab={ivy:'sword',roan:'bow',sera:'arc',rita:'craft'}[S.cls];const B=TREE.find(b=>b.k===treeTab);const spent=b=>b.nodes.reduce((a,n)=>a+rk(n.id),0);
  const nodeH=n=>{const r=rk(n.id),open=nodeOpen(n);const desc=typeof n.d==='function'?n.d(Math.max(r,1)):n.d;const slot=n.a&&r>0?S.slots.indexOf(n.id):-1;
    return`<div class="tn ${open?'':'lock'} ${r?'got':''}"><img src="${skIcon(n.id)}" alt=""><b>${n.n}</b><div class="pips">${'◆'.repeat(r)}${'◇'.repeat(n.max-r)}</div><small>${n.a?'<i class="tg a">主動</i>':'<i class="tg">被動</i>'}${desc}${n.a&&r>1?`<br><span style="color:#8fe0a0">傷害 +${(r-1)*25}%・冷卻 -${(r-1)*8}%</span>`:''}${open?'':`<br><span style="color:#ff9a7a">🔒 需要${n.req?'「'+NODE[n.req].n+'」Lv1、':''}角色 Lv${n.lv}</span>`}</small>
    <button class="btn" data-l="${n.id}" ${canLearn(n)?'':'disabled'}>${r>=n.max?'精通':r?'升級':'學習'}</button>${n.a&&r?`<div class="slotp">裝到 ${[0,1,2].map(s=>`<button class="sp ${slot===s?'on':''}" data-s="${n.id}" data-x="${s}" aria-label="技能欄 ${s+1}">${s+1}</button>`).join('')}</div>`:''}</div>`};
  const tiers=[1,2,3,4].map(t=>B.nodes.filter(n=>n.tier===t)).filter(ns=>ns.length);
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>技藝</h2><div class="sub">升一級得 1 點。先學會上一層，下一層才會打開。點數不夠學全部——選一條路專精，或兼修兩條。剩餘 <b style="color:var(--gold);font-size:17px">${pts}</b> 點。</div>
  <div class="btabs">${TREE.map(b=>`<button class="bt ${b.k===treeTab?'on':''}" data-b="${b.k}" style="--bc:${b.c}"><img src="${skIcon(b.ic)}" alt=""><span>${b.n}</span><small>已投入 ${spent(b)}</small></button>`).join('')}</div>
  <div class="sub" style="margin:10px 0 2px">${B.d}</div>
  <div class="tree">${tiers.map((ns,ti)=>`${ti?'<div class="tline"></div>':''}<div class="tier">第 ${ti+1} 層</div><div class="trow2">${ns.map(nodeH).join('')}</div>`).join('')}</div>
  <div class="tlab">通用天賦</div><div class="trow2">${nodeH(NODE.pspd)}</div>
  <div class="tlab">技能欄</div><div class="slotbar">${S.slots.map((id,s)=>`<div class="sb">${id?`<img src="${skIcon(id)}" alt="">`:'<i>空</i>'}<span>${s+1}・${id?NODE[id].n:'未裝備'}</span></div>`).join('')}</div>
  <div class="row"><button class="btn dk" id="rsT">重置所有技藝點</button></div>`);
  $('#px').onclick=closePanel;
  document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{treeTab=b.dataset.b;SFX.tap();treePanel()});
  document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{const n=NODE[b.dataset.l];if(!canLearn(n))return;S.tree[n.id]=rk(n.id)+1;if(n.a&&S.tree[n.id]===1){const e=S.slots.indexOf(null);if(e>=0)S.slots[e]=n.id}SFX.lvl();refreshStats();save();setupSkillButtons();hudStats();hudSkills();treePanel()});
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const id=b.dataset.s,x=+b.dataset.x;S.slots=S.slots.map(v=>v===id?null:v);S.slots[x]=id;SFX.tap();save();setupSkillButtons();hudSkills();treePanel()});
  $('#rsT').onclick=()=>{S.tree={};S.slots=[null,null,null];SFX.tap();refreshStats();save();setupSkillButtons();hudStats();hudSkills();treePanel()}}

/* ======================= TOWN BUILDINGS ======================= */
const BLDS={
 smith:{n:'鐵匠鋪',start:1,base:500,max:10,ic:'hammer',mat:{wood:12,stone:6,iron:8},req:()=>true,reqT:'',eff:l=>`強化上限 +${4+l*2}・強化費用 -${(l-1)*5}%`},
 market:{n:'市集',start:1,base:400,max:10,ic:'bag',mat:{wood:16,stone:4},req:()=>!!S.merch,reqT:'需要先救出商人瑪蒂（暮鐘近郊）',eff:l=>`賣出價格 +${(l-1)*15}%・武器架品質「${RAR[[0,1,1,2,2,3][l]].n}」`},
 train:{n:'訓練場',start:0,base:500,max:10,ic:'sword',mat:{wood:18,stone:4},req:()=>true,reqT:'',eff:l=>`獲得經驗 +${l*15}%`},
 wall:{n:'城牆',start:0,base:700,max:10,ic:'armor',mat:{wood:6,stone:28,iron:4},req:()=>S.done.length>=2,reqT:'完成卷二後，石匠才會來幫忙',eff:l=>`英雄生命 +${l*5}%`},
 tavern:{n:'灰狼酒館',start:0,base:900,max:10,ic:'horn',mat:{wood:22,stone:10},req:()=>S.done.length>=2,reqT:'完成卷二後，旅人才會經過暮鐘鎮',eff:l=>l?`帶一名英雄同伴出征・同伴攻擊力 ${35+l*10}%`:'建好後可以邀請其他英雄同行'},
 church:{n:'聖鐘教堂',start:0,base:600,max:10,ic:'holywater',mat:{wood:10,stone:24,iron:4},req:()=>S.done.length>=3,reqT:'鐘舌回來之後才能修復（完成卷三）',eff:l=>l?`每趟出征倒下時可復活 ${l>=3?2:1} 次・回復藥效果 +${l*10}%`:'尚未修復：出征時倒下就結束'}
};
const bl=k=>(S&&S.bld&&S.bld[k]!=null)?S.bld[k]:BLDS[k].start;
const bCost=k=>{const f=bl(k)-BLDS[k].start,mt=BLDS[k].mat;return{gold:Math.round(BLDS[k].base*Math.pow(2.1,f)),wood:Math.round((mt.wood||0)*Math.pow(1.8,f)),stone:Math.round((mt.stone||0)*Math.pow(1.8,f)),iron:Math.round((mt.iron||0)*Math.pow(1.8,f))}};
const canPayB=c=>S.gold>=c.gold&&S.mat.wood>=c.wood&&S.mat.stone>=c.stone&&S.mat.iron>=c.iron;
const costH=c=>[['gold',c.gold],['wood',c.wood],['stone',c.stone],['iron',c.iron]].filter(v=>v[1]>0).map(([k,v])=>`<span class="cc ${(k==='gold'?S.gold:S.mat[k])<v?'no':''}"><img src="${matIcon(k)}" alt="${MATN[k]}">${v}</span>`).join('');
function buildPanel(){const ok=archOK();panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>城鎮建設</h2>${ok?'<div class="sub">建築師哈特把藍圖攤在桌上：「金幣、木材、石材、鐵礦——有料，我就能蓋。」</div>':'<div class="lr" style="margin:4px 0 10px"><p style="margin:0">這裡是建設預定地。可是暮鐘鎮沒有建築師，誰也不知道該怎麼蓋。<br><b style="color:var(--gold)">完成卷一「霧林之誓」，把被劫掠者擄走的建築師救回來。</b></p></div>'}
  <div class="mats2">${['gold','wood','stone','iron'].map(k=>`<span><img src="${matIcon(k)}" alt="${MATN[k]}">${k==='gold'?S.gold:S.mat[k]||0}</span>`).join('')}</div>
  <div class="shop">${Object.entries(BLDS).map(([k,b])=>{const l=bl(k),c=bCost(k),mx=l>=b.max,rq=ok&&b.req();return`<div class="si ${rq||l?'':'lk'}"><img src="${itemIcon(b.ic,null)}" alt=""><div style="flex:1;min-width:0"><b>${b.n}</b> <span class="own">Lv ${l} / ${b.max}</span><small>目前：${b.eff(l)}${mx?'':`<br><span style="color:#8fe0a0">下一級：${b.eff(l+1)}</span>`}</small><div class="row" style="margin-top:6px">${mx?'<span class="own">已達最高等級</span>':!ok?'<span class="own" style="color:#ff9a7a">🔒 需要建築師</span>':!b.req()?`<span class="own" style="color:#ff9a7a">🔒 ${b.reqT}</span>`:`<button class="btn" data-bd="${k}" ${canPayB(c)?'':'disabled'}>${l?'升級':'建造'}</button><span class="cost2">${costH(c)}</span>`}${k==='tavern'&&l?'<button class="btn dk" id="mateB">選擇同伴</button>':''}</div></div></div>`}).join('')}</div>
  <div class="sub" style="margin-top:10px">木材、石材、鐵礦可以到「地圖」上的探索區域收集。</div>`);
  $('#px').onclick=closePanel;
  document.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>{const k=b.dataset.bd,c=bCost(k);if(!canPayB(c))return;S.gold-=c.gold;S.mat.wood-=c.wood;S.mat.stone-=c.stone;S.mat.iron-=c.iron;S.bld[k]=bl(k)+1;SFX.lvl();save();refreshStats();hudStats();rebuildTown();toast(`${BLDS[k].n} 升到 Lv${bl(k)}！鎮上變得更熱鬧了。`,2400);if(k==='tavern'&&bl(k)===1&&!S.mate)S.mate=HEROES.find(h=>h!==S.cls);buildPanel()});
  const mb=$('#mateB');if(mb)mb.onclick=()=>matePanel()}
function matePanel(){panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>灰狼酒館</h2><div class="sub">邀請一名英雄跟你一起出征。同伴不會倒下，攻擊力是你的 ${35+10*bl('tavern')}%。</div><div class="shop">${HEROES.filter(h=>h!==S.cls).map(h=>`<div class="si ${S.mate===h?'on':''}"><canvas data-por="${h}" width="108" height="108" style="width:54px;height:54px;border-radius:50%;flex:none;background:radial-gradient(#4a5a68,#1d242c)"></canvas><div style="flex:1;min-width:0"><b>${CH[h].name}・${CLS[h].job}</b><small>${CLS[h].desc}</small><div class="row" style="margin-top:6px"><button class="btn" data-m="${h}" ${S.mate===h?'disabled':''}>${S.mate===h?'同行中':'邀請同行'}</button></div></div></div>`).join('')}</div>`);
  $('#px').onclick=closePanel;document.querySelectorAll('[data-por]').forEach(c=>drawPortrait(c,c.dataset.por,'smile',true));document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{S.mate=b.dataset.m;SFX.tap();save();matePanel()})}
function rebuildTown(){if(mode!=='town'||!P)return;const p=P.pos.clone(),f=P.face;setWorld(buildTown());P.pos.copy(p);P.face=f;updCam(0,true);hudOn()}

/* ======================= COMPANION ======================= */
let MATE=null;
function spawnMate(){MATE=null;if(mode==='zone'&&advK()==='machinist'){const T=spawnTurret();if(T){T.t=1e9;T.follow=1}}if(mode!=='zone'||!bl('tavern')||!S.mate||S.mate===S.cls)return;const m=makeChibi(LOOKS[S.mate],.95);m.root.position.set(P.pos.x+1.5,0,P.pos.z+1.5);scene.add(m.root);const ring=new THREE.Mesh(RINGG,addM(0x8fe0a0,.4));ring.material.userData.keep=true;ring.rotation.x=-PI/2;ring.scale.setScalar(.6);ring.position.y=.05;m.root.add(ring);MATE={m,id:S.mate,pos:m.root.position,cd:1,t:0,anim:0,face:0}}
function updMate(dt){if(!MATE||!P||P.dead)return;const M=MATE;M.t+=dt;if(M.anim>0)M.anim-=dt;const C=CLS[M.id];const tx=P.pos.x-Math.sin(P.face)*1.8+Math.cos(P.face)*1.2,tz=P.pos.z-Math.cos(P.face)*1.8-Math.sin(P.face)*1.2;const dx=tx-M.pos.x,dz=tz-M.pos.z,d=Math.hypot(dx,dz);let mv=0;
  const tg=nearestEnemy(M.pos,C.range+.5);
  if(tg&&C.kind==='melee'&&d<7){const ex=tg.pos.x-M.pos.x,ez=tg.pos.z-M.pos.z,ed=Math.hypot(ex,ez);if(ed>C.range){M.pos.x+=ex/ed*7*dt;M.pos.z+=ez/ed*7*dt;mv=1}}
  else if(d>.6){const sp=Math.min(d,(d>5?11:8)*dt);M.pos.x+=dx/d*sp;M.pos.z+=dz/d*sp;mv=1}
  if(d>16){M.pos.set(tx,0,tz)}W.bound(M.pos);
  M.cd-=dt;if(tg){M.face=Math.atan2(tg.pos.x-M.pos.x,tg.pos.z-M.pos.z);if(M.cd<=0){M.cd=C.rate*1.4;M.anim=.32;const A=atkNow()*(.35+.1*bl('tavern'));
      if(C.kind==='melee'){vSlash(M.pos,M.face,0xcfe8ff,2.2);for(const e of EN_LIST)if(!e.dead&&dist2(M.pos,e.pos)<(2.4+e.r)**2)hitEnemy(e,A,{kb:2})}
      else if(C.kind==='bomb'){lob(tg.pos,A,2.4,0xff8a3a,.55,{from:M.pos,burn:1});if(!(M.tur>M.t)){M.tur=M.t+15;spawnTurret(M.pos.clone().add(new THREE.Vector3(.8,0,.8)))}}else shoot(C.kind,tg,A,{from:M.pos})}}
  else if(mv)M.face=Math.atan2(dx,dz);
  const cur=M.m.root.rotation.y;let df=M.face-cur;df=Math.atan2(Math.sin(df),Math.cos(df));M.m.root.rotation.y=cur+df*Math.min(1,dt*12);animModel(M.m,M.t,mv,M.anim>0?M.anim/.32:0,dt)}

/* ======================= VILLAGE REQUESTS & EVENTS ======================= */
const QG={emma:{n:'農婦 艾瑪',look:'vill',pos:[-9,9]},ben:{n:'修士 班尼迪',look:'oren',pos:[13.5,1.5]},god:{n:'老兵 戈弗雷',look:'smith',pos:[-5,-12.5]}};
function qProg(k,en){if(!S.q)return;for(const g in S.q){const q=S.q[g];if(q.p>=q.n)continue;if(q.k===k&&(k!=='kill'||q.en===en)){q.p++;if(q.p>=q.n)toast(`委託完成！回暮鐘鎮找${QG[g].n}領取報酬`,2600)}}}
function questPanel(g){const q=S.q&&S.q[g];if(!q){const last=QCH[g][QCH[g].length-1];say([['nar',(S.qi&&S.qi[g]>=QCH[g].length)?last.end:`${QG[g].n}：「謝謝你們，鎮上的日子好多了。」`]]);return}const done=q.p>=q.n;const step=(S.qi&&S.qi[g]||0)+1;
  panel(`<button class="btn dk x" id="px" aria-label="關閉">×</button><h2>${QG[g].n}的委託</h2><div class="sub">第 ${step} / ${QCH[g].length} 件</div><div class="lr" style="margin-top:6px"><p style="margin:0">「${q.t}」</p></div><div class="bd"><div>進度：<b style="color:${done?'#8fe0a0':'#fff'}">${Math.min(q.p,q.n)} / ${q.n}</b></div><div>報酬：${q.gold} 金幣${q.fin?`＋專屬裝備「${q.fin.name}」`:''}</div></div><div class="row">${done?'<button class="btn" id="qT">交付委託</button>':'<span style="font:13px var(--f-ui);color:#cdbb98">委託會自動記錄，出征時完成吧。</span>'}</div>`);
  $('#px').onclick=closePanel;const t=$('#qT');if(t)t.onclick=()=>{S.gold+=q.gold;let msg=`獲得 ${q.gold} 金幣`;if(q.fin){const it=makeItem(3,Math.min(S.done.length,BOUNTY.length-1),q.fin.slot,q.fin.slot==='weapon'?'base':undefined);it.name=q.fin.name;pickItem(it);msg+=`與「${it.name}」`}S.qi=S.qi||{};S.qi[g]=(S.qi[g]||0)+1;S.q[g]=null;ensureQuests();SFX.loot();save();hudStats();closePanel();say([['nar',q.end?`${q.end}\n${msg}`:`${QG[g].n}：「謝謝你！這點心意請收下。」\n${msg}`]]);rebuildTown()}}
const TEV=[null,
 {t:'建築師回來了',lines:[['nar','霧林修道院倖存的修士班尼迪，和一群無家可歸的村民，跟著你們來到暮鐘鎮。'],['nar','建築師哈特在廣場擺了張桌子，攤開藍圖：「先蓋鐵匠鋪和訓練場。木材到近郊去找，石材在東邊的灰岩丘陵。」'],['oren','國王撥了一筆錢給我們。暮鐘鎮——要重新站起來了。','calm']],gold:600},
 {t:'聖奧蘭的凱旋',lines:[['nar','聖奧蘭解圍的消息傳回王都，暮鐘鎮辦起了慶典。'],['sera','……大家在唱歌。唱的是我們。','smile'],['oren','聖奧蘭的商人送來了謝禮。酒館也該蓋起來了，英雄需要同伴。','smile']],gold:1200},
 {t:'鐘聲重響',lines:[['nar','三截鐘舌回到王都，聖鳴重新響起，全城的人都走上街頭。'],['rita','……我爸還在北方。我一定會再見到他。','sad'],['oren','王都派來了工匠。把教堂修好吧，接下來的仗，會需要神的庇佑。','calm']],gold:2000},
 {t:'北方來的騎士',lines:[['nar','鐵騎團沉入白湖的消息震動了北方，各地的騎士開始來暮鐘鎮報到。'],['ivy','訓練場要擴建了。我來教他們怎麼拿盾。','smile']],gold:3000},
 {t:'火光之後',lines:[['nar','卡萊灣的大火燒了三天，海風把灰燼一路吹到暮鐘鎮。'],['roan','黑帆退了，可是赤燼王還在。我們只剩最後一戰。','calm']],gold:4500},
 {t:'和平的鐘聲',lines:[['nar','赤燼熄滅後的第一個黃昏，聖鳴響了十三聲。'],['oren','第十三聲……是給他的。','sad'],['nar','暮鐘鎮的孩子們開始玩一種新遊戲：四個人，一支號角，一口不會再沉默的鐘。']],gold:6000}];
function townEvent(){let n=S.evt||0;while(n<S.done.length&&!TEV[n+1])n++;S.evt=n;if(n>=S.done.length)return;const ev=TEV[n+1];S.evt=n+1;save();setTimeout(()=>{banner('城鎮事件',ev.t);setTimeout(()=>say(ev.lines,()=>{S.gold+=ev.gold;save();hudStats();SFX.coin();toast(`獲得 ${ev.gold} 金幣。找建築師哈特擴建城鎮吧！`,3200)}),1400)},600)}

