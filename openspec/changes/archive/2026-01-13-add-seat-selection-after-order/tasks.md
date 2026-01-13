## 1. 實作座位選擇 API 呼叫
- [x] 1.1 在 `utils/api.ts` 新增 `selectSeats()` 函數
- [x] 1.2 實作 POST 請求到 `https://sales.vscinemas.com.tw/VieShowTicketT2/Home/SelectSeats`
- [x] 1.3 確保請求包含 Cookie header（使用現有的 `getCookiesForDomain` 和 `formatCookiesAsHeader`）
- [x] 1.4 確保請求包含 Referer header（使用現有的 `buildRefererUrl`）

## 2. 實作 HTML 解析與座標轉換
- [x] 2.1 新增 `parseSeatCoordinates()` 函數來解析 HTML 回應
- [x] 2.2 實作座標系統定義（右下角為 SeatGridRowID: 1, GridSeatNum: 1）
- [x] 2.3 解析 HTML 表格，找出所有 `img src="../img/standard_selected.png"` 的座位
- [x] 2.4 將 HTML 表格位置轉換為座標系統（往上 SeatGridRowID +1，往左 GridSeatNum +1）
- [x] 2.5 回傳座標陣列，格式為 `{ SeatGridRowID: number, GridSeatNum: number }[]`

## 3. 整合到訂票流程
- [x] 3.1 在 `popup/popup.js` 的 `handleConfirmOrder` 函數中，在 `confirmOrder` 成功後呼叫 `selectSeats()`
- [x] 3.2 解析座位座標並透過 `console.log` 輸出結果
- [x] 3.3 處理錯誤情況（API 失敗、HTML 解析失敗等）

## 4. 驗證與測試
- [x] 4.1 驗證 API 呼叫正確包含 Cookie 和 Referer
- [x] 4.2 驗證 HTML 解析能正確提取座位座標
- [x] 4.3 驗證座標轉換符合定義的座標系統
- [x] 4.4 測試各種座位配置情況（不同影廳大小、不同座位排列）
