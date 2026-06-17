const express = require('express')
const db = require('../db/sqlite')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, (req, res) => {
  db.all(
    `SELECT * FROM documents WHERE userId = ? ORDER BY id DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Ошибка загрузки документов' })
      const formattedRows = rows.map(row => ({ ...row, signed: !!row.signed }))
      res.json(formattedRows)
    }
  )
})

router.post('/', auth, (req, res) => {
  const { title, period, date, signed, url, fileName, type } = req.body
  db.run(
    `INSERT INTO documents (userId, title, period, date, signed, url, fileName, type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, title, period, date, signed ? 1 : 0, url, fileName, type],
    function (err) {
      if (err) return res.status(500).json({ message: 'Ошибка сохранения документа' })
      res.json({ id: this.lastID, ...req.body })
    }
  )
})

// ДОБАВЛЕНА ОБРАБОТКА signature, publicKey, certName
router.put('/:id/sign', auth, (req, res) => {
  const { signed, signature, publicKey, certName } = req.body
  db.run(
    `UPDATE documents SET signed = ?, signature = ?, publicKey = ?, certName = ? WHERE id = ? AND userId = ?`,
    [signed ? 1 : 0, signature || null, publicKey || null, certName || null, req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Ошибка обновления' })
      res.json({ ok: true })
    }
  )
})

router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM documents WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], () => res.json({ ok: true }))
})

module.exports = router