/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // === NEW TEAL PALETTE (from image) ===
        teal: {
          50: '#EAF5F5',
          100: '#C8E8E8',
          200: '#A8D5D5',  // hero background / light teal
          300: '#80C0C0',
          400: '#5BA3A3',  // accent teal
          500: '#3D8A8A',  // primary teal
          600: '#2D7070',
          700: '#1F5555',
          800: '#133D3D',
          900: '#0A2828',
        },
        navy: {
          50: '#E8EEF2',
          100: '#C5D4DD',
          200: '#9FB8C6',
          300: '#779BAF',
          400: '#5A849C',
          500: '#3D6E89',
          600: '#2C5470',
          700: '#1D3D55',
          800: '#122A3C',  // dark button / footer
          900: '#0A1A26',  // darkest navy
        },
        // Keep orange for any legacy usage
        orange: {
          primary: '#FF6B00',
          hover: '#FF8533',
          light: '#FFA366',
          dark: '#CC5500',
        },
        dark: {
          bg: '#0A1A26',
          card: '#122A3C',
          border: '#1D3D55',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // === NEW FONTS (from image: elegant serif heading + clean sans body) ===
        sans: ['Jost', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Jost', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%, 42%': { transform: 'scale(1.08)' },
          '28%, 70%': { transform: 'scale(1)' },
        },
        floatHeart: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'translateY(-24px) rotate(8deg)', opacity: '0.9' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'float-heart': 'floatHeart 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
