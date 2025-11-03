<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
// 如果需要import圖片
import taiwanImg from './assets/img/taiwan.png'
import taiwanAdminImg from './assets/img/taiwan-admin.svg'
import taiwanSilhouette from './assets/img/taiwan.png'

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
const selectedCity = ref('桃園市')
const teaGardens = ref([
  {
    id: 1,
    name: '拉拉山茶園',
    lat: 24.7,
    lng: 121.4,
    description: '海拔1500公尺的高山茶園',
    city: '桃園市'
  },
  {
    id: 2,
    name: '復興鄉茶園',
    lat: 24.8,
    lng: 121.3,
    description: '傳統製茶工藝保存區',
    city: '桃園市'
  },
  {
    id: 3,
    name: '大溪茶園',
    lat: 24.9,
    lng: 121.3,
    description: '歷史悠久的茶葉產區',
    city: '桃園市'
  },
  {
    id: 4,
    name: '龍潭茶園',
    lat: 24.9,
    lng: 121.2,
    description: '有機茶葉種植基地',
    city: '桃園市'
  }
])

// 台灣縣市列表及座標範圍（用於 SVG 地圖，座標為百分比 0-100）- 根據實際地理位置調整
const cities = ref([
  // 北部區域 (粉色區域)
  { name: '台北市', x: 75, y: -22, color: '#4a7c59' },
  { name: '新北市', x: 63, y: -20, color: '#5a8c69' },
  { name: '基隆市', x: 90, y: -25, color: '#6b8e6b' },
  { name: '桃園市', x: 50, y: -10, color: '#2c5530' },
  { name: '新竹市', x: 40, y: 0, color: '#4a7c59' },
  { name: '宜蘭縣', x: 85, y: 0, color: '#5a8c69' },
  
  // 中部區域 (橘色區域)
  { name: '苗栗縣', x: 35, y: 10, color: '#6b8e6b' },
  { name: '台中市', x: 30, y: 20, color: '#4a7c59' },
  { name: '彰化縣', x: 20, y: 30, color: '#5a8c69' },
  { name: '南投縣', x: 48, y: 45, color: '#6b8e6b' },
  { name: '雲林縣', x: 15, y: 40, color: '#4a7c59' },
  { name: '嘉義市', x: 15, y: 55, color: '#5a8c69' },
  
  // 東部區域 (淺綠色區域)
  { name: '花蓮縣', x: 74, y: 30, color: '#4a7c59' },
  { name: '台東縣', x: 53, y: 92, color: '#5a8c69' },
  
  // 南部區域 (淺黃色區域)
  { name: '台南市', x: 20, y: 70, color: '#6b8e6b' },
  { name: '高雄市', x: 20, y: 95, color: '#4a7c59' },
  { name: '屏東縣', x: 38, y: 125, color: '#5a8c69' }
])

