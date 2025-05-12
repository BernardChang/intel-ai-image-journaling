/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        fg: 'var(--c-fg)',
        primary: 'var(--c-primary)',
        accent: 'var(--c-accent)',
      },
    },
  },
  plugins: [],
};
