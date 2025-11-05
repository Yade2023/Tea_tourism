<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 導入認證服務，用於與後端資料庫通訊
import { login, register } from './services/authService.js'

// Props：可選的登入/註冊成功後跳轉路徑
const props = defineProps({
  redirectAfterLogin: {
    type: String,
    default: null
  },
  redirectAfterRegister: {
    type: String,
    default: null
  }
})

const router = useRouter()
const route = useRoute()

// 表單狀態
const isLogin = ref(true) // true: 登陸, false: 註冊
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)
const loginResult = ref(null) // 'success', 'error', null

// 登陸表單
const loginForm = ref({
  email: '',
  password: ''
})

// 註冊表單
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 表單驗證
const loginErrors = ref({})
const registerErrors = ref({})

// 切換登陸/註冊模式
const toggleMode = () => {
  isLogin.value = !isLogin.value
  clearForm()
}

// 切換密碼顯示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 登陸成功動畫
const showSuccessAnimation = () => {
  loginResult.value = 'success'
  setTimeout(() => {
    loginResult.value = null
  }, 2000)
}

// 登陸失敗動畫
const showErrorAnimation = () => {
  loginResult.value = 'error'
  setTimeout(() => {
    loginResult.value = null
  }, 2000)
}

// 清空表單
const clearForm = () => {
  loginForm.value = { email: '', password: '' }
  registerForm.value = { name: '', email: '', password: '', confirmPassword: '' }
  loginErrors.value = {}
  registerErrors.value = {}
}

// 表單驗證
const validateLoginForm = () => {
  const errors = {}
  
  if (!loginForm.value.email) {
    errors.email = '請輸入電子郵件'
  } else if (!/\S+@\S+\.\S+/.test(loginForm.value.email)) {
    errors.email = '請輸入有效的電子郵件格式'
  }
  
  if (!loginForm.value.password) {
    errors.password = '請輸入密碼'
  } else if (loginForm.value.password.length < 6) {
    errors.password = '密碼至少需要6個字符'
  }
  
  loginErrors.value = errors
  return Object.keys(errors).length === 0
}

const validateRegisterForm = () => {
  const errors = {}
  
  if (!registerForm.value.name) {
    errors.name = '請輸入姓名'
  } else if (registerForm.value.name.length < 2) {
    errors.name = '姓名至少需要2個字符'
  }
  
  if (!registerForm.value.email) {
    errors.email = '請輸入電子郵件'
  } else if (!/\S+@\S+\.\S+/.test(registerForm.value.email)) {
    errors.email = '請輸入有效的電子郵件格式'
  }
  
  if (!registerForm.value.password) {
    errors.password = '請輸入密碼'
  } else if (registerForm.value.password.length < 6) {
    errors.password = '密碼至少需要6個字符'
  }
  
  if (!registerForm.value.confirmPassword) {
    errors.confirmPassword = '請確認密碼'
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errors.confirmPassword = '密碼不一致'
  }
  
  registerErrors.value = errors
  return Object.keys(errors).length === 0
}

// 提交表單
const handleLogin = async () => {
  // 先進行表單驗證，如果驗證失敗則不繼續執行
  if (!validateLoginForm()) return
  
  // 設定載入狀態為 true，顯示載入中的 UI
  loading.value = true
  
  try {
    // 呼叫認證服務的 login 函數，發送登入請求到後端 API
    // 這個函數會向後端發送 POST 請求到 /auth/login 端點
    // 後端會查詢資料庫驗證用戶的帳號密碼
    const response = await login(
      loginForm.value.email,
      loginForm.value.password
    )
    
    // 登入成功：後端返回了 token 和用戶資訊
    // token 已經自動儲存在 localStorage 中（由 authService 處理）
    loading.value = false
    showSuccessAnimation()
    
    setTimeout(() => {
      // 優先順序：1. props.redirectAfterLogin 2. 路由查詢參數 redirect 3. 預設跳轉路徑
      const redirectPath = props.redirectAfterLogin || route.query.redirect || '/'
      
      // 執行跳轉到指定頁面
      router.push(redirectPath)
    }, 1000)
    
  } catch (error) {
    // 登入失敗：處理錯誤情況
    loading.value = false
    showErrorAnimation()
    
    // 顯示錯誤訊息給用戶
    // error.message 來自後端 API 返回的錯誤訊息
    setTimeout(() => {
      const errorMessage = error.message || '登入失敗！請檢查帳號密碼！'
      alert(errorMessage)
    }, 1000)
  }
}

