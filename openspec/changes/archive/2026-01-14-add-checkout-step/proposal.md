# Change: 新增 Checkout 步驟

## Why
在現有的訂票流程中，完成座位預訂後需要進行結帳（checkout）步驟，以完成整個訂票流程。此步驟會呼叫威秀的 Checkout API，將訂單提交到結帳系統。

## What Changes
- 在訂票流程中新增 checkout 步驟
- 在座位預訂成功後，自動呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/Checkout` API
- 不檢查 HTTP status code，僅將 response 透過 console.log 輸出
- 在 `utils/api.ts` 新增 `checkout()` 函數
- 在 `popup/popup.js` 的訂票流程中整合 checkout 呼叫

## Impact
- Affected specs: `order-confirmation`
- Affected code: 
  - `utils/api.ts` - 新增 checkout API 函數
  - `popup/popup.js` - 在訂票流程中整合 checkout 呼叫
