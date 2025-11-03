<template>
  <div class="container">
    <div class="row">
      <div class="col-2 position-fixed bottom-70" style="border: 1px solid rgb(255, 255, 255); height: 250px;">
        <ul id="頁首" class="list-unstyled">
          <li><a href="#產品一">經典茶品</a></li>
          <li><a href="#產品二">烏龍茶系列</a></li>
          <li><a href="#產品三">特色茶品</a></li>
        </ul>
      </div>
      <div class="col-10 offset-2 mb-5">
        <!-- 經典茶品區塊 -->
        <div class="row justify-content-around">
          <div class="col">
            <h2 id="產品一">經典茶品</h2>
          </div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div class="slider classic-teas-slider" ref="classicTeasSliderRef">
            <div v-for="product in classicTeas" :key="product.id">
              <div class="px-2">
                <div class="card" style="width: 100%;">
                  <div @click="openProductModal(product)" style="cursor: pointer;">
                  <img :src="product.TeaName" class="card-img-top" :alt="product.name"
                    style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h5 class="card-title mb-0">{{ product.name }}</h5>
                      <span class="card-price">NT$ {{ product.price }}</span>
                    </div>
                    <!-- 數量增減控制 -->
                    <div class="quantity-control-card mb-2">
                      <div class="d-flex align-items-center justify-content-center">
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="decreaseCartQuantity(product.id)"
                          :disabled="cartStore.getProductQuantity(product.id) <= 0">
                          -
                        </button>
                        <span class="mx-2 quantity-display-card">{{ cartStore.getProductQuantity(product.id) }}</span>
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="increaseCartQuantity(product.id)">
                          +
                        </button>
                      </div>
                    </div>
                    <div class="quantity-control">
                      <button type="button" class="btn btn-primary btn-sm w-100"
                        @click.stop="addToCart(product.id)">加入購物車</button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 烏龍茶系列區塊 -->
        <div class="row justify-content-around">
          <div class="col">
            <h2 id="產品二">烏龍茶系列</h2>
          </div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div class="slider oolong-teas-slider" ref="oolongTeasSliderRef">
            <div v-for="product in oolongTeas" :key="product.id">
              <div class="px-2">
                <div class="card" style="width: 100%;">
                  <div @click="openProductModal(product)" style="cursor: pointer;">
                  <img :src="product.TeaName" class="card-img-top" :alt="product.name"
                    style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h5 class="card-title mb-0">{{ product.name }}</h5>
                      <span class="card-price">NT$ {{ product.price }}</span>
                    </div>
                    <!-- 數量增減控制 -->
                    <div class="quantity-control-card mb-2">
                      <div class="d-flex align-items-center justify-content-center">
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="decreaseCartQuantity(product.id)"
                          :disabled="cartStore.getProductQuantity(product.id) <= 0">
                          -
                        </button>
                        <span class="mx-2 quantity-display-card">{{ cartStore.getProductQuantity(product.id) }}</span>
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="increaseCartQuantity(product.id)">
                          +
                        </button>
                      </div>
                    </div>
                    <div class="quantity-control">
                      <button type="button" class="btn btn-primary btn-sm w-100"
                        @click.stop="addToCart(product.id)">加入購物車</button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 特色茶品區塊 -->
        <div class="row justify-content-around">
          <div class="col">
            <h2 id="產品三">特色茶品</h2>
          </div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div class="slider special-teas-slider" ref="specialTeasSliderRef">
            <div v-for="product in specialTeas" :key="product.id">
              <div class="px-2">
                <div class="card" style="width: 100%;">
                  <div @click="openProductModal(product)" style="cursor: pointer;">
                  <img :src="product.TeaName" class="card-img-top" :alt="product.name"
                    style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h5 class="card-title mb-0">{{ product.name }}</h5>
                      <span class="card-price">NT$ {{ product.price }}</span>
                    </div>
                    <!-- 數量增減控制 -->
                    <div class="quantity-control-card mb-2">
                      <div class="d-flex align-items-center justify-content-center">
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="decreaseCartQuantity(product.id)"
                          :disabled="cartStore.getProductQuantity(product.id) <= 0">
                          -
                        </button>
                        <span class="mx-2 quantity-display-card">{{ cartStore.getProductQuantity(product.id) }}</span>
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="increaseCartQuantity(product.id)">
                          +
                        </button>
                      </div>
                    </div>
                    <div class="quantity-control">
                      <button type="button" class="btn btn-primary btn-sm w-100"
                        @click.stop="addToCart(product.id)">加入購物車</button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-backdrop" @click="onBackdropClick">
        <div class="modal-dialog modal-lg modal-dialog-centered" @click.stop>
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedProduct">
              <!-- 上部分：savorImage 照片 -->
              <div class="row mb-3">
                <div class="col-12 text-center">
                  <img :src="selectedProduct.savorImage" class="img-fluid rounded savor-image-modal" :alt="selectedProduct.name + ' savor'">
                </div>
              </div>
              <!-- 下部分：TeaName 和商品資訊 -->
              <div class="row">
                <div class="col-md-6 mb-3 mb-md-0">
                  <img :src="selectedProduct.TeaName" class="img-fluid rounded tea-name-image-modal" :alt="selectedProduct.name">
                </div>
                <div class="col-md-6">
                  <h5>{{ selectedProduct.name }}</h5>
                  <p class="text-muted">價格：NT$ {{ selectedProduct.price }}</p>
                  <p class="text-muted">分類：{{ selectedProduct.category }}</p>
                  <!-- 數量增減控制 -->
                  <div class="quantity-control-modal mb-3">
                    <label class="form-label mb-2">數量：</label>
                    <div class="d-flex align-items-center">
                      <button type="button" class="btn btn-outline-secondary btn-sm"
                        @click="decreaseQuantity" :disabled="currentQuantity <= 0">
                        -
                      </button>
                      <span class="mx-3 quantity-display">{{ currentQuantity }}</span>
                      <button type="button" class="btn btn-outline-secondary btn-sm"
                        @click="increaseQuantity">
                        +
                      </button>
                    </div>
                  </div>
                  <button type="button" class="btn btn-primary btn-lg w-100"
                    @click="addToCartModal">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { useCartStore } from '@/store/cart'
