## 1. 實作座位預訂 API 函數
- [x] 1.1 在 `utils/api.ts` 中新增 `ReserveSeatsParams` 介面
- [x] 1.2 實作 `reserveSeats` 函數，呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/ReserveSeats`
- [x] 1.3 實作 Cookie 和 Referer header 的處理（與現有的 `confirmOrder` 和 `selectSeats` 一致）
- [x] 1.4 實作多個座位的 POST data 格式化（SelectedSeats[0], SelectedSeats[1]...）
- [x] 1.5 處理 API 回應和錯誤情況

## 2. 整合座位預訂到訂票流程
- [x] 2.1 在 `popup/popup.js` 的 `handleConfirmOrder` 函數中，於座位座標解析成功後呼叫 `reserveSeats`
- [x] 2.2 處理座位預訂的成功和失敗情況
- [x] 2.3 在 console 輸出預訂結果
- [x] 2.4 在 popup 回應框中顯示解析出的座位座標資訊
- [x] 2.5 在 popup 回應框中顯示預訂 API 的回應（HTTP status 和 response body）
- [x] 2.6 確保回應框內容累積顯示（訂票回應 → 座位座標 → 預訂回應）

## 3. 測試與驗證
- [ ] 3.1 測試單一座位預訂
- [ ] 3.2 測試多個座位預訂
- [ ] 3.3 測試錯誤處理（API 失敗、網路錯誤等）
- [ ] 3.4 驗證 Cookie 和 Referer header 正確傳送
- [ ] 3.5 驗證 popup 回應框正確顯示座位座標資訊
- [ ] 3.6 驗證 popup 回應框正確顯示預訂 API 回應
- [ ] 3.7 驗證回應框內容格式清晰易讀
