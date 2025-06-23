/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'team-blue': '#007BFF',
        'team-pink': '#FF69B4',
        'team-orange': '#FFA500',
        'team-purple': '#800080',
        'team-green': '#28A745',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 