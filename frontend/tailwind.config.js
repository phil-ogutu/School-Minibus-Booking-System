/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/app/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      colors: {
        primary: "#EAAA00",
        secondary: '#DFC98C',
        dark: '#363636',
        tertiary: '#E5E5E5',
        white: '#FFFFFF'
      },
      backgroundImage: {
        'gradient-gold': `linear-gradient(
          45deg,
          hsl(44deg 56% 71%) 0%,
          hsl(44deg 80% 70%) 8%,
          hsl(44deg 63% 68%) 17%,
          hsl(43deg 66% 65%) 25%,
          hsl(43deg 85% 63%) 33%,
          hsl(43deg 70% 63%) 42%,
          hsl(42deg 72% 60%) 50%,
          hsl(42deg 74% 56%) 58%,
          hsl(42deg 78% 50%) 67%,
          hsl(42deg 76% 51%) 75%,
          hsl(42deg 80% 54%) 83%,
          hsl(43deg 82% 51%) 92%,
          hsl(44deg 100% 46%) 100%
        )`,
      },
    },
  },
  plugins: [],
}
