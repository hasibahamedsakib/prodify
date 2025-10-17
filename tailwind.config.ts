import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Color Palette
        "rich-black": "#0D1821",
        "anti-flash-white": "#EFF1F3",
        "hookers-green": "#4E6E5D",
        lion: "#AD8A64",
        chestnut: "#A44A3F",
        "mint-green": "#CCFBFE",
        "french-gray": "#CDD6DD",
        silver: "#CDCACC",
        "pale-dogwood": "#CDACA1",
        "old-rose": "#CD8987",
        "imperial-red": "#F03A47",
        redwood: "#AF5B5B",
        "white-smoke": "#F6F4F3",
        "celtic-blue": "#276FBF",
        "delft-blue": "#183059",
        "drab-brown": "#2F2504",
        "drab-brown-light": "#594E36",
        "reseda-green": "#7E846B",
        "ash-gray": "#A5AE9E",
        platinum: "#D0DDD7",
        night: "#0D160B",
        "pomp-and-power": "#785589",
        "mountbatten-pink": "#977390",
        "rosy-brown": "#BB8A89",
        "van-dyke": "#4E3D42",
        "dim-gray": "#6D6466",
        "tea-green": "#C9D5B5",
        timberwolf: "#E3DBDB",
        puce: "#D496A7",
        "tiffany-blue": "#78E0DC",
        "electric-blue": "#8EEDF7",
        "light-sky-blue": "#A1CDF1",
        "fairy-tale": "#EABFCB",
        "magenta-haze": "#A4508B",
        indigo: "#5F0A87",
        "russian-violet": "#2F004F",
        accent: "#78E0DC",

        // Semantic color mappings
        primary: {
          DEFAULT: "#276FBF", // Celtic Blue
          dark: "#183059", // Delft Blue
          light: "#A1CDF1", // Light Sky Blue
        },
        secondary: {
          DEFAULT: "#785589", // Pomp and Power
          dark: "#5F0A87", // Indigo
          light: "#977390", // Mountbatten Pink
        },
        danger: {
          DEFAULT: "#F03A47", // Imperial Red
          dark: "#A44A3F", // Chestnut
          light: "#AF5B5B", // Redwood
        },
        success: {
          DEFAULT: "#4E6E5D", // Hooker's Green
          light: "#7E846B", // Reseda Green
        },
        neutral: {
          50: "#F6F4F3", // White Smoke
          100: "#EFF1F3", // Anti-flash White
          200: "#E3DBDB", // Timberwolf
          300: "#CDD6DD", // French Gray
          400: "#A5AE9E", // Ash Gray
          500: "#6D6466", // Dim Gray
          600: "#4E3D42", // Van Dyke
          700: "#2F2504", // Drab Dark Brown
          800: "#0D1821", // Rich Black
          900: "#0D160B", // Night
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
