<template>
  <!-- Bootstrap Modal 互動視窗 -->
  <Transition name="modal">
    <div v-if="showModal" class="modal-backdrop" @click="onBackdropClick">
      <div class="modal-dialog modal-lg modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" @click="handleClose" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="product">
            <!-- 上部分：savorImage 照片 -->
            <div class="row mb-3">
              <div class="col-12 text-center">
                <img :src="getImageUrl(product.savorImage)" class="img-fluid rounded savor-image-modal" :alt="product.name + ' savor'">
              </div>
            </div>
            <!-- 下部分：TeaName 和商品資訊 -->
            <div class="row">
              <div class="col-md-6 mb-3 mb-md-0">
                <img :src="getImageUrl(product.TeaName)" class="img-fluid rounded tea-name-image-modal" :alt="product.name">
              </div>
              <div class="col-md-6">
                <h5>{{ product.name }}</h5>
                <p class="text-muted">價格：NT$ {{ product.price }}</p>
                <p class="text-muted">分類：{{ product.category }}</p>
                <!-- 數量增減控制 -->
                <div class="quantity-control-modal mb-3">
                  <label class="form-label mb-2">數量：</label>
                  <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-outline-secondary btn-sm"
                      @click="handleDecreaseQuantity" :disabled="currentQuantity <= 0">
                      -
                    </button>
                    <input type="number" class="mx-3 quantity-input-modal"
                      :value="currentQuantity"
                      @input="handleQuantityInput"
                      @blur="handleQuantityBlur"
                      min="0"
                      step="1">
                    <button type="button" class="btn btn-outline-secondary btn-sm"
                      @click="handleIncreaseQuantity">
                      +
                    </button>
                  </div>
                </div>
                <button
                  v-if="showAddToCartButton"
                  type="button"
                  class="btn btn-primary btn-lg w-100"
                  @click="handleAddToCart">
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { getImageUrl } from '../utils/imageHelper'

// 定義 Props
interface Props {
  showModal: boolean
  product: any | null
  currentQuantity: number
  showAddToCartButton?: boolean  // 是否顯示「加入購物車」按鈕，預設為 true
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCartButton: true
})

// 定義 Emits
const emit = defineEmits<{
  'update:showModal': [value: boolean]
  'close': []
  'increaseQuantity': []
  'decreaseQuantity': []
  'addToCart': []
  'setQuantity': [quantity: number]
}>()

// 關閉 modal
const handleClose = () => {
  document.body.style.overflow = 'auto'
  emit('update:showModal', false)
  emit('close')
}

// 點擊背景關閉
const onBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
    handleClose()
  }
}

// 增加數量
const handleIncreaseQuantity = () => {
  emit('increaseQuantity')
}

// 減少數量
const handleDecreaseQuantity = () => {
  emit('decreaseQuantity')
}

// 加入購物車
const handleAddToCart = () => {
  emit('addToCart')
}

// 處理數量輸入（即時連動）
const handleQuantityInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const inputValue = target.value

  // 允許空字串（正在刪除時）
  if (inputValue === '') {
    emit('setQuantity', 0)
    return
  }

  // 解析輸入值
  const value = parseInt(inputValue)

  // 如果輸入無效，不做任何處理（讓用戶繼續輸入）
  if (isNaN(value)) {
    return
  }

  // 確保數量為非負整數
  if (value < 0) {
    target.value = '0'
    emit('setQuantity', 0)
    return
  }

  // 即時更新數量
  emit('setQuantity', value)
}

// 處理失去焦點事件（確保顯示正確的數量）
const handleQuantityBlur = (event: Event) => {
  const target = event.target as HTMLInputElement

  // 如果輸入為空或無效，重置為當前數量
  if (target.value === '' || isNaN(parseInt(target.value))) {
    target.value = props.currentQuantity.toString()
  } else {
    // 確保顯示與實際數量一致
    target.value = props.currentQuantity.toString()
  }
}

// 處理 ESC 鍵關閉 modal
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.showModal) {
    handleClose()
  }
}

