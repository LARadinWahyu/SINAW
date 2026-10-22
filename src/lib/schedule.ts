import type { LearningMaterial, SchedulePref, Subject, Task, UserData } from "./types";
import { recommendMaterials } from "./recommend";
import { addDays, dayKey, parseDay } from "./utils";

/**
 * SMART SCHEDULE
 * Menyusun sesi belajar dari hari & jam luang pengguna, mengikuti urutan jalur belajar personal
 * (topik lemah dari pretest → materi fokus → materi relevan jurusan). Sesi tidak ditempatkan
 * bertabrakan dengan tugas lain yang belum selesai, dan materi yang sudah dijadwalkan dilewati.
 */

export interface PlannedSession {
  key: string;
  date: string;
  time: string;
  minutes: number;
  title: string;
  description: string;
  materialId?: string;
  category: string;
  kind: "belajar" | "ulang";
}

export const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function defaultPref(d: UserData): SchedulePref {
  const start = d.profile.studyTime === "pagi" ? "07:00" : d.profile.studyTime === "siang" ? "16:00" : "19:00";
  const daily = d.profile.dailyMinutes || 30;
  return {
    days: [1, 2, 3, 4, 5],
    start,
    sessionMin: Math.min(daily, 60),
    sessionsPerDay: daily > 60 ? 2 : 1,
    weeks: 2,
    includeReview: true,
  };
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toTime = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function generateSchedule(pref: SchedulePref, materials: LearningMaterial[], subjects: Subject[], d: UserData, now = new Date()) {
  // urutan jalur belajar; lewati materi yang sudah selesai atau sudah punya tugas aktif
  const alreadyPlanned = new Set(d.tasks.filter((t) => t.status !== "done" && t.materialId).map((t) => t.materialId!));
  const path = recommendMaterials(materials, subjects, d, 999).filter((r) => !alreadyPlanned.has(r.material.id));
  const skipped = recommendMaterials(materials, subjects, d, 999).filter((r) => alreadyPlanned.has(r.material.id)).length;

  // antrean sesi
  type Q = Omit<PlannedSession, "key" | "date" | "time">;
  const queue: Q[] = [];
  path.forEach(({ material: m, reason }, i) => {
    const parts = Math.max(1, Math.ceil(m.minutes / pref.sessionMin));
    for (let p = 1; p <= parts; p++)
      queue.push({
        minutes: pref.sessionMin,
        title: parts > 1 ? `Pelajari: ${m.title} (${p}/${parts})` : `Pelajari: ${m.title}`,
        description: `${reason}. Selesaikan materi lalu kerjakan kuisnya.`,
        materialId: m.id,
        category: m.subjectId,
        kind: "belajar",
      });
    if (pref.includeReview && (i + 1) % 3 === 0)
      queue.push({
        minutes: Math.min(pref.sessionMin, 30),
        title: `Ulang & latihan: ${path[i - 2].material.topic}–${m.topic}`,
        description: "Sesi pengulangan: baca ringkasan 3 materi terakhir dan ulangi kuisnya.",
        category: m.subjectId,
        kind: "ulang",
      });
  });

  // tugas yang sudah ada → slot sibuk
  const busy = d.tasks
    .filter((t) => t.status !== "done")
    .map((t) => ({ date: t.dueDate, start: toMin(t.dueTime), end: toMin(t.dueTime) + 30 }));
  const clash = (date: string, s: number, e: number) => busy.some((b) => b.date === date && s < b.end && b.start < e);

  const out: PlannedSession[] = [];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = dayKey(now);
  const totalDays = pref.weeks * 7;
  let qi = 0;
  let conflicts = 0;
  for (let i = 0; i < totalDays && qi < queue.length; i++) {
    const date = addDays(today, i);
    if (!pref.days.includes(parseDay(date).getDay())) continue;
    const startMin = toMin(pref.start);
    if (date === today && startMin <= nowMin) continue; // jam mulai hari ini sudah lewat → mulai besok
    // sesi boleh digeser maksimal 2 jam dari jam mulai (selain durasi sesi-sesi sebelumnya)
    const latest = startMin + (pref.sessionsPerDay - 1) * (pref.sessionMin + 10) + 120;
    let cursor = startMin;
    let placed = 0;
    while (placed < pref.sessionsPerDay && qi < queue.length) {
      const s = cursor;
      const e = cursor + pref.sessionMin;
      if (s > latest || e > 23 * 60 + 59) break;
      if (clash(date, s, e)) {
        conflicts++;
        cursor += 30; // geser ke slot berikutnya
        continue;
      }
      const q = queue[qi++];
      out.push({ ...q, key: `${date}-${s}-${qi}`, date, time: toTime(s) });
      cursor = e + 10; // jeda 10 menit antarsesi
      placed++;
    }
  }
  return { sessions: out, unscheduled: queue.length - qi, skippedAlreadyPlanned: skipped, conflicts, totalMaterials: path.length };
}

export function sessionsToTasks(sessions: PlannedSession[]): Omit<Task, "id" | "createdAt" | "status">[] {
  return sessions.map((s) => ({
    title: s.title,
    description: `${s.description} (±${s.minutes} menit · dibuat oleh Smart Schedule)`,
    dueDate: s.date,
    dueTime: s.time,
    priority: s.kind === "ulang" ? "rendah" : "sedang",
    category: s.category,
    materialId: s.materialId,
    reminder: true,
  }));
}
