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

/**
 * API 請求處理工具函數
 * 解決 HTTPS -> HTTP Mixed Content 問題
 */

// API 配置
const API_BASE = 'http://3.34.188.214:1011';

// 檢測是否為 HTTPS 環境
function isHttpsEnvironment(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

// 獲取 API URL
function getApiUrl(endpoint: string): string {
  if (isHttpsEnvironment()) {
    // 使用 CORS 代理服務來繞過 Mixed Content 限制
    // 這些是免費的 CORS 代理服務
    const corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?'
    ];
    
    // 使用第一個代理
    return `${corsProxies[1]}${encodeURIComponent(API_BASE + endpoint)}`;
  } else {
    // 開發環境直接使用
    return API_BASE + endpoint;
  }
}

// 安全的 fetch 函數
export async function safeFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  console.log(`🌐 API 請求: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('API 請求失敗:', error);
    throw error;
  }
}

// API 端點配置
export const API_ENDPOINTS = {
  HOME: '/api/home',
  KNOWLEDGE: '/api/knowledge',
  ADDRESS: '/api/Address',
  CONTACT: '/api/Address/contact'
};