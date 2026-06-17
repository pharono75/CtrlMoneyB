const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      companyName TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      employeeCount TEXT,
      inn TEXT,
      use1C TEXT,
      fullName TEXT,
      firstName TEXT,
      lastName TEXT,
      position TEXT,
      password TEXT,
      avatar TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      type TEXT,
      amount REAL,
      date TEXT,
      category TEXT,
      note TEXT,
      fileName TEXT,
      fileUrl TEXT
    )
  `)

  // ДОБАВИЛИ ВСЕ ПАСПОРТНЫЕ ДАННЫЕ И ДАТЫ
  db.run(`
    CREATE TABLE IF NOT EXISTS team (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      firstName TEXT,
      lastName TEXT,
      patronymic TEXT,
      position TEXT,
      department TEXT,
      email TEXT,
      phone TEXT,
      salary REAL,
      photo TEXT,
      hireDate TEXT,
      sex TEXT,
      birthDate TEXT,
      birthPlace TEXT,
      passportSeries TEXT,
      passportNumber TEXT,
      passportIssuedBy TEXT,
      passportIssueDate TEXT,
      passportDivisionCode TEXT,
      passportRegistrationAddress TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT,
      period TEXT,
      date TEXT,
      signed INTEGER,
      url TEXT,
      fileName TEXT,
      type TEXT,
      signature TEXT,
      publicKey TEXT,
      certName TEXT
    )
  `)
})

module.exports = db