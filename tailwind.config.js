/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', '!./node_modules'],
  theme: {
    extend: {}
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
}
