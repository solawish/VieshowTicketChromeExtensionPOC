# Design: popup 表單欄位持久化

## Context
- popup 有級聯選單（影城 → 片名 → 日期 → 時間）與獨立欄位（票種關鍵詞、票數）。選單選項來自 API，關閉 popup 後再開啟會重新呼叫 API，選項可能與上次相同或不同。
- 需在不儲存敏感個資的前提下保留使用者選擇，且僅在 API 重新讀取後「仍存在」的選項才還原。

## Goals / Non-Goals
- **Goals**: 儲存並還原 popup 內所有下拉選單與輸入框；還原時僅在儲存值存在於當前選項時套用。
- **Non-Goals**: 不持久化訂單回應框內容、不跨裝置同步（使用 local 即可）。

## Decisions
- **儲存媒介**: 使用 `chrome.storage.local`，單一 key（例如 `popupFormValues`）存一物件 `{ cinema, movie, date, time, ticketTypeKeyword, quantity }`。
- **寫入時機**: 各下拉選單與票數在 `change` 時寫入；票種關鍵詞在 `input` 或 `change` 時寫入（可防抖）。
- **還原時機**: 影城在 `loadCinemas()` 完成並 `populateSelect` 後還原，若還原成功則觸發 `loadMovies()`；片名在 `loadMovies()` 完成後還原並視需要觸發 `loadDates()`；依此類推。票種關鍵詞與票數在 DOM 就緒後即可還原。
- **還原條件**: 下拉選單僅當 `items.some(item => item.value === savedValue)` 時才設定 `select.value`；票數僅當值在 1–8 時還原；票種關鍵詞直接還原字串。

## Risks / Trade-offs
- **選項順序或 value 格式變更**: API 若變更 value 格式，儲存值可能無法匹配，行為為不還原該欄位，可接受。
- **寫入頻率**: 票種關鍵詞若用 `input` 需防抖，避免過度寫入。
