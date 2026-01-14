# Change: 從網頁動態抓取 HoCode 和 PriceCode

## Why
目前 OrderTickets API 的 `HoCode` 和 `PriceCode` 參數使用固定值（`HO00000001` 和 `0001`），但實際上這些值應該根據不同的場次和票種動態取得。威秀網站在訂票頁面中提供了包含這些資訊的下拉式表單，我們需要從該頁面抓取正確的值以確保訂票請求的準確性。

## What Changes
- **新增功能**：從威秀訂票頁面抓取 HoCode 和 PriceCode 值
- **修改訂票流程**：在呼叫 OrderTickets API 前，先從目標頁面取得動態的 HoCode 和 PriceCode
- **修改 API 參數**：將固定的 HoCode 和 PriceCode 改為從網頁抓取的動態值
- **新增錯誤處理**：當無法從網頁取得值時的降級處理機制

## Impact
- **Affected specs**: `order-confirmation`
- **Affected code**: 
  - `popup/popup.js` - 訂票確認處理邏輯
  - `utils/api.js` / `utils/api.ts` - OrderTickets API 呼叫邏輯
  - 可能需要新增工具函數來抓取和解析網頁內容
