<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
// 如果需要import圖片
import taiwanImg from '../assets/img/taiwan.png'
import taiwanAdminImg from '../assets/img/taiwan-admin.svg'
import taiwanSilhouette from '../assets/img/taiwan.png'

import Keelung01 from '../assets/img/keelung01.jpg'
import Keelung02 from '../assets/img/Keelung02.jpg'
import Keelung03 from '../assets/img/Keelung03.jpg'
import Taipei01 from '../assets/img/taipei01.jpg'
import Taipei02 from '../assets/img/taipei02.jpg'
import Taipei03 from '../assets/img/taipei03.webp'
import NewTaipei01 from '../assets/img/newtaipei01.jpg'
import NewTaipei02 from '../assets/img/newtaipei02.jpg'
import NewTaipei03 from '../assets/img/newtaipei03.jpg'
import Taoyuan01 from '../assets/img/taoyuan01.jpg'
import Taoyuan02 from '../assets/img/taoyuan02.jpg'
import Taoyuan03 from '../assets/img/taoyuan03.jpg'
import Hsinchu01 from '../assets/img/hsinchu01.jpg'
import Hsinchu02 from '../assets/img/hsinchu02.jpg'
import Hsinchu03 from '../assets/img/hsinchu03.jpg'
import Miaoli01 from '../assets/img/miaoli01.jpg'
import Miaoli02 from '../assets/img/miaoli02.jpeg'
import Miaoli03 from '../assets/img/miaoli03.jpg'
import Taichung01 from '../assets/img/taichung01.jpeg'
import Taichung02 from '../assets/img/taichung02.jpg'
import Taichung03 from '../assets/img/taichung03.jpg'
import Changhua01 from '../assets/img/changhua01.jpg'
import Changhua02 from '../assets/img/changhua02.jpg'
import Changhua03 from '../assets/img/changhua03.jpg'
import Nantou01 from '../assets/img/nantou01.jpg'
import Nantou02 from '../assets/img/nantou02.jpg'
import Nantou03 from '../assets/img/nantou03.jpg'
import Yunlin01 from '../assets/img/yunlin01.jpg'
import Yunlin02 from '../assets/img/yunlin02.jpg'
import Yunlin03 from '../assets/img/yunlin03.jpg'
import Chiayi01 from '../assets/img/chiayi01.jpg'
import Chiayi02 from '../assets/img/chiayi02.jpg'
import Chiayi03 from '../assets/img/chiayi03.jpg'
import Tainan01 from '../assets/img/tainan01.jpg'
import Tainan02 from '../assets/img/tainan02.jpg'
import Tainan03 from '../assets/img/tainan03.jpg'
import Kaohsiung01 from '../assets/img/kaohsiung01.jpg'
import Kaohsiung02 from '../assets/img/kaohsiung02.jpg'
import Kaohsiung03 from '../assets/img/kaohsiung03.jpg'
import Pingtung01 from '../assets/img/pingtung01.jpg'
import Pingtung02 from '../assets/img/pingtung02.jpg'
import Pingtung03 from '../assets/img/pingtung03.jpg'
import Hualien01 from '../assets/img/Hualien01.jpg'
import Hualien02 from '../assets/img/Hualien02.jpeg'
import Hualien03 from '../assets/img/Hualien03.jpg'
import Taitung01 from '../assets/img/taitung01.jpg'
import Taitung02 from '../assets/img/taitung02.jpg'
import Taitung03 from '../assets/img/taitung03.jpg'
import Yilan01 from '../assets/img/yilan01.jpg'
import Yilan02 from '../assets/img/yilan02.jpg'
import Yilan03 from '../assets/img/yilan03.jpg'

// 輪播相關
const currentSlide = ref(0)
const slides = ref([
  { src: taiwanImg, alt: '台灣茶葉', title: '茶旅亮點一', description: '探索山海之間的茶香路徑。', mapUrl: '' },
  { src: taiwanAdminImg, alt: '台灣茶葉管理', title: '茶旅亮點二', description: '走入在地茶文化，品味風土。', mapUrl: '' },
  { src: taiwanSilhouette, alt: '台灣本島', title: '茶旅亮點三', description: '踏查茶鄉與人文風景的交會。', mapUrl: '' }
])

// 地圖相關
const currentLocation = ref(null)
const selectedCity = ref(null)

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
  { name: '嘉義縣', x: 15, y: 55, color: '#5a8c69' },

  // 東部區域 (淺綠色區域)
  { name: '花蓮縣', x: 74, y: 30, color: '#4a7c59' },
  { name: '台東縣', x: 53, y: 92, color: '#5a8c69' },

  // 南部區域 (淺黃色區域)
  { name: '台南市', x: 20, y: 70, color: '#6b8e6b' },
  { name: '高雄市', x: 20, y: 95, color: '#4a7c59' },
  { name: '屏東縣', x: 38, y: 125, color: '#5a8c69' }
])

// 點擊縣市
const selectCity = async (cityName) => {
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
  
  // 手機版時滾動到文字區塊，桌面版滾動到地圖
  await nextTick()
  if (isMobile()) {
    scrollToTextContent()
  } else {
    scrollToMap()
  }
}

