# Change: 新增 popup 表單欄位儲存與還原

## Why
使用者關閉 popup 後再開啟，或 API 重新載入選單選項後，希望先前選擇的影城、片名、日期、時間、票種關鍵詞、票數能保留。僅在重新載入後該值仍存在於目前選項中時才還原下拉選單，避免選到已不存在的選項。

## What Changes
- 使用 Chrome Extension 的 `chrome.storage.local` 儲存 popup 內每一個下拉選單與輸入框的值（影城、片名、日期、時間、票種關鍵詞、票數）。
- 在欄位變更時寫入儲存；在 popup 載入與每次 API 填完選單後，若儲存值存在於目前選項則還原該欄位。
- 下拉選單僅在「儲存值存在於當前選單選項」時還原；輸入框（票種關鍵詞）與票數選單（固定選項）可直接還原。

## Impact
- Affected specs: 新增 capability `popup-form-persistence`
- Affected code: popup/popup.js、manifest.json（若需宣告 storage 權限；MV3 預設可用 storage）
