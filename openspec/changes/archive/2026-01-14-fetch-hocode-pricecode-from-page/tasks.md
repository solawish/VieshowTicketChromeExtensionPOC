## 1. 實作網頁內容抓取功能
- [x] 1.1 新增函數來構建目標 URL（包含 cinemacode 和 txtSessionId 參數）
- [x] 1.2 新增函數來抓取網頁 HTML 內容（使用 fetch API）
- [x] 1.3 新增函數來解析 HTML 並提取 select 元素的 data-hocode 和 data-pricecode 屬性
- [x] 1.4 處理 XPath 或 CSS selector 來定位目標 select 元素
- [x] 1.5 實作錯誤處理（當無法取得值時的降級機制）

## 2. 修改訂票流程
- [x] 2.1 在 `handleConfirmOrder` 函數中，在呼叫 OrderTickets API 前先取得 HoCode 和 PriceCode
- [x] 2.2 修改 `confirmOrder` API 呼叫，使用動態取得的 HoCode 和 PriceCode
- [x] 2.3 更新訂票參數的構建邏輯，移除固定值

## 3. 測試與驗證
- [ ] 3.1 測試從不同場次頁面抓取 HoCode 和 PriceCode
- [ ] 3.2 測試當網頁結構變更時的錯誤處理
- [ ] 3.3 測試訂票流程的完整流程（包含動態值）
- [ ] 3.4 驗證訂票 API 呼叫是否成功使用動態值
