# 威秀電影票選擇工具

Chrome Extension 協助使用者快速選擇威秀影城的電影場次資訊。

## 功能

- 四個級聯下拉選單：影城 → 片名 → 日期 → 時間
- 自動載入選單資料
- 錯誤處理和載入狀態顯示

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
│   ├── api.js          # API 服務
│   └── api.ts          # TypeScript 原始碼
└── background/         # Background scripts（目前未使用）
```

### API 端點

- `GET /api/GetLstDicCinema` - 取得影城列表
- `GET /api/GetLstDicMovie?cinema={cinema}` - 取得電影列表
- `GET /api/GetLstDicDate?cinema={cinema}&movie={movie}` - 取得日期列表
- `GET /api/GetLstDicSession?cinema={cinema}&movie={movie}&date={date}` - 取得時間列表

## 注意事項

- 需要網路連線以呼叫威秀 API
- API 回應格式可能需要根據實際回應調整
- 圖示檔案需要自行建立或移除 manifest.json 中的圖示引用
