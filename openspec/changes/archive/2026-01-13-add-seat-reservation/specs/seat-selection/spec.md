## ADDED Requirements
### Requirement: 座位預訂 API 呼叫
系統 SHALL 在解析座位座標成功後，自動呼叫座位預訂 API 將座位提交到威秀系統進行預訂。

#### Scenario: 呼叫座位預訂 API
- **WHEN** 座位座標解析成功（`parseSeatCoordinates` 回傳座標陣列）
- **AND** 座標陣列不為空
- **THEN** 自動呼叫 `POST https://sales.vscinemas.com.tw/VieShowTicketT2/Home/ReserveSeats` API
- **AND** 請求包含 Cookie header（使用 `sales.vscinemas.com.tw` domain 的所有 cookie）
- **AND** 請求包含 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** 請求使用 `application/x-www-form-urlencoded` 格式
- **AND** 請求 body 包含所有解析出的座位座標，格式為：
  - `SelectedSeats[0][AreaCategoryCode]`: `0000000001`
  - `SelectedSeats[0][AreaNum]`: `1`
  - `SelectedSeats[0][SeatGridRowID]`: 第一個座位的 `SeatGridRowID` 值
  - `SelectedSeats[0][GridSeatNum]`: 第一個座位的 `GridSeatNum` 值
  - `SelectedSeats[1][AreaCategoryCode]`: `0000000001`（如果有多個座位）
  - `SelectedSeats[1][AreaNum]`: `1`（如果有多個座位）
  - `SelectedSeats[1][SeatGridRowID]`: 第二個座位的 `SeatGridRowID` 值（如果有多個座位）
  - `SelectedSeats[1][GridSeatNum]`: 第二個座位的 `GridSeatNum` 值（如果有多個座位）
  - （依此類推，為每個座位建立對應的參數）

#### Scenario: 多個座位預訂
- **WHEN** 解析出多個座位座標（例如：2 個或更多座位）
- **THEN** 為每個座位建立對應的 `SelectedSeats[i]` 參數組
- **AND** 索引 `i` 從 0 開始遞增（0, 1, 2, ...）
- **AND** 每個座位都包含 `AreaCategoryCode`, `AreaNum`, `SeatGridRowID`, `GridSeatNum` 四個參數

#### Scenario: API 錯誤處理
- **WHEN** 座位預訂 API 呼叫失敗（網路錯誤、HTTP 錯誤等）
- **THEN** 記錄錯誤訊息到 console
- **AND** 不影響訂票流程的後續處理
- **AND** 不中斷使用者體驗

#### Scenario: 預訂成功處理
- **WHEN** 座位預訂 API 成功回應（HTTP status 200-299）
- **THEN** 記錄成功訊息到 console
- **AND** 輸出預訂結果資訊

#### Scenario: 無座位時跳過預訂
- **WHEN** 座位座標解析結果為空陣列（沒有已選座位）
- **THEN** 不呼叫座位預訂 API
- **AND** 記錄訊息到 console 說明沒有座位需要預訂

### Requirement: 座位資訊顯示
系統 SHALL 在 popup 畫面最下方的回應框中顯示解析出的座位座標和預訂 API 的回應資訊。

#### Scenario: 顯示解析出的座位座標
- **WHEN** 座位座標解析成功（`parseSeatCoordinates` 回傳座標陣列）
- **THEN** 在 popup 畫面最下方的回應框（`order-response`）中顯示解析出的座位座標資訊
- **AND** 顯示格式清晰易讀，包含每個座位的 `SeatGridRowID` 和 `GridSeatNum` 值
- **AND** 如果有多個座位，清楚標示每個座位的編號

#### Scenario: 顯示預訂 API 回應
- **WHEN** 座位預訂 API 呼叫完成（成功或失敗）
- **THEN** 在 popup 畫面最下方的回應框中追加顯示預訂 API 的回應資訊
- **AND** 顯示 HTTP status code 和狀態文字
- **AND** 如果回應包含內容（response body），也顯示回應內容
- **AND** 根據成功或失敗狀態，使用對應的樣式（success 或 error）

#### Scenario: 回應框內容累積顯示
- **WHEN** 訂票流程完成
- **THEN** 回應框依序顯示：
  1. 訂票 API 的回應（如果有的話）
  2. 解析出的座位座標資訊
  3. 預訂 API 的回應資訊
- **AND** 各項資訊之間有適當的分隔，方便閱讀