import $ from 'jquery'

// 引入 slick-carousel 的 CSS
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel'

// 使用購物車 store
const cartStore = useCartStore()

// 滑動容器引用
const classicTeasSliderRef = ref<HTMLElement | null>(null)
const oolongTeasSliderRef = ref<HTMLElement | null>(null)
const specialTeasSliderRef = ref<HTMLElement | null>(null)

// 選中的商品
const selectedProduct = ref<any>(null)
const showModal = ref(false)

// 打開modal
const openProductModal = (product: any) => {
  selectedProduct.value = product
  showModal.value = true
  // 防止背景滾動
  document.body.style.overflow = 'hidden'
}

// 關閉modal
const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = 'auto'
}

// 點擊背景關閉
const onBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
    closeModal()
  }
}

// 根據分類篩選商品
const classicTeas = computed(() =>
  cartStore.products.filter(product => product.category === '經典茶品')
)

const oolongTeas = computed(() =>
  cartStore.products.filter(product => product.category === '烏龍茶系列')
)

const specialTeas = computed(() =>
  cartStore.products.filter(product => product.category === '特色茶品')
)

// 加入購物車功能
const addToCart = (productId: number) => {
  cartStore.addToCart(productId)
  console.log(`已將商品 ID ${productId} 加入購物車`)
}

// 旋轉木馬卡片：增加購物車數量
const increaseCartQuantity = (productId: number) => {
  cartStore.addToCart(productId)
}

// 旋轉木馬卡片：減少購物車數量
const decreaseCartQuantity = (productId: number) => {
  cartStore.removeFromCart(productId)
}

// 獲取當前選中商品的數量
const currentQuantity = computed(() => {
  if (!selectedProduct.value) return 0
  return cartStore.getProductQuantity(selectedProduct.value.id)
})

// 增加數量
const increaseQuantity = () => {
  if (selectedProduct.value) {
    cartStore.addToCart(selectedProduct.value.id)
  }
}

// 減少數量
const decreaseQuantity = () => {
  if (selectedProduct.value && currentQuantity.value > 0) {
    cartStore.removeFromCart(selectedProduct.value.id)
  }
}

// Modal 中加入購物車
const addToCartModal = () => {
  if (selectedProduct.value) {
    // 如果當前數量為0，則加入1個；否則數量已經通過 +/- 按鈕調整好了
    if (currentQuantity.value === 0) {
      cartStore.addToCart(selectedProduct.value.id)
    }
    console.log(`商品 ID ${selectedProduct.value.id} 在購物車中的數量：${cartStore.getProductQuantity(selectedProduct.value.id)}`)
    closeModal()
  }
}