// 縣市描述資料
const cityDescriptions = {
  '台北市': {
    title: '台北茶鄉',
    subtitle: '山城之上的茶香記憶',
    description1: '台北文山區自古便是包種茶的發源地。山巒環抱、霧氣繚繞，茶樹沐浴於溫潤氣候之中，茶香清雅淡柔，湯色明亮透澈。',
    description2: '行走於貓空山徑，茶香隨風輕拂，茶舍錯落於綠意之間，靜謐而悠然。每一壺文山包種茶，都是城市與自然最和諧的交響。',
    quote: '「霧繞山城香入夢，一盞清心見人情」'
  },
  '新北市': {
    title: '新北茶鄉',
    subtitle: '探索台灣茶葉的故鄉',
    description1: '新北自清代起便開始種茶，是台灣北部茶文化的發源地之一。山巒起伏、氣候涼爽，孕育出香氣馥郁、滋味清新的好茶。坪林、石碇一帶茶園層疊，綠意連綿，成就了文山包種茶的典雅韻味。',
    description2: '漫步山間，霧氣瀰漫，茶香隨風流轉。茶農以專注的手藝守護土地，也傳承著這份屬於北台灣的茶之魂。',
    quote: '「茶香飄逸滿山間，綠意盎然映眼簾」'
  },
  '桃園市': {
    title: '桃園茶鄉',
    subtitle: '細品拉拉山的雲霧甘露',
    description1: '桃園山區自古便以高山茶聞名，拉拉山、復興區一帶雲霧繚繞、氣候涼爽，孕育出香氣清雅、滋味回甘的茶葉。當地茶農秉持傳統製茶工藝，結合現代技術，讓茶香更添層次。',
    description2: '漫步於山徑間，茶園綿延如畫，微風拂過茶樹，清香隨風而來。這裡的每一口茶，都蘊含著土地的溫度與職人的心意。',
    quote: '「雲霧深處藏甘露，一壺桃香沁人心」'
  },
  '新竹市': {
    title: '新竹茶鄉',
    subtitle: '山風輕拂的蜜香韻',
    description1: '新竹北埔與峨眉地區，是東方美人茶的重要產地。茶園坐落山坡，陽光與山風交錯，讓茶葉散發淡淡蜜果香。',
    description2: '茶農順應自然節氣採製，細心揉焙，使茶湯柔和清甜、韻味深長。那一抹香氣，藏著丘陵間的溫柔與歲月的堅定。',
    quote: '「微風拂過葉初展，一壺蜜韻沁心間」'
  },
  '基隆市': {
    title: '基隆茶鄉',
    subtitle: '海霧山嶺的獨特氣息',
    description1: '基隆山區雲霧繚繞、濕潤多雨，孕育出別具風味的在地小葉種茶。海風帶來鹹潤氣息，使茶香中多了一份柔順與清透。',
    description2: '登上暖暖與七堵山巒，海景與茶園相映成趣。品茗之際，彷彿能嚐到山的靜謐與海的呼吸。',
    quote: '「霧起潮聲共入香，一啜山海韻悠長」'
  },
  '宜蘭縣': {
    title: '宜蘭茶鄉',
    subtitle: '蘭陽山水的自然芬芳',
    description1: '宜蘭的冬山、員山地區，以有機與自然農法聞名。茶園依山傍水，晨霧繚繞，使茶香格外清新。',
    description2: '走進茶鄉，處處可見茶樹與山林共生的景致。每一口茶，都彷彿能嘗到山泉的甘甜與海風的氣息。',
    quote: '「霧鎖蘭陽茶初綻，一啜清芳入心間」'
  },
  '苗栗縣': {
    title: '苗栗茶鄉',
    subtitle: '客家山城的樸實韻味',
    description1: '苗栗是東方美人茶的故鄉，茶園坐落在山坡間，蟬鳴與風聲相伴。被小綠葉蟬輕咬過的嫩葉，製成的茶湯蜜香芬芳、入口柔順。',
    description2: '走進這片客家茶鄉，濃濃人情與茶香交織。每一壺茶，都是時間與土地共同釀成的溫度。',
    quote: '「蜜韻潤喉心自暖，山風輕語話人間」'
  },
  '台中市': {
    title: '台中茶鄉',
    subtitle: '谷關山間的清新韻味',
    description1: '台中的東勢、和平一帶山巒起伏、氣候宜人，孕育出香氣柔和、滋味鮮爽的高山茶。這裡的茶園與林木相伴，茶香中帶著自然的氣息。',
    description2: '茶農以傳統工法製茶，注重每個細節，讓一壺好茶蘊含山林的純粹。登高俯瞰，滿山翠綠，茶香隨風流轉。',
    quote: '「山風吹綠滿茶嶺，一壺清香潤人心」'
  },
  '彰化縣': {
    title: '彰化茶鄉',
    subtitle: '山腳茶園的純樸香氣',
    description1: '彰化八卦山脈西麓，日照充足、氣候溫和，是中台灣少見的平原茶區。茶園多以小農經營，專注於自然農法與傳統製茶工藝，香氣樸實、滋味柔和。',
    description2: '走入芬園、社頭山區，茶園與稻田交錯，構成一幅恬靜的鄉村畫。這裡的茶，不張揚，卻在淡淡清香中，傳遞最真實的土地氣息。',
    quote: '「山風輕拂香盈袖，一啜人情最純然」'
  },
  '南投縣': {
    title: '南投茶鄉',
    subtitle: '高山雲霧孕好茶',
    description1: '南投是台灣著名的高山茶故鄉，從鹿谷凍頂到魚池紅茶，皆享譽國內外。海拔高、日夜溫差大，使茶葉香氣濃郁、滋味醇厚。',
    description2: '茶園沿山坡層層疊疊，如詩如畫。走進茶鄉，耳邊傳來揉茶的節奏，鼻尖縈繞著淡淡茶香。每一片茶葉，都是職人與山林對話的結晶。',
    quote: '「霧起山巒翠如畫，一啜南投見匠心」'
  },
  '雲林縣': {
    title: '雲林茶鄉',
    subtitle: '平原裡的暖陽茶香',
    description1: '雲林古坑以綠茶與凍頂烏龍聞名。這裡日照充足、雨量適中，孕育出香氣清亮、口感柔和的茶葉。',
    description2: '茶鄉小路蜿蜒，茶農笑語回盪。每一道焙茶工序，都是對土地最深的致敬。',
    quote: '「陽光灑落茶正熟，香氣悠悠滿山谷」'
  },
  '嘉義市': {
    title: '嘉義茶鄉',
    subtitle: '阿里山雲巔的清香記憶',
    description1: '嘉義的阿里山茶以「香、甘、潤」聞名，茶園多分布於中高海拔地區。陽光與雲霧交錯，造就茶湯金黃透亮、回甘悠長的特質。',
    description2: '登山遠眺，層層茶園與雲海相映成趣；近觀茶農輕捻嫩芽，那份專注與堅持，是對自然最深的敬意。',
    quote: '「雲上飄香阿里山，一盞清心韻千回」'
  },
  '台南市': {
    title: '台南茶鄉',
    subtitle: '古都茶香的溫潤氣息',
    description1: '台南白河與東山地區，以東山碧螺春著稱。茶園環繞在蓮花與果樹之間，花香、果香與茶香交融，滋味甘潤清新。',
    description2: '午後的微風帶著茶香穿過山谷，古樸的茶舍中，一壺熱茶靜靜散發著時間的溫度。',
    quote: '「花影搖曳香滿室，一啜東山意綿長」'
  },
  '高雄市': {
    title: '高雄茶鄉',
    subtitle: '南方山嶺的溫厚茶魂',
    description1: '高雄六龜、甲仙地區山勢高聳，氣候溫潤。茶園錯落山坡，製成的茶湯香氣濃郁、口感厚實，帶著南方土地的熱情與厚度。',
    description2: '茶香隨風流轉，映襯著藍天綠嶺。這裡的每一口茶，都是陽光與汗水交織的結晶。',
    quote: '「南風拂葉香滿懷，一盞濃情暖心懷」'
  },
  '屏東縣': {
    title: '屏東茶鄉',
    subtitle: '山海之間的清新調和',
    description1: '屏東霧台與三地門一帶，海風與山霧交錯，孕育出獨特的原鄉茶香。茶湯清亮爽口，帶著淡淡果韻與花香。',
    description2: '部落茶農以自然方式耕作，保留茶葉最純粹的氣息。每一杯茶，都是山林靈氣的延續。',
    quote: '「山海交融香入夢，一啜南境見真情」'
  },
  '花蓮縣': {
    title: '花蓮茶鄉',
    subtitle: '東岸山谷的清澈韻味',
    description1: '花蓮瑞穗、鳳林地區茶園依山傍谷，山風吹拂，溪水滋潤。茶湯色澤清透，滋味甘甜，宛如山林的呼吸。',
    description2: '在這裡，茶不只是飲品，更是自然的回聲。啜飲之間，彷彿能聽見土地的心跳。',
    quote: '「山谷輕語風作伴，一壺花蓮見真純」'
  },
  '台東縣': {
    title: '台東茶鄉',
    subtitle: '日出之地的溫柔茶韻',
    description1: '台東鹿野與關山地區，以紅烏龍聞名。茶園沐浴晨曦，香氣帶著果甜與蜜香，茶湯琥珀閃耀，回甘悠遠。',
    description2: '在山與海之間，茶香輕飄，風帶著日光的暖意。這一壺紅烏龍，盛滿台東的自在與寧靜。',
    quote: '「旭日映紅茶湯暖，一飲東岸好時光」'
  }
}