const handleRegister = async () => {
  // 先進行表單驗證，如果驗證失敗則不繼續執行
  if (!validateRegisterForm()) return
  
  // 設定載入狀態為 true，顯示載入中的 UI
  loading.value = true
  
  try {
    // 呼叫認證服務的 register 函數，發送註冊請求到後端 API
    // 這個函數會向後端發送 POST 請求到 /auth/register 端點
    // 後端會將新用戶資料存入資料庫（通常會檢查 email 是否已存在）
    const response = await register(
      registerForm.value.name,
      registerForm.value.email,
      registerForm.value.password
    )
    
    // 註冊成功：後端已將用戶資料存入資料庫
    // 如果後端自動登入，token 已經自動儲存在 localStorage 中
    loading.value = false
    showSuccessAnimation()
    
    setTimeout(() => {
      // 優先順序：1. props.redirectAfterRegister 2. 路由查詢參數 redirect 3. 不跳轉
      const redirectPath = props.redirectAfterRegister || route.query.redirect
      
      // 如果指定了跳轉路徑，則執行跳轉
      if (redirectPath && typeof redirectPath === 'string') {
        router.push(redirectPath)
      } else {
        // 如果沒有指定跳轉路徑，只顯示成功訊息，不跳轉
        alert('註冊成功！歡迎加入台灣茶葉旅遊！')
      }
    }, 1000)
    
  } catch (error) {
    // 註冊失敗：處理錯誤情況（例如：email 已被使用）
    loading.value = false
    showErrorAnimation()
    
    // 顯示錯誤訊息給用戶
    setTimeout(() => {
      const errorMessage = error.message || '註冊失敗！請檢查輸入的資訊！'
      alert(errorMessage)
    }, 1000)
  }
}

// 計算屬性
const currentForm = computed(() => isLogin.value ? loginForm.value : registerForm.value)
const currentErrors = computed(() => isLogin.value ? loginErrors.value : registerErrors.value)

</script>

