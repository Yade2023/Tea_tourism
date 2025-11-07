<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 導入 SVG 圖片
import teapotSvg from '../assets/images/index_img/Rau_A_cup_of_tea.svg'
import pitcherSvg from '../assets/images/index_img/PrinterKiller-Cup-of-Tea.svg'
import teacupSvg from '../assets/images/index_img/teacup-.svg'
import mugSvg from '../assets/images/index_img/Anonymous_mug_of_tea.svg'

// 表單狀態
const isLogin = ref(true) // true: 登陸, false: 註冊
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)

// 動畫狀態
const isLoading = ref(true)
const mousePosition = ref({ x: 0, y: 0 })
const formMousePosition = ref({ x: 0, y: 0 })
const isFormHovered = ref(false)
const inputAnimationTimer = ref(null)
const characters = ref([
  { id: 1, name: 'teapot', x: 30, y: 40, lookingAt: 'center', isVisible: true, svg: teapotSvg, animationIntensity: 0 },
  { id: 2, name: 'pitcher', x: 50, y: 35, lookingAt: 'center', isVisible: true, svg: pitcherSvg, animationIntensity: 0 },
  { id: 3, name: 'teacup', x: 70, y: 50, lookingAt: 'center', isVisible: true, svg: teacupSvg, animationIntensity: 0 }
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

  // 1.6秒後回到中心
  setTimeout(() => {
    characters.value.forEach(char => {
      char.lookingAt = 'center'
    })
  }, 1600)
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

// 鼠標跟隨效果（左側區域）
const handleMouseMove = (event) => {
  const rect = event.target.getBoundingClientRect()
  mousePosition.value = {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  }

  // 只有在沒有其他互動時才跟隨鼠標
  const hasActiveInteraction = characters.value.some(char =>
    ['password', 'email', 'name', 'confirmPassword', 'away', 'jump', 'shake', 'typing'].includes(char.lookingAt)
  )

  if (!hasActiveInteraction) {
    // 讓茶具根據鼠標位置有更自然的跟隨效果
    characters.value.forEach((char, index) => {
      const distanceX = mousePosition.value.x - char.x
      const distanceY = mousePosition.value.y - char.y
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      // 如果鼠標在附近，讓茶具稍微傾斜朝向鼠標
      if (distance < 30) {
        const angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI)
        char.lookingAt = 'mouse'
        char.animationIntensity = (30 - distance) / 30 // 0-1 的強度
      } else {
        char.lookingAt = 'mouse'
        char.animationIntensity = 0
      }
    })
  }
}

// 表單區域鼠標移動效果
const handleFormMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  formMousePosition.value = {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  }

  // 讓茶具根據表單區域的鼠標位置有反應
  const hasActiveInteraction = characters.value.some(char =>
    ['password', 'email', 'name', 'confirmPassword', 'away', 'jump', 'shake', 'typing'].includes(char.lookingAt)
  )

  if (!hasActiveInteraction && isFormHovered.value) {
    // 計算表單位置，讓茶具看向表單方向
    const formX = 50 // 表單在右側，大約在50%位置
    characters.value.forEach((char, index) => {
      char.lookingAt = 'form-hover'
      // 根據表單內的鼠標位置調整動畫強度
      char.animationIntensity = Math.min(1, formMousePosition.value.y / 50)
    })
  }
}

// 表單區域進入
const handleFormMouseEnter = () => {
  isFormHovered.value = true
}

