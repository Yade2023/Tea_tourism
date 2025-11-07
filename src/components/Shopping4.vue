<template>
  <div class="container">
    <!-- 購物車區域 -->

    <div class="row">
      <div class="col-2 position-fixed bottom-70" style="border: 1px solid rgb(255, 255, 255); height: 250px;">
        <ul id="頁首" class="list-unstyled">
          <li><a href="#產品一">經典茶品</a></li>
          <li><a href="#產品二">烏龍茶系列</a></li>
          <li><a href="#產品三">特色茶品</a></li>
        </ul>
      </div>
      <div class="col-10 offset-2 mb-5">
        <!-- 產品一 -->
        <div class="row justify-content-around">
          <div class="col">
            <h2 id="產品ㄧ">產品ㄧ - 烏龍茶系列</h2>
          </div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider1" class="center">
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
                        <input type="number" class="mx-2 quantity-input-card"
                          :value="cartStore.getProductQuantity(product.id)"
                          @click.stop
                          @input="handleQuantityInput($event, product.id)"
                          @blur="handleQuantityBlur($event, product.id)"
                          min="0"
                          step="1">
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="increaseCartQuantity(product.id)">
                          +
                        </button>
                      </div>
                    </div>
                    <!-- <div class="quantity-control">
                      <button type="button" class="btn btn-primary btn-sm w-100"
                        @click.stop="addToCart(product.id)">加入購物車</button>
                    </div> -->
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 產品二 -->
        <div class="row justify-content-around mt-5">
          <div class="col">
            <h2 id="產品二">產品二 - 經典茶品</h2>
          </div>
          <!-- <div class="col text-end"><a href="#產品ㄧ">頁首</a></div> -->
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider2" class="center">
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
                        <input type="number" class="mx-2 quantity-input-card"
                          :value="cartStore.getProductQuantity(product.id)"
                          @click.stop
                          @input="handleQuantityInput($event, product.id)"
                          @blur="handleQuantityBlur($event, product.id)"
                          min="0"
                          step="1">
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="increaseCartQuantity(product.id)">
                          +
                        </button>
                      </div>
                    </div>
                    <!-- <div class="quantity-control">
                      <button type="button" class="btn btn-primary btn-sm w-100"
                        @click.stop="addToCart(product.id)">加入購物車</button>
                    </div> -->
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 產品三 -->
        <div class="row justify-content-around mt-5">
          <div class="col">
            <h2 id="產品三">產品三 - 特色茶品</h2>
          </div>
          <!-- <div class="col text-end"><a href="#產品ㄧ">頁首</a></div> -->
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider3" class="center">
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
                        <input type="number" class="mx-2 quantity-input-card"
                          :value="cartStore.getProductQuantity(product.id)"
                          @click.stop
                          @input="handleQuantityInput($event, product.id)"
                          @blur="handleQuantityBlur($event, product.id)"
                          min="0"
                          step="1">
                        <button type="button" class="btn btn-outline-secondary btn-sm quantity-btn"
                          @click.stop="increaseCartQuantity(product.id)">
                          +
                        </button>
                      </div>
                    </div>
                    <!-- <div class="quantity-control">
                      <button type="button" class="btn btn-primary btn-sm w-100"
                        @click.stop="addToCart(product.id)">加入購物車</button>
                    </div> -->
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 互動視窗組件 -->
    <InteractiveWindow
      v-model:showModal="showModal"
      :product="selectedProduct"
      :currentQuantity="currentQuantity"
      :showAddToCartButton="false"
      @increaseQuantity="increaseQuantity"
      @decreaseQuantity="decreaseQuantity"
      @setQuantity="setQuantity"
    />

  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'
import $ from 'jquery'
import InteractiveWindow from './InteractiveWindow.vue'

// 使用全局購物車 store
const cartStore = useCartStore()
const { showList, totalPrice } = storeToRefs(cartStore)
const { addToCart } = cartStore

