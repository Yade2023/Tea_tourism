# API 整合與資料庫連接說明文件

## 📋 概述

本專案已整合資料庫連接功能，透過 RESTful API 與後端伺服器通訊，實現用戶登入和註冊功能。

## 🏗️ 架構說明

### 檔案結構

```
src/
├── services/
│   ├── api.js          # API 客戶端配置（axios 實例）
│   └── authService.js  # 認證相關的 API 服務
└── Auth.vue            # 認證組件（已整合 API 服務）
```

---

## 📁 檔案功能詳解

### 1. `src/services/api.js` - API 客戶端配置

**功能：** 建立統一的 HTTP 請求客戶端，處理所有與後端 API 的通訊。

#### 主要功能：

1. **創建 axios 實例**
   ```javascript
   const apiClient = axios.create({
     baseURL: API_BASE_URL,  // API 基礎 URL
     timeout: 10000,          // 10 秒超時
     headers: {
       'Content-Type': 'application/json'
     }
   })
   ```
   - 設定所有 API 請求的基礎 URL
   - 統一設定請求超時時間和標頭

2. **請求攔截器（Request Interceptor）**
   ```javascript
   apiClient.interceptors.request.use((config) => {
     const token = localStorage.getItem('authToken')
     if (token) {
       config.headers.Authorization = `Bearer ${token}`
     }
     return config
   })
   ```
   - **功能：** 在每個請求發送前自動加入認證 token
   - **用途：** 讓已登入用戶的後續 API 請求自動帶上身份驗證資訊

3. **響應攔截器（Response Interceptor）**
   ```javascript
   apiClient.interceptors.response.use(
     (response) => response.data,  // 成功時直接返回資料
     (error) => { /* 錯誤處理 */ }  // 失敗時統一處理錯誤
   )
   ```
   - **功能：** 統一處理 API 響應和錯誤
   - **錯誤處理：**
     - `401`：未授權，自動清除 token 並跳轉登入頁
     - `403`：沒有權限
     - `404`：資源不存在
     - `500`：伺服器錯誤
     - 網路連接失敗：顯示網路錯誤訊息

---

### 2. `src/services/authService.js` - 認證服務

**功能：** 封裝所有與用戶認證相關的 API 呼叫，提供簡單易用的函數介面。

#### 主要函數：

1. **`login(email, password)`** - 用戶登入
   ```javascript
   const response = await login('user@example.com', 'password123')
   ```
   - **流程：**
     1. 發送 POST 請求到 `/auth/login`
     2. 後端驗證帳號密碼（查詢資料庫）
     3. 成功後返回 token 和用戶資訊
     4. 自動將 token 儲存到 `localStorage`
   - **返回：** 包含 `token` 和 `user` 的物件

2. **`register(name, email, password)`** - 用戶註冊
   ```javascript
   const response = await register('張三', 'user@example.com', 'password123')
   ```
   - **流程：**
     1. 發送 POST 請求到 `/auth/register`
     2. 後端檢查 email 是否已存在（查詢資料庫）
     3. 如果不存在，將新用戶資料存入資料庫
     4. 成功後可能自動登入並返回 token
   - **返回：** 註冊結果，可能包含 token

3. **`logout()`** - 用戶登出
   ```javascript
   logout()
   ```
   - **功能：** 清除本地儲存的認證資訊（token 和用戶資料）

4. **`getCurrentUser()`** - 取得當前用戶
   ```javascript
   const user = getCurrentUser()
   ```
   - **功能：** 從 `localStorage` 讀取當前登入的用戶資訊

5. **`isAuthenticated()`** - 檢查是否已登入
   ```javascript
   if (isAuthenticated()) {
     // 用戶已登入
   }
   ```
   - **功能：** 檢查是否存在有效的認證 token

6. **`verifyToken()`** - 驗證 token 有效性
   ```javascript
   await verifyToken()
   ```
   - **功能：** 向後端發送請求驗證 token 是否仍然有效

---

### 3. `src/Auth.vue` - 認證組件（已整合 API）

**功能：** 用戶登入和註冊的 UI 組件，已整合資料庫連接功能。

#### 主要變更：

1. **導入認證服務**
   ```javascript
   import { login, register } from './services/authService.js'
   ```

2. **`handleLogin()` 函數 - 登入處理**
   ```javascript
   const handleLogin = async () => {
     // 1. 表單驗證
     if (!validateLoginForm()) return
     
     // 2. 設定載入狀態
     loading.value = true
     
     try {
       // 3. 呼叫 API 服務（連接到資料庫）
       const response = await login(
         loginForm.value.email,
         loginForm.value.password
       )
       
       // 4. 登入成功處理
       showSuccessAnimation()
       router.push(redirectPath)
       
     } catch (error) {
       // 5. 登入失敗處理
       showErrorAnimation()
       alert(error.message)
     }
   }
   ```
   - **流程說明：**
     1. 前端驗證表單格式
     2. 發送請求到後端 API
     3. 後端查詢資料庫驗證帳號密碼
     4. 根據結果顯示成功或失敗訊息