// 監聽 showModal 變化，控制背景滾動
watch(() => props.showModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

// 組件掛載時添加鍵盤監聽
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

// 組件卸載前移除監聽器
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* ===== Modal 彈窗樣式 ===== */

/* Modal 背景遮罩層 */
.modal-backdrop {
  position: fixed;                      /* 固定定位 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;                        /* 彈性佈局 */
  align-items: center;                  /* 垂直置中 */
  justify-content: center;              /* 水平置中 */
  z-index: 1050;                        /* 確保在最上層 */
  padding: 1rem;                        /* 內距 */
}

/* Modal 對話框容器 */
.modal-dialog {
  margin: 0 auto;                       /* 水平置中 */
  position: relative;                   /* 相對定位 */
  width: 100%;                          /* 寬度100% */
  max-width: 650px;                     /* 最大寬度限制 */
}

/* Modal 內容區域 */
.modal-content {
  position: relative;                   /* 相對定位 */
  display: flex;                        /* 彈性佈局 */
  flex-direction: column;               /* 垂直排列 */
  width: 100%;                          /* 寬度100% */
  background-color: #fff;               /* 白色背景 */
  background-clip: padding-box;         /* 背景裁切 */
  border: none;                         /* 無邊框 */
  border-radius: 12px;                  /* 圓角 */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); /* 深陰影效果 */
  overflow: hidden;                     /* 隱藏溢出 */
}

/* Modal 標題列 */
.modal-header {
  border-bottom: 1px solid #e9ecef;     /* 底部邊框 */
  padding: 0.75rem 1rem;                /* 內距 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 漸層紫色背景 */
  color: white;                         /* 白色文字 */
  display: flex;                        /* 彈性佈局 */
  flex-shrink: 0;                       /* 不縮小 */
  align-items: center;                  /* 垂直置中 */
  justify-content: flex-end;            /* 靠右對齊 */
}

/* 關閉按鈕 */
.modal-header .btn-close {
  filter: invert(1);                    /* 反色（白色） */
  background: none;                     /* 無背景 */
  border: none;                         /* 無邊框 */
  font-size: 1.5rem;                    /* 字體大小 */
  cursor: pointer;                      /* 指標游標 */
  padding: 0.5rem;                      /* 內距 */
  opacity: 0.8;                         /* 透明度 */
  transition: opacity 0.3s ease;        /* 透明度過渡效果 */
}

/* 關閉按鈕懸停效果 */
.modal-header .btn-close:hover {
  opacity: 1;                           /* 完全不透明 */
}

/* Modal 主體內容 */
.modal-body {
  padding: 1rem 1.25rem;                /* 內距 */
}

/* Modal 內圖片基礎樣式 */
.modal-body img {
  transition: transform 0.3s ease;      /* 變換過渡效果 */
  border-radius: 8px;                   /* 圓角 */
}

/* Modal 內圖片懸停效果 */
.modal-body img:hover {
  transform: scale(1.05);               /* 放大 5% */
}

/* TeaName 商品圖片樣式 - 左側圖片 */
.tea-name-image-modal {
  width: 100%;                          /* 寬度100% */
  max-height: 250px;                    /* 最大高度限制 */
  object-fit: contain;                  /* 保持完整比例 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影效果 */
}

/* SavorImage 風味圖片樣式 - 上方大圖 */
.savor-image-modal {
  max-width: 100%;                      /* 最大寬度100% */
  max-height: 280px;                    /* 最大高度限制 */
  width: auto;                          /* 寬度自動 */
  height: auto;                         /* 高度自動 */
  object-fit: contain;                  /* 保持完整比例 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  border: 2px solid #e9ecef;            /* 淺灰邊框 */
  transition: all 0.3s ease;            /* 全部屬性過渡 */
  margin: 0 auto;                       /* 水平置中 */
}

/* 風味圖片懸停效果 */
.savor-image-modal:hover {
  transform: scale(1.08);               /* 放大 8% */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 陰影加深 */
  border-color: #667eea;                /* 邊框變紫色 */
}

/* ===== Modal 內數量控制區域 ===== */
.quantity-control-modal {
  margin-top: 1rem;                     /* 上方間距 */
}

/* 數量標籤文字 */
.quantity-control-modal .form-label {
  font-weight: 500;                     /* 中粗字體 */
  color: #495057;                       /* 深灰色 */
}

