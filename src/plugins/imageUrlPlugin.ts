import type { App } from 'vue'
import { getImageUrl } from '../utils/imageHelper'

// 創建 Vue 插件來提供全局圖片 URL 處理功能
export default {
  install(app: App) {
    // 提供全局屬性
    app.config.globalProperties.$getImageUrl = getImageUrl
    
    // 提供 inject 方式使用
    app.provide('getImageUrl', getImageUrl)
  }
}