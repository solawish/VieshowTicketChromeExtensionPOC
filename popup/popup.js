/**
 * Popup 主要邏輯
 * 處理四個級聯下拉選單的互動和資料載入
 */

import { 
  getCinemas, 
  getMovies, 
  getDates, 
  getSessions,
  confirmOrder,
  selectSeats,
  parseSeatCoordinates,
  reserveSeats,
  extractCinemaCode,
  formatSessionTime
} from '../utils/api.js';

// DOM 元素
const cinemaSelect = document.getElementById('cinema-select');
const movieSelect = document.getElementById('movie-select');
const dateSelect = document.getElementById('date-select');
const timeSelect = document.getElementById('time-select');
const quantitySelect = document.getElementById('quantity-select');

const cinemaLoading = document.getElementById('cinema-loading');
const movieLoading = document.getElementById('movie-loading');
const dateLoading = document.getElementById('date-loading');
const timeLoading = document.getElementById('time-loading');
const orderLoading = document.getElementById('order-loading');

const cinemaError = document.getElementById('cinema-error');
const movieError = document.getElementById('movie-error');
const dateError = document.getElementById('date-error');
const timeError = document.getElementById('time-error');
const quantityError = document.getElementById('quantity-error');

const confirmOrderBtn = document.getElementById('confirm-order-btn');
const orderResponse = document.getElementById('order-response');

