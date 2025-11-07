<!--訂單完成頁面-->
<template>
  <div style="background-color: #f5f5f5; min-height: 100vh; padding-bottom: 50px;">
    <!-- 導覽列 - 固定置頂 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top" style="z-index: 1060; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div class="container">
        <a class="navbar-brand fw-bold fs-4" href="#">
          <span class="text-danger">PChome</span>
          <span class="text-dark ms-2">24h購物</span>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button
                class="nav-link btn btn-link border-0"
                @click="goToShopping"
                style="text-decoration: none; cursor: pointer;">
                商品頁面
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link btn btn-link border-0"
                @click="goToCheckout"
                style="text-decoration: none; cursor: pointer;">
                購物車
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link btn btn-link border-0"
                @click="goToShopping4"
                style="text-decoration: none; cursor: pointer;">
                旋轉木馬二
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 添加頂部間距避免被導覽列遮擋 -->
    <div style="padding-top: 80px;"></div>

    <!-- 步驟指示器 -->
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-auto">
          <div class="d-flex align-items-center" style="background: white; padding: 20px 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <!-- 步驟1：已完成 -->
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #28a745; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div style="font-size: 14px; color: #28a745; text-align: center; font-weight: bold;">訂單明細確認</div>
            </div>
            <div style="width: 80px; height: 2px; background-color: #28a745; margin: 0 20px; margin-top: -20px;"></div>
            <!-- 步驟2：已完成 -->
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #28a745; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div style="font-size: 14px; color: #28a745; text-align: center; font-weight: bold;">填寫付款資料</div>
            </div>
            <div style="width: 80px; height: 2px; background-color: #28a745; margin: 0 20px; margin-top: -20px;"></div>
            <!-- 步驟3：當前完成 -->
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #28a745; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div style="font-size: 14px; color: #28a745; text-align: center; font-weight: bold;">購買完成</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- 成功訊息卡片 -->
          <div class="card text-center p-5 shadow-sm">
            <div class="mb-4">
              <div class="success-icon mx-auto mb-3">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="8 12 11 15 16 9"></polyline>
                </svg>
              </div>
              <h2 class="text-success mb-3">訂單已成功送出！</h2>
              <p class="text-muted fs-5">感謝您的購買，我們將盡快為您處理訂單</p>
            </div>

            <div class="alert alert-info mx-auto" style="max-width: 500px;">
              <i class="bi bi-info-circle me-2"></i>
              <strong>訂單編號：</strong>{{ orderNumber }}
            </div>

            <div class="mt-4">
              <p class="text-muted mb-3">訂單確認信已發送至您的信箱</p>
              <p class="text-muted">{{ userEmail }}</p>
            </div>

            <hr class="my-4">

            <div class="d-flex justify-content-center gap-3">
              <button class="btn btn-primary btn-lg px-4" @click="goToShopping">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2" style="vertical-align: middle;">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                繼續購物
              </button>
              <button class="btn btn-outline-secondary btn-lg px-4" @click="viewOrderDetails">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2" style="vertical-align: middle;">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                查看訂單詳情
              </button>
            </div>
          </div>

          <!-- 訂單摘要卡片 -->
          <div class="card mt-4 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">訂單摘要</h5>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <h6 class="text-muted mb-2">收件人資訊</h6>
                  <p class="mb-1"><strong>姓名：</strong>{{ userName }}</p>
                  <p class="mb-1"><strong>電話：</strong>{{ userPhone }}</p>
                  <p class="mb-1"><strong>Email：</strong>{{ userEmail }}</p>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted mb-2">配送資訊</h6>
                  <p class="mb-1"><strong>配送方式：</strong>{{ deliveryMethod }}</p>
                  <p class="mb-1"><strong>收件地址：</strong>{{ deliveryAddress }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-muted mb-2">付款資訊</h6>
                  <p class="mb-1"><strong>付款方式：</strong>{{ paymentMethod }}</p>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted mb-2">訂單金額</h6>
                  <p class="mb-1 text-danger fs-4"><strong>${{ totalAmount.toLocaleString() }}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '@/store/userData'
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userDataStore = useUserDataStore()
const cartStore = useCartStore()
const { name, phone, email, paymentMethod, deliveryMethod, address, convenienceStore, storeCity, storeDistrict, storeBranch, checkoutItems, usedDiscountCode } = storeToRefs(userDataStore)

// 生成訂單編號
const orderNumber = ref<string>('')

onMounted(() => {
  // 生成訂單編號（時間戳 + 隨機數）
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  orderNumber.value = `ORD${timestamp}${random}`

  // 清除購物車中已購買的商品
  if (checkoutItems.value.length > 0) {
    cartStore.removeCheckedOutItems(checkoutItems.value)
  }
})

// 用戶資訊
const userName = computed(() => name.value || '未提供')
const userPhone = computed(() => phone.value || '未提供')
const userEmail = computed(() => email.value || '未提供')

// 配送地址顯示
const deliveryAddress = computed(() => {
  if (deliveryMethod.value === '宅配') {
    return address.value || '未填寫'
  } else if (deliveryMethod.value === '店到店') {
    if (storeBranch.value) {
      return `${convenienceStore.value} ${storeBranch.value} - ${storeCity.value}${storeDistrict.value}`
    } else if (storeCity.value && storeDistrict.value) {
      return `${convenienceStore.value} ${storeCity.value}${storeDistrict.value}`
    } else {
      return '未完整填寫'
    }
  }
  return '未填寫'
})

// 計算總金額
const snapshotTotal = computed(() => checkoutItems.value.reduce((t, i) => t + i.price * i.quantity, 0))
const discountAmount = computed(() => usedDiscountCode.value === '666' ? Math.round(snapshotTotal.value * 0.1) : 0)
const totalAmount = computed(() => Math.max(0, snapshotTotal.value - discountAmount.value))

// 導航函數
function goToShopping() {
  router.push({ name: 'home' })
}

function goToCheckout() {
  router.push({ name: 'checkout' })
}

function goToShopping4() {
  router.push({ name: 'home' })
}

function viewOrderDetails() {
  // 這裡可以添加查看訂單詳情的邏輯
  alert('查看訂單詳情功能待實現')
}
</script>

<style scoped>
.nav-link {
  color: #333;
}

.nav-link:hover {
  color: #0066cc;
}

.success-icon {
  width: 80px;
  height: 80px;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

