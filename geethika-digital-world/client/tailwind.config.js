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
        valentine: {
          pink: '#FF69B4',
          red: '#DC143C',
          lightPink: '#FFB6C1',
          darkRed: '#8B0000',
          rose: '#FF007F',
        },
        premium: {
          black: '#111111',
          gold: '#d4af37',
          royalBlue: '#1e3a8a',
          lightGrey: '#f5f5f5',
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
        sans: ['Open Sans', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'sans-serif'],
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['Open Sans', 'Roboto', 'system-ui', 'sans-serif'],
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
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'float-heart': 'floatHeart 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
