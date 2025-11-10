<script setup>
import { ref, onMounted } from 'vue'
import '../assets/css/knowledge.css'
// 直接把本地 JSON 當成一個物件引入
import defaultDataRaw from '../assets/json/knowledge.json'
// ===== mergeDefault：API 覆蓋預設，但不覆蓋成 null / 空字串 =====
import { mergeDefault } from '../assets/js/mergeDefault'
import { safeFetch, API_CONFIG } from '../utils/apiConfig'

// 導入知識頁面需要的圖片
// 茶類圖片
import tea1 from '../assets/knowledge_img/tea1-1.png'
import tea2 from '../assets/knowledge_img/tea2-1.png'
import tea3 from '../assets/knowledge_img/tea3-1.png'
import tea4 from '../assets/knowledge_img/tea4-1.png'
import tea5 from '../assets/knowledge_img/tea5-1.png'
import tea6 from '../assets/knowledge_img/tea6-1.png'

// 沖泡步驟圖片
import stepImage from '../assets/knowledge_img/step.png'

// 茶特色圖片
import teaSoup1 from '../assets/knowledge_img/teaSoup1.png'
import teaSoup2 from '../assets/knowledge_img/teaSoup2.png'
import teaSoup3 from '../assets/knowledge_img/teaSoup3.png'
import teaSoup4 from '../assets/knowledge_img/teaSoup4.png'
import teaSoup5 from '../assets/knowledge_img/teaSoup5.png'
import teaSoup6 from '../assets/knowledge_img/teaSoup6.png'

// 歷史圖片
import history1 from '../assets/knowledge_img/history1.jpg'
import history2 from '../assets/knowledge_img/history2.jpg'
import history3 from '../assets/knowledge_img/history3.jpg'
import history4 from '../assets/knowledge_img/history4.jpg'
import history5 from '../assets/knowledge_img/history5.jpg'
import history6 from '../assets/knowledge_img/history6.jpg'

// ===== 畫面用狀態 =====
const selectedIndex = ref(null)
const featureIndex = ref(0)
const historyIndex = ref(0)
// 最後畫面要吃的資料
const knowledgeData = ref(null)

// 圖片映射對象
const imageMap = {
  // 茶類圖片
  './src/assets/knowledge_img/tea1-1.png': tea1,
  './src/assets/knowledge_img/tea2-1.png': tea2,
  './src/assets/knowledge_img/tea3-1.png': tea3,
  './src/assets/knowledge_img/tea4-1.png': tea4,
  './src/assets/knowledge_img/tea5-1.png': tea5,
  './src/assets/knowledge_img/tea6-1.png': tea6,
  
  // 沖泡步驟圖片
  './src/assets/knowledge_img/step.png': stepImage,
  
  // 茶特色圖片
  './src/assets/knowledge_img/teaSoup1.png': teaSoup1,
  './src/assets/knowledge_img/teaSoup2.png': teaSoup2,
  './src/assets/knowledge_img/teaSoup3.png': teaSoup3,
  './src/assets/knowledge_img/teaSoup4.png': teaSoup4,
  './src/assets/knowledge_img/teaSoup5.png': teaSoup5,
  './src/assets/knowledge_img/teaSoup6.png': teaSoup6,
  
  // 歷史圖片
  './src/assets/knowledge_img/history1.jpg': history1,
  './src/assets/knowledge_img/history2.jpg': history2,
  './src/assets/knowledge_img/history3.jpg': history3,
  './src/assets/knowledge_img/history4.jpg': history4,
  './src/assets/knowledge_img/history5.jpg': history5,
  './src/assets/knowledge_img/history6.jpg': history6,
}

// 替換圖片路徑的函數
const replaceImagePaths = (data) => {
  const processedData = JSON.parse(JSON.stringify(data)) // 深拷貝
  
  // 處理茶類圖片
  if (processedData.teas) {
    processedData.teas.forEach(tea => {
      if (tea.image && imageMap[tea.image]) {
        tea.image = imageMap[tea.image]
      }
    })
  }
  
  // 處理沖泡步驟圖片
  if (processedData.stepImage && imageMap[processedData.stepImage]) {
    processedData.stepImage = imageMap[processedData.stepImage]
  }
  
  // 處理特色列表圖片
  if (processedData.featureList) {
    processedData.featureList.forEach(feature => {
      if (feature.image && imageMap[feature.image]) {
        feature.image = imageMap[feature.image]
      }
    })
  }
  
  // 處理歷史列表圖片
  if (processedData.historyList) {
    processedData.historyList.forEach(history => {
      if (history.image && imageMap[history.image]) {
        history.image = imageMap[history.image]
      }
    })
  }
  
  return processedData
}
// ===== 導航操作 =====
const open = (i) => (selectedIndex.value = i)
const close = () => (selectedIndex.value = null)

