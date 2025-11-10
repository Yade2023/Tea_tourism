// ./assets/js/navbar-scroll.ts

export default (function () {
  // 等DOM加載完成
  function init(): void {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const hoverZone = document.querySelector('.nav-hover-zone') as HTMLElement;

    if (!navbar || !hoverZone) {
      setTimeout(init, 100); // 如果元素還沒載入，100ms後重試
      return;
    }

    let isHoveringZone = false;
    let isHoveringNavbar = false;

    // 讓 hoverZone 只有在 navbar 收起時才攔滑鼠
    function syncHoverZoneHitbox(): void {
      const navbarVisible = navbar.classList.contains('visible');
      if (navbarVisible) {
        // navbar 展開 → 不要擋住點擊
        hoverZone.style.pointerEvents = 'none';
      } else {
        // navbar 收起 → 要能偵測滑鼠碰到上緣
        hoverZone.style.pointerEvents = 'auto';
      }
    }

    function showNavbar(): void {
      navbar.classList.add('visible');
      navbar.classList.remove('hidden');
      syncHoverZoneHitbox();
    }

    function hideNavbar(): void {
      navbar.classList.add('hidden');
      navbar.classList.remove('visible');
      syncHoverZoneHitbox();
    }

    function handleScroll(): void {
      const atTop = window.scrollY === 0;

      if (atTop) {
        // 在頁面最上面 → Navbar 常駐顯示
        showNavbar();
      } else {
        // 往下滑了 → 只有當滑鼠不在上緣 && 不在navbar本身時才收回
        if (!isHoveringZone && !isHoveringNavbar) {
          hideNavbar();
        }
      }
    }

    // ----- 滑鼠進出熱區 -----
    hoverZone.addEventListener('mouseenter', () => {
      isHoveringZone = true;
      showNavbar();
    });

    hoverZone.addEventListener('mouseleave', () => {
      isHoveringZone = false;
      if (window.scrollY > 0 && !isHoveringNavbar) {
        hideNavbar();
      }
    });

    // ----- 滑鼠進出 navbar 本體 -----
    navbar.addEventListener('mouseenter', () => {
      isHoveringNavbar = true;
      showNavbar();
    });

    navbar.addEventListener('mouseleave', () => {
      isHoveringNavbar = false;
      if (window.scrollY > 0 && !isHoveringZone) {
        hideNavbar();
      }
    });

    // ----- 捲動 -----
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初始化
    handleScroll();
    syncHoverZoneHitbox();

    // ==== 🔼 回到頂部按鈕功能 ====
    initBackToTop();
  }

  function initBackToTop(): void {
    const backToTop = document.getElementById('backToTop') as HTMLElement;
    
    if (!backToTop) {
      console.log('回到頂部按鈕元素未找到');
      setTimeout(initBackToTop, 100); // 重試
      return;
    }

    console.log('回到頂部按鈕已找到並初始化');

    // 監聽捲動，決定是否顯示按鈕
    function toggleBackToTopVisibility(): void {
      if (window.scrollY > 200) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTopVisibility, { passive: true });

    // 點擊回頂部
    backToTop.addEventListener('click', (e: Event) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // 初始檢查
    toggleBackToTopVisibility();
  }

  // 開始初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();