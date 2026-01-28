# Change: 新增票種關鍵詞輸入框與票種選擇優先順序

## Why
目前票種僅會選擇「全票」，使用者無法指定其他票種（例如單人套票或自訂關鍵詞）。需要提供可選的「票種關鍵詞」輸入框，並在無關鍵詞時依序嘗試「全票」→「單人套票」→ 第一個票種，以兼顧預設行為與彈性。

## What Changes
- 在 popup 的時間選單與票數選單之間新增「票種關鍵詞」輸入框（可選欄位）。
- 取得 HoCode/PriceCode 時，若票種關鍵詞有值則優先依該關鍵詞匹配票種名稱；若無值則依序尋找名稱含有「全票」、含有「單人套票」的票種，皆無則使用所有票種中的第一個。
- API 層（`getHoCodeAndPriceCode` / `extractHoCodeAndPriceCode`）支援傳入可選的票種關鍵詞參數。

## Impact
- Affected specs: order-confirmation
- Affected code: popup/popup.html, popup/popup.js（或 popup.ts）, utils/api.ts, utils/api.js
