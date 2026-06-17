const express = require('express')
const db = require('../db/sqlite')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/me', auth, (req, res) => {
  db.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' })
    res.json(user)
  })
})

router.put('/me', auth, (req, res) => {
  const { companyName, inn, firstName, lastName, position, email, phone, employeeCount, avatar } = req.body
  db.run(
    `UPDATE users SET companyName = ?, inn = ?, firstName = ?, lastName = ?, position = ?, email = ?, phone = ?, employeeCount = ?, avatar = ? WHERE id = ?`,
    [companyName, inn, firstName, lastName, position, email, phone, employeeCount, avatar, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Ошибка сохранения профиля' })
      res.json({ ok: true })
    }
  )
})

module.exports = router