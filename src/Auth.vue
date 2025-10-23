<script setup>
import { ref, computed } from 'vue'
import taiwanImg from './assets/img/taiwan.png'

// 表單狀態
const isLogin = ref(true) // true: 登陸, false: 註冊
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)

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
  if (!validateLoginForm()) return
  
  loading.value = true
  
  // 模擬API請求
  setTimeout(() => {
    loading.value = false
    alert('登陸成功！歡迎回來！')
    // 這裡可以添加實際的登陸邏輯
  }, 1000)
}

const handleRegister = async () => {
  if (!validateRegisterForm()) return
  
  loading.value = true
  
  // 模擬API請求
  setTimeout(() => {
    loading.value = false
    alert('註冊成功！歡迎加入台灣茶葉旅遊！')
    // 這裡可以添加實際的註冊邏輯
  }, 1000)
}

// 計算屬性
const currentForm = computed(() => isLogin.value ? loginForm.value : registerForm.value)
const currentErrors = computed(() => isLogin.value ? loginErrors.value : registerErrors.value)
</script>

<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <!-- 左側背景區域 -->
      <div class="auth-image-section">
        <!-- 背景區塊，不包含角色 -->
      </div>
      
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
            
            <!-- Google 登陸按鈕（僅登陸時顯示） -->
            <button v-if="isLogin" type="button" class="google-btn">
              <span class="google-icon">G</span>
              Log In with Google
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
.auth-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.auth-wrapper {
  background: white;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 100vh;
}

.auth-image-section {
  flex: 1;
  background: #f1f3f4;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.auth-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
}

.auth-form-container {
  width: 100%;
  max-width: 350px;
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
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.auth-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
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
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
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
  font-size: 12px;
  margin-top: 4px;
  display: block;
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
  font-size: 14px;
  color: #666;
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
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
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
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  font-size: 14px;
}

.switch-btn {
  background: none;
  border: none;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  margin-left: 5px;
}

.switch-btn:hover {
  color: #333;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .auth-wrapper {
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }
  
  .auth-image-section {
    min-height: 200px;
    padding: 20px;
  }
  
  .auth-form-section {
    padding: 30px 20px;
    flex: 1;
  }
  
  .auth-header h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 0;
  }
  
  .auth-wrapper {
    border-radius: 0;
    width: 100%;
    height: 100vh;
  }
  
  .auth-form-section {
    padding: 20px 15px;
  }
  
  .form-group input {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .submit-btn, .google-btn {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