// 計算當前選中縣市的描述
const currentCityDescription = computed(() => {
  return cityDescriptions[selectedCity.value] || cityDescriptions['桃園市']
})

// 點擊縣市
const selectCity = (cityName) => {
  selectedCity.value = cityName
  currentLocation.value = cityName
  // 點擊縣市時，切換到該縣市的詳細地圖
  showFullTaiwanMap.value = false
  console.log('選擇縣市:', cityName)
}

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

// 各縣市 Google Maps 嵌入 URL 映射
const cityMapUrls = {
  '台北市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3616.8339104475767!2d121.5877101!3d24.9717649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468002c22bb355f%3A0x3906dbd9519c9f89!2zMTE26Ie65YyX5biC5paH5bGx5Y2A5oyH5Y2X6Lev5LiJ5q61Mzjlt7cxOeiZnw!5e0!3m2!1szh-TW!2stw!4v1762137493565!5m2!1szh-TW!2stw',
  '新北市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.914272249667!2d121.7095509!3d24.934990199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467ff4f4079502d%3A0x20d7e7f9aa47285a!2zMjMy5paw5YyX5biC5Z2q5p6X5Y2A5YyX5a6c6Lev5YWr5q61MjYy6Jmf!5e0!3m2!1szh-TW!2stw!4v1762137728466!5m2!1szh-TW!2stw',
  '桃園市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115871.08064518555!2d121.17593769726561!3d24.830656100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34683cf195555555%3A0x89b9b5e74173dd9f!2z56aP5rqQ6Iy25bug!5e0!3m2!1szh-TW!2stw!4v1762140352785!5m2!1szh-TW!2stw',
  '新竹市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115943.70104827506!2d120.98774337402419!3d24.752936515706732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468493227e1dd09%3A0xead6b87038d4a03d!2z5b6Q6ICA6Imv6Iy25ZyS!5e0!3m2!1szh-TW!2stw!4v1762140278243!5m2!1szh-TW!2stw',
  '基隆市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1849463.3411500254!2d119.31079225625!3d25.127809400000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d521895d54285%3A0xcc3e2d5271d676c0!2z6Iy257Gz55Sf6Iy26KGMLeWfuumahuiMtuiRieihjA!5e0!3m2!1szh-TW!2stw!4v1762140226363!5m2!1szh-TW!2stw',
  '宜蘭縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232173.8568976679!2d121.42946074797926!3d24.598977876887297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34680afda522fc3d%3A0x65cec0b8c7600bcd!2z546J6Jit6Iy25ZyS!5e0!3m2!1szh-TW!2stw!4v1762140847065!5m2!1szh-TW!2stw',
  '苗栗縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.7511683105954!2d120.77416339999998!3d24.459417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34690713912f4a0d%3A0x416c3b1694d9e172!2z5Y-w54Gj6L6y5p6XIOmKhemRvOiMtuW7oA!5e0!3m2!1szh-TW!2stw!4v1762137805805!5m2!1szh-TW!2stw',
  '台中市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.894767141052!2d121.24298002963869!3d24.24545907029677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468f34ce037528d%3A0x189eb8b21ea5bdca!2z562R5reo6Iy26IuRIFNlcmVuaXR5IFRlYSDvvIjpoJDntITliLbvvIk!5e0!3m2!1szh-TW!2stw!4v1762137954834!5m2!1szh-TW!2stw',
  '彰化縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930920.6100371872!2d120.37946798329428!3d24.297377636769756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3469397fa8540e59%3A0x4009e261ae6d67f9!2z5qKF6Iqx6bm_6Iy26KGM!5e0!3m2!1szh-TW!2stw!4v1762140495371!5m2!1szh-TW!2stw',
  '南投縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116706.28744914358!2d120.7831023972656!3d23.9225227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468d79b7e7b0c2f%3A0x3066282f2c8c4381!2zSHVnb3N1beWSjOiPk-ajruael--9nOe0heiMtuingOWFieiMtuW7oC_ntIXojLblsIjploDlupcv5LiL5Y2I6Iy2L0RJWeiqsueoiy_nlbbml6Xlj6_ku6XpoJDntIRESVnvvIzoq4vlhYjkvobpm7vmiJbmmK_oqaLllY_lrpjmlrlsaW5lfg!5e0!3m2!1szh-TW!2stw!4v1762140684329!5m2!1szh-TW!2stw',
  '雲林縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116924.69892709839!2d120.57746324956261!3d23.679646821187557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ec54c9c7443fb%3A0x4770e8d5e1715fc8!2z6Zuy5ba65LmL5LiY!5e0!3m2!1szh-TW!2stw!4v1762140621994!5m2!1szh-TW!2stw',
  '嘉義市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d466823.6634910882!2d120.53585841425705!3d23.92293391811733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ee817ee56be05%3A0x8fc9680b68ac84e8!2z6Zi_6YeM5bGx6KeA5YWJ6Iy25ZyS77y75b6h57Wx6IyX5ZyS77y9WXUgVHVuZyBNaW5nIFl1YW4!5e0!3m2!1szh-TW!2stw!4v1762140763994!5m2!1szh-TW!2stw',
  '台南市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235033.1184759658!2d119.87680959453122!3d23.0093574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e763f6353ac73%3A0x68f99c941da622fe!2z5Y-w5Y2X5Y2X5bGx6Iy25ZyS772c5Y-w54Gj6Iy26JGJ5om555m86Zu25ZSu44CB6Iy26JGJ5a6i6KO95YyWT0VN44CB6Iy25YyF5Luj5bel44CB5Ya35rOh6Iy244CB6Iqx6Iy26Iy25YyF44CB56qo6KO96Iy25Yqg5bel54OY54SZ!5e0!3m2!1szh-TW!2stw!4v1762138067653!5m2!1szh-TW!2stw',
  '高雄市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8701105927153!2d120.66330629999999!3d23.0285409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e5b561fbfdac7%3A0xcf7802ede7df0386!2z5qyj5ZyS6KO96Iy2!5e0!3m2!1szh-TW!2stw!4v1762137879230!5m2!1szh-TW!2stw',
  '屏東縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58952.30656732456!2d120.46477054863277!3d22.55967819999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ee1b7e3ea699933%3A0xd48fcdc1af1886cf!2z5paf6Iy257ej6Iy25qWtIOWPquaMkeWQhOiMtuWNgOesrOS4gOWQjeeahOWlveiMtg!5e0!3m2!1szh-TW!2stw!4v1762138201712!5m2!1szh-TW!2stw',
  '花蓮縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d943236.9167210467!2d119.84656468982983!3d22.55967649746449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346f468012aa3397%3A0xa08b788412382f62!2z5ZiJ6IyX6Iy25ZyS!5e0!3m2!1szh-TW!2stw!4v1762138251651!5m2!1szh-TW!2stw',
  '台東縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117659.68403034004!2d121.03974523137491!3d22.844478953709004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346fa506902e17a7%3A0xd428d83156951a1a!2z56Kn6Ji_5ZyS6IyX6Iy25Z2KIEJpbHVveXVhbiBSZWQgT29sb25nIFRlYSB8IOe0heeDj-m-jeWwiOizow!5e0!3m2!1szh-TW!2stw!4v1762138287100!5m2!1szh-TW!2stw'
}

