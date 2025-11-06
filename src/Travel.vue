<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
// 如果需要import圖片
import taiwanImg from './assets/img/taiwan.png'
import taiwanAdminImg from './assets/img/taiwan-admin.svg'
import taiwanSilhouette from './assets/img/taiwan.png'

// 輪播相關
const currentSlide = ref(0)
const slides = ref([
  { src: taiwanImg, alt: '台灣茶葉', title: '茶旅亮點一', description: '探索山海之間的茶香路徑。', mapUrl: '' },
  { src: taiwanAdminImg, alt: '台灣茶葉管理', title: '茶旅亮點二', description: '走入在地茶文化，品味風土。', mapUrl: '' },
  { src: taiwanSilhouette, alt: '台灣本島', title: '茶旅亮點三', description: '踏查茶鄉與人文風景的交會。', mapUrl: '' }
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
  // 再點一次同一城市 -> 取消選取、回到全台地圖並收合所有口風琴
  if (selectedCity.value === cityName) {
    selectedCity.value = null
    currentLocation.value = null
    showFullTaiwanMap.value = true
    overrideMapUrl.value = null
    expandOnlyCity(null)
    console.log('取消選擇縣市:', cityName)
    return
  }

  selectedCity.value = cityName
  currentLocation.value = cityName
  showFullTaiwanMap.value = false
  overrideMapUrl.value = null
  expandedCity.value = cityName
  expandOnlyCity(cityName)
  rebuildSlidesFromCity(cityName)
  console.log('選擇縣市:', cityName)
}

// 地名與縣市的映射關係（用於活動點擊）
const locationToCityMap = {
  '坪林': '新北市',
  '石碇': '新北市',
  '茶葉博物館': '新北市',
  '台灣茶葉博物館': '新北市',
  '坪林茶業博物館': '新北市',
  '台灣茶葉改良場': '桃園市',
  '台灣茶業改良場': '桃園市',
  '中華茶藝聯合促進會': '台北市',
  '台灣茶協會': '台中市',
  '新北市觀光局': '新北市',
  '台灣茶葉進出口公會': '台北市',
  '台灣生態攝影協會': '台北市',
  '阿里山': '嘉義縣',
  '南投': '南投縣',
  '日月潭': '南投縣',
  '新竹': '新竹市',
  '花蓮': '花蓮縣',
  '台北': '台北市',
  '鹿谷': '南投縣',
  '文山': '台北市',
  '凍頂': '南投縣',
  '梨山': '台中市',
  '台中': '台中市',
  '嘉義': '嘉義市',
  '高雄': '高雄市',
  '台南': '台南市',
  '台東': '台東縣',
  '鹿野': '台東縣',
  '關山': '台東縣',
  '桃園': '桃園市',
  '苗栗': '苗栗縣',
  '彰化': '彰化縣',
  '雲林': '雲林縣',
  '屏東': '屏東縣',
  '基隆': '基隆市',
  '宜蘭': '宜蘭縣'
}

// 從活動標題或主辦單位中提取地名
const extractLocationFromEvent = (event) => {
  // 先從標題中尋找地名
  for (const location in locationToCityMap) {
    if (event.title.includes(location)) {
      return location
    }
  }
  // 如果標題中沒有，從主辦單位中尋找
  for (const location in locationToCityMap) {
    if (event.organizer.includes(location)) {
      return location
    }
  }
  return null
}

// 活動是否含有可辨識的地名
const eventHasLocation = (event) => {
  return !!extractLocationFromEvent(event)
}

// 頁面列表（1-based），不再依賴地名偵測，全部頁碼都可導覽
const pagesWithLocations = computed(() => {
  return Array.from({ length: eventsData.value.length }, (_, idx) => idx + 1)
})

// 口風琴可見的城市：選取時只顯示該城市；未選取時顯示全部
const visibleCities = computed(() => {
  if (selectedCity.value) {
    return cities.value.filter(c => c.name === selectedCity.value)
  }
  return cities.value
})

// 處理活動點擊事件
const handleEventClick = (event) => {
  // 回復與上方地圖的縣市連動，但若活動提供自訂 URL 則優先使用
  const location = extractLocationFromEvent(event)
  const city = location ? locationToCityMap[location] : null
  showFullTaiwanMap.value = false
  if (city) {
    selectedCity.value = city
    currentLocation.value = city
    expandedCity.value = city
    rebuildSlidesFromCity(city)
  }
  const directUrl = (event && (event.mapUrl || event.url)) || null
  if (directUrl && typeof directUrl === 'string') {
    overrideMapUrl.value = directUrl
  } else {
    // 沒有直接 URL，依序嘗試：地點鍵、主辦單位、標題
    const candidateKeys = [location, event?.organizer, event?.title].filter(Boolean)
    const matchedKey = candidateKeys.find(k => Object.prototype.hasOwnProperty.call(cityMapUrls, k))
    overrideMapUrl.value = matchedKey ? cityMapUrls[matchedKey] : null
    // 若仍無覆蓋 URL，則使用所選縣市的地圖
  }
  console.log(`點擊活動「${event.title}」→ city: ${city || '無'}, map:`, overrideMapUrl.value || `(縣市地圖：${selectedCity.value})`)
  scrollToMap()
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
    { title: '茶與攝影美學展', organizer: '高雄美術館 × 茶旅品牌合作', date: '114年12月20日－115年1月5日' },
    { title: '桃園茶香探索日｜山城與埤塘之旅', organizer: '桃園市文化觀光局', date: '114年12月21日' },
    { title: '基隆港灣茶旅日｜潮風裡的暖香', organizer: '基隆市文化局', date: '114年12月22日' },
    { title: '宜蘭冬山茶園散步日', organizer: '宜蘭縣觀光旅遊處', date: '114年12月28日' },
    { title: '苗栗茶香小鎮導覽｜銅鑼一日行', organizer: '苗栗縣文化觀光局', date: '114年12月29日' },
    { title: '彰化八卦山茶旅體驗日', organizer: '彰化縣文化局', date: '115年1月4日' },
    { title: '雲林古坑茶香慢行', organizer: '雲林縣觀光處', date: '115年1月5日' },
    { title: '嘉義市茶文化散步日｜山海交融的香氣', organizer: '嘉義市文化觀光處', date: '115年1月11日' },
    { title: '台南茶風故事日｜古都香旅', organizer: '台南市文化觀光局', date: '115年1月12日' },
    { title: '屏東山林茶徑行', organizer: '屏東縣觀光傳播處', date: '115年1月18日' },
    { title: '台東茶山慢遊日', organizer: '台東縣文化觀光處', date: '115年1月19日' }
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

// 將第5頁活動合併到第4頁，並移除第5頁
if (eventsData.value[4] && eventsData.value[3]) {
  eventsData.value[3].push(...eventsData.value[4])
  eventsData.value.splice(4, 1)
}

// 依據實際頁數更新總頁數
totalPages.value = eventsData.value.length

// 計算當前頁面顯示的活動（不再依賴地名過濾）
const currentPageEvents = computed(() => {
  return eventsData.value[currentPage.value - 1] || []
})

let slideInterval = null

const applySlideEffects = () => {
  const slide = slides.value[currentSlide.value]
  if (slide && slide.mapUrl && typeof slide.mapUrl === 'string' && slide.mapUrl.trim().length > 0) {
    showFullTaiwanMap.value = false
    overrideMapUrl.value = slide.mapUrl
  } else {
    // 若輪播未提供專屬 URL，維持目前狀態（由城市或活動邏輯決定）
    // 不強制覆蓋 overrideMapUrl
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  applySlideEffects()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
  applySlideEffects()
}

const goToSlide = (index) => {
  currentSlide.value = index
  applySlideEffects()
}

const goToPage = (page) => {
  const list = pagesWithLocations.value
  if (list.includes(page)) {
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
  '嘉義縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d466823.6634910882!2d120.53585841425705!3d23.92293391811733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ee817ee56be05%3A0x8fc9680b68ac84e8!2z6Zi_6YeM5bGx6KeA5YWJ6Iy25ZyS77y75b6h57Wx6IyX5ZyS77y9WXUgVHVuZyBNaW5nIFl1YW4!5e0!3m2!1szh-TW!2stw!4v1762140763994!5m2!1szh-TW!2stw',
  '台南市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235033.1184759658!2d119.87680959453122!3d23.0093574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e763f6353ac73%3A0x68f99c941da622fe!2z5Y-w5Y2X5Y2X5bGx6Iy25ZyS772c5Y-w54Gj6Iy26JGJ5om555m86Zu25ZSu44CB6Iy26JGJ5a6i6KO95YyWT0VN44CB6Iy25YyF5Luj5bel44CB5Ya35rOh6Iy244CB6Iqx6Iy26Iy25YyF44CB56qo6KO96Iy25Yqg5bel54OY54SZ!5e0!3m2!1szh-TW!2stw!4v1762138067653!5m2!1szh-TW!2stw',
  '高雄市': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8701105927153!2d120.66330629999999!3d23.0285409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e5b561fbfdac7%3A0xcf7802ede7df0386!2z5qyj5ZyS6KO96Iy2!5e0!3m2!1szh-TW!2stw!4v1762137879230!5m2!1szh-TW!2stw',
  '屏東縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58952.30656732456!2d120.46477054863277!3d22.55967819999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ee1b7e3ea699933%3A0xd48fcdc1af1886cf!2z5paf6Iy257ej6Iy25qWtIOWPquaMkeWQhOiMtuWNgOesrOS4gOWQjeeahOWlveiMtg!5e0!3m2!1szh-TW!2stw!4v1762138201712!5m2!1szh-TW!2stw',
  '花蓮縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d943236.9167210467!2d119.84656468982983!3d22.55967649746449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346f468012aa3397%3A0xa08b788412382f62!2z5ZiJ6IyX6Iy25ZyS!5e0!3m2!1szh-TW!2stw!4v1762138251651!5m2!1szh-TW!2stw',
  '台東縣': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117659.68403034004!2d121.03974523137491!3d22.844478953709004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346fa506902e17a7%3A0xd428d83156951a1a!2z56Kn6Ji_5ZyS6IyX6Iy25Z2KIEJpbHVveXVhbiBSZWQgT29sb25nIFRlYSB8IOe0heeDj-m-jeWwiOizow!5e0!3m2!1szh-TW!2stw!4v1762138287100!5m2!1szh-TW!2stw',
  '嘉義縣文化觀光局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1829.9076183774134!2d120.2938462720605!3d23.467128216943582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e9bd25d70bbef%3A0xfe2bad76890c49bb!2z5ZiJ576p57ij5paH5YyW6KeA5YWJ5bGA!5e0!3m2!1szh-TW!2stw!4v1762325589482!5m2!1szh-TW!2stw',
  '坪林茶業博物館' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4302.469256675841!2d121.71091428562141!3d24.934421263475194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467f8bbffffffff%3A0x6f4e3e6cae375765!2z5paw5YyX5biC5Z2q5p6X6Iy25qWt5Y2a54mp6aSo!5e0!3m2!1szh-TW!2stw!4v1762325697881!5m2!1szh-TW!2stw',
  '台灣茶協會' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1287.5071466610837!2d120.67933283690732!3d24.114850542306932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693ce4b18f73e3%3A0x470fdb0a7a5577ca!2z5Y-w54Gj6Iy25Y2U5pyD!5e0!3m2!1szh-TW!2stw!4v1762326096713!5m2!1szh-TW!2stw',
  '南投觀光工廠協會' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1532.8250610395974!2d120.95751841393913!3d23.971296018900443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468d9a73b362701%3A0x3852e1b48169ce58!2z5Y2X5oqV57ij6KeA5YWJ5Y2U5pyD!5e0!3m2!1szh-TW!2stw!4v1762326205322!5m2!1szh-TW!2stw',
  '日月潭紅茶推廣中心' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1532.9112411011367!2d120.95919520232529!3d23.964049969648702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468d9a36537a0b7%3A0xc753c398345edd2a!2z5pel5pyI5r2t57SF6Iy25o6o5buj56uZ!5e0!3m2!1szh-TW!2stw!4v1762326268193!5m2!1szh-TW!2stw',
  '新竹縣茶業改良場' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6091.74488615223!2d121.17233726736563!3d24.789522773180224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34683ecc409160c3%3A0x67fb251775d33949!2z5Y-w54Gj57SF6Iy26IKh5Lu95pyJ6ZmQ5YWs5Y-4KOiHuue0heiMtualreaWh-WMlumkqCk!5e0!3m2!1szh-TW!2stw!4v1762326380082!5m2!1szh-TW!2stw',
  '台北文創茶學苑' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14458.975215206261!2d121.5530835401308!3d25.04276707247682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abbf10d06711%3A0x18365043482713a4!2z6Ie65YyX5paH5Ym1!5e0!3m2!1szh-TW!2stw!4v1762326655041!5m2!1szh-TW!2stw',
  '高雄美術館 × 茶旅品牌合作' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2603.5095982378552!2d120.28570610603073!3d22.656823980586136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e0451f1321009%3A0x4f90af4e670c3d1f!2z6auY6ZuE5biC56uL576O6KGT6aSo!5e0!3m2!1szh-TW!2stw!4v1762326729193!5m2!1szh-TW!2stw',
  '桃園市文化觀光局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27306.112180435026!2d121.28496808888265!3d24.992394202980986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34681f04c9092637%3A0xcb74e6d48c12504c!2z5qGD5ZyS5biC5pS_5bqc6KeA5YWJ5peF6YGK5bGA!5e0!3m2!1szh-TW!2stw!4v1762326841739!5m2!1szh-TW!2stw',
  '基隆市文化局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1806.0684882521832!2d121.74315011003948!3d25.131059521789286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x140dc519d812c737%3A0x865faf11fffda399!2z5Z-66ZqG5biC5paH5YyW6KeA5YWJ5bGA!5e0!3m2!1szh-TW!2stw!4v1762326890384!5m2!1szh-TW!2stw',
  '宜蘭縣觀光旅遊處' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28991.698256184856!2d121.7469547335847!3d24.72817514047716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467e4fdd52c1533%3A0x9c30bcc4e3c07c90!2z5a6c6Jit57ij5pS_5bqc5bel5ZWG5peF6YGK6JmV!5e0!3m2!1szh-TW!2stw!4v1762326955537!5m2!1szh-TW!2stw',
  '宜蘭縣文化觀光局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7246.699911142146!2d121.74151018040179!3d24.749187628937925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467e4ea61eda5cf%3A0xb2b96f2ac7d6ac23!2z5a6c6Jit57ij5pS_5bqc5paH5YyW5bGA!5e0!3m2!1szh-TW!2stw!4v1762327102480!5m2!1szh-TW!2stw',
  '苗栗縣文化觀光局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2565.8522256320107!2d120.81997726434112!3d24.566304620627005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3469ac0ebb5816cd%3A0x4d0e3efe222892c7!2z6IuX5qCX57ij5pS_5bqc5paH5YyW6KeA5YWJ5bGA!5e0!3m2!1szh-TW!2stw!4v1762327321369!5m2!1szh-TW!2stw',
  '彰化縣文化局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2165.9479656935773!2d120.54540834255161!3d24.077720148943296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346938917d791dd3%3A0xeee27e3a30cc3095!2z5b2w5YyW57ij5paH5YyW5bGA!5e0!3m2!1szh-TW!2stw!4v1762327413825!5m2!1szh-TW!2stw',
  '雲林縣觀光處' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.376229187265!2d120.52348579077163!3d23.69577275560827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346eb7e3208b19d9%3A0xa797cfc65236e4a1!2z6Zuy5p6X57ij5pS_5bqc5paH5YyW6KeA5YWJ6JmV!5e0!3m2!1szh-TW!2stw!4v1762327568032!5m2!1szh-TW!2stw',
  '嘉義市文化觀光處' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5174.9956995292005!2d120.45007464592776!3d23.486618472651546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e95cc79576715%3A0xf0d618685625f5ed!2z5ZiJ576p5biC5pS_5bqc5paH5YyW5bGA!5e0!3m2!1szh-TW!2stw!4v1762328081033!5m2!1szh-TW!2stw',
  '台南市文化觀光局' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.1085794780074!2d120.31176204239904!3d23.311818949678095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e85c4a556d0eb%3A0x4fa475028598da12!2z6Ie65Y2X5biC5pS_5bqc6KeA5YWJ5peF6YGK5bGA!5e0!3m2!1szh-TW!2stw!4v1762328146424!5m2!1szh-TW!2stw',
  '屏東縣觀光傳播處' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34024.93555746366!2d120.47711663444886!3d22.682547793211477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e1795d53ff1a9%3A0x857799e358c2f4fe!2z5bGP5p2x57ij5pS_5bqc5paH5YyW6JmV!5e0!3m2!1szh-TW!2stw!4v1762328206584!5m2!1szh-TW!2stw',
  '台東縣文化觀光處' : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.2375365756243!2d121.14320225963709!3d22.756564388222266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346fb914fbfe908b%3A0x3b3661e87984cfc1!2z5Y-w5p2x57ij5pS_5bqc5paH5YyW6JmV!5e0!3m2!1szh-TW!2stw!4v1762328282160!5m2!1szh-TW!2stw',
  







}

// 預設的全台地圖 URL（載入時顯示）
const defaultTaiwanMapUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1575047.3017064694!2d121.29109931970946!3d23.52115776149224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-TW!2stw!4v1762141297654!5m2!1szh-TW!2stw'

// 是否顯示全台地圖
const showFullTaiwanMap = ref(true)

// 地圖區塊元素，用於點擊活動後自動捲動到地圖
const mapSectionRef = ref(null)
// 事件點擊時的自訂地圖覆蓋 URL（優先於縣市地圖）
const overrideMapUrl = ref(null)

// 城市 -> 三個店家的資料（請依需求填入實際連結與描述）
const cityStores = ref({
  '基隆市': [
    { name: '崆茶屋 Teahouse K',feature: '以現泡高山茶為主打，結合日式空間設計。',  description: '崆茶屋位於基隆塔上方的山脊稜線，以日間茶席、夜間小酒吧的雙模式營運，讓遊客在觀港視野下品味台灣單品茶。空間以原石、木質與在地植物塑造山城氛圍，茶師透過手沖與聞香引導，介紹茶湯的層次、產地風土與沖泡重點。建議白天登高看港景、傍晚接續黃昏與夜色，體驗城市、海風與茶香交織的節奏；也可串連正濱漁港、潮境公園形成一日路線。適合想以設計空間認識基隆、同時享受精緻茶席的旅人。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.106904482948!2d121.7451946063434!3d25.1320763594365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d4f6ed2135c25%3A0x248104cb205e4f8f!2z5bSG5pu45bGLIEhvdXNlIEs!5e0!3m2!1szh-TW!2stw!4v1762332531299!5m2!1szh-TW!2stw' },
    { name: '暖東峽谷 × 大菁休閒農場', feature: '花草茶、在地香草茶飲。' ,description: '暖東峽谷以溪谷地形、岩洞與滑瀑著稱，沿線林蔭步道涼爽宜人。鄰近的大菁休閒農場以藍染聞名，也提供香草與花草茶體驗：從園區採摘香草、曬乾到沖泡，學習芳香植物入茶的搭配。建議早上健行親水、午後進行藍染與手作花草茶，結合自然生態與手作體驗。春夏季節綠意盎然，秋冬雲霧繚繞，都是暢遊的好時機。適合親子家庭與戶外愛好者。。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.906690730148!2d121.75474427607952!3d25.071151536793373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d51ba35bbd555%3A0x91bb348af64a7523!2zW-Wkp-iPgeS8kemWkui-suWgtF0g6JeN5p-T6auU6amXIOaVmeWtuCDvvIjpoJDntITliLbvvIk!5e0!3m2!1szh-TW!2stw!4v1762332615095!5m2!1szh-TW!2stw' },
    { name: '和平島地質公園山海茶席',feature: '海風主題調飲茶、在地聯名茶' , description: '以「山海茶席」為主題的不定期快閃活動，結合和平島奇岩地景與在地茶品牌，於日落時分舉辦露天茶席。茶師以海風、鹽霧與礦物意象設計茶款，帶領參與者從聞香、啜飲到與地景對話。建議提前關注活動公告並預約報名，行程可搭配公園步道、潮境觀察與島嶼人文解說。即使無活動時，也能自帶茶具在觀景平台享受海風與茶香，是體驗「一口山海」的絕佳場域。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.2287712011125!2d121.76189147594873!3d25.161752099403063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d4ee2add3d0bf%3A0xb2a6e84801d59973!2z5ZKM5bmz5bO25Zyw6LOq5YWs5ZySIEhlcGluZyBJc2xhbmQgR2VvUGFyaw!5e0!3m2!1szh-TW!2stw!4v1762332743544!5m2!1szh-TW!2stw' }
  ],
  '台北市': [
    { name: '貓空', feature: '文山包種茶、木柵鐵觀音' , description: '貓空位於台北市文山區的山腰地帶，是北台灣最具代表性的茶鄉之一。從清代即以包種茶聞名，因山區霧氣充足、氣候涼爽，使茶葉香氣柔和、滋味清甜。遊客可搭乘貓空纜車直達山頂，沿途俯瞰城市與茶園交織的美景。抵達後，可漫步於茶園步道、造訪景觀茶館，體驗採茶、揉茶、泡茶的樂趣。夜晚時分，萬家燈火映照在山谷間，一杯鐵觀音香氣氤氳，成為城市與自然交融的最佳注解。這裡不僅是泡茶賞景的好去處，更是了解台北茶文化與休閒生活的經典代表。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28932.035206056527!2d121.55128413205847!3d24.982971078081462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa8389128349%3A0x211736b3fb76a84b!2zMTE26Ie65YyX5biC5paH5bGx5Y2A6LKT56m6!5e0!3m2!1szh-TW!2stw!4v1762332802968!5m2!1szh-TW!2stw' },
    { name: '新芳春茶行（大稻埕百年茶館）', feature: '包種茶、紅烏龍、台茶18號' ,description: '新芳春茶行創立於1934年，是見證大稻埕繁華的老字號茶商建築。紅磚外牆、木造閣樓與古樸櫃檯仍保留昔日風貌，館內展示早期茶葉烘焙器具與外銷茶箱，重現當年茶葉貿易的盛況。參觀者可透過導覽了解台灣茶出口的歷史，並於品茗區細細體驗包種茶的清香與紅烏龍的蜜韻。周邊巷弄仍散發舊時茶鄉氣息，是認識台北茶文化根源的絕佳起點。午後陽光灑落木窗，飄著茶香與故事，是最台北味的午後時光。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.321623491624!2d121.5099733760792!3d25.057085937360196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a914e01c5ebb%3A0xe701e9e4261ba3c5!2z5paw6Iqz5pil6Iy26KGM!5e0!3m2!1szh-TW!2stw!4v1762332842352!5m2!1szh-TW!2stw' },
    { name: '張迺妙茶師紀念館', feature: '鐵觀音茶' ,description: '張迺妙茶師是第一位引進鐵觀音茶於木柵地區種植的人，使貓空自1895年起成為台灣最大的鐵觀音茶產地。身為張迺妙茶師的後代，我們在這裡規劃了紀念館，不僅致力於茶文化的推廣，更與各地的茶農合作，提供多樣的台灣茶。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d904.2516649205203!2d121.58306903651793!3d24.965888051800373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34680033320bf67d%3A0x2b497959c1e7ac7b!2z5by16L-65aaZ6Iy25bir57SA5b-16aSo!5e0!3m2!1szh-TW!2stw!4v1762332962207!5m2!1szh-TW!2stw' }
  ],
  '新北市': [
    { name: '新北市坪林茶業博物館', feature: '文山包種茶' , description: '坪林茶業博物館是全台首座以茶為主題的公立博物館，位於北勢溪畔，建築融合閩南與現代風格。館內展示文山包種茶的起源、製程與文化演變，結合多媒體互動與香氣體驗區，讓遊客從五感感受茶的魅力。週邊步道與茶園相連，春季可賞新芽、秋冬可觀霧海。除了靜態展覽，館方還推出「親子採茶體驗」與「茶葉手作課程」，深受旅客喜愛。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.252902949837!2d121.71208283957267!3d24.934933005796182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467f8bbffffffff%3A0x6f4e3e6cae375765!2z5paw5YyX5biC5Z2q5p6X6Iy25qWt5Y2a54mp6aSo!5e0!3m2!1szh-TW!2stw!4v1762412069034!5m2!1szh-TW!2stw' },
    { name: '石碇八卦茶園', feature: '東方美人、蜜香紅茶、文山包種' ,description: '石碇八卦茶園坐落於「台灣小桂林」千島湖山區，層層茶園與碧綠湖水交錯成畫，是新北最壯麗的茶園之一。此地氣候潮濕、日照柔和，適合茶蟬啃咬形成獨特蜜香風味。茶園設有觀景平台與茶席體驗區，遊客可邊品茶邊遠眺湖光山色。每年四月採茶季時，滿山茶芽翠綠，吸引攝影愛好者爭相造訪，是結合自然與茶文化的夢幻場景。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1521.1763627857217!2d121.64167346457725!3d24.932495486683255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346800a555555555%3A0x2c17ebacb39ca75b!2z5YWr5Y2m6Iy25ZyS!5e0!3m2!1szh-TW!2stw!4v1762412119971!5m2!1szh-TW!2stw' },
    { name: '金瓜寮魚蕨步道', feature: '文山包種茶' ,description: '金瓜寮魚蕨步道是新北著名的生態與茶鄉共融路線，全長約2公里，沿途溪流清澈、蕨類豐富，兩側皆為包種茶園。漫步其中可聞茶香隨風飄散，並可在茶農設立的臨時茶席歇腳品茗。當地茶園主多開放採茶體驗，遊客可親手採葉、烘茶、泡茶，了解茶從葉到杯的旅程。春季新芽綠意盎然，夏秋之際霧氣繚繞，彷彿走進一幅山中茶畫。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.914309972585!2d121.67312096263798!3d24.90305256833198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467fe5f43ff5207%3A0xdd7277f783121dee!2z6YeR55Oc5a-u6a2a6JWo5q2l6YGT!5e0!3m2!1szh-TW!2stw!4v1762412181364!5m2!1szh-TW!2stw' }
  ],
  '桃園市': [
    { name: '大溪老茶廠', feature: '紅茶（紅玉、阿薩姆）、烏龍', description: '日治時期建成並多次修復的製茶工廠，保留老式揉捻機、萎凋槽與乾燥設備，展現台灣紅茶興衰與復興。園區以藍磚、拱廊與玻璃天井呈現工業遺產美學，並設門市提供單品紅茶、冷泡與甜點。建議參與導覽認識製程，再到觀景平台遠眺山谷。可與大溪老街、慈湖步道串聯成一日文化行程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.8522642208745!2d121.32713668521794!3d24.831042295202195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468171ee0081a35%3A0xe7343fef248d4897!2z5aSn5rqq6ICB6Iy25bug!5e0!3m2!1szh-TW!2stw!4v1762412218684!5m2!1szh-TW!2stw' },
    { name: '臺灣客家茶文化館',feature: '多元客家茶、擂茶文化展示',  description: '以客家茶文化為主題的展館，介紹茶產業史、族群飲茶習俗與現代創新。建築坐落丘陵茶景之中，館內規劃互動展、茶室體驗與期間限定市集，能從歷史、器具到風味一覽客家茶文化。建議安排擂茶手作，體驗穀物、花生與茶粉的香氣融合。適合親子與文化路線旅人。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.4272694606084!2d121.18983996825877!3d24.830949791153632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34683dd0ebaf6b85%3A0x9373f66ea45b3ec9!2z6Ie654Gj5a6i5a626Iy25paH5YyW6aSo!5e0!3m2!1szh-TW!2stw!4v1762412263427!5m2!1szh-TW!2stw' },
    { name: '景美山林茶園 × 山月茶屋',feature: '自家栽種紅茶、烏龍（景觀茶屋）',  description: '位於北橫山巒的景觀茶園與茶屋，落地窗面向群峰，視野遼闊。提供自家茶款與簡餐，亦可預約採茶、揉捻等體驗。建議上午走古道、午後在茶屋看雲海與日落；晴雨皆有不同山景氛圍。適合情侶與朋友小旅行，享受『茶在山中』的悠然時光。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1810.6425774908964!2d121.33833609260495!3d24.819920090764708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346817469cf76e23%3A0x3171a50ca85294a6!2z5pmv576O5bGx5p6X6Iy25ZySJuWxseaciOiMtuWxi--9nOWBh-aXpeWupOWFp-mgkOe0hA!5e0!3m2!1szh-TW!2stw!4v1762412297922!5m2!1szh-TW!2stw' }
  ],
  '新竹縣': [
    { name: '北埔老街擂茶體驗',feature: '擂茶（茶葉×穀物×花生）',  description: '客家文化重鎮北埔以擂茶聞名，旅人可在老街店家親手研磨茶葉、芝麻與花生，沖入熱水後呈現濃郁堅果香與茶韻。周邊老屋、慈天宮與古井構成歷史街景，適合以步行緩慢品味。建議搭配客家小炒與客家點心，形成一趟『吃在地×喝擂茶』的文化旅程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.7925515044726!2d121.05470567594858!3d24.699657001672126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34684895225c7673%3A0xede4e838cd669482!2z5LiJ5Y2B5Lmd6Jmf5YyX5Z-U5pOC6Iy277yI5buf5YmN5Ym15aeL5bqX77yJ!5e0!3m2!1szh-TW!2stw!4v1762412373515!5m2!1szh-TW!2stw' },
    { name: '十二寮休閒農業區茶園',feature: '東方美人、蜜香紅茶',  description: '十二寮以丘陵茶園、湖泊步道與農村風情著稱，茶園受小綠葉蟬著蜆，孕育出東方美人的蜂蜜果香與柔滑口感。遊客可於茶園散步、品飲茶湯，預約採製體驗或在湖畔咖啡廳享受午後時光。夏季綠意濃、冬季雲霧起，是新竹慢活茶旅的代表。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.735705238429!2d120.99182142651328!3d24.672643319880557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34684f068269e4eb%3A0x1ea53f80421ed517!2z5Y2B5LqM5a-u5LyR6ZaS6L6y5qWt5Y2A!5e0!3m2!1szh-TW!2stw!4v1762412414507!5m2!1szh-TW!2stw' },
  ],
  '苗栗縣': [
    { name: '銅鑼茶廠',feature: '東方美人（膨風茶）、蜜香紅茶、烏龍',  description: '銅鑼茶廠位於九湖台地，日夜溫差大、茶園生態多樣，孕育出以小綠葉蟬著蜆而聞名的東方美人茶。園區可參觀製茶流程、茶菁採摘與烘焙設備，並安排聞香、手沖與評茶體驗。建議先走九湖步道遠眺丘陵茶田，再回廠房品飲蜂蜜果香與熟果韻，適合初次接觸客庄茶文化的旅人。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.917194523527!2d120.77257843206883!3d24.459802394410012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34690713912f4a0d%3A0x416c3b1694d9e172!2z5Y-w54Gj6L6y5p6XIOmKhemRvOiMtuW7oA!5e0!3m2!1szh-TW!2stw!4v1762412598915!5m2!1szh-TW!2stw' },
    { name: '南庄茶鄉 × 桂花巷茶文化',feature: '東方美人、包種、客家擂茶',  description: '南庄老街以桂花巷聞名，周邊山坡分布小型茶園與客家茶食。旅人可在老屋茶館品評東方美人與包種，並體驗擂茶，從研磨茶葉、芝麻到沖泡一氣呵成。建議串連蓬萊溪護魚步道與百年郵便局，安排『生態步道＋老街品茶＋擂茶手作』的一日慢旅，感受客庄人情與茶香。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2157.044798425648!2d120.99864899423527!3d24.59946212598575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346851e3553cacaf%3A0x40bbea1c9d3c9e8f!2z5qGC6Iqx5be3!5e0!3m2!1szh-TW!2stw!4v1762412653370!5m2!1szh-TW!2stw' },
    { name: '三義木雕小鎮茶館巡禮', feature: '東方美人、烏龍、紅茶（小農茶）', description: '三義以木雕與鐵道文化出名，同時聚集多家小農茶館。沿勝興車站、龍騰斷橋一帶，常見以手沖、聞香杯呈現的小規模選茶店，主打東方美人與蜜香紅茶。建議先探訪鐵路秘境與綠意山徑，午後進入茶館進行兩款對比試飲，快速建立風味記憶，適合文青路線與輕旅行。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7267.595099861917!2d120.77780821807566!3d24.388345171479102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34690418908dfcf7%3A0x5452b9a5e89768ce!2z5Y2B5YWt5Lu95Lq65paH6Iy26aSo!5e0!3m2!1szh-TW!2stw!4v1762412716506!5m2!1szh-TW!2stw' }
  ],
  '台中市': [
    { name: '梨山高山茶園',feature: '高山烏龍、清香烏龍',  description: '梨山海拔 1,600–2,000 公尺，日夜溫差大、雲霧繚繞，造就厚實葉質與清透花香。沿中橫公路可見層層梯田與懸谷地形的茶園景觀。當地茶農多提供莊園等級試飲，並分享採收季與焙火差異。建議清晨入山觀日、午后品茗，體驗高山冷冽與茶湯甘甜的對比。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14550.052066816515!2d121.24276045519642!3d24.258805605598603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468f32d91280a9f%3A0xb71e0f92ed59ba2!2z5qKo5bGx6IGa6ZGr6KO96Iy25bugLSDlj7DngaPpq5jlsbHojLblsIjos6PvvIzpq5jmtbfmi5TojLbljYDnmb7lubToo73ojLblu6A!5e0!3m2!1szh-TW!2stw!4v1762412787051!5m2!1szh-TW!2stw' },
    { name: '福壽山農場茶園',feature: '高冷烏龍、清香金萱',  description: '福壽山農場以高冷蔬果與茶園聞名，雲霧終日流動，茶樹受涼冷環境調教，茶湯滑順、帶冷礦氣。旅人可循步道穿越果園與茶田，秋季另可賞楓。建議預約莊園品飲或選購限量批次，並視天候安排觀雲海行程，享受高山與茶香交織的純淨感。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.8807841152416!2d121.24426961153404!3d24.245948058447034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468f19f313e68c3%3A0x1bbf18b6b46d9655!2z56aP5aO95bGx6L6y5aC0!5e0!3m2!1szh-TW!2stw!4v1762412819867!5m2!1szh-TW!2stw' },
    { name: '中興嶺茶園步道', feature: '翠玉、金萱、清香烏龍', description: '新社中興嶺為台中近郊山丘，林相與茶園交錯，形成親民級的散步路線。沿線茶館主打清香系烏龍，適合搭配輕食與手作甜點。建議上午走步道、午後坐進窗邊茶席，做兩款不同焙度的對比試飲；若自駕，亦可串聯花海季或薰衣草農場，打造半日慢遊。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58227.8560739314!2d120.79971739531953!3d24.19833750242945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34691930347f6397%3A0xb747fe95c6015d6e!2z5aSn5Z2R5LqU5LmL5LiA6Jmf55m75bGx5q2l6YGT!5e0!3m2!1szh-TW!2stw!4v1762412962908!5m2!1szh-TW!2stw' }
  ],
  '彰化縣': [
    { name: '鹿港老街茶藝館',feature: '台灣烏龍、紅玉、冷泡茶',  description: '在鹿港紅磚巷弄間的茶藝館，以老屋木構與古味擺設營造靜謐氛圍，提供多款台灣單品茶與冷泡選擇。適合行程安排於龍山寺、老街與玻璃博物館之後，午後入館歇腳品茗。以聞香杯與小茶點呈現，是結合古城文化與當代喝茶方式的輕旅行提案。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7286.454496001253!2d120.42941433944331!3d24.058300726557324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346945fcd91ab105%3A0x109a421aae785d3b!2z5oCh5Y-k6b2L5Lq65paH6Iy26aSo!5e0!3m2!1szh-TW!2stw!4v1762413005842!5m2!1szh-TW!2stw' },
    { name: '芬園步道 × 茶館午茶',feature: '清香烏龍、花草調飲',  description: '八卦山麓的芬園擁有完善步道與綠蔭林徑，鄰近聚落亦有在地茶館供應清香烏龍與花草調飲。適合安排『晨間健行＋午後午茶』，體驗郊山與茶香的節奏。春天賞桐、冬日觀霧，各有風情；也可串聯草屯與彰化市區，形成周末微旅行。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.3616353327216!2d120.61189787593348!3d24.01830937843728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3469395cfa4567b7%3A0x2bb6c864c917cb80!2z57SF5oi_5a2Q6Iux5ZyL5bCP6Iy26aSo!5e0!3m2!1szh-TW!2stw!4v1762413159708!5m2!1szh-TW!2stw' },
    { name: '員林山腳路選茶小店', feature: '單品烏龍、手沖紅茶', description: '員林山腳路沿線散布風格小店，茶飲店主打單品烏龍與手沖紅茶，強調產地資訊與輕食搭配。適合以單車或步行慢慢探店，比較不同焙度與海拔的風味差異。傍晚時分坐在騎樓下喝茶看車流，是員林最在地的日常風景。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7291.643643759438!2d120.56378567091838!3d23.966740004764937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346937302c1a580f%3A0x52f91d24cc37bde4!2z6aaZ6aaZ6Iy25qWtWGlhbmd0ZWEt5ZOh5p6X5peX6Imm5bqX77yI6aCQ57SE5Yi277yJ!5e0!3m2!1szh-TW!2stw!4v1762413114828!5m2!1szh-TW!2stw' }
  ],
  '南投縣': [
    { name: '日月老茶廠',feature: '紅玉（台茶18號）、阿薩姆、紅韻',  description: '創立於 1959 年的日月老茶廠，是台灣紅茶的重要基地。保留木造廠房與古董機具，館內提供導覽、製茶展示與評茶體驗。魚池得天獨厚的氣候與土壤賦予紅玉薄荷與肉桂調性，茶湯醇厚清甜。建議安排『環潭騎行＋茶廠導覽＋紅茶品評』的一日行程，深入認識魚池紅茶。', mapUrl: '' },
    { name: '凍頂茶區 × 龍鳳峽步道',feature: '凍頂烏龍、熟香烏龍',  description: '鹿谷凍頂以烏龍茶聞名，香氣厚實、喉韻綿長。可循龍鳳峽步道俯瞰層層茶園，途中造訪茶莊進行『輕焙×中焙』對比試飲，理解焙火對香氣與口感的影響。亦可預約手作揉捻體驗，從茶園到茶桌一次走完，適合對工藝有興趣的茶迷。', mapUrl: '' },
    { name: '杉林溪高山茶園', feature: '高山烏龍、清香金萱', description: '杉林溪海拔高、雲霧濃，孕育清透花香與甘醇的高山茶。園區林相多變，沿溪谷步道可見瀑布、苔蘚與巨木。建議先走松瀧岩步道，再到茶莊做『金萱×烏龍』盲品；若遇到採收期，還能觀看茶農忙碌身影，感受高山茶的一年四季。', mapUrl: '' }
  ],
  '雲林縣': [
    { name: '華山茶園步道',feature: '烏龍、金萱、翠玉（華山茶）',  description: '古坑華山除咖啡聞名外，山坡亦有茶園分布。華山步道穿梭林蔭與茶田之間，沿途設觀景平台與在地小茶館，提供清香系台灣烏龍。建議清晨登高看雲瀑，午後坐進窗邊以『清香×輕焙』對比，感受不同焙度的香氣層次，是雲林近郊的輕茶旅選擇。', mapUrl: '' },
    { name: '草嶺石壁生態茶園',feature: '高山烏龍、金萱',  description: '草嶺石壁位於阿里山山脈支稜，雲霧終日纏繞，茶園散落山坡。沿產業道路可見層層梯田與雲海，偶有雉雞與藍腹鷴出沒。多數茶農提供莊園茶試飲與簡餐，建議注意山區天候與路況，安排半日或一日慢行程。', mapUrl: '' },
    { name: '林內鄉親水公園 × 茶風散步', feature: '在地小農烏龍、花草調飲', description: '林內以綠地與自行車道著稱，親水公園周邊聚落有小型茶飲與甜點店，主打在地小農茶款與花草調飲。適合安排親子踏青、騎行與午後午茶，體驗『日常散步×輕品茶』的雲林步調。', mapUrl: '' }
  ],
  '嘉義縣': [
    { name: '梅山太平茶園 × 太平雲梯',feature: '阿里山高山烏龍、金萱、紅茶',  description: '太平雲梯銜接山脊視野，俯瞰茶園聚落與雲海。周邊茶莊提供莊園級高山烏龍與金萱，並可預約採茶、揉捻體驗。建議清晨上橋看雲瀑，午后入茶莊做『清香×輕焙』盲品，理解高山風土。', mapUrl: '' },
    { name: '阿里山茶園公路線',feature: '阿里山高山烏龍、金萱',  description: '台18線沿途分布隙頂、石桌等茶區，雲霧繚繞、日夜溫差大，使茶湯甘甜細緻。可於觀景平台遠望茶梯，並進入茶農工坊了解採收與焙火差異。建議搭配祝山觀日出與奮起湖老街。', mapUrl: '' },
    { name: '觸口茶旅驛站 × 逐鹿部落', feature: '高山烏龍、在地特色紅茶', description: '觸口為阿里山門戶，結合逐鹿部落文化展演與在地茶飲。旅人可在驛站品飲阿里山茶並選購伴手禮，再前往部落體驗射箭、手作，形成自然與人文兼具的半日行程。', mapUrl: '' }
  ],
  '台南市': [
    { name: '東山茶咖共融小旅行',feature: '烏龍、紅茶（山區小農茶）',  description: '東山丘陵除咖啡外亦有茶園分布，小農茶館提供清香烏龍與手作紅茶。建議沿175線安排山區景觀＋茶咖雙享，午後於觀景台遠眺曾文溪谷。適合駕車慢遊。', mapUrl: '' },
    { name: '梅嶺步道 × 山茶午后',feature: '清香烏龍、花草調飲',  description: '梅嶺以梅季聞名，步道綠蔭涼爽。沿線可見小茶館供應清香烏龍與花草調飲，適合『步道健行＋下午茶』。梅季人潮旺，建議平日前往。', mapUrl: '' },
    { name: '關子嶺溫泉 × 茶香慢旅', feature: '在地烏龍、紅茶（輕焙）', description: '安排『泥漿溫泉＋茶館午茶』的療癒行程，先在老溫泉旅館放鬆，再到山區茶館品飲輕焙烏龍或紅茶，感受溫泉與茶香交替的慢活節奏。', mapUrl: '' }
  ],
  '高雄市': [
    { name: '高雄高山茶線 × 寒溪呢步道',feature: '高山烏龍、紅茶（原鄉茶）',  description: '沿南橫梅山口上行可見原鄉茶園，空氣清冷、雲瀑壯觀。可走寒溪呢步道看谷地雲海，回到部落茶屋飲高山烏龍或紅茶，體驗原民文化與茶風土。', mapUrl: '' },
    { name: '寶來溫泉 × 山茶午茶',feature: '清香烏龍、紅茶',  description: '寶來以溫泉與山谷景致著稱，周邊茶屋供應清香烏龍與手作紅茶。建議安排溫泉泡湯後的山茶午茶，或沿荖濃溪谷散步。', mapUrl: '' },
    { name: '甲仙山城 × 小農茶館', feature: '在地小農烏龍、紅茶', description: '甲仙山城緩坡小路間有風格小茶館，供應在地小農茶款。可搭配附近步道與特色小吃，形成半日小旅行。', mapUrl: '' }
  ],
  '屏東縣': [
    { name: '霧台神山 × 茶文化散步',feature: '高山烏龍、紅茶（部落茶）',  description: '霧台群山雲霧繚繞，部落茶屋供應原鄉風味茶飲與手作點心。建議參與部落導覽、手作與茶席，在百合花季或雲海季感受山城靜美。', mapUrl: '' },
    { name: '琉璃珠文化園區 × 山茶午后',feature: '小農烏龍、花草調飲',  description: '三地門以琉璃珠與排灣文化著名，園區周邊小店提供在地茶飲與甜點。可結合文化手作與山景品茗，適合親子與文化愛好者。', mapUrl: '' },
    { name: '東源森林 × 小村茶室', feature: '清香烏龍、紅茶', description: '東源森林保留自然湧泉與濕地生態，村內有小茶室供應清香烏龍與紅茶。建議晨間繞行濕地、午後入茶室看山光雲影。', mapUrl: '' }
  ],
  '台東縣': [
    { name: '鹿野紅烏龍茶園',feature: '紅烏龍、蜜香紅茶',  description: '鹿野高台周邊為台東代表茶區，日照充足、日夜溫差大，孕育香濃回甘的紅烏龍。可於茶園品飲並了解重發酵與焙火的製程，建議串聯熱氣球季與龍田綠色隧道。', mapUrl: '' },
    { name: '布農部落 × 山茶文化體驗',feature: '小農烏龍、紅茶（部落茶）',  description: '延平山區部落結合農耕體驗與茶席，分享原鄉茶飲與在地餐食。可安排族語歌舞、手作課程與茶席對談，體驗部落生活美學。', mapUrl: '' },
    { name: '池上慢行 × 田園茶點', feature: '清香烏龍、花草調飲', description: '稻田與山脈環抱的池上小鎮，午後在田間小茶室享用清香烏龍與輕甜點，騎單車繞行大坡池與伯朗大道，感受東台灣的從容步調。', mapUrl: '' }
  ],
  '花蓮縣': [
    { name: '鯉魚潭環潭茶旅',feature: '清香烏龍、紅茶（在地小農）',  description: '環潭步道綠意盎然，沿線小店提供在地小農茶與甜點。建議晨划獨木舟、午后湖畔茶席，傍晚看山影入水，是花蓮最溫柔的茶旅節奏。', mapUrl: '' },
    { name: '金針山雲海 × 茶香小店',feature: '清香烏龍、金萱',  description: '花季外的六十石山依舊雲海繚繞，山腰間有供應清香烏龍與金萱的茶香小店。建議清晨登高觀雲海、午後坐進茶席看山光流轉。', mapUrl: '' },
    { name: '砂卡礑步道 × 山谷茶席', feature: '清香烏龍、紅茶', description: '太魯閣峽谷清澈溪流旁的步道，林蔭深邃、岩壁壯麗。行程結束後在山谷茶席喝一杯清香烏龍，讓山風與茶香洗去疲憊。', mapUrl: '' }
  ],
  '宜蘭縣': [
    { name: '望龍埤湖畔茶點',feature: '包種、翠玉、清香烏龍',  description: '員山望龍埤群山環抱、湖光如鏡，湖畔咖啡茶點店提供清爽包種與輕食。建議環湖散步或走林中步道，午後在窗邊啜飲淡雅花香的茶湯。', mapUrl: '' },
    { name: '五峰旗瀑布 × 茶食午后',feature: '包種、清香烏龍、花草茶',  description: '五峰旗瀑布清涼宜人，沿線店家供應包種與花草茶輕食。可串聯礁溪溫泉，安排『步道＋溫泉＋午茶』的放鬆行程。', mapUrl: '' },
    { name: '外澳沙灘 × 海風茶席', feature: '清香烏龍、冷泡茶', description: '面對龜山島的外澳海灘，黃昏時分於海邊臨時茶席啜飲冷泡茶，聽浪聲、看日落。適合衝浪後或散步後的清爽茶時光。', mapUrl: '' }
  ]
  // 其餘城市請依需要補上 3 筆
})

// 當前展開的口風琴城市與開合狀態
const expandedCity = ref(selectedCity.value)
const accordionOpen = ref(true)
const accordionOpenMap = ref({})

const initAccordionMap = () => {
  const map = {}
  for (const c of cities.value) {
    map[c.name] = false
  }
  accordionOpenMap.value = map
}

const expandOnlyCity = (cityName) => {
  for (const key in accordionOpenMap.value) {
    accordionOpenMap.value[key] = false
  }
  if (cityName && accordionOpenMap.value.hasOwnProperty(cityName)) {
    accordionOpenMap.value[cityName] = true
  }
}

// 依城市資料重建輪播（3 張，對應店家）
const rebuildSlidesFromCity = (cityName) => {
  const stores = (cityStores.value[cityName] || []).slice(0, 3)
  if (!stores.length) return
  slides.value = stores.map((s, idx) => ({
    src: idx === 0 ? taiwanImg : (idx === 1 ? taiwanAdminImg : taiwanSilhouette),
    alt: s.name,
    title: s.name,
    description: s.description || '',
    mapUrl: s.mapUrl || ''
  }))
  currentSlide.value = 0
  applySlideEffects()
}

// 監看城市變更，同步 rebuild 輪播
watch(selectedCity, (city) => {
  expandedCity.value = city
  expandOnlyCity(city || null)
  rebuildSlidesFromCity(city)
})

const scrollToMap = async () => {
  await nextTick()
  if (mapSectionRef.value) {
    mapSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 計算當前選中縣市的地圖 URL
const currentMapUrl = computed(() => {
  // 如果顯示全台地圖，返回全台地圖 URL
  if (showFullTaiwanMap.value) {
    return defaultTaiwanMapUrl
  }
  // 如果有事件指定的覆蓋地圖，優先顯示
  if (overrideMapUrl.value) {
    return overrideMapUrl.value
  }
  // 否則返回選中縣市的地圖
  return cityMapUrls[selectedCity.value] || cityMapUrls['桃園市']
})

// 將所有活動平均分配到每一頁
const rebalanceEventsAcrossPages = () => {
  const pagesCount = eventsData.value.length
  if (!pagesCount) return
  const allEvents = eventsData.value.flat()
  const total = allEvents.length
  const base = Math.floor(total / pagesCount)
  const remainder = total % pagesCount
  const newPages = []
  let cursor = 0
  for (let i = 0; i < pagesCount; i++) {
    const size = i < remainder ? base + 1 : base
    newPages.push(allEvents.slice(cursor, cursor + size))
    cursor += size
  }
  eventsData.value = newPages
  totalPages.value = eventsData.value.length
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  if (currentPage.value < 1) currentPage.value = 1
}

rebalanceEventsAcrossPages()


const prevPage = () => {
  const list = pagesWithLocations.value
  const idx = list.indexOf(currentPage.value)
  if (idx > 0) {
    currentPage.value = list[idx - 1]
  }
}

const nextPage = () => {
  const list = pagesWithLocations.value
  const idx = list.indexOf(currentPage.value)
  if (idx !== -1 && idx < list.length - 1) {
    currentPage.value = list[idx + 1]
  }
}

onMounted(() => {
  // 預設不自動播放，僅初始化一次當前投影片效果
  applySlideEffects()
  initAccordionMap()
  // 確保當前頁為有效頁（含有可跳轉地名）
  const list = pagesWithLocations.value
  if (list.length > 0 && !list.includes(currentPage.value)) {
    currentPage.value = list[0]
  }
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
        <!-- 輪播區塊（左邊文字區塊改為輪播） -->
        <div class="carousel-container">
          <div class="carousel">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div class="carousel-slide" v-for="(slide, idx) in slides" :key="idx">
                <img class="carousel-image" :src="slide.src" :alt="slide.alt" />
              </div>
            </div>
            <button class="carousel-btn prev-btn" @click="prevSlide">‹</button>
            <button class="carousel-btn next-btn" @click="nextSlide">›</button>
            <div class="carousel-indicators">
              <button
                v-for="(slide, i) in slides"
                :key="i"
                class="indicator"
                :class="{ active: i === currentSlide }"
                @click="goToSlide(i)"
              ></button>
            </div>
          </div>
        </div>

        <div class="text-content">
          <h1>{{ slides[currentSlide]?.title || ' ' }}</h1>
          <p class="subtitle">{{ slides[currentSlide]?.alt || ' ' }}</p>
          <p>{{ slides[currentSlide]?.description || ' ' }}</p>
        </div>
          
          <!-- Google Map 區塊 -->
          <div class="google-map-container" ref="mapSectionRef">
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
      
    
    
    
      <!-- 城市口風琴（只顯示選中城市，展開後列出三個店家） -->
      <div class="events-table-container">
        <div class="table-wrapper">
          <div class="accordion">
            <div 
              class="accordion-item" 
              v-for="city in visibleCities" 
              :key="city.name"
            >
              <button 
                class="accordion-header" 
                @click="accordionOpenMap[city.name] = !accordionOpenMap[city.name]"
                :aria-expanded="accordionOpenMap[city.name]"
              >
                <span class="accordion-title">{{ city.name }} 精選店家（3）</span>
                <span class="accordion-arrow" :class="{ open: accordionOpenMap[city.name] }">▾</span>
              </button>
              <div class="accordion-panel" :class="{ open: accordionOpenMap[city.name] }">
                <ul class="store-list">
                  <li 
                    v-for="(store, idx) in (cityStores[city.name] || [])"
                    :key="store.name || idx"
                    class="store-item"
                    @click="() => { selectedCity = city.name; rebuildSlidesFromCity(city.name); currentSlide = idx; applySlideEffects(); }"
                  >
                    <div class="store-name">{{ store.name || '（待填店名）' }}</div>
                    <div class="store-spec">{{ store.feature || '（待填特色）' }}</div>
                    <div class="store-desc">{{ store.description || '（待填描述）' }}</div>
                  </li>
                </ul>
              </div>
            </div>
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

.accordion {
  width: 100%;
}

.accordion-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  text-align: left;
  padding: 16px 18px;
  background: #f9f9f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1.05rem;
}

.accordion-arrow {
  transition: transform 0.2s ease;
}

.accordion-arrow.open {
  transform: rotate(180deg);
}

.accordion-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-panel.open {
  max-height: 400px;
}

.store-list {
  list-style: none;
  margin: 0;
  padding: 10px 14px 16px 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.store-item {
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.store-item:hover {
  background: #f5f5f5;
}

.store-item:active {
  transform: scale(0.99);
}

.store-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.store-desc {
  color: #666666;
  font-size: 0.95rem;
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

/* 可點擊的活動行樣式 */
.event-row {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.event-row:hover {
  background-color: #e8f5e9 !important;
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.event-row.has-location {
  cursor: pointer;
}

.event-row.has-location:hover {
  background-color: #c8e6c9 !important;
}

.event-row.has-location::after {
  content: '📍';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
  font-size: 1.2rem;
}

.event-row.has-location:hover::after {
  opacity: 1;
  transform: translateY(-50%) scale(1.2);
}

.event-row:active {
  transform: translateX(0);
  background-color: #a5d6a7 !important;
}

/* 無地名的活動行：不可點擊、降低對比、禁用滑鼠事件 */
.event-row.disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
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