## ADDED Requirements

### Requirement: 動態取得 HoCode 和 PriceCode
系統 SHALL 在呼叫 OrderTickets API 前，從威秀訂票頁面動態取得 HoCode 和 PriceCode 值。

#### Scenario: 構建訂票頁面 URL
- **WHEN** 準備取得 HoCode 和 PriceCode
- **THEN** 構建目標 URL，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?agree=on&cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** URL 必須包含 `agree=on` 參數
- **AND** `cinemacode` 參數從影城選單的值中提取（如果格式為 `1|TP`，只取前面的數字部分）
- **AND** `txtSessionId` 參數從時間選單的值取得（SessionId）

#### Scenario: 抓取訂票頁面內容
- **WHEN** 構建完成目標 URL
- **THEN** 使用 `fetch` API 取得該 URL 的 HTML 內容
- **AND** 請求包含 Cookie header（使用 `sales.vscinemas.com.tw` domain 的所有 cookie）
- **AND** 請求包含 Referer header，格式為 `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode={cinemacode}&txtSessionId={txtSessionId}`
- **AND** 如果請求失敗，記錄錯誤並使用預設值（HoCode: `HO00000001`, PriceCode: `0001`）

#### Scenario: 解析 HTML 並提取 HoCode 和 PriceCode
- **WHEN** 成功取得訂票頁面的 HTML 內容
- **THEN** 使用 `DOMParser` 解析 HTML
- **AND** 定位到目標 select 元素（對應 XPath: `/html/body/div[4]/section/div/div/div[1]/div/div/div[3]/div/div[3]/div[2]/div/div[2]/table/tbody/tr[1]/td[3]/select`，或使用等效的 CSS selector 定位到表格中第一個 tr 的第三個 td 中的 select 元素）
- **AND** 從 select 元素取得 `data-hocode` 屬性值作為 HoCode
- **AND** 從 select 元素取得 `data-pricecode` 屬性值作為 PriceCode
- **AND** 如果無法找到元素或屬性，記錄錯誤並使用預設值（HoCode: `HO00000001`, PriceCode: `0001`）

#### Scenario: 錯誤處理與降級
- **WHEN** 無法從網頁取得 HoCode 或 PriceCode（網路錯誤、HTML 結構變更等）
- **THEN** 記錄警告訊息到 console
- **AND** 使用預設值（HoCode: `HO00000001`, PriceCode: `0001`）
- **AND** 繼續訂票流程，不中斷使用者體驗

## MODIFIED Requirements

### Requirement: 訂票 API 呼叫
系統 SHALL 在使用者點擊「確認訂票」按鈕時，呼叫威秀訂票 API 提交訂票請求。

#### Scenario: 提交訂票請求
- **WHEN** 使用者點擊「確認訂票」按鈕
- **AND** 所有下拉選單（影城、片名、日期、時間、票數）都有選擇值
- **THEN** 取得瀏覽器中 `sales.vscinemas.com.tw` domain 的所有 cookie
- **AND** 從威秀訂票頁面動態取得 HoCode 和 PriceCode（如果取得失敗，使用預設值）
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
  - `Orders[OrderTickets][0][HoCode]`: 從威秀訂票頁面動態取得，如果取得失敗則使用預設值 `HO00000001`
  - `Orders[OrderTickets][0][PriceCode]`: 從威秀訂票頁面動態取得，如果取得失敗則使用預設值 `0001`
  - `Orders[OrderTickets][0][Qty]`: 從票數下拉選單的值取得
  - `SessionTime`: 從場次時間（時間選單的 label）取得，並轉換為 am/pm 制格式（例如：`1/16/2026 7:30:00 PM`）
  - `MovieName`: 從片名選單的顯示文字（label）取得
