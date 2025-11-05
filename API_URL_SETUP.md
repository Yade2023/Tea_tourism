# 後端 API URL 設定指南

## 📍 API URL 設定位置

後端 API URL 在以下檔案中設定：

**檔案位置：** `src/services/api.js` (第 6 行)

```6:6:src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
```

---

## 🔧 兩種設定方式

### 方式 1：使用環境變數（推薦）⭐

**優點：**
- 不同環境（開發/生產）可以使用不同的 URL
- 不會將敏感資訊提交到程式碼庫
- 方便管理多個環境

**步驟：**

1. **在專案根目錄創建 `.env` 檔案**

```env
# 後端 API 基礎 URL
VITE_API_BASE_URL=http://localhost:3000/api
```

2. **根據您的後端伺服器修改 URL**

**本地開發環境：**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**生產環境：**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**其他伺服器：**
```env
VITE_API_BASE_URL=http://192.168.1.100:3000/api
```

3. **重新啟動開發伺服器**

修改 `.env` 檔案後，需要重新啟動 Vite 開發伺服器才會生效：

```bash
# 停止目前的伺服器（Ctrl+C）
# 然後重新啟動
npm run dev
```

---

### 方式 2：直接修改程式碼

**檔案：** `src/services/api.js`

直接修改第 6 行的 URL：

```javascript
// 開發環境
const API_BASE_URL = 'http://localhost:3000/api'

// 生產環境
const API_BASE_URL = 'https://api.yourdomain.com/api'

// 其他伺服器
const API_BASE_URL = 'http://192.168.1.100:3000/api'
```

**注意：** 這種方式不適合生產環境，因為需要修改程式碼。

---

## 🔍 如何知道後端的 URL？

### 1. 查看後端伺服器啟動訊息

啟動後端伺服器時，通常會顯示伺服器地址：

```bash
cd backend-example
npm start
```

**輸出範例：**
```
✅ SQL Server 連接成功！
✅ 用戶表已就緒
🚀 伺服器運行在 http://localhost:3000
📊 資料庫：TeaTourismDB@localhost
```

**這裡的 `http://localhost:3000` 就是後端伺服器的地址**

### 2. 檢查後端的 PORT 設定

查看後端專案的設定：

**檔案：** `backend-example/server.js` 或 `backend-example/.env`

```javascript
const PORT = process.env.PORT || 3000
```

**預設端口：** `3000`

**完整 URL：** `http://localhost:3000/api`

### 3. 檢查後端 API 路徑前綴

查看後端程式中 API 路由的前綴：

**範例：**
```javascript
app.post('/api/auth/login', ...)  // 前綴是 /api
app.post('/api/auth/register', ...)
```

所以完整 URL 是：`http://localhost:3000/api`

---

## 📝 完整的 URL 格式說明

### URL 組成

```
http://localhost:3000/api
│     │          │    │
│     │          │    └─ API 路徑前綴（通常是 /api）
│     │          └─────── 端口（Port）
│     └─────────────────── 伺服器地址（localhost 或 IP）
└─────────────────────────── 協議（http 或 https）
```

### 常見的 URL 範例

| 環境 | 伺服器地址 | 端口 | API 前綴 | 完整 URL |
|------|-----------|------|---------|---------|
| 本地開發 | localhost | 3000 | /api | http://localhost:3000/api |
| 本地 IP | 192.168.1.100 | 3000 | /api | http://192.168.1.100:3000/api |
| 生產環境 | api.example.com | 443 | /api | https://api.example.com/api |
| 生產環境（自訂端口） | api.example.com | 8080 | /api | https://api.example.com:8080/api |

---

## 🧪 測試 API URL 是否正確

### 方法 1：使用瀏覽器

在瀏覽器中打開：

```
http://localhost:3000/api/health
```

如果看到類似以下的回應，表示 URL 正確：

```json
{
  "status": "ok",
  "database": "connected"
}
```

### 方法 2：使用瀏覽器開發者工具

1. 打開瀏覽器開發者工具（F12）
2. 切換到 **Network（網路）** 標籤
3. 在前端執行登入或註冊操作
4. 查看發送的請求，確認 URL 是否正確

**正確的請求應該類似：**
```
POST http://localhost:3000/api/auth/login
```

### 方法 3：使用 curl（命令列）

```bash
# 測試健康檢查端點
curl http://localhost:3000/api/health

# 測試登入端點
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🔄 不同環境的設定範例

### 開發環境（本地開發）

**`.env` 檔案：**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 測試環境

**`.env.test` 檔案：**
```env
VITE_API_BASE_URL=http://test-api.example.com/api
```

### 生產環境

**`.env.production` 檔案：**
```env
VITE_API_BASE_URL=https://api.example.com/api
```

**注意：** Vite 會根據模式自動載入對應的環境變數檔案：
- `npm run dev` → 載入 `.env`
- `npm run build` → 載入 `.env.production`

---

## ❓ 常見問題

### Q1: 修改了 .env 但沒有生效？

**解決方法：**
1. 確認檔案名稱是 `.env`（前面有句點）
2. 確認變數名稱是 `VITE_API_BASE_URL`（必須以 `VITE_` 開頭）
3. **重新啟動開發伺服器**（修改 .env 後必須重啟）

### Q2: 如何確認目前使用的 URL？

在 `src/services/api.js` 中暫時加入：

```javascript
console.log('API Base URL:', API_BASE_URL)
```

然後在瀏覽器控制台查看輸出。

### Q3: 後端在不同的端口怎麼辦？

假設後端運行在 `8080` 端口：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Q4: 後端在不同的伺服器怎麼辦？

如果後端在另一台電腦（IP: 192.168.1.100）：

```env
VITE_API_BASE_URL=http://192.168.1.100:3000/api
```

### Q5: 使用 HTTPS 怎麼辦？

生產環境通常使用 HTTPS：

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Q6: 後端沒有 /api 前綴怎麼辦？

如果後端直接是：
- `http://localhost:3000/auth/login`
- `http://localhost:3000/auth/register`

則設定為：

```env
VITE_API_BASE_URL=http://localhost:3000
```

然後在 `authService.js` 中修改端點：

```javascript
// 原本：/auth/login
// 改為：/auth/login（保持不變，因為 baseURL 已經不包含 /api）
```

---

## 📋 快速檢查清單

- [ ] 確認後端伺服器已啟動
- [ ] 確認後端的端口號（通常是 3000）
- [ ] 確認後端的 API 路徑前綴（通常是 /api）
- [ ] 在專案根目錄創建 `.env` 檔案
- [ ] 設定 `VITE_API_BASE_URL` 環境變數
- [ ] 重新啟動前端開發伺服器
- [ ] 測試 API 連接（使用瀏覽器開發者工具）

---

## 🎯 總結

**設定位置：** `src/services/api.js` 第 6 行

**推薦方式：** 使用 `.env` 檔案設定 `VITE_API_BASE_URL`

**格式：** `http://伺服器地址:端口/API前綴`

**範例：** `http://localhost:3000/api`

**記得：** 修改 `.env` 後要重新啟動開發伺服器！

