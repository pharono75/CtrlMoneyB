require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
// УВЕЛИЧИВАЕМ ЛИМИТ ДЛЯ ЗАГРУЗКИ КАРТИНОК И PDF ДО 50 МЕГАБАЙТ
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api', require('./routes/register'))
app.use('/api', require('./routes/login'))
app.use('/api', require('./routes/me'))

// Подключаем функционал страниц
app.use('/api/transactions', require('./routes/transactions'))
app.use('/api/team', require('./routes/team'))
app.use('/api/documents', require('./routes/documents'))

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})