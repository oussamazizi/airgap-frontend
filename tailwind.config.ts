import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111827', // gris très foncé
          50: '#f9fafb',
        }
      }
    },
  },
  plugins: [],
} satisfies Config;