// 表單區域離開
const handleFormMouseLeave = () => {
  isFormHovered.value = false
  characters.value.forEach(char => {
    if (char.lookingAt === 'form-hover') {
      char.lookingAt = 'mouse'
    }
  })
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
  // 清除之前的計時器
  if (inputAnimationTimer.value) {
    clearTimeout(inputAnimationTimer.value)
  }

  // 觸發輸入動畫
  characters.value.forEach((char, index) => {
    char.lookingAt = 'typing'
    // 根據輸入框類型調整動畫強度
    const intensity = fieldName === 'password' ? 0.8 : 0.5
    char.animationIntensity = intensity

    // 添加輕微的跳動效果
    setTimeout(() => {
      if (char.lookingAt === 'typing') {
        char.lookingAt = fieldName
        char.animationIntensity = 0.3
      }
    }, 100)
  })

  // 持續關注輸入框，不自動回到中心
  inputAnimationTimer.value = setTimeout(() => {
    characters.value.forEach(char => {
      if (char.lookingAt === 'typing') {
        char.lookingAt = fieldName
        char.animationIntensity = 0.2
      }
    })
  }, 500)
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
      // 保存登入資訊到 localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', loginForm.value.email)
      setTimeout(() => {
        // 跳轉到首頁
        router.push('/')
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
        <div v-for="character in characters" :key="character.id" :class="[
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
        ]" :style="{
          left: character.x + '%',
          top: character.y + '%'
        }">
          <img :src="character.svg" :alt="character.name" class="tea-item-svg" />
        </div>
      </div>
      <div class="loading-text">載入中...</div>
    </div>

    <div class="auth-wrapper" :class="{ 'hidden': isLoading }">
      <!-- 左側角色區域 -->
      <div class="auth-image-section" @mousemove="handleMouseMove">
        <div class="characters-container">
          <div v-for="character in characters" :key="character.id" :class="[
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
          ]" :style="{
            left: character.x + '%',
            top: character.y + '%'
          }">
            <img :src="character.svg" :alt="character.name" class="tea-item-svg" />
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
          <form @submit.prevent="isLogin ? handleLogin() : handleRegister()" class="auth-form"
            @mousemove="handleFormMouseMove" @mouseenter="handleFormMouseEnter" @mouseleave="handleFormMouseLeave">
            <!-- 註冊時顯示姓名欄位 -->
            <div v-if="!isLogin" class="form-group">
              <label for="name">Name</label>
              <input id="name" v-model="registerForm.name" type="text" placeholder="Enter your name"
                :class="{ error: registerErrors.name }" @focus="handleInputFocus('name')" @blur="handleInputBlur"
                @input="handleInputChange('name')" />
              <span v-if="registerErrors.name" class="error-message">{{ registerErrors.name }}</span>
            </div>

            <!-- 電子郵件 -->
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="currentForm.email" type="email" placeholder="Enter your email"
                :class="{ error: currentErrors.email }" @focus="handleInputFocus('email')" @blur="handleInputBlur"
                @input="handleInputChange('email')" />
              <span v-if="currentErrors.email" class="error-message">{{ currentErrors.email }}</span>
            </div>

            <!-- 密碼 -->
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input-wrapper">
                <input id="password" v-model="currentForm.password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password" :class="{ error: currentErrors.password }"
                  @focus="handleInputFocus('password')" @blur="handleInputBlur"
                  @input="handleInputChange('password')" />
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
                <input id="confirmPassword" v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm your password"
                  :class="{ error: registerErrors.confirmPassword }" @focus="handleInputFocus('confirmPassword')"
                  @blur="handleInputBlur" @input="handleInputChange('confirmPassword')" />
                <button type="button" @click="toggleConfirmPassword" class="password-toggle">
                  <span v-if="showConfirmPassword">👁️</span>
                  <span v-else>👁️‍🗨️</span>
                </button>
              </div>
              <span v-if="registerErrors.confirmPassword" class="error-message">{{ registerErrors.confirmPassword
              }}</span>
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
            test@example.com &nbsp;&nbsp;&nbsp; password123

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
  background: #faf8f3;
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
  background: linear-gradient(135deg, #faf8f3, #f5f0e8);
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
  /* 在主畫面區塊加入背景圖（以漸層疊加圖片，確保文字/角色可讀） */
  background: linear-gradient(135deg, rgba(250, 248, 243, 0.8), rgba(245, 240, 232, 0.8)), url('/src/images/原始圖/teaserving.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character {
  position: absolute;
  opacity: 0;
  transform: scale(0);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.character.visible {
  opacity: 1;
  transform: scale(1);
}

/* SVG 圖片樣式 */
.tea-item-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  animation: gentleFloat 3s ease-in-out infinite;
}

/* 當有特殊動畫時，暫停基礎浮動 */
.character.looking-typing .tea-item-svg,
.character.jumping .tea-item-svg,
.character.shaking .tea-item-svg {
  animation: none;
}

.character.looking-typing .tea-item-svg {
  animation: typingBounce 0.3s ease-in-out;
}

/* 基礎浮動動畫 - 讓茶具有生命力（使用 opacity 和 filter 以避免 transform 衝突） */
@keyframes gentleFloat {

  0%,
  100% {
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  }

  50% {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  }
}

/* 每個茶具的浮動動畫有不同的延遲 */
.character.teapot .tea-item-svg {
  animation-delay: 0s;
}

.character.pitcher .tea-item-svg {
  animation-delay: 0.5s;
}

.character.teacup .tea-item-svg {
  animation-delay: 1s;
}

/* 茶壺樣式 */
.character.teapot {
  width: 120px;
  height: 140px;
}

/* 玻璃水壺樣式 */
.character.pitcher {
  width: 100px;
  height: 140px;
}

/* 茶杯樣式 */
.character.teacup {
  width: 100px;
  height: 100px;
}

/* 茶具動畫 - 根據關注的對象調整位置和角度 */
.character.looking-password .tea-item-svg {
  transform: translateX(8px) rotate(5deg);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 10px rgba(139, 69, 19, 0.3));
  animation: gentleFloat 3s ease-in-out infinite, inputFocus 2s ease-in-out infinite;
}

.character.looking-email .tea-item-svg {
  transform: translateX(6px) rotate(3deg);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 10px rgba(139, 69, 19, 0.3));
  animation: gentleFloat 3s ease-in-out infinite, inputFocus 2s ease-in-out infinite;
}

