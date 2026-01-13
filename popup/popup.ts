/**
 * Popup 主要邏輯
 * 處理四個級聯下拉選單的互動和資料載入
 */

import { getCinemas, getMovies, getDates, getSessions, type Cinema, type Movie, type DateOption, type Session } from '../utils/api.js';

// DOM 元素
const cinemaSelect = document.getElementById('cinema-select') as HTMLSelectElement;
const movieSelect = document.getElementById('movie-select') as HTMLSelectElement;
const dateSelect = document.getElementById('date-select') as HTMLSelectElement;
const timeSelect = document.getElementById('time-select') as HTMLSelectElement;

const cinemaLoading = document.getElementById('cinema-loading') as HTMLElement;
const movieLoading = document.getElementById('movie-loading') as HTMLElement;
const dateLoading = document.getElementById('date-loading') as HTMLElement;
const timeLoading = document.getElementById('time-loading') as HTMLElement;

const cinemaError = document.getElementById('cinema-error') as HTMLElement;
const movieError = document.getElementById('movie-error') as HTMLElement;
const dateError = document.getElementById('date-error') as HTMLElement;
const timeError = document.getElementById('time-error') as HTMLElement;

/**
 * 清除選單選項（保留預設選項）
 */
function clearSelect(select: HTMLSelectElement, defaultText: string) {
  select.innerHTML = `<option value="">${defaultText}</option>`;
}

/**
 * 填充選單選項
 */
function populateSelect<T extends { value: string; label: string }>(
  select: HTMLSelectElement,
  items: T[],
  defaultText: string
) {
  clearSelect(select, defaultText);
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
}

/**
 * 顯示載入狀態
 */
function showLoading(loadingElement: HTMLElement, select: HTMLSelectElement) {
  loadingElement.style.display = 'block';
  select.disabled = true;
}

/**
 * 隱藏載入狀態
 */
function hideLoading(loadingElement: HTMLElement, select: HTMLSelectElement) {
  loadingElement.style.display = 'none';
  select.disabled = false;
}

/**
 * 顯示錯誤訊息
 */
function showError(errorElement: HTMLElement, message: string) {
  errorElement.textContent = message;
}

/**
 * 清除錯誤訊息
 */
function clearError(errorElement: HTMLElement) {
  errorElement.textContent = '';
}

/**
 * 重置後續選單
 */
function resetSubsequentSelects(startFrom: 'movie' | 'date' | 'time') {
  if (startFrom === 'movie' || startFrom === 'date' || startFrom === 'time') {
    clearSelect(movieSelect, '請先選擇影城');
    movieSelect.disabled = true;
    clearError(movieError);
  }
  if (startFrom === 'date' || startFrom === 'time') {
    clearSelect(dateSelect, '請先選擇片名');
    dateSelect.disabled = true;
    clearError(dateError);
  }
  if (startFrom === 'time') {
    clearSelect(timeSelect, '請先選擇日期');
    timeSelect.disabled = true;
    clearError(timeError);
  }
}

/**
 * 載入影城列表
 */
async function loadCinemas() {
  try {
    showLoading(cinemaLoading, cinemaSelect);
    clearError(cinemaError);
    
    const cinemas = await getCinemas();
    populateSelect(cinemaSelect, cinemas, '請選擇影城');
    hideLoading(cinemaLoading, cinemaSelect);
  } catch (error) {
    hideLoading(cinemaLoading, cinemaSelect);
    showError(cinemaError, `載入影城失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    console.error('載入影城失敗:', error);
  }
}

/**
 * 載入電影列表
 */
async function loadMovies() {
  const selectedCinema = cinemaSelect.value;
  
  if (!selectedCinema) {
    resetSubsequentSelects('movie');
    return;
  }
  
  try {
    showLoading(movieLoading, movieSelect);
    clearError(movieError);
    resetSubsequentSelects('movie');
    
    const movies = await getMovies(selectedCinema);
    populateSelect(movieSelect, movies, '請選擇片名');
    movieSelect.disabled = false;
    hideLoading(movieLoading, movieSelect);
  } catch (error) {
    hideLoading(movieLoading, movieSelect);
    showError(movieError, `載入片名失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    console.error('載入片名失敗:', error);
  }
}

/**
 * 載入日期列表
 */
async function loadDates() {
  const selectedCinema = cinemaSelect.value;
  const selectedMovie = movieSelect.value;
  
  if (!selectedCinema || !selectedMovie) {
    resetSubsequentSelects('date');
    return;
  }
  
  try {
    showLoading(dateLoading, dateSelect);
    clearError(dateError);
    resetSubsequentSelects('date');
    
    const dates = await getDates(selectedCinema, selectedMovie);
    populateSelect(dateSelect, dates, '請選擇日期');
    dateSelect.disabled = false;
    hideLoading(dateLoading, dateSelect);
  } catch (error) {
    hideLoading(dateLoading, dateSelect);
    showError(dateError, `載入日期失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    console.error('載入日期失敗:', error);
  }
}

/**
 * 載入時間列表
 */
async function loadSessions() {
  const selectedCinema = cinemaSelect.value;
  const selectedMovie = movieSelect.value;
  const selectedDate = dateSelect.value;
  
  if (!selectedCinema || !selectedMovie || !selectedDate) {
    resetSubsequentSelects('time');
    return;
  }
  
  try {
    showLoading(timeLoading, timeSelect);
    clearError(timeError);
    resetSubsequentSelects('time');
    
    const sessions = await getSessions(selectedCinema, selectedMovie, selectedDate);
    populateSelect(timeSelect, sessions, '請選擇時間');
    timeSelect.disabled = false;
    hideLoading(timeLoading, timeSelect);
  } catch (error) {
    hideLoading(timeLoading, timeSelect);
    showError(timeError, `載入時間失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    console.error('載入時間失敗:', error);
  }
}

// 事件監聽器
cinemaSelect.addEventListener('change', () => {
  loadMovies();
});

movieSelect.addEventListener('change', () => {
  loadDates();
});

dateSelect.addEventListener('change', () => {
  loadSessions();
});

// 初始化：載入影城列表
loadCinemas();
