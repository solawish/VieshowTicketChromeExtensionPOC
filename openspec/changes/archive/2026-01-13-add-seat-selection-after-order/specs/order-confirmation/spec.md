## MODIFIED Requirements

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