const nextFeature = () => {
    if (!knowledgeData.value) return
    const len = knowledgeData.value.featureList.length
    featureIndex.value = (featureIndex.value + 1) % len
}

const prevFeature = () => {
    if (!knowledgeData.value) return
    const len = knowledgeData.value.featureList.length
    featureIndex.value = (featureIndex.value - 1 + len) % len
}

const nextHistory = () => {
    if (!knowledgeData.value) return
    const len = knowledgeData.value.historyList.length
    historyIndex.value = (historyIndex.value + 1) % len
}

const prevHistory = () => {
    if (!knowledgeData.value) return
    const len = knowledgeData.value.historyList.length
    historyIndex.value = (historyIndex.value - 1 + len) % len
}

// ===== onMounted：用你指定的流程，一字不漏邏輯保持 =====
onMounted(async () => {
    // 1. 一開始就先上本地預設資料
    let rawData = defaultDataRaw
    
    try {
        // 2. 嘗試抓 API（透過 Cloudflare Workers 代理）
        const res = await safeFetch(API_CONFIG.ENDPOINTS.KNOWLEDGE)
        const apiData = await res.json()

        // 3. 把 API 跟預設合併，API 只會覆蓋有內容的欄位
        rawData = mergeDefault(defaultDataRaw, apiData)

        console.log('✅ 使用 API + fallback 合併資料')
    } catch (err) {
        // 4. API 壞掉 → 純預設
        console.warn('⚠️ API 失敗，使用純預設 JSON：', err)
    }
    
    // 5. 替換所有圖片路徑為 import 的圖片
    knowledgeData.value = replaceImagePaths(rawData)
})
</script>

<template>
    <div class="knowledge-page" v-if="knowledgeData">
        <!-- ===== 茶葉分類區 ===== -->
        <section class="stage">
            <!-- 初始狀態 -->
            <div v-if="selectedIndex === null" class="thumbs">
                <div v-for="(t, i) in knowledgeData.teas" :key="t.key || i" class="thumb"
                    :style="{ backgroundImage: 'url(' + t.image + ')' }" :data-title="t.title" @click="open(i)"></div>
            </div>

            <!-- 展開後狀態 -->
            <div v-else class="selected-layout">
                <div class="selected-left"
                    :style="{ backgroundImage: 'url(' + knowledgeData.teas[selectedIndex].image + ')' }"></div>
                <div class="selected-right" @click="close">
                    <h2>{{ knowledgeData.teas[selectedIndex].title }}</h2>
                    <p v-html="knowledgeData.teas[selectedIndex].description"></p>
                </div>
            </div>
        </section>

        <!-- ===== 沖泡方式 ===== -->
        <section class="brew-section">
            <img :src="knowledgeData.stepImage" alt="沖泡方式" />
        </section>

        <!-- ===== 茶葉特色 ===== -->
        <section class="info-block">
            <button @click="prevFeature">＜</button>
            <img :src="knowledgeData.featureList[featureIndex].image" alt="茶葉特色" />
            <div class="info-text">
                <h3>{{ knowledgeData.featureList[featureIndex].title }}</h3>
                <p>{{ knowledgeData.featureList[featureIndex].desc }}</p>
            </div>
            <button @click="nextFeature">＞</button>
        </section>

        <!-- ===== 台灣茶歷史 ===== -->
        <section class="info-block reverse">
            <button @click="prevHistory">＜</button>
            <img :src="knowledgeData.historyList[historyIndex].image" alt="台灣茶歷史" style="border-radius: 0" />
            <div class="info-text">
                <h3>{{ knowledgeData.historyList[historyIndex].title }}</h3>
                <p>{{ knowledgeData.historyList[historyIndex].desc }}</p>
            </div>
            <button @click="nextHistory">＞</button>
        </section>
    </div>

    <!-- 載入中畫面 -->
    <div v-else class="home-pageNG">
        資料載入中...
    </div>
</template>
