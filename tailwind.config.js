/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1a73e8',
          hover: '#2b7de9',
        },
        neutral: {
          text: '#202124',
          secondary: '#5f6368',
          border: '#dfe1e5',
          hover: '#f8f9fa',
        }
      },
      fontFamily: {
        'roboto': ['Roboto', 'Arial', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      fontSize: {
        'xs-plus': ['0.8125rem', { lineHeight: '1.25rem' }],
        'sm-plus': ['0.9375rem', { lineHeight: '1.375rem' }],
      },
      borderRadius: {
        'google': '0.5rem',
        'google-sm': '0.25rem',
      },
      boxShadow: {
        'google': '0 1px 6px rgb(32 33 36 / 28%)',
        'hover': '0 1px 6px rgb(32 33 36 / 20%)',
        'button': '0 1px 3px rgb(60 64 67 / 30%)',
        'button-sm': '0 1px 1px rgb(0 0 0 / 10%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  corePlugins: {
    preflight: true,
  },
}

