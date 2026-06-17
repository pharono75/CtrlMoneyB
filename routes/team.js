const express = require('express')
const db = require('../db/sqlite')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, (req, res) => {
  db.all(`SELECT * FROM team WHERE userId = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' })
    res.json(rows)
  })
})

router.post('/', auth, (req, res) => {
  const {
    firstName, lastName, patronymic, position, department, email, phone, salary, photo,
    hireDate, sex, birthDate, birthPlace, passportSeries, passportNumber,
    passportIssuedBy, passportIssueDate, passportDivisionCode, passportRegistrationAddress
  } = req.body

  db.run(
    `INSERT INTO team (
      userId, firstName, lastName, patronymic, position, department, email, phone, salary, photo,
      hireDate, sex, birthDate, birthPlace, passportSeries, passportNumber,
      passportIssuedBy, passportIssueDate, passportDivisionCode, passportRegistrationAddress
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id, firstName, lastName, patronymic, position, department, email, phone, salary, photo,
      hireDate, sex, birthDate, birthPlace, passportSeries, passportNumber,
      passportIssuedBy, passportIssueDate, passportDivisionCode, passportRegistrationAddress
    ],
    function (err) {
      if (err) return res.status(500).json({ message: 'Ошибка добавления' })
      res.json({ id: this.lastID, ...req.body })
    }
  )
})

// ДОБАВЛЕН РОУТ ДЛЯ РЕДАКТИРОВАНИЯ (СОХРАНЕНИЯ ИЗМЕНЕНИЙ)
router.put('/:id', auth, (req, res) => {
  const {
    firstName, lastName, patronymic, position, department, email, phone, salary, photo,
    hireDate, sex, birthDate, birthPlace, passportSeries, passportNumber,
    passportIssuedBy, passportIssueDate, passportDivisionCode, passportRegistrationAddress
  } = req.body

  db.run(
    `UPDATE team SET
      firstName = ?, lastName = ?, patronymic = ?, position = ?, department = ?, email = ?, phone = ?, salary = ?, photo = ?,
      hireDate = ?, sex = ?, birthDate = ?, birthPlace = ?, passportSeries = ?, passportNumber = ?,
      passportIssuedBy = ?, passportIssueDate = ?, passportDivisionCode = ?, passportRegistrationAddress = ?
     WHERE id = ? AND userId = ?`,
    [
      firstName, lastName, patronymic, position, department, email, phone, salary, photo,
      hireDate, sex, birthDate, birthPlace, passportSeries, passportNumber,
      passportIssuedBy, passportIssueDate, passportDivisionCode, passportRegistrationAddress,
      req.params.id, req.user.id
    ],
    function (err) {
      if (err) return res.status(500).json({ message: 'Ошибка обновления' })
      res.json({ ok: true })
    }
  )
})

router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM team WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], () => res.json({ ok: true }))
})

module.exports = router