3. **`handleRegister()` 函數 - 註冊處理**
   ```javascript
   const handleRegister = async () => {
     // 1. 表單驗證
     if (!validateRegisterForm()) return
     
     // 2. 設定載入狀態
     loading.value = true
     
     try {
       // 3. 呼叫 API 服務（存入資料庫）
       const response = await register(
         registerForm.value.name,
         registerForm.value.email,
         registerForm.value.password
       )
       
       // 4. 註冊成功處理
       showSuccessAnimation()
       alert('註冊成功！')
       
     } catch (error) {
       // 5. 註冊失敗處理（例如：email 已存在）
       showErrorAnimation()
       alert(error.message)
     }
   }
   ```
   - **流程說明：**
     1. 前端驗證表單格式
     2. 發送請求到後端 API
     3. 後端檢查 email 是否已存在
     4. 如果不存在，將新用戶存入資料庫
     5. 根據結果顯示成功或失敗訊息

---

## 🔄 資料流程圖

### 登入流程

```
用戶輸入帳號密碼
    ↓
前端表單驗證
    ↓
Auth.vue → handleLogin()
    ↓
authService.js → login()
    ↓
api.js → POST /auth/login
    ↓
後端 API 伺服器
    ↓
查詢資料庫驗證帳號密碼
    ↓
返回 token 和用戶資訊
    ↓
儲存 token 到 localStorage
    ↓
顯示成功訊息並跳轉
```

### 註冊流程

```
用戶輸入註冊資訊
    ↓
前端表單驗證
    ↓
Auth.vue → handleRegister()
    ↓
authService.js → register()
    ↓
api.js → POST /auth/register
    ↓
後端 API 伺服器
    ↓
檢查 email 是否已存在
    ↓
將新用戶存入資料庫
    ↓
返回成功訊息（可能包含 token）
    ↓
顯示成功訊息
```

---

## ⚙️ 配置說明

### API 基礎 URL 設定

在 `src/services/api.js` 中設定：

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
```

**環境變數設定（可選）：**

創建 `.env` 檔案：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**不同環境的 URL：**
- 開發環境：`http://localhost:3000/api`
- 生產環境：`https://your-api-domain.com/api`

---

## 🔌 後端 API 規格要求

### 登入端點

**POST** `/auth/login`

**請求體：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功響應（200）：**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "張三",
    "email": "user@example.com"
  }
}
```

**失敗響應（401）：**
```json
{
  "message": "帳號或密碼錯誤"
}
```

### 註冊端點

**POST** `/auth/register`

**請求體：**
```json
{
  "name": "張三",
  "email": "user@example.com",
  "password": "password123"
}
```

**成功響應（200）：**
```json
{
  "message": "註冊成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "張三",
    "email": "user@example.com"
  }
}
```

**失敗響應（400）：**
```json
{
  "message": "此 email 已被使用"
}
```

---

## 🛠️ 錯誤處理

### 前端錯誤處理

所有錯誤都會被統一處理：

1. **網路錯誤：** 顯示「網路連接失敗，請檢查您的網路連線」
2. **401 錯誤：** 自動清除 token 並跳轉到登入頁
3. **其他錯誤：** 顯示後端返回的錯誤訊息

### 錯誤訊息來源

錯誤訊息優先順序：
1. 後端 API 返回的 `error.response.data.message`
2. 預設錯誤訊息

---

## 🔐 Token 管理

### Token 儲存

- **位置：** `localStorage.getItem('authToken')`
- **格式：** JWT Token（通常）
- **用途：** 後續 API 請求的身份驗證

### Token 自動附加

所有通過 `apiClient` 發送的請求都會自動在請求標頭中加入：

```
Authorization: Bearer <token>
```

### Token 清除時機

1. 用戶手動登出（呼叫 `logout()`）
2. 收到 401 錯誤（未授權）
3. Token 驗證失敗

---

## 📝 使用範例

### 在其他組件中使用認證服務

```javascript
<script setup>
import { isAuthenticated, getCurrentUser, logout } from './services/authService.js'

// 檢查用戶是否已登入
if (isAuthenticated()) {
  const user = getCurrentUser()
  console.log('當前用戶：', user.name)
}

// 登出
const handleLogout = () => {
  logout()
  router.push('/auth')
}
</script>
```

---

## 🚀 下一步

1. **設定後端 API：** 確保後端 API 伺服器已啟動並符合上述規格
2. **測試連接：** 測試登入和註冊功能是否正常運作
3. **環境變數：** 根據實際環境設定 `.env` 檔案
4. **錯誤處理優化：** 可將 `alert()` 替換為更美觀的錯誤提示組件

---

## ❓ 常見問題

**Q: 如何修改 API 的基礎 URL？**
A: 在 `src/services/api.js` 中修改 `API_BASE_URL`，或設定環境變數 `VITE_API_BASE_URL`

**Q: Token 過期怎麼辦？**
A: 當收到 401 錯誤時，系統會自動清除 token 並跳轉到登入頁

**Q: 如何測試 API 連接？**
A: 可以使用瀏覽器的開發者工具（F12）查看 Network 標籤，確認請求是否正確發送

**Q: 後端 API 還沒準備好怎麼辦？**
A: 可以暫時使用模擬資料或 Mock Service Worker (MSW) 進行前端開發

