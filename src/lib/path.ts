import type { LearningMaterial, Subject, UserData } from "./types";
import { latestPretest, relevantSubjects, topicAnalysis } from "./recommend";

/**
 * PERSONALIZED LEARNING PATH
 * Jalur berurutan mengikuti core values SINAU:
 *   KNOW  → kerjakan pretest
 *   LEARN → (1) perkuat topik yang lemah di pretest, (2) materi yang dipilih saat onboarding
 *   GROW  → materi lain yang relevan dengan jurusan, dari Dasar ke Lanjut
 *   READY → pretest ulang untuk melihat perkembangan
 * Materi yang sudah selesai tetap ditampilkan (status selesai) agar perjalanan terlihat utuh.
 */

const LEVEL = { Dasar: 0, Menengah: 1, Lanjut: 2 } as const;

export type StepStatus = "selesai" | "berikutnya" | "nanti";
export interface PathStep {
  id: string;
  kind: "pretest" | "materi" | "evaluasi";
  title: string;
  reason: string;
  status: StepStatus;
  material?: LearningMaterial;
  href: string;
}
export interface PathStage {
  key: "KNOW" | "LEARN" | "GROW" | "READY";
  title: string;
  desc: string;
  steps: PathStep[];
}

export function buildLearningPath(d: UserData, materials: LearningMaterial[], subjects: Subject[]) {
  const pt = latestPretest(d);
  const weak = pt ? topicAnalysis(pt).weak : [];
  const relIds = relevantSubjects(subjects, d).map((s) => s.id);
  const subjName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;
  const byLevel = (a: LearningMaterial, b: LearningMaterial) => LEVEL[a.level] - LEVEL[b.level] || relIds.indexOf(a.subjectId) - relIds.indexOf(b.subjectId);
  const used = new Set<string>();
  const take = (list: LearningMaterial[]) => list.filter((m) => !used.has(m.id) && used.add(m.id));

  const weakMats = take(materials.filter((m) => weak.includes(m.topic)).sort(byLevel));
  const focusMats = take(materials.filter((m) => d.profile.focusSubjects.includes(m.subjectId)).sort(byLevel));
  const majorMats = take(materials.filter((m) => relIds.includes(m.subjectId)).sort(byLevel));

  const matStep = (m: LearningMaterial, reason: string): PathStep => ({
    id: m.id,
    kind: "materi",
    title: m.title,
    reason,
    status: d.completed[m.id] ? "selesai" : "nanti",
    material: m,
    href: `/app/belajar/${m.id}`,
  });

  const allMats = [...weakMats, ...focusMats, ...majorMats];
  const matDone = allMats.filter((m) => d.completed[m.id]).length;
  const readyUnlocked = allMats.length > 0 && matDone / allMats.length >= 0.7;
  const firstPretestAt = d.pretests[0]?.date;
  const retaken = d.pretests.length >= 2 && d.pretests[d.pretests.length - 1].date > (firstPretestAt ?? "");

  const stages: PathStage[] = [
    {
      key: "KNOW",
      title: "Kenali kemampuan",
      desc: "Pretest singkat untuk mengetahui topik yang sudah dan belum dikuasai.",
      steps: [{ id: "pretest", kind: "pretest", title: "Kerjakan pretest", reason: pt ? `Skor terakhir ${pt.score}` : "Menentukan urutan materi di bawah", status: pt ? "selesai" : "nanti", href: "/app/pretest" }],
    },
    {
      key: "LEARN",
      title: "Belajar sesuai kebutuhan",
      desc: pt ? "Mulai dari topik yang perlu diperkuat, lalu materi yang kamu pilih." : "Materi pilihanmu. Kerjakan pretest agar topik lemah diprioritaskan.",
      steps: [
        ...weakMats.map((m) => {
          const t = pt!.byTopic[m.topic];
          return matStep(m, `Prioritas — pretest ${t.correct}/${t.total} benar di ${m.topic}`);
        }),
        ...focusMats.map((m) => matStep(m, `Pilihanmu saat onboarding · ${subjName(m.subjectId)}`)),
      ],
    },
    {
      key: "GROW",
      title: "Bangun fondasi jurusan",
      desc: "Materi lain yang relevan dengan jurusan pilihanmu, dari Dasar ke Lanjut.",
      steps: majorMats.map((m) => matStep(m, `Relevan untuk jurusanmu · ${subjName(m.subjectId)}`)),
    },
    {
      key: "READY",
      title: "Evaluasi & siap kuliah",
      desc: "Ulangi pretest untuk melihat perkembanganmu dibanding awal.",
      steps: [
        {
          id: "evaluasi",
          kind: "evaluasi",
          title: "Pretest ulang & bandingkan hasil",
          reason: retaken ? "Sudah dikerjakan ulang — lihat perbandingannya di Kuis & Evaluasi" : readyUnlocked ? "Kamu sudah menyelesaikan ≥70% jalur" : "Disarankan setelah ≥70% materi di jalur selesai",
          status: retaken ? "selesai" : "nanti",
          href: retaken ? "/app/evaluasi?tab=evaluasi" : "/app/pretest",
        },
      ],
    },
  ].filter((s) => s.steps.length > 0) as PathStage[];

  // langkah berikutnya = langkah pertama yang belum selesai (pretest dulu bila belum ada)
  const flat = stages.flatMap((s) => s.steps);
  const next = flat.find((s) => s.status !== "selesai" && (s.kind !== "evaluasi" || readyUnlocked || flat.every((x) => x.kind === "evaluasi" || x.status === "selesai")));
  if (next) next.status = "berikutnya";

  const doneSteps = flat.filter((s) => s.status === "selesai").length;
  const minutesLeft = allMats.filter((m) => !d.completed[m.id]).reduce((a, m) => a + m.minutes, 0);
  return { stages, next: next ?? null, doneSteps, totalSteps: flat.length, minutesLeft, hasPretest: !!pt, readyUnlocked };
}
