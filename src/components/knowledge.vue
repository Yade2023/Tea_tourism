<template>
    <div class="knowledge-page">
        <!-- ===== 茶葉分類區 ===== -->
        <section class="stage">
            <!-- 初始狀態 -->
            <div v-if="selectedIndex === null" class="thumbs">
                <div v-for="(t, i) in teas" :key="t.key" class="thumb"
                    :style="{ backgroundImage: 'url(' + t.image + ')' }" :data-title="t.title" @click="open(i)"></div>
            </div>

            <!-- 展開後狀態 -->
            <div v-else class="selected-layout">
                <div class="selected-left" :style="{ backgroundImage: 'url(' + teas[selectedIndex].image + ')' }"></div>
                <div class="selected-right" @click="close">
                    <h2>{{ teas[selectedIndex].title }}</h2>
                    <p v-html="teas[selectedIndex].description"></p>
                </div>
            </div>
        </section>

        <!-- ===== 沖泡方式 ===== -->
        <section class="brew-section">
            <img :src="stepImage" alt="沖泡方式" />
        </section>

        <!-- ===== 茶葉特色 ===== -->
        <section class="info-block">
            <button @click="prevFeature">＜</button>
            <img :src="featureList[featureIndex].image" alt="茶葉特色" />
            <div class="info-text">
                <h3>{{ featureList[featureIndex].title }}</h3>
                <p>{{ featureList[featureIndex].desc }}</p>
            </div>
            <button @click="nextFeature">＞</button>
        </section>

        <!-- ===== 台灣茶歷史 ===== -->
        <!-- <section class="info-block" style="flex-direction: row-reverse;"> -->
        <section class="info-block reverse">
            <button @click="nextHistory">＜</button>
            <img :src="historyList[historyIndex].image" alt="台灣茶歷史" style="border-radius: 0" />
            <div class="info-text">
                <h3>{{ historyList[historyIndex].title }}</h3>
                <p>{{ historyList[historyIndex].desc }}</p>
            </div>
            <button @click="prevHistory">＞</button>

        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// ===== 狀態 =====
const selectedIndex = ref(null)

// 導入圖片
import tea1Image from '../assets/knowledge_img/tea1-1.png'
import tea2Image from '../assets/knowledge_img/tea2-1.png'
import tea3Image from '../assets/knowledge_img/tea3-1.png'
import tea4Image from '../assets/knowledge_img/tea4-1.png'
import tea5Image from '../assets/knowledge_img/tea5-1.png'
import tea6Image from '../assets/knowledge_img/tea6-1.png'
import stepImage from '../assets/knowledge_img/step.png'
import teaSoup1 from '../assets/knowledge_img/teaSoup1.png'
import teaSoup2 from '../assets/knowledge_img/teaSoup2.png'
import teaSoup3 from '../assets/knowledge_img/teaSoup3.png'
import teaSoup4 from '../assets/knowledge_img/teaSoup4.png'
import teaSoup5 from '../assets/knowledge_img/teaSoup5.png'
import teaSoup6 from '../assets/knowledge_img/teaSoup6.png'
import history1 from '../assets/knowledge_img/history1.jpg'
import history2 from '../assets/knowledge_img/history2.jpg'
import history3 from '../assets/knowledge_img/history3.jpg'
import history4 from '../assets/knowledge_img/history4.jpg'
import history5 from '../assets/knowledge_img/history5.jpg'
import history6 from '../assets/knowledge_img/history6.jpg'

