# popup-form-persistence Specification (Delta)

## Purpose
在 API 資料重新讀取後仍存在的情況下，保存並還原 popup 內每一個下拉選單與輸入框的值，以提升使用者體驗。

## ADDED Requirements

### Requirement: 表單欄位持久化儲存
系統 SHALL 使用 Chrome Extension 的 `chrome.storage.local` 儲存 popup 內所有下拉選單與輸入框的當前值（影城、片名、日期、時間、票種關鍵詞、票數）。

#### Scenario: 儲存時機
- **WHEN** 使用者變更影城、片名、日期、時間或票數下拉選單的選擇
- **THEN** 將當前表單狀態（含該欄位與其他已儲存欄位）寫入 `chrome.storage.local`
- **AND** 使用者變更票種關鍵詞輸入框時，亦將當前值寫入儲存（可採防抖以減少寫入次數）

#### Scenario: 儲存格式
- **WHEN** 寫入儲存
- **THEN** 使用單一 key（例如 `popupFormValues`）儲存一物件
- **AND** 物件包含欄位：`cinema`、`movie`、`date`、`time`、`ticketTypeKeyword`、`quantity`
- **AND** 未選擇或空值以空字串或合理預設表示

### Requirement: 表單欄位還原
系統 SHALL 在 popup 載入與每次 API 填完選單後，自儲存讀取先前值；僅在「該值仍存在於當前選單選項」時還原下拉選單，輸入框與票數在合法範圍內直接還原。

#### Scenario: 還原時機
- **WHEN** popup 載入完成並完成影城選單 API 載入與填入選項
- **THEN** 若儲存的影城值存在於當前影城選項中，則將影城選單設為該值並觸發片名選單載入
- **AND** 片名選單 API 載入並填入選項後，若儲存的片名值存在於當前片名選項中，則設為該值並觸發日期選單載入
- **AND** 日期選單 API 載入並填入選項後，若儲存的日期值存在於當前日期選項中，則設為該值並觸發時間選單載入
- **AND** 時間選單 API 載入並填入選項後，若儲存的時間值存在於當前時間選項中，則設為該值

#### Scenario: 還原條件
- **WHEN** 還原下拉選單（影城、片名、日期、時間）
- **THEN** 僅當儲存值存在於該選單的當前選項（option value 比對）時才設定選單值
- **AND** 若儲存值不存在於當前選項，則不變更該選單（維持 API 填入後的預設或空）
- **AND** 票種關鍵詞輸入框直接還原儲存字串（若無則為空）
- **AND** 票數僅當儲存值為 1–8 時才還原，否則維持預設

#### Scenario: API 重新讀取後仍存在
- **WHEN** API 重新讀取並填入選單選項後
- **THEN** 若先前儲存的值仍在當前選項列表中，則還原該欄位
- **AND** 若先前儲存的值已不在當前選項列表中（例如場次已下片），則不還原該欄位，避免選到無效選項
