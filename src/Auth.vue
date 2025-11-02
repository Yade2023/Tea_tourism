<script setup>
import { ref, computed, onMounted } from 'vue'
import taiwanImg from './assets/img/taiwan.jpeg'

// 表單狀態
const isLogin = ref(true) // true: 登陸, false: 註冊
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)

// 動畫狀態
const isLoading = ref(true)
const mousePosition = ref({ x: 0, y: 0 })
const characters = ref([
  { id: 1, name: 'orange', x: 35, y: 40, lookingAt: 'center', isVisible: true },
  { id: 2, name: 'purple', x: 50, y: 35, lookingAt: 'center', isVisible: true },
  { id: 3, name: 'black', x: 40, y: 55, lookingAt: 'center', isVisible: true },
  { id: 4, name: 'yellow', x: 55, y: 50, lookingAt: 'center', isVisible: true }
])
const isPasswordVisible = ref(false)
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
  isPasswordVisible.value = showPassword.value
  
  // 讓角色移開視線（害羞）
  characters.value.forEach(char => {
    char.lookingAt = 'away'
  })
  
  // 1.5秒後回到中心
  setTimeout(() => {
    characters.value.forEach(char => {
      char.lookingAt = 'center'
    })
  }, 1500)
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
  isPasswordVisible.value = showConfirmPassword.value
  
  // 讓角色移開視線（害羞）
  characters.value.forEach(char => {
    char.lookingAt = 'away'
  })
  
  // 1.5秒後回到中心
  setTimeout(() => {
    characters.value.forEach(char => {
      char.lookingAt = 'center'
    })
  }, 1500)
}

// 鼠標跟隨效果
const handleMouseMove = (event) => {
  const rect = event.target.getBoundingClientRect()
  mousePosition.value = {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  }
  
  // 只有在沒有其他互動時才跟隨鼠標
  const hasActiveInteraction = characters.value.some(char => 
    ['password', 'email', 'name', 'confirmPassword', 'away', 'jump', 'shake'].includes(char.lookingAt)
  )
  
  if (!hasActiveInteraction) {
    characters.value.forEach(char => {
      char.lookingAt = 'mouse'
    })
  }
}

// 輸入框焦點效果
const handleInputFocus = (fieldName) => {
  characters.value.forEach(char => {
    char.lookingAt = fieldName
  })
}

// 輸入框失焦效果
const handleInputBlur = () => {
  // 回到跟隨鼠標狀態
  characters.value.forEach(char => {
    char.lookingAt = 'mouse'
  })
}

// 輸入內容變化效果
const handleInputChange = (fieldName) => {
  characters.value.forEach(char => {
    char.lookingAt = fieldName
  })
  
  // 持續關注輸入框，不自動回到中心
}

// 載入動畫
const startLoadingAnimation = () => {
  isLoading.value = true
  
  // 角色彈出動畫
  characters.value.forEach((char, index) => {
    setTimeout(() => {
      char.isVisible = true
    }, index * 200)
  })
  
  // 3秒後隱藏載入畫面
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
}

// 登陸成功動畫
const showSuccessAnimation = () => {
  loginResult.value = 'success'
  characters.value.forEach(char => {
    char.lookingAt = 'jump'
  })
  
  setTimeout(() => {
    loginResult.value = null
    characters.value.forEach(char => {
      char.lookingAt = 'center'
    })
  }, 2000)
}

