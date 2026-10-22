import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SINAU — Siap Nambah Ilmu", template: "%s · SINAU" },
  description: "Kenali Kemampuanmu, Siapkan Kuliahmu. Platform belajar dan habit builder untuk calon mahasiswa dan mahasiswa baru.",
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#9B0A0A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
