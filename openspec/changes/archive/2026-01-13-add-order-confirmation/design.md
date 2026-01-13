# Design: 訂票確認功能

## Context
使用者完成影城、片名、日期、時間的選擇後，需要將這些選擇提交到威秀訂票系統進行確認。這個功能需要：
1. 從下拉選單中取得選擇的值
2. 將這些值映射到威秀訂票 API 所需的參數格式
3. 取得瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie
4. 呼叫訂票 API，並包含所有 cookie 和 Referer header
5. 處理回應和錯誤

## Goals / Non-Goals

### Goals
- 提供一個簡單的按鈕讓使用者確認訂票
- 確保所有必要資訊都已選擇後才能提交
- 正確映射下拉選單的值到 API 參數
- 包含瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie 以維持會話狀態
- 在 API 請求中包含 Referer header 以模擬正常瀏覽器請求
- 提供清楚的載入和錯誤狀態回饋
- 顯示完整的 API 回應內容，方便除錯和確認訂票狀態

### Non-Goals
- 不處理座位選擇（這是後續步驟）
- 不處理付款流程（這是後續步驟）
- 不儲存訂票記錄（目前階段）

## Decisions

### Decision: 參數映射策略
從下拉選單的值映射到 API 參數：
- `cinemacode`: 從 `cinema-select` 的值中提取，如果格式為 `1|TP`，只取前面的數字部分（例如：`1`）
- `txtSessionId`: 從 `time-select` 的值取得（SessionId）
- `Orders[OrderTickets][0][CinemaId]`: 從 `cinema-select` 的值中提取，如果格式為 `1|TP`，只取前面的數字部分（例如：`1`）
- `Orders[OrderTickets][0][SessionId]`: 從 `time-select` 的值取得
- `Orders[OrderTickets][0][HoCode]`: 從 `movie-select` 的值取得（HoCode）
- `Orders[OrderTickets][0][PriceCode]`: 固定使用 `0001`
- `Orders[OrderTickets][0][Qty]`: 從票數下拉選單的值取得
- `SessionTime`: 從場次時間（`time-select` 的 label）取得，並轉換為 am/pm 制格式（例如：`1/16/2026 7:30:00 PM`）
- `MovieName`: 從 `movie-select` 的 label 取得（顯示名稱）

**Alternatives considered**:
- 從 API 回應中取得完整資訊：需要額外的 API 呼叫，增加複雜度
- 儲存完整的 session 資料：需要修改現有的資料結構

### Decision: 票數選單
在時間選單下方新增票數下拉選單，讓使用者選擇要訂購的票數。

**實作方式**:
- 在 `popup.html` 中新增票數選單（例如：`<select id="quantity-select">`）
- 票數選單包含選項（例如：1、2、3、4、5、6、7、8 等）
- 票數選單初始狀態為啟用（不需要依賴其他選單）
- 票數選單的值直接對應到 API 參數 `Orders[OrderTickets][0][Qty]`

**Alternatives considered**:
- 使用文字輸入框：下拉選單更直觀，且可以限制可選範圍
- 固定為 1：不符合實際使用需求，使用者可能需要多張票

### Decision: 按鈕啟用條件
按鈕只有在所有五個下拉選單（影城、片名、日期、時間、票數）都有選擇值時才啟用。

**Alternatives considered**:
- 允許部分選擇：不符合訂票流程邏輯
- 需要額外驗證：過度複雜，下拉選單的選擇已經足夠

### Decision: Cookie 處理
使用 Chrome Extension 的 `chrome.cookies` API 取得 `sales.vscinemas.com.tw` domain 的所有 cookie，並在 API 請求中包含這些 cookie。

**實作方式**:
- 在 `manifest.json` 中新增 `"permissions": ["cookies"]` 權限
- 在 `host_permissions` 中新增 `https://sales.vscinemas.com.tw/*`
- 使用 `chrome.cookies.getAll({ domain: 'sales.vscinemas.com.tw' })` 取得該 domain 的所有 cookie
- 將 cookie 格式化為 Cookie header 字串，在 fetch 請求中設定 `headers: { 'Cookie': cookieString }`

**Alternatives considered**:
- 使用 `credentials: 'include'`：在 Extension popup 環境中，fetch 預設不會自動包含 cookie，需要手動設定
- 取得所有 vscinemas.com.tw 的 cookie：不符合需求，僅需 sales.vscinemas.com.tw 的 cookie

### Decision: Referer Header
在 API 請求中包含 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`，以模擬正常瀏覽器請求。

**實作方式**:
- Referer URL 的參數從下拉選單的值中取得：
  - `cinemacode`: 從影城選單的值中提取，如果格式為 `1|TP`，只取前面的數字部分（例如：`1`）
  - `txtSessionId`: 從時間選單的值取得（SessionId）
- 在 fetch 請求的 headers 中設定 `Referer: refererUrl`

**Alternatives considered**:
- 不包含 Referer：可能被伺服器拒絕，因為某些 API 會檢查 Referer 以防止 CSRF 攻擊

### Decision: 訂單回應顯示
在 popup 畫面下方提供一個輸出框，顯示訂單 API 的 HTTP status code，方便使用者查看訂票結果。

**實作方式**:
- 在 `popup.html` 中新增一個輸出框區域（例如：`<div id="order-response">`）
- 輸出框標題顯示「訂單回應:」
- 當 API 呼叫完成後，根據 HTTP status code 判斷成功/失敗
- 在輸出框中顯示 HTTP status code（例如：`200 OK`、`400 Bad Request`、`500 Internal Server Error` 等）
- 根據 status code 顯示對應的成功或失敗訊息
- 輸出框使用等寬字體（monospace）以便閱讀

**Alternatives considered**:
- 顯示完整 API 回應內容：可能包含敏感資訊，且使用者主要關心的是成功/失敗狀態
- 僅顯示成功/失敗訊息：顯示 status code 可以提供更多資訊，方便除錯

### Decision: 錯誤處理
- 網路錯誤：顯示使用者友善的錯誤訊息
- API 錯誤：顯示 API 回傳的錯誤訊息（如果有）
- 驗證錯誤：在提交前檢查所有必要欄位
- Cookie 取得失敗：記錄錯誤但不阻止訂票流程（某些情況下可能不需要 cookie）

**Alternatives considered**:
- 自動重試：可能造成重複訂票
- 靜默失敗：不符合使用者體驗需求

## Risks / Trade-offs

### Risk: API 參數格式變更
威秀訂票 API 的參數格式可能變更，導致訂票失敗。

**Mitigation**: 
- 實作清楚的錯誤處理和日誌記錄
- 提供使用者回報問題的機制

### Risk: 參數映射不正確
下拉選單的值格式可能與 API 預期的格式不一致。

**Mitigation**:
- 仔細檢查現有的 API 回應格式
- 實作參數驗證邏輯
- 提供清楚的錯誤訊息

### Trade-off: 預設值 vs 使用者輸入
PriceCode 固定使用 `0001`，Qty 由使用者從下拉選單選擇。

**Decision**: PriceCode 固定為 `0001`，Qty 由使用者選擇。

## Migration Plan
此功能為新增功能，不影響現有功能，無需遷移。

## Open Questions
1. SessionTime 的格式已確定：使用場次時間並轉換為 am/pm 制（例如：`1/16/2026 7:30:00 PM`）
2. PriceCode 已確定：固定使用 `0001`
3. API 回應處理已確定：只看 HTTP status code 判斷成功/失敗
4. Cookie 的 domain 範圍已確定為 `sales.vscinemas.com.tw`