<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <!-- 右側表單區域 -->
      <div class="auth-form-section">
        <div class="auth-form-container">
          <!-- 頂部圖標 -->
          <div class="top-icon">
            <div class="cross-icon">+</div>
          </div>
          
          <!-- 標題 -->
          <div class="auth-header">
            <h1>{{ isLogin ? 'Welcome back!' : 'Join us!' }}</h1>
            <p>{{ isLogin ? 'Please enter your details' : 'Please create your account' }}</p>
          </div>
          
          <!-- 表單 -->
          <form @submit.prevent="isLogin ? handleLogin() : handleRegister()" class="auth-form">
            <!-- 註冊時顯示姓名欄位 -->
            <div v-if="!isLogin" class="form-group">
              <label for="name">Name</label>
              <input
                id="name"
                v-model="registerForm.name"
                type="text"
                placeholder="Enter your name"
                :class="{ error: registerErrors.name }"
              />
              <span v-if="registerErrors.name" class="error-message">{{ registerErrors.name }}</span>
            </div>
            
            <!-- 電子郵件 -->
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="currentForm.email"
                type="email"
                placeholder="Enter your email"
                :class="{ error: currentErrors.email }"
              />
              <span v-if="currentErrors.email" class="error-message">{{ currentErrors.email }}</span>
            </div>
            
            <!-- 密碼 -->
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  v-model="currentForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  :class="{ error: currentErrors.password }"
                />
                <button type="button" @click="togglePassword" class="password-toggle">
                  <span v-if="showPassword">👁️</span>
                  <span v-else>👁️‍🗨️</span>
                </button>
              </div>
              <span v-if="currentErrors.password" class="error-message">{{ currentErrors.password }}</span>
            </div>
            
            <!-- 確認密碼（僅註冊時顯示） -->
            <div v-if="!isLogin" class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  :class="{ error: registerErrors.confirmPassword }"
                />
                <button type="button" @click="toggleConfirmPassword" class="password-toggle">
                  <span v-if="showConfirmPassword">👁️</span>
                  <span v-else>👁️‍🗨️</span>
                </button>
              </div>
              <span v-if="registerErrors.confirmPassword" class="error-message">{{ registerErrors.confirmPassword }}</span>
            </div>
            
            <!-- 選項區域（僅登陸時顯示） -->
            <div v-if="isLogin" class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                Remember for 30 days
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            
            <!-- 提交按鈕 -->
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading">Processing...</span>
              <span v-else>{{ isLogin ? 'Log in' : 'Sign up' }}</span>
            </button>
          </form>
          
          <!-- 切換模式 -->
          <div class="auth-switch">
            <p>
              {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
              <button type="button" @click="toggleMode" class="switch-btn">
                {{ isLogin ? 'Sign Up' : 'Log In' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 重置樣式，確保不受全局樣式影響 */
.auth-container {
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  font-size: 16px; /* 確保基本字體大小 */
}

.auth-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  width: 100%;
  max-width: 500px;
  min-height: auto;
  box-sizing: border-box;
  transform: scale(1); /* 確保沒有被縮放 */
  justify-content: center;
  align-items: center;
}

.auth-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

.auth-form-container {
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
  font-size: 16px; /* 確保表單容器字體大小正常 */
}

.top-icon {
  text-align: center;
  margin-bottom: 20px;
}

.cross-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #000;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0 auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  color: #000;
  font-size: 28px !important;
  margin: 0 0 8px 0;
  font-weight: bold;
  line-height: 1.2;
}

.auth-header p {
  color: #666;
  font-size: 14px !important;
  margin: 0;
  line-height: 1.5;
}

.auth-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #000;
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 14px !important;
  line-height: 1.4;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px !important;
  transition: all 0.3s ease;
  box-sizing: border-box;
  line-height: 1.5;
  -webkit-appearance: none;
  appearance: none;
}

.form-group input:focus {
  outline: none;
  border-color: #000;
}

.form-group input.error {
  border-color: #e74c3c;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.error-message {
  color: #e74c3c;
  font-size: 12px !important;
  margin-top: 4px;
  display: block;
  line-height: 1.4;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px !important;
  color: #666;
  line-height: 1.5;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-right: 8px;
  width: auto;
}

.forgot-password {
  color: #000;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  background: #000;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px !important;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  box-sizing: border-box;
  line-height: 1.5;
  min-height: 44px; /* 確保觸控目標足夠大 */
  touch-action: manipulation; /* 改善移動端觸控體驗 */
}

.submit-btn:hover:not(:disabled) {
  background: #333;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-btn {
  width: 100%;
  background: white;
  color: #000;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px !important;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  line-height: 1.5;
  min-height: 44px; /* 確保觸控目標足夠大 */
  touch-action: manipulation; /* 改善移動端觸控體驗 */
}

.google-btn:hover {
  background: #f8f9fa;
}

.google-icon {
  width: 20px;
  height: 20px;
  background: #4285f4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.auth-switch {
  text-align: center;
}

.auth-switch p {
  color: #666;
  margin: 0;
  font-size: 14px !important;
  line-height: 1.5;
}

.switch-btn {
  background: none;
  border: none;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px !important;
  margin-left: 5px;
  line-height: 1.5;
}

.switch-btn:hover {
  color: #333;
}

