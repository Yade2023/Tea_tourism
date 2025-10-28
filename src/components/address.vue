<script setup>
import { ref } from 'vue'
// 重要：把你的 CSS 檔引入進來，路徑視你的專案結構調整
import '../assets/css/address.css'

// 哪一個手風琴是展開狀態？
// - 和原本的 JS 一樣：一次只開一個
// - 預設 null = 全部收起來
const activeIndex = ref(null)

// 手風琴點擊行為
function toggleAccordion(index) {
  // 如果點的是同一個，就關掉
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    // 關閉其他，打開這個
    activeIndex.value = index
  }
}

// 表單的 v-model
const nameInput = ref('')
const emailInput = ref('')
const messageInput = ref('')

// 送出表單
function submitForm() {
  alert("您的訊息已送出，我們將盡快與您聯繫！")

  // 這裡未連接後端，只是展示/清空
  console.log({
    name: nameInput.value,
    email: emailInput.value,
    message: messageInput.value
  })

  nameInput.value = ''
  emailInput.value = ''
  messageInput.value = ''
}

// 給手風琴資料結構，方便維護
const accordionList = [
  {
    title: '🛒 茶葉選購與品質',
    qa: [
      { q: 'Q：如何分辨茶葉好壞？', a: 'A：看外觀（色澤、條索）、聞香氣、泡水後觀察茶湯色與滋味。' },
      { q: 'Q：進口茶是否安全？', a: 'A：多數進口茶經過多重檢驗程序，甚至比部分本地茶更嚴格。' },
    ],
  },
  {
    title: '🌿 茶種與製程',
    qa: [
      { q: 'Q：什麼是烏龍茶？', a: 'A：屬於部分發酵茶，氧化度介於綠茶與紅茶之間，常見有球型（烏龍）與條型（包種）。' },
      { q: 'Q：茶的發酵度是什麼意思？', a: 'A：其實是氧化程度的俗稱，影響茶的香氣與口感。' },
    ],
  },
  {
    title: '☕ 沖泡與保存',
    qa: [
      { q: 'Q：茶葉保存方式？', a: 'A：避免陽光、濕氣與高溫，密封冷藏是較佳方式。' },
      { q: 'Q：茶葉有效期限多久？', a: 'A：視茶種而定，綠茶較短，紅茶與烏龍茶可保存較久。' },
    ],
  },
  {
    title: '🧠 健康與迷思',
    qa: [
      { q: 'Q：喝茶會影響睡眠嗎？', a: 'A：茶含咖啡因，晚上飲用可能影響睡眠，可選擇低咖啡因茶種如白茶或熟普洱。' },
      { q: 'Q：茶可以減肥嗎？', a: 'A：部分茶如普洱、綠茶有助於代謝，但仍需搭配飲食與運動。' },
    ],
  },
  {
    title: '🧧 茶文化與禮儀',
    qa: [
      { q: 'Q：茶道與品茶有什麼不同？', a: 'A：茶道強調儀式與精神層面，品茶則偏重感官體驗與茶葉本身。' },
      { q: 'Q：送茶當禮物有禁忌嗎？', a: 'A：避免送太便宜或太濃烈的茶，選擇包裝精美、寓意吉祥的茶較佳。' },
    ],
  },
  {
    title: '🍽️ 茶與食物搭配',
    qa: [
      { q: 'Q：喝茶可以搭配甜點嗎？', a: 'A：可以！綠茶配抹茶甜點、紅茶配蛋糕、烏龍茶配堅果都很合適。' },
      { q: 'Q：茶可以入菜嗎？', a: 'A：茶葉可用於燻製、入湯或製作茶油，如茶香雞、茶葉蛋等。' },
    ],
  },
  {
    title: '🚫 飲茶禁忌與注意事項',
    qa: [
      { q: 'Q：空腹可以喝茶嗎？', a: 'A：不建議，尤其是濃茶，可能刺激胃酸分泌。' },
      { q: 'Q：孕婦可以喝茶嗎？', a: 'A：可選擇低咖啡因茶種，如白茶或熟普洱，但仍需適量。' },
    ],
  },
  {
    title: '🧪 茶的成分與功效',
    qa: [
      { q: 'Q：茶多酚是什麼？', a: 'A：是一種抗氧化物，有助於抗老化、降血脂。' },
      { q: 'Q：普洱茶為何越陳越香？', a: 'A：因為微生物與酵素持續作用，茶葉逐漸熟化，香氣更醇厚。' },
    ],
  },
  {
    title: '🌱 茶葉品種與產地',
    qa: [
      { q: 'Q：龍井茶有哪些產區？', a: 'A：分為西湖龍井、錢塘龍井、越州龍井三大產區。' },
      { q: 'Q：碧螺春屬於什麼茶類？', a: 'A：屬於細嫩炒青綠茶，原產於太湖洞庭山。' },
    ],
  },
  {
    title: '🧪 茶葉成分與製程',
    qa: [
      { q: 'Q：茶的「發酵度」是什麼？', a: 'A：其實是氧化程度的俗稱，與微生物發酵不同。常用兒茶素與茶多酚變化來判斷。' },
      { q: 'Q：什麼是「殺青」？', a: 'A：是製茶過程中用高溫破壞茶葉酵素活性，防止氧化，保留綠茶清香。' },
    ],
  },
  {
    title: '🧑‍🌾 茶樹栽培與病蟲害',
    qa: [
      { q: 'Q：茶園常見病害有哪些？', a: 'A：如茶葉炭疽病、茶葉白星病等，需定期巡查與防治。' },
      { q: 'Q：茶樹灌溉有什麼講究？', a: 'A：需根據季節與土壤調整水量，避免積水或乾旱。' },
    ],
  },
  {
    title: '🏆 茶葉等級與榮譽',
    qa: [
      { q: 'Q：龍井茶分幾個等級？', a: 'A：分為特級、1級至5級，共六個等級。' },
      { q: 'Q：龍井茶曾獲哪些獎項？', a: 'A：曾三度獲得國家金獎，並在世界食品評選中獲金棕櫚獎。' },
    ],
  },
]
</script>

