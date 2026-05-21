import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,json}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#261d34",
        plum: "#6f4a86",
        mauve: "#a77aa5",
        rose: "#f3b4c8",
        cream: "#fff2e6",
        butter: "#ffe7a6",
        lilac: "#d8c2ff",
        dusk: "#332745",
        night: "#18152c"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "Georgia"],
        hand: ["var(--font-hand)", "cursive"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(111, 74, 134, 0.22)",
        soft: "0 18px 48px rgba(55, 36, 67, 0.14)"
      },
      borderRadius: {
        cozy: "1.75rem"
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(0.82)", opacity: "0.66" },
          "50%": { transform: "scale(1.08)", opacity: "1" }
        },
        floaty: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" }
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" }
        }
      },
      animation: {
        breathe: "breathe 7s ease-in-out infinite",
        floaty: "floaty 6s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite"
      }
    }
  },
  plugins: [typography]
};

export default config;