.character.looking-name .tea-item-svg {
  transform: translateX(4px) rotate(2deg);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 10px rgba(139, 69, 19, 0.3));
  animation: gentleFloat 3s ease-in-out infinite, inputFocus 2s ease-in-out infinite;
}

.character.looking-confirmPassword .tea-item-svg {
  transform: translateX(10px) rotate(6deg);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 10px rgba(139, 69, 19, 0.3));
  animation: gentleFloat 3s ease-in-out infinite, inputFocus 2s ease-in-out infinite;
}

/* 輸入框聚焦時的輕微脈衝 - 只改變 scale，不改變位置 */
@keyframes inputFocus {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
  }
}

.character.looking-away .tea-item-svg {
  transform: translateX(-12px) rotate(-8deg);
  opacity: 0.7;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.character.looking-mouse .tea-item-svg {
  transform: translateX(5px) rotate(2deg);
  animation: gentleFloat 3s ease-in-out infinite, mouseFollow 2s ease-in-out infinite;
}

/* 表單懸停效果 */
.character.looking-form-hover .tea-item-svg {
  transform: translateX(-8px) rotate(-3deg) scale(1.05);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 15px rgba(139, 69, 19, 0.4));
  animation: formHoverPulse 1.5s ease-in-out infinite;
}

/* 輸入時的動畫 */
.character.looking-typing .tea-item-svg {
  animation: typingBounce 0.3s ease-in-out;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 12px rgba(139, 69, 19, 0.5));
}

/* 鼠標跟隨動畫 */
@keyframes mouseFollow {

  0%,
  100% {
    transform: translateX(5px) rotate(2deg) translateY(0px);
  }

  50% {
    transform: translateX(5px) rotate(2deg) translateY(-3px);
  }
}

/* 表單懸停脈衝動畫 */
@keyframes formHoverPulse {

  0%,
  100% {
    transform: translateX(-8px) rotate(-3deg) scale(1.05);
  }

  50% {
    transform: translateX(-8px) rotate(-3deg) scale(1.08);
  }
}

/* 輸入跳動動畫 */
@keyframes typingBounce {

  0%,
  100% {
    transform: translateY(0px) scale(1);
  }

  25% {
    transform: translateY(-8px) scale(1.05);
  }

  50% {
    transform: translateY(-4px) scale(1.02);
  }

  75% {
    transform: translateY(-6px) scale(1.03);
  }
}

.character.jumping {
  animation: teaJump 0.6s ease-in-out;
}

.character.jumping .tea-item-svg {
  animation: teaBodyJump 0.6s ease-in-out, gentleFloat 3s ease-in-out infinite 0.6s;
}

.character.shaking {
  animation: teaShake 0.5s ease-in-out;
}

.character.shaking .tea-item-svg {
  animation: teaSvgShake 0.5s ease-in-out;
}

@keyframes teaJump {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-25px) scale(1.05);
  }
}

@keyframes teaBodyJump {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-3deg);
  }

  75% {
    transform: rotate(3deg);
  }
}

@keyframes teaShake {

  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }

  25% {
    transform: translateX(-8px) rotate(-5deg);
  }

  75% {
    transform: translateX(8px) rotate(5deg);
  }
}

@keyframes teaSvgShake {

  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }

  25% {
    transform: translateX(-3px) rotate(-2deg);
  }

  75% {
    transform: translateX(3px) rotate(2deg);
  }
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

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
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
  background: #faf8f3;
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

  /* 響應式 SVG 尺寸 */
  .character.teapot {
    width: 80px;
    height: 95px;
  }

  .character.pitcher {
    width: 70px;
    height: 95px;
  }

  .character.teacup {
    width: 70px;
    height: 70px;
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

  .submit-btn,
  .google-btn {
    padding: 10px;
    font-size: 14px;
  }

  /* 小螢幕 SVG 尺寸 */
  .character.teapot {
    width: 60px;
    height: 70px;
  }

  .character.pitcher {
    width: 55px;
    height: 75px;
  }

  .character.teacup {
    width: 55px;
    height: 55px;
  }
}
</style>