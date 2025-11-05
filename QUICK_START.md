# 🚀 快速開始指南

## 5 分鐘快速啟動後端

### 步驟 1️⃣：進入後端目錄
```bash
cd backend-example
```

### 步驟 2️⃣：安裝依賴
```bash
npm install
```

### 步驟 3️⃣：創建 `.env` 檔案

在 `backend-example` 目錄創建 `.env` 檔案，內容如下：

```env
PORT=3000
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=您的SQLServer密碼
DB_NAME=TeaTourismDB
JWT_SECRET=your-secret-key-at-least-32-characters-long
```

**重要：** 將 `DB_PASSWORD` 和 `JWT_SECRET` 改為實際值！

### 步驟 4️⃣：建立資料庫（可選）

在 SQL Server Management Studio 中執行：
```sql
CREATE DATABASE TeaTourismDB;
```

**注意：** 後端會自動創建表，這步可以跳過。

### 步驟 5️⃣：啟動伺服器
```bash
npm start
```

看到以下訊息表示成功：
```
✅ SQL Server 連接成功！
🚀 伺服器運行在 http://localhost:3000
```

### 步驟 6️⃣：測試 API

在瀏覽器打開：
```
http://localhost:3000/api/health
```

應該看到：
```json
{"status":"ok","database":"connected"}
```

---

## 🎯 完成！

現在您的後端已經運行，可以開始測試前端登入/註冊功能了！

**詳細說明請參考：** `BACKEND_DEVELOPMENT_GUIDE.md`

