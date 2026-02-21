import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0e7a6e',
          light: '#e6f7f5',
          dark: '#0a5c52',
        },
        gold: {
          DEFAULT: '#C8A951',
          light: '#f5e6b3',
        },
        card: '#f0faf8',
        surface: '#ffffff',
      },
      fontFamily: {
        amiri: ['var(--font-amiri)', 'serif'],
        nastaliq: ['var(--font-nastaliq)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(14, 122, 110, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(14, 122, 110, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'islamic-pattern': "url('/patterns/islamic-pattern.svg')",
      },
    },
  },
  plugins: [],
}
export default config
