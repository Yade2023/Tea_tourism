<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../assets/css/HomeTea_tourism.css'
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import localJsonUrl from '../assets/json/HomeTea_tourism.json'
// 合併工具：用 API 值覆蓋預設，但不覆蓋成 null / "" / undefined
import { mergeDefault } from '../assets/js/mergeDefault'

// 導入首頁需要的圖片
import carousel01 from '../assets/images/index_img/carousel01.jpg'
import carousel02 from '../assets/images/index_img/carousel02.jpg'
import carousel03 from '../assets/images/index_img/carousel03.jpg'
import teaScenery from '../assets/images/index_img/茶景.jpg'
import daxitea from '../assets/images/index_img/daxitea.jpg'
import matcha from '../assets/images/index_img/抹茶.jpg'
import teaTaboo from '../assets/images/index_img/茶禁忌.jpg'
import baozongTea from '../assets/images/index_img/包種茶故鄉.jpg'
import sixTeaTypes from '../assets/images/index_img/六大茶類分類法.jpg'
import teaHealth from '../assets/images/index_img/茶對健康有幫助.jpg'
import teaCups from '../assets/images/index_img/喝幾杯茶最剛好.jpg'

// 對於 public 資料夾中的圖片，我們使用路徑字符串
const publicImageMap = {
  '/images/HerbalTea/savor01.jpg': '/images/HerbalTea/savor01.jpg',
  '/images/HerbalTea/savor02.jpg': '/images/HerbalTea/savor02.jpg',
  '/images/HerbalTea/savor03.jpg': '/images/HerbalTea/savor03.jpg',
  '/images/HerbalTea/savor04.jpg': '/images/HerbalTea/savor04.jpg',
  '/images/HerbalTea/savor05.jpg': '/images/HerbalTea/savor05.jpg',
  '/images/HerbalTea/savor06.jpg': '/images/HerbalTea/savor06.jpg',
  '/images/HerbalTea/savor07.jpg': '/images/HerbalTea/savor07.jpg',
  '/images/HerbalTea/savor08.jpg': '/images/HerbalTea/savor08.jpg',
  '/images/HerbalTea/savor09.jpg': '/images/HerbalTea/savor09.jpg',
  '/images/HerbalTea/savor10.jpg': '/images/HerbalTea/savor10.jpg',
  '/images/HerbalTea/savor11.jpg': '/images/HerbalTea/savor11.jpg',
  '/images/HerbalTea/savor12.jpg': '/images/HerbalTea/savor12.jpg',
  
  '/images/TeaName/special01.jpg': '/images/TeaName/special01.jpg',
  '/images/TeaName/special02.jpg': '/images/TeaName/special02.jpg',
  '/images/TeaName/special03.jpg': '/images/TeaName/special03.jpg',
  '/images/TeaName/special04.jpg': '/images/TeaName/special04.jpg',
  '/images/TeaName/special05.jpg': '/images/TeaName/special05.jpg',
  '/images/TeaName/special06.jpg': '/images/TeaName/special06.jpg',
  '/images/TeaName/special07.jpg': '/images/TeaName/special07.jpg',
  '/images/TeaName/special08.jpg': '/images/TeaName/special08.jpg',
  '/images/TeaName/special9.jpg': '/images/TeaName/special9.jpg',
  '/images/TeaName/special10.jpg': '/images/TeaName/special10.jpg',
  '/images/TeaName/special11.jpg': '/images/TeaName/special11.jpg',
  '/images/TeaName/special12.jpg': '/images/TeaName/special12.jpg',
}

const homeData = ref(null)
const router = useRouter()

// 控制開場動畫顯示的狀態：預設為 false，待頁面載入完成後再觸發
const showAnimation = ref(false)

// 圖片映射對象
const imageMap = {
  // 輪播圖片
  'index_img/carousel01.jpg': carousel01,
  '../src/assets/images/index_img/carousel02.jpg': carousel02,
  '../src/assets/images/index_img/carousel03.jpg': carousel03,
  
  // 介紹區塊圖片
  './src/assets/images/index_img/茶景.jpg': teaScenery,
  
  // 特色景點圖片
  './src/assets/images/index_img/daxitea.jpg': daxitea,
  
  // 知識卡片圖片
  './src/assets/images/index_img/抹茶.jpg': matcha,
  './src/assets/images/index_img/茶禁忌.jpg': teaTaboo,
  './src/assets/images/index_img/包種茶故鄉.jpg': baozongTea,
  './src/assets/images/index_img/六大茶類分類法.jpg': sixTeaTypes,
  './src/assets/images/index_img/茶對健康有幫助.jpg': teaHealth,
  './src/assets/images/index_img/喝幾杯茶最剛好.jpg': teaCups,
  
  // 合併 public 資料夾的圖片映射
  ...publicImageMap,
}

