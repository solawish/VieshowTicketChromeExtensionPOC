# Change: 新增訂票確認功能

## Why
使用者完成影城、片名、日期、時間的選擇後，需要一個功能來確認訂票種類並提交訂票請求。這是訂票流程中的關鍵步驟，讓使用者能夠將選擇的場次資訊提交到威秀訂票系統。

## What Changes
- 在 popup.html 新增票數下拉選單（在時間選單下方）
- 在 popup.html 新增「確認訂票」按鈕
- 實作按鈕啟用/禁用邏輯：當所有下拉選單（影城、片名、日期、時間、票數）都有選擇時才啟用
- 在 `utils/api.ts` 新增 `confirmOrder()` 函數，呼叫威秀訂票 API
- 實作下拉選單值到 API 參數的映射邏輯
- 實作取得瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie 並包含在 API 請求中
- 在 API 請求 headers 中加入 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- 處理 API 回應和錯誤狀態
- 顯示訂票確認的載入狀態和結果
- 在 popup.html 下方新增輸出框，顯示「訂單回應:」並顯示 HTTP status code

## Impact
- **Affected specs**: `cinema-selection` (新增訂票確認相關需求)
- **Affected code**: 
  - `popup/popup.html` - 新增按鈕 UI 和訂單回應輸出框
  - `popup/popup.js` - 新增按鈕事件處理、驗證邏輯和 API 回應顯示邏輯
  - `popup/popup.css` - 新增按鈕和輸出框樣式（如需要）
  - `utils/api.ts` - 新增訂票 API 呼叫函數和 cookie 取得邏輯
  - `manifest.json` - 新增 cookies 權限和 sales.vscinemas.com.tw 的 host_permissions

## Notes
- API 參數映射需要從下拉選單的值中提取對應資訊（如 SessionId、HoCode 等）
- 票數（Qty）從票數下拉選單取得，不再使用預設值
- PriceCode 固定使用 `0001`
- 需要確認 API 回應格式以正確處理成功/失敗狀態
- 訂票 API 需要包含瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie，以維持使用者會話狀態
- API 請求需要包含 Referer header，參數從下拉選單的值中取得（cinemacode 從影城選單，txtSessionId 從時間選單）