// slick carousel 配置
const slickOptions = {
  slidesToShow: 3,
  slidesToScroll: 1,
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 1000,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

// 初始化 slick carousel
const initCarousels = () => {
  nextTick(() => {
    if ($ && typeof ($ as any).fn.slick !== 'undefined') {
      if (classicTeasSliderRef.value) {
        $(classicTeasSliderRef.value).slick(slickOptions)
      }
      if (oolongTeasSliderRef.value) {
        $(oolongTeasSliderRef.value).slick(slickOptions)
      }
      if (specialTeasSliderRef.value) {
        $(specialTeasSliderRef.value).slick(slickOptions)
      }
    }
  })
}

// 清理 slick carousel
const destroyCarousels = () => {
  if ($) {
    if (classicTeasSliderRef.value && $(classicTeasSliderRef.value).hasClass('slick-initialized')) {
      $(classicTeasSliderRef.value).slick('unslick')
    }
    if (oolongTeasSliderRef.value && $(oolongTeasSliderRef.value).hasClass('slick-initialized')) {
      $(oolongTeasSliderRef.value).slick('unslick')
    }
    if (specialTeasSliderRef.value && $(specialTeasSliderRef.value).hasClass('slick-initialized')) {
      $(specialTeasSliderRef.value).slick('unslick')
    }
  }
}

// 處理 ESC 鍵關閉 modal
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

// 組件載入後初始化輪播
onMounted(() => {
  console.log('Shopping2 組件已載入')
  console.log('商品總數:', cartStore.products.length)
  console.log('經典茶品:', classicTeas.value.length)
  console.log('烏龍茶系列:', oolongTeas.value.length)
  console.log('特色茶品:', specialTeas.value.length)
  initCarousels()
  // 監聽 ESC 鍵
  document.addEventListener('keydown', handleEscape)
})

// 組件卸載前清理輪播
onBeforeUnmount(() => {
  destroyCarousels()
  // 移除鍵盤事件監聽器
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

/* Slick Carousel 輪播樣式 */
.slider {
  margin: 20px 0;
  padding: 0 50px;
}

.slider .slick-slide>div {
  padding: 0 10px;
}

.slider .slick-slide img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 卡片樣式優化 */
.card {
  margin: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 卡片價格樣式 */
.card-price {
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
}

/* 卡片數量控制區域樣式 */
.quantity-control-card {
  margin-top: 0.5rem;
}

.quantity-btn {
  min-width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.1);
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-display-card {
  min-width: 40px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  padding: 0.25rem 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

/* Slick Carousel 按鈕樣式 */
/* .slick-prev:before,
.slick-next:before {
  color: #007bff;
  font-size: 20px;
} */

/* .slick-prev,
.slick-next {
  z-index: 1;
}

.slick-prev {
  left: -25px;
}

.slick-next {
  right: -25px;
} */

/* 點點樣式 */
/* .slick-dots li button:before {
  color: #007bff;
  font-size: 12px;
} */

.slick-dots li.slick-active button:before {
  color: #007bff;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .slick-prev {
    left: -15px;
  }

  .slick-next {
    right: -15px;
  }

  .card {
    margin: 5px 0;
  }
}

/* 導航連結樣式 */
.list-unstyled li {
  margin: 10px 0;
}

.list-unstyled a {
  color: #007bff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.list-unstyled a:hover {
  background-color: #f8f9fa;
  color: #0056b3;
}

/* Modal 動畫效果 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog {
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 650px;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  background-clip: padding-box;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
}

.modal-header .btn-close {
  filter: invert(1);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.modal-header .btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1rem 1.25rem;
}

.modal-body img {
  transition: transform 0.3s ease;
  border-radius: 8px;
}

.modal-body img:hover {
  transform: scale(1.05);
}

/* TeaName 圖片樣式 - 限制大小以平衡顯示 */
.tea-name-image-modal {
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* SavorImage 圖片樣式 - 上部分大圖顯示 */
.savor-image-modal {
  max-width: 100%;
  max-height: 280px;
  width: auto;
  height: auto;
  object-fit: contain;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.savor-image-modal:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* 數量控制區域樣式 */
.quantity-control-modal {
  margin-top: 1rem;
}

.quantity-control-modal .form-label {
  font-weight: 500;
  color: #495057;
}

.quantity-control-modal button {
  min-width: 40px;
  height: 40px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s ease;
}

.quantity-control-modal button:hover:not(:disabled) {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.05);
}

.quantity-control-modal button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 50px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.modal-body .btn-primary {
  margin-top: 0;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-body .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.4);
}

/* Vue Transition 效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-dialog {
  transform: translate(0, -50px) scale(0.9);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-dialog {
  transform: translate(0, -50px) scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-to .modal-dialog,
.modal-leave-from .modal-dialog {
  transform: translate(0, 0) scale(1);
}
</style>
