import type { ActivityEvent } from "./types";
import { addDays, dayKey } from "./utils";

/**
 * ATURAN STREAK SINAU (konsisten di seluruh aplikasi):
 * - Aktivitas belajar yang dihitung: menyelesaikan materi, mengerjakan kuis materi / latihan soal,
 *   mengumpulkan pretest, atau menyelesaikan tugas di to-do list.
 * - Satu hari dianggap "aktif" bila jumlah aktivitas ≥ target harian (default 1, bisa diubah di Profil).
 * - Streak = jumlah hari aktif berturut-turut. Jika hari ini belum memenuhi target,
 *   streak dari kemarin tetap dihitung sampai hari ini berakhir.
 */

export function countByDay(activity: ActivityEvent[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of activity) out[a.date] = (out[a.date] || 0) + 1;
  return out;
}

export function computeStreak(activity: ActivityEvent[], target: number) {
  const byDay = countByDay(activity);
  const met = (k: string) => (byDay[k] || 0) >= target;
  const today = dayKey();
  const todayCount = byDay[today] || 0;
  const todayMet = met(today);

  let current = 0;
  let cursor = todayMet ? today : addDays(today, -1);
  while (met(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  // streak terpanjang & riwayat rentang streak
  const days = Object.keys(byDay).filter(met).sort();
  let longest = 0;
  const runs: { start: string; end: string; length: number }[] = [];
  let runStart = "";
  let prev = "";
  let len = 0;
  for (const d of days) {
    if (prev && addDays(prev, 1) === d) {
      len++;
    } else {
      if (len) runs.push({ start: runStart, end: prev, length: len });
      runStart = d;
      len = 1;
    }
    prev = d;
  }
  if (len) runs.push({ start: runStart, end: prev, length: len });
  for (const r of runs) longest = Math.max(longest, r.length);

  return {
    current,
    longest,
    todayCount,
    todayMet,
    activeDays: days.length,
    runs: runs.reverse(),
    byDay,
  };
}

export function lastNDays(n: number): string[] {
  const today = dayKey();
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}
