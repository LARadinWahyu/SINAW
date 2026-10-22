import type { Task } from "./types";

/**
 * DEADLINE REMINDER
 * Tugas yang belum selesai & pengingatnya aktif masuk ke daftar pengingat jika:
 * - "terlewat": waktu tenggat sudah lewat
 * - "segera":   waktu tenggat ≤ N jam lagi (N = pengaturan "Ingatkan sebelum tenggat", default 24 jam)
 */

export type AlertLevel = "terlewat" | "segera";
export interface DeadlineAlert {
  task: Task;
  level: AlertLevel;
  minutesLeft: number; // negatif bila terlewat
  label: string;
}

export function dueAt(t: Pick<Task, "dueDate" | "dueTime">): Date {
  const [y, m, d] = t.dueDate.split("-").map(Number);
  const [hh, mm] = (t.dueTime || "23:59").split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

export function relativeLabel(minutes: number): string {
  const a = Math.abs(minutes);
  const unit = a < 60 ? `${Math.max(1, Math.round(a))} menit` : a < 48 * 60 ? `${Math.round(a / 60)} jam` : `${Math.round(a / 1440)} hari`;
  return minutes < 0 ? `terlewat ${unit}` : `${unit} lagi`;
}

export function deadlineAlerts(tasks: Task[], leadHours: number, now = new Date()): DeadlineAlert[] {
  const out: DeadlineAlert[] = [];
  for (const t of tasks) {
    if (t.status === "done" || !t.reminder) continue;
    const mins = (dueAt(t).getTime() - now.getTime()) / 60000;
    if (mins < 0) out.push({ task: t, level: "terlewat", minutesLeft: mins, label: relativeLabel(mins) });
    else if (mins <= leadHours * 60) out.push({ task: t, level: "segera", minutesLeft: mins, label: relativeLabel(mins) });
  }
  // yang paling mendesak dulu: terlewat (paling baru), lalu yang paling dekat
  return out.sort((a, b) => (a.level === b.level ? (a.level === "terlewat" ? b.minutesLeft - a.minutesLeft : a.minutesLeft - b.minutesLeft) : a.level === "terlewat" ? -1 : 1));
}

/** Label singkat untuk kartu tugas (tanpa memperhatikan pengaturan pengingat). */
export function urgency(t: Task, now = new Date()): { tone: "red" | "amber" | null; label: string } {
  if (t.status === "done") return { tone: null, label: "" };
  const mins = (dueAt(t).getTime() - now.getTime()) / 60000;
  if (mins < 0) return { tone: "red", label: relativeLabel(mins) };
  if (mins <= 24 * 60) return { tone: "amber", label: relativeLabel(mins) };
  return { tone: null, label: "" };
}

export const LEAD_OPTIONS = [1, 3, 6, 12, 24, 48, 72];
