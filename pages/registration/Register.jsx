import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import AuthInput from '../../components/Auth/AuthInput';
import svgPaths from "./utils/svgPaths";
import './Register.css';

import Background from '../../assets/bg.svg?react';
import gmailPng from '../../assets/gmail.png';
import yandexPng from '../../assets/yandex.png';
import mailPng from '../../assets/mail.png';
import outlookPng from '../../assets/outlook.png';
import yahooPng from '../../assets/yahoo.png';
import icloudPng from '../../assets/icloud.png';

const emailDomains = [
  { domain: '@gmail.com', icon: gmailPng },
  { domain: '@yandex.ru', icon: yandexPng },
  { domain: '@mail.ru', icon: mailPng },
  { domain: '@outlook.com', icon: outlookPng },
  { domain: '@yahoo.com', icon: yahooPng },
  { domain: '@icloud.com', icon: icloudPng },
];

const employeeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];
const use1COptions = ['Да', 'Нет', 'Планирую'];
const positionOptions = ['Директор', 'Бухгалтер', 'Менеджер', 'Специалист', 'Другое'];

const phoneRegionCodes = {
  '495': '🏛️ Москва', '499': '🏛️ Москва', '496': '🏛️ Московская обл.', '498': '🏛️ Московская обл.',
  '812': '🏛️ Санкт-Петербург', '813': '🌊 Ленинградская обл.',
  '900': '📱 Мегафон', '901': '📱 Skylink', '902': '📱 Мотив/Tele2', '903': '📱 Билайн',
  '904': '📱 Мегафон', '905': '📱 Билайн', '906': '📱 Билайн', '908': '📱 Мегафон',
  '909': '📱 Билайн', '910': '📱 МТС', '911': '📱 МТС', '912': '📱 Мегафон',
  '913': '📱 Мегафон', '914': '📱 Мегафон', '915': '📱 МТС', '916': '📱 МТС',
  '917': '📱 МТС', '918': '📱 МТС', '919': '📱 Мегафон', '920': '📱 Мегафон',
  '921': '📱 Мегафон', '922': '📱 Мегафон', '923': '📱 Мегафон', '924': '📱 Мегафон',
  '925': '📱 Мегафон', '926': '📱 МТС', '927': '📱 Билайн', '928': '📱 Мегафон',
  '929': '📱 Билайн', '930': '📱 Мегафон', '931': '📱 Мегафон', '932': '📱 Мегафон',
  '933': '📱 МТС', '934': '📱 Мегафон', '936': '📱 Мегафон', '937': '📱 Мегафон',
  '938': '📱 МТС', '939': '📱 МТС', '950': '📱 МТС', '951': '📱 Билайн',
  '952': '📱 Tele2', '953': '📱 Tele2', '954': '📱 Билайн', '955': '📱 Tele2',
  '956': '📱 Билайн', '958': '📱 МТС', '960': '📱 Билайн', '961': '📱 Билайн',
  '962': '📱 Билайн', '963': '📱 Билайн', '964': '📱 Билайн', '965': '📱 Билайн',
  '966': '📱 Билайн', '967': '📱 Билайн', '968': '📱 Билайн', '969': '📱 Билайн',
  '977': '📱 МТС', '978': '📱 Билайн', '980': '📱 Билайн', '981': '📱 Билайн',
  '982': '📱 Билайн', '983': '📱 Билайн', '984': '📱 Tele2', '985': '📱 Билайн',
  '986': '📱 Билайн', '987': '📱 Билайн', '988': '📱 Билайн', '989': '📱 Билайн',
  '991': '📱 Tele2', '992': '📱 Tele2', '993': '📱 Tele2', '994': '📱 Tele2',
  '995': '📱 Tele2', '996': '📱 Tele2', '997': '📱 Билайн', '999': '📱 Билайн',
  '341': '🌊 Удмуртия', '342': '❄️ Пермский край', '343': '🌊 Свердловская обл.',
  '345': '🌊 Тюменская обл.', '346': '🌊 Оренбургская обл.', '347': '🏔️ Башкортостан',
  '349': '❄️ Ямало-Ненецкий АО', '351': '🌊 Челябинская обл.', '352': '🌊 Курганская обл.',
  '353': '🌊 Краснодарский край', '381': '🌊 Омская обл.', '382': '🌊 Томская обл.',
  '383': '🌊 Новосибирская обл.', '384': '🌊 Кемеровская обл.', '385': '🌊 Алтайский край',
  '388': '🏔️ Алтай', '390': '🏔️ Хакасия', '391': '❄️ Красноярский край',
  '394': '🏔️ Тыва', '395': '🌊 Иркутская обл.', '411': '🏔️ Саха (Якутия)',
  '413': '❄️ Магаданская обл.', '415': '❄️ Камчатский край', '416': '🌊 Амурская обл.',
  '421': '❄️ Хабаровский край', '423': '🌊 Приморский край', '424': '❄️ Сахалинская обл.',
  '426': '🌊 Удмуртия', '471': '🌊 Курская обл.', '472': '🌊 Белгородская обл.',
  '473': '🌊 Воронежская обл.', '474': '🌊 Липецкая обл.', '475': '🌊 Тамбовская обл.',
  '481': '🌊 Смоленская обл.', '482': '🌊 Тверская обл.', '483': '🌊 Брянская обл.',
  '484': '🌊 Калужская обл.', '485': '🌊 Ярославская обл.', '486': '🌊 Тульская обл.',
  '487': '🌊 Орловская обл.', '491': '🌊 Рязанская обл.', '492': '🌊 Владимирская обл.',
  '493': '🌊 Ивановская обл.', '494': '🌊 Костромская обл.', '811': '🌊 Псковская обл.',
  '814': '🌊 Новгородская обл.', '815': '🌊 Мурманская обл.', '816': '🌊 Архангельская обл.',
  '817': '🌊 Вологодская обл.', '818': '❄️ Ненецкий АО', '820': '🏔️ Коми',
  '831': '🌊 Нижегородская обл.', '833': '🌊 Кировская обл.', '834': '🏔️ Марий Эл',
  '835': '🏔️ Чувашия', '836': '🏔️ Мордовия', '841': '❄️ Пензенская обл.',
  '842': '🌊 Саратовская обл.', '844': '🌊 Волгоградская обл.', '845': '🌊 Самарская обл.',
  '846': '🌊 Самарская обл.', '847': '🌊 Ульяновская обл.', '851': '🌊 Астраханская обл.',
  '855': '🏔️ Татарстан', '861': '🌊 Краснодарский край', '862': '🌊 Ставропольский край',
  '863': '🌊 Ростовская обл.', '865': '🏔️ Кабардино-Балкария', '866': '🏔️ Северная Осетия',
  '867': '🏔️ Ингушетия', '869': '🏔️ Чечня', '871': '🏔️ Карачаево-Черкесия',
  '872': '🏔️ Дагестан', '873': '🏔️ Адыгея', '877': '🏔️ Калмыкия',
};

