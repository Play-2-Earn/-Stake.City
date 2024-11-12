//  @type {import('tailwindcss').Config} 
module.exports = {
  content: [
    './app.jsx',
    './src/**/*.{jsx,tsx}', // Adjust this path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        'blue-1': "#0D1B2A",
        'blue-2': "#33669C",
        "emarald-1": "#20C997",
        "white-1": "#F0F3F5",
        "gray-1": "#A0AAB2",
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 18px 0px rgba(143, 214, 255, 0.7)' },
          '50%': { boxShadow: '0 0 25px 1px rgba(143, 214, 255, 0.9)' },
          '100%': { boxShadow: '0 0 18px 0px rgba(143, 214, 255, 0.7)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 3s infinite',
      },
    },
  },
  plugins: [],
}