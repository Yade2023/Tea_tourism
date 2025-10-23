<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
// 如果需要import圖片
import taiwanImg from './assets/img/taiwan.png'
import taiwanAdminImg from './assets/img/taiwan-admin.svg'

// 輪播相關
const currentSlide = ref(0)
const slides = ref([
  { src: taiwanImg, alt: '台灣茶葉' },
  { src: taiwanAdminImg, alt: '台灣茶葉管理' }
])

// 分頁相關
const currentPage = ref(1)
const totalPages = ref(6)

// 地圖相關
const currentLocation = ref('桃園市')
const isSatellite = ref(false)
const map = ref(null)
const teaGardens = ref([
  {
    id: 1,
    name: '拉拉山茶園',
    lat: 24.7,
    lng: 121.4,
    description: '海拔1500公尺的高山茶園'
  },
  {
    id: 2,
    name: '復興鄉茶園',
    lat: 24.8,
    lng: 121.3,
    description: '傳統製茶工藝保存區'
  },
  {
    id: 3,
    name: '大溪茶園',
    lat: 24.9,
    lng: 121.3,
    description: '歷史悠久的茶葉產區'
  },
  {
    id: 4,
    name: '龍潭茶園',
    lat: 24.9,
    lng: 121.2,
    description: '有機茶葉種植基地'
  }
])

