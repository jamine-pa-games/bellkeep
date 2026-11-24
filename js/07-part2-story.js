/* 第二部/第三部：關卡、Boss、章節卡、劇情對話、世界與地心地圖 */
/* ======================= PART 2 & 3: THE TWELVE, THE THIRTEENTH, THE DEEP ======================= */
const P2Z=[
 ['frost1','冰峽灣','ice','ice',0x7a90a8,0xe8f0ff,.85,[0xdfeaff,0x5a6a80,.65],['frostwolf','yeti','xbow']],
 ['frost2','永凍城塞','ice','ice',0x6a7a98,0xd8e8ff,.8,[0xcfe0ff,0x4a5a70,.65],['knight','yeti','frostwolf']],
 ['giant1','巨人之城','quarry','dgrass',0x5a5040,0xffd8a0,.95,[0xd8c8a8,0x3a3020,.6],['giant','giantrock','giant']],
 ['giant2','保加利亞龍城','citadel','cobble',0x4a2a24,0xffb07a,.95,[0xffc8a0,0x3a1a14,.6],['dragonkin','drakeling','dragonkin']],
 ['casp1','裏海岸','harbor','sand',0x4a6070,0xffd0a0,.9,[0xc8d8e8,0x4a3a2a,.6],['drowned','crab','xbow']],
 ['casp2','沉沒之港','harbor','sand',0x2a4050,0xc8d8ff,.8,[0xa8c0d8,0x2a2a3a,.6],['drowned','crab','raider']],
 ['pers1','波斯波利斯','citadel','sand',0x8a6a40,0xffd890,1,[0xffe0b0,0x5a4020,.6],['scorp','raider','xbow']],
 ['pers2','萬國之門','citadel','sand',0x7a5030,0xffc070,.95,[0xffd0a0,0x4a3018,.6],['scorp','knight','golemling']],
 ['loul1','樓蘭古都','gate','sand',0x9a7a50,0xffe0a0,1,[0xffe8c0,0x5a4020,.6],['sandwraith','scorp','imp']],
 ['loul2','羅布泊','gate','sand',0x8a6a50,0xffd0a0,.95,[0xf0d8b0,0x4a3020,.6],['sandwraith','golemling','scorp']],
 ['demon1','妖魔之地','mine','ash',0x2a1a2a,0xd8a0ff,.75,[0xa080c0,0x2a1a2a,.6],['yaksha','imp','wolf']],
 ['demon2','雪域神殿','ice','snowp',0x5a5a7a,0xf0e0ff,.8,[0xe0d8ff,0x3a3050,.65],['yaksha','yeti','xbow']],
 ['pillar','天之柱','citadel','cobble',0x8a90b0,0xffffff,1,[0xffffff,0x6a7090,.7],['knight','giant','dragonkin','xbow']],
 ['deep1','巴別塔・燃燒之階','gate','ash',0x3a0a04,0xff6a2a,.9,[0xff7a4a,0x2a0a04,.6],['brick','drakeling','imp']],
 ['deep2','巴別塔・亂語迴廊','mine','mine',0x1a0a1a,0xc07aff,.75,[0x8a60b0,0x1a0a1a,.6],['brick','babbler','drakeling']],
 ['deep3','巴別塔・塔頂之間','citadel','ash',0x10060a,0xff3a6a,.8,[0xa04060,0x10040a,.55],['brick','babbler','dragonkin','giant']]];
