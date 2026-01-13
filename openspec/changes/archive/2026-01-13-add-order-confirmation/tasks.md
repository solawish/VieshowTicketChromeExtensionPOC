## 1. 權限設定
- [x] 1.1 在 `manifest.json` 中新增 `"permissions": ["cookies"]` 權限
- [x] 1.2 在 `manifest.json` 的 `host_permissions` 中新增 `https://sales.vscinemas.com.tw/*`

## 2. API 實作
- [x] 2.1 在 `utils/api.ts` 新增 `getCookiesForDomain()` 函數，使用 `chrome.cookies.getAll({ domain: 'sales.vscinemas.com.tw' })` 取得該 domain 的所有 cookie
- [x] 2.2 實作將 cookie 陣列格式化為 Cookie header 字串的函數
- [x] 2.3 實作從 `1|TP` 格式中提取數字部分的函數（用於 cinemacode 和 CinemaId）
- [x] 2.4 實作構建 Referer URL 的函數，從下拉選單的值中取得 cinemacode（只取數字部分）和 txtSessionId
- [x] 2.5 實作 SessionTime 格式化函數，將場次時間轉換為 am/pm 制（例如：`1/16/2026 7:30:00 PM`）
- [x] 2.6 在 `utils/api.ts` 新增 `confirmOrder()` 函數
- [x] 2.7 實作 POST 請求到 `https://sales.vscinemas.com.tw/VieShowTicketT2/Home/OrderTickets`
- [x] 2.8 實作 `application/x-www-form-urlencoded` 格式的請求體
- [x] 2.9 在請求 headers 中包含 Cookie header
- [x] 2.10 在請求 headers 中包含 Referer header
- [x] 2.11 實作下拉選單值到 API 參數的映射邏輯（cinemacode 和 CinemaId 只取數字部分，PriceCode 固定為 `0001`，Qty 從票數選單取得，SessionTime 轉換為 am/pm 制）
- [x] 2.12 處理 API 回應和錯誤狀態（根據 HTTP status code 判斷成功/失敗）

## 3. UI 實作
- [x] 3.1 在 `popup/popup.html` 新增票數下拉選單（在時間選單下方）
- [x] 3.2 在 `popup/popup.html` 新增「確認訂票」按鈕（在票數選單下方）
- [x] 3.3 在 `popup/popup.html` 新增訂單回應輸出框（在按鈕下方）
- [x] 3.4 在 `popup/popup.js` 實作按鈕啟用/禁用邏輯（包含票數選單的檢查）
- [x] 3.5 監聽所有下拉選單（包括票數選單）的變更事件，更新按鈕狀態
- [x] 3.6 實作按鈕點擊事件處理
- [x] 3.7 顯示訂票確認的載入狀態
- [x] 3.8 顯示訂票結果（成功/失敗訊息）
- [x] 3.9 實作 HTTP status code 顯示邏輯
- [x] 3.10 在訂單回應輸出框中顯示 HTTP status code（例如：`200 OK`、`400 Bad Request` 等）

## 4. 樣式
- [x] 4.1 在 `popup/popup.css` 新增按鈕樣式（如需要）
- [x] 4.2 實作按鈕禁用狀態的視覺樣式
- [x] 4.3 在 `popup/popup.css` 新增訂單回應輸出框樣式
- [x] 4.4 實作輸出框的顯示樣式（如固定高度、可滾動、等寬字體等）

## 5. 測試與驗證
- [ ] 5.1 測試票數選單的顯示和選項（確認選項正確）
- [ ] 5.2 測試按鈕在所有下拉選單（包括票數選單）未選擇時為禁用狀態
- [ ] 5.3 測試按鈕在所有下拉選單（包括票數選單）都有選擇時為啟用狀態
- [ ] 5.4 測試 cookie 取得功能（確認能正確取得 sales.vscinemas.com.tw domain 的 cookie）
- [ ] 5.5 測試 cinemacode 和 CinemaId 的提取（確認從 `1|TP` 格式中正確提取數字部分）
- [ ] 5.6 測試 SessionTime 格式化（確認正確轉換為 am/pm 制）
- [ ] 5.7 測試 PriceCode 固定為 `0001`
- [ ] 5.8 測試 Qty 從票數選單正確取得
- [ ] 5.9 測試 Referer header 的構建（確認 cinemacode 只取數字部分和 txtSessionId 正確從下拉選單取得）
- [ ] 5.10 測試 API 呼叫的參數映射正確性（包含票數參數）
- [ ] 5.11 測試 API 請求中包含正確的 Cookie header
- [ ] 5.12 測試 API 請求中包含正確的 Referer header
- [ ] 5.13 測試 API 成功回應的處理（根據 HTTP status code 200 判斷成功）
- [ ] 5.14 測試 API 錯誤回應的處理（根據 HTTP status code 400、500 等判斷失敗）
- [ ] 5.15 測試 cookie 取得失敗時的處理（應記錄錯誤但繼續流程）
- [ ] 5.16 測試訂單回應輸出框的顯示（確認 HTTP status code 正確顯示）
