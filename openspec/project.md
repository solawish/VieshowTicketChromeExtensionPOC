# Project Context

## Purpose
開發一個 Chrome Extension 來協助使用者進行威秀電影票訂票流程，提升訂票效率和體驗。

## Tech Stack
- **Extension Framework**: Chrome Extension (Manifest V3)
- **Frontend**: JavaScript/TypeScript, HTML, CSS
- **Build Tools**: (待決定 - 可選 Webpack, Vite 等)
- **Testing**: (待決定 - 可選 Jest, Vitest 等)

## Project Conventions

### Code Style
- 使用 TypeScript 進行開發（建議）
- 變數命名：camelCase
- 常數命名：UPPER_SNAKE_CASE
- 檔案命名：kebab-case
- 使用 ESLint 和 Prettier 進行程式碼格式化
- 函數和類別使用有意義的命名，避免縮寫

### Architecture Patterns
- **Extension 結構**：
  - `manifest.json` - Extension 設定檔
  - `background/` - Background scripts (Service Worker)
  - `content/` - Content scripts (注入到網頁中)
  - `popup/` - Extension popup UI
  - `options/` - Options 頁面（如需要）
  - `utils/` - 共用工具函數
- **模組化設計**：將功能拆分為獨立模組
- **事件驅動**：使用 Chrome Extension API 的事件機制進行通訊

### Testing Strategy
- 單元測試：測試工具函數和業務邏輯
- 整合測試：測試 Extension 與網頁的互動
- 手動測試：在實際威秀網站上進行端對端測試
- 測試覆蓋率目標：核心功能 > 80%

### Git Workflow
- **分支策略**：Git Flow
  - `main` - 生產環境穩定版本
  - `develop` - 開發主分支
  - `feature/*` - 功能開發分支
  - `fix/*` - 錯誤修復分支
- **Commit 訊息格式**：Conventional Commits
  - `feat: 新增自動選座功能`
  - `fix: 修復訂票流程錯誤`
  - `docs: 更新 README`
  - `refactor: 重構票券驗證邏輯`

## Domain Context
- **威秀電影院訂票系統**：需要了解威秀官網的訂票流程
- **訂票流程**：選擇電影 → 選擇場次 → 選擇座位 → 填寫資訊 → 付款
- **常見需求**：快速選座、自動填寫資訊、場次提醒、座位偏好設定

## Important Constraints
- **Chrome Extension 限制**：
  - 必須遵循 Manifest V3 規範
  - Content Script 與網頁環境隔離
  - 需要適當的權限聲明
- **網站變更風險**：威秀網站結構變更可能影響 Extension 功能
- **使用者隱私**：不得儲存敏感個人資訊（如信用卡號）
- **合規性**：需遵守威秀網站的使用條款

## External Dependencies
- **威秀官網**：主要互動的目標網站
- **Chrome Extension APIs**：
  - `chrome.tabs` - 標籤頁管理
  - `chrome.storage` - 資料儲存
  - `chrome.scripting` - 腳本注入
  - `chrome.action` - Extension 圖示和 popup