const P2B=[
 ['ogier','冰霜武士 奧吉爾','奧吉爾',{outfit:0x7a9ab8,trim:0xdfeaff,cape:0x2a4a7a,eye:0x6ad0ff},['ice','charge','slam','chase','nova'],'奧吉爾之盾','冰峽灣的盾','#6ad0ff'],
 ['berenger','雪原武士 貝朗吉','貝朗吉',{outfit:0xc8d8e8,trim:0x6ad0ff,cape:0x3a5a8a,eye:0xa8e8ff,weapon:'axe'},['cross','ice','summon','charge','slam'],'貝朗吉之靴','永凍城塞','#a8e8ff'],
 ['ferumbras','巨人武士 費朗布拉斯','費朗布拉斯',{scale:3.2,outfit:0x8a6a4a,trim:0xc8a060,cape:0x5a3a20,eye:0xffa040,weapon:'bighammer'},['slam','rocks','nova','slam','chase'],'費朗布拉斯之臂甲','巨人之城','#ffa040'],
 ['engelier','龍城武士 恩格利耶','恩格利耶',{outfit:0x7a2a1a,trim:0xf0c35a,cape:0x3a1a10,eye:0xff6a2a,weapon:'axe'},['fire','charge','cross','fire','summon','nova'],'恩格利耶之護腿','龍城','#ff6a3a'],
 ['renaud','潮汐武士 雷諾','雷諾',{outfit:0x2a6a8a,trim:0xf0c35a,cape:0x1a3a5a,eye:0x6ae0ff},['charge','cannon','cross','charge','nova'],'雷諾之劍','裏海的潮聲','#4ab0e0'],
 ['bradamante','白羽女騎士 布拉達曼特','布拉達曼特',{outfit:0xe8e8f0,trim:0xf0c35a,cape:0x8a2a4a,eye:0x8a4ae0},['chase','cross','charge','summon','chase'],'布拉達曼特之披風','沉沒之港','#e8e8ff'],
 ['astolfo','鷹獅騎士 阿斯托爾福','阿斯托爾福',{outfit:0xd8a040,trim:0x2a6a8a,cape:0x2a4a8a,eye:0xffe04a,weapon:'axe'},['chase','fire','charge','cross','nova'],'阿斯托爾福之號角','鷹獅與月亮','#ffd04a'],
 ['girart','沙王武士 吉拉德','吉拉德',{outfit:0xb8803a,trim:0xf0c35a,cape:0x8a3a1a,eye:0xff8a3a,weapon:'bighammer'},['fire','cannon','slam','summon','nova'],'吉拉德之腰帶','萬國之門','#ff8a3a'],
 ['naimes','賢者武士 奈姆','奈姆',{outfit:0x8a7a5a,trim:0xe0d0a0,cape:0x5a4a2a,eye:0xf0e0a0,weapon:'staff'},['cross','chase','fire','summon','nova'],'奈姆之戒','樓蘭古都','#e0d0a0'],
 ['turpin','大主教武士 杜爾平','杜爾平',{outfit:0xe8d8b0,trim:0xc83a2a,cape:0x8a1a1a,eye:0xffd06a,weapon:'staff'},['nova','chase','cross','slam','summon'],'杜爾平之聖印','羅布泊的鐘聲','#ffd06a'],
 ['malagigi','妖術武士 馬拉吉吉','馬拉吉吉',{outfit:0x4a2a6a,trim:0xb06aff,cape:0x2a0a3a,eye:0xd07aff,weapon:'staff',horns:1},['chase','rocks','cross','summon','nova','chase'],'馬拉吉吉之頭冠','妖魔之地','#d07aff'],
 ['oliver','明智武士 奧利維耶','奧利維耶',{outfit:0xb8c8d8,trim:0xf0c35a,cape:0x2a3a6a,eye:0x8ad0ff},['cross','charge','chase','slam','nova','cross'],'奧利維耶之鎧','雪域神殿','#8ad0ff'],
 ['shadow','第十三武士 羅德蘭之影','羅德蘭之影',{scale:2.9,outfit:0x1a0a14,trim:0xf0c35a,cape:0x3a0a1a,eye:0xff2a5a,weapon:'bighammer',horns:1,crown:1},['slam','cross','chase','fire','charge','nova','summon','cannon'],'聖槍','天之柱','#ff2a5a'],
 ['lavagiant','守門巨像','守門巨像',null,['slam','fire','nova','rocks','summon','chase'],'巨像之心','燃燒之階','#ff6a2a'],
 ['wyrm','吞語古龍','吞語古龍',null,['charge','fire','chase','cross','nova','charge'],'古龍之鱗','亂語迴廊','#c07aff'],
 ['abyss','築塔之王 寧錄','寧錄',{scale:3.3,outfit:0x2a0a2a,trim:0xff3a6a,cape:0x4a0a2a,eye:0xff3a6a,weapon:'bighammer',horns:1,crown:1,skin:0x1a0a14},['slam','cross','chase','fire','cannon','nova','summon','charge','cross'],'第一口鐘','塔頂之間','#ff3a6a']];
