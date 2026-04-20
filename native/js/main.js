// ============================================
// EMAIL CONFIGURATION
// ============================================

const emailDomains = [
  { domain: '@gmail.com', icon: 'gmail' },
  { domain: '@yandex.ru', icon: 'yandex' },
  { domain: '@mail.ru', icon: 'mail' },
  { domain: '@outlook.com', icon: 'outlook' },
  { domain: '@yahoo.com', icon: 'yahoo' },
  { domain: '@icloud.com', icon: 'icloud' },
];

const emailIcons = {
  gmail: `<svg class="size-5" viewBox="0 0 24 24" fill="none">
    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" fill="#EA4335"/>
    <path d="M22 6L12 13L2 6V8L12 15L22 8V6Z" fill="#FFF"/>
  </svg>`,
  yandex: `<svg class="size-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FC3F1D"/>
    <path d="M13.5 7.5H11.5C9.5 7.5 8.5 8.5 8.5 10.5C8.5 12.2 9.2 13 10.5 13.3L8.5 17.5H10.5L12.3 13.5H13.5V17.5H15.5V7.5H13.5ZM13.5 12H12C10.9 12 10.5 11.5 10.5 10.5C10.5 9.5 10.9 9 12 9H13.5V12Z" fill="white"/>
  </svg>`,
  mail: `<svg class="size-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#005FF9"/>
    <path d="M18 8L12 13L6 8V6L12 11L18 6V8ZM18 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4Z" fill="white"/>
  </svg>`,
  outlook: `<svg class="size-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0078D4"/>
    <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5Z" fill="white"/>
  </svg>`,
  yahoo: `<svg class="size-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#6001D2"/>
    <path d="M14 7L12 12L10 7H8L11 14V17H13V14L16 7H14ZM8 17H6V19H8V17Z" fill="white"/>
  </svg>`,
  icloud: `<svg class="size-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#3693F3"/>
    <path d="M18 10C18 7.79 16.21 6 14 6C12.95 6 12 6.37 11.24 7C10.28 6.37 9.17 6 8 6C5.24 6 3 8.24 3 11C3 13.76 5.24 16 8 16H18C19.66 16 21 14.66 21 13C21 11.34 19.66 10 18 10Z" fill="white"/>
  </svg>`,
};

// ============================================
// REGION CONFIGURATION
// ============================================

const phoneRegionCodes = {
  '495': '🏛️ Москва', '499': '🏛️ Москва', '496': '🏛️ Московская обл.', '498': '🏛️ Московская обл.',
  '812': '🏛️ Санкт-Петербург', '813': '🌊 Ленинградская обл.',
  '900': '📱 Мегафон', '901': '📱 Skylink', '902': '📱 Мотив/Tele2', '903': '📱 Билайн',
  '904': '📱 Мегафон', '905': '📱 Билайн', '906': '📱 Билайн', '908': '📱 Мегафон',
  '909': '📱 Билайн', '910': '📱 МТС', '911': '📱 МТС', '912': '📱 Мегафон',
  '913': '📱 Мегафон', '914': '📱 Мегафон', '915': '📱 МТС', '916': '📱 МТС',
  '917': '📱 МТС', '918': '📱 МТС', '919': '📱 Мегафон', '920': '📱 Мегафон',
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

// ============================================
// STATE MANAGEMENT
// ============================================

let registrationData = {
  companyName: '',
  email: '',
  phone: '',
  inn: '',
  employeeCount: '',
  use1C: '',
  fullName: '',
  position: '',
  password: '',
  confirmPassword: '',
};

let currentStep = 1;

// ============================================
// NAVIGATION
// ============================================

function navigateTo(path) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  if (path === '/') {
    document.getElementById('landing-page').classList.add('active');
  } else if (path === '/login') {
    document.getElementById('login-page').classList.add('active');
    setupLoginPage();
  } else if (path === '/register') {
    document.getElementById('register-page').classList.add('active');
    setupRegisterPage();
  } else if (path === '/dashboard') {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      document.getElementById('dashboard-page').classList.add('active');
    } else {
      navigateTo('/login');
    }
  }

  window.scrollTo(0, 0);
}

// ============================================
// EMAIL PROVIDER DETECTION
// ============================================

function getEmailProvider(emailValue) {
  const lowerEmail = emailValue.toLowerCase();
  for (const { domain, icon } of emailDomains) {
    if (lowerEmail.includes(domain)) {
      return icon;
    }
  }
  return null;
}

