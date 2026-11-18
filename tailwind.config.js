/** @type {import('tailwindcss').Config} */
const mix = (v) => `color-mix(in srgb, var(${v}) calc(<alpha-value> * 100%), transparent)`;
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      colors: {
        a1: mix('--a1'),
        a2: mix('--a2'),
        ink: mix('--ink'),
        base: mix('--bg'),
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(20px,-30px) scale(1.08)' } },
        pop: { '0%': { transform: 'scale(.6)', opacity: 0 }, '60%': { transform: 'scale(1.12)', opacity: 1 }, '100%': { transform: 'scale(1)' } },
        rise: { '0%': { transform: 'translateY(14px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        sheet: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        fade: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        confetti: { '0%': { transform: 'translate(0,0) rotate(0)', opacity: 1 }, '100%': { transform: 'translate(var(--dx), var(--dy)) rotate(var(--rot))', opacity: 0 } },
        ring: { '0%': { transform: 'scale(.8)', opacity: .8 }, '100%': { transform: 'scale(1.6)', opacity: 0 } },
      },
      animation: {
        floaty: 'floaty 14s ease-in-out infinite',
        pop: 'pop .45s cubic-bezier(.2,1.4,.4,1) both',
        rise: 'rise .5s cubic-bezier(.2,.8,.2,1) both',
        sheet: 'sheet .42s cubic-bezier(.2,.9,.2,1) both',
        fade: 'fade .3s ease both',
        shimmer: 'shimmer 3s linear infinite',
        confetti: 'confetti 1.1s cubic-bezier(.1,.7,.3,1) forwards',
        ring: 'ring 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
