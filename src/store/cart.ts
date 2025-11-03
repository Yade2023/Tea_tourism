import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 商品類型定義
export interface Product {
  id: number
  name: string
  price: number
  category: string
  savorImage: string
  TeaName: string
  image?: string
  description?: string
}

// 購物車商品類型
export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // 購買列表（儲存商品 ID）
  const buyList = ref<number[]>([])
  // 當前被勾選的商品（以商品 id 唯一，不重覆）
  const selectedIds = ref<number[]>([])
  // 折扣碼（例如輸入 666 打九折）
  const discountCode = ref<string>('')

  // 商品資料庫
  const products = ref<Product[]>([
    { id: 1, name: '紅茶', price: 30, category: '經典茶品', savorImage: '/images/HerbalTea/savor01.jpg', TeaName: '/images/TeaName/special01.jpg' },
    { id: 2, name: '東方美人', price: 25, category: '經典茶品', savorImage: '/images/HerbalTea/savor02.jpg', TeaName: '/images/TeaName/special02.jpg' },
    { id: 3, name: '綠茶', price: 40, category: '經典茶品', savorImage: '/images/HerbalTea/savor03.jpg', TeaName: '/images/TeaName/special03.jpg' },
    { id: 4, name: '包種茶', price: 50, category: '經典茶品', savorImage: '/images/HerbalTea/savor04.jpg', TeaName: '/images/TeaName/special04.jpg' },
    { id: 5, name: '焙相烏龍茶', price: 35, category: '烏龍茶系列', savorImage: '/images/HerbalTea/savor05.jpg', TeaName: '/images/TeaName/special05.jpg' },
    { id: 6, name: '烏龍茶', price: 35, category: '烏龍茶系列', savorImage: '/images/HerbalTea/savor06.jpg', TeaName: '/images/TeaName/special06.jpg' },
    { id: 7, name: '元氣茶', price: 45, category: '烏龍茶系列', savorImage: '/images/HerbalTea/savor07.jpg', TeaName: '/images/TeaName/special07.jpg' },
    { id: 8, name: '茉莉綠茶', price: 55, category: '烏龍茶系列', savorImage: '/images/HerbalTea/savor08.jpg', TeaName: '/images/TeaName/special08.jpg' },
    { id: 9, name: '梅花鹿綠茶', price: 40, category: '特色茶品', savorImage: '/images/HerbalTea/savor09.jpg', TeaName: '/images/TeaName/special9.jpg' },
    { id: 10, name: '橙心橙意柚藤茶', price: 50, category: '特色茶品', savorImage: '/images/HerbalTea/savor10.jpg', TeaName: '/images/TeaName/special10.jpg' },
    { id: 11, name: '鐵觀音', price: 40, category: '特色茶品', savorImage: '/images/HerbalTea/savor11.jpg', TeaName: '/images/TeaName/special11.jpg' },
    { id: 12, name: '花茶', price: 40, category: '特色茶品', savorImage: '/images/HerbalTea/savor12.jpg', TeaName: '/images/TeaName/special12.jpg' },

  ])

  // 顯示列表（包含數量的商品列表）
  const showList = computed<CartItem[]>(() => {
    const result: CartItem[] = []
    const productCount: Record<number, number> = {}

    // 統計每個商品出現的次數
    buyList.value.forEach((productId) => {
      productCount[productId] = (productCount[productId] || 0) + 1
    })

    // 生成顯示列表並計算總價
    Object.keys(productCount).forEach((productIdStr) => {
      const productId = Number(productIdStr)
      const product = products.value.find((p) => p.id === productId)

      if (product && product.price !== undefined) {
        const quantity = productCount[productId]
        result.push({
          ...product,
          quantity
        })
      }
    })

    return result
  })

  // 當顯示列表變更時，預設全選目前存在於購物車的商品
  watch(
    showList,
    (list) => {
      const visibleIds = list.map((i) => i.id)
      // 僅保留仍存在的勾選，並自動將新出現的商品加入勾選
      const current = new Set(selectedIds.value.filter((id) => visibleIds.includes(id)))
      visibleIds.forEach((id) => current.add(id))
      selectedIds.value = Array.from(current)
    },
    { immediate: true }
  )

  // 計算總價
  const totalPrice = computed(() => {
    return showList.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  // 依勾選計算的顯示清單與總價
  const selectedShowList = computed<CartItem[]>(() => {
    const selectedSet = new Set(selectedIds.value)
    return showList.value.filter((item) => selectedSet.has(item.id))
  })

  const selectedTotalPrice = computed(() => {
    return selectedShowList.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  // 折扣計算：輸入 666 => 打九折
  const discountAmount = computed(() => {
    if (discountCode.value === '666') {
      return Math.round(selectedTotalPrice.value * 0.1)
    }
    return 0
  })

  const finalTotalPrice = computed(() => {
    return Math.max(0, selectedTotalPrice.value - discountAmount.value)
  })

  // 判斷是否「全選」：所有顯示中的商品，其 id 都存在於 selectedIds
  const allSelected = computed(() => {
    if (showList.value.length === 0) return false
    const selectedSet = new Set(selectedIds.value)
    return showList.value.every((item) => selectedSet.has(item.id))
  })

  // 設定單一商品的勾選狀態
  function setSelect(productId: number, checked: boolean) {
    const set = new Set(selectedIds.value)
    if (checked) set.add(productId)
    else set.delete(productId)
    selectedIds.value = Array.from(set)
  }

  // 切換單一商品的勾選狀態（選到就取消，未選則加入）
  function toggleSelect(productId: number) {
    const set = new Set(selectedIds.value)
    if (set.has(productId)) set.delete(productId)
    else set.add(productId)
    selectedIds.value = Array.from(set)
  }

  // 設定全選/全不選
  function setAllSelected(checked: boolean) {
    if (checked) selectedIds.value = showList.value.map((i) => i.id)
    else selectedIds.value = []
  }

  // 檢查特定商品是否被勾選
  function isSelected(productId: number): boolean {
    return selectedIds.value.includes(productId)
  }

  // 添加商品到購物車
  function addToCart(productId: number) {
    buyList.value.push(productId)
  }

  // 移除商品（根據 ID）
  function removeFromCart(productId: number) {
    const index = buyList.value.indexOf(productId)
    if (index > -1) {
      buyList.value.splice(index, 1)
    }
  }

  // 清空購物車
  function clearCart() {
    buyList.value = []
    selectedIds.value = []
  }

  // 獲取指定商品的數量
  function getProductQuantity(productId: number): number {
    return buyList.value.filter((id) => id === productId).length
  }

  // 根據 ID 獲取商品資訊
  function getProduct(productId: number): Product | undefined {
    return products.value.find((p) => p.id === productId)
  }

  return {
    products,
    buyList,
    showList,
    totalPrice,
    selectedIds,
    selectedShowList,
    selectedTotalPrice,
    discountCode,
    discountAmount,
    finalTotalPrice,
    allSelected,
    addToCart,
    removeFromCart,
    clearCart,
    getProductQuantity,
    getProduct,
    setSelect,
    toggleSelect,
    setAllSelected,
    isSelected
  }
})

