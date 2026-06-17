import { useNavigate } from 'react-router-dom'
import Login from '../assets/man.svg?react'
import Background from '../assets/bg.svg?react'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="container">
       <nav className="navbar">
          <div className="logo-placeholder"></div>
          
          <ul className="nav-links">
            <li><a href="#functions">Функции</a></li>
            <li><a href="#home">Главная</a></li>
            <li><a href="#prices">Цены</a></li>
          </ul>

          <div className="login-wrapper">
            <button 
              className="login-btn dark:text-white/60 dark:border-white/60 dark:hover:bg-white dark:hover:text-black dark:hover:border-white/80"
              onClick={() => navigate('/login')}
            >
              <Login className="login-icon"/>
              Войти
            </button>
          </div>
       </nav>

       <section className="hero">

          <h1>CtrlMoney</h1>
          <p>Управляйте своими финансами легко и эффективно с CtrlMoney</p>
          <button 
            className="cta-btn dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black dark:hover:border-white/80"
            onClick={() => navigate('/register')}
          >
            Начать сейчас
          </button>
       </section>
    </div>
  )
}

export default Landing