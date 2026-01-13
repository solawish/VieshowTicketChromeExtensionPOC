# seat-selection Specification

## Purpose
在訂票 API 成功送出後，自動取得座位選擇頁面並解析座位座標資訊，為後續自動選座功能提供基礎。
## Requirements
### Requirement: 座位選擇 API 呼叫
系統 SHALL 在訂票 API 成功後，自動呼叫座位選擇 API 取得座位選擇頁面。

#### Scenario: 呼叫座位選擇 API
- **WHEN** 訂票 API (`confirmOrder`) 成功回應（HTTP status 200-299）
- **THEN** 自動呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/SelectSeats` API
- **AND** 請求包含 Cookie header（使用 `sales.vscinemas.com.tw` domain 的所有 cookie）
- **AND** 請求包含 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** 請求使用 `application/x-www-form-urlencoded` 格式（如果需要）

#### Scenario: API 錯誤處理
- **WHEN** 座位選擇 API 呼叫失敗（網路錯誤、HTTP 錯誤等）
- **THEN** 記錄錯誤訊息到 console
- **AND** 不影響訂票流程的後續處理
- **AND** 不中斷使用者體驗

### Requirement: HTML 解析與座標提取
系統 SHALL 解析座位選擇 API 回應的 HTML，提取已選座位的座標資訊。

#### Scenario: 解析 HTML 回應
- **WHEN** 座位選擇 API 成功回應 HTML 內容
- **THEN** 使用 DOM 解析器解析 HTML
- **AND** 找出所有 `img` 標籤中 `src` 屬性為 `../img/standard_selected.png` 的元素
- **AND** 確定這些元素在 HTML 表格中的位置

#### Scenario: 座標系統定義
- **WHEN** 解析座位座標
- **THEN** 使用以下座標系統：
  - 右下角為原點：`SeatGridRowID: 1, GridSeatNum: 1`
  - 往上移動：`SeatGridRowID` 遞增（+1）
  - 往左移動：`GridSeatNum` 遞增（+1）

#### Scenario: 座標轉換
- **WHEN** 找到已選座位（`img src="../img/standard_selected.png"`）
- **THEN** 根據該座位在 HTML 表格中的位置，轉換為座標系統對應的座標
- **AND** 計算出正確的 `SeatGridRowID` 和 `GridSeatNum` 值
- **AND** 回傳座標陣列，每個座標格式為 `{ SeatGridRowID: number, GridSeatNum: number }`

#### Scenario: 座標輸出
- **WHEN** 成功解析並轉換座標
- **THEN** 透過 `console.log` 輸出所有解析出的座標
- **AND** 輸出格式清晰易讀，包含所有座標資訊

### Requirement: 錯誤處理
系統 SHALL 妥善處理 HTML 解析過程中的各種錯誤情況。

#### Scenario: HTML 解析失敗
- **WHEN** HTML 解析過程中發生錯誤（例如：HTML 格式不正確、找不到目標元素等）
- **THEN** 記錄錯誤訊息到 console
- **AND** 不影響訂票流程的後續處理
- **AND** 不中斷使用者體驗

#### Scenario: 座標轉換失敗
- **WHEN** 座標轉換過程中發生錯誤（例如：無法確定表格位置、座標計算錯誤等）
- **THEN** 記錄錯誤訊息到 console
- **AND** 輸出已成功解析的部分座標（如果有）
- **AND** 不影響訂票流程的後續處理

