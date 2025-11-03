<template>
  <div style="background-color: #f5f5f5; min-height: 100vh; padding-bottom: 50px;">
    <!-- 頂部標題區域 -->
    <div class="container mt-4 mb-4">
      <div class="row align-items-center">
        <div class="col-auto">
          <div class="d-flex align-items-center">
            <span class="text-danger fw-bold fs-4">PChome</span>
            <span class="text-dark fs-4 ms-2">24h購物</span>
          </div>
        </div>
        <div class="col-auto">
          <span class="ms-3 fw-bold fs-5">購物車</span>
        </div>
      </div>
    </div>

    <!-- 步驟指示器 -->
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-auto">
          <div class="d-flex align-items-center" style="background: white; padding: 20px 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #0066cc; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
              <div style="font-size: 14px; color: #0066cc; text-align: center; font-weight: bold;">訂單明細確認</div>
            </div>
            <div style="width: 80px; height: 2px; background-color: #e0e0e0; margin: 0 20px; margin-top: -20px;"></div>
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #e0e0e0; color: #999; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
              <div style="font-size: 14px; color: #999; text-align: center;">填寫付款資料</div>
            </div>
            <div style="width: 80px; height: 2px; background-color: #e0e0e0; margin: 0 20px; margin-top: -20px;"></div>
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #e0e0e0; color: #999; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
              <div style="font-size: 14px; color: #999; text-align: center;">購買完成</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="container">
      <div class="row">
        <!-- 左側：商品列表 -->
        <div class="col-lg-8">
          <!-- PChome 快速到貨 標題 -->
          <div class="mb-3" v-if="showList.length > 0">
            <div class="d-flex align-items-center mb-3">
              <input type="checkbox" class="form-check-input me-2" style="width: 20px; height: 20px;" :checked="allSelected" @change="setAllSelected(($event.target as HTMLInputElement).checked)">
              <h5 class="mb-0">PChome 快速到貨 ({{ selectedShowList.length }})</h5>
            </div>

            <!-- 動態商品列表 -->
            <div v-for="item in showList" :key="item.id" class="card mb-3" style="border: 1px solid #e0e0e0; box-shadow: none;">
              <div class="card-body" style="padding: 16px;">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <input type="checkbox" class="form-check-input" style="width: 20px; height: 20px;" :checked="isSelected(item.id)" @change="setSelect(item.id, ($event.target as HTMLInputElement).checked)">
                  </div>
                  <div class="col-auto">
                    <img :src="item.TeaName" alt="商品圖片" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
                  </div>
                  <div class="col flex-grow-1">
                    <div class="mb-2" style="font-size: 14px;">
                      <h6 class="mb-0">{{ item.name }}</h6>
                    </div>
                    <div class="钢板-2">
                      <span class="text-danger fw-bold fs-5">${{ item.price.toLocaleString() }}</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <!-- 數量選擇器 -->
                      <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm" style="min-width: 35px; height: 35px; border-radius: 0; border-top-left-radius: 4px; border-bottom-left-radius: 4px;" @click="decreaseQuantity(item.id)">-</button>
                        <input type="number" class="form-control assort:text-center" :value="item.quantity" style="width: 60px; height: 35px; border-radius: 0; border-left: none; border-right: none;" readonly>
                        <button class="btn btn-outline-secondary btn-sm" style="min-width: 35px; height: 35px; border-radius: 0; border-top-right-radius: 4px; border-bottom-right-radius: 4px;" @click="increaseQuantity(item.id)">+</button>
                      </div>
                      <!-- 刪除按鈕 -->
                      <button class="btn btn-link text-secondary p-0" style="text-decoration: none; display: flex; align-items: center;" @click="deleteItem(item.id)">
                        <svg width="20" height="20" viewBox=" traffic 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        <span class="ms-1 small">刪除</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 購物車為空時顯示 -->
          <div v-else class="text-center text-muted py-5">
            <p class="fs-5">購物車是空的</p>
          </div>
        </div>

        <!-- 右側：結帳摘要 -->
        <div class="col-lg-4">
          <div class="card sticky-top" style="top: 20px;">
            <div class="card-header bg-white">
              <h5 class="mb-0">結帳明細</h5>
            </div>
            <div class="card-body">
              <!-- 勾選商品清單：品名 × 數量 與 小計金額 -->
              <div v-if="selectedShowList.length > 0" class="mb-3">
                <div v-for="sItem in selectedShowList" :key="sItem.id" class="d-flex justify-content-between align-items-center mb-2">
                  <div class="text-truncate" style="max-width: 70%;">
                    <span class="me-1">{{ sItem.name }}</span>
                    <span class="text-muted">× {{ sItem.quantity }}</span>
                  </div>
                  <div class="ms-2">${{ (sItem.price * sItem.quantity).toLocaleString() }}</div>
                </div>
                <hr class="my-3" />
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>商品原價總金額</span>
                <span>${{ selectedTotalPrice.toLocaleString() }}</span>
              </div>
              <!-- 折扣碼輸入與折扣顯示 -->
              <div class="mb-3">
                <label class="form-label mb-1">折扣碼</label>
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="輸入 666 享九折" v-model="discountCode" />
                </div>
                <div v-if="discountAmount > 0" class="d-flex justify-content-between mt-2 small">
                  <span class="text-success">折扣金額</span>
                  <span class="text-success">- ${{ discountAmount.toLocaleString() }}</span>
                </div>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span class="fw-bold">結帳金額</span>
                <span class="text-danger fw-bold fs-4">${{ finalTotalPrice.toLocaleString() }}</span>
              </div>
            </div>
            <div class="card-footer bg-white border-0 p-3">
              <button class="btn btn-danger w-100 btn-lg" :disabled="selectedShowList.length === 0" @click="onCheckout">結帳 ({{ selectedShowList.length }})</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'
import { useUserDataStore } from '@/store/userData'
import { useRouter } from 'vue-router'

// 使用全局購物車 store
const cartStore = useCartStore()
const { showList, selectedShowList, totalPrice, selectedTotalPrice, discountCode, discountAmount, finalTotalPrice, allSelected } = storeToRefs(cartStore)
const { addToCart, removeFromCart, setSelect, setAllSelected, isSelected } = cartStore
const userDataStore = useUserDataStore()
const router = useRouter()

// 增加數量
function increaseQuantity(productId: number) {
  addToCart(productId)
}

// 減少數量
function decreaseQuantity(productId: number) {
  removeFromCart(productId)
}

// 刪除商品（移除所有數量）
function deleteItem(productId: number) {
  const item = showList.value.find(item => item.id === productId)
  if (item) {
    for (let i = 0; i < item.quantity; i++) {
      removeFromCart(productId)
    }
  }
}

// 結帳：存快照並導向使用者資料頁
function onCheckout() {
  userDataStore.setCheckoutSnapshot(selectedShowList.value, discountCode.value)
  router.push({ name: 'userData' })
}
</script>
