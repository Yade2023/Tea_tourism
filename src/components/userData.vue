<template>
  <div class="container py-4">
    <h3 class="mb-3">使用者基本資料</h3>

    <form @submit.prevent="onSubmit" class="card p-3">
      <div class="mb-3">
        <label class="form-label">姓名</label>
        <input type="text" class="form-control" v-model="formName" placeholder="請輸入姓名" required>
      </div>

      <div class="mb-3">
        <label class="form-label">住址</label>
        <input type="text" class="form-control" v-model="address" placeholder="請輸入住址" required>
      </div>

      <div class="mb-3">
        <label class="form-label">手機</label>
        <input type="tel" class="form-control" v-model="formPhone" placeholder="09xx-xxx-xxx" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="formEmail" placeholder="example@mail.com" required>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">保存</button>
        <button type="button" class="btn btn-outline-secondary" @click="onReset">重置</button>
      </div>
    </form>

    <div class="card p-3 mt-3">
      <h6 class="mb-2">地圖位置</h6>
      <div v-if="mapUrl" class="ratio ratio-16x9">
        <iframe :src="mapUrl" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div v-else class="text-muted">請先填寫「住址」，以顯示地圖位置。</div>
    </div>

    <div class="card p-3 mt-3">
      <h6 class="mb-3">結帳明細（快照）</h6>
      <div v-if="checkoutItems.length > 0">
        <div v-for="item in checkoutItems" :key="item.id" class="d-flex justify-content-between align-items-center mb-2">
          <div class="text-truncate" style="max-width: 70%;">
            <span class="me-1">{{ item.name }}</span>
            <span class="text-muted">× {{ item.quantity }}</span>
          </div>
          <div class="ms-2">${{ (item.price * item.quantity).toLocaleString() }}</div>
        </div>
        <hr class="my-3" />
        <div class="d-flex justify-content-between mb-2">
          <span>商品原價總金額</span>
          <span>${{ snapshotTotal.toLocaleString() }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2" v-if="discountAmount > 0">
          <span class="text-success">折扣金額（碼：{{ usedDiscountCode }}）</span>
          <span class="text-success">- ${{ discountAmount.toLocaleString() }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span class="fw-bold">結帳金額</span>
          <span class="text-danger fw-bold fs-5">${{ finalTotal.toLocaleString() }}</span>
        </div>
      </div>
      <div v-else class="text-muted">尚未有結帳快照，請至結帳頁點擊結帳。</div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserDataStore } from '@/store/userData'

const userDataStore = useUserDataStore()
const { name, address, phone, email, checkoutItems, usedDiscountCode } = storeToRefs(userDataStore)

// 使用本地表單狀態，提交時一次性寫回 store
const formName = ref<string>('')
const formPhone = ref<string>('')
const formEmail = ref<string>('')

// 初始化表單內容 = 目前 store 內容
watchEffect(() => {
  formName.value = name.value
  formPhone.value = phone.value
  formEmail.value = email.value
})

function onSubmit() {
  userDataStore.setBasicInfo({
    name: formName.value,
    address: address.value,
    phone: formPhone.value,
    email: formEmail.value
  })
  // 可視需要加入提示或導航
}

function onReset() {
  userDataStore.resetAll()
}

// 結帳快照金額（與 Checkout 頁一致：碼 666 打九折）
const snapshotTotal = computed(() => checkoutItems.value.reduce((t, i) => t + i.price * i.quantity, 0))
const discountAmount = computed(() => usedDiscountCode.value === '666' ? Math.round(snapshotTotal.value * 0.1) : 0)
const finalTotal = computed(() => Math.max(0, snapshotTotal.value - discountAmount.value))

// Google Map 位置（依住址顯示；未填預設「板橋火車站」）
const mapUrl = computed(() => {
  const q = (address.value?.trim() || '板橋火車站')
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
})
</script>

<style scoped>
</style>


