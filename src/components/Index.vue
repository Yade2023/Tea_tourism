<template>
  <div>
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
                :class="{ active: currentView === 'shopping' }"
                @click="currentView = 'shopping'"
                style="text-decoration: none; cursor: pointer;">
                商品頁面
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link btn btn-link border-0"
                :class="{ active: currentView === 'checkout' }"
                @click="currentView = 'checkout'"
                style="text-decoration: none; cursor: pointer;">
                購物車
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link btn btn-link border-0"
                :class="{ active: currentView === 'shopping2' }"
                @click="currentView = 'shopping2'"
                style="text-decoration: none; cursor: pointer;">
                旋轉木馬二
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 動態切換組件 - 添加頂部間距避免被導覽列遮擋 -->
    <div style="padding-top: 80px;">
      <Shopping v-if="currentView === 'shopping'" />
      <Checkout v-if="currentView === 'checkout'" />
      <Shopping2 v-if="currentView === 'shopping2'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Shopping from './Shopping.vue'
import Checkout from './Checkout.vue'
import Shopping2 from './Shopping2.vue'

// 當前顯示的視圖
const currentView = ref<'shopping' | 'checkout' | 'shopping2'>('shopping')
</script>

<style scoped>
.nav-link.active {
  color: #0066cc !important;
  font-weight: bold;
}

.nav-link {
  color: #333;
}
</style>
