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
