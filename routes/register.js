const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../db/sqlite')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const {
      companyName,
      email,
      phone,
      employeeCount,
      inn,
      use1C,
      fullName,
      position,
      password,
      confirmPassword
    } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Пароли не совпадают' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO users 
      (companyName, email, phone, employeeCount, inn, use1C, fullName, position, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.run(
      sql,
      [companyName, email, phone, employeeCount, inn, use1C, fullName, position, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ message: 'Пользователь уже существует' })
        }

        res.status(201).json({ message: 'Регистрация успешна' })
      }
    )
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router