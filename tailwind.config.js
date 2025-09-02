/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Your original nested palette
        x: {
          yellow: '#E8F793',
          black: '#121212',
          deep:  '#292D32',
          gray:  '#C1C2CE',
          gray2: '#9899AC',
          white: '#FFFFFF',
          turquoise: {
            DEFAULT: "#1FD6C0",
            50:  "#E8FFFC",
            100: "#CCFBF6",
            200: "#99F7EC",
            300: "#66EEDD",
            400: "#3AE0CE",
            500: "#1FD6C0",
            600: "#18B6A4",
            700: "#139486",
            800: "#0F756B",
            900: "#0C5E57",
          },
        },
        // Hyphenated aliases to match classes used in components (e.g. bg-xplor-yellow)
        'xplor-yellow': '#E8F793',
        'xplor-black':  '#121212',
        'xplor-deep':   '#292D32',
        'xplor-gray':   '#C1C2CE',
        'xplor-gray2':  '#9899AC',
      },
      fontFamily: {
        // body / UI font
        sans: ['Satoshi', 'Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        // headings/logo if you like
        display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        // BRAND font for <BrandXplor/> and anywhere else you want it
        brand: ['Typografix', 'Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}
