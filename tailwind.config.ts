import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{svelte,ts}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 8px 28px rgba(15, 42, 80, 0.07)',
      },
      colors: {
        ink: '#102a4c',
        primary: '#087fe8',
      },
    },
  },
  plugins: [],
} satisfies Config;
