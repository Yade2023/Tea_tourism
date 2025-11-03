import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CartItem } from './cart'

export interface UserBasicInfo {
  name: string
  address: string
  phone: string
  email: string
}

export const useUserDataStore = defineStore('userData', () => {
  // 使用者基本資料
  const name = ref<string>('')
  const address = ref<string>('')
  const phone = ref<string>('')
  const email = ref<string>('')

  // 結帳明細（來自 Checkout.vue 當下的勾選清單快照）
  const checkoutItems = ref<CartItem[]>([])

  // 使用的優惠碼（下單時實際使用的紀錄）
  const usedDiscountCode = ref<string>('')

  function setBasicInfo(info: Partial<UserBasicInfo>) {
    if (typeof info.name === 'string') name.value = info.name
    if (typeof info.address === 'string') address.value = info.address
    if (typeof info.phone === 'string') phone.value = info.phone
    if (typeof info.email === 'string') email.value = info.email
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
    clearCheckoutSnapshot()
  }

  return {
    // state
    name,
    address,
    phone,
    email,
    checkoutItems,
    usedDiscountCode,
    // actions
    setBasicInfo,
    setCheckoutSnapshot,
    clearCheckoutSnapshot,
    resetAll
  }
})


