import type { LearningMaterial, Subject, UserData } from "./types";
import { dueAt } from "./deadline";
import { addDays, dayKey, parseDay } from "./utils";

/** Senin dari minggu yang memuat tanggal `key` */
export function mondayOf(key: string) {
  return addDays(key, -((parseDay(key).getDay() + 6) % 7));
}

export function minutesByDay(d: UserData): Record<string, number> {
  const out: Record<string, number> = {};
  for (const l of d.studyLog) out[l.date] = (out[l.date] || 0) + l.seconds / 60;
  return out;
}

export function progressReport(d: UserData, materials: LearningMaterial[], subjects: Subject[], now = new Date()) {
  const today = dayKey(now);
  const byDay = minutesByDay(d);
  const sumRange = (from: string, to: string) => Object.entries(byDay).reduce((a, [k, v]) => (k >= from && k <= to ? a + v : a), 0);

  // --- waktu belajar
  const thisMon = mondayOf(today);
  const weekMin = sumRange(thisMon, today);
  const lastWeekMin = sumRange(addDays(thisMon, -7), addDays(thisMon, -1));
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const avg7 = last7.reduce((a, k) => a + (byDay[k] || 0), 0) / 7;
  const daysOnTarget7 = last7.filter((k) => (byDay[k] || 0) >= d.profile.dailyMinutes).length;
  const daily14 = Array.from({ length: 14 }, (_, i) => {
    const k = addDays(today, i - 13);
    return { key: k, menit: Math.round(byDay[k] || 0) };
  });
  const totalMin = Object.values(byDay).reduce((a, b) => a + b, 0);

  // --- modul per bidang
  const matSubject = new Map(materials.map((m) => [m.id, m.subjectId]));
  const minBySubject: Record<string, number> = {};
  for (const l of d.studyLog) {
    const s = matSubject.get(l.materialId);
    if (s) minBySubject[s] = (minBySubject[s] || 0) + l.seconds / 60;
  }
  const quizBySubject: Record<string, { c: number; t: number }> = {};
  for (const q of d.quizResults) {
    const s = matSubject.get(q.materialId) ?? (q.materialId.startsWith("latihan:") ? q.materialId.split(":")[1] : undefined);
    if (!s) continue;
    quizBySubject[s] ??= { c: 0, t: 0 };
    quizBySubject[s].c += q.correct;
    quizBySubject[s].t += q.total;
  }
  const perSubject = subjects
    .map((s) => {
      const ms = materials.filter((m) => m.subjectId === s.id);
      const done = ms.filter((m) => d.completed[m.id]).length;
      const qz = quizBySubject[s.id];
      return { subject: s, done, total: ms.length, minutes: Math.round(minBySubject[s.id] || 0), quizPct: qz && qz.t ? Math.round((qz.c / qz.t) * 100) : null };
    })
    .filter((x) => x.total > 0);
  const modDone = Object.keys(d.completed).filter((id) => matSubject.has(id)).length;
  const modTotal = materials.length;

  // --- tugas
  const tasks = d.tasks;
  const done = tasks.filter((t) => t.status === "done");
  const onTime = done.filter((t) => t.completedAt && new Date(t.completedAt) <= dueAt(t)).length;
  const late = done.length - onTime;
  const overdueOpen = tasks.filter((t) => t.status !== "done" && dueAt(t) < now).length;
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const mon = addDays(thisMon, (i - 3) * 7);
    const sun = addDays(mon, 6);
    const inWeek = tasks.filter((t) => t.dueDate >= mon && t.dueDate <= sun);
    const sel = inWeek.filter((t) => t.status === "done").length;
    const d0 = parseDay(mon);
    return { label: i === 3 ? "Minggu ini" : `${d0.getDate()}/${d0.getMonth() + 1}`, selesai: sel, belum: inWeek.length - sel };
  });

  // --- kuis
  const qAll = d.quizResults.reduce((a, q) => ({ c: a.c + q.correct, t: a.t + q.total }), { c: 0, t: 0 });

  return {
    weekMin: Math.round(weekMin),
    lastWeekMin: Math.round(lastWeekMin),
    avg7, // menit, belum dibulatkan
    daysOnTarget7,
    daily14,
    totalMin: Math.round(totalMin),
    perSubject,
    modDone,
    modTotal,
    tasks: { total: tasks.length, done: done.length, onTime, late, overdueOpen, weeks },
    quizPct: qAll.t ? Math.round((qAll.c / qAll.t) * 100) : null,
    quizCount: d.quizResults.length,
  };
}
