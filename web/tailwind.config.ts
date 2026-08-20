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
        coral: {
          DEFAULT: "#FF5A5F",
          soft: "#FFF1F0",
          muted: "#FFE4E2",
          dark: "#E84A4F",
        },
        ink: {
          DEFAULT: "#111827",
          soft: "#1F2937",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
        canvas: {
          DEFAULT: "#F8F9FA",
          card: "#FFFFFF",
          line: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
