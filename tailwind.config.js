/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        // serif: ["Merriweather", "ui-serif", "Georgia"],
        // mono: ["Fira Code", "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