// 預設的全台地圖 URL（載入時顯示）
const defaultTaiwanMapUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1575047.3017064694!2d121.29109931970946!3d23.52115776149224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-TW!2stw!4v1762141297654!5m2!1szh-TW!2stw'

// 是否顯示全台地圖
const showFullTaiwanMap = ref(true)

// 計算當前選中縣市的地圖 URL
const currentMapUrl = computed(() => {
  // 如果顯示全台地圖，返回全台地圖 URL
  if (showFullTaiwanMap.value) {
    return defaultTaiwanMapUrl
  }
  // 否則返回選中縣市的地圖
  return cityMapUrls[selectedCity.value] || cityMapUrls['桃園市']
})


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
        <!-- 台灣縣市地圖區塊（左上角） -->
        <div class="map-container">
            <div class="map-header">
              <h3>選擇縣市</h3>
              <p class="selected-city">目前選擇：<span>{{ selectedCity }}</span></p>
            </div>
            <div class="taiwan-map-wrapper">
              <div class="map-background-pattern"></div>
              <div class="taiwan-silhouette-container">
                <!-- 台灣本島剪影圖片 -->
                <img :src="taiwanSilhouette" alt="台灣本島" class="taiwan-silhouette" />
                
                <!-- 縣市標記覆蓋層 -->
                <svg class="city-markers-overlay" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="cityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#4a7c59;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#2c5530;stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.3"/>
                    </filter>
                  </defs>
                  
                  <!-- 縣市區域標記 -->
                  <g v-for="city in cities" :key="city.name" class="city-marker-group">
                    <!-- 主標記圓圈 -->
                    <circle 
                      :cx="city.x" 
                      :cy="city.y" 
                      :r="city.name === selectedCity ? 2 : 1.5"
                      :fill="city.color"
                      stroke="#ffffff"
                      stroke-width="0.3"
                      class="city-area"
                      @click="selectCity(city.name)"
                      style="cursor: pointer;"
                    />
                    
                    <!-- 內部小圓點 -->
                    <circle 
                      :cx="city.x" 
                      :cy="city.y" 
                      :r="0.6"
                      fill="#ffffff"
                      opacity="0.8"
                      class="city-dot"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div class="city-list">
              <button 
                v-for="city in cities" 
                :key="city.name"
                class="city-button"
                :class="{ 'active': city.name === selectedCity }"
                @click="selectCity(city.name)"
              >
                {{ city.name }}
              </button>
            </div>
          </div>
          
        <!-- 右側內容區 -->
        <div class="right-content">
          <div class="text-content">
            <h1>{{ currentCityDescription.title }}</h1>
            <p class="subtitle">{{ currentCityDescription.subtitle }}</p>
            <p>{{ currentCityDescription.description1 }}</p>
            <p>{{ currentCityDescription.description2 }}</p>
            <p>{{ currentCityDescription.quote }}</p>
          </div>
          
          <!-- Google Map 區塊 -->
          <div class="google-map-container">
            <div class="google-map-header">
              <h3>地圖導覽</h3>
              <p class="map-location">顯示區域：{{ selectedCity }}</p>
            </div>
            <div class="google-map">
              <iframe 
                :src="currentMapUrl" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
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
  padding: 60px 40px;
  background: #fafafa;
  min-height: 100vh;
}