/* Modal 內數量按鈕 */
.quantity-control-modal button {
  min-width: 40px;                      /* 最小寬度 */
  height: 40px;                         /* 高度 */
  border-radius: 4px;                   /* 圓角 */
  font-size: 1.2rem;                    /* 字體大小 */
  font-weight: bold;                    /* 粗體 */
  transition: all 0.2s ease;            /* 全部屬性過渡 */
}

/* Modal 內按鈕懸停效果 */
.quantity-control-modal button:hover:not(:disabled) {
  background-color: #667eea;            /* 紫色背景 */
  border-color: #667eea;                /* 紫色邊框 */
  color: white;                         /* 白色文字 */
  transform: scale(1.05);               /* 放大 5% */
}

/* Modal 內按鈕禁用狀態 */
.quantity-control-modal button:disabled {
  opacity: 0.5;                         /* 半透明 */
  cursor: not-allowed;                  /* 禁用游標 */
}

/* Modal 內數量顯示 */
.quantity-display {
  min-width: 50px;                      /* 最小寬度 */
  text-align: center;                   /* 文字置中 */
  font-size: 1.25rem;                   /* 字體大小 */
  font-weight: 600;                     /* 粗體 */
  color: #495057;                       /* 深灰色 */
  padding: 0.5rem 1rem;                 /* 內距 */
  background-color: #f8f9fa;            /* 淺灰背景 */
  border-radius: 4px;                   /* 圓角 */
}

/* Modal 內數量輸入框 */
.quantity-input-modal {
  min-width: 70px;                      /* 最小寬度 */
  max-width: 80px;                      /* 最大寬度 */
  text-align: center;                   /* 文字置中 */
  font-size: 1.25rem;                   /* 字體大小 */
  font-weight: 600;                     /* 粗體 */
  color: #495057;                       /* 深灰色 */
  padding: 0.5rem 1rem;                 /* 內距 */
  background-color: #ffffff;            /* 白色背景 */
  border: 2px solid #ced4da;            /* 邊框 */
  border-radius: 6px;                   /* 圓角 */
  transition: all 0.2s ease;            /* 過渡效果 */
}

.quantity-input-modal:focus {
  outline: none;                        /* 移除預設外框 */
  border-color: #667eea;                /* 紫色邊框 */
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25); /* 紫色陰影 */
  background-color: #f8f9ff;            /* 淺紫背景 */
}

.quantity-input-modal::-webkit-inner-spin-button,
.quantity-input-modal::-webkit-outer-spin-button {
  opacity: 1;                           /* 顯示按鈕 */
  height: 30px;                         /* 按鈕高度 */
}

/* Modal 內加入購物車按鈕 */
.modal-body .btn-primary {
  margin-top: 0;                        /* 無上方間距 */
  padding: 0.75rem 2rem;                /* 內距 */
  font-weight: 600;                     /* 粗體 */
  transition: all 0.3s ease;            /* 全部屬性過渡 */
}

/* 加入購物車按鈕懸停效果 */
.modal-body .btn-primary:hover {
  transform: translateY(-2px);          /* 向上移動 */
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.4); /* 藍色陰影 */
}

/* ===== Vue Transition 過渡動畫效果 ===== */

/* Modal 進入和離開時的透明度過渡 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;        /* 透明度 0.3秒過渡 */
}

/* Modal 對話框的變換過渡 */
.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform 0.3s ease;      /* 變換 0.3秒過渡 */
}

/* Modal 進入動畫起始狀態 */
.modal-enter-from {
  opacity: 0;                           /* 完全透明 */
}

/* Modal 對話框進入動畫起始位置 */
.modal-enter-from .modal-dialog {
  transform: translate(0, -50px) scale(0.9); /* 向上50px，縮小到90% */
}

/* Modal 離開動畫結束狀態 */
.modal-leave-to {
  opacity: 0;                           /* 完全透明 */
}

/* Modal 對話框離開動畫結束位置 */
.modal-leave-to .modal-dialog {
  transform: translate(0, -50px) scale(0.9); /* 向上50px，縮小到90% */
}

/* Modal 進入完成和離開起始狀態 */
.modal-enter-to,
.modal-leave-from {
  opacity: 1;                           /* 完全不透明 */
}

/* Modal 對話框正常位置 */
.modal-enter-to .modal-dialog,
.modal-leave-from .modal-dialog {
  transform: translate(0, 0) scale(1);  /* 原始位置，100%大小 */
}
</style>

