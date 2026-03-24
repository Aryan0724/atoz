import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#E91E63' },
        'on-primary': '#ffffff',
        secondary: { DEFAULT: '#00426f' },
        'on-secondary': '#ffffff',
        surface: { DEFAULT: '#f9f9ff' },
        'on-surface': '#101b30',
        'surface-variant': '#d7e2ff',
        'on-surface-variant': '#5b3f43',
        outline: {
          variant: '#e4bdc2',
        },
        brand: {
          olive: '#5b5b42',
          dark: '#2d2d2d',
          bg: '#f7f7f2',
          border: '#e5e7eb',
          lime: '#a3ff66',
          pink: '#E91E63',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'premium': '0 20px 40px rgba(16, 27, 48, 0.04), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 30px 60px rgba(16, 27, 48, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
