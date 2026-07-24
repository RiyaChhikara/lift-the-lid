import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "var(--graphite-950)",
          900: "var(--graphite-900)",
          800: "var(--graphite-800)",
          700: "var(--graphite-700)",
          600: "var(--graphite-600)",
        },
        aluminum: {
          DEFAULT: "var(--aluminum)",
          muted: "var(--aluminum-muted)",
        },
        brass: {
          DEFAULT: "var(--brass)",
          soft: "var(--brass-soft)",
        },
        ink: "var(--ink)",
        mist: "var(--mist)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(196, 164, 108, 0.08)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        reveal: "reveal 0.55s ease-out both",
        "pulse-soft": "pulseSoft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