const CNUM=['七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','二十一','二十二'];
const P2LOOK={trialKnight:{outfit:0xdfe6ee,trim:0xf0c35a,cape:0x2a3a6a,eye:0x8ad0ff,scale:2.3}};
const P2CARD=[
 ['暮曆一四三一年・極夜','十二聖騎士的魂沒有回到鐘裡。\n第一道光落在北方的冰峽灣。\n傳說那裡有一位丹麥騎士，在冰下睡了三百年。'],
 ['暮曆一四三一年・極夜','冰峽灣再往北，是一座被冰封住的城塞。\n守城的騎士說，他的腳從沒離開過城牆。'],
 ['暮曆一四三一年・春','群山之間，有一座為巨人建造的城市。\n城門高得像懸崖，台階一級比人還高。\n城裡只住著一位騎士——他本身，就是巨人。'],
 ['暮曆一四三一年・春','巨人山脈往西，多瑙河切開了大地。\n河的對岸，懸崖上蓋著保加利亞的龍城。\n城裡的人說，龍不是敵人——牠叫「茲梅」，是守城的龍。'],
 ['暮曆一四三一年・夏','世界上最大的湖，大得像海。人們叫它裏海。\n潮聲裡，有一位騎士在等一艘永遠不會回來的船。'],
 ['暮曆一四三一年・夏','裏海南岸，一座港口沉進了水裡，只剩塔頂露出水面。\n塔頂上，站著一位白羽的女騎士。'],
 ['暮曆一四三一年・秋','古波斯的沙漠上，有一頭鷹獅在盤旋。\n牠背上的騎士，說自己去過月亮。'],
 ['暮曆一四三一年・秋','萬國之門，古波斯諸王接見天下使節的地方。\n石牛守著門口。門後的騎士說：只有國王才能通過。'],
 ['暮曆一四三二年・冬','絲路上的樓蘭，在沙漠裡沉睡了一千年。\n古城的城牆被沙埋了一半。\n一位老騎士坐在城門口，像在等誰回家。'],
 ['暮曆一四三二年・冬','樓蘭北邊是一片乾涸的湖。\n羅布泊的湖底，有一座倒過來的鐘樓。\n每到黃昏，它會響一聲。'],
 ['暮曆一四三二年・春','世界屋脊上的高原，雲在腳下流。\n山民說那裡住著妖魔，連鳥都不敢飛過。\n妖魔們的主人，是一位騎士。'],
 ['暮曆一四三二年・春','高原的盡頭是一座雪白的神殿。\n神殿裡的騎士，是第十三人生前最好的朋友。'],
 ['暮曆一四三二年・夏','世界的最高點，一根石柱直通雲上。\n羅德蘭的影子握著聖槍的槍尖，在柱頂等了很久。'],
 ['地心・巴別塔　第一層','天之柱的裂縫往下，是一座倒過來的塔。\n每一級台階都往下走，台階上流著熔岩。\n塔門前的巨像胸口刻著：「此處之上，人人說同一種話。」'],
 ['地心・巴別塔　第二層','越往下，牆上的字越多，每一行都是不同的語言。\n迴廊裡睡著一條古龍。\n牠吃掉了人們說過的話，所以這一層安靜得可怕。'],
 ['地心・巴別塔　塔頂','塔是倒著沉的，所以塔頂在最深處。\n那裡掛著一口裂開的鐘，和一位還在往下蓋塔的王。\n他叫寧錄。一萬年來，他沒有停過手。']];
const P2DESC=[
 '北方冰原上的峽灣。冰霜武士奧吉爾守著王者之盾，會讓冰面裂開、舉盾衝鋒。',
 '被冰封的城塞。雪原武士貝朗吉的斧頭會劈出十字形的冰裂。',
 '為巨人建造的山城。巨人武士費朗布拉斯的巨鎚能砸碎整片地面。',
 '多瑙河對岸、懸崖上的保加利亞龍城。恩格利耶和守城之龍「茲梅」一起，會讓火焰從天而降。',
 '大得像海的裏海。潮汐武士雷諾會呼叫沉船的艦砲，在岸邊衝鋒。',
 '沉進水裡的港口。白羽女騎士布拉達曼特極快，紅圈會一路追著你。',
 '古波斯的宮殿。鷹獅騎士阿斯托爾福會吹響魔法號角、灑下火焰。',
 '古波斯諸王的大門。沙王武士吉拉德會在沙暴中呼叫砲擊。',
 '沙漠裡沉睡千年的樓蘭古都。賢者武士奈姆的陣法會讓街道變成陷阱。',
 '乾涸湖底的倒立鐘樓。大主教武士杜爾平的聖光會從四面八方降下。',
 '世界屋脊上的高原。妖術武士馬拉吉吉召喚妖魔，紅圈會連續追擊。',
 '高原盡頭的雪白神殿。第十三人生前的摯友奧利維耶，劍快得看不見。',
 '世界的最高點。第十三武士羅德蘭之影，會使出十二位聖騎士所有的招式。',
 '倒沉的巴別塔第一層，燃燒的台階。守門巨像的心臟跳動時，岩漿會噴向四方。',
 '寫滿各種語言的迴廊。吞語古龍會猛衝、噴火，用翅膀掀起十字形的颶風。',
 '塔頂之間——在世界的最深處。築塔之王寧錄，會使出所有人的招式。'];