// 登陸失敗動畫
const showErrorAnimation = () => {
  loginResult.value = 'error'
  characters.value.forEach(char => {
    char.lookingAt = 'shake'
  })
  
  setTimeout(() => {
    loginResult.value = null
    characters.value.forEach(char => {
      char.lookingAt = 'center'
    })
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
  if (!validateLoginForm()) return
  
  loading.value = true
  
  // 模擬API請求
  setTimeout(() => {
    loading.value = false
    
    // 模擬登陸結果（這裡可以根據實際驗證邏輯修改）
    const isValid = loginForm.value.email === 'test@example.com' && loginForm.value.password === 'password123'
    
    if (isValid) {
      showSuccessAnimation()
      setTimeout(() => {
        alert('登陸成功！歡迎回來！')
      }, 1000)
    } else {
      showErrorAnimation()
      setTimeout(() => {
        alert('登陸失敗！請檢查帳號密碼！')
      }, 1000)
    }
  }, 1000)
}

const handleRegister = async () => {
  if (!validateRegisterForm()) return
  
  loading.value = true
  
  // 模擬API請求
  setTimeout(() => {
    loading.value = false
    showSuccessAnimation()
    setTimeout(() => {
      alert('註冊成功！歡迎加入台灣茶葉旅遊！')
    }, 1000)
  }, 1000)
}

// 計算屬性
const currentForm = computed(() => isLogin.value ? loginForm.value : registerForm.value)
const currentErrors = computed(() => isLogin.value ? loginErrors.value : registerErrors.value)

// 組件掛載時啟動載入動畫
onMounted(() => {
  startLoadingAnimation()
})
</script>

<template>
  <div class="auth-container">
    <!-- 載入動畫 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="characters-container" @mousemove="handleMouseMove">
        <div 
          v-for="character in characters" 
          :key="character.id"
          :class="[
            'character', 
            character.name,
            { 'visible': character.isVisible },
            { 'looking-password': character.lookingAt === 'password' },
            { 'looking-email': character.lookingAt === 'email' },
            { 'looking-name': character.lookingAt === 'name' },
            { 'looking-confirmPassword': character.lookingAt === 'confirmPassword' },
            { 'looking-away': character.lookingAt === 'away' },
            { 'looking-mouse': character.lookingAt === 'mouse' },
            { 'jumping': character.lookingAt === 'jump' },
            { 'shaking': character.lookingAt === 'shake' }
          ]"
          :style="{ 
            left: character.x + '%', 
            top: character.y + '%'
          }"
        >
          <div class="character-body"></div>
          <div class="character-eyes">
            <div class="eye left-eye"></div>
            <div class="eye right-eye"></div>
          </div>
          <div class="character-mouth"></div>
        </div>
      </div>
      <div class="loading-text">載入中...</div>
    </div>

    <div class="auth-wrapper" :class="{ 'hidden': isLoading }">
      <!-- 左側角色區域 -->
      <div class="auth-image-section" @mousemove="handleMouseMove">
        <div class="characters-container">
          <div 
            v-for="character in characters" 
            :key="character.id"
            :class="[
              'character', 
              character.name,
              { 'visible': character.isVisible },
            { 'looking-password': character.lookingAt === 'password' },
            { 'looking-email': character.lookingAt === 'email' },
            { 'looking-name': character.lookingAt === 'name' },
            { 'looking-confirmPassword': character.lookingAt === 'confirmPassword' },
            { 'looking-away': character.lookingAt === 'away' },
            { 'looking-mouse': character.lookingAt === 'mouse' },
            { 'jumping': character.lookingAt === 'jump' },
            { 'shaking': character.lookingAt === 'shake' }
            ]"
            :style="{ 
              left: character.x + '%', 
              top: character.y + '%'
            }"
          >
            <div class="character-body"></div>
            <div class="character-eyes">
              <div class="eye left-eye"></div>
              <div class="eye right-eye"></div>
            </div>
            <div class="character-mouth"></div>
          </div>
        </div>
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
                @focus="handleInputFocus('name')"
                @blur="handleInputBlur"
                @input="handleInputChange('name')"
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
                @focus="handleInputFocus('email')"
                @blur="handleInputBlur"
                @input="handleInputChange('email')"
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
                  @focus="handleInputFocus('password')"
                  @blur="handleInputBlur"
                  @input="handleInputChange('password')"
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
                  @focus="handleInputFocus('confirmPassword')"
                  @blur="handleInputBlur"
                  @input="handleInputChange('confirmPassword')"
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
  position: relative;
}

/* 載入動畫樣式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.characters-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 表單中的角色容器 */
.auth-image-section .characters-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
}

.character {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.character.visible {
  opacity: 1;
  transform: scale(1);
}

.character-body {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.character.orange .character-body {
  background: linear-gradient(135deg, #ff8c42, #ff6b35);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.character.purple .character-body {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 20px;
  height: 80px;
}

.character.black .character-body {
  background: linear-gradient(135deg, #374151, #1f2937);
  border-radius: 15px;
  height: 70px;
}

.character.yellow .character-body {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
  width: 80px;
  height: 60px;
}

.character-eyes {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.eye {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: relative;
}

.eye::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 4px;
  height: 4px;
  background: #000;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.character-mouth {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  border: 2px solid #000;
  border-top: none;
  border-radius: 0 0 20px 20px;
  transition: all 0.3s ease;
}

/* 角色動畫 */
.character.looking-password .character-eyes {
  transform: translateX(-50%) translateX(10px);
}

.character.looking-password .character-mouth {
  width: 15px;
  height: 8px;
}

.character.looking-email .character-eyes {
  transform: translateX(-50%) translateX(8px);
}

.character.looking-email .character-mouth {
  width: 18px;
  height: 9px;
}

.character.looking-name .character-eyes {
  transform: translateX(-50%) translateX(6px);
}

.character.looking-name .character-mouth {
  width: 16px;
  height: 8px;
}

.character.looking-confirmPassword .character-eyes {
  transform: translateX(-50%) translateX(12px);
}

.character.looking-confirmPassword .character-mouth {
  width: 14px;
  height: 7px;
}

.character.looking-away .character-eyes {
  transform: translateX(-50%) translateX(-15px);
}

.character.looking-away .character-mouth {
  width: 12px;
  height: 6px;
  border-radius: 0 0 15px 15px;
}

.character.looking-mouse .character-eyes {
  transform: translateX(-50%) translateX(8px);
}

.character.looking-mouse .character-mouth {
  width: 18px;
  height: 9px;
}

.character.jumping {
  animation: jump 0.6s ease-in-out;
}

.character.shaking {
  animation: shake 0.5s ease-in-out;
}

@keyframes jump {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.loading-text {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #2c5530;
  font-weight: bold;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.auth-wrapper.hidden {
  opacity: 0;
  pointer-events: none;
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
