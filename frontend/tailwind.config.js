/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
            "./pages/**/*.{tsx}",
            "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'royalblue': {
          '50': '#eef5ff',
          '100': '#dfecff',
          '200': '#c6dbff',
          '300': '#a3c2fe',
          '400': '#7f9ffa',
          '500': '#607cf4',
          '600': '#5364ea',
          '700': '#3543cd',
          '800': '#2e3ba5',
          '900': '#2c3783',
          '950': '#1a1f4c',
        },
      },
    },
  },
  plugins: [],
}