/* 響應式設計 - 平板 (768px 以下) */
@media (max-width: 768px) {
  .auth-container {
    padding: 15px;
    align-items: flex-start;
    padding-top: 40px;
  }

  .auth-wrapper {
    width: 100%;
    max-width: 100%;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  
  .auth-form-section {
    padding: 30px 24px;
  }
  
  .auth-form-container {
    max-width: 100%;
  }

  .auth-header {
    margin-bottom: 24px;
  }
  
  .auth-header h1 {
    font-size: 24px !important;
  }

  .auth-header p {
    font-size: 13px !important;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-options {
    flex-wrap: wrap;
    gap: 12px;
  }
}

/* 響應式設計 - 手機 (480px 以下) */
@media (max-width: 480px) {
  .auth-container {
    padding: 0;
    align-items: flex-start;
    padding-top: 20px;
    min-height: 100vh;
  }
  
  .auth-wrapper {
    border-radius: 0;
    width: 100%;
    max-width: 100%;
    box-shadow: none;
    min-height: calc(100vh - 20px);
  }
  
  .auth-form-section {
    padding: 24px 20px;
    min-height: 100%;
  }

  .auth-form-container {
    max-width: 100%;
  }

  .top-icon {
    margin-bottom: 16px;
  }

  .cross-icon {
    width: 20px;
    height: 20px;
    font-size: 16px;
  }
  
  .auth-header {
    margin-bottom: 20px;
  }

  .auth-header h1 {
    font-size: 22px !important;
    margin-bottom: 6px;
  }

  .auth-header p {
    font-size: 12px !important;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 13px !important;
    margin-bottom: 5px;
  }
  
  .form-group input {
    padding: 14px 16px;
    font-size: 16px !important; /* 防止 iOS 自動縮放 */
    border-radius: 8px;
    -webkit-appearance: none;
    appearance: none;
  }

  .password-toggle {
    right: 14px;
    font-size: 18px;
    padding: 4px;
    touch-action: manipulation; /* 改善觸控體驗 */
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
  }

  .checkbox-wrapper {
    font-size: 13px !important;
  }

  .forgot-password {
    font-size: 13px !important;
    align-self: flex-end;
  }
  
  .submit-btn, .google-btn {
    padding: 14px;
    font-size: 15px !important;
    border-radius: 8px;
    touch-action: manipulation; /* 改善觸控體驗 */
    min-height: 48px; /* 觸控目標最小尺寸 */
  }

  .google-btn {
    gap: 10px;
  }

  .google-icon {
    width: 18px;
    height: 18px;
    font-size: 11px;
  }

  .auth-switch {
    margin-top: 16px;
  }

  .auth-switch p {
    font-size: 13px !important;
    line-height: 1.6;
  }

  .switch-btn {
    font-size: 13px !important;
    padding: 4px 0;
    touch-action: manipulation;
  }

  .error-message {
    font-size: 11px !important;
    margin-top: 3px;
  }
}

/* 響應式設計 - 小手機 (360px 以下) */
@media (max-width: 360px) {
  .auth-container {
    padding-top: 15px;
  }

  .auth-form-section {
    padding: 20px 16px;
  }

  .auth-header h1 {
    font-size: 20px !important;
  }

  .auth-header p {
    font-size: 11px !important;
  }

  .form-group input {
    padding: 12px 14px;
    font-size: 15px !important;
  }

  .submit-btn, .google-btn {
    padding: 12px;
    font-size: 14px !important;
  }
}

/* 橫向模式優化 */
@media (max-height: 600px) and (orientation: landscape) {
  .auth-container {
    align-items: flex-start;
    padding: 10px;
    padding-top: 20px;
  }

  .auth-form-section {
    padding: 20px;
  }

  .auth-header {
    margin-bottom: 16px;
  }

  .auth-header h1 {
    font-size: 20px !important;
    margin-bottom: 4px;
  }

  .auth-header p {
    font-size: 11px !important;
  }

  .form-group {
    margin-bottom: 12px;
  }
}

/* 大螢幕優化 (1200px 以上) */
@media (min-width: 1200px) {
  .auth-wrapper {
    max-width: 800px; /* 改大一些 */
    margin: 0 auto;   /* 置中 */
    max-height: 100vh;
  }

  .auth-form-container {
    max-width: 700px; /* 調整成合適比例 */
    max-height: 100vh;
  }

  .auth-header h1 {
    font-size: 32px !important;
  }

  .auth-header p {
    font-size: 15px !important;
  }
}

</style>
