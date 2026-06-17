/** @type {import('tailwindcss').Config} */

// Функция для умножения твоего --index
const idx = (multiplier) => `calc(var(--index) * ${multiplier})`;

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Телефоны и вертикальные планшеты
      'mobile': { 'raw': '(max-width: 1023px), ((max-width: 1366px) and (orientation: portrait))' },
    },
    extend: {
      colors: {
        'primary': '#767d8f',
        'secondary': '#1e293b',
        'primary-icon': '#4C5A7A'
      },
      backgroundImage: {
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },

      fontFamily: {
        // Переопределяем стандартный шрифт Tailwind на Poppins
        sans: ['Poppins', 'sans-serif'],
      },
      
      // 1. УНИВЕРСАЛЬНЫЕ РАЗМЕРЫ (Отступы, Ширина, Высота: p-, m-, gap-, w-, h-)
      spacing: {
        'idx-pad': idx(0.5),    // Внутренние отступы (например, в кнопках меню)
        'idx-gap': idx(1),      // Расстояния (между пунктами меню, между карточками)
        'idx-4': idx(2),      // Отступы внутри карточек
        'idx-6': idx(3),      // Расстояния между блоками
        'idx-8': idx(4),
        'idx-12': idx(6),
        
        // Специфичные размеры для компонентов
        'idx-icon': idx(1.2),    // Размер иконок (w-idx-icon h-idx-icon)
        'idx-sidebar': idx(5.5), // Ширина боковой панели
      },

      // 2. АДАПТИВНАЯ ТИПОГРАФИКА (Размер шрифта + межстрочный интервал)
      fontSize: {
        'idx-xs': [idx(0.4), { lineHeight: idx(0.6) }],   // Мелкие подписи
        'idx-sm': [idx(0.5), { lineHeight: idx(0.7) }],   // Обычный текст (в меню, описания)
        'idx-base': [idx(0.6), { lineHeight: idx(0.9) }], // Основной текст
        'idx-lg': [idx(0.8), { lineHeight: idx(1.1) }],   // Подзаголовки
        'idx-xl': [idx(1.2), { lineHeight: idx(1.5) }],   // Заголовки
        'idx-2xl': [idx(1.8), { lineHeight: idx(2.1) }],  // Крупные цифры
        'idx-3xl': [idx(2.5), { lineHeight: idx(2.8) }],  // Гигантские цифры
      },

      // 3. АДАПТИВНЫЕ СКРУГЛЕНИЯ (border-radius)
      borderRadius: {
        'idx-sm': idx(0.25), // Для мелких элементов
        'idx-md': idx(0.5),  // Стандартные кнопки
        'idx-lg': idx(1),    // Для иконок (круг в меню)
        'idx-xl': idx(1.5),  // Для карточек
        'idx-2xl': idx(2),   // Для сайдбара (капсула), главных панелей
        'idx-full': '9999px', // Абсолютный круг
      },
      
      // 4. ТЕНИ
      boxShadow: {
        'idx-md': `0 ${idx(0.25)} ${idx(0.5)} rgba(0, 0, 0, 0.1)`, // Мягкая тень (для активной иконки)
      }
    },
  },
}