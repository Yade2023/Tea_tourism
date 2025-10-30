# VUE 連接 API 使用範例

## API 端點說明

所有 API 端點都在 `/api/address` 下：

### 1. 取得所有問答資料
- **URL**: `GET https://localhost:XXXX/api/address`
- **說明**: 取得所有分類及其問答資料
- **返回格式**:
```json
{
  "accordionList": [
    {
      "id": 1,
      "title": "分類標題",
      "qa": [
        {
          "id": 1,
          "q": "問題",
          "a": "答案"
        }
      ]
    }
  ]
}
```

### 2. 取得所有分類列表
- **URL**: `GET https://localhost:XXXX/api/address/categories`
- **說明**: 只取得分類列表，不含問答內容
- **返回格式**:
```json
{
  "categories": [
    {
      "id": 1,
      "title": "分類標題"
    }
  ]
}
```

### 3. 根據分類 ID 取得該分類的所有問答
- **URL**: `GET https://localhost:XXXX/api/address/category/{id}`
- **說明**: 取得特定分類的所有問答
- **參數**: `id` (分類 ID)
- **返回格式**:
```json
{
  "id": 1,
  "title": "分類標題",
  "qa": [
    {
      "id": 1,
      "q": "問題",
      "a": "答案"
    }
  ]
}
```

### 4. 取得單一問答配對
- **URL**: `GET https://localhost:XXXX/api/address/qa/{id}`
- **說明**: 取得特定 ID 的問答配對
- **參數**: `id` (問答 ID)
- **返回格式**:
```json
{
  "id": 1,
  "categoryId": 1,
  "categoryTitle": "分類標題",
  "q": "問題",
  "a": "答案"
}
```

### 5. 搜尋問答
- **URL**: `GET https://localhost:XXXX/api/address/search?keyword={關鍵字}`
- **說明**: 根據關鍵字搜尋問題或答案
- **參數**: `keyword` (查詢字串參數)
- **返回格式**:
```json
{
  "results": [
    {
      "id": 1,
      "categoryId": 1,
      "categoryTitle": "分類標題",
      "q": "問題",
      "a": "答案"
    }
  ],
  "count": 1
}
```

## VUE 使用範例

### 方法一：使用 Fetch API (Options API)

```vue
<template>
  <div class="qa-container">
    <h1>問答系統</h1>
    
    <!-- 搜尋框 -->
    <div class="search-box">
      <input 
        v-model="searchKeyword" 
        @input="handleSearch" 
        placeholder="搜尋問答..."
        class="search-input"
      />
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="loading">載入中...</div>
    
    <!-- 錯誤訊息 -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- 問答列表 -->
    <div v-else class="qa-list">
      <div 
        v-for="category in qaData?.accordionList" 
        :key="category.id" 
        class="category"
      >
        <h2 class="category-title">{{ category.title }}</h2>
        <div 
          v-for="qa in category.qa" 
          :key="qa.id" 
          class="qa-item"
        >
          <div class="question">{{ qa.q }}</div>
          <div class="answer">{{ qa.a }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QAComponent',
  data() {
    return {
      qaData: null,
      loading: false,
      error: null,
      searchKeyword: '',
      apiBaseUrl: 'https://localhost:XXXX/api/address' // 請替換為您的實際 URL
    }
  },
  mounted() {
    this.fetchAllQA();
  },
  methods: {
    async fetchAllQA() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(this.apiBaseUrl);
        
        if (!response.ok) {
          throw new Error('無法取得資料');
        }
        
        this.qaData = await response.json();
      } catch (err) {
        this.error = err.message;
        console.error('取得問答資料失敗:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/categories`);
        if (!response.ok) throw new Error('無法取得分類');
        const data = await response.json();
        return data.categories;
      } catch (err) {
        console.error('取得分類失敗:', err);
        throw err;
      }
    },

    async fetchCategoryById(id) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/category/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('找不到該分類');
          }
          throw new Error('無法取得分類資料');
        }
        return await response.json();
      } catch (err) {
        console.error('取得分類資料失敗:', err);
        throw err;
      }
    },

    async searchQA(keyword) {
      if (!keyword || keyword.trim() === '') {
        return this.fetchAllQA();
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/search?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('搜尋失敗');
        
        const data = await response.json();
        // 將搜尋結果轉換為與完整資料相同的格式
        this.qaData = {
          accordionList: this.groupByCategory(data.results)
        };
      } catch (err) {
        this.error = err.message;
        console.error('搜尋失敗:', err);
      }
    },

    handleSearch() {
      if (this.searchKeyword.trim() === '') {
        this.fetchAllQA();
      } else {
        this.searchQA(this.searchKeyword);
      }
    },

    groupByCategory(results) {
      const grouped = {};
      results.forEach(item => {
        if (!grouped[item.categoryId]) {
          grouped[item.categoryId] = {
            id: item.categoryId,
            title: item.categoryTitle,
            qa: []
          };
        }
        grouped[item.categoryId].qa.push({
          id: item.id,
          q: item.q,
          a: item.a
        });
      });
      return Object.values(grouped);
    }
  }
}
</script>

