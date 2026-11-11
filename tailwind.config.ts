import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          text: "var(--paper-text)",
        },
        muted: {
          dark: "var(--muted-dark)",
          light: "var(--muted-light)",
        },
        accent: {
          DEFAULT: "var(--accent)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      spacing: {
        "5vw": "5vw",
        "7vw": "7vw",
        "10vw": "10vw",
      },
      lineHeight: {
        editorial: "0.9",
        tightish: "1.05",
      },
      letterSpacing: {
        label: "0.12em",
        tightEditorial: "-0.03em",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