// 檢查必要的 DOM 元素是否存在
if (!cinemaSelect || !movieSelect || !dateSelect || !timeSelect || !quantitySelect) {
  console.error('無法找到必要的 DOM 元素');
}

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
  if (!select) {
    console.error('populateSelect: select 元素不存在');
    return;
  }
  
  if (!items || !Array.isArray(items)) {
    console.error('populateSelect: items 不是陣列', items);
    return;
  }
  
  // 保存當前選擇值（如果有的話）
  const currentValue = select.value;
  
  clearSelect(select, defaultText);
  
  console.log(`填充選單 ${select.id}，共 ${items.length} 個選項`);
  
  items.forEach(item => {
    if (!item || !item.value || !item.label) {
      console.warn('populateSelect: 無效的項目', item);
      return;
    }
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
  
  // 如果之前有選擇值，且新選單中有相同的值，則恢復選擇
  if (currentValue && items.some(item => item.value === currentValue)) {
    select.value = currentValue;
  }
  
  console.log(`選單 ${select.id} 填充完成，目前有 ${select.options.length} 個選項`);
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
  if (!cinemaSelect) {
    console.error('cinemaSelect 元素不存在');
    return;
  }
  
  try {
    showLoading(cinemaLoading, cinemaSelect);
    clearError(cinemaError);
    
    const cinemas = await getCinemas();
    console.log('取得影城列表:', cinemas);
    
    if (cinemas && cinemas.length > 0) {
      populateSelect(cinemaSelect, cinemas, '請選擇影城');
    } else {
      console.warn('影城列表為空');
      showError(cinemaError, '無法載入影城列表');
    }
    
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

/**
 * 檢查所有選單是否都有選擇值
 */
function checkAllSelections() {
  const hasCinema = cinemaSelect.value !== '';
  const hasMovie = movieSelect.value !== '';
  const hasDate = dateSelect.value !== '';
  const hasTime = timeSelect.value !== '';
  const hasQuantity = quantitySelect.value !== '';
  
  return hasCinema && hasMovie && hasDate && hasTime && hasQuantity;
}

/**
 * 更新確認訂票按鈕的啟用狀態
 */
function updateConfirmButtonState() {
  const allSelected = checkAllSelections();
  confirmOrderBtn.disabled = !allSelected;
}

/**
 * 顯示訂單回應
 * @param {string|number} contentOrStatusCode 回應內容字串或 HTTP status code
 * @param {string} statusText HTTP status text（如果第一個參數是 status code）
 * @param {boolean} isSuccess 是否成功
 */
function showOrderResponse(contentOrStatusCode, statusText, isSuccess) {
  if (typeof contentOrStatusCode === 'string') {
    // 如果第一個參數是字串，直接使用
    orderResponse.textContent = contentOrStatusCode;
  } else {
    // 如果第一個參數是數字，使用舊的格式
    orderResponse.textContent = `${contentOrStatusCode} ${statusText}`;
  }
  orderResponse.className = `order-response-box ${isSuccess ? 'success' : 'error'}`;
}

/**
 * 追加內容到訂單回應框
 */
function appendOrderResponse(content) {
  const currentContent = orderResponse.textContent;
  if (currentContent) {
    orderResponse.textContent = `${currentContent}\n\n${content}`;
  } else {
    orderResponse.textContent = content;
  }
}

/**
 * 清除訂單回應
 */
function clearOrderResponse() {
  orderResponse.textContent = '';
  orderResponse.className = 'order-response-box';
}

/**
 * 處理訂票確認
 */
async function handleConfirmOrder() {
  // 檢查所有選單是否都有選擇值
  if (!checkAllSelections()) {
    return;
  }
  
  // 顯示載入狀態
  orderLoading.style.display = 'block';
  confirmOrderBtn.disabled = true;
  cinemaSelect.disabled = true;
  movieSelect.disabled = true;
  dateSelect.disabled = true;
  timeSelect.disabled = true;
  quantitySelect.disabled = true;
  clearOrderResponse();
  
  try {
    // 取得選單值
    const cinemaValue = cinemaSelect.value;
    const movieValue = movieSelect.value;
    const dateValue = dateSelect.value;
    const timeValue = timeSelect.value;
    const quantityValue = quantitySelect.value;
    
    // 取得選單的 label（顯示文字）
    const movieLabel = movieSelect.options[movieSelect.selectedIndex]?.text || '';
    const timeLabel = timeSelect.options[timeSelect.selectedIndex]?.text || '';
    
    console.log('選單原始值:', {
      cinemaValue,
      movieValue,
      dateValue,
      timeValue,
      quantityValue,
      movieLabel,
      timeLabel
    });
    
    // 提取參數
    const cinemaCode = extractCinemaCode(cinemaValue);
    const cinemaId = extractCinemaCode(cinemaValue);
    
    // 從 timeValue 中提取 SessionId（如果包含 URL 參數，只取 SessionId 部分）
    let sessionId = timeValue;
    if (timeValue.includes('txtSessionId=')) {
      // 如果 timeValue 是 URL 參數字串，提取 SessionId
      const match = timeValue.match(/txtSessionId=([^&]+)/);
      if (match) {
        sessionId = match[1];
      }
    }
    
    // HoCode 固定為 'HO00000001'
    const hoCode = 'HO00000001';
    
    const sessionTime = formatSessionTime(timeLabel, dateValue);
    
    console.log('提取後的參數:', {
      cinemaCode,
      sessionId,
      cinemaId,
      hoCode,
      sessionTime
    });
    
    // 構建訂票參數
    const orderParams = {
      cinemaCode,
      sessionId,
      cinemaId,
      hoCode,
      priceCode: '0001', // todo
      qty: quantityValue,
      sessionTime,
      movieName: movieLabel
    };
    
    // 呼叫訂票 API
    const response = await confirmOrder(orderParams);
    
    // 取得回應內容
    const responseText = await response.text();
    const isSuccess = response.status >= 200 && response.status < 300;
    
    // 隱藏載入狀態
    orderLoading.style.display = 'none';
    
    // 顯示訂票 API 回應
    let orderInfo = '=== 訂票 API 回應 ===\n';
    orderInfo += `HTTP Status: ${response.status} ${response.statusText}\n`;
    if (responseText) {
      orderInfo += `回應內容:\n${responseText}`;
    }
    showOrderResponse(orderInfo, '', isSuccess);
    
    if (isSuccess) {
      // 成功：顯示成功訊息
      console.log('訂票成功');
      
      // 自動呼叫座位選擇 API
      try {
        console.log('開始取得座位選擇頁面...');
        const htmlText = await selectSeats({
          cinemaCode,
          sessionId
        });
        
        console.log('座位選擇頁面取得成功，開始解析座標...');
        const coordinates = parseSeatCoordinates(htmlText);
        
        // 輸出解析出的座標
        console.log('解析出的座位座標:', coordinates);
        console.log(`共找到 ${coordinates.length} 個已選座位`);
        
        if (coordinates.length > 0) {
          console.log('座位座標詳情:');
          coordinates.forEach((coord, index) => {
            console.log(`  座位 ${index + 1}: SeatGridRowID=${coord.SeatGridRowID}, GridSeatNum=${coord.GridSeatNum}`);
          });
          
          // 在回應框中顯示座位座標資訊
          let seatInfo = '=== 座位座標資訊 ===\n';
          seatInfo += `共找到 ${coordinates.length} 個已選座位：\n`;
          coordinates.forEach((coord, index) => {
            seatInfo += `座位 ${index + 1}: SeatGridRowID=${coord.SeatGridRowID}, GridSeatNum=${coord.GridSeatNum}\n`;
          });
          appendOrderResponse(seatInfo);
          
          // 呼叫座位預訂 API
          try {
            console.log('開始預訂座位...');
            const reserveResponse = await reserveSeats({
              cinemaCode,
              sessionId,
              seats: coordinates
            });
            
            // 取得回應內容
            const responseText = await reserveResponse.text();
            const reserveSuccess = reserveResponse.status >= 200 && reserveResponse.status < 300;
            
            console.log('座位預訂 API 回應:', reserveResponse.status, reserveResponse.statusText);
            console.log('座位預訂 API 回應內容:', responseText);
            
            // 在回應框中顯示預訂 API 回應
            let reserveInfo = '=== 座位預訂回應 ===\n';
            reserveInfo += `HTTP Status: ${reserveResponse.status} ${reserveResponse.statusText}\n`;
            if (responseText) {
              reserveInfo += `回應內容:\n${responseText}`;
            }
            appendOrderResponse(reserveInfo);
            
            // 更新回應框樣式
            if (reserveSuccess) {
              orderResponse.className = 'order-response-box success';
              
              // 在座位預訂成功後，自動呼叫 checkout API
              try {
                const checkoutUrl = 'https://sales.vscinemas.com.tw/VieShowTicketT2/Home/Checkout';
                console.log('開始在 popup 中建立並提交 checkout 表單...');
                console.log('Checkout API URL:', checkoutUrl);
                
                // 在 popup 中動態建立表單並提交
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = checkoutUrl;
                form.target = '_blank'; // 在新分頁中開啟，避免 popup 被導航
                
                // 設定表單樣式（隱藏，不影響 popup 顯示）
                form.style.display = 'none';
                
                // 如果需要，可以添加隱藏欄位
                // 例如：添加 Referer 資訊或其他必要的表單欄位
                // const refererInput = document.createElement('input');
                // refererInput.type = 'hidden';
                // refererInput.name = 'referer';
                // refererInput.value = buildRefererUrl(cinemaCode, sessionId);
                // form.appendChild(refererInput);
                
                // 將表單添加到 popup 的 body
                document.body.appendChild(form);
                
                console.log('已在 popup 中建立 checkout 表單:', {
                  action: form.action,
                  method: form.method,
                  target: form.target
                });
                
                // 提交表單
                // 使用 form.submit() 會直接提交，不觸發 submit 事件
                form.submit();
                
                console.log('已提交 checkout 表單');
                
                // 提交後移除表單元素（可選）
                setTimeout(() => {
                  if (form.parentNode) {
                    form.parentNode.removeChild(form);
                  }
                }, 100);
                
              } catch (error) {
                // Checkout 流程失敗不影響訂票流程
                console.error('Checkout 流程失敗:', error);
                
                // 輸出失敗的 URL
                if (error.response && error.response.url) {
                  console.log('Checkout 失敗的 response URL:', error.response.url);
                } else if (error.url) {
                  console.log('Checkout 失敗的 URL:', error.url);
                } else {
                  // 備用方案：輸出預期的 URL
                  console.log('Checkout 失敗的 URL:', 'https://sales.vscinemas.com.tw/VieShowTicketT2/Home/Checkout');
                }
              }
            } else {
              orderResponse.className = 'order-response-box error';
            }
          } catch (error) {
            // 座位預訂流程失敗不影響訂票流程
            console.error('座位預訂流程失敗:', error);
            const errorInfo = '=== 座位預訂錯誤 ===\n';
            errorInfo += error instanceof Error ? error.message : '未知錯誤';
            appendOrderResponse(errorInfo);
            orderResponse.className = 'order-response-box error';
          }
        } else {
          // 沒有找到座位
          console.log('沒有找到已選座位');
          appendOrderResponse('=== 座位座標資訊 ===\n未找到已選座位');
        }
      } catch (error) {
        // 座位選擇流程失敗不影響訂票流程
        console.error('座位選擇流程失敗:', error);
        const errorInfo = '=== 座位選擇錯誤 ===\n';
        errorInfo += error instanceof Error ? error.message : '未知錯誤';
        appendOrderResponse(errorInfo);
      }
    } else {
      // 失敗：顯示錯誤訊息
      console.error('訂票失敗:', response.status, response.statusText);
    }
    
    // 恢復選單和按鈕狀態
    confirmOrderBtn.disabled = false;
    cinemaSelect.disabled = false;
    movieSelect.disabled = false;
    dateSelect.disabled = false;
    timeSelect.disabled = false;
    quantitySelect.disabled = false;
    
    // 更新按鈕狀態（因為可能選擇值已改變）
    updateConfirmButtonState();
  } catch (error) {
    // 隱藏載入狀態
    orderLoading.style.display = 'none';
    
    // 顯示錯誤
    showOrderResponse(0, error instanceof Error ? error.message : '未知錯誤', false);
    
    // 恢復選單和按鈕狀態
    confirmOrderBtn.disabled = false;
    cinemaSelect.disabled = false;
    movieSelect.disabled = false;
    dateSelect.disabled = false;
    timeSelect.disabled = false;
    quantitySelect.disabled = false;
    
    // 更新按鈕狀態
    updateConfirmButtonState();
    
    console.error('訂票處理失敗:', error);
  }
}

// 監聽所有選單的變更事件，更新按鈕狀態
cinemaSelect.addEventListener('change', () => {
  loadMovies();
  updateConfirmButtonState();
});

movieSelect.addEventListener('change', (e) => {
  if (movieSelect.value) {
    console.log('片名選擇變更:', movieSelect.value);
    loadDates();
  } else {
    resetSubsequentSelects('date');
  }
  updateConfirmButtonState();
});

dateSelect.addEventListener('change', () => {
  loadSessions();
  updateConfirmButtonState();
});

timeSelect.addEventListener('change', () => {
  updateConfirmButtonState();
});

quantitySelect.addEventListener('change', () => {
  updateConfirmButtonState();
});

// 確認訂票按鈕點擊事件
confirmOrderBtn.addEventListener('click', handleConfirmOrder);

// 初始化：載入影城列表
// 確保 DOM 完全準備好後再執行
function initialize() {
  console.log('開始初始化，檢查 DOM 元素...');
  console.log('cinemaSelect:', cinemaSelect);
  
  if (!cinemaSelect) {
    console.error('cinemaSelect 元素不存在，無法載入影城列表');
    return;
  }
  
  console.log('開始載入影城列表...');
  loadCinemas();
}

// 對於 ES6 模組，使用 DOMContentLoaded 確保 DOM 準備好
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  // DOM 已經準備好，直接執行
  initialize();
}
