/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rise: '#ef4444',    // 上涨红
        fall: '#22c55e',    // 下跌绿
        flat: '#666666',    // 平盘灰
      }
    },
  },
  plugins: [],
}