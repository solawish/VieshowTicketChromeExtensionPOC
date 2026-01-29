# 威秀電影票訂票工具

Chrome Extension 協助使用者快速選擇威秀影城的電影場次並完成訂票流程。  
目前為 POC 版本，提供場次選擇、票種關鍵詞、票數選擇、訂票後自動選座與結帳；表單選擇會儲存並在重新開啟 popup 時還原（僅在 API 資料仍存在時）。  
僅使用 Chrome Extension 進行概念驗證。

## 功能

### 場次選擇
- 四個級聯下拉選單：影城 → 片名 → 日期 → 時間
- 自動載入選單資料
- 錯誤處理和載入狀態顯示

### 訂票功能
- **票種關鍵詞**（選填）：時間與票數之間的輸入框，有值時優先選擇名稱含有該關鍵詞的票種；未填時依序：全票 → 單人套票 → 第一個
- 票數選擇下拉選單（1–8 張）
- 確認訂票按鈕
- 自動從威秀訂票頁面動態取得 HoCode 和 PriceCode
- 自動取得並包含必要的 Cookie 和 Referer headers
- 訂票結果顯示（成功/失敗狀態）

### 表單儲存與還原
- 影城、片名、日期、時間、票種關鍵詞、票數會寫入 `chrome.storage.local`
- 關閉 popup 再開啟時，若 API 重新載入後該選項仍存在，則自動還原；否則不還原該欄位

### 自動化流程
- 訂票成功後自動進行座位選擇
- 座位預訂成功後自動進行結帳（Checkout）
- 完整的錯誤處理和降級機制

### 除錯資訊
- 找尋票種資訊的詳細 log 顯示
- 訂票 API 回應狀態顯示

## 安裝

1. 開啟 Chrome 瀏覽器
2. 前往 `chrome://extensions/`
3. 開啟「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇此專案目錄

## 使用方式

1. 點擊 Chrome Extension 圖示
2. 依序選擇影城、片名、日期、時間
3. 選擇前一個選項後，下一個選單會自動載入
4. （選填）輸入票種關鍵詞，或留空使用預設順序（全票 → 單人套票 → 第一個）
5. 選擇票數（1–8 張）
6. 點擊「確認訂票」按鈕
7. 系統會自動：
   - 從威秀訂票頁面取得動態的 HoCode 和 PriceCode
   - 提交訂票請求
   - 自動選擇座位
   - 自動完成結帳流程
8. 查看訂單回應框中的結果和詳細資訊（關閉 popup 再開啟時，表單會依儲存值還原）

## 開發

### 專案結構

```
.
├── manifest.json          # Chrome Extension 設定檔
├── popup/               # Popup 頁面
│   ├── popup.html      # HTML 結構
│   ├── popup.css       # 樣式
│   ├── popup.js        # 主要邏輯
│   └── popup.ts        # TypeScript 原始碼
├── utils/              # 工具模組
│   ├── api.js          # API 服務（包含訂票、座位選擇、結帳等功能）
│   └── api.ts          # TypeScript 原始碼
├── openspec/           # OpenSpec 規格文件
│   ├── specs/          # 當前規格
│   └── changes/       # 變更提案和歸檔
└── background/         # Background scripts（目前未使用）
```

### API 端點

#### 威秀官方 API（查詢用）
- `GET /api/GetLstDicCinema` - 取得影城列表
- `GET /api/GetLstDicMovie?cinema={cinema}` - 取得電影列表
- `GET /api/GetLstDicDate?cinema={cinema}&movie={movie}` - 取得日期列表
- `GET /api/GetLstDicSession?cinema={cinema}&movie={movie}&date={date}` - 取得時間列表

#### 威秀訂票系統 API（訂票用）
- `GET /VieShowTicketT2/?agree=on&cinemacode={cinemacode}&txtSessionId={txtSessionId}` - 取得訂票頁面（用於抓取 HoCode 和 PriceCode）
- `POST /VieShowTicketT2/Home/OrderTickets` - 提交訂票請求
- `POST /VieShowTicketT2/Home/SelectSeats` - 取得座位選擇頁面
- `POST /VieShowTicketT2/Home/ReserveSeats` - 預訂座位
- `POST /VieShowTicketT2/Home/Checkout` - 完成結帳

## 技術細節

### 動態取得 HoCode 和 PriceCode
系統會自動從威秀訂票頁面抓取正確的 HoCode 和 PriceCode 值：
- 若有填寫「票種關鍵詞」，優先選擇名稱含有該關鍵詞的票種
- 未填時依序：名稱含有「全票」→「單人套票」→ 第一個票種
- 包含完整的錯誤處理和降級機制（失敗時使用預設值）
- 所有找尋過程的 log 會顯示在 popup 輸出框中

### 表單持久化
- 使用 `chrome.storage.local`（需 manifest 的 `storage` 權限）儲存影城、片名、日期、時間、票種關鍵詞、票數
- 欄位變更時寫入；popup 載入與 API 填完選單後，僅在儲存值仍存在於當前選項時還原

### Cookie 和 Session 處理
- 自動取得 `sales.vscinemas.com.tw` domain 的所有 cookie
- 在所有 API 請求中包含必要的 Cookie 和 Referer headers
- 模擬正常瀏覽器請求以確保訂票流程順利

## 注意事項

- 需要網路連線以呼叫威秀 API
- **需登入才能直接進入結帳畫面**：使用訂票功能前，請先開啟威秀網站並完成登入，確保有有效的瀏覽器 session 和 Cookie
- API 回應格式可能需要根據實際回應調整
- 圖示檔案需要自行建立或移除 manifest.json 中的圖示引用

## 開發規範

本專案使用 OpenSpec 進行規格驅動開發：
- 所有功能變更都需要先建立 OpenSpec change proposal
- 規格文件位於 `openspec/specs/` 目錄
- 使用 Conventional Commits 格式提交變更

## 學術研究聲明

本專案僅用於學術研究。  
請支持手動購票，等待的過程與忐忑的心也是購票的醍醐味，困難的道路才有豐碩的果實。

![要享受這個過程](./img/1658228256824.gif)