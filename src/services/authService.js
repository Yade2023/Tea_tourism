import apiClient from './api.js'

/**
 * 認證服務 - 處理所有與用戶認證相關的 API 呼叫
 * 這個檔案負責與後端 API 通訊，進行登入、註冊等資料庫操作
 */

/**
 * 用戶登入
 * @param {string} email - 用戶電子郵件
 * @param {string} password - 用戶密碼
 * @returns {Promise} 返回登入結果，包含 token 和用戶資訊
 */
export const login = async (email, password) => {
  try {
    // 發送 POST 請求到後端的 /auth/login 端點
    const response = await apiClient.post('/auth/login', {
      email,
      password
    })
    
    // 如果登入成功，後端會返回 token 和用戶資訊
    if (response.token) {
      // 將 token 儲存到 localStorage，用於後續的 API 請求認證
      localStorage.setItem('authToken', response.token)
      
      // 將用戶資訊儲存到 localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
    }
    
    return response
  } catch (error) {
    // 如果登入失敗，拋出錯誤讓呼叫者處理
    throw error
  }
}

/**
 * 用戶註冊
 * @param {string} name - 用戶姓名
 * @param {string} email - 用戶電子郵件
 * @param {string} password - 用戶密碼
 * @returns {Promise} 返回註冊結果
 */
export const register = async (name, email, password) => {
  try {
    // 發送 POST 請求到後端的 /auth/register 端點
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password
    })
    
    // 如果註冊成功，後端可能會自動登入並返回 token
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
    }
    
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 用戶登出
 * 清除本地儲存的認證資訊
 */
export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

/**
 * 取得當前登入的用戶資訊
 * @returns {Object|null} 返回用戶資訊，如果未登入則返回 null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  }
  return null
}

/**
 * 檢查用戶是否已登入
 * @returns {boolean} 如果已登入返回 true，否則返回 false
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken')
}

/**
 * 取得認證 token
 * @returns {string|null} 返回 token，如果未登入則返回 null
 */
export const getToken = () => {
  return localStorage.getItem('authToken')
}

/**
 * 驗證 token 是否有效（可選功能）
 * 向後端發送請求驗證 token 是否仍然有效
 * @returns {Promise} 返回驗證結果
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get('/auth/verify')
    return response
  } catch (error) {
    // 如果 token 無效，清除本地儲存
    logout()
    throw error
  }
}

