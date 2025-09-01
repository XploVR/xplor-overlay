/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        x: {
          yellow: "#E8F793",
          black: "#121212",
          deep: "#292D32",
          gray: "#C1C2CE",
          gray2: "#9899AC",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        // body / UI font
        sans: ["Satoshi", "Inter", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        // for logo/brand lockup; use sparingly in headings if desired
        display: ["Satoshi", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
}
