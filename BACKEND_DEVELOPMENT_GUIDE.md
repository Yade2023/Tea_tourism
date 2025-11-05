# 後端開發步驟指南

## 🎯 從零開始開發後端 - 完整步驟

這份指南將帶您一步一步建立後端 API 伺服器，連接 SQL Server 資料庫。

---

## 📋 前置準備

在開始之前，請確認您已安裝：

- ✅ Node.js（建議 v18 或以上）
- ✅ SQL Server（已安裝並運行）
- ✅ SQL Server Management Studio (SSMS)（可選，用於管理資料庫）

---

## 🚀 步驟 1：進入後端目錄

```bash
cd backend-example
```

---

## 📦 步驟 2：安裝後端依賴套件

```bash
npm install
```

這會安裝以下套件：
- `express` - Web 框架
- `mssql` - SQL Server 連接套件
- `cors` - 跨域請求處理
- `dotenv` - 環境變數管理
- `jsonwebtoken` - JWT token 生成和驗證
- `bcryptjs` - 密碼加密

**預期輸出：**
```
added 23 packages, and audited 61 packages
```

---

## 🔧 步驟 3：設定環境變數

### 3.1 創建 `.env` 檔案

在 `backend-example` 目錄中創建 `.env` 檔案：

```bash
# Windows PowerShell
New-Item .env

# 或直接使用編輯器創建檔案
```

### 3.2 編輯 `.env` 檔案內容

```env
# 伺服器端口
PORT=3000

# SQL Server 連接配置
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=您的SQLServer密碼
DB_NAME=TeaTourismDB

# JWT Secret（用於生成和驗證 token，請使用強密碼）
JWT_SECRET=your-secret-key-change-in-production-minimum-32-characters
```

**重要：**
- 將 `DB_PASSWORD` 改為您的 SQL Server 實際密碼
- 將 `JWT_SECRET` 改為一個隨機的強密碼（至少 32 個字符）

---

## 🗄️ 步驟 4：建立 SQL Server 資料庫

### 4.1 打開 SQL Server Management Studio (SSMS)

或使用任何 SQL Server 管理工具。

### 4.2 連接到 SQL Server

使用您的 SQL Server 認證資訊登入。

### 4.3 創建資料庫

在查詢視窗中執行以下 SQL：

```sql
-- 創建資料庫
CREATE DATABASE TeaTourismDB;
GO

-- 使用資料庫
USE TeaTourismDB;
GO

-- 創建用戶表（後端會自動創建，但也可以手動創建）
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO
```

**或者：** 後端程式會在啟動時自動創建表，您也可以跳過這一步。

---

## ✅ 步驟 5：測試 SQL Server 連接

### 5.1 確認 SQL Server 正在運行

在 Windows 服務中確認：
- SQL Server (MSSQLSERVER) 或您的 SQL Server 實例正在運行

### 5.2 確認連接資訊

確認 `.env` 檔案中的設定是否正確：
- `DB_SERVER` - SQL Server 伺服器地址
- `DB_USER` - SQL Server 用戶名
- `DB_PASSWORD` - SQL Server 密碼
- `DB_NAME` - 資料庫名稱

---

## 🚀 步驟 6：啟動後端伺服器

### 6.1 啟動伺服器

```bash
npm start
```

**預期輸出：**
```
✅ SQL Server 連接成功！
✅ 用戶表已就緒
🚀 伺服器運行在 http://localhost:3000
📊 資料庫：TeaTourismDB@localhost
```

### 6.2 如果出現錯誤

**錯誤：連接失敗**
- 檢查 SQL Server 是否正在運行
- 檢查 `.env` 中的連接資訊是否正確
- 檢查防火牆設定

**錯誤：資料庫不存在**
- 回到步驟 4 創建資料庫

---

## 🧪 步驟 7：測試後端 API

### 7.1 測試健康檢查端點

在瀏覽器中打開：
```
http://localhost:3000/api/health
```

**預期回應：**
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 7.2 測試註冊 API

使用瀏覽器開發者工具（F12）或 Postman：

