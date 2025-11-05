/**
 * 後端 API 伺服器範例 - 連接 SQL Server
 * 使用 Node.js + Express + mssql
 * 
 * 安裝依賴：
 * npm install express mssql dotenv cors jsonwebtoken bcryptjs
 */

import express from 'express'
import sql from 'mssql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中間件
app.use(cors()) // 允許前端跨域請求
app.use(express.json()) // 解析 JSON 請求體

// SQL Server 連接配置
const sqlConfig = {
  user: process.env.DB_USER || 'sa', // SQL Server 用戶名
  password: process.env.DB_PASSWORD || 'YourPassword123', // SQL Server 密碼
  server: process.env.DB_SERVER || 'localhost', // SQL Server 伺服器地址
  database: process.env.DB_NAME || 'TeaTourismDB', // 資料庫名稱
  options: {
    encrypt: true, // 使用加密連接（Azure SQL 必須為 true）
    trustServerCertificate: true, // 本地開發時信任憑證（生產環境建議使用正確的憑證）
    enableArithAbort: true
  },
  pool: {
    max: 10, // 連接池最大連接數
    min: 0,
    idleTimeoutMillis: 30000
  }
}

// SQL Server 連接池
let pool = null

// 初始化資料庫連接
async function initDatabase() {
  try {
    pool = await sql.connect(sqlConfig)
    console.log('✅ SQL Server 連接成功！')
    
    // 創建用戶表（如果不存在）
    await createUsersTable()
    
  } catch (err) {
    console.error('❌ SQL Server 連接失敗：', err)
    process.exit(1)
  }
}

// 創建用戶表
async function createUsersTable() {
  try {
    const request = pool.request()
    
    // 檢查表是否存在
    const tableCheck = await request.query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[users] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [name] NVARCHAR(100) NOT NULL,
          [email] NVARCHAR(255) NOT NULL UNIQUE,
          [password] NVARCHAR(255) NOT NULL,
          [created_at] DATETIME DEFAULT GETDATE(),
          [updated_at] DATETIME DEFAULT GETDATE()
        )
        PRINT '用戶表創建成功'
      END
    `)
    
    console.log('✅ 用戶表已就緒')
  } catch (err) {
    console.error('❌ 創建用戶表失敗：', err)
  }
}

// JWT Secret（生產環境應該使用環境變數）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// ==================== API 路由 ====================

/**
 * 用戶註冊
 * POST /api/auth/register
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // 驗證輸入
    if (!name || !email || !password) {
      return res.status(400).json({
        message: '請填寫所有必填欄位'
      })
    }
    
    // 檢查 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: '請輸入有效的電子郵件格式'
      })
    }
    
    // 檢查密碼長度
    if (password.length < 6) {
      return res.status(400).json({
        message: '密碼至少需要6個字符'
      })
    }
    
    const request = pool.request()
    
    // 檢查 email 是否已存在
    request.input('email', sql.NVarChar, email)
    const existingUser = await request.query(`
      SELECT id FROM users WHERE email = @email
    `)
    
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        message: '此 email 已被使用'
      })
    }
    
    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 插入新用戶到 SQL Server
    request.input('name', sql.NVarChar, name)
    request.input('email', sql.NVarChar, email)
    request.input('password', sql.NVarChar, hashedPassword)
    
    const result = await request.query(`
      INSERT INTO users (name, email, password)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
      VALUES (@name, @email, @password)
    `)
    
    const newUser = result.recordset[0]
    
    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id,
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 返回成功響應
    res.status(200).json({
      message: '註冊成功',
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      }
    })
    
  } catch (error) {
    console.error('註冊錯誤：', error)
    res.status(500).json({
      message: '伺服器錯誤，請稍後再試'
    })
  }
})

/**
 * 用戶登入
 * POST /api/auth/login
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // 驗證輸入
    if (!email || !password) {
      return res.status(400).json({
        message: '請輸入帳號和密碼'
      })
    }
    
    const request = pool.request()
    
    // 從 SQL Server 查詢用戶
    request.input('email', sql.NVarChar, email)
    const result = await request.query(`
      SELECT id, name, email, password, created_at
      FROM users
      WHERE email = @email
    `)
    
    // 檢查用戶是否存在
    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: '帳號或密碼錯誤'
      })
    }
    
    const user = result.recordset[0]
    
    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: '帳號或密碼錯誤'
      })
    }
    
    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 返回成功響應（不包含密碼）
    res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    })
    
  } catch (error) {
    console.error('登入錯誤：', error)
    res.status(500).json({
      message: '伺服器錯誤，請稍後再試'
    })
  }
})

/**
 * 驗證 token
 * GET /api/auth/verify
 */
app.get('/api/auth/verify', async (req, res) => {
  try {
    // 從請求標頭取得 token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: '未提供認證 token'
      })
    }
    
    const token = authHeader.substring(7) // 移除 'Bearer ' 前綴
    
    // 驗證 token
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // 從資料庫查詢用戶資訊
    const request = pool.request()
    request.input('userId', sql.Int, decoded.userId)
    const result = await request.query(`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = @userId
    `)
    
    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: '用戶不存在'
      })
    }
    
    res.status(200).json({
      valid: true,
      user: result.recordset[0]
    })
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token 無效或已過期'
      })
    }
    
    console.error('驗證錯誤：', error)
    res.status(500).json({
      message: '伺服器錯誤'
    })
  }
})

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    database: pool ? 'connected' : 'disconnected'
  })
})

// 啟動伺服器
async function startServer() {
  await initDatabase()
  
  app.listen(PORT, () => {
    console.log(`🚀 伺服器運行在 http://localhost:${PORT}`)
    console.log(`📊 資料庫：${sqlConfig.database}@${sqlConfig.server}`)
  })
}

startServer()

// 優雅關閉
process.on('SIGINT', async () => {
  console.log('\n正在關閉伺服器...')
  if (pool) {
    await pool.close()
    console.log('資料庫連接已關閉')
  }
  process.exit(0)
})