const russianRegions = {
  '01': '🏔️ Адыгея', '02': '🏔️ Башкортостан', '03': '🏔️ Бурятия', '04': '🏔️ Алтай',
  '05': '🏔️ Дагестан', '06': '🏔️ Ингушетия', '07': '🏔️ Кабардино-Балкария', '08': '🏔️ Калмыкия',
  '09': '🏔️ Карачаево-Черкесия', '10': '🏔️ Карелия', '11': '🏔️ Коми', '12': '🏔️ Марий Эл',
  '13': '🏔️ Мордовия', '14': '🏔️ Саха (Якутия)', '15': '🏔️ Северная Осетия', '16': '🏔️ Татарстан',
  '17': '🏔️ Тыва', '18': '🏔️ Удмуртия', '19': '🏔️ Хакасия', '20': '🏔️ Чечня',
  '21': '🏔️ Чувашия', '22': '🌊 Алтайский край', '23': '🌊 Краснодарский край', '24': '❄️ Красноярский край',
  '25': '🌊 Приморский край', '26': '🌊 Ставропольский край', '27': '❄️ Хабаровский край', '28': '🌊 Амурская обл.',
  '29': '🌊 Архангельская обл.', '30': '🌊 Астраханская обл.', '31': '🌊 Белгородская обл.', '32': '🌊 Брянская обл.',
  '33': '🌊 Владимирская обл.', '34': '🌊 Волгоградская обл.', '35': '🌊 Вологодская обл.', '36': '🌊 Воронежская обл.',
  '37': '🌊 Ивановская обл.', '38': '🌊 Иркутская обл.', '39': '🌊 Калининградская обл.', '40': '🌊 Калужская обл.',
  '41': '❄️ Камчатский край', '42': '🌊 Кемеровская обл.', '43': '🌊 Кировская обл.', '44': '🌊 Костромская обл.',
  '45': '🌊 Курганская обл.', '46': '🌊 Курская обл.', '47': '🌊 Ленинградская обл.', '48': '🌊 Липецкая обл.',
  '49': '❄️ Магаданская обл.', '50': '🏛️ Московская обл.', '51': '🌊 Мурманская обл.', '52': '🌊 Нижегородская обл.',
  '53': '🌊 Новгородская обл.', '54': '🌊 Новосибирская обл.', '55': '🌊 Омская обл.', '56': '🌊 Оренбургская обл.',
  '57': '🌊 Орловская обл.', '58': '❄️ Пензенская обл.', '59': '❄️ Пермский край', '60': '🌊 Псковская обл.',
  '61': '🌊 Ростовская обл.', '62': '🌊 Рязанская обл.', '63': '🌊 Самарская обл.', '64': '🌊 Саратовская обл.',
  '65': '❄️ Сахалинская обл.', '66': '🌊 Свердловская обл.', '67': '🌊 Смоленская обл.', '68': '🌊 Тамбовская обл.',
  '69': '🌊 Тверская обл.', '70': '🌊 Томская обл.', '71': '🌊 Тульская обл.', '72': '🌊 Тюменская обл.',
  '73': '🌊 Ульяновская обл.', '74': '🌊 Челябинская обл.', '75': '❄️ Забайкальский край', '76': '🌊 Ярославская обл.',
  '77': '🏛️ Москва', '78': '🏛️ Санкт-Петербург', '79': '🏛️ Еврейская АО', '83': '❄️ Ненецкий АО',
  '86': '❄️ Ханты-Мансийский АО', '87': '❄️ Чукотский АО', '89': '❄️ Ямало-Ненецкий АО',
  '91': '🏛️ Крым', '92': '🏛️ Севастополь', '99': '🏛️ Байконур'
};

