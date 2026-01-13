/**
 * 威秀 API 服務模組
 * 提供取得影城、片名、日期、時間的 API 呼叫功能
 */

const API_BASE_URL = 'https://www.vscinemas.com.tw/api';

/**
 * 取得所有影城列表
 */
export async function getCinemas() {
  try {
    const response = await fetch(`${API_BASE_URL}/GetLstDicCinema`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API 回傳格式：陣列，每個項目包含 strValue 和 strText
    if (Array.isArray(data)) {
      return data.map((item) => ({
        value: item.strValue || '',
        label: item.strText || ''
      }));
    }
    
    throw new Error('無法解析 API 回應格式');
  } catch (error) {
    console.error('取得影城列表失敗:', error);
    throw error;
  }
}

/**
 * 取得指定影城的電影列表
 * @param {string} cinema 影城代碼（例如：'1|TP'）
 */
export async function getMovies(cinema) {
  try {
    const response = await fetch(`${API_BASE_URL}/GetLstDicMovie?cinema=${encodeURIComponent(cinema)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API 回傳格式：陣列，每個項目包含 strValue 和 strText
    if (Array.isArray(data)) {
      return data.map((item) => ({
        value: item.strValue || '',
        label: item.strText || ''
      }));
    }
    
    throw new Error('無法解析 API 回應格式');
  } catch (error) {
    console.error('取得電影列表失敗:', error);
    throw error;
  }
}

/**
 * 取得指定影城和電影的上映日期列表
 * @param {string} cinema 影城代碼（例如：'1|TP'）
 * @param {string} movie 電影代碼（例如：'HO00016767'）
 */
export async function getDates(cinema, movie) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/GetLstDicDate?cinema=${encodeURIComponent(cinema)}&movie=${encodeURIComponent(movie)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API 回傳格式：陣列，每個項目包含 strValue 和 strText
    if (Array.isArray(data)) {
      return data.map((item) => ({
        value: item.strValue || '',
        label: item.strText || ''
      }));
    }
    
    throw new Error('無法解析 API 回應格式');
  } catch (error) {
    console.error('取得日期列表失敗:', error);
    throw error;
  }
}

/**
 * 取得指定影城、電影和日期的場次時間列表
 * @param {string} cinema 影城代碼（例如：'1|TP'）
 * @param {string} movie 電影代碼（例如：'HO00016767'）
 * @param {string} date 日期（例如：'2026/01/13'）
 */
export async function getSessions(cinema, movie, date) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/GetLstDicSession?cinema=${encodeURIComponent(cinema)}&movie=${encodeURIComponent(movie)}&date=${encodeURIComponent(date)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API 回傳格式：陣列，每個項目包含 strValue 和 strText
    if (Array.isArray(data)) {
      return data.map((item) => ({
        value: item.strValue || '',
        label: item.strText || ''
      }));
    }
    
    throw new Error('無法解析 API 回應格式');
  } catch (error) {
    console.error('取得場次時間列表失敗:', error);
    throw error;
  }
}

/**
 * 取得指定 domain 的所有 cookie
 * @param {string} domain Cookie domain（例如：'sales.vscinemas.com.tw'）
 */
export async function getCookiesForDomain(domain) {
  try {
    // 在 Chrome Extension 環境中，chrome API 是全域可用的
    const chromeApi = globalThis.chrome;
    if (!chromeApi || !chromeApi.cookies) {
      throw new Error('Chrome cookies API 不可用');
    }
    return await chromeApi.cookies.getAll({ domain });
  } catch (error) {
    console.error('取得 cookie 失敗:', error);
    throw error;
  }
}

/**
 * 將 cookie 陣列格式化為 Cookie header 字串
 * @param {Array} cookies Cookie 陣列
 */
export function formatCookiesAsHeader(cookies) {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}

/**
 * 從 `1|TP` 格式中提取數字部分
 * @param {string} value 輸入值（例如：'1|TP'）
 * @returns {string} 數字部分（例如：'1'）
 */
export function extractCinemaCode(value) {
  if (value.includes('|')) {
    return value.split('|')[0];
  }
  return value;
}

/**
 * 構建 Referer URL
 * @param {string} cinemacode 影城代碼（只取數字部分）
 * @param {string} txtSessionId 場次 ID
 */
export function buildRefererUrl(cinemacode, txtSessionId) {
  return `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode=${cinemacode}&txtSessionId=${txtSessionId}`;
}

/**
 * 將場次時間轉換為 am/pm 制格式
 * @param {string} sessionLabel 場次時間標籤（例如：'19:30'）
 * @param {string} dateLabel 日期標籤（例如：'2026/01/16'）
 * @returns {string} 格式化後的時間（例如：'1/16/2026 7:30:00 PM'）
 */
export function formatSessionTime(sessionLabel, dateLabel) {
  try {
    // 解析日期：2026/01/16 -> 1/16/2026
    const dateParts = dateLabel.split('/');
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      
      // 解析時間：19:30 -> 7:30 PM
      const timeParts = sessionLabel.split(':');
      if (timeParts.length >= 2) {
        let hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);
        const second = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
        
        const period = hour >= 12 ? 'PM' : 'AM';
        if (hour > 12) {
          hour = hour - 12;
        } else if (hour === 0) {
          hour = 12;
        }
        
        return `${month}/${day}/${year} ${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${period}`;
      }
    }
    
    // 如果解析失敗，返回原始值
    return sessionLabel;
  } catch (error) {
    console.error('格式化時間失敗:', error);
    return sessionLabel;
  }
}

/**
 * 確認訂票
 * @param {Object} params 訂票參數
 * @param {string} params.cinemaCode 影城代碼（從選單值提取數字部分）
 * @param {string} params.sessionId 場次 ID（從時間選單的值取得）
 * @param {string} params.cinemaId 影城 ID（從選單值提取數字部分）
 * @param {string} params.hoCode 片名代碼（從片名選單的值取得）
 * @param {string} params.priceCode 價格代碼（固定為 '0001'）
 * @param {string} params.qty 票數（從票數選單取得）
 * @param {string} params.sessionTime 場次時間（am/pm 制格式）
 * @param {string} params.movieName 片名（從片名選單的 label 取得）
 * @returns {Promise<Response>} API 回應
 */
export async function confirmOrder(params) {
  try {
    // 取得 cookie
    let cookieHeader = '';
    try {
      const cookies = await getCookiesForDomain('sales.vscinemas.com.tw');
      cookieHeader = formatCookiesAsHeader(cookies);
    } catch (error) {
      console.warn('取得 cookie 失敗，繼續訂票流程:', error);
    }
    
    // 構建 Referer URL
    const refererUrl = buildRefererUrl(params.cinemaCode, params.sessionId);
    
    // 構建請求體（application/x-www-form-urlencoded）
    const formData = new URLSearchParams();
    formData.append('cinemacode', params.cinemaCode);
    formData.append('txtSessionId', params.sessionId);
    formData.append('Orders[OrderTickets][0][CinemaId]', params.cinemaId);
    formData.append('Orders[OrderTickets][0][SessionId]', params.sessionId);
    formData.append('Orders[OrderTickets][0][HoCode]', params.hoCode);
    formData.append('Orders[OrderTickets][0][PriceCode]', params.priceCode);
    formData.append('Orders[OrderTickets][0][Qty]', params.qty);
    formData.append('SessionTime', params.sessionTime);
    formData.append('MovieName', params.movieName);
    
    // 構建 headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': refererUrl
    };
    
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // 發送 POST 請求
    const response = await fetch(
      'https://sales.vscinemas.com.tw/VieShowTicketT2/Home/OrderTickets',
      {
        method: 'POST',
        headers,
        body: formData.toString()
      }
    );
    
    return response;
  } catch (error) {
    console.error('訂票失敗:', error);
    throw error;
  }
}

/**
 * 呼叫座位選擇 API
 * @param {Object} params 座位選擇參數
 * @param {string} params.cinemaCode 影城代碼（從選單值提取數字部分）
 * @param {string} params.sessionId 場次 ID（從時間選單的值取得）
 * @returns {Promise<string>} HTML 回應文字
 */
export async function selectSeats(params) {
  try {
    // 取得 cookie
    let cookieHeader = '';
    try {
      const cookies = await getCookiesForDomain('sales.vscinemas.com.tw');
      cookieHeader = formatCookiesAsHeader(cookies);
    } catch (error) {
      console.warn('取得 cookie 失敗，繼續座位選擇流程:', error);
    }
    
    // 構建 Referer URL
    const refererUrl = buildRefererUrl(params.cinemaCode, params.sessionId);
    
    // 構建 headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': refererUrl
    };
    
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // 發送 POST 請求
    const response = await fetch(
      'https://sales.vscinemas.com.tw/VieShowTicketT2/Home/SelectSeats',
      {
        method: 'POST',
        headers
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 取得 HTML 回應文字
    const htmlText = await response.text();
    return htmlText;
  } catch (error) {
    console.error('座位選擇 API 呼叫失敗:', error);
    throw error;
  }
}

/**
 * 解析 HTML 並提取座位座標
 * @param {string} htmlText HTML 文字內容
 * @returns {Array<{SeatGridRowID: number, GridSeatNum: number}>} 座位座標陣列
 */
export function parseSeatCoordinates(htmlText) {
  try {
    // 使用 DOMParser 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    // 找出所有 img 標籤中 src 為 "../img/standard_selected.png" 的元素
    const selectedSeatImages = Array.from(doc.querySelectorAll('img')).filter(img => {
      const src = img.getAttribute('src');
      return src === '../img/standard_selected.png' || src?.endsWith('/img/standard_selected.png');
    });
    
    if (selectedSeatImages.length === 0) {
      console.log('未找到已選座位');
      return [];
    }
    
    console.log(`找到 ${selectedSeatImages.length} 個已選座位`);
    
    // 找出包含這些圖片的表格
    // 通常座位會在 table 中，我們需要找到這些 img 所在的 td 或 th
    const coordinates = [];
    
    // 找出所有包含座位的表格
    const tables = doc.querySelectorAll('table');
    
    if (tables.length === 0) {
      console.warn('未找到表格元素');
      return [];
    }
    
    // 遍歷每個表格，找出已選座位的位置
    tables.forEach((table, tableIndex) => {
      const rows = table.querySelectorAll('tr');
      const totalRows = rows.length;
      
      // 座標系統：右下角為原點 (SeatGridRowID: 1, GridSeatNum: 1)
      // 往上：SeatGridRowID +1
      // 往左：GridSeatNum +1
      
      // 從最後一行（最下方）開始，往上一行一行檢查
      for (let rowIndex = totalRows - 1; rowIndex >= 0; rowIndex--) {
        const row = rows[rowIndex];
        const cells = row.querySelectorAll('td, th');
        const totalCells = cells.length;
        
        // 從最後一個儲存格（最右側）開始，往左一個一個檢查
        for (let cellIndex = totalCells - 1; cellIndex >= 0; cellIndex--) {
          const cell = cells[cellIndex];
          const img = cell.querySelector('img[src="../img/standard_selected.png"], img[src*="/img/standard_selected.png"]');
          
          if (img) {
            // 計算座標
            // 從表格底部開始，rowIndex 越小表示越上方
            // 從表格右側開始，cellIndex 越小表示越左側
            // 右下角為 (1, 1)
            const SeatGridRowID = totalRows - rowIndex;  // 從底部往上，第1行是底部
            const GridSeatNum = totalCells - cellIndex;   // 從右側往左，第1列是右側
            
            coordinates.push({
              SeatGridRowID,
              GridSeatNum
            });
            
            console.log(`找到座位: 表格 ${tableIndex + 1}, 行 ${rowIndex + 1}, 列 ${cellIndex + 1} -> 座標 (SeatGridRowID: ${SeatGridRowID}, GridSeatNum: ${GridSeatNum})`);
          }
        }
      }
    });
    
    return coordinates;
  } catch (error) {
    console.error('解析座位座標失敗:', error);
    // 輸出原始 HTML 以便除錯
    console.log('原始 HTML 內容:', htmlText.substring(0, 1000)); // 只輸出前1000字元
    throw error;
  }
}

/**
 * 預訂座位
 * @param {Object} params 座位預訂參數
 * @param {string} params.cinemaCode 影城代碼（從選單值提取數字部分）
 * @param {string} params.sessionId 場次 ID（從時間選單的值取得）
 * @param {Array<{SeatGridRowID: number, GridSeatNum: number}>} params.seats 座位座標陣列
 * @returns {Promise<Response>} API 回應
 */
export async function reserveSeats(params) {
  try {
    // 如果沒有座位，不呼叫 API
    if (!params.seats || params.seats.length === 0) {
      console.log('沒有座位需要預訂');
      throw new Error('沒有座位需要預訂');
    }
    
    // 取得 cookie
    let cookieHeader = '';
    try {
      const cookies = await getCookiesForDomain('sales.vscinemas.com.tw');
      cookieHeader = formatCookiesAsHeader(cookies);
    } catch (error) {
      console.warn('取得 cookie 失敗，繼續座位預訂流程:', error);
    }
    
    // 構建 Referer URL
    const refererUrl = buildRefererUrl(params.cinemaCode, params.sessionId);
    
    // 構建請求體（application/x-www-form-urlencoded）
    const formData = new URLSearchParams();
    
    // 為每個座位建立參數
    params.seats.forEach((seat, index) => {
      formData.append(`SelectedSeats[${index}][AreaCategoryCode]`, '0000000001');
      formData.append(`SelectedSeats[${index}][AreaNum]`, '1');
      formData.append(`SelectedSeats[${index}][SeatGridRowID]`, seat.SeatGridRowID.toString());
      formData.append(`SelectedSeats[${index}][GridSeatNum]`, seat.GridSeatNum.toString());
    });
    
    // 構建 headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': refererUrl
    };
    
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // 發送 POST 請求
    const response = await fetch(
      'https://sales.vscinemas.com.tw/VieShowTicketT2/Home/ReserveSeats',
      {
        method: 'POST',
        headers,
        body: formData.toString()
      }
    );
    
    return response;
  } catch (error) {
    console.error('座位預訂失敗:', error);
    throw error;
  }
}
