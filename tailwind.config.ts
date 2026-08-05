import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca: negro cálido para textos y botones primarios
        ink: {
          DEFAULT: "#141414",
          soft: "#3f3f3f",
        },
        // Acento discreto (rojo clásico de barbería), usado con moderación
        accent: {
          DEFAULT: "#c1121f",
          dark: "#8f0d16",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        heading: ["var(--font-heading)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(20,20,20,0.06), 0 1px 2px rgba(20,20,20,0.04)",
        lift: "0 12px 32px -12px rgba(20,20,20,0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
