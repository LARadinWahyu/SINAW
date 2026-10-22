import type { LearningMaterial, PretestQuestion, QuizQuestion, TestResult } from "./types";

export interface PracticeQuestion extends QuizQuestion {
  key: string;
  subjectId: string;
  topic: string;
  source: string; // asal soal: judul materi / "Bank soal pretest"
}

/** Bank latihan = kuis semua materi + bank soal pretest, tanpa duplikat pertanyaan. */
export function practicePool(materials: LearningMaterial[], pretest: PretestQuestion[], subjectId: string | "campuran"): PracticeQuestion[] {
  const out: PracticeQuestion[] = [];
  const seen = new Set<string>();
  const add = (q: PracticeQuestion) => {
    const k = q.prompt.trim().toLowerCase();
    if (seen.has(k) || !q.prompt.trim() || q.options.some((o) => !o.trim())) return;
    seen.add(k);
    out.push(q);
  };
  for (const m of materials) {
    if (subjectId !== "campuran" && m.subjectId !== subjectId) continue;
    m.quiz.forEach((q) => add({ ...q, key: `${m.id}:${q.id}`, subjectId: m.subjectId, topic: m.topic, source: m.title }));
  }
  for (const q of pretest) {
    if (subjectId !== "campuran" && q.subjectId !== subjectId) continue;
    add({ ...q, key: `pretest:${q.id}`, source: "Bank soal pretest" });
  }
  return out;
}

export function sample<T>(arr: T[], n: number, rnd = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

/** Perbandingan pretest pertama vs terakhir per topik (hanya bila ≥ 2 percobaan). */
export function compareTests(first: TestResult, last: TestResult) {
  const topics = Array.from(new Set([...Object.keys(first.byTopic), ...Object.keys(last.byTopic)]));
  return topics.map((t) => {
    const a = first.byTopic[t];
    const b = last.byTopic[t];
    const pa = a ? Math.round((a.correct / a.total) * 100) : null;
    const pb = b ? Math.round((b.correct / b.total) * 100) : null;
    return { topic: t, before: pa, after: pb, delta: pa !== null && pb !== null ? pb - pa : null };
  });
}
