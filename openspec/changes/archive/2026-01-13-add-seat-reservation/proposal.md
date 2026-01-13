# Change: 新增座位預訂功能

## Why
目前系統已經能夠解析座位座標，但缺少實際預訂座位的功能。使用者需要能夠將解析出的座位座標提交到威秀系統進行預訂，完成整個訂票流程的最後一步。

## What Changes
- 新增 `reserveSeats` API 函數，呼叫威秀座位預訂 API
- 在座位座標解析成功後，自動呼叫座位預訂 API
- 支援多個座位的預訂（使用 SelectedSeats[0], SelectedSeats[1]... 格式）
- 包含必要的 Cookie 和 Referer header
- 使用 application/x-www-form-urlencoded 格式傳送資料
- 在 popup 回應框中顯示解析出的座位座標資訊
- 在 popup 回應框中顯示預訂 API 的回應資訊（HTTP status 和 response body）

## Impact
- Affected specs: `seat-selection` (新增座位預訂功能)
- Affected code: 
  - `utils/api.ts` (新增 `reserveSeats` 函數)
  - `popup/popup.js` (在座位解析後呼叫預訂 API)
