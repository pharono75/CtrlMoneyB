// ============================================
// КРАТКАЯ СПРАВКА ДЛЯ РАЗРАБОТЧИКОВ
// ============================================

/*
СТРУКТУРА ФАЙЛОВ:
├── index.html        - Основной HTML-шаблон со всеми страницами
├── css/main.css      - Основные стили и layout
├── css/register.css  - Стили для форм
└── js/main.js        - Вся логика приложения

КЛЮЧЕВЫЕ ФУНКЦИИ:

1. НАВИГАЦИЯ:
   navigateTo(path)
   - '/' - главная страница
   - '/login' - вход
   - '/register' - регистрация
   - '/dashboard' - защищенная зона

2. EMAIL ФУНКЦИИ:
   handleEmailInput(inputId, suggestionsId)
   - Обработка ввода email
   - Показ подсказок для доменов
   - Определение провайдера
   
   selectEmailSuggestion(inputId, suggestionsId, suggestion, beforeAt)
   - Выбор предложения из списка

3. ВАЛИДАЦИЯ:
   validateStep1/2/3()
   - Валидация шагов регистрации при переходе
   
   validateINN(e)
   - Форматирование и определение регионов по ИНН

4. ФОРМАТИРОВАНИЕ:
   formatPhoneNumber(e)
   - Форматирование номера телефона (+7 (xxx) xxx-xx-xx)

5. РЕГИОНЫ:
   getINNRegion(inn)
   - Получить регион по ИНН
   
   getPhoneRegion(phone)
   - Получить регион по номеру телефона

6. АУТЕНТИФИКАЦИЯ:
   handleLogin()
   - Проверка login формы и сохранение в localStorage
   
   handleLogout()
   - Очистка localStorage и переход на главную
   
   handleRegister()
   - Сохранение данных регистрации в localStorage

7. ВИДИМОСТЬ ПАРОЛЯ:
   togglePasswordVisibility(inputId)
   - Переключение видимости пароля

STATE (глобальные переменные):
- registrationData - объект с данными регистрации
- currentStep - текущий шаг регистрации (1-3)
- emailDomains - список поддерживаемых email-доменов
- phoneRegionCodes - коды сотовых сетей и регионов
- russianRegions - коды регионов для ИНН

STORAGE:
localStorage:
  - isAuthenticated: 'true'|null - статус входа
  - userEmail: string - email пользователя
  - userData: JSON - все данные регистрации

СОБЫТИЯ:
- 'input' на email - обновление подсказок и иконки
- 'input' на phone - форматирование
- 'input' на inn - определение региона
- 'blur' на email - скрытие подсказок

СЕЛЕКТОРЫ DOM:
Основные контейнеры:
- #landing-page
- #login-page
- #register-page
- #dashboard-page

Login форма:
- #loginEmail
- #loginPassword
- #loginBtn

Register форма Step 1:
- #companyName
- #registerEmail
- #phone

Register форма Step 2:
- #inn
- #employeeCount
- #use1C

Register форма Step 3:
- #fullName
- #position
- #registerPassword
- #confirmPassword

Email suggestions:
- #emailSuggestions
- #registerEmailSuggestions
- #emailIconContainer
- #regEmailIconContainer

Progress:
- #progress1, #progress2, #progress3

КЛАССЫ CSS:
.page - контейнер страницы
.page.active - активная страница (видимая)
.form-step - шаг формы
.form-step.active - активный шаг (видимый)
.progress-bar - полоса прогресса
.progress-bar.active - заполненная полоса
.progress-bar.completed - завершённая полоса
.glass-card - карточка со стеклянным эффектом
.email-suggestions - контейнер подсказок email
.email-suggestions.visible - видимые подсказки
.email-suggestion-item - один элемент подсказки
.email-suggestion-item.active - активный элемент

КОДИРОВКА:
- Все email домены в нижнем регистре
- Регионы хранят emoji + описание
- ИНН всегда 10 цифр
- Телефон мобильный, начинается с +7

ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:

// Переход на страницу регистрации
navigateTo('/register');

// Получение региона по ИНН
const region = getINNRegion('7701000000'); // "🏛️ Москва"

// Получение региона по телефону
const region = getPhoneRegion('+7 (495) 123-45-67'); // "🏛️ Москва"

// Проверка email провайдера
const provider = getEmailProvider('user@gmail.com'); // "gmail"

// Сохранение данных пользователя
localStorage.setItem('userData', JSON.stringify(registrationData));

// Получение данных пользователя
const data = JSON.parse(localStorage.getItem('userData'));
*/

// ============================================
// ВАЖНЫЕ ПРИМЕЧАНИЯ ДЛЯ РАЗРАБОТКИ
// ============================================

/*
1. ВСЕ ФУНКЦИИ ГЛОБАЛЬНЫЕ
   - Функции вызываются из HTML напрямую
   - Нет модульной системы

2. СОСТОЯНИЕ ХРАНИТСЯ В:
   - localStorage для персистентности
   - Глобальные переменные для текущего состояния
   - HTML data-атрибуты для структуры

3. АНИМАЦИИ:
   - CSS анимации (no JS animations)
   - Класс .active для управления видимостью
   - Переходы через display: none/block

4. ВАЛИДАЦИЯ:
   - Происходит при переходе между шагами
   - Не происходит в реальном времени
   - Выводит alert с сообщением об ошибке

5. БЕЗОПАСНОСТЬ:
   - Данные хранятся в открытом виде в localStorage
   - Пароли передаются незашифрованными
   - ДЛЯ PRODUCTION: используйте хеширование и HTTPS

6. ПРОИЗВОДИТЕЛЬНОСТЬ:
   - DOM операции минимальны
   - Event delegation не используется
   - Прямые addEventListener() вызовы

7. БРАУЗЕРНАЯ СОВМЕСТИМОСТЬ:
   - ES6 (const, let, arrow functions)
   - Template literals
   - Fetch API (если потребуется)
   - Local Storage API

8. ИЗМЕНЕНИЯ И РАСШИРЕНИЯ:
   - Добавить новый email домен: добавить в emailDomains
   - Добавить новое поле: добавить в registrationData, HTML, валидацию
   - Добавить новую страницу: создать в HTML, функцию navigateTo, стили
   - Добавить новый регион: добавить в phoneRegionCodes или russianRegions
*/
