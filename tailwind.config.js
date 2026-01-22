/** @type {import('tailwindcss').Config} */
module.exports = {
  // We add every possible path to be safe
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}" 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}