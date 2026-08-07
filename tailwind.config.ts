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
        // Retro / americana
        ink: { DEFAULT: "#241c14", soft: "#4a3d2e" }, // marrón-negro cálido (texto)
        cream: {
          DEFAULT: "#f3e8cf", // fondo principal
          light: "#fbf5e6", // tarjetas
          dark: "#e9dab8", // secciones alternas
        },
        navy: { DEFAULT: "#16273f", dark: "#0e1b2c" }, // azul marino
        accent: { DEFAULT: "#b3202e", dark: "#8c1823" }, // rojo barbería
        mustard: { DEFAULT: "#d9a441", dark: "#b9862c" }, // dorado mostaza
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"], // Alfa Slab One
        heading: ["var(--font-heading)", "Impact", "sans-serif"], // Oswald
        script: ["var(--font-script)", "cursive"], // Yellowtail
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 0 0 rgba(36,28,20,0.08), 0 1px 3px rgba(36,28,20,0.06)",
        lift: "0 14px 32px -14px rgba(22,39,63,0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "page-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "page-in": "page-in 0.4s ease-out both",
        marquee: "marquee 28s linear infinite",
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "spin-slow": "spin 22s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
