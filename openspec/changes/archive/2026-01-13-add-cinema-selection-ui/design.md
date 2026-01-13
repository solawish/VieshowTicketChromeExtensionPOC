# Design: 電影選擇介面

## Context
需要建立一個 Chrome Extension popup 介面，讓使用者能夠依序選擇威秀影城的電影場次資訊。介面包含四個級聯下拉選單，每個選單的選項依賴於前一個選單的選擇。

## Goals / Non-Goals
- Goals:
  - 提供清晰的級聯選擇介面
  - 自動載入選單資料，減少使用者等待時間
  - 處理 API 錯誤和網路問題
  - 符合 Chrome Extension Manifest V3 規範
- Non-Goals:
  - 不實作訂票功能（僅選擇介面）
  - 不實作資料快取（未來可擴充）
  - 不實作多語言支援（初期僅繁體中文）

## Decisions

### Decision: 使用 Popup 而非 Content Script
- **選擇**: 使用 Chrome Extension popup 頁面
- **理由**: 
  - Popup 提供獨立的 UI 空間，不受網頁內容影響
  - 使用者可以隨時點擊 extension 圖示開啟
  - 符合 Chrome Extension 最佳實踐
- **替代方案**: Content Script 注入到威秀網站（但會受網站結構變更影響）

### Decision: 直接呼叫威秀 API
- **選擇**: 從 popup 直接使用 `fetch` 呼叫威秀 API
- **理由**:
  - 簡化架構，無需 background script 中繼
  - API 端點為公開端點，無需認證
  - 減少延遲
- **權限需求**: 需要在 `manifest.json` 中宣告 `host_permissions` 允許 `https://www.vscinemas.com.tw/*`

### Decision: 使用原生 TypeScript/JavaScript，無需框架
- **選擇**: 使用原生 TypeScript，不引入 React/Vue 等框架
- **理由**:
  - 功能簡單，四個下拉選單無需複雜狀態管理
  - 減少 bundle 大小
  - 符合專案約定的「簡單優先」原則
- **替代方案**: 使用輕量框架（如 Preact），但當前需求不需要

### Decision: 級聯選擇的狀態管理
- **選擇**: 使用簡單的事件監聽器，在選擇變更時觸發下一個 API 呼叫
- **實作方式**:
  - 每個 `<select>` 元素監聽 `change` 事件
  - 選擇變更時，清除後續選單的選項並禁用
  - 呼叫對應的 API 載入新選項
  - 載入完成後啟用下一個選單
- **理由**: 簡單直接，易於維護

### Decision: API 參數格式
- **觀察**: 用戶提供的 API 範例顯示參數格式為 `cinema=1|TP`（包含管道符號）
- **實作**: 直接使用 API 回傳的 `cinema` 值作為下一個 API 的參數，不進行轉換
- **注意**: 需要驗證實際 API 回應格式以確認參數結構

## Risks / Trade-offs

### Risk: API 回應格式變更
- **風險**: 威秀 API 回應格式可能變更，導致解析失敗
- **緩解**: 
  - 實作錯誤處理和使用者友善的錯誤訊息
  - 記錄 API 回應格式以便除錯
  - 未來可考慮加入回應格式驗證

### Risk: CORS 限制
- **風險**: 威秀 API 可能不允許跨域請求
- **緩解**: 
  - Chrome Extension 的 `host_permissions` 可以繞過 CORS
  - 如果仍有問題，可考慮使用 background script 作為代理

### Risk: 網路延遲影響使用者體驗
- **風險**: API 呼叫可能較慢，使用者需要等待
- **緩解**: 
  - 顯示載入狀態（loading indicator）
  - 禁用選單直到資料載入完成
  - 未來可加入快取機制

## Migration Plan
- 此為新功能，無需遷移
- 未來如需加入快取，可在 `utils/api.ts` 中加入快取層，不影響現有介面

## Open Questions
- [ ] 威秀 API 的實際回應格式為何？（需要測試確認）
- [ ] API 是否需要特定的 HTTP headers？
- [ ] 日期格式是否固定為 `YYYY/MM/DD`？
- [ ] 是否需要處理時區問題？