// 口風琴可見的城市：當所有手風琴都收起來時，顯示所有城市
// 只有當手風琴打開時，才只顯示選中的城市
const visibleCities = computed(() => {
  // 檢查是否有任何手風琴是打開的
  const hasOpenAccordion = Object.values(accordionOpenMap.value).some(open => open === true) 
  // 如果有打開的手風琴，且選中了城市，只顯示選中的城市
  if (hasOpenAccordion && selectedCity.value) {
    return cities.value.filter(c => c.name === selectedCity.value)
  }
  // 所有手風琴都收起來時，顯示所有城市
  return cities.value
})


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
  '嘉義縣文化觀光局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1829.9076183774134!2d120.2938462720605!3d23.467128216943582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e9bd25d70bbef%3A0xfe2bad76890c49bb!2z5ZiJ576p57ij5paH5YyW6KeA5YWJ5bGA!5e0!3m2!1szh-TW!2stw!4v1762325589482!5m2!1szh-TW!2stw',
  '坪林茶業博物館': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4302.469256675841!2d121.71091428562141!3d24.934421263475194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467f8bbffffffff%3A0x6f4e3e6cae375765!2z5paw5YyX5biC5Z2q5p6X6Iy25qWt5Y2a54mp6aSo!5e0!3m2!1szh-TW!2stw!4v1762325697881!5m2!1szh-TW!2stw',
  '台灣茶協會': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1287.5071466610837!2d120.67933283690732!3d24.114850542306932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693ce4b18f73e3%3A0x470fdb0a7a5577ca!2z5Y-w54Gj6Iy25Y2U5pyD!5e0!3m2!1szh-TW!2stw!4v1762326096713!5m2!1szh-TW!2stw',
  '南投觀光工廠協會': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1532.8250610395974!2d120.95751841393913!3d23.971296018900443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468d9a73b362701%3A0x3852e1b48169ce58!2z5Y2X5oqV57ij6KeA5YWJ5Y2U5pyD!5e0!3m2!1szh-TW!2stw!4v1762326205322!5m2!1szh-TW!2stw',
  '日月潭紅茶推廣中心': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1532.9112411011367!2d120.95919520232529!3d23.964049969648702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468d9a36537a0b7%3A0xc753c398345edd2a!2z5pel5pyI5r2t57SF6Iy25o6o5buj56uZ!5e0!3m2!1szh-TW!2stw!4v1762326268193!5m2!1szh-TW!2stw',
  '新竹縣茶業改良場': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6091.74488615223!2d121.17233726736563!3d24.789522773180224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34683ecc409160c3%3A0x67fb251775d33949!2z5Y-w54Gj57SF6Iy26IKh5Lu95pyJ6ZmQ5YWs5Y-4KOiHuue0heiMtualreaWh-WMlumkqCk!5e0!3m2!1szh-TW!2stw!4v1762326380082!5m2!1szh-TW!2stw',
  '台北文創茶學苑': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14458.975215206261!2d121.5530835401308!3d25.04276707247682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abbf10d06711%3A0x18365043482713a4!2z6Ie65YyX5paH5Ym1!5e0!3m2!1szh-TW!2stw!4v1762326655041!5m2!1szh-TW!2stw',
  '高雄美術館 × 茶旅品牌合作': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2603.5095982378552!2d120.28570610603073!3d22.656823980586136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e0451f1321009%3A0x4f90af4e670c3d1f!2z6auY6ZuE5biC56uL576O6KGT6aSo!5e0!3m2!1szh-TW!2stw!4v1762326729193!5m2!1szh-TW!2stw',
  '桃園市文化觀光局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27306.112180435026!2d121.28496808888265!3d24.992394202980986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34681f04c9092637%3A0xcb74e6d48c12504c!2z5qGD5ZyS5biC5pS_5bqc6KeA5YWJ5peF6YGK5bGA!5e0!3m2!1szh-TW!2stw!4v1762326841739!5m2!1szh-TW!2stw',
  '基隆市文化局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1806.0684882521832!2d121.74315011003948!3d25.131059521789286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x140dc519d812c737%3A0x865faf11fffda399!2z5Z-66ZqG5biC5paH5YyW6KeA5YWJ5bGA!5e0!3m2!1szh-TW!2stw!4v1762326890384!5m2!1szh-TW!2stw',
  '宜蘭縣觀光旅遊處': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28991.698256184856!2d121.7469547335847!3d24.72817514047716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467e4fdd52c1533%3A0x9c30bcc4e3c07c90!2z5a6c6Jit57ij5pS_5bqc5bel5ZWG5peF6YGK6JmV!5e0!3m2!1szh-TW!2stw!4v1762326955537!5m2!1szh-TW!2stw',
  '宜蘭縣文化觀光局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7246.699911142146!2d121.74151018040179!3d24.749187628937925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467e4ea61eda5cf%3A0xb2b96f2ac7d6ac23!2z5a6c6Jit57ij5pS_5bqc5paH5YyW5bGA!5e0!3m2!1szh-TW!2stw!4v1762327102480!5m2!1szh-TW!2stw',
  '苗栗縣文化觀光局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2565.8522256320107!2d120.81997726434112!3d24.566304620627005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3469ac0ebb5816cd%3A0x4d0e3efe222892c7!2z6IuX5qCX57ij5pS_5bqc5paH5YyW6KeA5YWJ5bGA!5e0!3m2!1szh-TW!2stw!4v1762327321369!5m2!1szh-TW!2stw',
  '彰化縣文化局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2165.9479656935773!2d120.54540834255161!3d24.077720148943296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346938917d791dd3%3A0xeee27e3a30cc3095!2z5b2w5YyW57ij5paH5YyW5bGA!5e0!3m2!1szh-TW!2stw!4v1762327413825!5m2!1szh-TW!2stw',
  '雲林縣觀光處': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.376229187265!2d120.52348579077163!3d23.69577275560827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346eb7e3208b19d9%3A0xa797cfc65236e4a1!2z6Zuy5p6X57ij5pS_5bqc5paH5YyW6KeA5YWJ6JmV!5e0!3m2!1szh-TW!2stw!4v1762327568032!5m2!1szh-TW!2stw',
  '嘉義市文化觀光處': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5174.9956995292005!2d120.45007464592776!3d23.486618472651546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e95cc79576715%3A0xf0d618685625f5ed!2z5ZiJ576p5biC5pS_5bqc5paH5YyW5bGA!5e0!3m2!1szh-TW!2stw!4v1762328081033!5m2!1szh-TW!2stw',
  '台南市文化觀光局': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.1085794780074!2d120.31176204239904!3d23.311818949678095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e85c4a556d0eb%3A0x4fa475028598da12!2z6Ie65Y2X5biC5pS_5bqc6KeA5YWJ5peF6YGK5bGA!5e0!3m2!1szh-TW!2stw!4v1762328146424!5m2!1szh-TW!2stw',
  '屏東縣觀光傳播處': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34024.93555746366!2d120.47711663444886!3d22.682547793211477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e1795d53ff1a9%3A0x857799e358c2f4fe!2z5bGP5p2x57ij5pS_5bqc5paH5YyW6JmV!5e0!3m2!1szh-TW!2stw!4v1762328206584!5m2!1szh-TW!2stw',
  '台東縣文化觀光處': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.2375365756243!2d121.14320225963709!3d22.756564388222266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346fb914fbfe908b%3A0x3b3661e87984cfc1!2z5Y-w5p2x57ij5pS_5bqc5paH5YyW6JmV!5e0!3m2!1szh-TW!2stw!4v1762328282160!5m2!1szh-TW!2stw',








}

// 預設的全台地圖 URL（載入時顯示）
const defaultTaiwanMapUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1575047.3017064694!2d121.29109931970946!3d23.52115776149224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-TW!2stw!4v1762141297654!5m2!1szh-TW!2stw'

// 是否顯示全台地圖
const showFullTaiwanMap = ref(true)

// 地圖區塊元素，用於點擊活動後自動捲動到地圖
const mapSectionRef = ref(null)
// 事件點擊時的自訂地圖覆蓋 URL（優先於縣市地圖）
const overrideMapUrl = ref(null)

// 每個縣市的三張輪播圖片配置
// 請在這裡為每個縣市添加三張圖片的路徑
const cityImages = ref({
  '基隆市': [Keelung01, Keelung02, Keelung03],
  '台北市': [Taipei01, Taipei02, Taipei03],
  '新北市': [NewTaipei01, NewTaipei02, NewTaipei03],
  '桃園市': [Taoyuan01, Taoyuan02, Taoyuan03],
  '新竹市': [Hsinchu01, Hsinchu02, Hsinchu03],
  '苗栗縣': [Miaoli01, Miaoli02, Miaoli03],
  '台中市': [Taichung01, Taichung02, Taichung03],
  '彰化縣': [Changhua01, Changhua02, Changhua03],
  '南投縣': [Nantou01, Nantou02, Nantou03],
  '雲林縣': [Yunlin01, Yunlin02, Yunlin03],
  '嘉義縣': [Chiayi01, Chiayi02, Chiayi03],
  '台南市': [Tainan01, Tainan02, Tainan03],
  '高雄市': [Kaohsiung01, Kaohsiung02, Kaohsiung03],
  '屏東縣': [Pingtung01, Pingtung02, Pingtung03],
  '花蓮縣': [Hualien01, Hualien02, Hualien03],
  '台東縣': [Taitung01, Taitung02, Taitung03],
  '宜蘭縣': [Yilan01, Yilan02, Yilan03]
})

