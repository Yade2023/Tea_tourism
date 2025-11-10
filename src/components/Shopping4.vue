<template>
  <div class="container">
    <!-- 購物車區域 -->

    <div class="row">
      <div class="col-2 position-fixed top-50 start-0 translate-middle-y" style="border: 1px solid rgb(255, 255, 255); height: 250px;">
        <ul id="頁首" class="list-unstyled">
          <li><h3><a href="#產品一">經典茶品</a></h3></li>
          <li><h3><a href="#產品二">烏龍茶系列</a></h3></li>
          <li><h3><a href="#產品三">特色茶品</a></h3></li>
        </ul>
      </div>
      <div class="col-10 offset-2 mb-5">
        <!-- 產品一 -->
        <div class="row justify-content-around">
          <div class="col mt-5">
            <h2 id="產品ㄧ" class="text-start">烏龍茶系列</h2>
          </div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider1" class="center">
            <div v-for="product in oolongTeas" :key="product.id">
              <div class="px-2">
                <div class="card" style="width: 100%;">
                  <div @click="openProductModal(product)" style="cursor: pointer;">
                  <img :src="getImageUrl(product.TeaName)" class="card-img-top" :alt="product.name"
                    style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <div class="mb-2">
                      <h5 class="card-title mb-1">{{ product.name }}</h5>
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
        <div class="row justify-content-around mt-3">
          <div class="col">
            <h2 id="產品二" class="text-start">經典茶品</h2>
          </div>
          <!-- <div class="col text-end"><a href="#產品ㄧ">頁首</a></div> -->
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider2" class="center">
            <div v-for="product in classicTeas" :key="product.id">
              <div class="px-2">
                <div class="card" style="width: 100%;">
                  <div @click="openProductModal(product)" style="cursor: pointer;">
                  <img :src="getImageUrl(product.TeaName)" class="card-img-top" :alt="product.name"
                    style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <div class="mb-2">
                      <h5 class="card-title mb-1">{{ product.name }}</h5>
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
        <div class="row justify-content-around mt-3">
          <div class="col">
            <h2 id="產品三" class="text-start">特色茶品</h2>
          </div>
          <!-- <div class="col text-end"><a href="#產品ㄧ">頁首</a></div> -->
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider3" class="center">
            <div v-for="product in specialTeas" :key="product.id">
              <div class="px-2">
                <div class="card" style="width: 100%;">
                  <div @click="openProductModal(product)" style="cursor: pointer;">
                  <img :src="getImageUrl(product.TeaName)" class="card-img-top" :alt="product.name"
                    style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <div class="mb-2">
                      <h5 class="card-title mb-1">{{ product.name }}</h5>
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
    <!-- ============================================
         互動視窗組件（商品詳情彈窗）
         用於顯示商品詳細資訊，並提供數量調整功能
         ============================================ -->
    <InteractiveWindow
      v-model:showModal="showModal"
      :product="selectedProduct"
      :currentQuantity="currentQuantity"
      :showAddToCartButton="false"
      @increaseQuantity="increaseQuantity"
      @decreaseQuantity="decreaseQuantity"
      @setQuantity="setQuantity"
    />
    <!--
      Props 說明：
      - v-model:showModal: 雙向綁定，控制視窗的顯示/隱藏狀態
      - :product: 傳入當前選中的商品物件（包含商品名稱、價格、圖片等資訊）
      - :currentQuantity: 傳入當前商品在購物車中的數量（computed 屬性，會自動更新）
      - :showAddToCartButton: 設定為 false，不顯示「加入購物車」按鈕（因為已經有數量控制功能）

      Events 說明：
      - @increaseQuantity: 當用戶點擊增加數量按鈕時觸發，執行 increaseQuantity 函數
      - @decreaseQuantity: 當用戶點擊減少數量按鈕時觸發，執行 decreaseQuantity 函數
      - @setQuantity: 當用戶直接輸入數量時觸發，執行 setQuantity 函數
    -->

  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { useCartStore } from '../store/cart'
// import { storeToRefs } from 'pinia'
import $ from 'jquery'
import InteractiveWindow from './InteractiveWindow.vue'
import { getImageUrl } from '../utils/imageHelper'

