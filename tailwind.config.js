/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      'patua': ['Patua One', 'sans-serif'],
    }
  },
  safelist: [
    {
      pattern: /bg-+/,
    },
    {
      pattern: /text-+/,
    },
    {
      pattern: /col-span-+/,
    },
  ],
  plugins: [],
}

