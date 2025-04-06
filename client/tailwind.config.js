/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatReverse: 'floatReverse 7s ease-in-out infinite',
        slideIn: 'slideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        fadeIn: 'fadeIn 1s ease-out forwards',
        scaleIn: 'scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },
        floatReverse: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-2deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}