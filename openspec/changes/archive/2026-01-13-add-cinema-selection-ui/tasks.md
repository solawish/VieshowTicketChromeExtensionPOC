## 1. 專案基礎設定
- [x] 1.1 建立 `manifest.json` 設定檔（Manifest V3）
- [x] 1.2 設定 popup 頁面路徑和權限（host_permissions 用於 API 呼叫）
- [x] 1.3 建立專案目錄結構（popup/, utils/, background/）

## 2. API 服務層
- [x] 2.1 建立 `utils/api.ts` 模組
- [x] 2.2 實作 `getCinemas()` 呼叫 `GetLstDicCinema` API
- [x] 2.3 實作 `getMovies(cinema: string)` 呼叫 `GetLstDicMovie` API
- [x] 2.4 實作 `getDates(cinema: string, movie: string)` 呼叫 `GetLstDicDate` API
- [x] 2.5 實作 `getSessions(cinema: string, movie: string, date: string)` 呼叫 `GetLstDicSession` API
- [x] 2.6 新增錯誤處理和重試機制

## 3. UI 實作
- [x] 3.1 建立 `popup/popup.html` 頁面結構
- [x] 3.2 建立 `popup/popup.css` 樣式檔案
- [x] 3.3 建立 `popup/popup.ts` 主要邏輯
- [x] 3.4 實作四個下拉選單（`<select>` 元素）
- [x] 3.5 實作載入狀態顯示（loading indicator）
- [x] 3.6 實作錯誤訊息顯示

## 4. 級聯選擇邏輯
- [x] 4.1 實作影城選擇後載入片名選單
- [x] 4.2 實作片名選擇後載入日期選單
- [x] 4.3 實作日期選擇後載入時間選單
- [x] 4.4 實作選擇變更時重置後續選單
- [x] 4.5 實作選單禁用狀態（未選擇前置選項時禁用）

## 5. 測試與驗證
- [ ] 5.1 手動測試四個 API 端點回應格式
- [ ] 5.2 測試級聯選擇流程（影城 → 片名 → 日期 → 時間）
- [ ] 5.3 測試錯誤處理（API 失敗、網路錯誤）
- [ ] 5.4 測試選單重置邏輯
- [ ] 5.5 驗證 UI 在不同螢幕尺寸下的顯示
