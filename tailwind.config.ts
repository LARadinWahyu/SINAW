import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Gaya "Passion Finder" (bentuk, kaca, mesh) dengan warna identitas SINAU: merah marun + navy.
        passion: {
          bg: "#FBF7F6", // latar utama (putih kemerahan lembut)
          sand: "#F4EAE8", // kanvas luar
          cream: "#F5ECEA", // latar section
          orange: "#9B0A0A", // aksen utama (marun)
          peach: "#DE6464", // aksen terang (merah muda)
          dark: "#16192B",
        },
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
        canvas: "#FBF7F6",
      },
      backgroundImage: {
        "passion-gradient": "linear-gradient(135deg, #9B0A0A 0%, #D63A3A 100%)",
        "passion-mesh":
          "radial-gradient(60% 80% at 12% 15%, #DE6464 0%, transparent 60%), radial-gradient(50% 70% at 88% 25%, #9B0A0A 0%, transparent 65%), radial-gradient(45% 60% at 72% 100%, #3A5795 0%, transparent 70%), radial-gradient(40% 60% at 18% 100%, #CC2E2E 0%, transparent 70%), linear-gradient(135deg, #B31616 0%, #7E0B0B 100%)",
        "passion-soft":
          "radial-gradient(50% 60% at 10% 0%, rgba(204,46,46,.10) 0%, transparent 70%), radial-gradient(45% 55% at 100% 10%, rgba(58,87,149,.10) 0%, transparent 70%)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(26,26,26,.05)",
        lift: "0 18px 40px -16px rgba(155,10,10,.45)",
        float: "0 30px 60px -28px rgba(60,10,10,.30)",
      },
      borderRadius: { xl2: "1.25rem", "4xl": "2rem", "5xl": "2.5rem" },
    },
  },
  plugins: [],
};
export default config;