// 活動數據
const eventsData = ref([
  // 第1頁 - 秋季茶葉活動
  [
    { title: '阿里山高山茶文化季', organizer: '嘉義縣文化觀光局', date: '114年10月18日－10月20日' },
    { title: '坪林冬片茶手作體驗營', organizer: '坪林茶業博物館', date: '114年10月25日' },
    { title: '台灣國際茶博覽會（台北場）', organizer: '台灣茶協會', date: '114年11月07日－11月10日' },
    { title: '茶香慢旅｜南投茶園小旅行', organizer: '南投觀光工廠協會', date: '114年11月15日－11月16日' },
    { title: '日月潭紅茶香氣工作坊', organizer: '日月潭紅茶推廣中心', date: '114年11月22日' },
    { title: '東方美人茶文化講座', organizer: '新竹縣茶業改良場', date: '114年11月30日' },
    { title: '冬季茶會｜一盞暖心的山中對話', organizer: '花蓮慢生活協會', date: '114年12月6日' },
    { title: '手搖茶調飲設計課（青年限定）', organizer: '台北文創茶學苑', date: '114年12月14日' },
    { title: '茶與攝影美學展', organizer: '高雄美術館 × 茶旅品牌合作', date: '114年12月20日－115年1月5日' }
  ],
  // 第2頁 - 春季茶葉活動
  [
    { title: '春茶採收體驗營', organizer: '鹿谷鄉農會', date: '115年3月15日－3月17日' },
    { title: '文山包種茶品茗會', organizer: '台北市茶商業同業公會', date: '115年3月22日' },
    { title: '凍頂烏龍茶製作工藝展', organizer: '南投縣政府', date: '115年3月28日－3月30日' },
    { title: '茶藝師認證課程', organizer: '中華茶藝聯合促進會', date: '115年4月5日－4月7日' },
    { title: '高山茶園生態導覽', organizer: '梨山觀光發展協會', date: '115年4月12日－4月14日' },
    { title: '茶葉烘焙技術研習', organizer: '台灣茶葉改良場', date: '115年4月20日' },
    { title: '春季茶葉評鑑大賽', organizer: '台灣茶協會', date: '115年4月26日－4月28日' },
    { title: '茶文化深度之旅', organizer: '新北市觀光局', date: '115年5月3日－5月5日' },
    { title: '有機茶園參訪體驗', organizer: '花蓮有機農業協會', date: '115年5月10日' }
  ],
  // 第3頁 - 夏季茶葉活動
  [
    { title: '夏季冷泡茶製作課程', organizer: '台中市茶藝學會', date: '115年6月8日' },
    { title: '茶葉保存與收藏講座', organizer: '台灣茶葉博物館', date: '115年6月15日' },
    { title: '茶席設計美學工作坊', organizer: '台北文創茶學苑', date: '115年6月22日－6月23日' },
    { title: '茶葉品質檢測體驗', organizer: '台灣茶業改良場', date: '115年6月29日' },
    { title: '茶園管理技術研習', organizer: '嘉義縣農會', date: '115年7月6日－7月8日' },
    { title: '茶葉包裝設計競賽', organizer: '高雄設計學院', date: '115年7月13日－7月15日' },
    { title: '茶藝表演藝術節', organizer: '台南市文化局', date: '115年7月20日－7月22日' },
    { title: '茶葉國際貿易研討會', organizer: '台灣茶葉進出口公會', date: '115年7月27日－7月29日' },
    { title: '茶園生態攝影比賽', organizer: '台灣生態攝影協會', date: '115年8月3日－8月5日' }
  ],
  // 第4頁 - 冬季茶葉活動
  [
    { title: '冬茶品評大會', organizer: '台灣茶業改良場', date: '115年12月7日－12月9日' },
    { title: '茶葉年貨市集', organizer: '台北市商業處', date: '115年12月14日－12月16日' },
    { title: '茶藝師年終聚會', organizer: '中華茶藝聯合促進會', date: '115年12月21日' },
    { title: '茶葉禮盒包裝設計', organizer: '新北市文創協會', date: '115年12月28日' },
    { title: '茶園冬季養護課程', organizer: '南投縣農會', date: '116年1月4日－1月6日' },
    { title: '茶葉儲存環境管理', organizer: '台灣茶葉博物館', date: '116年1月11日' },
    { title: '茶文化傳承研習營', organizer: '花蓮縣文化局', date: '116年1月18日－1月20日' },
    { title: '茶葉品質認證課程', organizer: '台灣茶協會', date: '116年1月25日－1月27日' },
    { title: '茶園觀光導覽培訓', organizer: '觀光局', date: '116年2月1日－2月3日' }
  ],
  // 第5頁 - 特殊主題活動
  [
    { title: '茶葉與健康養生講座', organizer: '台灣中醫藥學會', date: '115年9月5日' },
    { title: '茶葉農藥殘留檢測', organizer: '台灣茶業改良場', date: '115年9月12日' },
    { title: '茶葉電子商務研習', organizer: '台灣電商協會', date: '115年9月19日－9月21日' },
    { title: '茶葉品牌行銷策略', organizer: '台灣行銷學會', date: '115年9月26日－9月28日' },
    { title: '茶葉國際標準認證', organizer: '台灣標準檢驗局', date: '115年10月3日－10月5日' },
    { title: '茶葉包裝環保設計', organizer: '台灣環保署', date: '115年10月10日' },
    { title: '茶葉數位化轉型', organizer: '台灣數位發展部', date: '115年10月17日－10月19日' },
    { title: '茶葉國際貿易法規', organizer: '台灣貿易局', date: '115年10月24日－10月26日' },
    { title: '茶葉永續發展論壇', organizer: '台灣永續發展協會', date: '115年10月31日－11月2日' }
  ],
  // 第6頁 - 國際交流活動
  [
    { title: '台日茶文化交流會', organizer: '台灣日本交流協會', date: '115年11月7日－11月9日' },
    { title: '台韓茶藝競賽', organizer: '台灣韓國交流協會', date: '115年11月14日－11月16日' },
    { title: '東南亞茶葉貿易展', organizer: '台灣東南亞協會', date: '115年11月21日－11月23日' },
    { title: '歐美茶葉市場研討會', organizer: '台灣歐美貿易協會', date: '115年11月28日－11月30日' },
    { title: '國際茶葉品質認證', organizer: '國際茶葉組織', date: '115年12月5日－12月7日' },
    { title: '茶葉國際標準制定', organizer: '台灣標準檢驗局', date: '115年12月12日－12月14日' },
    { title: '國際茶藝師交流營', organizer: '國際茶藝師協會', date: '115年12月19日－12月21日' },
    { title: '茶葉國際行銷策略', organizer: '台灣國際貿易局', date: '115年12月26日－12月28日' },
    { title: '全球茶葉永續發展', organizer: '聯合國永續發展組織', date: '116年1月2日－1月4日' }
  ]
])

