import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import svgPaths from "./utils/svgPaths";
import Background from '../../assets/bg.svg?react';
import './Register.css';

// Email provider icons
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
};

const emailDomains = [
  { domain: '@gmail.com', icon: 'gmail' },
  { domain: '@yandex.ru', icon: 'yandex' },
  { domain: '@mail.ru', icon: 'mail' },
  { domain: '@outlook.com', icon: 'outlook' },
  { domain: '@yahoo.com', icon: 'yahoo' },
  { domain: '@icloud.com', icon: 'icloud' },
];

const employeeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];
const use1COptions = ['Да', 'Нет', 'Планирую'];
const positionOptions = ['Директор', 'Бухгалтер', 'Менеджер', 'Специалист', 'Другое'];

// Phone region codes (first 3 digits after +7)
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

// Russian regions mapping by INN first 2 digits
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

function Gradient() {
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

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full px-4 text-[12px] text-[rgba(27,31,38,0.9)] font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md flex items-center justify-between"
      >
        <span className={value ? 'text-black' : 'text-[rgba(27,31,38,0.5)]'}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="size-4 text-[#767d8f]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white rounded-[16px] shadow-xl overflow-hidden z-30 border border-white/20"
          >
            {options.map((option, index) => (
              <motion.button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-[12px] transition-colors ${
                  value === option 
                    ? 'bg-[#767d8f] text-white' 
                    : 'hover:bg-gray-50 text-black'
                }`}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
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
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    companyName: '',
    email: '',
    phone: '+7 ',
    employeeCount: '',
    inn: '',
    use1C: '',
    fullName: '',
    position: '',
    password: '',
    confirmPassword: '',
  });

  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailInputRef = useRef(null);
  const titleRef = useRef(null);
  const [titleFontSize, setTitleFontSize] = useState(36);

  // Calculate font size based on company name length
  useEffect(() => {
    if (data.companyName) {
      const length = data.companyName.length;
      if (length > 20) {
        setTitleFontSize(Math.max(18, 36 - (length - 20) * 1.2));
      } else {
        setTitleFontSize(36);
      }
    } else {
      setTitleFontSize(36);
    }
  }, [data.companyName]);

  // Get region from INN
  const getINNRegion = (inn) => {
    if (inn.length >= 2) {
      const regionCode = inn.slice(0, 2);
      return russianRegions[regionCode] || null;
    }
    return null;
  };

  const innRegion = getINNRegion(data.inn);

  // Get region from phone code
  const getPhoneRegion = (phone) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length >= 4 && numbers.startsWith('7')) {
      const regionCode = numbers.slice(1, 4);
      return phoneRegionCodes[regionCode] || null;
    }
    return null;
  };

  const phoneRegion = getPhoneRegion(data.phone);

  const getEmailProvider = (emailValue) => {
    const lowerEmail = emailValue.toLowerCase();
    for (const { domain, icon } of emailDomains) {
      if (lowerEmail.includes(domain)) {
        return icon;
      }
    }
    return null;
  };

  const currentProvider = getEmailProvider(data.email);

  useEffect(() => {
    const atIndex = data.email.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === data.email.length - 1) {
      setEmailSuggestions(emailDomains.map(d => d.domain));
      setActiveSuggestionIndex(0);
    } else if (atIndex !== -1 && atIndex < data.email.length - 1) {
      const afterAt = data.email.slice(atIndex);
      const matches = emailDomains
        .map(d => d.domain)
        .filter(domain => domain.startsWith(afterAt));
      setEmailSuggestions(matches);
      setActiveSuggestionIndex(0);
    } else {
      setEmailSuggestions([]);
    }
  }, [data.email]);

  const handleEmailKeyDown = (e) => {
    if (emailSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => 
        prev < emailSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => 
        prev > 0 ? prev - 1 : emailSuggestions.length - 1
      );
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      if (emailSuggestions[activeSuggestionIndex]) {
        e.preventDefault();
        const atIndex = data.email.lastIndexOf('@');
        const beforeAt = data.email.slice(0, atIndex);
        setData({ ...data, email: beforeAt + emailSuggestions[activeSuggestionIndex] });
        setEmailSuggestions([]);
      }
    } else if (e.key === 'Escape') {
      setEmailSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    const atIndex = data.email.lastIndexOf('@');
    const beforeAt = data.email.slice(0, atIndex);
    setData({ ...data, email: beforeAt + suggestion });
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
    if (value.length < 3) {
      setData({ ...data, phone: '+7 ' });
      return;
    }
    
    const formatted = formatPhone(value);
    setData({ ...data, phone: formatted });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.companyName.trim() !== '' && data.email.includes('@') && data.email.includes('.');
      case 2:
        return data.phone.length >= 10 && data.employeeCount !== '';
      case 3:
        return data.inn.length >= 10 && data.use1C !== '';
      case 4:
        return data.fullName.trim() !== '' && data.position !== '';
      case 5:
        return data.password.length >= 6 && data.password === data.confirmPassword;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        console.log('Registration data:', data);
        localStorage.setItem('isAuthenticated', 'true');
        setTimeout(() => {
          navigate('/dashboard');
        }, 10)
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const navigate = useNavigate();
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
                placeholder="Название компании/ ИП / ООО"
                className="bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full px-4 text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="relative">
              <motion.div 
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                animate={currentProvider ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.5, x: -10 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
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
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
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
                      const providerInfo = emailDomains.find(d => d.domain === suggestion);
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
                            {data.email.split('@')[0]}{suggestion}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[16px]"
                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                animate={phoneRegion ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.5, x: -10 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                {phoneRegion && (
                  <motion.div
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    title={phoneRegion}
                  >
                    {phoneRegion.split(' ')[0]}
                  </motion.div>
                )}
              </motion.div>
              
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+7 (XXX) XXX-XX-XX"
                className={`bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md ${
                  phoneRegion ? 'pl-11 pr-4' : 'px-4'
                }`}
              />
              {phoneRegion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-5 left-0 text-[9px] text-[#767d8f]"
                >
                  {phoneRegion.split(' ').slice(1).join(' ')}
                </motion.div>
              )}
            </div>
            <CustomSelect
              value={data.employeeCount}
              onChange={(value) => setData({ ...data, employeeCount: value })}
              options={employeeOptions}
              placeholder="Количество сотрудников"
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[16px]"
                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                animate={innRegion ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.5, x: -10 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                {innRegion && (
                  <motion.div
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    title={innRegion}
                  >
                    {innRegion.split(' ')[0]}
                  </motion.div>
                )}
              </motion.div>
              
              <input
                type="text"
                value={data.inn}
                onChange={(e) => setData({ ...data, inn: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                placeholder="ИНН"
                maxLength={12}
                className={`bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md ${
                  innRegion ? 'pl-11 pr-4' : 'px-4'
                }`}
              />
              {innRegion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-5 left-0 text-[9px] text-[#767d8f]"
                >
                  {innRegion.split(' ').slice(1).join(' ')}
                </motion.div>
              )}
            </div>
            <CustomSelect
              value={data.use1C}
              onChange={(value) => setData({ ...data, use1C: value })}
              options={use1COptions}
              placeholder="Уже пользуетесь 1С?"
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
              placeholder="ФИО"
              className="bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full px-4 text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md"
            />
            <CustomSelect
              value={data.position}
              onChange={(value) => setData({ ...data, position: value })}
              options={positionOptions}
              placeholder="Должность"
            />
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Пароль"
                className="bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full px-4 pr-11 text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767d8f] hover:text-[#646a7a] transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                placeholder="Подтвердите пароль"
                className="bg-white/80 backdrop-blur-sm border border-white/20 h-[44px] rounded-[16px] w-full px-4 pr-11 text-[12px] text-black font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] placeholder:text-[rgba(27,31,38,0.5)] focus:outline-none focus:border-[#767d8f]/40 transition-all shadow-sm hover:shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767d8f] hover:text-[#646a7a] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-red-500 text-center"
              >
                Пароли не совпадают
              </motion.p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative size-full flex items-center justify-center register-page bg-gradient-to-br from-[#e5e5ea] via-[#d8d8dd] to-[#e5e5ea]" data-name="регистрация">
      <Background className="register-bg" />
      
      <div className="relative z-10 w-full max-w-[360px] px-4">
        <motion.div 
          className="flex justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <motion.div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step 
                  ? 'w-8 bg-[#767d8f]' 
                  : s < step 
                    ? 'w-1.5 bg-[#767d8f]/50' 
                    : 'w-1.5 bg-white/30'
              }`}
              layoutId={s === step ? "active-pill" : undefined}
            />
          ))}
        </motion.div>

        <motion.div 
          className="bg-white/40 backdrop-blur-xl rounded-[24px] p-8 shadow-2xl border border-white/30"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="mb-8 flex justify-center items-center overflow-hidden h-[40px] px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={data.companyName || 'default'}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  fontSize: titleFontSize 
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] text-black text-center"
                style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 500" }}
                ref={titleRef}
              >
                {data.companyName || 'CtrlMoney'}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="bg-white/60 backdrop-blur-sm h-[44px] w-[44px] rounded-[16px] flex items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-md border border-white/30"
              >
                <ChevronLeft className="size-5 text-[#767d8f]" />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: canProceed() ? 1.02 : 1 }}
              whileTap={{ scale: canProceed() ? 0.98 : 1 }}
              onClick={handleNext}
              disabled={!canProceed()}
              className={`h-[44px] rounded-[16px] flex-1 flex items-center justify-center cursor-pointer transition-all shadow-md ${
                canProceed() 
                  ? 'bg-[#767d8f] hover:bg-[#646a7a] hover:shadow-lg' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] text-white text-[14px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 500" }}>
                {step === 5 ? 'Готово!' : 'Далее'}
              </span>
            </motion.button>
          </div>
          <div className="mt-4 text-center text-sm text-[#475569]">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-[#767d8f] hover:text-[#575f74]"
            >
              Войти
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