const P2STORY=[
 {z:[['roan','這裡的冬天沒有白天。','calm'],['ivy','風裡有劍的聲音。他在等我們。','calm']],b:[['nar','冰牆後面走出一位披著藍色斗篷的騎士：「我是奧吉爾。想帶走王者之盾，就讓我看看你們的劍。」'],['sera','他不是敵人……他是在試煉我們。','worried']],ph:[['nar','奧吉爾大笑，盾牌上結出厚厚的冰：「好！再來！」']],post:[['nar','奧吉爾單膝跪地，把結霜的盾交到你們手上：「王者之裝的第一件。還有十一個人在等你們。」'],['rita','十一個……要把全世界跑一圈嗎？','surprised']]},
 {z:[['ivy','城門被冰封住了，只能從冰洞繞進去。','calm'],['sera','好冷……連鐘聲都被凍住了。','worried']],b:[['nar','「貝朗吉。」騎士只說了自己的名字，就舉起了斧頭。'],['roan','話真少。我喜歡。','smile']],ph:[['nar','城塞的冰牆開始崩塌，冰柱從天而降。']],post:[['nar','貝朗吉把一雙鐵靴放在雪地上：「穿上它，往南走。巨人的城市，比這裡更難。」']]},
 {z:[['rita','這些台階……是給巨人走的吧？','surprised'],['ivy','跟緊。巨人城裡的東西都很大，包括陷阱。','calm']],b:[['nar','地面在震動。一位三人高的騎士從石座上站起來：「我是費朗布拉斯。曾經是敵人，後來成了聖騎士。你們呢？」'],['sera','我們……只是想把該做的事做完。','calm']],ph:[['nar','費朗布拉斯舉起巨鎚，整座城都在回音。']],post:[['nar','「把該做的事做完——這就是騎士。」費朗布拉斯卸下巨大的臂甲，它在你們手中縮成了合適的大小。'],['nar','巨人又從王座底下抽出一卷羊皮紙：「往西過多瑙河，就是龍城。可是河上的橋，三百年前就斷了。這是巨人造橋的圖。」'],['rita','……這張圖上修改的筆跡，是我爸的字。','surprised'],['rita','給我木材、石材和鐵，我把橋蓋起來。這次輪到我了。','angry']]},
 {z:[['rita','橋撐住了。爸爸畫的圖，一根梁都沒算錯。','smile'],['ivy','城牆上那個影子……是龍？','surprised'],['sera','牠沒有攻擊我們。牠在看。','calm']],b:[['nar','「恩格利耶。」騎士站在龍的影子下，「這座城的龍叫茲梅。牠守護這裡，就像我守護王者之裝。」'],['nar','「保加利亞的老故事說：茲梅會和惡龍打仗，保護麥田和村子。你們，是站在麥田那一邊的嗎？」'],['roan','我們就是從麥田來的。','calm']],ph:[['nar','茲梅在城頂長嘯。恩格利耶的斧頭燒了起來——龍火落在他的刃上。']],post:[['nar','恩格利耶收起斧頭。茲梅降落在他身旁，對你們低下了頭。'],['nar','「牠承認你們了。」騎士把護腿交給你們，「往東，去裏海吧。」'],['rita','龍城城門的鉸鏈……也是我爸修的。他到底去過多少地方？','surprised']]},
 {z:[['rita','這是湖？我看不到對岸。','surprised'],['ivy','岸邊插著騎士團的旗子……是三百年前的。','calm']],b:[['nar','「我是雷諾。」騎士的劍上滴著海水，「我的船沉在這裡三百年了。你們，夠資格坐我的船嗎？」'],['roan','我們不坐船。我們用走的。','calm']],ph:[['nar','裏海的浪越來越高，雷諾的劍劃開了潮水。']],post:[['nar','雷諾把劍插進沙灘：「我的劍，給你們。去沉沒之港吧，她比我難纏得多。」']]},
 {z:[['sera','塔頂上那個人……是女騎士？','surprised'],['ivy','十二聖騎士裡也有女人。我早就知道。','smile']],b:[['nar','「布拉達曼特。」白羽騎士拔劍，「沒有人說過，騎士一定要是男人。」'],['ivy','也沒有人說過，騎士一定要是貴族。','smile']],ph:[['nar','布拉達曼特的身影越來越快，白羽在水面上劃出一道道光。']],post:[['nar','布拉達曼特解下白羽披風，披在伊芙肩上：「妳的盾，比我的劍還穩。」'],['ivy','……謝謝。','smile']]},
 {z:[['roan','天上那個……是鷹獅？','surprised'],['rita','我要那根羽毛，拆開來研究。','smile']],b:[['nar','鷹獅落在宮殿台階上，騎士跳了下來：「阿斯托爾福！我去月亮上替羅德蘭找回過理智——你們要不要也去一趟？」'],['sera','……他說的是真的嗎？','worried']],ph:[['nar','阿斯托爾福吹響了魔法號角，整座宮殿都在顫抖。']],post:[['nar','阿斯托爾福把號角拋給洛安：「拿去吧。月亮上什麼都有，就是沒有號角聲。」']]},
 {z:[['ivy','門上刻著好多種文字……','calm'],['rita','意思大概是「沒預約的不准進」。','smile']],b:[['nar','「吉拉德。」沙王騎士用巨鎚敲了敲地面，「你們不是國王，憑什麼通過這扇門？」'],['sera','我們不是國王。可是我們替國王，做了國王沒做的事。','calm']],ph:[['nar','沙暴吞沒了萬國之門，吉拉德的巨鎚在風沙中閃著金光。']],post:[['nar','吉拉德笑了，解下黃金腰帶：「說得好。這扇門，從今天起為你們而開。」']]},
 {z:[['roan','這座城……是被沙子吃掉的。','sad'],['sera','城裡還有人在唱歌。很遠、很輕。','worried']],b:[['nar','「我是奈姆，大帝的老顧問。」老騎士慢慢站起來，「我老了。可是試煉，不能因為我老了就變簡單。」'],['ivy','我們不會手下留情。','calm']],ph:[['nar','沙丘移動了，古城的街道在你們腳下重新排列。']],post:[['nar','奈姆把戒指放進你們手心：「智慧不是知道答案，是知道什麼時候該停下來。」']]},
 {z:[['sera','就是這個聲音……我在暮鐘鎮聽過。','surprised'],['rita','一座倒插在湖底的鐘樓？誰建的？','surprised']],b:[['nar','「杜爾平，大帝的大主教。」老人舉起法杖，「孩子們，你們知道聖鳴為什麼要鑄成一口鐘嗎？」'],['sera','……因為鐘聲能讓走散的人，找到回家的路。','calm']],ph:[['nar','倒立的鐘樓響了，湖底的沙浮了起來。']],post:[['nar','杜爾平把聖印放在瑟拉手上：「妳說對了。所以我們願意被鎖在鐘裡三百年。」'],['sera','……','sad']]},
 {z:[['roan','空氣好稀薄……走慢一點。','worried'],['ivy','經幡上畫的那些……是妖魔？','surprised']],b:[['nar','「馬拉吉吉，大帝的魔法師。」騎士身邊浮著一圈妖魔，「為了阻止第十三人，我和妖魔立了契約。你們要解除它嗎？」'],['rita','解除契約的方法，就是打倒你吧？','angry']],ph:[['nar','妖魔們尖嘯著散開，馬拉吉吉的頭冠發出紫光。']],post:[['nar','契約碎了，妖魔化成風雪散去。馬拉吉吉摘下頭冠：「謝謝。我終於可以休息了。」']]},
 {z:[['ivy','最後一位了……奧利維耶。','calm'],['roan','他就是當年勸羅德蘭吹號角的人。','calm']],b:[['nar','「我是奧利維耶。三百年前我求他吹號角，他不肯。等他肯了，已經太遲。」騎士拔劍，「這一次，我要親眼看看——你們會不會太遲。」'],['sera','我們不會。','angry']],ph:[['nar','神殿的鐘一起響了，奧利維耶的劍快得看不見。']],post:[['nar','奧利維耶卸下鎧甲：「十二件王者之裝，都在你們手上了。去天之柱吧——他在那裡等你們。」'],['rita','全部穿上……感覺像穿了一座城。','smile']]},
 {z:[['ivy','王者之裝在發光……它們認得這個地方。','surprised'],['rita','十二位聖騎士，都在看著我們。','calm']],b:[['king','你們打倒了我的十二位兄弟。','calm'],['king','你們知道大帝的劍為什麼叫「喜悅」嗎？因為劍柄裡封著聖槍的槍尖——傳說中刺過聖子的那把槍。','calm'],['king','它不是聖物，是鑰匙。地底下有一座倒過來的塔，只有它能打開塔門。','angry']],ph:[['king','把槍拿走？那座塔裡的東西會醒來！','angry']],post:[['nar','影子散去，聖槍的槍尖落在雪地上，像一顆燒紅的星星。'],['nar','槍尖碰到雪的那一刻，天之柱的底部裂開了——裂縫裡，是一座頭下腳上、沉進地心的高塔。'],['sera','那是……巴別塔。古書說它被推倒了。原來它沒有倒，它沉下去了。','worried'],['nar','第三部「沉沒的巴別塔」開啟。打開地圖，切換到「地心・巴別塔」。']]},
 {z:[['roan','我們一直往下走，門牌卻寫著「第一層」……這座塔是倒過來的。','surprised'],['rita','你們看牆的砌法——磚是往下疊的。有人一直在往地底蓋。','surprised']],b:[['nar','熔岩台階的盡頭，一具巨像擋住了塔門。胸口的字在發光：「此處之上，人人說同一種話。」'],['sera','它在等「同一種話」……可是我們四個人，說話的方式都不一樣。','calm']],ph:[['nar','巨像的心臟裂開了，岩漿噴向四面八方。']],post:[['nar','巨像崩塌，塔門打開。門後的牆上，寫滿了不同的文字。'],['ivy','聽得到嗎？下面有好多人在說話……每個人都聽不懂別人。','worried']]},
 {z:[['ivy','好安靜……連腳步聲都沒有回音。','worried'],['rita','牆上的字被啃掉了一半。是被「吃」掉的。','surprised']],b:[['nar','古龍睜開眼睛。牠的肚子裡迴盪著上萬種語言——牠吃掉了人們在塔裡說過的每一句話。'],['roan','那就讓牠聽聽這一句：我們不怕你。','angry']],ph:[['nar','古龍吐出被吞掉的話語，整條迴廊同時響起上萬種聲音。']],post:[['nar','古龍倒下時，牠吞下的話一句句飛回牆上。最後一句是：「第一口鐘，掛在塔頂。」'],['sera','聖鳴就是仿照那口鐘鑄的。古時候，全世界的人聽見同一口鐘，就能聽懂彼此。','calm'],['rita','後來鐘裂了，大家的話就散了。……我能修好它。我一定能。','angry']]},
 {z:[['ivy','十二位聖騎士、羅德蘭……所有人都是為了這一刻。','calm'],['roan','那就讓這一刻，屬於我們。','angry']],b:[['nar','「歡迎來到塔頂。」一位戴著王冠的巨人站在裂開的鐘下，手上還拿著砌磚的鏝刀。'],['nar','「我是寧錄，築塔之王。我要再敲響這口鐘——讓全世界只聽得懂一個聲音：我的聲音。」'],['sera','鐘聲不是用來命令別人的。是讓走散的人，找到回家的路。','angry']],ph:[['nar','寧錄舉起鏝刀，整座倒塔隨著他的心跳崩塌、重組。']],post:[['nar','寧錄倒在鐘下，王冠滾到芮塔腳邊。'],['nar','芮塔攤開工具，用聖槍的槍尖當鉚釘，一寸一寸把裂開的第一口鐘鉚合。'],['nar','四人一起敲響了它。'],['nar','鐘聲沒有讓大家說同一種話。它讓每個人用自己的語言，聽懂了別人。'],['nar','地心、天之柱、雪域、樓蘭、波斯、裏海、龍城、巨人之城、冰峽灣，最後是暮鐘鎮——整個世界，同時聽見了鐘聲。'],['nar','《暮鐘戰記》・全劇終\n謝謝你走完這段旅程。所有懸賞都可以再次挑戰，繼續收集傳說裝備。']]}];
