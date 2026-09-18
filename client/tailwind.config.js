/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        brand: {
          blue: '#2563eb',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
