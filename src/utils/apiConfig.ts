/**
 * API 配置檔案 - 使用 Cloudflare Workers 代理
 * 解決 HTTPS 環境下的 Mixed Content 問題
 */

// Cloudflare Workers 代理 URL
const PROXY_BASE_URL = 'https://teaagent.sy599200076.workers.dev'

// 原始 API 基礎 URL
const ORIGINAL_API_BASE = 'http://3.34.188.214:1011'

// 生成代理 URL
const getProxyUrl = (endpoint: string) => {
  const targetUrl = `${ORIGINAL_API_BASE}${endpoint}`
  return `${PROXY_BASE_URL}?url=${encodeURIComponent(targetUrl)}`
}

// 創建安全的 fetch 函數
export const safeFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const proxyUrl = getProxyUrl(endpoint)
  
  console.log('🚀 API 請求:', {
    endpoint,
    proxyUrl,
    originalTarget: `${ORIGINAL_API_BASE}${endpoint}`
  })
  
  try {
    const response = await fetch(proxyUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })
    
    if (!response.ok) {
      // 嘗試獲取錯誤詳情
      let errorDetails = response.statusText
      try {
        const errorText = await response.text()
        if (errorText) {
          errorDetails = errorText
        }
      } catch (e) {
        // 忽略解析錯誤
      }
      
      console.error('❌ API 回應錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: proxyUrl,
        details: errorDetails
      })
      
      throw new Error(`HTTP ${response.status}: ${errorDetails}`)
    }
    
    console.log('✅ API 請求成功:', response.status)
    return response
  } catch (error) {
    console.error(`💥 API 請求失敗 (${proxyUrl}):`, error)
    throw error
  }
}

// API 端點配置
export const API_CONFIG = {
  PROXY_BASE_URL,
  ORIGINAL_API_BASE,
  ENDPOINTS: {
    HOME: '/api/home',
    KNOWLEDGE: '/api/knowledge',
    ADDRESS: '/api/Address',
    CONTACT: '/api/Address/contact'
  }
}

// 輔助函數：直接獲取完整的代理 URL
export const getApiUrl = (endpoint: string) => getProxyUrl(endpoint)