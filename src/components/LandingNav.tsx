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
const LEFT = LINKS.slice(0, 3);
const RIGHT = LINKS.slice(3);

const linkCls = "rounded-full px-3 py-2 text-[13px] font-semibold text-ink/70 transition hover:bg-black/[0.04] hover:text-ink";

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
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        className={cx(
          "glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full border border-white/70 pl-3 pr-2 transition-shadow sm:h-16 sm:pl-4",
          scrolled || open ? "shadow-[0_12px_40px_-12px_rgba(94,12,12,.30)]" : "shadow-[0_8px_30px_-14px_rgba(94,12,12,.25)]",
        )}
        aria-label="Navigasi utama"
      >
        {/* kiri: tautan (desktop) / logo (mobile) */}
        <ul className="hidden flex-1 items-center gap-0.5 lg:flex">
          {LEFT.map(([h, l]) => (
            <li key={h}>
              <a href={h} className={linkCls}>
                {l}
              </a>
            </li>
          ))}
        </ul>
        <Link href="/" aria-label="SINAU beranda" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marun-500 lg:mx-4">
          <Logo sub={false} />
        </Link>
        {/* kanan */}
        <div className="hidden flex-1 items-center justify-end gap-0.5 lg:flex">
          {RIGHT.map(([h, l]) => (
            <a key={h} href={h} className={cx(linkCls, h === "#sdg" && "hidden xl:inline-flex")}>
              {l}
            </a>
          ))}
          {loggedIn ? (
            <Link href="/app" className="ml-2 rounded-full bg-marun-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(155,10,10,.8)] hover:bg-marun-700">
              Buka Dashboard
            </Link>
          ) : (
            <>
              <Link href="/masuk" className={cx(linkCls, "ml-1 text-ink")}>
                Masuk
              </Link>
              <Link href="/masuk?mode=daftar" className="ml-1 rounded-full bg-marun-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(155,10,10,.8)] hover:bg-marun-700">
                Mulai Belajar
              </Link>
            </>
          )}
        </div>
        <button className="rounded-full bg-black/[0.04] p-2.5 text-ink lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Tutup menu" : "Buka menu"}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-[2rem] border border-white/70 p-3 shadow-[0_20px_50px_-20px_rgba(94,12,12,.35)] lg:hidden">
          <ul>
            {LINKS.map(([h, l]) => (
              <li key={h}>
                <a href={h} onClick={() => setOpen(false)} className="block rounded-full px-4 py-3 font-semibold text-ink/80 hover:bg-marun-50">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {loggedIn ? (
              <Link href="/app" className="col-span-2 rounded-full bg-marun-600 py-3 text-center font-bold text-white">
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link href="/masuk" className="rounded-full border border-black/10 bg-white py-3 text-center font-semibold">
                  Masuk
                </Link>
                <Link href="/masuk?mode=daftar" className="rounded-full bg-marun-600 py-3 text-center font-bold text-white">
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
