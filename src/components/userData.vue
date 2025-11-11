<!--結帳畫面後的資料填寫頁面-->
<template>
  <div style="background-color: #f5f5f5; min-height: 100vh; padding-bottom: 50px;">
    <!-- 導覽列 - 固定置頂 -->

    <!-- 添加頂部間距避免被導覽列遮擋 -->
    <div style="padding-top: 10px;"></div>

    <!-- 步驟指示器 -->
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-auto">
          <div class="d-flex align-items-center" style="background: white; padding: 20px 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <!-- 步驟1：已完成 -->
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #28a745; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div style="font-size: 14px; color: #28a745; text-align: center; font-weight: bold;">訂單明細確認</div>
            </div>
            <div style="width: 80px; height: 2px; background-color: #28a745; margin: 0 20px; margin-top: -20px;"></div>
            <!-- 步驟2：當前步驟 -->
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #0066cc; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
              <div style="font-size: 14px; color: #0066cc; text-align: center; font-weight: bold;">填寫付款資料</div>
            </div>
            <div style="width: 80px; height: 2px; background-color: #e0e0e0; margin: 0 20px; margin-top: -20px;"></div>
            <!-- 步驟3：未完成 -->
            <div class="d-flex flex-column align-items-center" style="gap: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #e0e0e0; color: #999; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
              <div style="font-size: 14px; color: #999; text-align: center;">購買完成</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="container">
      <h3 class="mb-3">使用者基本資料</h3>

    <form @submit.prevent="onSubmit" class="card p-3">
      <div class="mb-3">
        <label class="form-label">姓名</label>
        <input type="text" class="form-control" v-model="formName" placeholder="請輸入姓名" required>
      </div>

      <div class="mb-3">
        <label class="form-label">手機</label>
        <input type="tel" class="form-control" v-model="formPhone" placeholder="09xx-xxx-xxx" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="formEmail" placeholder="example@mail.com" required>
      </div>

      <div class="mb-3">
        <label class="form-label">付款方式</label>
        <div class="d-flex gap-3">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="paymentMethod" id="cashOnDelivery" value="貨到付款" v-model="formPaymentMethod">
            <label class="form-check-label" for="cashOnDelivery">
              貨到付款
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="信用卡" v-model="formPaymentMethod">
            <label class="form-check-label" for="creditCard">
              信用卡
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="paymentMethod" id="mobilePayment" value="行動支付" v-model="formPaymentMethod">
            <label class="form-check-label" for="mobilePayment">
              行動支付
            </label>
          </div>
        </div>
      </div>

      <!-- 信用卡卡號 -->
      <div v-if="formPaymentMethod === '信用卡'" class="mb-3">
        <label class="form-label">信用卡卡號</label>
        <input type="text" class="form-control" v-model="formCreditCardNumber" placeholder="請輸入16位卡號" maxlength="19" required>
      </div>

      <div class="mb-3">
        <label class="form-label">配送方式</label>
        <div class="d-flex gap-3">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="deliveryMethod" id="homeDelivery" value="宅配" v-model="formDeliveryMethod">
            <label class="form-check-label" for="homeDelivery">
              宅配
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="deliveryMethod" id="storePickup" value="店到店" v-model="formDeliveryMethod">
            <label class="form-check-label" for="storePickup">
              店到店
            </label>
          </div>
        </div>
      </div>

      <!-- 宅配地址 -->
      <div v-if="formDeliveryMethod === '宅配'" class="mb-3">
        <label class="form-label">配送地址</label>
        <input type="text" class="form-control" v-model="address" placeholder="請輸入配送地址" required>
      </div>

      <!-- 店到店選項 -->
      <div v-if="formDeliveryMethod === '店到店'">
        <div class="mb-3">
          <label class="form-label">選擇便利商店</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="convenienceStore" id="familyMart" value="全家" v-model="formConvenienceStore" @change="onConvenienceStoreChange" required>
              <label class="form-check-label" for="familyMart">
                全家
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="convenienceStore" id="sevenEleven" value="7-ELEVEN" v-model="formConvenienceStore" @change="onConvenienceStoreChange" required>
              <label class="form-check-label" for="sevenEleven">
                7-ELEVEN
              </label>
            </div>
          </div>
        </div>

        <div v-if="formConvenienceStore" class="mb-3">
          <div class="row g-2">
            <div class="col-md-4">
              <label class="form-label">縣市</label>
              <select class="form-select" v-model="formStoreCity" @change="onCityChange" required>
                <option value="">請選擇縣市</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>

            <div class="col-md-4" v-if="formStoreCity">
              <label class="form-label">區</label>
              <select class="form-select" v-model="formStoreDistrict" @change="onDistrictChange" required>
                <option value="">請選擇區</option>
                <option v-for="district in availableDistricts" :key="district" :value="district">{{ district }}</option>
              </select>
            </div>

            <div class="col-md-4" v-if="formStoreDistrict">
              <label class="form-label">門市</label>
              <select class="form-select" v-model="formStoreBranch" required>
                <option value="">請選擇門市</option>
                <option v-for="branch in availableBranches" :key="branch.name" :value="branch.name">
                  {{ branch.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="card p-3 mt-3">
      <h6 class="mb-2">地圖位置</h6>
      <div v-if="mapUrl" class="ratio ratio-16x9">
        <iframe :src="mapUrl" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div v-else class="text-muted">
        <template v-if="formDeliveryMethod === '宅配'">
          請先填寫「配送地址」，以顯示地圖位置。
        </template>
        <template v-else>
          請選擇便利商店和區域，地圖將顯示該區域的所有門市。
        </template>
      </div>
    </div>

    <div class="card p-3 mt-3">
      <h6 class="mb-3">結帳明細（快照）</h6>
      <div v-if="checkoutItems.length > 0">
        <div v-for="item in checkoutItems" :key="item.id" class="d-flex justify-content-between align-items-center mb-2">
          <div class="text-truncate" style="max-width: 70%;">
            <span class="me-1">{{ item.name }}</span>
            <span class="text-muted">× {{ item.quantity }}</span>
          </div>
          <div class="ms-2">${{ (item.price * item.quantity).toLocaleString() }}</div>
        </div>
        <hr class="my-3" />
        <div class="d-flex justify-content-between mb-2">
          <span>商品原價總金額</span>
          <span>${{ snapshotTotal.toLocaleString() }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2" v-if="discountAmount > 0">
          <span class="text-success">折扣金額（碼：{{ usedDiscountCode }}）</span>
          <span class="text-success">- ${{ discountAmount.toLocaleString() }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span class="fw-bold">結帳金額</span>
          <span class="text-danger fw-bold fs-5">${{ finalTotal.toLocaleString() }}</span>
        </div>
      </div>
      <div v-else class="text-muted">尚未有結帳快照，請至結帳頁點擊結帳。</div>
    </div>

    <div class="d-flex gap-2 mt-3 justify-content-between">
      <button type="button" class="btn btn-outline-secondary" @click="onReset">重置</button>
      <button type="submit" class="btn btn-primary" @click="onSubmit">訂單確認</button>
    </div>
    </div>
  </div>

  <!-- 訂單確認 Modal -->
  <div v-if="showConfirmModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg confirm-modal-position">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">訂單確認</h5>
          <button type="button" class="btn-close btn-close-white" @click="closeConfirmModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <h6 class="text-primary mb-3">訂單資訊</h6>
            <div class="row mb-2">
              <div class="col-4 text-muted">姓名</div>
              <div class="col-8 fw-bold">{{ formName }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted">電話</div>
              <div class="col-8 fw-bold">{{ formPhone }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted">Email</div>
              <div class="col-8 fw-bold">{{ formEmail }}</div>
            </div>
          </div>

          <div class="mb-4">
            <div class="row mb-2">
              <div class="col-4 text-muted">付款方式</div>
              <div class="col-8 fw-bold">{{ formPaymentMethod }}</div>
            </div>
            <div v-if="formPaymentMethod === '信用卡'" class="row mb-2">
              <div class="col-4 text-muted">信用卡卡號</div>
              <div class="col-8 fw-bold">{{ maskCreditCard(formCreditCardNumber) }}</div>
            </div>
          </div>

          <div class="mb-4">
            <div class="row mb-2">
              <div class="col-4 text-muted">配送方式</div>
              <div class="col-8 fw-bold">{{ formDeliveryMethod }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted">收件地址</div>
              <div class="col-8 fw-bold">{{ deliveryAddressDisplay }}</div>
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center p-3" style="background-color: #f8f9fa; border-radius: 8px;">
              <span class="fw-bold fs-5">總金額</span>
              <span class="text-danger fw-bold fs-3">${{ finalTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeConfirmModal">取消</button>
          <button type="button" class="btn btn-primary" @click="confirmOrder">確認送出訂單</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserDataStore } from '../store/userData'
  import { cities, districtsData, branchesData } from '../store/branchData'
import { useRouter } from 'vue-router'

const userDataStore = useUserDataStore()
const { name, address, phone, email, paymentMethod, creditCardNumber, deliveryMethod, convenienceStore, storeCity, storeDistrict, storeBranch, checkoutItems, usedDiscountCode } = storeToRefs(userDataStore)
const router = useRouter()

// 使用本地表單狀態，提交時一次性寫回 store
const formName = ref<string>('')
const formPhone = ref<string>('')
const formEmail = ref<string>('')
const formPaymentMethod = ref<'貨到付款' | '信用卡' | '行動支付'>('貨到付款')
const formCreditCardNumber = ref<string>('')
const formDeliveryMethod = ref<'宅配' | '店到店'>('宅配')
const formConvenienceStore = ref<'全家' | '7-ELEVEN' | ''>('')
const formStoreCity = ref<string>('')
const formStoreDistrict = ref<string>('')
const formStoreBranch = ref<string>('')

// Modal 控制
const showConfirmModal = ref<boolean>(false)

// 初始化表單內容 = 目前 store 內容
watchEffect(() => {
  formName.value = name.value
  formPhone.value = phone.value
  formEmail.value = email.value
  formPaymentMethod.value = paymentMethod.value
  formCreditCardNumber.value = creditCardNumber.value
  formDeliveryMethod.value = deliveryMethod.value
  formConvenienceStore.value = convenienceStore.value
  formStoreCity.value = storeCity.value
  formStoreDistrict.value = storeDistrict.value
  formStoreBranch.value = storeBranch.value
})

// 可用的區域列表（根據選擇的縣市）
const availableDistricts = computed(() => {
  if (!formStoreCity.value) return []
  return districtsData[formStoreCity.value] || []
})

// 可用的門市列表（根據便利商店品牌、縣市和區）
const availableBranches = computed(() => {
  if (!formConvenienceStore.value || !formStoreCity.value || !formStoreDistrict.value) return []
  const storeType = formConvenienceStore.value as '全家' | '7-ELEVEN'
  return branchesData[storeType]?.[formStoreCity.value]?.[formStoreDistrict.value] || []
})

// 獲取選中門市的完整地址
const selectedBranchAddress = computed(() => {
  if (!formStoreBranch.value || availableBranches.value.length === 0) return ''
  const branch = availableBranches.value.find(b => b.name === formStoreBranch.value)
  return branch?.address || ''
})

// 便利商店改變時，只重置門市（保留縣市和區的選擇）
function onConvenienceStoreChange() {
  formStoreBranch.value = ''
}

// 縣市改變時，重置區和門市
function onCityChange() {
  formStoreDistrict.value = ''
  formStoreBranch.value = ''
}

// 區改變時，重置門市
function onDistrictChange() {
  formStoreBranch.value = ''
}

// 收件地址顯示
const deliveryAddressDisplay = computed(() => {
  if (formDeliveryMethod.value === '宅配') {
    return address.value || '未填寫'
  } else if (formDeliveryMethod.value === '店到店') {
    if (formStoreBranch.value && selectedBranchAddress.value) {
      return `${formConvenienceStore.value} ${formStoreBranch.value} - ${selectedBranchAddress.value}`
    } else if (formStoreCity.value && formStoreDistrict.value) {
      return `${formConvenienceStore.value} ${formStoreCity.value}${formStoreDistrict.value}`
    } else {
      return '未完整填寫'
    }
  }
  return '未填寫'
})

// 遮罩信用卡號（顯示前6後4）
function maskCreditCard(cardNumber: string) {
  if (!cardNumber) return ''
  const cleaned = cardNumber.replace(/\s/g, '')
  if (cleaned.length <= 10) return cardNumber
  const first6 = cleaned.substring(0, 6)
  const last4 = cleaned.substring(cleaned.length - 4)
  const masked = '*'.repeat(cleaned.length - 10)
  return `${first6}${masked}${last4}`
}

function onSubmit() {
  // 先儲存到store
  userDataStore.setBasicInfo({
    name: formName.value,
    address: address.value,
    phone: formPhone.value,
    email: formEmail.value,
    paymentMethod: formPaymentMethod.value,
    creditCardNumber: formPaymentMethod.value === '信用卡' ? formCreditCardNumber.value : undefined,
    deliveryMethod: formDeliveryMethod.value,
    convenienceStore: formDeliveryMethod.value === '店到店' && formConvenienceStore.value ? formConvenienceStore.value as '全家' | '7-ELEVEN' : undefined,
    storeCity: formDeliveryMethod.value === '店到店' ? formStoreCity.value : undefined,
    storeDistrict: formDeliveryMethod.value === '店到店' ? formStoreDistrict.value : undefined,
    storeBranch: formDeliveryMethod.value === '店到店' ? formStoreBranch.value : undefined
  })

  // 顯示確認modal
  showConfirmModal.value = true
}

// 關閉確認modal
function closeConfirmModal() {
  showConfirmModal.value = false
}

// 確認訂單
function confirmOrder() {
  showConfirmModal.value = false
  // 跳轉到訂單完成頁面
  router.push('/order-completed')
}

function onReset() {
  // 只重置基本資料，保留結帳明細
  userDataStore.resetBasicInfo()
  // 同時重置本地表單狀態
  formName.value = ''
  formPhone.value = ''
  formEmail.value = ''
  formPaymentMethod.value = '貨到付款'
  formCreditCardNumber.value = ''
  formDeliveryMethod.value = '宅配'
  formConvenienceStore.value = ''
  formStoreCity.value = ''
  formStoreDistrict.value = ''
  formStoreBranch.value = ''
}

// 結帳快照金額（與 Checkout 頁一致：碼 666 打九折）
const snapshotTotal = computed(() => checkoutItems.value.reduce((t, i) => t + i.price * i.quantity, 0))
const discountAmount = computed(() => usedDiscountCode.value === '666' ? Math.round(snapshotTotal.value * 0.1) : 0)
const finalTotal = computed(() => Math.max(0, snapshotTotal.value - discountAmount.value))

// Google Map 位置（根據配送方式顯示不同地址）
const mapUrl = computed(() => {
  if (formDeliveryMethod.value === '宅配') {
    // 宅配：使用配送地址的簡單查詢
    const q = address.value?.trim() || ''
    if (!q) return ''
    return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
  } else if (formDeliveryMethod.value === '店到店') {
    // 店到店模式
    if (!formConvenienceStore.value) return ''

    if (formStoreBranch.value && selectedBranchAddress.value) {
      // 情況1：已選擇具體門市 - 顯示該門市的詳細資訊
      const placeName = formStoreBranch.value
      const placeAddress = selectedBranchAddress.value
      const searchQuery = `${placeName}, ${placeAddress}`

      // 顯示該商家的詳細資訊面板（評分、照片、營業時間等）
      return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } else if (formStoreCity.value && formStoreDistrict.value) {
      // 情況2：已選擇區域但尚未選擇門市 - 顯示該區域所有該品牌門市
      const brandName = formConvenienceStore.value
      const location = `${formStoreCity.value}${formStoreDistrict.value}`
      const searchQuery = `${brandName} ${location}`

      // 搜尋該區域的所有門市，例如："全家 台北市中正區" 或 "7-ELEVEN 桃園市中壢區"
      return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } else if (formStoreCity.value) {
      // 情況3：只選擇了縣市 - 顯示該縣市所有該品牌門市
      const brandName = formConvenienceStore.value
      const searchQuery = `${brandName} ${formStoreCity.value}`

      return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }
  }

  return ''
})

// 導覽列導航函數
function goToShopping() {
  router.push('/')
}

function goToCheckout() {
  router.push('/store')
}

function goToShopping4() {
  router.push('/')
}
</script>

<style scoped>
.nav-link {
  color: #333;
}

.nav-link:hover {
  color: #0066cc;
}

.confirm-modal-position {
  margin-top: 100px;
  margin-bottom: 30px;
}
</style>


