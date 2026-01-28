## ADDED Requirements

### Requirement: 票種關鍵詞輸入框
系統 SHALL 在 popup 畫面中於「時間」選單與「票數」選單之間提供一個可選的「票種關鍵詞」輸入框，供使用者指定要匹配的票種名稱關鍵詞。

#### Scenario: 顯示票種關鍵詞輸入框
- **WHEN** popup 畫面載入完成
- **THEN** 在時間選單下方、票數選單上方顯示「票種關鍵詞」輸入框
- **AND** 該輸入框為可選欄位（空值表示使用預設票種選擇邏輯）
- **AND** 使用者可輸入任意文字作為票種名稱的匹配關鍵詞

#### Scenario: 票種關鍵詞為可選
- **WHEN** 使用者未填寫票種關鍵詞（或輸入為空白）
- **THEN** 系統依預設優先順序選擇票種：名稱含有「全票」→ 名稱含有「單人套票」→ 所有票種中的第一個
- **AND** 「確認訂票」按鈕的啟用條件不依賴票種關鍵詞是否有值

#### Scenario: 票種關鍵詞有值時優先匹配
- **WHEN** 使用者填寫票種關鍵詞（trim 後非空）
- **THEN** 取得 HoCode 和 PriceCode 時，優先選擇票種名稱中含有該關鍵詞的選項
- **AND** 若無名稱包含該關鍵詞的票種，再依預設順序（全票 → 單人套票 → 第一個）選擇

## MODIFIED Requirements

### Requirement: 動態取得 HoCode 和 PriceCode
系統 SHALL 在呼叫 OrderTickets API 前，從威秀訂票頁面動態取得 HoCode 和 PriceCode 值；票種的選擇 SHALL 依「票種關鍵詞」有無值與預設優先順序決定。

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

#### Scenario: 票種選擇優先順序
- **WHEN** 成功取得訂票頁面的 HTML 內容並解析出所有票種（表格中每一行的 select 對應一票種）
- **THEN** 若 popup 的「票種關鍵詞」有值（trim 後非空），則優先選擇票種名稱中含有該關鍵詞的 select 元素
- **AND** 若票種關鍵詞無值或無名稱包含該關鍵詞的票種，則依序尋找名稱含有「全票」的票種
- **AND** 若無「全票」，則尋找名稱含有「單人套票」的票種
- **AND** 若仍無，則使用所有票種中的第一個
- **AND** 從所選的 select 元素取得 `data-hocode` 與 `data-pricecode` 作為 HoCode 與 PriceCode

#### Scenario: 解析 HTML 並提取 HoCode 和 PriceCode
- **WHEN** 成功取得訂票頁面的 HTML 內容
- **THEN** 使用 `DOMParser` 解析 HTML
- **AND** 依「票種選擇優先順序」定位到目標 select 元素（可透過表格中每一行 tr 的票種名稱與上述優先順序比對，選出對應的 td 中的 select）
- **AND** 從該 select 元素取得 `data-hocode` 屬性值作為 HoCode
- **AND** 從該 select 元素取得 `data-pricecode` 屬性值作為 PriceCode
- **AND** 如果無法找到元素或屬性，記錄錯誤並使用預設值（HoCode: `HO00000001`, PriceCode: `0001`）

#### Scenario: 錯誤處理與降級
- **WHEN** 無法從網頁取得 HoCode 或 PriceCode（網路錯誤、HTML 結構變更等）
- **THEN** 記錄警告訊息到 console
- **AND** 使用預設值（HoCode: `HO00000001`, PriceCode: `0001`）
- **AND** 繼續訂票流程，不中斷使用者體驗
