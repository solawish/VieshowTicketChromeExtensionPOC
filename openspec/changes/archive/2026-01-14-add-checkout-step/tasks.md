## 1. API 函數實作
- [x] 1.1 在 `utils/api.ts` 新增 `checkout()` 函數
- [x] 1.2 實作 POST 請求到 `https://sales.vscinemas.com.tw/VieShowTicketT2/Home/Checkout`
- [x] 1.3 實作 Cookie 和 Referer header 的處理（與現有的 `confirmOrder` 和 `reserveSeats` 一致）
- [x] 1.4 不檢查 HTTP status code，直接回傳 Response 物件

## 2. 訂票流程整合
- [x] 2.1 在 `popup/popup.js` 的 `handleConfirmOrder` 函數中，在 `reserveSeats` 成功後呼叫 `checkout()`
- [x] 2.2 使用 `console.log` 輸出 checkout API 的 response
- [x] 2.3 確保 checkout 呼叫不影響現有的訂票流程（即使失敗也不中斷流程）

## 3. 測試與驗證
- [x] 3.1 驗證 checkout API 正確呼叫
- [x] 3.2 驗證 response 正確輸出到 console
- [x] 3.3 驗證訂票流程完整性（從訂票到 checkout 的完整流程）
