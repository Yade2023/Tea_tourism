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
  // Session Storage 的鍵名
  const STORAGE_KEY = 'shopping_cart_data'

  // 從 Session Storage 載入資料
  const loadFromSession = () => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY)
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (error) {
      console.error('讀取 Session Storage 失敗:', error)
    }
    return null
  }

  // 儲存資料到 Session Storage
  const saveToSession = (data: { buyList: number[], selectedIds: number[], discountCode: string }) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('儲存到 Session Storage 失敗:', error)
    }
  }

  // 載入之前儲存的資料
  const savedData = loadFromSession()

  // 購買列表（儲存商品 ID）
  const buyList = ref<number[]>(savedData?.buyList || [])
  // 當前被勾選的商品（以商品 id 唯一，不重覆）
  const selectedIds = ref<number[]>(savedData?.selectedIds || [])
  // 折扣碼（例如輸入 666 打九折）
  const discountCode = ref<string>(savedData?.discountCode || '')

  // 商品資料庫
  const products = ref<Product[]>([
    {
      id: 1,
      name: '紅茶',
      price: 30,
      category: '經典茶品',
      savorImage: 'images/HerbalTea/savor01.jpg',
      TeaName: 'images/TeaName/special01.jpg',
      description: '經典台灣紅茶，茶湯色澤紅潤明亮，香氣濃郁甘醇，口感滑順回甘，是最受歡迎的日常茶飲。'
    },
    {
      id: 2,
      name: '東方美人',
      price: 25,
      category: '經典茶品',
      savorImage: 'images/HerbalTea/savor02.jpg',
      TeaName: 'images/TeaName/special02.jpg',
      description: '又稱白毫烏龍，獨特的蜜香與果香交織，茶湯呈現琥珀色澤，口感甘甜滑潤，是台灣特有的頂級茶品。'
    },
    {
      id: 3,
      name: '綠茶',
      price: 40,
      category: '經典茶品',
      savorImage: 'images/HerbalTea/savor03.jpg',
      TeaName: 'images/TeaName/special03.jpg',
      description: '清新自然的綠茶，茶葉保留豐富的兒茶素，茶湯清澈碧綠，帶有清新的草木香氣，口感鮮爽回甘。'
    },
    {
      id: 4,
      name: '包種茶',
      price: 50,
      category: '經典茶品',
      savorImage: 'images/HerbalTea/savor04.jpg',
      TeaName: 'images/TeaName/special04.jpg',
      description: '文山包種茶，擁有優雅的花香與清香，茶湯金黃透亮，口感清雅細膩，是台灣輕發酵茶的代表作。'
    },
    {
      id: 5,
      name: '焙相烏龍茶',
      price: 35,
      category: '烏龍茶系列',
      savorImage: 'images/HerbalTea/savor05.jpg',
      TeaName: 'images/TeaName/special05.jpg',
      description: '經過精心烘焙的烏龍茶，帶有獨特的焙火香氣，茶湯琥珀色澤，口感醇厚溫潤，喉韻深長。'
    },
    {
      id: 6,
      name: '烏龍茶',
      price: 35,
      category: '烏龍茶系列',
      savorImage: 'images/HerbalTea/savor06.jpg',
      TeaName: 'images/TeaName/special06.jpg',
      description: '傳統烏龍茶，半發酵工藝造就獨特韻味，茶香濃郁持久，茶湯金黃明亮，口感甘醇順口。'
    },
    {
      id: 7,
      name: '元氣茶',
      price: 45,
      category: '烏龍茶系列',
      savorImage: 'images/HerbalTea/savor07.jpg',
      TeaName: 'images/TeaName/special07.jpg',
      description: '精選烏龍茶搭配天然草本，充滿活力的茶飲，帶來清新舒暢的口感，適合需要提神醒腦的時刻。'
    },
    {
      id: 8,
      name: '茉莉綠茶',
      price: 55,
      category: '烏龍茶系列',
      savorImage: 'images/HerbalTea/savor08.jpg',
      TeaName: 'images/TeaName/special08.jpg',
      description: '綠茶與新鮮茉莉花完美融合，花香四溢，茶湯清澈翠綠，口感清新甘甜，帶有優雅的茉莉花香。'
    },
    {
      id: 9,
      name: '梅花鹿綠茶',
      price: 40,
      category: '特色茶品',
      savorImage: 'images/HerbalTea/savor09.jpg',
      TeaName: 'images/TeaName/special9.jpg',
      description: '融合台灣在地特色的創意茶飲，清新的綠茶基底搭配特殊風味，口感獨特令人驚艷。'
    },
    {
      id: 10,
      name: '橙心橙意柚藤茶',
      price: 50,
      category: '特色茶品',
      savorImage: 'images/HerbalTea/savor10.jpg',
      TeaName: 'images/TeaName/special10.jpg',
      description: '柑橘香氣與茶韻的完美結合，帶有清新的果香，茶湯橙黃透亮，口感酸甜平衡，清爽宜人。'
    },
    {
      id: 11,
      name: '鐵觀音',
      price: 40,
      category: '特色茶品',
      savorImage: 'images/HerbalTea/savor11.jpg',
      TeaName: 'images/TeaName/special11.jpg',
      description: '經典鐵觀音茶，獨特的觀音韻，茶湯金黃濃郁，帶有蘭花香氣，口感醇厚甘甜，韻味悠長。'
    },
    {
      id: 12,
      name: '花茶',
      price: 40,
      category: '特色茶品',
      savorImage: 'images/HerbalTea/savor12.jpg',
      TeaName: 'images/TeaName/special12.jpg',
      description: '多種天然花卉調配而成，色彩繽紛，花香濃郁，茶湯清透，口感芬芳甘甜，視覺與味覺的雙重享受。'
    }
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
        const quantity = productCount[productId] || 0
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

  // 清除已結帳的商品（根據商品ID和數量）
  function removeCheckedOutItems(checkedOutItems: CartItem[]) {
    checkedOutItems.forEach((item) => {
      // 移除指定數量的商品
      for (let i = 0; i < item.quantity; i++) {
        removeFromCart(item.id)
      }
      // 從選取列表中移除
      const set = new Set(selectedIds.value)
      set.delete(item.id)
      selectedIds.value = Array.from(set)
    })
  }

  // 獲取指定商品的數量
  function getProductQuantity(productId: number): number {
    return buyList.value.filter((id) => id === productId).length
  }

  // 根據 ID 獲取商品資訊
  function getProduct(productId: number): Product | undefined {
    return products.value.find((p) => p.id === productId)
  }

  // 設定商品數量
  function setProductQuantity(productId: number, quantity: number) {
    // 確保數量為非負整數
    const targetQuantity = Math.max(0, Math.floor(quantity))
    const currentQuantity = getProductQuantity(productId)

    if (targetQuantity === currentQuantity) return

    if (targetQuantity > currentQuantity) {
      // 需要增加
      const diff = targetQuantity - currentQuantity
      for (let i = 0; i < diff; i++) {
        buyList.value.push(productId)
      }
    } else {
      // 需要減少
      const diff = currentQuantity - targetQuantity
      for (let i = 0; i < diff; i++) {
        removeFromCart(productId)
      }
    }
  }

  // 監聽購物車資料變化，自動儲存到 Session Storage
  watch(
    [buyList, selectedIds, discountCode],
    () => {
      saveToSession({
        buyList: buyList.value,
        selectedIds: selectedIds.value,
        discountCode: discountCode.value
      })
    },
    { deep: true }
  )

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
    removeCheckedOutItems,
    getProductQuantity,
    getProduct,
    setProductQuantity,
    setSelect,
    toggleSelect,
    setAllSelected,
    isSelected
  }
})