function updateEmailIcon(inputId, iconContainerId) {
  const input = document.getElementById(inputId);
  const iconContainer = document.getElementById(iconContainerId);
  
  const provider = getEmailProvider(input.value);
  
  if (provider && emailIcons[provider]) {
    iconContainer.innerHTML = emailIcons[provider];
    iconContainer.classList.add('visible');
  } else {
    iconContainer.classList.remove('visible');
    iconContainer.innerHTML = '';
  }
}

// ============================================
// EMAIL SUGGESTIONS
// ============================================

function handleEmailInput(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);
  
  const atIndex = input.value.lastIndexOf('@');
  
  if (atIndex !== -1) {
    const afterAt = input.value.slice(atIndex);
    const matches = emailDomains
      .map(d => d.domain)
      .filter(domain => domain.startsWith(afterAt));
    
    if (matches.length > 0) {
      showEmailSuggestions(inputId, suggestionsId, matches, input.value);
    } else {
      suggestions.classList.remove('visible');
    }
  } else {
    suggestions.classList.remove('visible');
  }
  
  updateEmailIcon(inputId, suggestionsId === 'registerEmailSuggestions' ? 'regEmailIconContainer' : 'emailIconContainer');
}

function showEmailSuggestions(inputId, suggestionsId, suggestions, currentEmail) {
  const suggestionsContainer = document.getElementById(suggestionsId);
  const atIndex = currentEmail.lastIndexOf('@');
  const beforeAt = currentEmail.slice(0, atIndex);
  
  suggestionsContainer.innerHTML = suggestions.map((suggestion, index) => {
    const providerInfo = emailDomains.find(d => d.domain === suggestion);
    const iconHtml = providerInfo && emailIcons[providerInfo.icon] ? emailIcons[providerInfo.icon] : '';
    
    return `
      <div class="email-suggestion-item" onclick="selectEmailSuggestion('${inputId}', '${suggestionsId}', '${suggestion}', '${beforeAt}')">
        <div class="email-suggestion-icon">${iconHtml}</div>
        <div class="email-suggestion-text">${beforeAt}${suggestion}</div>
      </div>
    `;
  }).join('');
  
  suggestionsContainer.classList.add('visible');
}

function selectEmailSuggestion(inputId, suggestionsId, suggestion, beforeAt) {
  const input = document.getElementById(inputId);
  input.value = beforeAt + suggestion;
  
  const suggestionsContainer = document.getElementById(suggestionsId);
  suggestionsContainer.classList.remove('visible');
  
  updateEmailIcon(inputId, suggestionsId === 'registerEmailSuggestions' ? 'regEmailIconContainer' : 'emailIconContainer');
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// ============================================
// REGION DETECTION
// ============================================

function getINNRegion(inn) {
  if (inn.length >= 2) {
    const regionCode = inn.slice(0, 2);
    return russianRegions[regionCode] || null;
  }
  return null;
}

function getPhoneRegion(phone) {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length >= 4 && numbers.startsWith('7')) {
    const regionCode = numbers.slice(1, 4);
    return phoneRegionCodes[regionCode] || null;
  }
  return null;
}

// ============================================
// LOGIN FUNCTIONALITY
// ============================================

function setupLoginPage() {
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginBtn = document.getElementById('loginBtn');
  
  loginEmail.addEventListener('input', () => {
    handleEmailInput('loginEmail', 'emailSuggestions');
    updateLoginButton();
  });
  
  loginEmail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      document.getElementById('emailSuggestions').classList.remove('visible');
    }
  });
  
  loginPassword.addEventListener('input', updateLoginButton);
  
  loginEmail.addEventListener('blur', () => {
    setTimeout(() => {
      document.getElementById('emailSuggestions').classList.remove('visible');
    }, 200);
  });
}

function updateLoginButton() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const loginBtn = document.getElementById('loginBtn');
  
  const canLogin = email.length > 0 && password.length >= 6;
  loginBtn.disabled = !canLogin;
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  
  if (email.length === 0 || password.length < 6) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }
  
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', email);
  
  navigateTo('/dashboard');
}

function handleLogout() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  navigateTo('/');
}

// ============================================
// REGISTRATION FUNCTIONALITY
// ============================================

function setupRegisterPage() {
  const companyName = document.getElementById('companyName');
  const registerEmail = document.getElementById('registerEmail');
  const phone = document.getElementById('phone');
  const inn = document.getElementById('inn');
  
  companyName.addEventListener('input', updateProgressBars);
  registerEmail.addEventListener('input', () => {
    handleEmailInput('registerEmail', 'registerEmailSuggestions');
    updateProgressBars();
  });
  phone.addEventListener('input', (e) => {
    formatPhoneNumber(e);
    updateProgressBars();
  });
  inn.addEventListener('input', (e) => {
    validateINN(e);
    updateProgressBars();
  });
  
  registerEmail.addEventListener('blur', () => {
    setTimeout(() => {
      document.getElementById('registerEmailSuggestions').classList.remove('visible');
    }, 200);
  });
  
  currentStep = 1;
  updateProgressBars();
}

