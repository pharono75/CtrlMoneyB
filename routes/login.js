const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db/sqlite')

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' })

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ message: 'Неверный пароль' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        fullName: user.fullName
      }
    })
  })
})

module.exports = router