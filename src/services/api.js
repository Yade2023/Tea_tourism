import axios from 'axios'

// API 基礎配置
// 這裡設定您的後端 API 基礎 URL
// 開發環境通常使用 localhost，生產環境請修改為實際的 API 伺服器地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 請求超時時間（10秒）
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器：在發送請求前加入 token
apiClient.interceptors.request.use(
  (config) => {
    // 從 localStorage 取得 token（如果有的話）
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截器：處理統一錯誤
apiClient.interceptors.response.use(
  (response) => {
    // 如果響應成功，直接返回資料
    return response.data
  },
  (error) => {
    // 處理錯誤響應
    if (error.response) {
      // 伺服器有回應，但狀態碼不是 2xx
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授權，清除 token 並跳轉到登入頁
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          window.location.href = '/auth'
          break
        case 403:
          console.error('沒有權限訪問此資源')
          break
        case 404:
          console.error('請求的資源不存在')
          break
        case 500:
          console.error('伺服器內部錯誤')
          break
      }
      
      // 返回錯誤訊息
      return Promise.reject({
        message: data?.message || '請求失敗',
        status: status,
        data: data
      })
    } else if (error.request) {
      // 請求已發出，但沒有收到回應
      return Promise.reject({
        message: '網路連接失敗，請檢查您的網路連線',
        status: null
      })
    } else {
      // 其他錯誤
      return Promise.reject({
        message: error.message || '發生未知錯誤',
        status: null
      })
    }
  }
)

export default apiClient

