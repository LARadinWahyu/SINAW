"use client";

import { useEffect, useRef } from "react";
import { useStore } from "./store";

const IDLE_MS = 2 * 60 * 1000; // berhenti menghitung jika tidak ada aktivitas 2 menit
const FLUSH_EVERY = 30; // detik

/**
 * Mencatat waktu belajar aktif di sebuah materi.
 * Dihitung hanya saat tab terlihat DAN pengguna aktif (gerak mouse, scroll, ketik, sentuh)
 * dalam 2 menit terakhir — agar halaman yang ditinggal terbuka tidak menambah waktu.
 */
export function useStudyTimer(materialId: string | undefined) {
  const logStudy = useStore((s) => s.logStudy);
  const pending = useRef(0);
  const lastActive = useRef(Date.now());

  useEffect(() => {
    if (!materialId) return;
    lastActive.current = Date.now();
    pending.current = 0;
    const flush = () => {
      if (pending.current > 0) {
        logStudy(materialId, pending.current);
        pending.current = 0;
      }
    };
    const active = () => (lastActive.current = Date.now());
    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach((e) => window.addEventListener(e, active, { passive: true }));
    const onVis = () => (document.visibilityState === "hidden" ? flush() : active());
    document.addEventListener("visibilitychange", onVis);

    const tick = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - lastActive.current < IDLE_MS) {
        pending.current += 1;
        if (pending.current >= FLUSH_EVERY) flush();
      }
    }, 1000);

    return () => {
      clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, active));
      document.removeEventListener("visibilitychange", onVis);
      flush();
    };
  }, [materialId, logStudy]);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} dtk`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} mnt`;
  return `${Math.floor(m / 60)} j ${m % 60} mnt`;
}
