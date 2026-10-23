/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf2ff', // light royal blue
          100: '#cbe0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff', // primary royal blue
          600: '#0055cc',
          700: '#004499',
          800: '#003366',
          900: '#002233',
        },
        emergency: {
          50: '#ffe5e0',
          100: '#ffbcb4',
          200: '#ff9388',
          300: '#ff6a5c',
          400: '#ff4130',
          500: '#ff1904', // coral primary
          600: '#e60000',
          700: '#b30000',
          800: '#800000',
          900: '#4d0000',
        },
        urgency: {
          routine: '#10b981',    // Emerald
          elevated: '#f59e0b',   // Amber
          urgent: '#f97316',     // Orange
          emergency: '#ff1904',  // Coral
          unknown: '#64748b',    // Slate
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
