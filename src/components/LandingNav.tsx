"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cx } from "@/lib/utils";
import { useHydrated, useSession } from "@/lib/store";

const LINKS = [
  ["#masalah", "Masalah"],
  ["#fitur", "Fitur"],
  ["#cara-kerja", "Cara Kerja"],
  ["#nara", "NARA"],
  ["#career", "Career Lounge"],
  ["#sdg", "SDG"],
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const { user } = useSession();
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const loggedIn = hydrated && user;

  return (
    <header className={cx("fixed inset-x-0 top-0 z-40 transition", scrolled || open ? "bg-white/95 shadow-sm backdrop-blur" : "bg-transparent")}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Navigasi utama">
        <Link href="/" aria-label="SINAU beranda" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marun-500">
          <Logo light={!scrolled && !open} />
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([h, l]) => (
            <li key={h}>
              <a href={h} className={cx("rounded-lg px-3 py-2 text-sm font-semibold transition", scrolled ? "text-slate-600 hover:text-marun-700" : "text-white/85 hover:text-white")}>
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          {loggedIn ? (
            <Link href="/app" className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-ink hover:bg-amber-300">
              Buka Dashboard
            </Link>
          ) : (
            <>
              <Link href="/masuk" className={cx("rounded-xl px-4 py-2.5 text-sm font-semibold", scrolled ? "text-marun-700 hover:bg-marun-50" : "text-white hover:bg-white/10")}>
                Masuk
              </Link>
              <Link href="/masuk?mode=daftar" className={cx("rounded-xl px-4 py-2.5 text-sm font-bold", scrolled ? "bg-marun-700 text-white hover:bg-marun-800" : "bg-white text-marun-700 hover:bg-marun-50")}>
                Mulai Belajar
              </Link>
            </>
          )}
        </div>
        <button className={cx("rounded-lg p-2 lg:hidden", scrolled || open ? "text-ink" : "text-white")} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Tutup menu" : "Buka menu"}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 lg:hidden">
          <ul className="py-2">
            {LINKS.map(([h, l]) => (
              <li key={h}>
                <a href={h} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-marun-50">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            {loggedIn ? (
              <Link href="/app" className="col-span-2 rounded-xl bg-marun-700 py-3 text-center font-bold text-white">
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link href="/masuk" className="rounded-xl border border-slate-300 py-3 text-center font-semibold">
                  Masuk
                </Link>
                <Link href="/masuk?mode=daftar" className="rounded-xl bg-marun-700 py-3 text-center font-bold text-white">
                  Mulai Belajar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