// 替換圖片路徑的函數
const replaceImagePaths = (data) => {
  const processedData = JSON.parse(JSON.stringify(data)) // 深拷貝
  
  // 處理輪播圖片
  if (processedData.carousel) {
    processedData.carousel.forEach(item => {
      if (item.img && imageMap[item.img]) {
        item.img = imageMap[item.img]
      }
    })
  }
  
  // 處理介紹區塊圖片
  if (processedData.introBlock?.leftImage && imageMap[processedData.introBlock.leftImage]) {
    processedData.introBlock.leftImage = imageMap[processedData.introBlock.leftImage]
  }
  
  // 處理特色景點圖片
  if (processedData.featureSpot?.mainImage && imageMap[processedData.featureSpot.mainImage]) {
    processedData.featureSpot.mainImage = imageMap[processedData.featureSpot.mainImage]
  }
  
  // 處理知識卡片圖片
  if (processedData.knowledgeCards) {
    processedData.knowledgeCards.forEach(card => {
      if (card.img && imageMap[card.img]) {
        card.img = imageMap[card.img]
      }
    })
  }
  
  // 處理商品圖片
  if (processedData.shopItems) {
    processedData.shopItems.forEach(item => {
      if (item.savorImage && imageMap[item.savorImage]) {
        item.savorImage = imageMap[item.savorImage]
      }
      if (item.TeaName && imageMap[item.TeaName]) {
        item.TeaName = imageMap[item.TeaName]
      }
    })
  }
  
  return processedData
}

// 將動畫中使用的三張圖片轉為瀏覽器可讀取的 URL
// 這些圖片放在 assets/img 資料夾中，請依實際檔名調整路徑
// 在專案中 HomeTea_tourism.vue 位於 src/components，故需往上一層至 src 再進入 assets/img
const img1 = new URL('../assets/img/2.png', import.meta.url).href // 行走採茶人的背景圖
const img2 = new URL('../assets/img/1.png', import.meta.url).href // 茶芽或 LOGO 圖
const img3 = new URL('../assets/img/3.png', import.meta.url).href // 合成後的茶旅標誌

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