<template>
  <div class="container">
    <div class="concepts">

      <!-- Q&A 區域 -->
      <div class="qa-section">
        <h2 class="qa-title">🍵 茶類常見問答精選</h2>

        <div class="accordion">
          <!-- 用 v-for 把每一組手風琴畫出來 -->
          <div class="accordion-item" v-for="(group, idx) in accordionList" :key="idx"
            :class="{ active: activeIndex === idx }">
            <!-- 標題列 -->
            <div class="accordion-header" @click="toggleAccordion(idx)">
              <h3>{{ group.title }}</h3>

              <!-- 右邊的 + 符號：保持你的 CSS 視覺 (rotate) -->
              <span class="accordion-icon">
                +
              </span>
            </div>

            <!-- 內容 -->
            <div class="accordion-content">
              <div class="qa-item" v-for="(item, qIndex) in group.qa" :key="qIndex">
                <div class="question">{{ item.q }}</div>
                <div class="answer">{{ item.a }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聯絡表單 -->
      <h2 class="h2text">聯絡我們</h2>

      <form id="contactForm" @submit.prevent="submitForm">
        <div class="form-group">
          <label>您的名稱 *</label>
          <input type="text" v-model="nameInput" required />
        </div>

        <div class="form-group">
          <label>您的電子郵件 *</label>
          <input type="email" v-model="emailInput" required />
        </div>

        <div class="form-group">
          <label>內容（意見 / 聯絡事宜 / 其他） *</label>
          <textarea v-model="messageInput" required></textarea>
        </div>

        <div class="submit-btn">
          <button type="submit">發送</button>
        </div>
      </form>

    </div>
  </div>
</template>

<!--
不需要 <style scoped> 因為我們直接 import '../assets/css/address.css'
如果你想要它只影響這個元件，可以把 CSS 改貼進下面並加 scoped。
-->
