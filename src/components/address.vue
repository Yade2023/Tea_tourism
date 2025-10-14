<template>
  <section class="address">
    <div class="container">
      <!-- 三大理念 -->
      <div class="concepts">
        <div class="concept">
          <div class="icon">
            <img
              src="https://www.truney.com/web/image/product.product/8028/image_1920/%5BPR-08405%5D%202024%20%E6%97%A5%E6%9C%AC%E6%AD%A6%E5%A3%AB%E9%A0%AD%E7%9B%94%E4%BB%BF%E5%8F%A4%E9%8A%80%E5%B9%A3?unique=4d15bff"
              alt="理念一圖示"
            />
          </div>
          <h3>理念一</h3>
          <p>濯濯長江東逝水，浪花淘盡英雄。</p>
        </div>

        <div class="concept">
          <div class="icon">
            <img
              src="https://www.truney.com/web/image/product.product/8028/image_1920/%5BPR-08405%5D%202024%20%E6%97%A5%E6%9C%AC%E6%AD%A6%E5%A3%AB%E9%A0%AD%E7%9B%94%E4%BB%BF%E5%8F%A4%E9%8A%80%E5%B9%A3?unique=4d15bff"
              alt="理念二圖示"
            />
          </div>
          <h3>理念二</h3>
          <p>濯濯長江東逝水，浪花淘盡英雄。</p>
        </div>

        <div class="concept">
          <div class="icon">
            <img
              src="https://www.truney.com/web/image/product.product/8028/image_1920/%5BPR-08405%5D%202024%20%E6%97%A5%E6%9C%AC%E6%AD%A6%E5%A3%AB%E9%A0%AD%E7%9B%94%E4%BB%BF%E5%8F%A4%E9%8A%80%E5%B9%A3?unique=4d15bff"
              alt="理念三圖示"
            />
          </div>
          <h3>理念三</h3>
          <p>濯濯長江東逝水，浪花淘盡英雄。</p>
        </div>
      </div>

      <!-- 聯絡表單 -->
      <h2 class="h2text">聯絡我們</h2>
      <form @submit.prevent="handleSubmit" id="contactForm" novalidate>
        <div class="form-group">
          <label for="name">您的名稱 *</label>
          <input id="name" type="text" v-model.trim="name" :disabled="isSubmitting" required />
        </div>

        <div class="form-group">
          <label for="email">您的電子郵件 *</label>
          <input id="email" type="email" v-model.trim="email" :disabled="isSubmitting" required />
        </div>

        <div class="form-group">
          <label for="message">內容（意見 / 聯絡事宜 / 其他） *</label>
          <textarea id="message" v-model.trim="message" :disabled="isSubmitting" required></textarea>
        </div>

        <div class="submit-btn">
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '發送中…' : '發送' }}
          </button>
        </div>

        <p v-if="success" class="form-success">已送出，我們會盡快與您聯繫！</p>
        <p v-if="error" class="form-error">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

const isSubmitting = ref(false)
const success = ref(false)
const error = ref('')

const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || '')

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  if (!name.value || !email.value || !message.value) {
    error.value = '請完整填寫必填欄位。'
    return
  }
  if (!isValidEmail(email.value)) {
    error.value = '請輸入有效的電子郵件。'
    return
  }

  try {
    isSubmitting.value = true

    // 換成你的實際 API 路徑
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value
      })
    })

    if (!res.ok) throw new Error('送出失敗，請稍後再試。')

    name.value = ''
    email.value = ''
    message.value = ''
    success.value = true
  } catch (e) {
    error.value = e.message || '發送時發生錯誤。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<!-- 外掛你的 CSS（我已幫你命名空間化） -->
<style src="../assets/css/address.css"></style>
