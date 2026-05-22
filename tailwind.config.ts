import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#08060e',
          50: '#100e18',
          100: '#0c0a14',
          200: '#08060e',
          300: '#040308',
        },
        gold: {
          DEFAULT: '#c9973a',
          light: '#e8b84b',
          bright: '#f5d06e',
          pale: '#e8d5a3',
          dim: '#8a6520',
          deep: '#6b4d1a',
        },
        silver: {
          DEFAULT: '#c0c8d0',
          bright: '#e8edf2',
          mid: '#8a9aaa',
          dim: '#4a5a6a',
          glow: '#d4dde6',
        },
        cyan: {
          arcanum: '#00e5ff',
          dim: '#0097a7',
          glow: '#4dfbff',
        },
        purple: {
          cosmic: '#1a0533',
          deep: '#2d0a52',
          mid: '#5b21b6',
          glow: '#7c3aed',
        },
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'Trajan Pro', 'serif'],
        raleway: ['var(--font-raleway)', 'Helvetica Neue', 'sans-serif'],
        display: ['var(--font-cinzel)', 'Trajan Pro', 'serif'],
        body: ['var(--font-raleway)', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'arcanum-radial': 'radial-gradient(ellipse at center, #0c0a14 0%, #08060e 70%)',
        'gold-gradient': 'linear-gradient(135deg, #8a6520 0%, #f5d06e 50%, #8a6520 100%)',
        'silver-gradient': 'linear-gradient(135deg, #4a5a6a 0%, #e8edf2 50%, #4a5a6a 100%)',
        'gold-silver-gradient': 'linear-gradient(135deg, #8a6520 0%, #f5d06e 40%, #c0c8d0 60%, #8a6520 100%)',
        'portal-glow': 'radial-gradient(ellipse at 50% 45%, rgba(201,151,58,0.12) 0%, transparent 70%)',
      },
      animation: {
        'portal-spin': 'portal-spin 20s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'swirl': 'swirl 6s linear infinite',
      },
      keyframes: {
        'portal-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-8px) translateX(4px)' },
          '66%': { transform: 'translateY(4px) translateX(-6px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'swirl': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(201, 151, 58, 0.4), 0 0 60px rgba(201, 151, 58, 0.1)',
        'silver-glow': '0 0 20px rgba(192, 200, 208, 0.3), 0 0 60px rgba(192, 200, 208, 0.08)',
        'gold-rim': 'inset 0 0 0 1px rgba(201,151,58,0.25), 0 8px 32px rgba(0,0,0,0.6)',
        'cyan-glow': '0 0 20px rgba(0, 229, 255, 0.4), 0 0 60px rgba(0, 229, 255, 0.1)',
        'portal': '0 0 40px rgba(201,151,58,0.2), inset 0 0 40px rgba(201,151,58,0.04)',
        'card': '0 4px 24px rgba(0,0,0,0.7), 0 0 1px rgba(201,151,58,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
