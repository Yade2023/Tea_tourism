<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../assets/css/HomeTea_tourism.css'
import { ref, onMounted, computed } from 'vue'
import localJsonUrl from '../assets/json/HomeTea_tourism.json'
// 合併工具：用 API 值覆蓋預設，但不覆蓋成 null / "" / undefined
import { mergeDefault } from '../assets/js/mergeDefault.js'

const homeData = ref(null)

// 隨機排序函數
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 隨機取3個知識卡片的計算屬性
const randomKnowledgeCards = computed(() => {
  if (!homeData.value?.knowledgeCards) return []
  return shuffleArray(homeData.value.knowledgeCards).slice(0, 3)
})

onMounted(async () => {
  // 1. 先一定抓到本地預設資料
  homeData.value = localJsonUrl

  try {
    // 2. 嘗試抓 API
    const res = await fetch('http://localhost:5000/api/home')
    if (!res.ok) throw new Error('API 回傳狀態不是 200')

    const apiData = await res.json()

    // 3. 把 API 跟預設合併，API 只會覆蓋有內容的欄位
    homeData.value = mergeDefault(defaultData, apiData)

    console.log('✅ 使用 API + fallback 合併資料')
  } catch (err) {
    // 4. API 壞掉 → 純預設
    console.warn('⚠️ API 失敗，使用純預設 JSON：', err)
  }
})
</script>


<template>
  <!-- 如果 homeData 已經有資料了才畫畫面 -->
  <div v-if="homeData" class="home-page">
    <!-- ＝＝＝＝ 輪播區 carousel ＝＝＝＝ -->
    <div id="carouselExampleCaptions" class="carousel slide" data-bs-next="600" data-bs-ride="carousel"
      data-bs-interval="2000" data-bs-touch="true" data-bs-wrap="true">
      <div class="carousel-indicators">
        <button v-for="(c, idx) in homeData.carousel" :key="'ind-' + idx" type="button"
          data-bs-target="#carouselExampleCaptions" :data-bs-slide-to="idx" :class="{ active: idx === 0 }"
          :aria-current="idx === 0 ? 'true' : undefined" :aria-label="`Slide ${idx + 1}`"></button>
      </div>

      <div class="carousel-inner">
        <div v-for="(c, idx) in homeData.carousel" :key="'car-' + idx" class="carousel-item"
          :class="{ active: idx === 0 }">
          <img :src="c.img" class="d-block w-100" alt="carousel slide" />
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="carBoby">
      <!-- ＝＝＝＝ 第一段：茶與旅 (左右圖文區) ＝＝＝＝ -->
      <div class="card mb-3">
        <h2 style="text-align: center;">{{ homeData.introBlock.title }}</h2>
        <div class="row g-0">
          <div class="col-md-5">
            <img :src="homeData.introBlock.leftImage" class="img-fluid" alt="intro image" />
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">{{ homeData.introBlock.title }}</h5>
              <p class="card-text" style="white-space: pre-line;">
                {{ homeData.introBlock.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ＝＝＝＝ 第二段：大溪茶廠 故事區塊 ＝＝＝＝ -->

      <div class="card mb-3">
        <h2 style="text-align: center;">本月精選旅遊區</h2>
        <img :src="homeData.featureSpot.mainImage" class="card-img-top" alt="feature main" />
        <div class="card-img-overlay">
          <h5 class="card-title">{{ homeData.featureSpot.title }}</h5>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ homeData.featureSpot.desc }}
          </p>
          <p class="card-text">
            <small class="text-muted" style="white-space: pre-line;">
              {{ homeData.featureSpot.info }}
              網址: <a href="https://travel.tycg.gov.tw">https://travel.tycg.gov.tw</a>
            </small>
          </p>
        </div>
      </div>

      <!-- ＝＝＝＝ 第三段：三張知識卡片 ＝＝＝＝ -->
      <div class="text-center mb-3">
        <h2>精選文章</h2>
      </div>
      <div class="card-group">
        <div class="card me-3" v-for="(kItem, kIdx) in randomKnowledgeCards" :key="'know-' + kIdx">
          <a :href="kItem.footer">
            <img :src="kItem.img" class="card-img-top" alt="knowledge img" />
          </a>
          <div class="card-body">
            <h3 class="card-title">{{ kItem.title }}</h3>
            <p class="card-text">{{ kItem.text }}</p>
            <p class="card-text">
              <small class="text-muted">來源:<a :href="kItem.footer">{{ kItem.footer }}</a></small>
            </p>
          </div>
        </div>
      </div>

      <!-- ＝＝＝＝ 第四段：商品 / 聯名 / 價格 ＝＝＝＝ -->
      <div class="card-group d-flex justify-content-between align-items-stretch px-0 flex-wrap">
        <div class="card bg-dark text-white" v-for="(shop, sIdx) in homeData.shopItems" :key="'shop-' + sIdx">
          <img :src="shop.img" class="card-img" alt="shop item" />
          <div class="card-img-overlay">
            <h5 class="card-title">{{ shop.title }}</h5>
            <p class="card-text">{{ shop.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 資料還沒載入時的畫面 -->
  <div v-else class="home-pageNG">
    資料載入中...
  </div>
</template>
