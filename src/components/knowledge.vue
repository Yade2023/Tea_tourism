<script setup>
import { ref, onMounted } from 'vue'
import '../assets/css/knowledge.css'
// 直接把本地 JSON 當成一個物件引入
import defaultDataRaw from '../assets/json/knowledge.json'
// ===== mergeDefault：API 覆蓋預設，但不蓋成 null / 空字串 =====
import { mergeDefault } from '../assets/js/mergeDefault'

// ===== 畫面用狀態 =====
const selectedIndex = ref(null)
const featureIndex = ref(0)
const historyIndex = ref(0)
// 最後畫面要吃的資料
const knowledgeData = ref(null)
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
    // 1. 一開始就先上本地預設資料，畫面立即顯示
    knowledgeData.value = defaultDataRaw
    try {
        // 2. 嘗試抓 API（之後你會改成雲端的網址）
        const res = await fetch('http://3.34.188.214:85/api/knowledge')
        if (!res.ok) throw new Error('API 回傳狀態不是 200')

        const apiData = await res.json()

        // 3. 把 API 跟預設合併，API 只會覆蓋有內容的欄位
        knowledgeData.value = mergeDefault(defaultDataRaw, apiData)

        console.log('✅ 使用 API + fallback 合併資料')
    } catch (err) {
        // 4. API 壞掉 → 純預設
        console.warn('⚠️ API 失敗，使用純預設 JSON：', err)
    }
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
