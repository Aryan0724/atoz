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
        brand: {
          base: '#F9F9F7',     /* Warm Alabaster */
          surface: '#ffffff',
          blue: '#1E3A8A',     /* Royal Blue */
          darkBlue: '#0B1120', /* Deep Navy */
          gold: '#C5A059',     /* Muted Gold */
          goldLight: '#E5D4B3',
          charcoal: '#1A1A1A',
        },
        // Keeping old colors for compatibility if needed, but primary will be brand.darkBlue
        primary: { DEFAULT: '#0B1120' },
        secondary: { DEFAULT: '#C5A059' },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      },
      cursor: {
        none: 'none',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'float': 'float 10s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
