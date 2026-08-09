import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#15213B', dark: '#0D1526', light: '#2A3B63' },
        gold: { DEFAULT: '#E8A33D', dark: '#C6822A', light: '#F4C778' },
        success: { DEFAULT: '#1F9D6B', light: '#E3F6ED' },
        danger: { DEFAULT: '#E5484D', light: '#FCE8E9' },
        paper: '#F7F6F2',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21,33,59,0.04), 0 8px 24px -8px rgba(21,33,59,0.12)',
        'card-hover': '0 4px 8px rgba(21,33,59,0.06), 0 16px 32px -12px rgba(21,33,59,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
export default config;
