import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Background from '../../assets/bg.svg?react'
import './Register.css'

const EmailIcons = {
  gmail: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" fill="#EA4335"/>
      <path d="M22 6L12 13L2 6V8L12 15L22 8V6Z" fill="#FFF"/>
    </svg>
  ),
  yandex: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#FC3F1D"/>
      <path d="M13.5 7.5H11.5C9.5 7.5 8.5 8.5 8.5 10.5C8.5 12.2 9.2 13 10.5 13.3L8.5 17.5H10.5L12.3 13.5H13.5V17.5H15.5V7.5H13.5ZM13.5 12H12C10.9 12 10.5 11.5 10.5 10.5C10.5 9.5 10.9 9 12 9H13.5V12Z" fill="white"/>
    </svg>
  ),
  mail: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#005FF9"/>
      <path d="M18 8L12 13L6 8V6L12 11L18 6V8ZM18 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4Z" fill="white"/>
    </svg>
  ),
  outlook: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0078D4"/>
      <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5Z" fill="white"/>
    </svg>
  ),
  yahoo: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#6001D2"/>
      <path d="M14 7L12 12L10 7H8L11 14V17H13V14L16 7H14ZM8 17H6V19H8V17Z" fill="white"/>
    </svg>
  ),
  icloud: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#3693F3"/>
      <path d="M18 10C18 7.79 16.21 6 14 6C12.95 6 12 6.37 11.24 7C10.28 6.37 9.17 6 8 6C5.24 6 3 8.24 3 11C3 13.76 5.24 16 8 16H18C19.66 16 21 14.66 21 13C21 11.34 19.66 10 18 10Z" fill="white"/>
    </svg>
  ),
}

const emailDomains = [
  { domain: '@gmail.com', icon: 'gmail' },
  { domain: '@yandex.ru', icon: 'yandex' },
  { domain: '@mail.ru', icon: 'mail' },
  { domain: '@outlook.com', icon: 'outlook' },
  { domain: '@yahoo.com', icon: 'yahoo' },
  { domain: '@icloud.com', icon: 'icloud' },
]

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailSuggestions, setEmailSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
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
      if (lowerEmail.includes(domain)) {
        return icon
      }
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
      setActiveSuggestionIndex((prev) =>
        prev < emailSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : emailSuggestions.length - 1
      )
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

  return (
    <div className="relative size-full flex items-center justify-center register-page bg-gradient-to-br from-[#e5e5ea] via-[#d8d8dd] to-[#e5e5ea]" data-name="login">
      <Background className="register-bg" />
      <div className="relative z-10 w-full max-w-[360px] px-4">
        <motion.div
          className="bg-white/40 backdrop-blur-xl rounded-[24px] p-8 shadow-2xl border border-white/30"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, type: 'spring' }}
        >
          <div className="mb-8 text-center">
            <motion.h1
              className="font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] text-black text-center"
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
            <div className="relative">
              <motion.div 
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                animate={currentProvider ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.5, x: -10 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
              >
                {currentProvider && EmailIcons[currentProvider] && (
                  <motion.div
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {EmailIcons[currentProvider]()}
                  </motion.div>
                )}
              </motion.div>

              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                placeholder="Рабочая почта"
                className={`bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md ${
                  currentProvider ? 'pl-11 pr-4' : 'px-4'
                }`}
              />

              <AnimatePresence>
                {emailSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-full bg-white rounded-[16px] shadow-xl overflow-hidden z-20 border border-white/20"
                  >
                    {emailSuggestions.map((suggestion, index) => {
                      const providerInfo = emailDomains.find(d => d.domain === suggestion)
                      return (
                        <motion.div
                          key={suggestion}
                          onClick={() => selectSuggestion(suggestion)}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            index === activeSuggestionIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          {providerInfo && EmailIcons[providerInfo.icon] && (
                            <div className="flex-shrink-0">
                              {EmailIcons[providerInfo.icon]()}
                            </div>
                          )}
                          <span className="text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif]">
                            {email.split('@')[0]}{suggestion}
                          </span>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full px-4 text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md"
            />
          </div>

          <motion.button
            whileHover={{ scale: canLogin ? 1.02 : 1 }}
            whileTap={{ scale: canLogin ? 0.98 : 1 }}
            type="button"
            onClick={() => {
              if (canLogin) {
                localStorage.setItem('isAuthenticated', 'true');
                // Добавляем микро-задержку, чтобы браузер успел обновить память
                setTimeout(() => {
                  navigate('/dashboard');
                }, 50);
              }
            }}
            disabled={!canLogin}
            className={`mt-6 h-[44px] w-full rounded-[16px] text-sm font-semibold text-white transition-all shadow-md ${
              canLogin ? 'bg-[#767d8f] hover:bg-[#646a7a] hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Войти
          </motion.button>

          <div className="mt-4 text-center text-sm text-[#475569]">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-[#767d8f] hover:text-[#575f74]"
            >
              Регистрация
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