**請求：**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "測試用戶",
  "email": "test@example.com",
  "password": "password123"
}
```

**預期回應：**
```json
{
  "message": "註冊成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "測試用戶",
    "email": "test@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7.3 測試登入 API

**請求：**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**預期回應：**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "測試用戶",
    "email": "test@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔗 步驟 8：連接前端與後端

### 8.1 確認前端 API URL 設定

檢查 `src/services/api.js` 或 `.env` 檔案：

```javascript
// 應該是
const API_BASE_URL = 'http://localhost:3000/api'
```

### 8.2 測試前端連接

1. 啟動前端開發伺服器（如果還沒啟動）：
   ```bash
   # 在專案根目錄
   npm run dev
   ```

2. 在瀏覽器中打開前端應用

3. 嘗試登入或註冊

4. 打開瀏覽器開發者工具（F12）→ Network 標籤

5. 查看請求是否成功發送到後端

---

## 📝 步驟 9：開發模式（可選）

如果需要自動重啟（修改程式碼後自動重新載入）：

```bash
npm run dev
```

這會監聽檔案變更，自動重啟伺服器。

---

## 🎉 完成！

現在您已經有了一個運行的後端 API 伺服器！

### 接下來的開發方向：

1. **擴展 API 端點**
   - 添加更多功能（例如：茶園資訊、旅遊路線等）

2. **資料庫設計**
   - 設計更多資料表
   - 建立表之間的關聯

3. **安全性增強**
   - 添加請求驗證
   - 實作角色權限系統

4. **錯誤處理優化**
   - 添加更詳細的錯誤日誌
   - 實作錯誤通知機制

---

## 📚 相關檔案說明

### 後端檔案結構

```
backend-example/
├── server.js          # 主伺服器檔案（包含所有 API 路由）
├── package.json       # 依賴套件清單
└── .env              # 環境變數配置（需要自己創建）
```

### 主要檔案功能

- **server.js**
  - SQL Server 連接配置
  - API 路由定義（登入、註冊、驗證）
  - 資料庫操作（查詢、插入）

---

## ❓ 常見問題與解決方法

### Q1: npm install 失敗

**解決方法：**
```bash
# 清除 npm 快取
npm cache clean --force

# 刪除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### Q2: SQL Server 連接失敗

**檢查項目：**
1. SQL Server 服務是否運行？
2. 用戶名和密碼是否正確？
3. 防火牆是否允許連接？
4. SQL Server 是否允許遠程連接？

**解決方法：**
```sql
-- 在 SQL Server 中執行
EXEC sp_configure 'remote access', 1
RECONFIGURE
```

### Q3: 端口 3000 已被使用

**解決方法：**
修改 `.env` 檔案中的 `PORT`：
```env
PORT=3001
```

然後也要修改前端的 `.env`：
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Q4: CORS 錯誤

**解決方法：**
後端已經包含 CORS 設定，如果還有問題，檢查 `server.js` 中的 CORS 配置。

### Q5: 資料庫表沒有自動創建

**解決方法：**
手動執行步驟 4 的 SQL 語句創建表。

---

## 🔍 除錯技巧

### 1. 查看伺服器日誌

啟動伺服器時，注意控制台的輸出訊息。

### 2. 使用 Postman 測試 API

安裝 Postman 工具，可以更方便地測試 API。

### 3. 查看資料庫

在 SSMS 中查詢資料：
```sql
SELECT * FROM users;
```

### 4. 檢查網路請求

使用瀏覽器開發者工具的 Network 標籤查看所有 HTTP 請求。

---

## 📖 下一步學習資源

- [Express.js 官方文檔](https://expressjs.com/)
- [mssql 套件文檔](https://github.com/tediousjs/node-mssql)
- [JWT 認證指南](https://jwt.io/)

---

## ✅ 開發檢查清單

- [ ] 安裝 Node.js
- [ ] 進入 `backend-example` 目錄
- [ ] 執行 `npm install`
- [ ] 創建 `.env` 檔案
- [ ] 設定 SQL Server 連接資訊
- [ ] 建立資料庫
- [ ] 啟動後端伺服器
- [ ] 測試健康檢查端點
- [ ] 測試註冊 API
- [ ] 測試登入 API
- [ ] 連接前端應用
- [ ] 測試完整流程

---

祝您開發順利！🎉