// 使用全局購物車 store
const cartStore = useCartStore()
// const { showList, totalPrice } = storeToRefs(cartStore)
// const { addToCart } = cartStore

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
            arrows: true,          // 顯示左右箭頭按鈕
            centerMode: false,      // 啟用置中模式，讓當前卡片居中顯示
            focusOnSelect: false,   // 點擊卡片時自動聚焦並移動到該卡片
            centerPadding: '40px', // 置中模式下，左右兩側留白 40px
            slidesToShow: 3       // 一次顯示 3 個商品卡片
          }
        },
        {
          breakpoint: 960,     // 螢幕寬度 <= 960px 時套用以下設定（平板尺寸）
          settings: {
            arrows: true,          // 顯示左右箭頭按鈕
            centerMode: false,      // 啟用置中模式
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
/* ============================================
   全域樣式重置
   ============================================ */
/* 移除 html 和 body 的預設邊距和內距 */
html,
body {
  margin: 0;
  padding: 0;
}

/* 設定所有元素使用 border-box 盒模型（包含 padding 和 border 在寬度內） */
* {
  box-sizing: border-box;
}

/* ============================================
   旋轉木馬（Slick Slider）樣式
   ============================================ */
/* 旋轉木馬容器樣式 */
.slider {
  margin: 20px 0;        /* 上下外距 20px */
  padding: 0 50px;       /* 左右內距 50px */
}

/* 旋轉木馬中每個滑動項目的容器內距 */
.slider .slick-slide>div {
  padding: 0 10px;       /* 左右內距 10px */
}

/* 旋轉木馬中圖片的樣式 */
.slider .slick-slide img {
  width: 100%;           /* 寬度 100% */
  height: 200px;         /* 高度 200px */
  object-fit: cover;     /* 圖片填滿容器並保持比例 */
}

/* 使用 :deep() 穿透 scoped 樣式，修改 Slick 組件內部樣式 */
/* 旋轉木馬滑動項目的左右外距 */
:deep(.slick-slide) {
  margin: 0px 20px;      /* 左右外距 20px */
}

/* 旋轉木馬中圖片的寬度 */
:deep(.slick-slide img) {
  width: 100%;           /* 寬度 100% */
}

/* 旋轉木馬左右箭頭按鈕的顏色 */
:deep(.slick-prev:before),
:deep(.slick-next:before) {
  color: black;          /* 箭頭顏色為黑色 */
}

/* 旋轉木馬滑動項目的過渡效果和透明度 */
:deep(.slick-slide) {
  transition: all ease-in-out 0.3s;  /* 所有屬性過渡 0.3 秒 */
  opacity: 1;                        /* 所有卡片都保持高亮（不透明） */
}

/* 激活狀態的滑動項目透明度 */
:deep(.slick-active) {
  opacity: 1;            /* 激活的卡片保持高亮 */
}

/* 當前顯示的滑動項目透明度 */
:deep(.slick-current) {
  opacity: 1;            /* 當前卡片保持高亮 */
}

/* ============================================
   商品卡片樣式
   ============================================ */
/* 商品卡片容器樣式 */
.card {
  margin: 10px 0;        /* 上下外距 10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* 陰影效果 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;  /* 變換和陰影的過渡效果 */
}

/* 商品價格文字樣式 */
.card-price {
  font-weight: 600;      /* 字體粗細 600 */
  color: #667eea;        /* 價格顏色（紫色） */
  font-size: 1.1rem;     /* 字體大小 1.1rem */
}

/* 商品卡片懸停效果（向上移動並增強陰影） */
.card:hover {
  transform: translateY(-5px);  /* 向上移動 5px */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);  /* 更明顯的陰影效果 */
}

/* 商品卡片頂部圖片樣式 */
.card-img-top {
  height: 200px;         /* 高度 200px */
  object-fit: cover;     /* 圖片填滿容器並保持比例 */
  transition: transform 0.3s ease;  /* 變換的過渡效果 */
}

/* ============================================
   數量控制相關樣式
   ============================================ */
/* 數量控制容器（舊版，可能未使用） */
.quantity-control {
  margin-top: 10px;      /* 上外距 10px */
}

/* 商品卡片中的數量控制容器 */
.quantity-control-card {
  margin-top: 0.5rem;    /* 上外距 0.5rem */
}

/* 數量增減按鈕樣式 */
.quantity-btn {
  min-width: 32px;       /* 最小寬度 32px */
  height: 32px;          /* 高度 32px */
  padding: 0;            /* 無內距 */
  border-radius: 4px;    /* 圓角 4px */
  font-size: 1rem;       /* 字體大小 1rem */
  font-weight: bold;     /* 字體粗細 bold */
  transition: all 0.2s ease;  /* 所有屬性的過渡效果 0.2 秒 */
  display: flex;         /* 使用 flexbox 布局 */
  align-items: center;   /* 垂直置中 */
  justify-content: center;  /* 水平置中 */
}

/* 數量按鈕懸停效果（未禁用時） */
.quantity-btn:hover:not(:disabled) {
  background-color: #667eea;  /* 背景色變為紫色 */
  border-color: #667eea;      /* 邊框顏色變為紫色 */
  color: white;               /* 文字顏色變為白色 */
  transform: scale(1.1);       /* 放大 1.1 倍 */
}

/* 數量按鈕禁用狀態 */
.quantity-btn:disabled {
  opacity: 0.4;          /* 透明度 0.4（變淡） */
  cursor: not-allowed;   /* 滑鼠游標顯示為禁止 */
}

/* 數量顯示區域樣式（可能未使用） */
.quantity-display-card {
  min-width: 40px;       /* 最小寬度 40px */
  text-align: center;    /* 文字置中 */
  font-size: 1rem;       /* 字體大小 1rem */
  font-weight: 600;      /* 字體粗細 600 */
  color: #495057;        /* 文字顏色（深灰色） */
  padding: 0.25rem 0.5rem;  /* 內距 */
  background-color: #f8f9fa;  /* 背景色（淺灰色） */
  border-radius: 4px;    /* 圓角 4px */
}

/* 數量輸入框樣式 */
.quantity-input-card {
  min-width: 60px;       /* 最小寬度 60px */
  max-width: 70px;       /* 最大寬度 70px */
  text-align: center;    /* 文字置中 */
  font-size: 1rem;       /* 字體大小 1rem */
  font-weight: 600;      /* 字體粗細 600 */
  color: #495057;        /* 文字顏色（深灰色） */
  padding: 0.25rem 0.5rem;  /* 內距 */
  background-color: #ffffff;  /* 背景色白色 */
  border: 1px solid #ced4da;  /* 邊框 1px 實線（淺灰色） */
  border-radius: 4px;    /* 圓角 4px */
  transition: all 0.2s ease;  /* 所有屬性的過渡效果 0.2 秒 */
}

/* 數量輸入框獲得焦點時的樣式 */
.quantity-input-card:focus {
  outline: none;         /* 移除預設外框 */
  border-color: #667eea;  /* 邊框顏色變為紫色 */
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);  /* 紫色外發光效果 */
}

/* 數量輸入框的上下箭頭按鈕樣式（WebKit 瀏覽器） */
.quantity-input-card::-webkit-inner-spin-button,
.quantity-input-card::-webkit-outer-spin-button {
  opacity: 1;           /* 顯示上下箭頭按鈕 */
  height: 30px;         /* 箭頭按鈕高度 30px */
}

/* ============================================
   左側導航列樣式
   ============================================ */
/* 無序列表項目間距 */
.list-unstyled li {
  margin: 10px 0;        /* 上下外距 10px */
}

/* 導航連結基礎樣式 */
.list-unstyled a {
  color: #007bff;        /* 連結顏色（藍色） */
  text-decoration: none; /* 移除底線 */
  padding: 8px 12px;     /* 內距 8px 上下，12px 左右 */
  border-radius: 4px;    /* 圓角 4px */
  transition: background-color 0.3s ease;  /* 背景色過渡效果 0.3 秒 */
}

/* 導航連結懸停效果 */
.list-unstyled a:hover {
  background-color: #f8f9fa;  /* 懸停時背景色變為淺灰色 */
  color: #0056b3;             /* 懸停時文字顏色變為深藍色 */
}


</style>
