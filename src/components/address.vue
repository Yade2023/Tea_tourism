<script setup>
import { ref, onMounted } from 'vue'
import '../assets/css/address.css'
import { mergeDefault } from '../assets/js/mergeDefault'

// UI 狀態：哪一個手風琴目前展開
const activeIndex = ref(null)

// 表單的 v-model
const nameInput = ref('')
const emailInput = ref('')
const messageInput = ref('')

// 這頁要用的內容資料（從 JSON + API 來）
const accordionList = ref([])

// API 狀態
const isApiSuccess = ref(false)

// 點開 / 收合手風琴
function toggleAccordion(index) {
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
  }
}

async function submitForm() {
  // 取得輸入欄位的值
  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const message = messageInput.value.trim()

  // 簡單前端驗證
  if (!name || !email || !message) {
    alert('請完整填寫所有欄位')
    return
  }

  try {
    // 發送 POST 請求到後端
    const response = await fetch('http://3.34.188.214:85/api/Address/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    })

    if (!response.ok) {
      throw new Error('網路錯誤或伺服器未回應')
    }

    const result = await response.json()
    console.log('伺服器回傳:', result)

    alert('您的訊息已成功送出，我們將盡快與您聯繫！')

    // 清空欄位
    nameInput.value = ''
    emailInput.value = ''
    messageInput.value = ''
  } catch (error) {
    console.error('送出失敗:', error)
    alert('送出失敗，請稍後再試或檢查網路連線。')
  }
}

// onMounted：1.拿本地JSON 2.拿API 3.merge
import defaultDataRaw from '../assets/json/address.json'

onMounted(async () => {
  // 1. 先把本地預設資料顯示在畫面上，讓頁面一開始就有內容
  //    defaultDataRaw 長這樣：{ accordionList: [...] }
  accordionList.value = defaultDataRaw.accordionList || []
  try {
    // 2. 嘗試叫 API (你之後可以讓這支 API 回傳 { accordionList: [...] } )
    const res = await fetch('http://3.34.188.214:85/api/Address')
    if (!res.ok) throw new Error('API 回傳狀態不是 200')

    const apiData = await res.json()

    // 3. 合併：用 API 值覆蓋，API 沒給/是 null 不會洗掉預設
    const merged = mergeDefault(defaultDataRaw, apiData)

     // 4. 更新畫面資料
    accordionList.value = merged.accordionList || []
    isApiSuccess.value = true  // API 成功
    console.log('✅ 使用 API + fallback 合併資料')
  } catch (err) {
    console.warn('⚠️ API 失敗，使用純預設 JSON：', err)
    isApiSuccess.value = false  // API 失敗
  }
})
</script>

<template>
  <div class="container">
    <div class="concepts">

      <!-- Q&A 區域 -->
      <div class="qa-section">
        <h2 class="qa-title" v-if="isApiSuccess">🍵 茶類常見問答精選(API成功)</h2>
        <h2 class="qa-title" v-else>🍵 茶類常見問答精選(API失敗)</h2>

        <div class="accordion">
          <div class="accordion-item" v-for="(group, idx) in accordionList" :key="idx"
            :class="{ active: activeIndex === idx }">
            <!-- 標題列 -->
            <div class="accordion-header" @click="toggleAccordion(idx)">
              <h3>{{ group.title }}</h3>
              <span class="accordion-icon">+</span>
            </div>

            <!-- 內容 -->
            <div class="accordion-content">
              <div class="qa-item" v-for="(item, qIndex) in group.qa" :key="qIndex">
                <div class="question">{{ item.q }}</div>
                <div class="answer">{{ item.a }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聯絡表單 -->
      <h2 class="h2text">聯絡我們</h2>

      <form id="contactForm" @submit.prevent="submitForm">
        <div class="form-group">
          <label>您的名稱 *</label>
          <input type="text" v-model="nameInput" required />
        </div>

        <div class="form-group">
          <label>您的電子郵件 *</label>
          <input type="email" v-model="emailInput" required />
        </div>

        <div class="form-group">
          <label>內容（意見 / 聯絡事宜 / 其他） *</label>
          <textarea v-model="messageInput" required></textarea>
        </div>

        <div class="submit-btn">
          <button type="submit">發送</button>
        </div>
      </form>

    </div>
  </div>
</template>
