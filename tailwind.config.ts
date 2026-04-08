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
          dark: '#1a1a1a', // More stable charcoal
          bg: '#fcfcfc', // Cleaner off-white
          border: '#f1f1f1', // Subtle separator
          lime: '#a3ff66',
          pink: '#D53F8C', // Refined Muted Rose
        }
      },
      boxShadow: {
        'soft': '0 1px 12px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 30px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 15px 40px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '1.5xl': '12px',
        '2.5xl': '20px',
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
