# Change: 在訂單 API 送出後新增座位選擇流程

## Why
在訂票 API 成功送出後，需要進一步取得座位選擇頁面，解析 HTML 中的座位圖座標，以便後續進行自動選座功能。這個流程是訂票流程的延伸，讓系統能夠取得當前可選的座位資訊。

## What Changes
- 在 `confirmOrder` API 成功後，新增呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/SelectSeats` 的流程
- 實作 HTML 解析功能，從回應中提取座位座標資訊
- 定義座位座標系統（右下角為原點，SeatGridRowID: 1, GridSeatNum: 1）
- 解析 HTML 表格中 `img src="../img/standard_selected.png"` 的座位並轉換為座標
- 將解析出的座標透過 console.log 輸出（暫時不進行後續處理）

## Impact
- **Affected specs**: `order-confirmation` (需要 MODIFIED 以包含座位選擇流程)
- **Affected code**: 
  - `utils/api.ts` - 新增 `selectSeats()` 函數和座位解析相關函數
  - `popup/popup.js` - 在 `handleConfirmOrder` 中整合座位選擇流程
- **New capability**: `seat-selection` - 座位選擇與座標解析功能
