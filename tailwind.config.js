/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // Sky 500
        secondary: '#0f172a', // Slate 900
        accent: '#10b981', // Emerald 500
      }
    },
  },
  plugins: [],
}