// 城市 -> 三個店家的資料（請依需求填入實際連結與描述）
const cityStores = ref({
  '基隆市': [
    { name: '崆茶屋 Teahouse K', feature: '以現泡高山茶為主打，結合日式空間設計。', description: '崆茶屋位於基隆塔上方的山脊稜線，以日間茶席、夜間小酒吧的雙模式營運，讓遊客在觀港視野下品味台灣單品茶。空間以原石、木質與在地植物塑造山城氛圍，茶師透過手沖與聞香引導，介紹茶湯的層次、產地風土與沖泡重點。建議白天登高看港景、傍晚接續黃昏與夜色，體驗城市、海風與茶香交織的節奏；也可串連正濱漁港、潮境公園形成一日路線。適合想以設計空間認識基隆、同時享受精緻茶席的旅人。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.106904482948!2d121.7451946063434!3d25.1320763594365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d4f6ed2135c25%3A0x248104cb205e4f8f!2z5bSG5pu45bGLIEhvdXNlIEs!5e0!3m2!1szh-TW!2stw!4v1762332531299!5m2!1szh-TW!2stw' },
    { name: '暖東峽谷 × 大菁休閒農場', feature: '花草茶、在地香草茶飲。', description: '暖東峽谷以溪谷地形、岩洞與滑瀑著稱，沿線林蔭步道涼爽宜人。鄰近的大菁休閒農場以藍染聞名，也提供香草與花草茶體驗：從園區採摘香草、曬乾到沖泡，學習芳香植物入茶的搭配。建議早上健行親水、午後進行藍染與手作花草茶，結合自然生態與手作體驗。春夏季節綠意盎然，秋冬雲霧繚繞，都是暢遊的好時機。適合親子家庭與戶外愛好者。。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.906690730148!2d121.75474427607952!3d25.071151536793373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d51ba35bbd555%3A0x91bb348af64a7523!2zW-Wkp-iPgeS8kemWkui-suWgtF0g6JeN5p-T6auU6amXIOaVmeWtuCDvvIjpoJDntITliLbvvIk!5e0!3m2!1szh-TW!2stw!4v1762332615095!5m2!1szh-TW!2stw' },
    { name: '和平島地質公園山海茶席', feature: '海風主題調飲茶、在地聯名茶', description: '以「山海茶席」為主題的不定期快閃活動，結合和平島奇岩地景與在地茶品牌，於日落時分舉辦露天茶席。茶師以海風、鹽霧與礦物意象設計茶款，帶領參與者從聞香、啜飲到與地景對話。建議提前關注活動公告並預約報名，行程可搭配公園步道、潮境觀察與島嶼人文解說。即使無活動時，也能自帶茶具在觀景平台享受海風與茶香，是體驗「一口山海」的絕佳場域。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.2287712011125!2d121.76189147594873!3d25.161752099403063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d4ee2add3d0bf%3A0xb2a6e84801d59973!2z5ZKM5bmz5bO25Zyw6LOq5YWs5ZySIEhlcGluZyBJc2xhbmQgR2VvUGFyaw!5e0!3m2!1szh-TW!2stw!4v1762332743544!5m2!1szh-TW!2stw' }
  ],
  '台北市': [
    { name: '貓空', feature: '文山包種茶、木柵鐵觀音', description: '貓空位於台北市文山區的山腰地帶，是北台灣最具代表性的茶鄉之一。從清代即以包種茶聞名，因山區霧氣充足、氣候涼爽，使茶葉香氣柔和、滋味清甜。遊客可搭乘貓空纜車直達山頂，沿途俯瞰城市與茶園交織的美景。抵達後，可漫步於茶園步道、造訪景觀茶館，體驗採茶、揉茶、泡茶的樂趣。夜晚時分，萬家燈火映照在山谷間，一杯鐵觀音香氣氤氳，成為城市與自然交融的最佳注解。這裡不僅是泡茶賞景的好去處，更是了解台北茶文化與休閒生活的經典代表。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28932.035206056527!2d121.55128413205847!3d24.982971078081462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa8389128349%3A0x211736b3fb76a84b!2zMTE26Ie65YyX5biC5paH5bGx5Y2A6LKT56m6!5e0!3m2!1szh-TW!2stw!4v1762332802968!5m2!1szh-TW!2stw' },
    { name: '新芳春茶行（大稻埕百年茶館）', feature: '包種茶、紅烏龍、台茶18號', description: '新芳春茶行創立於1934年，是見證大稻埕繁華的老字號茶商建築。紅磚外牆、木造閣樓與古樸櫃檯仍保留昔日風貌，館內展示早期茶葉烘焙器具與外銷茶箱，重現當年茶葉貿易的盛況。參觀者可透過導覽了解台灣茶出口的歷史，並於品茗區細細體驗包種茶的清香與紅烏龍的蜜韻。周邊巷弄仍散發舊時茶鄉氣息，是認識台北茶文化根源的絕佳起點。午後陽光灑落木窗，飄著茶香與故事，是最台北味的午後時光。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.321623491624!2d121.5099733760792!3d25.057085937360196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a914e01c5ebb%3A0xe701e9e4261ba3c5!2z5paw6Iqz5pil6Iy26KGM!5e0!3m2!1szh-TW!2stw!4v1762332842352!5m2!1szh-TW!2stw' },
    { name: '張迺妙茶師紀念館', feature: '鐵觀音茶', description: '張迺妙茶師是第一位引進鐵觀音茶於木柵地區種植的人，使貓空自1895年起成為台灣最大的鐵觀音茶產地。身為張迺妙茶師的後代，我們在這裡規劃了紀念館，不僅致力於茶文化的推廣，更與各地的茶農合作，提供多樣的台灣茶。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d904.2516649205203!2d121.58306903651793!3d24.965888051800373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34680033320bf67d%3A0x2b497959c1e7ac7b!2z5by16L-65aaZ6Iy25bir57SA5b-16aSo!5e0!3m2!1szh-TW!2stw!4v1762332962207!5m2!1szh-TW!2stw' }
  ],
  '新北市': [
    { name: '新北市坪林茶業博物館', feature: '文山包種茶', description: '坪林茶業博物館是全台首座以茶為主題的公立博物館，位於北勢溪畔，建築融合閩南與現代風格。館內展示文山包種茶的起源、製程與文化演變，結合多媒體互動與香氣體驗區，讓遊客從五感感受茶的魅力。週邊步道與茶園相連，春季可賞新芽、秋冬可觀霧海。除了靜態展覽，館方還推出「親子採茶體驗」與「茶葉手作課程」，深受旅客喜愛。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.252902949837!2d121.71208283957267!3d24.934933005796182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467f8bbffffffff%3A0x6f4e3e6cae375765!2z5paw5YyX5biC5Z2q5p6X6Iy25qWt5Y2a54mp6aSo!5e0!3m2!1szh-TW!2stw!4v1762412069034!5m2!1szh-TW!2stw' },
    { name: '石碇八卦茶園', feature: '東方美人、蜜香紅茶、文山包種', description: '石碇八卦茶園坐落於「台灣小桂林」千島湖山區，層層茶園與碧綠湖水交錯成畫，是新北最壯麗的茶園之一。此地氣候潮濕、日照柔和，適合茶蟬啃咬形成獨特蜜香風味。茶園設有觀景平台與茶席體驗區，遊客可邊品茶邊遠眺湖光山色。每年四月採茶季時，滿山茶芽翠綠，吸引攝影愛好者爭相造訪，是結合自然與茶文化的夢幻場景。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1521.1763627857217!2d121.64167346457725!3d24.932495486683255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346800a555555555%3A0x2c17ebacb39ca75b!2z5YWr5Y2m6Iy25ZyS!5e0!3m2!1szh-TW!2stw!4v1762412119971!5m2!1szh-TW!2stw' },
    { name: '金瓜寮魚蕨步道', feature: '文山包種茶', description: '金瓜寮魚蕨步道是新北著名的生態與茶鄉共融路線，全長約2公里，沿途溪流清澈、蕨類豐富，兩側皆為包種茶園。漫步其中可聞茶香隨風飄散，並可在茶農設立的臨時茶席歇腳品茗。當地茶園主多開放採茶體驗，遊客可親手採葉、烘茶、泡茶，了解茶從葉到杯的旅程。春季新芽綠意盎然，夏秋之際霧氣繚繞，彷彿走進一幅山中茶畫。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.914309972585!2d121.67312096263798!3d24.90305256833198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467fe5f43ff5207%3A0xdd7277f783121dee!2z6YeR55Oc5a-u6a2a6JWo5q2l6YGT!5e0!3m2!1szh-TW!2stw!4v1762412181364!5m2!1szh-TW!2stw' }
  ],
  '桃園市': [
    { name: '大溪老茶廠', feature: '紅茶（紅玉、阿薩姆）、烏龍', description: '日治時期建成並多次修復的製茶工廠，保留老式揉捻機、萎凋槽與乾燥設備，展現台灣紅茶興衰與復興。園區以藍磚、拱廊與玻璃天井呈現工業遺產美學，並設門市提供單品紅茶、冷泡與甜點。建議參與導覽認識製程，再到觀景平台遠眺山谷。可與大溪老街、慈湖步道串聯成一日文化行程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.8522642208745!2d121.32713668521794!3d24.831042295202195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468171ee0081a35%3A0xe7343fef248d4897!2z5aSn5rqq6ICB6Iy25bug!5e0!3m2!1szh-TW!2stw!4v1762412218684!5m2!1szh-TW!2stw' },
    { name: '臺灣客家茶文化館', feature: '多元客家茶、擂茶文化展示', description: '以客家茶文化為主題的展館，介紹茶產業史、族群飲茶習俗與現代創新。建築坐落丘陵茶景之中，館內規劃互動展、茶室體驗與期間限定市集，能從歷史、器具到風味一覽客家茶文化。建議安排擂茶手作，體驗穀物、花生與茶粉的香氣融合。適合親子與文化路線旅人。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.4272694606084!2d121.18983996825877!3d24.830949791153632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34683dd0ebaf6b85%3A0x9373f66ea45b3ec9!2z6Ie654Gj5a6i5a626Iy25paH5YyW6aSo!5e0!3m2!1szh-TW!2stw!4v1762412263427!5m2!1szh-TW!2stw' },
    { name: '景美山林茶園 × 山月茶屋', feature: '自家栽種紅茶、烏龍（景觀茶屋）', description: '位於北橫山巒的景觀茶園與茶屋，落地窗面向群峰，視野遼闊。提供自家茶款與簡餐，亦可預約採茶、揉捻等體驗。建議上午走古道、午後在茶屋看雲海與日落；晴雨皆有不同山景氛圍。適合情侶與朋友小旅行，享受『茶在山中』的悠然時光。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1810.6425774908964!2d121.33833609260495!3d24.819920090764708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346817469cf76e23%3A0x3171a50ca85294a6!2z5pmv576O5bGx5p6X6Iy25ZySJuWxseaciOiMtuWxi--9nOWBh-aXpeWupOWFp-mgkOe0hA!5e0!3m2!1szh-TW!2stw!4v1762412297922!5m2!1szh-TW!2stw' }
  ],
  '新竹市': [
    { name: '北埔老街擂茶體驗', feature: '擂茶（茶葉×穀物×花生）', description: '客家文化重鎮北埔以擂茶聞名，旅人可在老街店家親手研磨茶葉、芝麻與花生，沖入熱水後呈現濃郁堅果香與茶韻。周邊老屋、慈天宮與古井構成歷史街景，適合以步行緩慢品味。建議搭配客家小炒與客家點心，形成一趟『吃在地×喝擂茶』的文化旅程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.7925515044726!2d121.05470567594858!3d24.699657001672126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34684895225c7673%3A0xede4e838cd669482!2z5LiJ5Y2B5Lmd6Jmf5YyX5Z-U5pOC6Iy277yI5buf5YmN5Ym15aeL5bqX77yJ!5e0!3m2!1szh-TW!2stw!4v1762412373515!5m2!1szh-TW!2stw' },
    { name: '十二寮休閒農業區茶園', feature: '東方美人、蜜香紅茶', description: '十二寮以丘陵茶園、湖泊步道與農村風情著稱，茶園受小綠葉蟬著蜆，孕育出東方美人的蜂蜜果香與柔滑口感。遊客可於茶園散步、品飲茶湯，預約採製體驗或在湖畔咖啡廳享受午後時光。夏季綠意濃、冬季雲霧起，是新竹慢活茶旅的代表。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.735705238429!2d120.99182142651328!3d24.672643319880557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34684f068269e4eb%3A0x1ea53f80421ed517!2z5Y2B5LqM5a-u5LyR6ZaS6L6y5qWt5Y2A!5e0!3m2!1szh-TW!2stw!4v1762412414507!5m2!1szh-TW!2stw' },
  ],
  '苗栗縣': [
    { name: '銅鑼茶廠', feature: '東方美人（膨風茶）、蜜香紅茶、烏龍', description: '銅鑼茶廠位於九湖台地，日夜溫差大、茶園生態多樣，孕育出以小綠葉蟬著蜆而聞名的東方美人茶。園區可參觀製茶流程、茶菁採摘與烘焙設備，並安排聞香、手沖與評茶體驗。建議先走九湖步道遠眺丘陵茶田，再回廠房品飲蜂蜜果香與熟果韻，適合初次接觸客庄茶文化的旅人。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.917194523527!2d120.77257843206883!3d24.459802394410012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34690713912f4a0d%3A0x416c3b1694d9e172!2z5Y-w54Gj6L6y5p6XIOmKhemRvOiMtuW7oA!5e0!3m2!1szh-TW!2stw!4v1762412598915!5m2!1szh-TW!2stw' },
    { name: '南庄茶鄉 × 桂花巷茶文化', feature: '東方美人、包種、客家擂茶', description: '南庄老街以桂花巷聞名，周邊山坡分布小型茶園與客家茶食。旅人可在老屋茶館品評東方美人與包種，並體驗擂茶，從研磨茶葉、芝麻到沖泡一氣呵成。建議串連蓬萊溪護魚步道與百年郵便局，安排『生態步道＋老街品茶＋擂茶手作』的一日慢旅，感受客庄人情與茶香。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2157.044798425648!2d120.99864899423527!3d24.59946212598575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346851e3553cacaf%3A0x40bbea1c9d3c9e8f!2z5qGC6Iqx5be3!5e0!3m2!1szh-TW!2stw!4v1762412653370!5m2!1szh-TW!2stw' },
    { name: '三義木雕小鎮茶館巡禮', feature: '東方美人、烏龍、紅茶（小農茶）', description: '三義以木雕與鐵道文化出名，同時聚集多家小農茶館。沿勝興車站、龍騰斷橋一帶，常見以手沖、聞香杯呈現的小規模選茶店，主打東方美人與蜜香紅茶。建議先探訪鐵路秘境與綠意山徑，午後進入茶館進行兩款對比試飲，快速建立風味記憶，適合文青路線與輕旅行。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7267.595099861917!2d120.77780821807566!3d24.388345171479102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34690418908dfcf7%3A0x5452b9a5e89768ce!2z5Y2B5YWt5Lu95Lq65paH6Iy26aSo!5e0!3m2!1szh-TW!2stw!4v1762412716506!5m2!1szh-TW!2stw' }
  ],
  '台中市': [
    { name: '梨山高山茶園', feature: '高山烏龍、清香烏龍', description: '梨山海拔 1,600–2,000 公尺，日夜溫差大、雲霧繚繞，造就厚實葉質與清透花香。沿中橫公路可見層層梯田與懸谷地形的茶園景觀。當地茶農多提供莊園等級試飲，並分享採收季與焙火差異。建議清晨入山觀日、午后品茗，體驗高山冷冽與茶湯甘甜的對比。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14550.052066816515!2d121.24276045519642!3d24.258805605598603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468f32d91280a9f%3A0xb71e0f92ed59ba2!2z5qKo5bGx6IGa6ZGr6KO96Iy25bugLSDlj7DngaPpq5jlsbHojLblsIjos6PvvIzpq5jmtbfmi5TojLbljYDnmb7lubToo73ojLblu6A!5e0!3m2!1szh-TW!2stw!4v1762412787051!5m2!1szh-TW!2stw' },
    { name: '福壽山農場茶園', feature: '高冷烏龍、清香金萱', description: '福壽山農場以高冷蔬果與茶園聞名，雲霧終日流動，茶樹受涼冷環境調教，茶湯滑順、帶冷礦氣。旅人可循步道穿越果園與茶田，秋季另可賞楓。建議預約莊園品飲或選購限量批次，並視天候安排觀雲海行程，享受高山與茶香交織的純淨感。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.8807841152416!2d121.24426961153404!3d24.245948058447034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468f19f313e68c3%3A0x1bbf18b6b46d9655!2z56aP5aO95bGx6L6y5aC0!5e0!3m2!1szh-TW!2stw!4v1762412819867!5m2!1szh-TW!2stw' },
    { name: '中興嶺茶園步道', feature: '翠玉、金萱、清香烏龍', description: '新社中興嶺為台中近郊山丘，林相與茶園交錯，形成親民級的散步路線。沿線茶館主打清香系烏龍，適合搭配輕食與手作甜點。建議上午走步道、午後坐進窗邊茶席，做兩款不同焙度的對比試飲；若自駕，亦可串聯花海季或薰衣草農場，打造半日慢遊。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58227.8560739314!2d120.79971739531953!3d24.19833750242945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34691930347f6397%3A0xb747fe95c6015d6e!2z5aSn5Z2R5LqU5LmL5LiA6Jmf55m75bGx5q2l6YGT!5e0!3m2!1szh-TW!2stw!4v1762412962908!5m2!1szh-TW!2stw' }
  ],
  '彰化縣': [
    { name: '鹿港老街茶藝館', feature: '台灣烏龍、紅玉、冷泡茶', description: '在鹿港紅磚巷弄間的茶藝館，以老屋木構與古味擺設營造靜謐氛圍，提供多款台灣單品茶與冷泡選擇。適合行程安排於龍山寺、老街與玻璃博物館之後，午後入館歇腳品茗。以聞香杯與小茶點呈現，是結合古城文化與當代喝茶方式的輕旅行提案。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7286.454496001253!2d120.42941433944331!3d24.058300726557324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346945fcd91ab105%3A0x109a421aae785d3b!2z5oCh5Y-k6b2L5Lq65paH6Iy26aSo!5e0!3m2!1szh-TW!2stw!4v1762413005842!5m2!1szh-TW!2stw' },
    { name: '芬園步道 × 茶館午茶', feature: '清香烏龍、花草調飲', description: '八卦山麓的芬園擁有完善步道與綠蔭林徑，鄰近聚落亦有在地茶館供應清香烏龍與花草調飲。適合安排『晨間健行＋午後午茶』，體驗郊山與茶香的節奏。春天賞桐、冬日觀霧，各有風情；也可串聯草屯與彰化市區，形成周末微旅行。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.3616353327216!2d120.61189787593348!3d24.01830937843728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3469395cfa4567b7%3A0x2bb6c864c917cb80!2z57SF5oi_5a2Q6Iux5ZyL5bCP6Iy26aSo!5e0!3m2!1szh-TW!2stw!4v1762413159708!5m2!1szh-TW!2stw' },
    { name: '員林山腳路選茶小店', feature: '單品烏龍、手沖紅茶', description: '員林山腳路沿線散布風格小店，茶飲店主打單品烏龍與手沖紅茶，強調產地資訊與輕食搭配。適合以單車或步行慢慢探店，比較不同焙度與海拔的風味差異。傍晚時分坐在騎樓下喝茶看車流，是員林最在地的日常風景。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7291.643643759438!2d120.56378567091838!3d23.966740004764937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346937302c1a580f%3A0x52f91d24cc37bde4!2z6aaZ6aaZ6Iy25qWtWGlhbmd0ZWEt5ZOh5p6X5peX6Imm5bqX77yI6aCQ57SE5Yi277yJ!5e0!3m2!1szh-TW!2stw!4v1762413114828!5m2!1szh-TW!2stw' }
  ],
  '南投縣': [
    { name: '日月老茶廠', feature: '紅玉（台茶18號）、阿薩姆、紅韻', description: '創立於 1959 年的日月老茶廠，是台灣紅茶的重要基地。保留木造廠房與古董機具，館內提供導覽、製茶展示與評茶體驗。魚池得天獨厚的氣候與土壤賦予紅玉薄荷與肉桂調性，茶湯醇厚清甜。建議安排『環潭騎行＋茶廠導覽＋紅茶品評』的一日行程，深入認識魚池紅茶。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.9377359545233!2d120.92070820735168!3d23.891826484953583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468d64c409b94a3%3A0xc85ae6d33f31ca69!2z5pel5pyI6ICB6Iy25bug!5e0!3m2!1szh-TW!2stw!4v1762479323949!5m2!1szh-TW!2stw' },
    { name: '凍頂茶區 × 龍鳳峽步道', feature: '凍頂烏龍、熟香烏龍', description: '鹿谷凍頂以烏龍茶聞名，香氣厚實、喉韻綿長。可循龍鳳峽步道俯瞰層層茶園，途中造訪茶莊進行『輕焙×中焙』對比試飲，理解焙火對香氣與口感的影響。亦可預約手作揉捻體驗，從茶園到茶桌一次走完，適合對工藝有興趣的茶迷。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29217.31161665787!2d120.73741382612208!3d23.741532183464876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ed24ac7688763%3A0xceaaf45d37e3027c!2z6bm_6IyX5YeN6aCC6Iy2!5e0!3m2!1szh-TW!2stw!4v1762479391298!5m2!1szh-TW!2stw' },
    { name: '杉林溪高山茶園', feature: '高山烏龍、清香金萱', description: '杉林溪海拔高、雲霧濃，孕育清透花香與甘醇的高山茶。園區林相多變，沿溪谷步道可見瀑布、苔蘚與巨木。建議先走松瀧岩步道，再到茶莊做『金萱×烏龍』盲品；若遇到採收期，還能觀看茶農忙碌身影，感受高山茶的一年四季。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29211.62861381992!2d120.67964027910159!3d23.766857400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ed27f1e5c1f85%3A0xf87f142c102acfe2!2z5p2J5p6X5rqq6auY5bGx6Iy2IOmHkeeJjOWkp-izng!5e0!3m2!1szh-TW!2stw!4v1762479439587!5m2!1szh-TW!2stw' }
  ],
  '雲林縣': [
    { name: '華山茶園步道', feature: '烏龍、金萱、翠玉（華山茶）', description: '古坑華山除咖啡聞名外，山坡亦有茶園分布。華山步道穿梭林蔭與茶田之間，沿途設觀景平台與在地小茶館，提供清香系台灣烏龍。建議清晨登高看雲瀑，午後坐進窗邊以『清香×輕焙』對比，感受不同焙度的香氣層次，是雲林近郊的輕茶旅選擇。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17392.149014228504!2d120.59317677505527!3d23.59540343909285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ec6b278751315%3A0x9a2817ea83a0a509!2z6I-v5bGxNC0y6Jmf5q2l6YGT!5e0!3m2!1szh-TW!2stw!4v1762479493363!5m2!1szh-TW!2stw' },
    { name: '草嶺石壁生態茶園', feature: '高山烏龍、金萱', description: '草嶺石壁位於阿里山山脈支稜，雲霧終日纏繞，茶園散落山坡。沿產業道路可見層層梯田與雲海，偶有雉雞與藍腹鷴出沒。多數茶農提供莊園茶試飲與簡餐，建議注意山區天候與路況，安排半日或一日慢行程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20679.710036897763!2d120.69662771440639!3d23.615419560119708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346edb727dc56e45%3A0x76dcb8f59da4f797!2z6I2J5ba655-z5aOB5qOu5p6X55mC55mS5Z-65Zyw!5e0!3m2!1szh-TW!2stw!4v1762479536501!5m2!1szh-TW!2stw' },
    { name: '林內鄉親水公園 × 茶風散步', feature: '在地小農烏龍、花草調飲', description: '林內以綠地與自行車道著稱，親水公園周邊聚落有小型茶飲與甜點店，主打在地小農茶款與花草調飲。適合安排親子踏青、騎行與午後午茶，體驗『日常散步×輕品茶』的雲林步調。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58431.99670742603!2d120.57162795691232!3d23.747386749285536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ecbff1f8690c3%3A0x2f0faf57317cede5!2z5p6X5YWn5YWs5ZyS!5e0!3m2!1szh-TW!2stw!4v1762479579971!5m2!1szh-TW!2stw' }
  ],
  '嘉義縣': [
    { name: '梅山太平茶園 × 太平雲梯', feature: '阿里山高山烏龍、金萱、紅茶', description: '太平雲梯銜接山脊視野，俯瞰茶園聚落與雲海。周邊茶莊提供莊園級高山烏龍與金萱，並可預約採茶、揉捻體驗。建議清晨上橋看雲瀑，午后入茶莊做『清香×輕焙』盲品，理解高山風土。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7314.373840982492!2d120.59397336294853!3d23.5617292892656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ec119c7000003%3A0xda8e3412bda787b0!2z5ZiJ576p5qKF5bGx5aSq5bmz6Zuy5qKv!5e0!3m2!1szh-TW!2stw!4v1762479615135!5m2!1szh-TW!2stw' },
    { name: '阿里山茶園公路線', feature: '阿里山高山烏龍、金萱', description: '台18線沿途分布隙頂、石桌等茶區，雲霧繚繞、日夜溫差大，使茶湯甘甜細緻。可於觀景平台遠望茶梯，並進入茶農工坊了解採收與焙火差異。建議搭配祝山觀日出與奮起湖老街。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14643.72846271318!2d120.6441163564171!3d23.426819266840695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ee93c4fee3c65%3A0x5d2717dd24d6467!2zVGVhIGFuZCBNaXN0IFRyYWlsIOiMtumcp-S5i-mBkw!5e0!3m2!1szh-TW!2stw!4v1762479654222!5m2!1szh-TW!2stw' },
    { name: '觸口茶旅驛站 × 逐鹿部落', feature: '高山烏龍、在地特色紅茶', description: '觸口為阿里山門戶，結合逐鹿部落文化展演與在地茶飲。旅人可在驛站品飲阿里山茶並選購伴手禮，再前往部落體驗射箭、手作，形成自然與人文兼具的半日行程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3660.5984735320117!2d120.604000412866!3d23.438867498931593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346eebc035279193%3A0x4df89a3393521eac!2z6Ke45Y-jLeWkqemVt-WcsOS5hemiqOaZr-WNgA!5e0!3m2!1szh-TW!2stw!4v1762479721842!5m2!1szh-TW!2stw' }
  ],
  '台南市': [
    { name: '東山茶咖共融小旅行', feature: '烏龍、紅茶（山區小農茶）', description: '東山丘陵除咖啡外亦有茶園分布，小農茶館提供清香烏龍與手作紅茶。建議沿175線安排山區景觀＋茶咖雙享，午後於觀景台遠眺曾文溪谷。適合駕車慢遊。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14655.488221066345!2d120.3967296466695!3d23.320400489841862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e8f0e3064d83b%3A0xb2b97a75c60f8599!2z5p2x5bGx5pmu5rSx6Iy26I6K!5e0!3m2!1szh-TW!2stw!4v1762479824609!5m2!1szh-TW!2stw' },
    { name: '梅嶺步道 × 山茶午后', feature: '清香烏龍、花草調飲', description: '梅嶺以梅季聞名，步道綠蔭涼爽。沿線可見小茶館供應清香烏龍與花草調飲，適合『步道健行＋下午茶』。梅季人潮旺，建議平日前往。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.632085984069!2d120.55769977114555!3d23.183624418430444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ef512c31a0929%3A0xd01ed114bce09349!2z5qKF5bOw5Y-k6YGT!5e0!3m2!1szh-TW!2stw!4v1762479860435!5m2!1szh-TW!2stw' },
    { name: '關子嶺溫泉 × 茶香慢旅', feature: '在地烏龍、紅茶（輕焙）', description: '安排『泥漿溫泉＋茶館午茶』的療癒行程，先在老溫泉旅館放鬆，再到山區茶館品飲輕焙烏龍或紅茶，感受溫泉與茶香交替的慢活節奏。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7326.832569875222!2d120.50275780744892!3d23.336928286390425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e8d9d8c65f349%3A0xc92a0af1d5ce932a!2z6Zec5a2Q5ba65rqr5rOJ!5e0!3m2!1szh-TW!2stw!4v1762479905164!5m2!1szh-TW!2stw' }
  ],
  '高雄市': [
    { name: '高雄高山茶線 × 寒溪呢步道', feature: '高山烏龍、紅茶（原鄉茶）', description: '沿南橫梅山口上行可見原鄉茶園，空氣清冷、雲瀑壯觀。可走寒溪呢步道看谷地雲海，回到部落茶屋飲高山烏龍或紅茶，體驗原民文化與茶風土。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5185.955395503147!2d120.80013250809364!3d23.20578768347712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346efb0026c20c9d%3A0x773acb31e3150096!2z5Y6f5aeL6Ieq54S26auU6amX!5e0!3m2!1szh-TW!2stw!4v1762480007208!5m2!1szh-TW!2stw' },
    { name: '寶來溫泉 × 山茶午茶', feature: '清香烏龍、紅茶', description: '寶來以溫泉與山谷景致著稱，周邊茶屋供應清香烏龍與手作紅茶。建議安排溫泉泡湯後的山茶午茶，或沿荖濃溪谷散步。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.7072934822104!2d120.69756255190323!3d23.107808542563035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e583cf111aadd%3A0xec4c68cbe33cd37b!2z5a-25L6G5rqr5rOJ6KGX5Y2A!5e0!3m2!1szh-TW!2stw!4v1762480067908!5m2!1szh-TW!2stw' },
    { name: '甲仙山城 × 小農茶館', feature: '在地小農烏龍、紅茶', description: '甲仙山城緩坡小路間有風格小茶館，供應在地小農茶款。可搭配附近步道與特色小吃，形成半日小旅行。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.263278458279!2d120.58645562034602!3d23.08745616025757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e5e90f7d1d3fd%3A0x6ab71159eddcbe83!2z6Zmz5a625Y-L5ZaE6aaZ6I2J5ZySKOeUsuS7mSk!5e0!3m2!1szh-TW!2stw!4v1762480145899!5m2!1szh-TW!2stw' }
  ],
  '屏東縣': [
    { name: '霧台神山 × 茶文化散步', feature: '高山烏龍、紅茶（部落茶）', description: '霧台群山雲霧繚繞，部落茶屋供應原鄉風味茶飲與手作點心。建議參與部落導覽、手作與茶席，在百合花季或雲海季感受山城靜美。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.4121744178647!2d120.72470043827089!3d22.750080114513512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e379079dce675%3A0xe976a33be95c9cf!2z56We5bGx6YOo6JC9!5e0!3m2!1szh-TW!2stw!4v1762480184500!5m2!1szh-TW!2stw' },
    { name: '琉璃珠文化園區 × 山茶午后', feature: '小農烏龍、花草調飲', description: '三地門以琉璃珠與排灣文化著名，園區周邊小店提供在地茶飲與甜點。可結合文化手作與山景品茗，適合親子與文化愛好者。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.3100707279127!2d120.6512924142509!3d22.716713706139807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e3962c8c9fc29%3A0x8eccd78997b5f73d!2z5LiJ5Zyw6ZaA5paH5YyW6aSo!5e0!3m2!1szh-TW!2stw!4v1762480285868!5m2!1szh-TW!2stw' },
    { name: '東源森林 × 小村茶室', feature: '清香烏龍、紅茶', description: '東源森林保留自然湧泉與濕地生態，村內有小茶室供應清香烏龍與紅茶。建議晨間繞行濕地、午後入茶室看山光雲影。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.9139423254956!2d120.85214857589536!3d22.205376546328253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3471cd03b9278d6d%3A0x2cf947cf45259c!2z5p2x5rqQ5qOu5p6X6YGK5qiC5Y2AKOmmqOmmmeajruaelyk!5e0!3m2!1szh-TW!2stw!4v1762480317227!5m2!1szh-TW!2stw' }
  ],
  '台東縣': [
    { name: '鹿野紅烏龍茶園', feature: '紅烏龍、蜜香紅茶', description: '鹿野高台周邊為台東代表茶區，日照充足、日夜溫差大，孕育香濃回甘的紅烏龍。可於茶園品飲並了解重發酵與焙火的製程，建議串聯熱氣球季與龍田綠色隧道。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5197.402477260313!2d121.1142330327756!3d22.908998322976785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346fa506902e17a7%3A0xd428d83156951a1a!2z56Kn6Ji_5ZyS6IyX6Iy25Z2KIEJpbHVveXVhbiBSZWQgT29sb25nIFRlYSB8IOe0heeDj-m-jeWwiOizow!5e0!3m2!1szh-TW!2stw!4v1762480357164!5m2!1szh-TW!2stw' },
    { name: '布農部落 × 山茶文化體驗', feature: '小農烏龍、紅茶（部落茶）', description: '延平山區部落結合農耕體驗與茶席，分享原鄉茶飲與在地餐食。可安排族語歌舞、手作課程與茶席對談，體驗部落生活美學。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1837.5897925187674!2d121.08944093458419!3d22.906746068140375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346faef11fcb890f%3A0x8f22157fc6b0f7!2z5biD6L6y6YOo6JC95LyR6ZaS6L6y5aC0!5e0!3m2!1szh-TW!2stw!4v1762480394154!5m2!1szh-TW!2stw' },
    { name: '池上慢行 × 田園茶點', feature: '清香烏龍、花草調飲', description: '稻田與山脈環抱的池上小鎮，午後在田間小茶室享用清香烏龍與輕甜點，騎單車繞行大坡池與伯朗大道，感受東台灣的從容步調。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7338.777203047436!2d121.20780578840908!3d23.119466942486174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346f0c8addc26d5f%3A0xee172e4e91a0aa48!2z5pus56mA5aC06Kmx5qGR6bq75bel5Z2K77yG5pus56mA5aC05rCR5a6_77yG6Ka66Iy25bel5L2c5a6kICjlu7rorbDpoJDntIQp!5e0!3m2!1szh-TW!2stw!4v1762480457548!5m2!1szh-TW!2stw' }
  ],
  '花蓮縣': [
    { name: '鯉魚潭環潭茶旅', feature: '清香烏龍、紅茶（在地小農）', description: '環潭步道綠意盎然，沿線小店提供在地小農茶與甜點。建議晨划獨木舟、午后湖畔茶席，傍晚看山影入水，是花蓮最溫柔的茶旅節奏。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49066.199726207065!2d121.48254521529645!3d23.929759237982257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468a3b3def39091%3A0x6b9af522ca92e240!2z6a-J6a2a5r2t6aKo5pmv6YGK5oap5Y2A!5e0!3m2!1szh-TW!2stw!4v1762480494364!5m2!1szh-TW!2stw' },
    { name: '金針山雲海 × 茶香小店', feature: '清香烏龍、金萱', description: '花季外的六十石山依舊雲海繚繞，山腰間有供應清香烏龍與金萱的茶香小店。建議清晨登高觀雲海、午後坐進茶席看山光流轉。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14666.632983358748!2d121.29811886759046!3d23.21912215979002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346f6c5c3c213529%3A0x98227cc5e43ddaf0!2z5YWt5Y2B55-z5bGx6YeR6Yed6Iqx5rW3!5e0!3m2!1szh-TW!2stw!4v1762480554075!5m2!1szh-TW!2stw' },
    { name: '砂卡礑步道 × 山谷茶席', feature: '清香烏龍、紅茶', description: '太魯閣峽谷清澈溪流旁的步道，林蔭深邃、岩壁壯麗。行程結束後在山谷茶席喝一杯清香烏龍，讓山風與茶香洗去疲憊。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2574.0518943576644!2d121.61138216845515!3d24.16264438065084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34689b985a2388cf%3A0xdd64e8b10911fe28!2z56CC5Y2h56SR5q2l6YGT!5e0!3m2!1szh-TW!2stw!4v1762480585449!5m2!1szh-TW!2stw' }
  ],
  '宜蘭縣': [
    { name: '望龍埤湖畔茶點', feature: '包種、翠玉、清香烏龍', description: '員山望龍埤群山環抱、湖光如鏡，湖畔咖啡茶點店提供清爽包種與輕食。建議環湖散步或走林中步道，午後在窗邊啜飲淡雅花香的茶湯。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.5953522928326!2d121.69582862566357!3d24.775059493344198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467e34ba1b07a5f%3A0x340f9e9994cdf40f!2z5pyb6b6N5Z-k!5e0!3m2!1szh-TW!2stw!4v1762480631000!5m2!1szh-TW!2stw' },
    { name: '五峰旗瀑布 × 茶食午后', feature: '包種、清香烏龍、花草茶', description: '五峰旗瀑布清涼宜人，沿線店家供應包種與花草茶輕食。可串聯礁溪溫泉，安排『步道＋溫泉＋午茶』的放鬆行程。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.8667225336058!2d121.74447767595159!3d24.834231046305515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467fbbf44b2bb5b%3A0xba349d16eecc911d!2z5LqU5bOw5peX54CR5biD!5e0!3m2!1szh-TW!2stw!4v1762480659233!5m2!1szh-TW!2stw' },
    { name: '外澳沙灘 × 海風茶席', feature: '清香烏龍、冷泡茶', description: '面對龜山島的外澳海灘，黃昏時分於海邊臨時茶席啜飲冷泡茶，聽浪聲、看日落。適合衝浪後或散步後的清爽茶時光。', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14478.362298471044!2d121.83277166307461!3d24.877829413334705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3467f7a7b0c983c3%3A0x76e26a6834543402!2z5aSW5r6z5rKZ54GY!5e0!3m2!1szh-TW!2stw!4v1762480685235!5m2!1szh-TW!2stw' }
  ]
  // 其餘城市請依需要補上 3 筆
})

// 當前展開的口風琴城市與開合狀態
const expandedCity = ref(selectedCity.value)
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

  // 獲取該縣市的三張圖片，如果沒有配置則使用預設圖片
  const cityImgs = cityImages.value[cityName] || [taiwanImg, taiwanAdminImg, taiwanSilhouette]

  slides.value = stores.map((s, idx) => ({
    src: cityImgs[idx] || taiwanImg, // 使用對應縣市的圖片
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

// 滾動到頁面頂部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 口風琴容器引用
const accordionSectionRef = ref(null)

// 文字區塊容器引用
const textContentRef = ref(null)

// 滾動到口風琴區域
const scrollToAccordion = async () => {
  await nextTick()
  if (accordionSectionRef.value) {
    accordionSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 滾動到文字區塊（手機版使用）
const scrollToTextContent = async () => {
  await nextTick()
  if (textContentRef.value) {
    textContentRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 檢測是否為手機版
const isMobile = () => {
  return window.innerWidth <= 768
}

// 處理口風琴點擊事件
const handleAccordionClick = async (cityName) => {
  const wasOpen = accordionOpenMap.value[cityName]  
  // 如果點擊後手風琴要展開（從關閉變為打開）
  if (!wasOpen) {
    // 確保只有這個口風琴打開，其他都收起來
    expandOnlyCity(cityName)
    // 同步選取地圖上的該縣市
    selectedCity.value = cityName
    currentLocation.value = cityName
    showFullTaiwanMap.value = false
    overrideMapUrl.value = null
    expandedCity.value = cityName
    // 重建該縣市的輪播
    rebuildSlidesFromCity(cityName)
  } 
  // 如果點擊後手風琴要收起來（從打開變為關閉）
  else {
    // 手動關閉這個口風琴
    accordionOpenMap.value[cityName] = false
    // 檢查是否所有手風琴都收起來了
    const hasOpenAccordion = Object.values(accordionOpenMap.value).some(open => open === true)
    
    // 如果所有手風琴都收起來了，清除地圖選取狀態並顯示全台地圖
    if (!hasOpenAccordion) {
      selectedCity.value = null
      currentLocation.value = null
      showFullTaiwanMap.value = true
      overrideMapUrl.value = null
      expandedCity.value = null
      // 恢復預設輪播
      slides.value = [
        { src: taiwanImg, alt: '台灣茶葉', title: '茶旅亮點一', description: '探索山海之間的茶香路徑。', mapUrl: '' },
        { src: taiwanAdminImg, alt: '台灣茶葉管理', title: '茶旅亮點二', description: '走入在地茶文化，品味風土。', mapUrl: '' },
        { src: taiwanSilhouette, alt: '台灣本島', title: '茶旅亮點三', description: '踏查茶鄉與人文風景的交會。', mapUrl: '' }
      ]
      currentSlide.value = 0
      applySlideEffects()
    }

    // 切換手風琴狀態
    accordionOpenMap.value[cityName] = !wasOpen

    // 如果點擊後手風琴收起來了，滾動到地圖
    if (wasOpen) {
      // 手風琴從打開變為收起來
      await nextTick()
      scrollToMap()
    }
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

onMounted(() => {
  // 預設不自動播放，僅初始化一次當前投影片效果
  applySlideEffects()
  initAccordionMap()
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
              <svg class="city-markers-overlay" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="cityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a7c59;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2c5530;stop-opacity:1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.3" />
                  </filter>
                </defs>

                <!-- 縣市區域標記 -->
                <g v-for="city in cities" :key="city.name" class="city-marker-group">
                  <!-- 主標記圓圈 -->
                  <circle :cx="city.x" :cy="city.y" :r="city.name === selectedCity ? 2 : 1.5" :fill="city.color"
                    stroke="#ffffff" stroke-width="0.3" class="city-area" @click="selectCity(city.name)"
                    style="cursor: pointer;" />

                  <!-- 內部小圓點 -->
                  <circle :cx="city.x" :cy="city.y" :r="0.6" fill="#ffffff" opacity="0.8" class="city-dot" />
                </g>
              </svg>
            </div>
          </div>
          
          <!-- 縣市列表（顯示在地圖下方） -->
          <div class="city-list">
            <button v-for="city in cities" :key="city.name" class="city-button"
              :class="{ 'active': city.name === selectedCity }" @click="selectCity(city.name)">
              {{ city.name }}
            </button>
          </div>
        </div>
        
        <!-- 右側內容區 -->
        <div class="right-content">
          <!-- 未選取縣市時的提示按鈕 -->
          <button v-if="!selectedCity" class="select-city-prompt" @click="scrollToAccordion">
            <div class="prompt-icon">🗺️</div>
            <h2 class="prompt-title">探索台灣茶鄉</h2>
            <p class="prompt-description">點擊此處選擇縣市，開始您的茶旅之旅</p>
            <div class="prompt-hint">
              <span class="hint-icon">💡</span>
              <span>點擊下方縣市列表或左側地圖快速選擇</span>
            </div>
            <div class="prompt-arrow">↓</div>
          </button>
          
          <!-- 輪播與文字合併容器（選取縣市後顯示） -->
          <Transition name="fade" mode="out-in">
            <div v-if="selectedCity" :key="selectedCity" class="carousel-text-container" ref="textContentRef">
              <!-- 輪播區塊 -->
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
              <!-- 文字內容 -->
              <div class="text-content">
                <h1>{{ slides[currentSlide]?.title || ' ' }}</h1>
                <p class="subtitle">{{ slides[currentSlide]?.alt || ' ' }}</p>
                <p>{{ slides[currentSlide]?.description || ' ' }}</p>
              </div>
            </div>
          </Transition>

          <!-- Google Map 區塊 -->
          <div class="google-map-container" ref="mapSectionRef">
            <div class="google-map-header">
              <h3>地圖導覽</h3>
              <p class="map-location">顯示區域：{{ selectedCity || '全台灣' }}</p>
            </div>
            <div class="google-map">
              <Transition name="fade" mode="out-in">
                <iframe 
                  :key="currentMapUrl"
                  :src="currentMapUrl" 
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </Transition>
            </div>
          </div>
        </div>
      </div>




      <!-- 城市口風琴（只顯示選中城市，展開後列出三個店家） -->
      <div class="events-table-container" ref="accordionSectionRef">
        <div class="table-wrapper">
          <div class="accordion">
            <div 
              class="accordion-item" 
              v-for="city in visibleCities" 
              :key="city.name"
            >
              <button 
                class="accordion-header" 
                @click="handleAccordionClick(city.name)"
                :aria-expanded="accordionOpenMap[city.name]"
              >
                <span class="accordion-title">{{ city.name }} 精選店家（{{ (cityStores[city.name] || []).length }}）</span>
                <span class="accordion-arrow" :class="{ open: accordionOpenMap[city.name] }">▾</span>
              </button>
              <div class="accordion-panel" :class="{ open: accordionOpenMap[city.name] }">
                <ul class="store-list">
                  <li 
                    v-for="(store, idx) in (cityStores[city.name] || [])"
                    :key="store.name || idx"
                    class="store-item"
                    @click="() => { selectedCity = city.name; rebuildSlidesFromCity(city.name); currentSlide = idx; applySlideEffects(); scrollToTop(); }"
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.main-container {
  padding: 60px 40px;
  background: #fafafa;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  animation: fadeIn 0.8s ease-out;
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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  animation: fadeIn 0.8s ease-out;
}

.unified-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(74, 124, 89, 0.03), transparent);
  transition: left 0.5s;
}

.unified-content:hover::before {
  left: 100%;
}

.right-content {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: stretch;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  animation: fadeInRight 0.6s ease-out 0.2s backwards;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.text-content {
  flex: 1;
  min-height: 0;
  text-align: left;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.text-content h1 {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 0.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  position: relative;
  line-height: 1.2;
  animation: fadeInLeft 0.6s ease-out;
  transition: color 0.3s ease;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.text-content .subtitle {
  font-size: 1.1rem;
  color: #666666;
  margin-bottom: 1rem;
  font-weight: 400;
  opacity: 0.8;
  letter-spacing: 0.01em;
  animation: fadeInLeft 0.6s ease-out 0.2s backwards;
  transition: color 0.3s ease;
}

.text-content p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #4a4a4a;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
  animation: fadeInLeft 0.6s ease-out 0.4s backwards;
  transition: color 0.3s ease;
}


/* 選取縣市提示按鈕樣式 */
.select-city-prompt {
  width: 100%;
  max-width: 100%;
  background: linear-gradient(135deg, #4a7c59 0%, #2c5530 100%);
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(44, 85, 48, 0.3);
  padding: 60px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 500px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.select-city-prompt::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.select-city-prompt:hover::before {
  left: 100%;
}

.select-city-prompt:hover {
  background: linear-gradient(135deg, #5a8c69 0%, #3c6540 100%);
  box-shadow: 0 6px 30px rgba(44, 85, 48, 0.4);
  transform: translateY(-3px);
}

.select-city-prompt:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(44, 85, 48, 0.3);
}

.prompt-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.prompt-title {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.prompt-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  margin-bottom: 32px;
  max-width: 500px;
  font-weight: 500;
}

.prompt-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 20px;
}

.hint-icon {
  font-size: 1.2rem;
}

.prompt-arrow {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  animation: bounce 2s ease-in-out infinite;
  margin-top: 10px;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

/* 輪播與文字合併容器 */
.carousel-text-container {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInScale 0.5s ease-out;
  transition: box-shadow 0.3s ease;
}

.carousel-text-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 輪播樣式 */
.carousel-container {
  width: 100%;
  max-width: 100%;
  background-color: transparent;
  padding: 0;
  box-sizing: border-box;
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
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.carousel-slide:hover .carousel-image {
  transform: scale(1.02);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #2c5530, #4a7c59);
  border: 2px solid #ffffff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  box-shadow: 0 6px 20px rgba(44, 85, 48, 0.3);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.indicator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.indicator:hover::before {
  width: 20px;
  height: 20px;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.3);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  animation: indicatorPulse 1.5s ease-in-out infinite;
}

@keyframes indicatorPulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.9);
  }
}

/* 活動表格樣式 */
.events-table-container {
  width: 90%;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.accordion-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeIn 0.4s ease-out backwards;
  margin-bottom: 12px;
}

.accordion-item:nth-child(1) { animation-delay: 0.1s; }
.accordion-item:nth-child(2) { animation-delay: 0.2s; }
.accordion-item:nth-child(3) { animation-delay: 0.3s; }
.accordion-item:nth-child(4) { animation-delay: 0.4s; }
.accordion-item:nth-child(5) { animation-delay: 0.5s; }

.accordion-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
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
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.accordion-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(180deg, #4a7c59, #2c5530);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  transform-origin: bottom;
}

.accordion-header:hover::before {
  transform: scaleY(1);
}

.accordion-header:hover {
  background: linear-gradient(90deg, #f0f8f0, #f9f9f9);
  padding-left: 20px;
  box-shadow: 0 2px 8px rgba(74, 124, 89, 0.1);
}

.accordion-title {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1.15rem;
  letter-spacing: 0.01em;
}

.accordion-arrow {
  transition: transform 0.2s ease;
  color: #1a1a1a;
  font-size: 1.2rem;
  font-weight: bold;
}

.accordion-arrow.open {
  transform: rotate(180deg);
}

.accordion-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: 0;
}

.accordion-panel.open {
  max-height: 1000px;
  opacity: 1;
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  padding: 14px 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out backwards;
}

.store-item:nth-child(1) { animation-delay: 0.1s; }
.store-item:nth-child(2) { animation-delay: 0.2s; }
.store-item:nth-child(3) { animation-delay: 0.3s; }
.store-item:nth-child(4) { animation-delay: 0.4s; }
.store-item:nth-child(5) { animation-delay: 0.5s; }

.store-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #4a7c59, #2c5530);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  transform-origin: top;
}

.store-item:hover::before {
  transform: scaleY(1);
}

.store-item:hover {
  background: linear-gradient(90deg, #f8f9fa, #ffffff);
  border-color: rgba(74, 124, 89, 0.3);
  box-shadow: 0 4px 12px rgba(74, 124, 89, 0.15);
  transform: translateY(-2px) translateX(4px);
  padding-left: 20px;
}

.store-item:active {
  transform: translateY(-1px) translateX(2px);
  box-shadow: 0 2px 6px rgba(74, 124, 89, 0.1);
}

.store-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-size: 1.1rem;
  letter-spacing: 0.01em;
}

.store-spec {
  color: #4a7c59;
  font-size: 0.98rem;
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: 0.01em;
}

.store-desc {
  color: #4a4a4a;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.01em;
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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.map-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  background: linear-gradient(135deg, #f0f8f0, #f5f5f5);
  border-radius: 8px;
  display: inline-block;
  transition: all 0.3s ease;
  border: 1px solid rgba(74, 124, 89, 0.2);
  animation: highlightPulse 2s ease-in-out infinite;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(74, 124, 89, 0);
  }
  50% {
    box-shadow: 0 0 10px rgba(74, 124, 89, 0.2);
  }
}

.taiwan-map-wrapper {
  width: 100%;
  flex: 1;
  min-height: 600px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.taiwan-map-wrapper:hover {
  background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
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
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  animation: fadeInMap 0.5s ease-in-out;
}

@keyframes fadeInMap {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  pointer-events: all;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 85px;
  position: relative;
  overflow: hidden;
}

.city-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(74, 124, 89, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.city-button:hover::before {
  width: 300px;
  height: 300px;
}

.city-button:hover {
  background-color: #f8f9fa;
  border-color: rgba(74, 124, 89, 0.3);
  color: #2c5530;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 124, 89, 0.15);
}

.city-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(74, 124, 89, 0.1);
}

.city-button.active {
  background: linear-gradient(135deg, #4a7c59, #2c5530);
  color: #ffffff;
  border-color: #4a7c59;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(74, 124, 89, 0.3);
  transform: translateY(-1px);
  animation: activeGlow 2s ease-in-out infinite;
}

@keyframes activeGlow {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(74, 124, 89, 0.3);
  }
  50% {
    box-shadow: 0 6px 20px rgba(74, 124, 89, 0.5);
  }
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
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.google-map-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.google-map-header {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  animation: fadeInDown 0.5s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.google-map:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(74, 124, 89, 0.2);
}

.google-map iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 15px;
}

/* 淡入淡出過渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}


@media (max-width: 768px) {
  .app {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  .main-container {
    padding: 40px 20px;
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .unified-content {
    flex-direction: column;
    padding: 20px 15px;
    gap: 20px;
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .map-container {
    width: 100%;
    max-width: 100%;
    padding: 15px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .right-content {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    gap: 20px;
    box-sizing: border-box;
  }

  .text-content {
    text-align: center;
    padding: 0;
  }

  .text-content h1 {
    font-size: 1.4rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
    margin-bottom: 0.6rem;
  }

  .text-content .subtitle {
    font-size: 1rem;
    max-width: 100%;
    word-wrap: break-word;
    margin-bottom: 0.8rem;
  }

  .text-content p {
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 100%;
    word-wrap: break-word;
    margin-bottom: 0.8rem;
  }

  .text-content p::before {
    font-size: 1.2rem;
  }

  .text-content h1::after {
    left: 50%;
    transform: translateX(-50%);
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
  
  .carousel-text-container {
    padding: 15px;
    gap: 15px;
  }
  

  .carousel-slide {
    height: 250px;
  }

  .carousel-slide {
    height: 400px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 24px;
    border-width: 2px;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  .events-table-container {
    padding: 40px 15px;
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .table-wrapper {
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .accordion {
    width: 100%;
    max-width: 100%;
  }
  
  .accordion-header {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    word-wrap: break-word;
  }
  
  .accordion-title {
    word-wrap: break-word;
    overflow-wrap: break-word;
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
    max-width: calc(100% - 30px);
  }
  
  .store-item {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    word-wrap: break-word;
  }
  
  .store-name,
  .store-spec,
  .store-desc {
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
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
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .google-map-header h3 {
    font-size: 24px;
    word-wrap: break-word;
  }

  .map-location {
    font-size: 18px;
    word-wrap: break-word;
  }

  .google-map {
    height: 300px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  
  .select-city-prompt {
    padding: 40px 20px;
    min-height: 400px;
  }
  
  .prompt-icon {
    font-size: 60px;
    margin-bottom: 20px;
  }
  
  .prompt-title {
    font-size: 1.6rem;
    margin-bottom: 12px;
  }
  
  .prompt-description {
    font-size: 1rem;
    margin-bottom: 24px;
    padding: 0 10px;
  }
  
  .prompt-hint {
    padding: 12px 18px;
    font-size: 0.85rem;
    flex-direction: column;
    text-align: center;
    gap: 6px;
    margin-bottom: 16px;
  }
  
  .hint-icon {
    font-size: 1.1rem;
  }
  
  .prompt-arrow {
    font-size: 2rem;
    margin-top: 8px;
  }
  
  .carousel-text-container {
    padding: 12px;
    gap: 12px;
  }
  
  .carousel-container {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .carousel {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .carousel-image {
    width: 100%;
    max-width: 100%;
    height: auto;
    object-fit: cover;
  }
  
  .city-list {
    width: 100%;
    max-width: 100%;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  
  .city-button {
    max-width: 100%;
    box-sizing: border-box;
    word-wrap: break-word;
  }

}
</style>