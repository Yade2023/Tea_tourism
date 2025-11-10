/**
 * 圖片路徑處理工具函數
 */

// 獲取 BASE_URL
function getBaseUrl(): string {
  // 運行時檢測
  if (typeof window !== 'undefined') {
    const base = document.querySelector('base')?.getAttribute('href');
    if (base) return base;
    
    // 根據當前路徑判斷是否為 GitHub Pages 部署
    const pathname = window.location.pathname;
    if (pathname.startsWith('/Tea_tourism/')) {
      return '/Tea_tourism/';
    }
  }
  
  // 默認根路徑（開發環境）
  return '/';
}

// 獲取完整的圖片 URL
export function getImageUrl(imagePath: string): string {
  // 移除開頭的斜線
  const cleanPath = imagePath.replace(/^\/+/, '');
  const base = getBaseUrl();
  
  // 確保 base 以斜線結尾
  const normalizedBase = base.endsWith('/') ? base : base + '/';
  
  return normalizedBase + cleanPath;
}

// 組建公共資源路徑
export function getPublicUrl(path: string): string {
  return getImageUrl(path);
}