// 將商品陣列分組，每組指定數量
const getShopChunks = (items, chunkSize) => {
  if (!items || !Array.isArray(items)) return []
  const chunks = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

// 點擊商品卡片跳轉到購物頁面
const goToShopping = (shop) => {
  // 可以傳遞商品資訊到購物頁面
  router.push({
    name: 'Shopping4', // 確保路由名稱正確
    query: {
      productId: shop.id,
      category: shop.category
    }
  }).then(() => {
    // 路由跳轉完成後，確保滾動到頂部
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })
}

onMounted(async () => {
  // 1. 先一定抓到本地預設資料
  let rawData = localJsonUrl

  try {
    // 2. 嘗試抓 API
    const res = await fetch('http://3.34.188.214:85/api/home')
    if (!res.ok) throw new Error('API 回傳狀態不是 200')

    const apiData = await res.json()

    // 3. 把 API 跟預設合併，API 只會覆蓋有內容的欄位
    rawData = mergeDefault(rawData, apiData)

    console.log('✅ 使用 API + fallback 合併資料')
  } catch (err) {
    // 4. API 壞掉 → 純預設
    console.warn('⚠️ API 失敗，使用純預設 JSON：', err)
  }

  // 5. 替換所有圖片路徑為 import 的圖片
  homeData.value = replaceImagePaths(rawData)

  // 頁面載入完成後才顯示開場動畫。先將動畫顯示，待一段時間後再關閉。
  // 在組件掛載（資料載入完畢）後，顯示動畫層
  showAnimation.value = true
  // 動畫總長約 4.5 秒，這邊設定為 5 秒，確保動畫播放完整後再關閉
  setTimeout(() => {
    showAnimation.value = false
  }, 5000)
})
</script>


<template>
  <!-- 開場動畫層：兩張圖片聚合成第三張後移動到左上方 LOGO -->
  <div v-if="showAnimation" class="intro-animation">
    <div class="animation-container">
      <!-- 採茶人圖片從左側進入 -->
      <img :src="img1" class="animation-img img1" alt="採茶人圖片" />
      <!-- 茶芽圖片從右側進入 -->
      <img :src="img2" class="animation-img img2" alt="茶芽圖片" />
      <!-- 合成後的茶旅標誌在中間顯示並移動至左上角 -->
      <img :src="img3" class="animation-img img3" alt="茶旅標誌" />
    </div>
  </div>
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

      <!-- ＝＝＝＝ 第四段：商品輪播卡片 ＝＝＝＝ -->
      <div class="text-center mb-3">
        <h2>精選商品</h2>
      </div>
      <div id="shopCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <!-- 指示器 -->
        <div class="carousel-indicators">
          <button v-for="(item, idx) in Math.ceil(homeData.shopItems.length / 4)" :key="'shop-ind-' + idx" type="button"
            data-bs-target="#shopCarousel" :data-bs-slide-to="idx" :class="{ active: idx === 0 }"
            :aria-current="idx === 0 ? 'true' : undefined" :aria-label="`商品頁 ${idx + 1}`">
          </button>
        </div>
        <!-- 輪播內容 -->
        <div class="carousel-inner">
          <div v-for="(chunk, chunkIdx) in getShopChunks(homeData.shopItems, 4)" :key="'shop-chunk-' + chunkIdx"
            class="carousel-item" :class="{ active: chunkIdx === 0 }">
            <div class="row justify-content-center">
              <div v-for="shop in chunk" :key="'shop-' + shop.id" class="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div 
                  class="card h-100 shop-card" 
                  @click="goToShopping(shop)"
                  style="cursor: pointer; transition: transform 0.3s;">
                  <img :src="shop.TeaName" class="card-img-top" :alt="shop.name"
                    style="height: 200px; object-fit: cover;" />
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ shop.name }}</h5>
                    <!-- <p class="card-text flex-grow-1">{{ shop.description }}</p> -->
                    <div class="mt-auto">
                      <p class="card-text">
                        <strong class="text-primary">NT$ {{ shop.price }}</strong>
                      </p>
                      <small class="text-muted">{{ shop.category }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 控制按鈕 -->
        <button class="carousel-control-prev" type="button" data-bs-target="#shopCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">上一頁</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#shopCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">下一頁</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 資料還沒載入時的畫面 -->
  <div v-else class="home-pageNG">
    資料載入中...
  </div>
</template>

<!-- 這裡加入開場動畫的樣式，使用 scoped 避免影響其他元素 -->
<style scoped>
/* 覆蓋整個螢幕的開場動畫層 */
.intro-animation {
  position: fixed;
  inset: 0;
  /* 背景透明以便首頁內容先顯示，再於其上播放動畫 */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  pointer-events: none;
}

/* 動畫容器，用來定位三張圖片 */
.intro-animation .animation-container {
  position: relative;
  width: 300px;
  height: 300px;
}

/* 基本動畫圖片樣式 */
.intro-animation .animation-img {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
}

/* 採茶人圖片從左側進入並淡出 */
.intro-animation .img1 {
  left: -150px;
  width: 150px;
  animation:
    moveFromLeft 2s forwards,
    fadeOut 1s forwards 2s;
  opacity: 1;
}

/* 茶芽圖片從右側進入並淡出 */
.intro-animation .img2 {
  right: -150px;
  width: 150px;
  animation:
    moveFromRight 2s forwards,
    fadeOut 1s forwards 2s;
  opacity: 1;
}

/* 合成後的茶旅標誌淡入並移動至左上角縮小 */
.intro-animation .img3 {
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  animation:
    fadeIn 1s forwards 2s,
    moveToLogo 1.5s forwards 3s;
}

/* 從左側移動至中間的關鍵幀 */
@keyframes moveFromLeft {
  to {
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

/* 從右側移動至中間的關鍵幀 */
@keyframes moveFromRight {
  to {
    right: 50%;
    transform: translate(50%, -50%);
    opacity: 1;
  }
}

/* 淡出圖片 */
@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

/* 淡入圖片 */
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 將合成圖片移動到左上角並縮小的關鍵幀 */
@keyframes moveToLogo {
  from {
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%);
    opacity: 1;
  }

  to {
    top: -210px;
    left: -545px;
    width: 100px;
    height: 100px;
    transform: none;
    opacity: 1;
  }
}

/* 商品卡片hover效果 */
.shop-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.shop-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 10px;
  overflow: hidden;
}

.shop-card .card-img-top {
  transition: transform 0.3s ease;
}

.shop-card:hover .card-img-top {
  transform: scale(1.05);
}
</style>
