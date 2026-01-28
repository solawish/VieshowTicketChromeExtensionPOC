## 1. UI
- [x] 1.1 在 popup.html 的時間選單與票數選單之間新增「票種關鍵詞」輸入框（label、id、placeholder 可選）
- [x] 1.2 在 popup.js 中取得該輸入框的 DOM 參考，並在確認訂票時讀取其值（trim 後可為空）

## 2. API 與票種選擇邏輯
- [x] 2.1 在 utils/api 中為 `getHoCodeAndPriceCode` 新增可選參數「票種關鍵詞」（例如 `ticketTypeKeyword?: string`）
- [x] 2.2 在 utils/api 中為 `extractHoCodeAndPriceCode` 新增可選參數「票種關鍵詞」，並實作選擇優先順序：有關鍵詞則依名稱包含關鍵詞匹配 → 無則名稱包含「全票」→ 無則名稱包含「單人套票」→ 無則取第一個票種
- [x] 2.3 從 popup 呼叫 `getHoCodeAndPriceCode` 時傳入票種關鍵詞輸入框的值（空字串視為未填寫，使用 fallback）

## 3. 驗證
- [ ] 3.1 手動測試：不填票種關鍵詞時，行為為全票 → 單人套票 → 第一個
- [ ] 3.2 手動測試：填寫票種關鍵詞時，選擇名稱含有該關鍵詞的票種