export function Gradient() {
  return (
    <div className="absolute h-[532px] w-[377px]" data-name="gradient">
      <div className="absolute inset-[-28.2%_-39.79%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 677 832">
          <g filter="url(#filter0_fn_1_36)" id="gradient" opacity="0.8">
            <path clipRule="evenodd" d={svgPaths.p19644700} fill="var(--fill-0, #767D8F)" fillRule="evenodd" id="Vector" />
            <path clipRule="evenodd" d={svgPaths.p1af99fc0} fill="var(--fill-0, #767D8F)" fillRule="evenodd" id="Vector_2" />
            <path clipRule="evenodd" d={svgPaths.p5f60300} fill="var(--fill-0, #767D8F)" fillRule="evenodd" id="Vector_3" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="832" id="filter0_fn_1_36" width="677" x="2.82019e-08" y="-1.30825e-07">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_36" stdDeviation="75" />
              <feTurbulence baseFrequency="1 1" numOctaves="3" result="noise" seed="2050" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_foregroundBlur_1_36" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_36">
                <feMergeNode in="effect1_foregroundBlur_1_36" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative w-full h-[52px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative block w-full h-full bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-[16px] border font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] ${
          error ? 'border-red-500' : 'border-white/20 dark:border-white/10'
        } shadow-sm transition-all focus:border-[#767d8f]/40 dark:focus:border-white/30 text-left`}
      >
        <span className={`absolute duration-300 transform -translate-y-3 scale-75 top-[16px] left-4 z-10 font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] ${
          value ? 'text-slate-500 dark:text-white/50' : 'text-slate-500 dark:text-white/50 translate-y-0 scale-100'
        }`}>
          {placeholder}
        </span>
        {value && <span className="block pt-[24px] px-4 text-[13px] text-slate-800 dark:text-white font-['Poppins:Regular','Noto_Sans:Regular',sans-serif]">{value}</span>}
        
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronDown className="size-4 text-[#767d8f] dark:text-white/50" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-[#1a1c23] rounded-[16px] shadow-xl overflow-hidden z-30 border border-white/20 dark:border-white/10"
          >
            {options.map((option) => (
              <motion.button
                key={option} type="button"
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full px-4 py-3 text-left text-[13px] font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] transition-colors ${
                  value === option ? 'bg-[#767d8f] dark:bg-white text-white dark:text-black' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-slate-800 dark:text-white/80'
                }`}
                whileHover={{ x: 4 }}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    companyName: '', email: '', phone: '+7 ', employeeCount: '', inn: '',
    use1C: '', fullName: '', position: '', password: '', confirmPassword: '',
  });

  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const emailInputRef = useRef(null);

  const getINNRegion = (inn) => inn.length >= 2 ? russianRegions[inn.slice(0, 2)] : null;
  const getPhoneRegion = (phone) => {
    const num = phone.replace(/\D/g, '');
    return num.length >= 4 && num.startsWith('7') ? phoneRegionCodes[num.slice(1, 4)] : null;
  };
  const getEmailProvider = (email) => {
    const match = emailDomains.find(d => email.toLowerCase().includes(d.domain));
    return match ? match.icon : null;
  };

  const innRegion = getINNRegion(data.inn);
  const phoneRegion = getPhoneRegion(data.phone);
  const currentProvider = getEmailProvider(data.email);

  useEffect(() => {
    const atIndex = data.email.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === data.email.length - 1) {
      setEmailSuggestions(emailDomains.map(d => d.domain));
    } else if (atIndex !== -1) {
      const afterAt = data.email.slice(atIndex);
      setEmailSuggestions(emailDomains.map(d => d.domain).filter(d => d.startsWith(afterAt)));
    } else setEmailSuggestions([]);
    setActiveSuggestionIndex(0);
  }, [data.email]);

  const handleEmailKeyDown = (e) => {
    if (!emailSuggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestionIndex(p => p < emailSuggestions.length - 1 ? p + 1 : 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestionIndex(p => p > 0 ? p - 1 : emailSuggestions.length - 1); }
    else if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      setData({ ...data, email: data.email.slice(0, data.email.lastIndexOf('@')) + emailSuggestions[activeSuggestionIndex] });
      setEmailSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setData({ ...data, email: data.email.slice(0, data.email.lastIndexOf('@')) + suggestion });
    setEmailSuggestions([]);
    emailInputRef.current?.focus();
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    let digits = numbers.startsWith('7') ? numbers.slice(1) : numbers;
    digits = digits.slice(0, 10);
    if (digits.length === 0) return '+7 ';
    if (digits.length <= 3) return `+7 (${digits}`;
    if (digits.length <= 6) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 8) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  };

  const handlePhoneChange = (value) => {
    if (value.length < 3) return setData({ ...data, phone: '+7 ' });
    setData({ ...data, phone: formatPhone(value) });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.companyName.trim() !== '' && data.email.includes('@') && data.email.includes('.');
      case 2: return data.phone.length >= 16 && data.employeeCount !== '';
      case 3: return data.inn.length >= 10 && data.use1C !== '';
      case 4: return data.fullName.trim() !== '' && data.position !== '';
      case 5: return data.password.length >= 6 && data.password === data.confirmPassword;
      default: return false;
    }
  };

const handleNextClick = async () => {
  if (!canProceed()) {
    setShake(true)
    setTimeout(() => setShake(false), 500)
    return
  }

  if (step < 5) {
    setStep(step + 1)
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        employeeCount: data.employeeCount,
        inn: data.inn,
        use1C: data.use1C,
        fullName: data.fullName,
        position: data.position,
        password: data.password,
        confirmPassword: data.confirmPassword
      })
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.message)
      return
    }

    // 👉 после регистрации сразу на login
    navigate('/login')

  } catch (err) {
    console.error(err)
    alert('Ошибка сервера')
  }
}

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <AuthInput label="Название компании / ИП / ООО" value={data.companyName} onChange={e => setData({...data, companyName: e.target.value})} error={shake && !data.companyName} />
            <div className="relative">
              <AuthInput ref={emailInputRef} label="Рабочая почта" type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} onKeyDown={handleEmailKeyDown} error={shake && (!data.email.includes('@') || !data.email.includes('.'))} icon={currentProvider} />
              <AnimatePresence>
                {emailSuggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full mt-2 w-full bg-white dark:bg-[#1a1c23] rounded-[16px] shadow-xl overflow-hidden z-20 border border-slate-100 dark:border-white/10">
                    {emailSuggestions.map((suggestion, index) => (
                      <motion.div key={suggestion} onClick={() => selectSuggestion(suggestion)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${index === activeSuggestionIndex ? 'bg-slate-50 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`} whileHover={{ x: 4 }}>
                        <img src={emailDomains.find(d => d.domain === suggestion)?.icon} alt="icon" className="w-5 h-5 object-contain" />
                        <span className="text-[12px] text-black dark:text-white font-['Poppins:Regular','Noto_Sans:Regular',sans-serif]">{data.email.split('@')[0]}{suggestion}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* ИСПРАВЛЕНИЕ: Добавили mb-5 чтобы тексту региона было место снизу */}
            <div className="relative mb-5">
              <AuthInput label="Телефон" type="tel" value={data.phone} onChange={e => handlePhoneChange(e.target.value)} error={shake && data.phone.length < 16} icon={phoneRegion ? phoneRegion.split(' ')[0] : null} />
              {phoneRegion && <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="absolute -bottom-5 left-4 text-[10px] text-slate-500 dark:text-white/50 font-['Poppins:Regular',sans-serif] z-0">{phoneRegion.split(' ').slice(1).join(' ')}</motion.div>}
            </div>
            <CustomSelect value={data.employeeCount} onChange={v => setData({...data, employeeCount: v})} options={employeeOptions} placeholder="Количество сотрудников" error={shake && !data.employeeCount} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* ИСПРАВЛЕНИЕ: Добавили mb-5 чтобы тексту региона было место снизу */}
            <div className="relative mb-5">
              <AuthInput label="ИНН" value={data.inn} maxLength={12} onChange={e => setData({...data, inn: e.target.value.replace(/\D/g, '')})} error={shake && data.inn.length < 10} icon={innRegion ? innRegion.split(' ')[0] : null} />
              {innRegion && <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="absolute -bottom-5 left-4 text-[10px] text-slate-500 dark:text-white/50 font-['Poppins:Regular',sans-serif] z-0">{innRegion.split(' ').slice(1).join(' ')}</motion.div>}
            </div>
            <CustomSelect value={data.use1C} onChange={v => setData({...data, use1C: v})} options={use1COptions} placeholder="Уже пользуетесь 1С?" error={shake && !data.use1C} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <AuthInput label="ФИО" value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} error={shake && !data.fullName} />
            <CustomSelect value={data.position} onChange={v => setData({...data, position: v})} options={positionOptions} placeholder="Должность" error={shake && !data.position} />
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <AuthInput label="Пароль" type="password" value={data.password} onChange={e => setData({...data, password: e.target.value})} error={shake && data.password.length < 6} />
            <AuthInput label="Подтвердите пароль" type="password" value={data.confirmPassword} onChange={e => setData({...data, confirmPassword: e.target.value})} error={shake && (data.password !== data.confirmPassword || !data.confirmPassword)} />
            {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-red-500 text-center font-['Poppins:Medium']">Пароли не совпадают</motion.p>
            )}
          </motion.div>
        );
      default: return null;
    }
  };

  const companyText = data.companyName || 'CtrlMoney';
  const isLong = companyText.length > 15;

  return (
    <div className="relative size-full min-h-screen flex items-center justify-center register-page transition-colors duration-500 overflow-hidden" data-name="регистрация">
          
      <div className="relative z-10 w-full max-w-[360px] px-4">
        <motion.div className="flex justify-center gap-2 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <motion.div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-[#767d8f] dark:bg-white' : s < step ? 'w-1.5 bg-[#767d8f]/50 dark:bg-white/50' : 'w-1.5 bg-white/50 dark:bg-white/20'}`} />
          ))}
        </motion.div>

        <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
          <motion.div 
            className="bg-white/40 dark:bg-[#0a0a0a]/60 backdrop-blur-xl rounded-[24px] p-8 shadow-2xl border border-white/30 dark:border-white/10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, type: "spring" }}
          >
            
            <div className="mb-8 flex justify-center items-center overflow-hidden h-[40px] relative w-full mask-edges">
              {isLong && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/40 dark:from-[#0a0a0a]/60 to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/40 dark:from-[#0a0a0a]/60 to-transparent z-10" />
                </>
              )}
              <motion.div
                key={companyText}
                /* ИСПРАВЛЕНИЕ: Вернули font-['Poppins:Medium...'] */
                className="font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] text-black dark:text-white text-[28px] leading-none whitespace-nowrap"
                style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 500" }}
                animate={isLong ? { x: ["0%", "-50%"] } : { x: 0 }}
                transition={isLong ? { repeat: Infinity, ease: "linear", duration: companyText.length * 0.2 } : {}}
              >
                {companyText}
                {isLong && <span className="pl-12">{companyText}</span>}
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setStep(step - 1)}
                  className="bg-white/60 dark:bg-white/5 backdrop-blur-sm h-[48px] w-[48px] rounded-[16px] flex items-center justify-center transition-all shadow-sm hover:shadow-md border border-white/30 dark:border-white/10 cursor-pointer"
                >
                  <ChevronLeft className="size-5 text-[#767d8f] dark:text-white" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: canProceed() ? 1.02 : 1, y: canProceed() ? -2 : 0 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                onClick={handleNextClick}
                className={`h-[48px] rounded-[16px] flex-1 flex items-center justify-center transition-all shadow-md overflow-hidden relative group cursor-pointer ${
                  canProceed() 
                    ? 'bg-[#767d8f] dark:bg-white hover:bg-[#646a7a] hover:shadow-[0_4px_15px_rgba(118,125,143,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-gray-300 dark:bg-white/10 cursor-not-allowed'
                }`}
              >
                {/* ИСПРАВЛЕНИЕ: Вернули font-['Poppins:Medium...'] на кнопку */}
                <span className={`relative z-10 font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] text-[14px] ${canProceed() ? 'text-white dark:text-black' : 'text-white dark:text-white/30'}`}>
                  {step === 5 ? 'Готово!' : 'Далее'}
                </span>
                {canProceed() && (
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0" />
                )}
              </motion.button>
            </div>
            
            <div className="mt-5 text-center text-sm text-[#475569] dark:text-white/50 font-['Poppins:Regular',sans-serif]">
              Уже есть аккаунт?{' '}
              <button onClick={() => navigate('/login')} className="font-semibold text-[#767d8f] dark:text-white hover:text-[#575f74] transition-colors">
                Войти
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}