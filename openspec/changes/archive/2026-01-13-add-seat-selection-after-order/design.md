# Design: 座位選擇與座標解析

## Context
在訂票 API 成功後，威秀系統會導向座位選擇頁面。我們需要呼叫 `SelectSeats` API 來取得座位選擇頁面的 HTML，並從中解析出已選座位的座標資訊。

## Goals / Non-Goals

### Goals
- 在訂票成功後自動取得座位選擇頁面
- 解析 HTML 中的座位座標資訊
- 定義清晰的座標系統並正確轉換
- 透過 console.log 輸出座標資訊供後續使用

### Non-Goals
- 不實作自動選座功能（僅解析座標）
- 不修改 UI 顯示座位資訊（僅 console.log）
- 不處理座位選擇的提交（僅解析）

## Decisions

### Decision: 座標系統定義
**選擇**: 以右下角為原點（SeatGridRowID: 1, GridSeatNum: 1），往上 SeatGridRowID 遞增，往左 GridSeatNum 遞增。

**理由**: 
- 符合使用者描述的需求
- 與威秀系統的座標系統對應

**替代方案**: 考慮過左上角為原點，但不符合需求描述。

### Decision: HTML 解析方式
**選擇**: 使用 DOM 解析（在 Chrome Extension 環境中可以使用 DOMParser 或直接操作 DOM）。

**理由**:
- Chrome Extension 環境支援標準 DOM API
- 不需要額外的 HTML 解析庫
- 效能足夠且易於維護

**替代方案**: 考慮過使用正則表達式，但 DOM 解析更可靠且易於維護。

### Decision: 座位識別方式
**選擇**: 透過 `img src="../img/standard_selected.png"` 來識別已選座位。

**理由**:
- 符合使用者描述的需求
- 這是威秀系統中已選座位的標記方式

**注意**: 需要確認 HTML 結構，可能需要解析表格中的 `img` 標籤及其所在的表格位置。

### Decision: API 參數
**選擇**: 使用與 `confirmOrder` 相同的參數（cinemaCode, sessionId）來構建 Referer，並使用相同的 Cookie。

**理由**:
- 保持與訂票流程的一致性
- 確保 API 呼叫的合法性

## Risks / Trade-offs

### Risk: HTML 結構變更
**風險**: 威秀系統更新可能改變 HTML 結構，導致解析失敗。

**緩解**: 
- 實作時加入詳細的錯誤處理
- 透過 console.log 輸出原始 HTML 以便除錯
- 考慮加入 HTML 結構驗證

### Risk: 座標轉換錯誤
**風險**: 座標系統定義可能與實際 HTML 表格結構不符。

**緩解**:
- 仔細分析 HTML 表格結構
- 實作時加入詳細的日誌輸出
- 測試多種座位配置情況

### Risk: API 呼叫失敗
**風險**: SelectSeats API 可能需要額外的參數或不同的認證方式。

**緩解**:
- 實作時加入錯誤處理
- 記錄 API 回應以便除錯
- 如果 API 失敗，不影響訂票流程（僅記錄錯誤）

## Open Questions
- HTML 表格的具體結構為何？（需要實際測試時確認）
- 是否需要處理相對路徑 `../img/standard_selected.png` 的轉換？
- 座標轉換是否需要考慮表格的合併儲存格（colspan/rowspan）？