P2Z.forEach((z,i)=>{const k=6+i;const [key,name,style,ground,fog,sun,sunI,hemi,en]=z;const b=P2B[i];
  ZONES[key]={name,idx:k,style,ground,fog,bg:fog,sun,sunI,hemi,enemies:en,m:14*Math.pow(1.24,k-5),boss:b[0]};
  EN[b[0]]={name:b[1],hp:Math.round(70000*Math.pow(1.24,k-5)),atk:Math.round(185*Math.pow(1.24,k-5)),spd:3.3,rng:3.8,xp:Math.round(7000*Math.pow(1.3,k-5)),gold:0,r:b[3]&&b[3].scale?2.8:2.4,boss:1,ab:b[4]};
  if(b[3])P2LOOK[b[0]]=b[3];
  BOUNTY.push({zone:key,boss:b[0],vol:'卷'+CNUM[i],title:b[6],name:b[1],short:b[2],reward:Math.round(4000*Math.pow(1.3,k-5)),lv:21+(k-5)*2,diff:3,col:b[7],relic:b[5],desc:P2DESC[i],part:k<19?2:3});
  CARDS.push({vol:'卷　'+CNUM[i],title:b[6],date:P2CARD[i][0],text:P2CARD[i][1]});
  const st=P2STORY[i];STORY['z'+k]=st.z;STORY['b'+k]=st.b;STORY['ph'+k]=st.ph;STORY['post'+k]=st.post.concat(k<=17?[['nar',`取得王者之裝「${b[5]}」（${k-5} / 12）`]]:[])});
