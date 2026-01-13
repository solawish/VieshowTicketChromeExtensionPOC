# order-confirmation Specification

## Purpose
提供訂票確認功能，讓使用者在選擇影城、片名、日期、時間和票數後，能夠提交訂票請求到威秀訂票系統。系統會自動取得必要的 cookie、構建正確的 API 參數、包含 Referer header，並顯示訂票結果。
## Requirements
### Requirement: 訂票確認按鈕
系統 SHALL 在 popup 畫面中提供一個「確認訂票」按鈕，讓使用者提交訂票請求。

#### Scenario: 顯示票數選單和訂票確認按鈕
- **WHEN** popup 畫面載入完成
- **THEN** 在時間選單下方顯示票數下拉選單
- **AND** 票數選單包含選項（例如：1、2、3、4 等）
- **AND** 在票數選單下方顯示「確認訂票」按鈕
- **AND** 按鈕初始狀態為禁用

#### Scenario: 按鈕啟用條件
- **WHEN** 所有下拉選單（影城、片名、日期、時間、票數）都有選擇值
- **THEN** 「確認訂票」按鈕變為啟用狀態
- **AND** 使用者可以點擊按鈕

#### Scenario: 按鈕禁用條件
- **WHEN** 任何一個下拉選單（影城、片名、日期、時間、票數）未選擇或選擇被清除
- **THEN** 「確認訂票」按鈕變為禁用狀態
- **AND** 使用者無法點擊按鈕

### Requirement: 訂票 API 呼叫
系統 SHALL 在使用者點擊「確認訂票」按鈕時，呼叫威秀訂票 API 提交訂票請求。

#### Scenario: 提交訂票請求
- **WHEN** 使用者點擊「確認訂票」按鈕
- **AND** 所有下拉選單（影城、片名、日期、時間、票數）都有選擇值
- **THEN** 取得瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie
- **AND** 呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/OrderTickets` API
- **AND** 使用 `application/x-www-form-urlencoded` 格式傳送請求
- **AND** 在請求 headers 中包含所有取得的 cookie（Cookie header）
- **AND** 在請求 headers 中包含 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** 將下拉選單的值映射到對應的 API 參數

#### Scenario: API 參數映射
- **WHEN** 提交訂票請求
- **THEN** API 請求包含以下參數：
  - `cinemacode`: 從影城選單的值中提取，如果格式為 `1|TP`，只取前面的數字部分（例如：`1`）
  - `txtSessionId`: 從時間選單的值取得（SessionId）
  - `Orders[OrderTickets][0][CinemaId]`: 從影城選單的值中提取，如果格式為 `1|TP`，只取前面的數字部分（例如：`1`）
  - `Orders[OrderTickets][0][SessionId]`: 從時間選單的值取得
  - `Orders[OrderTickets][0][HoCode]`: 固定使用 `HO00000001`
  - `Orders[OrderTickets][0][PriceCode]`: 固定使用 `0001`
  - `Orders[OrderTickets][0][Qty]`: 從票數下拉選單的值取得
  - `SessionTime`: 從場次時間（時間選單的 label）取得，並轉換為 am/pm 制格式（例如：`1/16/2026 7:30:00 PM`）
  - `MovieName`: 從片名選單的顯示文字（label）取得

### Requirement: 訂票載入狀態
系統 SHALL 在提交訂票請求時顯示載入狀態。

#### Scenario: 顯示載入狀態
- **WHEN** 使用者點擊「確認訂票」按鈕
- **THEN** 顯示載入指示器（例如：spinner 或 "處理中..." 文字）
- **AND** 「確認訂票」按鈕變為禁用狀態
- **AND** 所有下拉選單（包括票數選單）變為禁用狀態（防止在處理期間修改選擇）

### Requirement: Cookie 處理
系統 SHALL 在提交訂票請求前，取得瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie 並包含在 API 請求中。

#### Scenario: 取得並包含 Cookie
- **WHEN** 使用者點擊「確認訂票」按鈕
- **THEN** 使用 Chrome Extension `chrome.cookies` API 取得 `sales.vscinemas.com.tw` domain 的所有 cookie
- **AND** 將 cookie 格式化為 Cookie header 字串
- **AND** 在 API 請求的 headers 中包含 Cookie header
- **AND** 如果取得 cookie 失敗，記錄錯誤但繼續訂票流程（某些情況下可能不需要 cookie）

### Requirement: Referer Header
系統 SHALL 在 API 請求中包含 Referer header，以模擬正常瀏覽器請求。

#### Scenario: 包含 Referer Header
- **WHEN** 提交訂票請求
- **THEN** 從下拉選單的值中取得 Referer URL 的參數：
  - `cinemacode`: 從影城選單的值中提取，如果格式為 `1|TP`，只取前面的數字部分（例如：`1`）
  - `txtSessionId`: 從時間選單的值取得（SessionId）
- **AND** 構建 Referer URL：`https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** 在 API 請求的 headers 中包含 `Referer: {refererUrl}`

### Requirement: 訂票結果處理
系統 SHALL 處理訂票 API 的回應並顯示結果給使用者，並在成功後自動進行座位選擇流程。

#### Scenario: 訂票成功
- **WHEN** 訂票 API 回應 HTTP status code 為成功（例如：200）
- **THEN** 隱藏載入指示器
- **AND** 顯示成功訊息給使用者
- **AND** 在訂單回應輸出框中顯示 HTTP status code（例如：`200 OK`）
- **AND** 自動呼叫座位選擇 API 取得座位選擇頁面
- **AND** 解析並輸出座位座標資訊（透過 console.log）
- **AND** 恢復按鈕和下拉選單的啟用狀態（或導向下一步驟）

#### Scenario: 訂票失敗
- **WHEN** 訂票 API 回應 HTTP status code 為錯誤（例如：400、500 等）或發生網路錯誤
- **THEN** 隱藏載入指示器
- **AND** 顯示使用者友善的錯誤訊息
- **AND** 在訂單回應輸出框中顯示 HTTP status code（例如：`400 Bad Request`、`500 Internal Server Error`）
- **AND** 不進行座位選擇流程
- **AND** 恢復按鈕和下拉選單的啟用狀態
- **AND** 允許使用者重試或修正選擇

### Requirement: 訂單回應顯示
系統 SHALL 在 popup 畫面下方提供一個輸出框，顯示訂單 API 的 HTTP status code。

#### Scenario: 顯示訂單回應輸出框
- **WHEN** popup 畫面載入完成
- **THEN** 在「確認訂票」按鈕下方顯示一個輸出框區域
- **AND** 輸出框標題顯示「訂單回應:」
- **AND** 初始狀態輸出框為空或顯示提示文字

#### Scenario: 顯示 HTTP Status Code
- **WHEN** 訂票 API 呼叫完成（成功或失敗）
- **THEN** 在訂單回應輸出框中顯示「訂單回應:」標籤
- **AND** 顯示 HTTP status code 和狀態文字（例如：`200 OK`、`400 Bad Request`、`500 Internal Server Error`）
- **AND** 根據 status code 顯示對應的成功或失敗訊息