// 計算當前頁面顯示的活動
const currentPageEvents = computed(() => {
  return eventsData.value[currentPage.value - 1] || []
})

let slideInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 地圖相關函數
const initMap = () => {
  // 這裡將初始化 Google Map
  // 需要 Google Maps API key
  console.log('初始化地圖...')
}

const centerMap = () => {
  console.log('回到地圖中心')
  // 實際實現會移動地圖到桃園市中心
}

const toggleSatellite = () => {
  isSatellite.value = !isSatellite.value
  console.log('切換地圖模式:', isSatellite.value ? '衛星模式' : '地圖模式')
}

const showAllTeaGardens = () => {
  console.log('顯示所有茶園:', teaGardens.value)
  // 實際實現會在地圖上顯示所有茶園標記
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<template>
  <div class="app">
    <div class="main-container">
      <div class="unified-content">
        <img :src="taiwanImg" alt="台灣茶葉" class="taiwan-image" />
        <div class="right-content">
          <div class="text-content">
            <h1>桃園茶鄉</h1>
            <p class="subtitle">探索台灣茶葉的故鄉</p>
            <p>桃園擁有豐富的茶葉文化底蘊，從清朝時期開始種植茶葉，至今已有數百年歷史。這裡的茶園分布在山區，氣候涼爽，土壤肥沃，非常適合茶樹生長。</p>
            <p>漫步在桃園的茶園中，可以感受到大自然的寧靜與美好。茶農們用心照料每一株茶樹，確保茶葉的品質，傳承著這份珍貴的茶文化。</p>
            <p>「茶香飄逸滿山間，綠意盎然映眼簾」</p>
          </div>
          
          <!-- Google Map 區塊 -->
          <div class="map-container">
            <div id="google-map" class="google-map"></div>
          </div>
        </div>
      </div>
    </div>
    
    
    
    
    
    <!-- 活動資訊表格 -->
    <div class="events-table-container">
      <div class="table-wrapper">
        <table class="events-table">
          <thead>
            <tr>
              <th>活動標題</th>
              <th>主辦單位</th>
              <th>活動日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in currentPageEvents" :key="event.title">
              <td>{{ event.title }}</td>
              <td>{{ event.organizer }}</td>
              <td>{{ event.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 頁碼導覽 -->
      <div class="pagination-container">
        <div class="pagination">
          <button 
            class="pagination-btn prev-btn" 
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            ‹ 
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn next-btn" 
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
             ›
          </button>
        </div>
        
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-container {
  width: 100%;
  padding: 80px 60px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.unified-content {
  display: flex;
  align-items: flex-start;
  gap: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 50px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.unified-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2c5530, #4a7c59, #6b8e6b);
  border-radius: 25px 25px 0 0;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.white-bg {
  background-color: #ffffff;
}

.gray-bg {
  background-color: #f5f5f500;
}

.taiwan-image {
  width: 50vw;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.text-content {
  flex: 1;
  text-align: left;
  position: relative;
}

.text-content h1 {
  font-size: 3rem;
  color: #2c5530;
  margin-bottom: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2c5530, #4a7c59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(44, 85, 48, 0.1);
  position: relative;
}

.text-content h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #4a7c59, #6b8e6b);
  border-radius: 2px;
}

.text-content .subtitle {
  font-size: 1.4rem;
  color: #4a7c59;
  font-style: italic;
  margin-bottom: 2rem;
  font-weight: 500;
  opacity: 0.9;
}

.text-content p {
  font-size: 1.15rem;
  line-height: 1.9;
  color: #444;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 25px;
}

.text-content p::before {
  content: '🍃';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1.2rem;
}


/* 輪播樣式 */
.carousel-container {
  width: 100%;
  background-color: #ffffff;
  padding: 40px 0;
}

.carousel {
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0;
  box-shadow: none;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #2c5530, #4a7c59);
  border: 3px solid #ffffff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: linear-gradient(135deg, #4a7c59, #6b8e6b);
  transform: translateY(-50%) scale(1.15);
  box-shadow: 0 12px 35px rgba(44, 85, 48, 0.5);
  border-color: #f0f8f0;
}

.carousel-btn:active {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(44, 85, 48, 0.4);
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

/* 雙欄文字容器樣式 */
.dual-text-container {
  width: 100%;
  background-color: #ffffff;
  padding: 80px 40px;
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.text-block {
  flex: 1;
  padding: 0;
}

.text-block h2 {
  font-size: 2rem;
  color: #2c5530;
  margin-bottom: 25px;
  font-weight: bold;
}

.text-block p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 20px;
  text-align: left;
}

/* 活動表格樣式 */
.events-table-container {
  width: 100%;
  background-color: #f8f9fa;
  padding: 80px 40px;
}


.table-wrapper {
  max-width: none;
  margin: 0;
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.events-table th {
  background-color: #ffffff;
  color: #2c5530;
  padding: 20px 15px;
  text-align: left;
  font-weight: bold;
  font-size: 1.1rem;
  border-bottom: 2px solid #2c5530;
}

.events-table td {
  padding: 18px 15px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1rem;
  color: #4a4a4a;
}

.events-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.events-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.events-table tbody tr:hover {
  background-color: #e8f5e8;
}

.events-table tbody tr:last-child td {
  border-bottom: none;
}

.events-table td:first-child {
  font-weight: 600;
  color: #2c5530;
}

.events-table td:nth-child(2) {
  color: #6b8e6b;
}

.events-table td:nth-child(3) {
  color: #8b4513;
  font-weight: 500;
}

/* 頁碼導覽樣式 */
.pagination-container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-btn {
  padding: 12px 20px;
  background-color: #ffffff;
  border: 2px solid #2c5530;
  color: #2c5530;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #2c5530;
  color: #ffffff;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  background-color: #f5f5f5;
  border-color: #cccccc;
  color: #999999;
  cursor: not-allowed;
  transform: none;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 45px;
  height: 45px;
  background-color: #ffffff;
  border: 2px solid #e0e0e0;
  color: #4a4a4a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  border-color: #2c5530;
  color: #2c5530;
  transform: translateY(-2px);
}

.page-number.active {
  background-color: #2c5530;
  border-color: #2c5530;
  color: #ffffff;
}

.page-info {
  color: #6b8e6b;
  font-size: 1rem;
  font-weight: 500;
}

/* 地圖樣式 */
.map-container {
  width: 100%;
  background: rgba(248, 249, 250, 0.8);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(44, 85, 48, 0.1);
}

.google-map {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #f0f2f5, #e8f4f8);
  border-radius: 20px;
  border: 2px solid rgba(44, 85, 48, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.google-map::before {
  content: '🗺️ Google Map 將在此顯示';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(44, 85, 48, 0.2);
}

@media (max-width: 768px) {
  .main-container {
    padding: 40px 20px;
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .unified-content {
    flex-direction: column;
    padding: 30px 20px;
    gap: 30px;
  }
  
  .right-content {
    gap: 30px;
  }
  
  .text-content {
    text-align: center;
  }
  
  .text-content h1 {
    font-size: 2.5rem;
  }
  
  .text-content h1::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .taiwan-image {
    width: 80vw;
  }
  
  .map-container {
    padding: 20px;
  }
  
  .carousel-slide {
    height: 400px;
  }
  
  .carousel-btn {
    width: 50px;
    height: 50px;
    font-size: 24px;
    border-width: 2px;
  }
  
  .prev-btn {
    left: 10px;
  }
  
  .next-btn {
    right: 10px;
  }
  
  .dual-text-container {
    flex-direction: column;
    padding: 60px 20px;
    gap: 30px;
  }
  
  .text-block h2 {
    font-size: 1.5rem;
  }
  
  .text-block p {
    font-size: 1rem;
  }
  
  .events-table-container {
    padding: 60px 20px;
  }
  
  .events-table th {
    padding: 15px 10px;
    font-size: 1rem;
  }
  
  .events-table td {
    padding: 15px 10px;
    font-size: 0.9rem;
  }
  
  .pagination-container {
    margin-top: 30px;
    gap: 15px;
  }
  
  .pagination {
    gap: 8px;
  }
  
  .pagination-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .page-number {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .page-info {
    font-size: 0.9rem;
  }
  
  .google-map {
    height: 300px;
  }
}
</style>