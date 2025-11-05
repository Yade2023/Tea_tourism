# SQL Server 連接設定指南

## 📋 概述

前端程式碼**不需要修改**，因為它使用標準的 HTTP API 呼叫。只需要在**後端**連接 SQL Server 資料庫即可。

---

## ✅ 前端程式碼狀態

**前端已經準備就緒！** 不需要任何修改。

- ✅ `src/services/api.js` - 通用的 HTTP 客戶端
- ✅ `src/services/authService.js` - 標準的 REST API 呼叫
- ✅ `src/Auth.vue` - 已整合 API 服務

前端會發送 HTTP 請求到後端，後端負責連接 SQL Server。

---

## 🔧 後端設定步驟

### 1. 安裝後端依賴

在 `backend-example` 目錄中執行：

```bash
cd backend-example
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並修改為您的 SQL Server 設定：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# 伺服器端口
PORT=3000

# SQL Server 連接配置
DB_SERVER=localhost          # SQL Server 伺服器地址
DB_USER=sa                  # SQL Server 用戶名
DB_PASSWORD=YourPassword123 # SQL Server 密碼
DB_NAME=TeaTourismDB        # 資料庫名稱

# JWT Secret（請使用強密碼）
JWT_SECRET=your-secret-key-change-in-production
```

### 3. 建立 SQL Server 資料庫

在 SQL Server Management Studio (SSMS) 中執行：

```sql
-- 創建資料庫
CREATE DATABASE TeaTourismDB;
GO

USE TeaTourismDB;
GO

-- 用戶表會自動創建（如果不存在）
-- 但您也可以手動創建：
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

### 4. 啟動後端伺服器

```bash
npm start
# 或使用開發模式（自動重啟）
npm run dev
```

您應該看到：
```
✅ SQL Server 連接成功！
✅ 用戶表已就緒
🚀 伺服器運行在 http://localhost:3000
📊 資料庫：TeaTourismDB@localhost
```

---

## 🔌 SQL Server 連接配置說明

### 本地 SQL Server

```javascript
const sqlConfig = {
  user: 'sa',                    // SQL Server 用戶名
  password: 'YourPassword123',    // SQL Server 密碼
  server: 'localhost',            // 伺服器地址（或 IP）
  database: 'TeaTourismDB',       // 資料庫名稱
  options: {
    encrypt: true,                // 使用加密連接
    trustServerCertificate: true, // 本地開發時信任憑證
    enableArithAbort: true
  }
}
```

### Azure SQL Database

如果使用 Azure SQL Database，配置稍有不同：

```javascript
const sqlConfig = {
  user: 'your-azure-user@your-server',
  password: 'YourPassword123',
  server: 'your-server.database.windows.net',
  database: 'TeaTourismDB',
  options: {
    encrypt: true,                // Azure 必須為 true
    trustServerCertificate: false, // Azure 使用正確的憑證
    enableArithAbort: true
  }
}
```

### 連接字串方式（可選）

您也可以使用連接字串：

```javascript
const connectionString = 'Server=localhost;Database=TeaTourismDB;User Id=sa;Password=YourPassword123;Encrypt=true;TrustServerCertificate=true;'
const pool = await sql.connect(connectionString)
```

---

## 📊 資料庫結構

### users 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INT | 主鍵，自動遞增 |
| name | NVARCHAR(100) | 用戶姓名 |
| email | NVARCHAR(255) | 電子郵件（唯一） |
| password | NVARCHAR(255) | 加密後的密碼 |
| created_at | DATETIME | 創建時間 |
| updated_at | DATETIME | 更新時間 |

---

## 🔐 安全性說明

### 1. 密碼加密

使用 `bcryptjs` 進行密碼雜湊：

```javascript
// 註冊時加密
const hashedPassword = await bcrypt.hash(password, 10)

// 登入時驗證
const isPasswordValid = await bcrypt.compare(password, user.password)
```

### 2. JWT Token

- 使用 JWT 進行身份驗證
- Token 有效期：7 天
- 儲存在 localStorage（前端）

### 3. SQL 注入防護

使用參數化查詢（`@email`, `@password` 等），防止 SQL 注入攻擊。

---

## 🧪 測試 API

### 測試註冊

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "張三",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 測試登入

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 測試健康檢查

```bash
curl http://localhost:3000/api/health
```

---

## ❓ 常見問題

### Q1: 連接失敗怎麼辦？

**檢查項目：**
1. SQL Server 是否正在運行？
2. 用戶名和密碼是否正確？
3. 資料庫名稱是否存在？
4. 防火牆是否允許連接？

**解決方法：**
```sql
-- 檢查 SQL Server 是否允許遠程連接
-- 在 SSMS 中執行
EXEC sp_configure 'remote access', 1
RECONFIGURE
```

### Q2: 信任憑證錯誤？

如果使用本地 SQL Server，設定：
```javascript
trustServerCertificate: true
```

如果使用 Azure SQL，設定：
```javascript
trustServerCertificate: false
```

### Q3: 連接池錯誤？

檢查連接池設定：
```javascript
pool: {
  max: 10,  // 最大連接數
  min: 0,
  idleTimeoutMillis: 30000
}
```

### Q4: 中文亂碼問題？

SQL Server 使用 `NVARCHAR` 類型支援 Unicode（中文），確保：
- 表欄位使用 `NVARCHAR` 而不是 `VARCHAR`
- 查詢時使用 `N'中文'` 前綴（如果需要）

---

## 📝 生產環境建議

### 1. 環境變數

**絕對不要**在程式碼中硬編碼密碼！使用環境變數：

```env
DB_PASSWORD=your-production-password
JWT_SECRET=your-production-secret-key
```

### 2. 連接字串

考慮使用 Azure Key Vault 或類似的密鑰管理服務。

### 3. 錯誤處理

生產環境應該：
- 記錄詳細的錯誤日誌
- 不要向客戶端暴露敏感資訊
- 使用適當的 HTTP 狀態碼

### 4. 資料庫備份

定期備份資料庫，確保資料安全。

---

## 🚀 下一步

1. ✅ 設定 SQL Server 連接
2. ✅ 啟動後端伺服器
3. ✅ 測試 API 端點
4. ✅ 在前端測試登入/註冊功能

**前端程式碼不需要任何修改，直接使用即可！**

---

## 📚 相關資源

- [mssql 套件文檔](https://github.com/tediousjs/node-mssql)
- [Express.js 文檔](https://expressjs.com/)
- [SQL Server 連接字串參考](https://www.connectionstrings.com/sql-server/)