// ===== 茶葉資料 =====
const teas = ref([
    {
        key: 'black',
        title: '紅茶',
        image: tea1Image,
        description: `
紅茶屬全發酵茶，茶湯紅亮、香氣濃郁，是台灣早期外銷主力茶品。<br><br>
✦ 特色：經完全發酵，茶湯色澤橙紅明亮，香氣濃厚且多層次。<br>
常帶有蜜香、果香與熟果甜氣，茶體厚實圓潤，冷卻後依然順口不澀。<br>
小葉種紅茶香氣清新柔和，蜜香紅茶則如蜂蜜般甜潤芬芳。<br><br>
✦ 湯色：橙紅透亮。<br>
✦ 代表茶品：蜜香紅茶、小葉種紅茶。<br>
✦ 產地：南投魚池、台中、台東。<br>
✦ 功效：促進消化、提神醒腦、抗氧化、暖胃。
`
    },
    {
        key: 'roast',
        title: '培香烏龍',
        image: tea2Image,
        description: `
培香烏龍茶為半發酵茶，經中至重度焙火，香氣濃郁深沉。<br><br>
✦ 特色：焙火工藝使茶葉散發焦糖香、堅果香與熟果甜氣，<br>
茶湯圓潤厚實，入口後帶微微木質與烤香，餘韻悠長。<br>
香氣層層堆疊，適合喜歡濃烈茶韻者。<br><br>
✦ 湯色：金黃至琥珀色。<br>
✦ 代表茶品：凍頂烏龍（重焙）、金萱烏龍（焙香版）。<br>
✦ 產地：南投鹿谷、嘉義阿里山。<br>
✦ 功效：暖胃助消化、緩解油膩、放鬆心情。
`
    },
    {
        key: 'beauty',
        title: '東方美人',
        image: tea3Image,
        description: `
東方美人茶屬重度發酵、輕焙火的烏龍茶，是台灣特有名茶。<br><br>
✦ 特色：茶葉經小綠葉蟬啃咬後自然發酵，產生獨特蜜香與熟果香。<br>
茶湯入口柔順甘甜，帶葡萄、蜂蜜與花蜜香，香氣馥郁持久，<br>
口感圓潤細緻，有「香檳茶」之美名。<br><br>
✦ 湯色：琥珀橙紅、明亮清澈。<br>
✦ 代表茶品：新竹北埔、苗栗峨眉白毫烏龍。<br>
✦ 產地：新竹、苗栗。<br>
✦ 功效：抗氧化、促進代謝、潤喉養顏。
`
    },
    {
        key: 'oolong',
        title: '烏龍茶',
        image: tea4Image,
        description: `
烏龍茶是台灣代表性茶品，屬半發酵茶，介於紅茶與綠茶之間。<br><br>
✦ 特色：茶湯金黃透亮，帶自然花香與果香，<br>
香氣清新高雅、口感圓潤順滑，喉韻甘甜悠長。<br>
高山烏龍清爽柔和、凍頂烏龍則厚實醇香。<br><br>
✦ 湯色：金黃至淡琥珀。<br>
✦ 代表茶品：阿里山高山烏龍、凍頂烏龍。<br>
✦ 產地：南投鹿谷、嘉義阿里山。<br>
✦ 功效：促進脂肪代謝、助消化、提神醒腦。
`
    },
    {
        key: 'pouchong',
        title: '包種茶',
        image: tea5Image,
        description: `
包種茶為輕度發酵茶，香氣清新優雅，帶有花香與淡淡果香。<br><br>
✦ 特色：茶湯柔和順口，香氣如玉蘭、桂花般細緻清甜，<br>
茶韻純淨輕盈，適合初入門的茶友。<br>
稍作焙火後會增添蜜香與果香層次。<br><br>
✦ 湯色：淡金黃、帶綠光。<br>
✦ 代表茶品：文山包種茶。<br>
✦ 產地：新北坪林、石碇。<br>
✦ 功效：清新提神、潤喉生津、消除油膩。
`
    },
    {
        key: 'green',
        title: '綠茶',
        image: tea6Image,
        description: `
綠茶屬不發酵茶，保留茶葉原始清香與鮮爽，口感清新自然。<br><br>
✦ 特色：茶湯清澈碧綠，滋味清甜回甘，略帶青草與豆香。<br>
台灣綠茶多為清香型，口感爽口滑順。<br>
三峽碧螺春帶嫩豆與花香，龍井綠茶則清雅怡人。<br><br>
✦ 湯色：碧綠、黃綠或淡金色。<br>
✦ 代表茶品：三峽碧螺春、龍井綠茶。<br>
✦ 產地：新北三峽、桃園龍潭。<br>
✦ 功效：抗氧化、促進代謝、提神醒腦、維持口氣清新。
`
    }
])

// ===== 茶葉特色 =====
const featureIndex = ref(0)
const featureList = ref([
    { title: '包種茶的特色', image: teaSoup2, desc: '包種茶清香淡雅、入口回甘，是北部茶區代表，採輕度發酵工藝，保留花香與清甜。' },
    { title: '烏龍茶的層次', image: teaSoup4, desc: '烏龍茶介於綠茶與紅茶之間，具花果香與焙火香，滋味濃郁又回甘。' },
    { title: '東方美人的蜜香', image: teaSoup3, desc: '由小綠葉蟬咬食產生特殊蜜香，是自然與工藝結合的經典代表。' },
    { title: '高山茶的清甜', image: teaSoup5, desc: '高山雲霧孕育茶葉的清香與鮮甜，湯色金黃透亮，回甘悠長。' },
    { title: '紅茶的濃厚香氣', image: teaSoup1, desc: '全發酵的紅茶，茶湯紅亮、果香明顯，是台灣外銷的驕傲。' },
    { title: '綠茶的清爽鮮活', image: teaSoup6, desc: '保留茶葉原始風味，茶湯清亮，口感清新爽口。' }
])

// ===== 台灣茶歷史 =====
const historyIndex = ref(0)
const historyList = ref([
    { title: '1.茶樹引進與初期發展', image: history1, desc: '茶樹最早是由中國大陸引入台灣。根據史料記載，茶樹首次引入台灣的時間大約是在17世紀初期，由當時的漢人移民帶來。' },
    { title: '2.茶葉的商業化與外銷', image: history2, desc: '到了19世紀中期，台灣的茶葉生產進入了商業化的階段，特別是福建、廣東等地的市場。' },
    { title: '3.技術引進與茶葉品種改良', image: history3, desc: '日本在1895年開始統治台灣，進行大規模的現代化建設，推動茶葉改良。' },
    { title: '4.茶業振興與國際化', image: history4, desc: '1945年戰後，台灣茶葉的市場逐漸轉向國際化發展。' },
    { title: '5.台灣茶的現代發展', image: history5, desc: '1970年代後，台灣高山烏龍茶成為世界知名精品茶代表。' },
    { title: '6.台灣茶的特色與全球影響', image: history6, desc: '台灣茶以清香型、花果香為特色，烏龍製茶技術享譽全球。' }
])

// ===== 方法 =====
const open = (i) => (selectedIndex.value = i)
const close = () => (selectedIndex.value = null)
const nextFeature = () => (featureIndex.value = (featureIndex.value + 1) % featureList.value.length)
const prevFeature = () => (featureIndex.value = (featureIndex.value - 1 + featureList.value.length) % featureList.value.length)
const nextHistory = () => (historyIndex.value = (historyIndex.value + 1) % historyList.value.length)
const prevHistory = () => (historyIndex.value = (historyIndex.value - 1 + historyList.value.length) % historyList.value.length)
</script>

<style src="../assets/css/knowledge.css"></style>
