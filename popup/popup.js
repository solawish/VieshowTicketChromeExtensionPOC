/**
 * Popup 主要邏輯
 * 處理四個級聯下拉選單的互動和資料載入
 */

import { getCinemas, getMovies, getDates, getSessions } from '../utils/api.js';

// DOM 元素
const cinemaSelect = document.getElementById('cinema-select');
const movieSelect = document.getElementById('movie-select');
const dateSelect = document.getElementById('date-select');
const timeSelect = document.getElementById('time-select');

const cinemaLoading = document.getElementById('cinema-loading');
const movieLoading = document.getElementById('movie-loading');
const dateLoading = document.getElementById('date-loading');
const timeLoading = document.getElementById('time-loading');

const cinemaError = document.getElementById('cinema-error');
const movieError = document.getElementById('movie-error');
const dateError = document.getElementById('date-error');
const timeError = document.getElementById('time-error');

/**
 * 清除選單選項（保留預設選項）
 */
function clearSelect(select, defaultText) {
  select.innerHTML = `<option value="">${defaultText}</option>`;
}

/**
 * 填充選單選項
 */
function populateSelect(select, items, defaultText) {
  // 暫時移除事件監聽器，避免在填充選項時觸發 change 事件
  const selectId = select.id;
  let listener = null;
  
  // 保存當前選擇值（如果有的話）
  const currentValue = select.value;
  
  clearSelect(select, defaultText);
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
  
  // 如果之前有選擇值，且新選單中有相同的值，則恢復選擇
  if (currentValue && items.some(item => item.value === currentValue)) {
    select.value = currentValue;
  }
}

/**
 * 顯示載入狀態
 */
function showLoading(loadingElement, select) {
  loadingElement.style.display = 'block';
  select.disabled = true;
}

/**
 * 隱藏載入狀態
 */
function hideLoading(loadingElement, select) {
  loadingElement.style.display = 'none';
  select.disabled = false;
}

/**
 * 顯示錯誤訊息
 */
function showError(errorElement, message) {
  errorElement.textContent = message;
}

/**
 * 清除錯誤訊息
 */
function clearError(errorElement) {
  errorElement.textContent = '';
}

/**
 * 重置後續選單
 */
function resetSubsequentSelects(startFrom) {
  // 根據 startFrom 參數，只重置該選單及其後續選單
  if (startFrom === 'movie') {
    // 重置片名、日期、時間選單
    clearSelect(movieSelect, '請先選擇影城');
    movieSelect.disabled = true;
    clearError(movieError);
    clearSelect(dateSelect, '請先選擇片名');
    dateSelect.disabled = true;
    clearError(dateError);
    clearSelect(timeSelect, '請先選擇日期');
    timeSelect.disabled = true;
    clearError(timeError);
  } else if (startFrom === 'date') {
    // 只重置日期和時間選單，不影響片名選單
    clearSelect(dateSelect, '請先選擇片名');
    dateSelect.disabled = true;
    clearError(dateError);
    clearSelect(timeSelect, '請先選擇日期');
    timeSelect.disabled = true;
    clearError(timeError);
  } else if (startFrom === 'time') {
    // 只重置時間選單，不影響其他選單
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
  
  console.log('loadDates 被呼叫:', { selectedCinema, selectedMovie });
  
  if (!selectedCinema || !selectedMovie) {
    console.log('缺少必要參數，重置後續選單');
    resetSubsequentSelects('date');
    return;
  }
  
  // 保存當前片名選擇值，以防載入失敗時需要恢復
  const savedMovieValue = selectedMovie;
  console.log('保存片名選擇值:', savedMovieValue);
  
  try {
    showLoading(dateLoading, dateSelect);
    clearError(dateError);
    // 只重置日期和時間選單，不影響片名選單
    resetSubsequentSelects('date');
    
    // 確保片名選單的值沒有被改變
    if (movieSelect.value !== savedMovieValue) {
      console.warn('片名選單值被改變，恢復為:', savedMovieValue);
      movieSelect.value = savedMovieValue;
    }
    
    console.log('開始載入日期，參數:', { selectedCinema, selectedMovie });
    const dates = await getDates(selectedCinema, selectedMovie);
    console.log('日期載入成功，共', dates.length, '筆');
    
    // 再次確保片名選單的值沒有被改變
    if (movieSelect.value !== savedMovieValue) {
      console.warn('載入日期後，片名選單值被改變，恢復為:', savedMovieValue);
      movieSelect.value = savedMovieValue;
    }
    
    populateSelect(dateSelect, dates, '請選擇日期');
    dateSelect.disabled = false;
    hideLoading(dateLoading, dateSelect);
    
    // 最終確認片名選單的值
    if (movieSelect.value !== savedMovieValue) {
      console.warn('填充選單後，片名選單值被改變，恢復為:', savedMovieValue);
      movieSelect.value = savedMovieValue;
    }
  } catch (error) {
    hideLoading(dateLoading, dateSelect);
    // 確保片名選單的值沒有被改變
    if (movieSelect.value !== savedMovieValue) {
      console.warn('載入日期失敗後，片名選單值被改變，恢復為:', savedMovieValue);
      movieSelect.value = savedMovieValue;
    }
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
  
  // 保存當前選擇值，以防載入失敗時需要恢復
  const savedMovieValue = selectedMovie;
  const savedDateValue = selectedDate;
  
  try {
    showLoading(timeLoading, timeSelect);
    clearError(timeError);
    // 只重置時間選單，不影響其他選單
    resetSubsequentSelects('time');
    
    // 確保其他選單的值沒有被改變
    if (movieSelect.value !== savedMovieValue) {
      movieSelect.value = savedMovieValue;
    }
    if (dateSelect.value !== savedDateValue) {
      dateSelect.value = savedDateValue;
    }
    
    const sessions = await getSessions(selectedCinema, selectedMovie, selectedDate);
    
    // 再次確保其他選單的值沒有被改變
    if (movieSelect.value !== savedMovieValue) {
      movieSelect.value = savedMovieValue;
    }
    if (dateSelect.value !== savedDateValue) {
      dateSelect.value = savedDateValue;
    }
    
    populateSelect(timeSelect, sessions, '請選擇時間');
    timeSelect.disabled = false;
    hideLoading(timeLoading, timeSelect);
  } catch (error) {
    hideLoading(timeLoading, timeSelect);
    // 確保其他選單的值沒有被改變
    if (movieSelect.value !== savedMovieValue) {
      movieSelect.value = savedMovieValue;
    }
    if (dateSelect.value !== savedDateValue) {
      dateSelect.value = savedDateValue;
    }
    showError(timeError, `載入時間失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    console.error('載入時間失敗:', error);
  }
}

// 事件監聽器
cinemaSelect.addEventListener('change', () => {
  loadMovies();
});

movieSelect.addEventListener('change', (e) => {
  // 確保有選擇值才載入日期
  if (movieSelect.value) {
    console.log('片名選擇變更:', movieSelect.value);
    loadDates();
  } else {
    // 如果選擇被清除，重置後續選單
    resetSubsequentSelects('date');
  }
});

dateSelect.addEventListener('change', () => {
  loadSessions();
});

// 初始化：載入影城列表
loadCinemas();
