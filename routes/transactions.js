const express = require('express')
const db = require('../db/sqlite')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, (req, res) => {
  db.all(`SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' })
    res.json(rows)
  })
})

router.post('/', auth, (req, res) => {
  // Теперь сервер принимает note, fileName и fileUrl
  const { type, amount, date, category, note, fileName, fileUrl } = req.body

  db.run(
    `INSERT INTO transactions (userId, type, amount, date, category, note, fileName, fileUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, type, amount, date, category, note || '', fileName || null, fileUrl || null],
    function (err) {
      if (err) return res.status(500).json({ message: 'Ошибка создания' })
      res.json({ id: this.lastID, userId: req.user.id, type, amount, date, category, note, fileName, fileUrl })
    }
  )
})

router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM transactions WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], () => res.json({ ok: true }))
})

router.put('/:id', auth, (req, res) => {
  const { type, amount, date, category, note, fileName, fileUrl } = req.body

  db.run(
    `UPDATE transactions SET type = ?, amount = ?, date = ?, category = ?, note = ?, fileName = ?, fileUrl = ?
     WHERE id = ? AND userId = ?`,
    [type, amount, date, category, note || '', fileName || null, fileUrl || null, req.params.id, req.user.id],
    () => res.json({ ok: true })
  )
})

module.exports = router