# Change: 新增電影選擇介面

## Why
使用者需要一個直觀的介面來選擇威秀影城的電影場次資訊。目前缺少一個統一的選擇介面，讓使用者能夠依序選擇影城、片名、日期和時間，以簡化訂票流程的前置步驟。

## What Changes
- 新增 Chrome Extension popup HTML 畫面
- 實作四個級聯下拉選單：影城、片名、日期、時間
- 整合威秀 API 端點以取得選單資料
- 實作依序載入機制：選擇上一個選項後自動載入下一個選單的資料
- 新增 API 服務模組處理四個 API 呼叫
- 新增狀態管理處理選單之間的依賴關係

## Impact
- Affected specs: 新增 `cinema-selection` capability
- Affected code: 
  - 新增 `popup/` 目錄（HTML, CSS, TypeScript）
  - 新增 `manifest.json` 設定 popup 和權限
  - 新增 `utils/api.ts` 處理 API 呼叫
  - 新增 `utils/state.ts` 管理選擇狀態（如需要）
