# 暮鐘戰記 Bellkeep Chronicles

手機直式的 3D 動作 RPG。純前端：`index.html` + `style.css` + `js/` 九個檔案，3D 用 three.js r128（從 cdnjs 載入），不需要安裝或編譯。

用瀏覽器打開 `index.html` 就能玩；開啟 GitHub Pages 後，手機也能直接用網址開。

## 檔案地圖：要改什麼，看哪個檔

| 檔案 | 內容 |
|---|---|
| `js/01-core.js` | 存檔、音效、3D 場景、材質、對話頭像（`CH`）、職業（`CLS`）、第一部懸賞（`BOUNTY`）、怪物數值（`EN`）、序章劇情 |
| `js/02-art.js` | 圖示繪製（`SYM`、`ID`）、角色與怪物的 3D 模型（`makeChibi`、`makeWolf`、`makeGolem`…）、場景道具、特效 |
| `js/03-world.js` | 城鎮（`buildTown`）與迷宮關卡（`buildZone`）的生成 |
| `js/04-combat.js` | 戰鬥、普通攻擊（`autoAttack`）、敵人 AI、Boss 招式、玩家移動、HUD |
| `js/05-ui.js` | 背包、商店、技能樹（`TREE`、`SKF`）、城鎮建築（`BLDS`）、同伴、對話系統 |
| `js/06-map.js` | 探索區域、王國地圖 |
| `js/07-part2-story.js` | 第二部與第三部：關卡（`P2Z`）、Boss（`P2B`）、章節卡（`P2CARD`）、劇情對話（`P2STORY`）、世界與地心地圖 |
| `js/08-features.js` | 轉職聖殿、多瑙河橋、各地區怪物與場景（`ZPROP`）、傳說武器（`LEGW`）、魂之號角、轉職（`ADV`）、村民委託 |
| `js/09-main.js` | 遊戲流程、標題與選角、主迴圈 |
| `style.css` | 所有介面樣式 |
| `art/` | 美術圖（頭像、圖示、插畫）放這裡，檔名寫用途，例如 `portrait_rita.png` |

## 修改規則（給 AI 助手）

1. **九個 js 檔共用同一個全域範圍，而且照編號順序載入。** 不要加 `import`/`export`，也不要把程式碼包進函式裡；新的頂層程式碼放在它用到的東西之後。
2. **劇情對話格式**：`['說話者', '台詞', '表情']`。說話者要是 `CH` 裡有的 key（ivy、roan、sera、rita、oren、priest…），旁白用 `'nar'`。表情：calm、smile、sad、angry、worried、surprised。
3. **不要改存檔的 key**（`bellkeep-3d-v1`）和既有欄位名稱，否則玩家的進度會不見。
4. three.js 固定用 r128，不要換版本。
5. 改完一定要用瀏覽器打開試玩，並看開發者工具的 Console 有沒有紅字錯誤。
6. 一次只改一件事，用清楚的 commit 訊息說明改了什麼。
