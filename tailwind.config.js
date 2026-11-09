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
          50: '#EAF7EF',  // Light green
          100: '#D2F0DE',
          200: '#A7E1BE',
          500: '#22A35D',
          600: '#16834A', // Primary green
          700: '#105C35', // Dark green
          800: '#0C4427',
          900: '#072D1A',
        },
        surface: {
          bg: '#F7FAF8',
          card: '#FFFFFF',
          text: '#1F2937',
          muted: '#4B5563',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
