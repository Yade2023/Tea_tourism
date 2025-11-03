# VUE 連接 API 使用範例

## API 端點說明

所有 API 端點都在 `/api/address` 下：

### 1. 取得包含後端資料的 HTML 頁面
- **URL**: `GET https://localhost:XXXX/api/address/page`
- **說明**: 返回包含動態生成問答內容的完整 HTML 頁面（服務端渲染）
- **返回格式**: `text/html`
- **使用情境**: 直接訪問此端點即可顯示完整的聯絡頁面，包含從資料庫載入的問答資料

### 2. 新增聯絡訊息
- **URL**: `POST https://localhost:XXXX/api/address/contact`
- **說明**: 提交聯絡表單資料
- **請求格式**:
```json
{
  "Name": "您的名稱",
  "Email": "your.email@example.com",
  "Message": "您的訊息內容"
}
```
- **成功回應** (200 OK):
```json
{
  "success": true,
  "message": "您的訊息已成功送出，我們將盡快與您聯繫！",
  "id": 1
}
```
- **錯誤回應** (400 Bad Request):
```json
{
  "error": "請填寫您的名稱"
}
```

## VUE 使用範例

### 方法一：提交聯絡表單（使用 Fetch API）

```vue
<template>
  <div class="contact-form">
    <h2>聯絡我們</h2>
    <form @submit.prevent="submitContact">
      <div class="form-group">
        <label>您的名稱 *</label>
        <input 
          type="text" 
          v-model="formData.Name" 
          required 
          placeholder="請輸入您的名稱"
        />
      </div>
      
      <div class="form-group">
        <label>您的電子郵件 *</label>
        <input 
          type="email" 
          v-model="formData.Email" 
          required 
          placeholder="請輸入您的電子郵件"
        />
      </div>
      
      <div class="form-group">
        <label>內容（意見 / 聯絡事宜 / 其他） *</label>
        <textarea 
          v-model="formData.Message" 
          required 
          rows="5"
          placeholder="請輸入您的訊息"
        ></textarea>
      </div>
      
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? '送出中...' : '發送' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      formData: {
        Name: '',
        Email: '',
        Message: ''
      },
      loading: false,
      message: '',
      messageType: '', // 'success' 或 'error'
      apiBaseUrl: 'https://localhost:XXXX/api/address' // 請替換為您的實際 URL
    }
  },
  methods: {
    async submitContact() {
      this.loading = true;
      this.message = '';
      this.messageType = '';

      try {
        const response = await fetch(`${this.apiBaseUrl}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '送出失敗');
        }

        // 成功
        this.message = data.message;
        this.messageType = 'success';
        
        // 清空表單
        this.formData = {
          Name: '',
          Email: '',
          Message: ''
        };
      } catch (err) {
        this.message = err.message;
        this.messageType = 'error';
        console.error('送出聯絡訊息失敗:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.contact-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

button {
  background: #4CAF50;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

button:hover:not(:disabled) {
  background: #45a049;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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
      formData: {
        Name: '',
        Email: '',
        Message: ''
      },
      loading: false,
      message: '',
      messageType: '',
      apiBaseUrl: 'https://localhost:XXXX/api/address'
    }
  },
  methods: {
    async submitContact() {
      this.loading = true;
      this.message = '';
      this.messageType = '';

      try {
        const response = await axios.post(
          `${this.apiBaseUrl}/contact`,
          this.formData
        );

        this.message = response.data.message;
        this.messageType = 'success';
        
        // 清空表單
        this.formData = {
          Name: '',
          Email: '',
          Message: ''
        };
      } catch (err) {
        this.message = err.response?.data?.error || err.message;
        this.messageType = 'error';
        console.error('送出聯絡訊息失敗:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
```

### 方法三：使用 Composition API (Vue 3)

```vue
<template>
  <div class="contact-form">
    <h2>聯絡我們</h2>
    <form @submit.prevent="submitContact">
      <div class="form-group">
        <label>您的名稱 *</label>
        <input 
          type="text" 
          v-model="formData.Name" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label>您的電子郵件 *</label>
        <input 
          type="email" 
          v-model="formData.Email" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label>內容 *</label>
        <textarea 
          v-model="formData.Message" 
          required 
          rows="5"
        ></textarea>
      </div>
      
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? '送出中...' : '發送' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  Name: '',
  Email: '',
  Message: ''
});

const loading = ref(false);
const message = ref('');
const messageType = ref('');
const apiBaseUrl = 'https://localhost:XXXX/api/address';

const submitContact = async () => {
  loading.value = true;
  message.value = '';
  messageType.value = '';

  try {
    const response = await fetch(`${apiBaseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '送出失敗');
    }

    message.value = data.message;
    messageType.value = 'success';
    
    // 清空表單
    formData.value = {
      Name: '',
      Email: '',
      Message: ''
    };
  } catch (err) {
    message.value = err.message;
    messageType.value = 'error';
    console.error('送出聯絡訊息失敗:', err);
  } finally {
    loading.value = false;
  }
};
</script>
```

## 建立 API 服務模組 (推薦)

建立 `src/services/contactApi.js`：

```javascript
const API_BASE_URL = 'https://localhost:XXXX/api/address';

export const contactApi = {
  /**
   * 提交聯絡訊息
   * @param {Object} contactData - 聯絡訊息資料
   * @param {string} contactData.Name - 名稱
   * @param {string} contactData.Email - 電子郵件
   * @param {string} contactData.Message - 訊息內容
   * @returns {Promise<Object>} 回應資料
   */
  async submitContact(contactData) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '送出失敗');
    }

    return data;
  },

  /**
   * 取得完整的聯絡頁面 HTML（服務端渲染）
   * @returns {Promise<string>} HTML 內容
   */
  async getContactPage() {
    const response = await fetch(`${API_BASE_URL}/page`);
    
    if (!response.ok) {
      throw new Error('無法載入頁面');
    }

    return await response.text();
  }
};
```

在組件中使用：

```javascript
import { contactApi } from '@/services/contactApi';

export default {
  methods: {
    async submitContact() {
      try {
        const result = await contactApi.submitContact({
          Name: this.formData.Name,
          Email: this.formData.Email,
          Message: this.formData.Message
        });
        
        alert(result.message);
        // 清空表單
        this.resetForm();
      } catch (error) {
        alert(error.message);
      }
    }
  }
}
```

## 顯示服務端渲染的頁面

如果需要將服務端渲染的 HTML 頁面嵌入到 Vue 組件中：

```vue
<template>
  <div v-html="pageHtml" v-if="pageHtml"></div>
  <div v-else-if="loading">載入中...</div>
  <div v-else-if="error">錯誤: {{ error }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { contactApi } from '@/services/contactApi';

const pageHtml = ref('');
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  loading.value = true;
  try {
    pageHtml.value = await contactApi.getContactPage();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
```

## 注意事項

1. **替換 Port**: 將 `localhost:XXXX` 替換為您的 ASP.NET 應用程式實際端口

2. **CORS**: 確保後端已設定允許前端網域的 CORS 政策

3. **錯誤處理**: 建議實作完整的錯誤處理和載入狀態

4. **環境變數**: 建議將 API URL 放在環境變數中：
   ```env
   VITE_API_BASE_URL=https://localhost:XXXX/api
   ```
   
   在程式碼中使用：
   ```javascript
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL + '/address';
   ```

5. **表單驗證**: 
   - 前端已實作基本的 HTML5 驗證（required）
   - 後端也會進行驗證，包括：
     - 必填欄位檢查
     - 電子郵件格式驗證
     - 資料清理（trim）

6. **安全性**: 
   - 電子郵件格式由後端驗證
   - 所有輸入資料會自動去除前後空白

## 測試 API

### 使用 curl

```bash
# 取得完整 HTML 頁面
curl https://localhost:XXXX/api/address/page

# 提交聯絡訊息
curl -X POST https://localhost:XXXX/api/address/contact \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "測試使用者",
    "Email": "test@example.com",
    "Message": "這是一則測試訊息"
  }'
```

### 使用瀏覽器

直接在瀏覽器訪問：
```
https://localhost:XXXX/api/address/page
```

### 使用 Postman

1. **取得 HTML 頁面**:
   - Method: `GET`
   - URL: `https://localhost:XXXX/api/address/page`

2. **提交聯絡訊息**:
   - Method: `POST`
   - URL: `https://localhost:XXXX/api/address/contact`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "Name": "測試使用者",
       "Email": "test@example.com",
       "Message": "這是一則測試訊息"
     }
     ```

## API 回應範例

### 成功回應
```json
{
  "success": true,
  "message": "您的訊息已成功送出，我們將盡快與您聯繫！",
  "id": 1
}
```

### 錯誤回應範例

**缺少名稱**:
```json
{
  "error": "請填寫您的名稱"
}
```

**電子郵件格式錯誤**:
```json
{
  "error": "請輸入有效的電子郵件地址"
}
```

**缺少訊息內容**:
```json
{
  "error": "請填寫內容（意見 / 聯絡事宜 / 其他）"
}
```

**伺服器錯誤**:
```json
{
  "error": "儲存聯絡訊息時發生錯誤：[錯誤詳情]"
}
```
