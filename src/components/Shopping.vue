<template>
  <div class="container">
    <!-- 購物車區域 -->
    <div class="position-fixed end-0" style="top: 90px; margin: 20px; z-index: 1050;">
      <div class="card" style="width: 300px; max-height: 500px; overflow-y: auto;">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">購物車</h5>
        </div>
        <div class="card-body">
          <div v-if="showList.length === 0" class="text-center text-muted">
            <p>購物車是空的</p>
          </div>
          <div v-else>
            <div v-for="item in showList" :key="item.id" class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div class="flex-grow-1">
                <div class="fw-bold">{{ item.name }}</div>
                <div class="text-muted small">NT$ {{ item.price }}</div>
              </div>
              <div class="text-end">
                <div class="badge bg-secondary fs-6">數量: {{ item.quantity }}</div>
                <div class="mt-1 fw-bold text-primary">小計: NT$ {{ item.price * item.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold">總計：</span>
            <span class="fs-5 text-danger fw-bold">NT$ {{ totalPrice }}</span>
          </div>
          <button class="btn btn-success w-100" :disabled="showList.length === 0" @click="goToCheckout">
            前往結帳
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-2 position-fixed bottom-50" style="border: 1px solid rgb(255, 255, 255); height: 250px;">
        <ul id="頁首" class="list-unstyled">
          <li><a href="#產品一">產品ㄧ</a></li>
          <li><a href="#產品二">產品二</a></li>
          <li><a href="#產品三">產品三</a></li>
        </ul>
      </div>
      <div class="col-10 offset-2 mb-5">
        <!-- 產品一 -->
        <div class="row justify-content-around">
          <div class="col">
            <h2 id="產品ㄧ">產品ㄧ</h2>
          </div>
          <div class="col text-end"><a href="#頁首">頁首</a></div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider1" class="center">
            <div v-for="i in 10" :key="`p1-${i}`" class="card" style="width: 18rem;">
              <img :src="`/images/p${i}.jpg`" class="card-img-top" :alt="`圖片${i}`">
              <div class="card-body">
                <h5 class="card-title">卡片標題 {{ i }}</h5>
                <p class="card-text">這是第{{ i }}張卡片的內容描述，展示 Bootstrap 5.1 的卡片樣式。</p>
                <div class="quantity-control">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm ms-2"
                    @click="handleAddToCart(`卡片標題 ${i}`, i)">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 產品二 -->
        <div class="row justify-content-around mt-5">
          <div class="col">
            <h2 id="產品二">產品二</h2>
          </div>
          <div class="col text-end"><a href="#產品ㄧ">頁首</a></div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider2" class="center">
            <div v-for="i in 10" :key="`p2-${i}`" class="card" style="width: 18rem;">
              <img :src="`/images/p${i}.jpg`" class="card-img-top" :alt="`圖片${i}`">
              <div class="card-body">
                <h5 class="card-title">卡片標題 {{ i }}</h5>
                <p class="card-text">這是第{{ i }}張卡片的內容描述，展示 Bootstrap 5.1 的卡片樣式。</p>
                <div class="quantity-control">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm ms-2"
                    @click="handleAddToCart(`卡片標題 ${i}`, i)">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 產品三 -->
        <div class="row justify-content-around mt-5">
          <div class="col">
            <h2 id="產品三">產品三</h2>
          </div>
          <div class="col text-end"><a href="#產品ㄧ">頁首</a></div>
        </div>
        <div style="border: 1px solid rgb(255, 255, 255);">
          <div ref="slider3" class="center">
            <div v-for="i in 10" :key="`p3-${i}`" class="card" style="width: 18rem;">
              <img :src="`/images/p${i}.jpg`" class="card-img-top" :alt="`圖片${i}`">
              <div class="card-body">
                <h5 class="card-title">卡片標題 {{ i }}</h5>
                <p class="card-text">這是第{{ i }}張卡片的內容描述，展示 Bootstrap 5.1 的卡片樣式。</p>
                <div class="quantity-control">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm ms-2"
                    @click="handleAddToCart(`卡片標題 ${i}`, i)">
                    加入購物車
                  </button>
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
import { ref, onMounted, nextTick } from 'vue'
import $ from 'jquery'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'

// 使用全局購物車 store
const cartStore = useCartStore()
const { showList, totalPrice } = storeToRefs(cartStore)
const { addToCart } = cartStore

const slider1 = ref<HTMLElement | null>(null)
const slider2 = ref<HTMLElement | null>(null)
const slider3 = ref<HTMLElement | null>(null)

function handleAddToCart(title: string, id: number) {
  addToCart(id)
  alert(`已將「${title}」加入購物車！\n目前總價：${totalPrice.value}元`)
}

function goToCheckout() {
  alert(`準備前往結帳頁面\n總金額：NT$ ${totalPrice.value}`)
}

onMounted(() => {
  nextTick(() => {
    // 初始化滑桿配置
    const slickConfig = {
      dots: false,
      infinite: true,
      centerMode: true,
      autoplay: true,
      autoplaySpeed: 1500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            arrows: true,
            centerMode: true,
            focusOnSelect: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 960,
          settings: {
            arrows: true,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1
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

.slider {
  width: 50%;
  margin: 100px auto;
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
  opacity: 0.2;
}

:deep(.slick-active) {
  opacity: 0.5;
}

:deep(.slick-current) {
  opacity: 1;
}

.quantity-control {
  margin-top: 10px;
}

.card {
  margin: 10px;
}
</style>
