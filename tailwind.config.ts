import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gruvbox: {
          bg: '#282828',
          fg: '#ebdbb2',
          'fg-dark': '#d5c4a1',  // Darker shade for regular text
          'fg-darker': '#bdae93', // Even darker shade for smaller text
          red: '#cc241d',
          green: '#98971a',
          yellow: '#d79921',
          blue: '#458588',
          blue_light: '#83a598',
          purple: '#b16286',
          aqua: '#689d6a',
          gray: '#a89984',
        },
      },
      backgroundColor: {
        'gruvbox-bg': '#080808',
      },
    },
  },
  plugins: [],
};
export default config;
