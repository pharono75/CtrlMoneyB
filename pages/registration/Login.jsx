import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthInput from '../../components/Auth/AuthInput' // Наш инновационный инпут
import './Register.css'

// ВЕРНУЛИ ТВОЙ SVG ФОН
import Background from '../../assets/bg.svg?react'

// ИМПОРТЫ PNG ИКОНОК
import gmailPng from '../../assets/gmail.png'
import yandexPng from '../../assets/yandex.png'
import mailPng from '../../assets/mail.png'
import outlookPng from '../../assets/outlook.png'
import yahooPng from '../../assets/yahoo.png'
import icloudPng from '../../assets/icloud.png'

const emailDomains = [
  { domain: '@gmail.com', icon: gmailPng },
  { domain: '@yandex.ru', icon: yandexPng },
  { domain: '@mail.ru', icon: mailPng },
  { domain: '@outlook.com', icon: outlookPng },
  { domain: '@yahoo.com', icon: yahooPng },
  { domain: '@icloud.com', icon: icloudPng },
]

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailSuggestions, setEmailSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  
  // Состояние для тряски при ошибке
  const [shake, setShake] = useState(false)

  const emailInputRef = useRef(null)
  const titleRef = useRef(null)
  const [titleFontSize, setTitleFontSize] = useState(36)

  useEffect(() => {
    const title = 'CtrlMoney'
    const length = title.length
    if (length > 20) {
      setTitleFontSize(Math.max(18, 36 - (length - 20) * 1.2))
    } else {
      setTitleFontSize(36)
    }
  }, [])

  const getEmailProvider = (emailValue) => {
    const lowerEmail = emailValue.toLowerCase()
    for (const { domain, icon } of emailDomains) {
      if (lowerEmail.includes(domain)) return icon
    }
    return null
  }

  const currentProvider = getEmailProvider(email)

  useEffect(() => {
    const atIndex = email.lastIndexOf('@')
    if (atIndex !== -1 && atIndex === email.length - 1) {
      setEmailSuggestions(emailDomains.map(d => d.domain))
      setActiveSuggestionIndex(0)
    } else if (atIndex !== -1 && atIndex < email.length - 1) {
      const afterAt = email.slice(atIndex)
      const matches = emailDomains
        .map(d => d.domain)
        .filter(domain => domain.startsWith(afterAt))
      setEmailSuggestions(matches)
      setActiveSuggestionIndex(0)
    } else {
      setEmailSuggestions([])
    }
  }, [email])

  const handleEmailKeyDown = (e) => {
    if (emailSuggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => prev < emailSuggestions.length - 1 ? prev + 1 : 0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => prev > 0 ? prev - 1 : emailSuggestions.length - 1)
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      if (emailSuggestions[activeSuggestionIndex]) {
        e.preventDefault()
        const atIndex = email.lastIndexOf('@')
        const beforeAt = email.slice(0, atIndex)
        setEmail(beforeAt + emailSuggestions[activeSuggestionIndex])
        setEmailSuggestions([])
      }
    } else if (e.key === 'Escape') {
      setEmailSuggestions([])
    }
  }

  const selectSuggestion = (suggestion) => {
    const atIndex = email.lastIndexOf('@')
    const beforeAt = email.slice(0, atIndex)
    setEmail(beforeAt + suggestion)
    setEmailSuggestions([])
    emailInputRef.current?.focus()
  }

  const canLogin = email.trim().length > 0 && password.trim().length >= 6

const handleLoginClick = async () => {
  if (!canLogin) {
    setShake(true)
    setTimeout(() => setShake(false), 500)
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    // 🔐 сохраняем JWT токен
    localStorage.setItem('token', data.token)

    // (опционально) пользователь
    localStorage.setItem('user', JSON.stringify(data.user))

    navigate('/dashboard')

  } catch (err) {
    console.error(err)
    alert('Ошибка сервера')
  }
}

  return (
<div className="relative size-full min-h-screen flex items-center justify-center register-page transition-colors duration-500 overflow-hidden" data-name="login">      
      {/* SVG ФОН */}
      <div className="relative z-10 w-full max-w-[360px] px-4">
        <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
          <motion.div
            className="bg-white/40 dark:bg-[#0a0a0a]/60 backdrop-blur-xl rounded-[24px] p-8 shadow-2xl border border-white/30 dark:border-white/10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, type: 'spring' }}
          >
            <div className="mb-8 text-center">
              <motion.h1
                className="font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] text-black dark:text-white transition-colors"
                style={{ fontSize: titleFontSize }}
                ref={titleRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                CtrlMoney
              </motion.h1>
            </div>

            <div className="space-y-4">
              
              {/* === ИННОВАЦИОННЫЙ ИНПУТ EMAIL === */}
              <div className="relative">
                <AuthInput
                  ref={emailInputRef}
                  label="Рабочая почта"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  error={shake && email.length === 0}
                  icon={currentProvider}

                />

                <AnimatePresence>
                  {emailSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-full bg-white dark:bg-[#1a1c23] rounded-[16px] shadow-xl overflow-hidden z-20 border border-slate-100 dark:border-white/10"
                    >
                      {emailSuggestions.map((suggestion, index) => {
                        const providerInfo = emailDomains.find(d => d.domain === suggestion)
                        return (
                          <motion.div
                            key={suggestion}
                            onClick={() => selectSuggestion(suggestion)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                              index === activeSuggestionIndex ? 'bg-slate-50 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                            whileHover={{ x: 4 }}
                          >
                            {providerInfo && (
                              <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                                <img src={providerInfo.icon} alt="icon" className="w-5 h-5 object-contain" />
                              </div>
                            )}
                            <span className="text-[12px] text-black dark:text-white font-['Poppins:Regular','Noto_Sans:Regular',sans-serif]">
                              {email.split('@')[0]}{suggestion}
                            </span>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* === ИННОВАЦИОННЫЙ ИНПУТ ПАРОЛЯ === */}
              <div className="relative">
                <AuthInput
                  label="Пароль"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={shake && password.length < 6}
                />
              </div>

            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleLoginClick}
              className={`mt-6 relative group h-[48px] w-full rounded-[16px] text-sm font-semibold transition-all shadow-md overflow-hidden ${
                canLogin 
                  ? 'bg-[#767d8f] dark:bg-white text-white dark:text-black hover:bg-[#646a7a] hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-gray-300 dark:bg-white/10 text-white dark:text-white/30 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10">Войти</span>
              {canLogin && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0" />
              )}
            </motion.button>

            <div className="mt-4 text-center text-sm text-[#475569] dark:text-white/50">
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-[#767d8f] dark:text-white hover:text-[#575f74] transition-colors"
              >
                Регистрация
              </button>
            </div>
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}