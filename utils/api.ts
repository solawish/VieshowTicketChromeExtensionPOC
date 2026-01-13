/**
 * 威秀 API 服務模組
 * 提供取得影城、片名、日期、時間的 API 呼叫功能
 */

const API_BASE_URL = 'https://www.vscinemas.com.tw/api';

export interface Cinema {
  value: string;
  label: string;
}

export interface Movie {
  value: string;
  label: string;
}

export interface DateOption {
  value: string;
  label: string;
}

export interface Session {
  value: string;
  label: string;
}

/**
 * 取得所有影城列表
 */
export async function getCinemas(): Promise<Cinema[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/GetLstDicCinema`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API 回傳格式：陣列，每個項目包含 strValue 和 strText
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
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
 * @param cinema 影城代碼（例如：'1|TP'）
 */
export async function getMovies(cinema: string): Promise<Movie[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/GetLstDicMovie?cinema=${encodeURIComponent(cinema)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API 回傳格式：陣列，每個項目包含 strValue 和 strText
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
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
 * @param cinema 影城代碼（例如：'1|TP'）
 * @param movie 電影代碼（例如：'HO00016767'）
 */
export async function getDates(cinema: string, movie: string): Promise<DateOption[]> {
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
      return data.map((item: any) => ({
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
 * @param cinema 影城代碼（例如：'1|TP'）
 * @param movie 電影代碼（例如：'HO00016767'）
 * @param date 日期（例如：'2026/01/13'）
 */
export async function getSessions(cinema: string, movie: string, date: string): Promise<Session[]> {
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
      return data.map((item: any) => ({
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
 * Cookie 介面
 */
export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  expirationDate?: number;
  storeId?: string;
}

/**
 * 取得指定 domain 的所有 cookie
 * @param domain Cookie domain（例如：'sales.vscinemas.com.tw'）
 */
export async function getCookiesForDomain(domain: string): Promise<Cookie[]> {
  try {
    // 在 Chrome Extension 環境中，chrome API 是全域可用的
    // 使用類型斷言來避免 TypeScript 類型檢查問題
    const chromeApi = (globalThis as any).chrome;
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
 * @param cookies Cookie 陣列
 */
export function formatCookiesAsHeader(cookies: Cookie[]): string {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}

/**
 * 從 `1|TP` 格式中提取數字部分
 * @param value 輸入值（例如：'1|TP'）
 * @returns 數字部分（例如：'1'）
 */
export function extractCinemaCode(value: string): string {
  if (value.includes('|')) {
    return value.split('|')[0];
  }
  return value;
}

/**
 * 構建 Referer URL
 * @param cinemacode 影城代碼（只取數字部分）
 * @param txtSessionId 場次 ID
 */
export function buildRefererUrl(cinemacode: string, txtSessionId: string): string {
  return `https://sales.vscinemas.com.tw/VieShowTicketT2/?cinemacode=${cinemacode}&txtSessionId=${txtSessionId}`;
}

/**
 * 將場次時間轉換為 am/pm 制格式
 * @param sessionLabel 場次時間標籤（例如：'19:30'）
 * @param dateLabel 日期標籤（例如：'2026/01/16'）
 * @returns 格式化後的時間（例如：'1/16/2026 7:30:00 PM'）
 */
export function formatSessionTime(sessionLabel: string, dateLabel: string): string {
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
 * 訂票參數介面
 */
export interface OrderParams {
  cinemaCode: string;      // 影城代碼（從選單值提取數字部分）
  sessionId: string;       // 場次 ID（從時間選單的值取得）
  cinemaId: string;        // 影城 ID（從選單值提取數字部分）
  hoCode: string;          // 片名代碼（從片名選單的值取得）
  priceCode: string;       // 價格代碼（固定為 '0001'）
  qty: string;             // 票數（從票數選單取得）
  sessionTime: string;    // 場次時間（am/pm 制格式）
  movieName: string;        // 片名（從片名選單的 label 取得）
}

/**
 * 確認訂票
 * @param params 訂票參數
 * @returns API 回應
 */
export async function confirmOrder(params: OrderParams): Promise<Response> {
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
    const headers: HeadersInit = {
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
