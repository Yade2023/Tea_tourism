// 導航欄滾動隱藏功能
console.log('Navbar scroll functionality loaded');

// 全域變數
let lastScrollTop = 0;
let scrollTimeout;
let touchStartY = 0;
const scrollThreshold = 10; // 滾動閾值，避免過於敏感

// 初始化函數
function initNavbarScroll() {
  // 等待 DOM 完全載入後再取得元素
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) {
    console.warn('Navbar element not found, retrying...');
    setTimeout(initNavbarScroll, 100);
    return;
  }

  console.log('Navbar element found, initializing scroll functionality');

  // 滾動處理函數
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 清除之前的延時
    clearTimeout(scrollTimeout);
    
    // 延時執行，避免滾動過程中頻繁切換
    scrollTimeout = setTimeout(() => {
      // 如果在頁面頂部，總是顯示導航欄
      if (scrollTop <= 50) {
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
        return;
      }
      
      // 判斷滾動方向
      if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
          // 向下滾動 - 隱藏導航欄
          navbar.classList.add('hidden');
          navbar.classList.remove('visible');
        } else {
          // 向上滾動 - 顯示導航欄
          navbar.classList.remove('hidden');
          navbar.classList.add('visible');
        }
        lastScrollTop = scrollTop;
      }
    }, 10); // 10ms 延時
  }

  // 鼠標移動到頂部時顯示導航欄
  function handleMouseMove(e) {
    if (e.clientY <= 50) {
      navbar.classList.remove('hidden');
      navbar.classList.add('visible');
    }
  }

  // 觸控開始處理
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  // 觸控移動處理
  function handleTouchMove(e) {
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    // 觸控向上滑動超過 30px 時隱藏導航欄
    if (diff > 30 && window.pageYOffset > 50) {
      navbar.classList.add('hidden');
      navbar.classList.remove('visible');
    }
    // 觸控向下滑動超過 30px 時顯示導航欄  
    else if (diff < -30) {
      navbar.classList.remove('hidden');
      navbar.classList.add('visible');
    }
  }

  // 導航欄懸停處理
  function handleNavbarEnter() {
    navbar.classList.remove('hidden');
    navbar.classList.add('visible');
  }

  // 綁定事件監聽器
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  navbar.addEventListener('mouseenter', handleNavbarEnter);

  // 返回清理函數
  return function cleanup() {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    navbar.removeEventListener('mouseenter', handleNavbarEnter);
    clearTimeout(scrollTimeout);
  };
}

// 自動初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbarScroll);
} else {
  // DOM 已經載入完成
  initNavbarScroll();
}

// 匯出初始化函數供其他模組使用
export { initNavbarScroll };