function formatPhoneNumber(e) {
  const input = e.target;
  let value = input.value.replace(/\D/g, '');
  
  if (!value.startsWith('7')) {
    value = '7' + value;
  }
  
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  let formatted = '+' + value;
  if (value.length > 1) {
    formatted = '+' + value[0] + ' (' + value.slice(1, 4) + ') ' + value.slice(4, 7);
    if (value.length > 7) {
      formatted += '-' + value.slice(7, 9);
    }
    if (value.length > 9) {
      formatted += '-' + value.slice(9, 11);
    }
  }
  
  input.value = formatted;
  registrationData.phone = formatted;
}

function validateINN(e) {
  const inn = e.target.value;
  registrationData.inn = inn;
  
  const innRegionDiv = document.getElementById('innRegionDiv');
  const innRegionText = document.getElementById('innRegionText');
  const region = getINNRegion(inn);
  
  if (region && inn.length >= 2) {
    innRegionDiv.style.display = 'block';
    innRegionText.textContent = region;
  } else {
    innRegionDiv.style.display = 'none';
  }
}

function updateProgressBars() {
  const bar1 = document.getElementById('progress1');
  const bar2 = document.getElementById('progress2');
  const bar3 = document.getElementById('progress3');
  
  bar1.classList.remove('active', 'completed');
  bar2.classList.remove('active', 'completed');
  bar3.classList.remove('active', 'completed');
  
  if (currentStep === 1) {
    bar1.classList.add('active');
  } else if (currentStep === 2) {
    bar1.classList.add('completed');
    bar2.classList.add('active');
  } else if (currentStep === 3) {
    bar1.classList.add('completed');
    bar2.classList.add('completed');
    bar3.classList.add('active');
  }
}

function validateStep1() {
  const companyName = document.getElementById('companyName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  if (!companyName) {
    alert('Пожалуйста, введите название компании');
    return false;
  }
  if (!email || !email.includes('@')) {
    alert('Пожалуйста, введите корректный email');
    return false;
  }
  if (!phone || phone.length < 10) {
    alert('Пожалуйста, введите корректный номер телефона');
    return false;
  }
  
  registrationData.companyName = companyName;
  registrationData.email = email;
  registrationData.phone = phone;
  
  return true;
}

function validateStep2() {
  const inn = document.getElementById('inn').value.trim();
  const employeeCount = document.getElementById('employeeCount').value;
  const use1C = document.getElementById('use1C').value;
  
  if (!inn) {
    alert('Пожалуйста, введите ИНН');
    return false;
  }
  if (!/^\d{10}$/.test(inn)) {
    alert('ИНН должен состоять из 10 цифр');
    return false;
  }
  if (!employeeCount) {
    alert('Пожалуйста, выберите количество сотрудников');
    return false;
  }
  if (!use1C) {
    alert('Пожалуйста, выберите использование 1С');
    return false;
  }
  
  registrationData.inn = inn;
  registrationData.employeeCount = employeeCount;
  registrationData.use1C = use1C;
  
  return true;
}

function validateStep3() {
  const fullName = document.getElementById('fullName').value.trim();
  const position = document.getElementById('position').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (!fullName) {
    alert('Пожалуйста, введите ФИО');
    return false;
  }
  if (!position) {
    alert('Пожалуйста, выберите должность');
    return false;
  }
  if (!password || password.length < 6) {
    alert('Пароль должен содержать минимум 6 символов');
    return false;
  }
  if (password !== confirmPassword) {
    alert('Пароли не совпадают');
    return false;
  }
  
  registrationData.fullName = fullName;
  registrationData.position = position;
  registrationData.password = password;
  registrationData.confirmPassword = confirmPassword;
  
  return true;
}

function registerNextStep(step) {
  if (step === 1 && !validateStep1()) return;
  if (step === 2 && !validateStep2()) return;
  
  currentStep = Math.min(step + 1, 3);
  showStep(currentStep);
  updateProgressBars();
}

function registerPrevStep(step) {
  currentStep = Math.max(step - 1, 1);
  showStep(currentStep);
  updateProgressBars();
}

function showStep(step) {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(s => s.classList.remove('active'));
  
  const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
  if (activeStep) {
    activeStep.classList.add('active');
  }
}

function handleRegister() {
  if (!validateStep3()) return;
  
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', registrationData.email);
  localStorage.setItem('userData', JSON.stringify(registrationData));
  
  navigateTo('/dashboard');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('/');
});