.unified-content {
  display: flex;
  align-items: stretch;
  gap: 40px;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.right-content {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: stretch;
  min-height: 0;
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
  flex: 1 1 50%;
  min-height: 0;
  text-align: left;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.text-content h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  position: relative;
  line-height: 1.1;
}

.text-content .subtitle {
  font-size: 1.5rem;
  color: #666666;
  margin-bottom: 2rem;
  font-weight: 400;
  opacity: 0.8;
  letter-spacing: 0.01em;
}

.text-content p {
  font-size: 1rem;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 1.8rem;
  position: relative;
  padding-left: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
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
  font-size: 36px;
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
  color: #1a1a1a;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.text-block p {
  font-size: 1rem;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 20px;
  text-align: left;
}

/* 活動表格樣式 */
.events-table-container {
  width: 100%;
  background-color: #fafafa;
  padding: 60px 40px;
}


.table-wrapper {
  max-width: none;
  margin: 0;
  overflow-x: auto;
  min-height: 650px;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  min-height: 600px;
  table-layout: fixed;
}

.events-table th {
  background-color: #fafafa;
  color: #1a1a1a;
  padding: 20px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  height: 60px;
  vertical-align: middle;
}

.events-table th:nth-child(1) {
  width: 40%;
}

.events-table th:nth-child(2) {
  width: 35%;
}

.events-table th:nth-child(3) {
  width: 25%;
}

.events-table td {
  padding: 18px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 0.95rem;
  color: #4a4a4a;
  height: 65px;
  vertical-align: middle;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.events-table tbody tr {
  height: 65px;
  display: table-row;
  transition: background-color 0.2s ease;
}

.events-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.events-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.events-table tbody tr:hover {
  background-color: #f5f5f5;
}

.events-table tbody tr:last-child td {
  border-bottom: none;
}

.events-table td:first-child {
  font-weight: 500;
  color: #1a1a1a;
}

.events-table td:nth-child(2) {
  color: #666666;
}

.events-table td:nth-child(3) {
  color: #666666;
  font-weight: 400;
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
  padding: 10px 18px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #1a1a1a;
  color: #ffffff;
  border-color: #1a1a1a;
}

.pagination-btn:disabled {
  background-color: #fafafa;
  border-color: rgba(0, 0, 0, 0.06);
  color: #999999;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 80px;
  height: 45px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #4a4a4a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  background-color: #f5f5f5;
  border-color: rgba(0, 0, 0, 0.15);
  color: #1a1a1a;
}

.page-number.active {
  background-color: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.page-info {
  color: #666666;
  font-size: 1.4rem;
  font-weight: 400;
}

/* 地圖樣式 */
.map-container {
  flex: 0 0 40%;
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
}

.map-header {
  margin-bottom: 24px;
  text-align: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.map-header h3 {
  color: #1a1a1a;
  font-size: 1.5rem;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.selected-city {
  color: #666666;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 400;
}

.selected-city span {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1rem;
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: 8px;
  display: inline-block;
}

.taiwan-map-wrapper {
  width: 100%;
  flex: 1;
  min-height: 600px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}


.taiwan-silhouette-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.taiwan-silhouette {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  image-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.city-markers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.city-markers-overlay .city-area {
  pointer-events: all;
}

.taiwan-map {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  position: relative;
  z-index: 1;
}

.taiwan-mainland {
  transition: all 0.4s ease;
}

.city-marker-group {
  transition: opacity 0.2s ease;
}

.city-area {
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.city-area:hover {
  opacity: 0.8;
}

.city-dot {
  pointer-events: none;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: auto;
  padding-top: 15px;
}

.city-button {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #4a4a4a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 85px;
  position: relative;
  overflow: hidden;
}


.city-button:hover {
  background: #f5f5f5;
  border-color: rgba(0, 0, 0, 0.15);
  color: #1a1a1a;
}

.city-button.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
  font-weight: 600;
}

/* Google Map 區塊樣式 */
.google-map-container {
  width: 100%;
  flex: 1 1 50%;
  min-height: 0;
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.google-map-header {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.google-map-header h3 {
  color: #1a1a1a;
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.map-location {
  color: #666666;
  font-size: 24px;
  margin: 0;
  font-weight: 400;
}

.map-location span {
  color: #1a1a1a;
  font-weight: 600;
}

.google-map {
  width: 100%;
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
  background: #fafafa;
}

.google-map iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 15px;
}


@media (max-width: 768px) {
  .main-container {
    padding: 40px 20px;
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .unified-content {
    flex-direction: column;
    padding: 20px 15px;
    gap: 20px;
    overflow-x: hidden;
  }
  
  .map-container {
    width: 100%;
    max-width: 100%;
    padding: 15px;
  }
  
  .right-content {
    width: 100%;
    overflow-x: hidden;
    gap: 20px;
  }
  
  .text-content {
    text-align: center;
  }
  
  .text-content h1 {
    font-size: 2.5rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .text-content .subtitle {
    font-size: 1.8rem;
  }
  
  .text-content p {
    font-size: 1.4rem;
    line-height: 1.6;
  }
  
  .text-content p::before {
    font-size: 1.2rem;
  }
  
  .text-content h1::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .taiwan-image {
    width: 80vw;
  }
  
  
  .map-header h3 {
    font-size: 1.8rem;
  }
  
  .selected-city {
    font-size: 1.2rem;
  }
  
  .selected-city span {
    font-size: 1.3rem;
    padding: 3px 10px;
  }
  
  .taiwan-map-wrapper {
    min-height: 250px;
    max-height: 300px;
    padding: 10px;
    border-radius: 15px;
  }
  
  .taiwan-map {
    max-width: 100%;
  }
  
  .city-button {
    padding: 6px 12px;
    font-size: 0.9rem;
    min-width: 60px;
    border-radius: 15px;
  }
  
  .city-list {
    gap: 6px;
  }
  
  .carousel-slide {
    height: 400px;
  }
  
  .carousel-btn {
    width: 50px;
    height: 50px;
    font-size: 30px;
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
    font-size: 1.8rem;
  }
  
  .text-block p {
    font-size: 1.2rem;
  }
  
  .events-table-container {
    padding: 40px 15px;
    overflow-x: auto;
  }
  
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .events-table th {
    padding: 15px 10px;
    font-size: 1.1rem;
  }
  
  .events-table td {
    padding: 15px 10px;
    font-size: 1rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
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
    font-size: 1rem;
  }
  
  .page-number {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
  
  .page-info {
    font-size: 1rem;
  }
  
  .map-container {
    width: 100%;
    min-width: unset;
  }
  
  .taiwan-map-wrapper {
    height: 300px;
    padding: 15px;
  }
  
  .google-map-container {
    margin-top: 20px;
    padding: 20px;
  }
  
  .google-map-header h3 {
    font-size: 24px;
  }
  
  .map-location {
    font-size: 18px;
  }
  
  .google-map {
    height: 300px;
  }
  
}
</style>