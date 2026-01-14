# Design: 從網頁動態抓取 HoCode 和 PriceCode

## Context
目前 OrderTickets API 使用固定的 HoCode (`HO00000001`) 和 PriceCode (`0001`)，但實際上這些值應該根據場次動態取得。威秀網站在訂票頁面（`https://sales.vscinemas.com.tw/VieShowTicketT2/?agree=on&cinemacode={cinemacode}&txtSessionId={txtSessionId}`）中提供了包含這些資訊的下拉式表單。

## Goals / Non-Goals
- **Goals**:
  - 從威秀訂票頁面動態抓取 HoCode 和 PriceCode
  - 確保訂票請求使用正確的動態值
  - 提供錯誤處理機制（當無法取得值時）
- **Non-Goals**:
  - 不改變其他訂票流程邏輯
  - 不實作複雜的網頁爬蟲功能（僅針對特定頁面和元素）

## Decisions

### Decision: 使用 fetch API 抓取網頁內容
- **What**: 使用 `fetch` API 來取得目標頁面的 HTML 內容
- **Why**: 
  - Chrome Extension 環境中可以使用 fetch API
  - 不需要額外的依賴
  - 可以包含必要的 headers（如 Cookie、Referer）來模擬正常瀏覽器請求
- **Alternatives considered**:
  - Content Script 注入：需要額外的權限和複雜的訊息傳遞
  - Background Script：fetch API 更直接簡單

### Decision: 使用 DOMParser 解析 HTML
- **What**: 使用瀏覽器原生的 `DOMParser` API 來解析 HTML 並提取元素
- **Why**:
  - 原生支援，無需額外依賴
  - 可以支援 XPath 或 CSS selector 來定位元素
  - 在 Extension 環境中可用
- **Alternatives considered**:
  - 正則表達式：不夠可靠，容易因 HTML 結構變更而失效
  - 第三方 HTML 解析庫：增加依賴和 bundle 大小

### Decision: 使用 CSS Selector 而非 XPath
- **What**: 將提供的 XPath 轉換為 CSS selector 或使用 `querySelector` 方法
- **Why**:
  - CSS selector 在瀏覽器環境中更常用且效能更好
  - 更容易維護和理解
  - 可以根據 table 結構和 data 屬性來定位
- **Alternatives considered**:
  - 使用 XPath：需要額外的 XPath 解析庫，增加複雜度
  - 直接使用 XPath 字串：瀏覽器原生不支援 XPath 字串查詢

### Decision: 錯誤處理降級機制
- **What**: 當無法從網頁取得 HoCode 和 PriceCode 時，使用預設值（原本的固定值）
- **Why**:
  - 確保訂票流程不會因為網頁結構變更而完全失敗
  - 提供向後相容性
  - 記錄錯誤以便後續除錯
- **Alternatives considered**:
  - 直接失敗：會中斷使用者體驗
  - 提示使用者手動輸入：增加使用者負擔

## Risks / Trade-offs
- **網頁結構變更風險**: 威秀網站結構變更可能導致無法找到目標元素
  - **Mitigation**: 實作降級機制，使用預設值並記錄錯誤
- **效能影響**: 每次訂票前需要額外的 HTTP 請求
  - **Trade-off**: 為了取得正確的動態值，這是必要的開銷
- **Cookie 和 Session 依賴**: 抓取頁面可能需要有效的 session
  - **Mitigation**: 確保請求包含必要的 Cookie 和 Referer headers

## Implementation Approach
1. 在 `utils/api.js` 或 `utils/api.ts` 中新增函數：
   - `fetchTicketPage(cinemacode, sessionId)`: 抓取訂票頁面 HTML
   - `extractHoCodeAndPriceCode(htmlText)`: 從 HTML 中提取 HoCode 和 PriceCode
2. 修改 `popup/popup.js` 中的 `handleConfirmOrder` 函數：
   - 在構建訂票參數前，先呼叫上述函數取得動態值
   - 如果取得失敗，使用預設值並記錄警告
3. 更新 `confirmOrder` API 呼叫，使用動態值而非固定值

## Open Questions
- XPath 中的 `tr[1]` 是否總是代表第一行？是否需要考慮多種票種的情況？
- 如果 select 元素有多個 option，應該選擇哪一個？還是從 select 元素本身取得 data 屬性？
