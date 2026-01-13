## ADDED Requirements

### Requirement: Chrome Extension Popup 介面
系統 SHALL 提供一個 Chrome Extension popup HTML 畫面，當使用者點擊 extension 圖示時顯示。

#### Scenario: 開啟 popup 畫面
- **WHEN** 使用者點擊 Chrome Extension 圖示
- **THEN** 顯示 popup HTML 畫面
- **AND** 畫面包含四個下拉選單：影城、片名、日期、時間

### Requirement: 影城選單載入
系統 SHALL 在 popup 開啟時自動載入影城選單的選項。

#### Scenario: 初始載入影城資料
- **WHEN** popup 畫面載入完成
- **THEN** 自動呼叫 `GET https://www.vscinemas.com.tw/api/GetLstDicCinema` API
- **AND** 將回應的影城資料填入影城下拉選單
- **AND** 顯示載入狀態直到資料載入完成

### Requirement: 片名選單級聯載入
系統 SHALL 在使用者選擇影城後，自動載入對應的片名選單選項。

#### Scenario: 選擇影城後載入片名
- **WHEN** 使用者在影城下拉選單中選擇一個影城（例如：`1|TP`）
- **THEN** 自動呼叫 `GET https://www.vscinemas.com.tw/api/GetLstDicMovie?cinema={selectedCinema}` API
- **AND** 將回應的片名資料填入片名下拉選單
- **AND** 清除並禁用日期和時間選單
- **AND** 顯示載入狀態直到片名資料載入完成

### Requirement: 日期選單級聯載入
系統 SHALL 在使用者選擇片名後，自動載入對應的日期選單選項。

#### Scenario: 選擇片名後載入日期
- **WHEN** 使用者在片名下單選單中選擇一個片名（例如：`HO00016767`）
- **AND** 已選擇影城（例如：`1|TP`）
- **THEN** 自動呼叫 `GET https://www.vscinemas.com.tw/api/GetLstDicDate?cinema={selectedCinema}&movie={selectedMovie}` API
- **AND** 將回應的日期資料填入日期下拉選單
- **AND** 清除並禁用時間選單
- **AND** 顯示載入狀態直到日期資料載入完成

### Requirement: 時間選單級聯載入
系統 SHALL 在使用者選擇日期後，自動載入對應的時間選單選項。

#### Scenario: 選擇日期後載入時間
- **WHEN** 使用者在日期下拉選單中選擇一個日期（例如：`2026/01/13`）
- **AND** 已選擇影城（例如：`1|TP`）和片名（例如：`HO00016767`）
- **THEN** 自動呼叫 `GET https://www.vscinemas.com.tw/api/GetLstDicSession?cinema={selectedCinema}&movie={selectedMovie}&date={selectedDate}` API
- **AND** 將回應的時間資料填入時間下拉選單
- **AND** 顯示載入狀態直到時間資料載入完成

### Requirement: 選單禁用狀態管理
系統 SHALL 在未選擇前置選項時，禁用後續選單。

#### Scenario: 未選擇影城時禁用片名選單
- **WHEN** 影城選單未選擇或選擇被清除
- **THEN** 片名、日期、時間選單均被禁用
- **AND** 這些選單的選項被清除

#### Scenario: 未選擇片名時禁用日期選單
- **WHEN** 片名選單未選擇或選擇被清除
- **THEN** 日期和時間選單被禁用
- **AND** 這些選單的選項被清除

#### Scenario: 未選擇日期時禁用時間選單
- **WHEN** 日期選單未選擇或選擇被清除
- **THEN** 時間選單被禁用
- **AND** 時間選單的選項被清除

### Requirement: API 錯誤處理
系統 SHALL 在 API 呼叫失敗時顯示錯誤訊息，並允許使用者重試。

#### Scenario: API 呼叫失敗
- **WHEN** 任何 API 呼叫失敗（網路錯誤、HTTP 錯誤等）
- **THEN** 顯示使用者友善的錯誤訊息
- **AND** 提供重試選項（如需要）
- **AND** 不影響已載入的選單選項

### Requirement: 載入狀態顯示
系統 SHALL 在載入 API 資料時顯示載入狀態指示器。

#### Scenario: 顯示載入狀態
- **WHEN** 正在載入任何選單的資料
- **THEN** 在對應的選單區域顯示載入指示器（例如：spinner 或 "載入中..." 文字）
- **AND** 該選單顯示為禁用狀態