ZONES.trial={name:'試煉之間',idx:6,style:'citadel',ground:'cobble',fog:0x3a3a5a,bg:0x3a3a5a,sun:0xfff0d0,sunI:.95,hemi:[0xe0e0ff,0x3a3a5a,.65],enemies:['knight','xbow'],m:14};
EN.trialKnight={name:'試煉騎士',hp:1000,atk:100,spd:3.4,rng:3.8,xp:500,gold:0,r:2.3,boss:1,ab:['slam','cross','chase','charge','nova']};
const partOf=i=>i<6?1:i<19?2:3;
function makeWyrm(){const M=MatSet();const root=new THREE.Group(),body=new THREE.Group();root.add(body);const segs=[];
  for(let i=0;i<9;i++){const s=new THREE.Group();body.add(s);const r=1-i*.07;M.part(s,G.sph(.9*r,14,10),i%2?0x5a2a6a:0x6a3a7a,0,0,0);M.part(s,G.cone(.22*r,.7*r,5),0xe2d6b8,0,.85*r,0,{ol:false});segs.push(s)}
  const h=segs[0];M.part(h,G.box(1.1,.6,1.3),0x6a3a7a,0,-.1,.9);for(const s of[-1,1]){M.part(h,G.cone(.15,1.1,6),0xe2d6b8,s*.5,.7,-.2,{rot:[-.6,0,s*.4]});M.part(h,G.sph(.14,8,6),0xffe04a,s*.4,.2,1,{basic:true,ol:false})}
  for(let i=0;i<5;i++)M.part(h,G.cone(.08,.3,4),0xffffff,-.4+i*.2,-.42,1.45,{rot:[PI,0,0],ol:false});
  for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.ConeGeometry(1.6,3,3),M.get(0x3a1a4a));w.scale.set(1,1,.15);w.rotation.z=s*1.3;w.position.set(s*1.8,.6,0);w.castShadow=true;segs[2].add(w)}
  return{root,body,legs:[],arms:[],M,kind:'wyrm',segs}}
function buildEnemy2(type){if(type==='lavagiant'){const m=makeGolem(true,0x3a2a24,0xff6a2a);m.root.scale.setScalar(2.9);return m}if(type==='wyrm'){const m=makeWyrm();m.root.scale.setScalar(2.2);return m}const L=P2LOOK[type];if(L)return makeChibi(Object.assign({skin:0xd8b8a0,hair:0x8a8a94,eye:0xffd04a,outfit:0x8a9aa8,trim:0xf0c35a,pants:0x3a3a44,boots:0x2a2a30,style:'helm',weapon:'sword'},L),L.scale||2.4);return null}


