import type { LearningMaterial, Subject, TestResult, UserData } from "./types";

const LEVEL_ORDER = { Dasar: 0, Menengah: 1, Lanjut: 2 } as const;

/** Ambang "perlu dipelajari" — dipakai sebagai panduan belajar, BUKAN standar kelulusan. */
export const MASTERY_THRESHOLD = 0.7;

export function relevantSubjects(subjects: Subject[], d: UserData | null): Subject[] {
  if (!d) return subjects;
  const { majors, focusSubjects } = d.profile;
  if (!majors.length && !focusSubjects.length) return subjects;
  const rel = subjects.filter(
    (s) => focusSubjects.includes(s.id) || s.majors.includes("*") || s.majors.some((m) => majors.includes(m)),
  );
  return rel.length ? rel : subjects;
}

export function latestPretest(d: UserData | null): TestResult | null {
  if (!d || !d.pretests.length) return null;
  return d.pretests[d.pretests.length - 1];
}

export function topicAnalysis(r: TestResult) {
  const mastered: string[] = [];
  const weak: string[] = [];
  for (const [topic, v] of Object.entries(r.byTopic)) {
    (v.correct / v.total >= MASTERY_THRESHOLD ? mastered : weak).push(topic);
  }
  return { mastered, weak };
}

export interface Recommendation {
  material: LearningMaterial;
  reason: string;
}

export function recommendMaterials(materials: LearningMaterial[], subjects: Subject[], d: UserData | null, limit = 4): Recommendation[] {
  if (!d) return [];
  const done = d.completed;
  const out: Recommendation[] = [];
  const seen = new Set<string>();
  const push = (m: LearningMaterial, reason: string) => {
    if (seen.has(m.id) || done[m.id]) return;
    seen.add(m.id);
    out.push({ material: m, reason });
  };
  const byLevel = (a: LearningMaterial, b: LearningMaterial) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];

  const pt = latestPretest(d);
  if (pt) {
    const { weak } = topicAnalysis(pt);
    materials
      .filter((m) => weak.includes(m.topic))
      .sort(byLevel)
      .forEach((m) => {
        const t = pt.byTopic[m.topic];
        push(m, `Pretest: ${t.correct}/${t.total} benar di topik ${m.topic}`);
      });
  }
  const rel = relevantSubjects(subjects, d).map((s) => s.id);
  materials
    .filter((m) => d.profile.focusSubjects.includes(m.subjectId))
    .sort(byLevel)
    .forEach((m) => push(m, "Sesuai materi yang ingin kamu kuasai"));
  materials
    .filter((m) => rel.includes(m.subjectId))
    .sort(byLevel)
    .forEach((m) => push(m, "Relevan dengan jurusan pilihanmu"));
  return out.slice(0, limit);
}

export function progressStats(materials: LearningMaterial[], subjects: Subject[], d: UserData | null) {
  const rel = relevantSubjects(subjects, d).map((s) => s.id);
  const pool = materials.filter((m) => rel.includes(m.subjectId));
  const done = d ? pool.filter((m) => d.completed[m.id]).length : 0;
  return { done, total: pool.length, pct: pool.length ? Math.round((done / pool.length) * 100) : 0 };
}
