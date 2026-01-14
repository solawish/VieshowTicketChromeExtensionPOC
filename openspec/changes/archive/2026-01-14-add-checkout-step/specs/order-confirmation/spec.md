## MODIFIED Requirements
### Requirement: 訂票結果處理
系統 SHALL 處理訂票 API 的回應並顯示結果給使用者，並在成功後自動進行座位選擇流程，最後進行結帳（checkout）步驟。

#### Scenario: 訂票成功
- **WHEN** 訂票 API 回應 HTTP status code 為成功（例如：200）
- **THEN** 隱藏載入指示器
- **AND** 顯示成功訊息給使用者
- **AND** 在訂單回應輸出框中顯示 HTTP status code（例如：`200 OK`）
- **AND** 自動呼叫座位選擇 API 取得座位選擇頁面
- **AND** 解析並輸出座位座標資訊（透過 console.log）
- **AND** 在座位預訂成功後，自動呼叫 checkout API
- **AND** 恢復按鈕和下拉選單的啟用狀態（或導向下一步驟）

#### Scenario: 訂票失敗
- **WHEN** 訂票 API 回應 HTTP status code 為錯誤（例如：400、500 等）或發生網路錯誤
- **THEN** 隱藏載入指示器
- **AND** 顯示使用者友善的錯誤訊息
- **AND** 在訂單回應輸出框中顯示 HTTP status code（例如：`400 Bad Request`、`500 Internal Server Error`）
- **AND** 不進行座位選擇流程
- **AND** 不進行 checkout 流程
- **AND** 恢復按鈕和下拉選單的啟用狀態
- **AND** 允許使用者重試或修正選擇

## ADDED Requirements
### Requirement: Checkout API 呼叫
系統 SHALL 在座位預訂成功後，自動呼叫 checkout API 完成結帳流程。

#### Scenario: 呼叫 Checkout API
- **WHEN** 座位預訂 API (`reserveSeats`) 成功回應（HTTP status 200-299）
- **THEN** 自動呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/Checkout` API
- **AND** 請求包含 Cookie header（使用 `sales.vscinemas.com.tw` domain 的所有 cookie）
- **AND** 請求包含 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** 請求使用 `application/x-www-form-urlencoded` 格式（如果需要）

#### Scenario: Checkout Response 輸出
- **WHEN** Checkout API 呼叫完成（無論 HTTP status code 為何）
- **THEN** 不檢查 HTTP status code
- **AND** 透過 `console.log` 輸出完整的 response 內容
- **AND** 不影響訂票流程的後續處理
- **AND** 不中斷使用者體驗

#### Scenario: Checkout API 錯誤處理
- **WHEN** Checkout API 呼叫失敗（網路錯誤等）
- **THEN** 記錄錯誤訊息到 console
- **AND** 不影響訂票流程的後續處理
- **AND** 不中斷使用者體驗