const slider1 = ref<HTMLElement | null>(null)
const slider2 = ref<HTMLElement | null>(null)
const slider3 = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    // 初始化滑桿配置
    const slickConfig = {
      dots: true,              // 顯示下方指示點，方便用戶查看當前頁數
      infinite: false,         // 不啟用無限循環，到最後一張後不會自動跳回第一張
      centerMode: false,       // 不啟用置中模式，讓商品卡片從左側對齊排列
      autoplay: true,          // 啟用自動播放功能
      autoplaySpeed: 1500,     // 自動播放速度（毫秒），每 1.5 秒切換一次
      slidesToShow: 3,         // 預設一次顯示 3 個商品卡片
      slidesToScroll: 1,       // 每次滾動 1 個商品卡片

      // 響應式斷點設定（根據不同螢幕寬度調整顯示方式）
      responsive: [
        {
          breakpoint: 1200,    // 螢幕寬度 <= 1200px 時套用以下設定
          settings: {
            arrows: false,          // 顯示左右箭頭按鈕
            centerMode: false,      // 啟用置中模式，讓當前卡片居中顯示
            focusOnSelect: false,   // 點擊卡片時自動聚焦並移動到該卡片
            centerPadding: '40px', // 置中模式下，左右兩側留白 40px
            slidesToShow: 3        // 一次顯示 3 個商品卡片
          }
        },
        {
          breakpoint: 960,     // 螢幕寬度 <= 960px 時套用以下設定（平板尺寸）
          settings: {
            arrows: false,          // 顯示左右箭頭按鈕
            centerMode: true,      // 啟用置中模式
            centerPadding: '20px', // 置中模式下，左右兩側留白 20px
            slidesToShow: 2        // 一次顯示 2 個商品卡片
          }
        },
        {
          breakpoint: 768,     // 螢幕寬度 <= 768px 時套用以下設定（手機尺寸）
          settings: {
            arrows: false,         // 隱藏左右箭頭按鈕（手機上可直接滑動）
            centerMode: true,      // 啟用置中模式
            centerPadding: '20px', // 置中模式下，左右兩側留白 20px
            slidesToShow: 1        // 一次只顯示 1 個商品卡片
          }
        }
      ]
    }

    // 初始化三個滑桿
    if (slider1.value) {
      $(slider1.value).slick(slickConfig)
    }
    if (slider2.value) {
      $(slider2.value).slick(slickConfig)
    }
    if (slider3.value) {
      $(slider3.value).slick(slickConfig)
    }
  })
})
// 選中的商品
const selectedProduct = ref<any>(null)
const showModal = ref(false)

// 打開modal
const openProductModal = (product: any) => {
  selectedProduct.value = product
  showModal.value = true
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
//const addToCart = (productId: number) => {
//  cartStore.addToCart(productId)
//  console.log(`已將商品 ID ${productId} 加入購物車`)
//}

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

// 設定數量（用於 InteractiveWindow 的輸入框）
const setQuantity = (quantity: number) => {
  if (selectedProduct.value) {
    cartStore.setProductQuantity(selectedProduct.value.id, quantity)
  }
}

// 處理數量輸入（即時連動）
const handleQuantityInput = (event: Event, productId: number) => {
  const target = event.target as HTMLInputElement
  const inputValue = target.value

  // 允許空字串（正在刪除時）
  if (inputValue === '') {
    cartStore.setProductQuantity(productId, 0)
    return
  }

  // 解析輸入值
  const value = parseInt(inputValue)

  // 如果輸入無效，不做任何處理（讓用戶繼續輸入）
  if (isNaN(value)) {
    return
  }

  // 確保數量為非負整數
  if (value < 0) {
    target.value = '0'
    cartStore.setProductQuantity(productId, 0)
    return
  }

  // 即時更新購物車數量
  cartStore.setProductQuantity(productId, value)
}

// 處理失去焦點事件（確保顯示正確的數量）
const handleQuantityBlur = (event: Event, productId: number) => {
  const target = event.target as HTMLInputElement
  const currentQty = cartStore.getProductQuantity(productId)

  // 如果輸入為空或無效，重置為當前數量
  if (target.value === '' || isNaN(parseInt(target.value))) {
    target.value = currentQty.toString()
  } else {
    // 確保顯示與實際數量一致
    target.value = currentQty.toString()
  }
}
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

/* .slider {
  width: 50%;
  margin: 100px auto;
} */
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


:deep(.slick-slide) {
  margin: 0px 20px;
}

:deep(.slick-slide img) {
  width: 100%;
}

:deep(.slick-prev:before),
:deep(.slick-next:before) {
  color: black;
}

:deep(.slick-slide) {
  transition: all ease-in-out 0.3s;
  opacity: 1;  /* 所有卡片都保持高亮 */
}

:deep(.slick-active) {
  opacity: 1;  /* 激活的卡片保持高亮 */
}

:deep(.slick-current) {
  opacity: 1;  /* 當前卡片保持高亮 */
}

.quantity-control {
  margin-top: 10px;
}

/* .card {
  margin: 10px;
} */
.card {
  margin: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-price {
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
}
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
.quantity-input-card {
  min-width: 60px;
  max-width: 70px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  padding: 0.25rem 0.5rem;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: all 0.2s ease;
}
.quantity-input-card:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
.quantity-input-card::-webkit-inner-spin-button,
.quantity-input-card::-webkit-outer-spin-button {
  opacity: 1;
  height: 30px;
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

/* .card:hover .card-img-top {
  transform: scale(1.05);
} */
.list-unstyled li {
  margin: 10px 0;          /* 列表項目間距 */
}

/* 導航連結基礎樣式 */
.list-unstyled a {
  color: #007bff;                          /* 藍色文字 */
  text-decoration: none;                   /* 移除底線 */
  padding: 8px 12px;                       /* 內距 */
  border-radius: 4px;                      /* 圓角 */
  transition: background-color 0.3s ease;  /* 背景色過渡效果 */
}

/* 導航連結懸停效果 */
.list-unstyled a:hover {
  background-color: #f8f9fa;  /* 淺灰背景 */
  color: #0056b3;             /* 深藍文字 */
}


</style>
