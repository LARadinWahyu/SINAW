import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Diambil dari identitas visual presentasi & logo SINAU
        marun: {
          50: "#FDF3F3",
          100: "#FBE4E4",
          200: "#F5C7C7",
          300: "#EC9C9C",
          400: "#DE6464",
          500: "#CC2E2E",
          600: "#B31616",
          700: "#9B0A0A",
          800: "#7E0B0B",
          900: "#5E0C0C",
        },
        navy: {
          50: "#F1F4FA",
          100: "#E1E7F3",
          200: "#C3CFE6",
          300: "#94A8D0",
          400: "#5E79B2",
          500: "#3A5795",
          600: "#26407A",
          700: "#1B3163",
          800: "#14254D",
          900: "#0E1A38",
        },
        amber: {
          50: "#FFF8EB",
          100: "#FEEFCB",
          300: "#FCCB6B",
          400: "#F8B13A",
          500: "#EE9512",
          600: "#C9720C",
        },
        ink: "#16192B",
        canvas: "#F7F5F5",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,25,43,.04), 0 4px 16px -6px rgba(22,25,43,.08)",
        lift: "0 10px 30px -12px rgba(94,12,12,.35)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
