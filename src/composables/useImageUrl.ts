import { getImageUrl } from '../utils/imageHelper'
import { computed } from 'vue'

// 創建一個 Vue 組合函數來處理圖片 URL
export function useImageUrl() {
  const getPublicImageUrl = (path: string) => {
    return getImageUrl(path)
  }

  // 創建一個 computed 屬性來動態獲取 base URL
  const baseUrl = computed(() => {
    if (typeof window !== 'undefined') {
      return document.querySelector('base')?.href || window.location.origin + '/'
    }
    return '/'
  })

  return {
    getPublicImageUrl,
    baseUrl
  }
}