import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F4", // Dull Off-White (Stone-100)
        foreground: "#1C1917", // Stone-900
        primary: {
          DEFAULT: "#D97706", // Saffron (Amber-600)
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#57534E", // Stone-600
          foreground: "#FFFFFF",
        },
        saffron: "#D97706",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(28, 25, 23, 0.05)",
        glow: "0 0 20px -5px rgba(217, 119, 6, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        "saffron-light": {
          extend: "light",
          colors: {
            background: "#F5F5F4",
            foreground: "#1C1917",
            primary: {
              50: "#fffbeb",
              100: "#fef3c7",
              200: "#fde68a",
              300: "#fcd34d",
              400: "#fbbf24",
              500: "#f59e0b",
              600: "#d97706",
              700: "#b45309",
              800: "#92400e",
              900: "#78350f",
              DEFAULT: "#D97706",
              foreground: "#ffffff",
            },
            focus: "#D97706",
          },
          layout: {
            radius: {
              small: "8px",
              medium: "12px",
              large: "24px",
            },
          },
        },
      },
    }) as any,
  ],
};
export default config;