<style scoped>
.qa-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  background: #ffeaea;
  border-radius: 8px;
}

.category {
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-title {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5em;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.qa-item {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid #3498db;
}

.question {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.answer {
  color: #555;
  line-height: 1.6;
}
</style>
```

### 方法二：使用 Axios

```vue
<script>
import axios from 'axios';

export default {
  data() {
    return {
      qaData: null,
      loading: false,
      error: null,
      apiBaseUrl: 'https://localhost:XXXX/api/address'
    }
  },
  mounted() {
    this.fetchAllQA();
  },
  methods: {
    async fetchAllQA() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(this.apiBaseUrl);
        this.qaData = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
        console.error('取得問答資料失敗:', err);
      } finally {
        this.loading = false;
      }
    },

    async searchQA(keyword) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/search`, {
          params: { keyword }
        });
        
        this.qaData = {
          accordionList: this.groupByCategory(response.data.results)
        };
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    }
  }
}
</script>
```

### 方法三：使用 Composition API (Vue 3)

```vue
<template>
  <div class="qa-container">
    <h1>問答系統</h1>
    
    <div v-if="loading">載入中...</div>
    <div v-else-if="error">錯誤: {{ error }}</div>
    <div v-else>
      <div 
        v-for="category in qaData?.accordionList" 
        :key="category.id" 
        class="category"
      >
        <h2>{{ category.title }}</h2>
        <div 
          v-for="qa in category.qa" 
          :key="qa.id" 
          class="qa-item"
        >
          <div class="question">{{ qa.q }}</div>
          <div class="answer">{{ qa.a }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const qaData = ref(null);
const loading = ref(false);
const error = ref(null);
const apiBaseUrl = 'https://localhost:XXXX/api/address';

const fetchAllQA = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(apiBaseUrl);
    
    if (!response.ok) {
      throw new Error('無法取得資料');
    }
    
    qaData.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error('取得問答資料失敗:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllQA();
});
</script>
```

## 建立 API 服務模組 (推薦)

建立 `src/services/qaApi.js`：

```javascript
const API_BASE_URL = 'https://localhost:XXXX/api/address';

export const qaApi = {
  // 取得所有問答資料
  async getAllQA() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('無法取得資料');
    return await response.json();
  },

  // 取得所有分類
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('無法取得分類');
    const data = await response.json();
    return data.categories;
  },

  // 取得特定分類
  async getCategoryById(id) {
    const response = await fetch(`${API_BASE_URL}/category/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('找不到該分類');
      throw new Error('無法取得分類資料');
    }
    return await response.json();
  },

  // 取得特定問答
  async getQAById(id) {
    const response = await fetch(`${API_BASE_URL}/qa/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('找不到該問答');
      throw new Error('無法取得問答資料');
    }
    return await response.json();
  },

  // 搜尋問答
  async searchQA(keyword) {
    if (!keyword || keyword.trim() === '') {
      throw new Error('請提供搜尋關鍵字');
    }
    const response = await fetch(
      `${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`
    );
    if (!response.ok) throw new Error('搜尋失敗');
    const data = await response.json();
    return data;
  }
};
```

在組件中使用：

```javascript
import { qaApi } from '@/services/qaApi';

export default {
  async mounted() {
    try {
      this.qaData = await qaApi.getAllQA();
    } catch (error) {
      this.error = error.message;
    }
  }
}
```

## 注意事項

1. **替換 Port**: 將 `localhost:XXXX` 替換為您的 ASP.NET 應用程式實際端口
2. **HTTPS**: 如果使用 HTTPS 且是自簽名憑證，VUE 開發環境可能需要設定 `vite.config.js`:
   ```javascript
   export default {
     server: {
       https: false, // 或設定為 true 並配置證書
     }
   }
   ```
3. **CORS**: API 已設定允許任何來源，在生產環境建議限制特定網域
4. **錯誤處理**: 建議實作完整的錯誤處理和載入狀態
5. **環境變數**: 建議將 API URL 放在環境變數中：
   ```env
   VITE_API_BASE_URL=https://localhost:XXXX/api
   ```

## 測試 API

### 使用 curl
```bash
# 取得所有資料
curl https://localhost:XXXX/api/address

# 取得分類列表
curl https://localhost:XXXX/api/address/categories

# 取得特定分類
curl https://localhost:XXXX/api/address/category/1

# 搜尋
curl "https://localhost:XXXX/api/address/search?keyword=茶葉"
```

### 使用瀏覽器
直接在瀏覽器訪問：
```
https://localhost:XXXX/api/address
```

