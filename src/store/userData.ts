import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CartItem } from './cart'

export interface UserBasicInfo {
  name: string
  address: string
  phone: string
  email: string
  paymentMethod: '貨到付款' | '信用卡' | '行動支付'
  creditCardNumber?: string
  deliveryMethod: '宅配' | '店到店'
  convenienceStore?: '全家' | '7-ELEVEN'
  storeCity?: string
  storeDistrict?: string
  storeBranch?: string
}

export const useUserDataStore = defineStore('userData', () => {
  // 使用者基本資料
  const name = ref<string>('')
  const address = ref<string>('')
  const phone = ref<string>('')
  const email = ref<string>('')
  const paymentMethod = ref<'貨到付款' | '信用卡' | '行動支付'>('貨到付款')
  const creditCardNumber = ref<string>('')
  const deliveryMethod = ref<'宅配' | '店到店'>('宅配')
  const convenienceStore = ref<'全家' | '7-ELEVEN' | ''>('')
  const storeCity = ref<string>('')
  const storeDistrict = ref<string>('')
  const storeBranch = ref<string>('')

  // 結帳明細（來自 Checkout.vue 當下的勾選清單快照）
  const checkoutItems = ref<CartItem[]>([])

  // 使用的優惠碼（下單時實際使用的紀錄）
  const usedDiscountCode = ref<string>('')

  function setBasicInfo(info: Partial<UserBasicInfo>) {
    if (typeof info.name === 'string') name.value = info.name
    if (typeof info.address === 'string') address.value = info.address
    if (typeof info.phone === 'string') phone.value = info.phone
    if (typeof info.email === 'string') email.value = info.email
    if (info.paymentMethod) paymentMethod.value = info.paymentMethod
    if (info.creditCardNumber !== undefined) creditCardNumber.value = info.creditCardNumber || ''
    if (info.deliveryMethod) deliveryMethod.value = info.deliveryMethod
    if (info.convenienceStore !== undefined) convenienceStore.value = info.convenienceStore || ''
    if (info.storeCity !== undefined) storeCity.value = info.storeCity || ''
    if (info.storeDistrict !== undefined) storeDistrict.value = info.storeDistrict || ''
    if (info.storeBranch !== undefined) storeBranch.value = info.storeBranch || ''
  }

  function setCheckoutSnapshot(items: CartItem[], discountCode: string) {
    // 存快照，避免後續購物車變動影響當次結帳明細
    checkoutItems.value = items.map((it) => ({ ...it }))
    usedDiscountCode.value = discountCode || ''
  }

  function clearCheckoutSnapshot() {
    checkoutItems.value = []
    usedDiscountCode.value = ''
  }

  function resetAll() {
    name.value = ''
    address.value = ''
    phone.value = ''
    email.value = ''
    paymentMethod.value = '貨到付款'
    creditCardNumber.value = ''
    deliveryMethod.value = '宅配'
    convenienceStore.value = ''
    storeCity.value = ''
    storeDistrict.value = ''
    storeBranch.value = ''
    clearCheckoutSnapshot()
  }

  return {
    // state
    name,
    address,
    phone,
    email,
    paymentMethod,
    creditCardNumber,
    deliveryMethod,
    convenienceStore,
    storeCity,
    storeDistrict,
    storeBranch,
    checkoutItems,
    usedDiscountCode,
    // actions
    setBasicInfo,
    setCheckoutSnapshot,
    clearCheckoutSnapshot,
    resetAll
  }
})


