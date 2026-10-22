"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Circle, Clock, Info, PlayCircle, Wand2 } from "lucide-react";
import { Badge, Card, DemoTag, LinkButton, PageHeader, Ring } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { useSession, useStore } from "@/lib/store";
import { buildLearningPath, type PathStep } from "@/lib/path";
import { formatDuration } from "@/lib/useStudyTimer";
import { cx } from "@/lib/utils";

const STAGE_COLOR = { KNOW: "bg-navy-700", LEARN: "bg-marun-700", GROW: "bg-amber-500", READY: "bg-emerald-600" } as const;

export default function JalurBelajar() {
  const { data } = useSession();
  const { materials, subjects } = useStore((s) => s.content);
  const d = data!;
  const p = useMemo(() => buildLearningPath(d, materials, subjects), [d, materials, subjects]);
  const pct = p.totalSteps ? Math.round((p.doneSteps / p.totalSteps) * 100) : 0;
  const majors = d.profile.majors.map((id) => MAJOR_OPTIONS.find((m) => m.id === id)?.name.split(" (")[0]).filter(Boolean);
  const bestQuiz = (id: string) => {
    const r = d.quizResults.filter((q) => q.materialId === id);
    return r.length ? Math.round(Math.max(...r.map((q) => q.correct / q.total)) * 100) : null;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Jalur Belajar" desc="Urutan belajar personal berdasarkan jurusan pilihan dan hasil pretest-mu." kicker={<DemoTag label="Disusun dari materi demo" />} />

      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <Ring value={pct} size={96} sub="jalur" label={`Jalur belajar ${pct}% selesai`} />
        <div className="flex-1">
          <p className="text-sm text-slate-500">
            {p.doneSteps} dari {p.totalSteps} langkah selesai · sisa ±{formatDuration(p.minutesLeft * 60)} materi
          </p>
          {p.next ? (
            <>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-marun-600">Langkah berikutnya</p>
              <p className="text-lg font-extrabold">{p.next.title}</p>
              <p className="text-sm text-slate-500">{p.next.reason}</p>
            </>
          ) : (
            <p className="mt-1 text-lg font-extrabold">Semua langkah di jalurmu selesai 🎉</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col">
          {p.next && (
            <LinkButton href={p.next.href}>
              <PlayCircle className="h-4 w-4" /> Mulai
            </LinkButton>
          )}
          <LinkButton href="/app/tugas?view=pintar" variant="outline" size="sm">
            <Wand2 className="h-4 w-4" /> Jadwalkan
          </LinkButton>
        </div>
      </Card>

      <p className="mt-4 flex gap-2 rounded-xl bg-navy-50 p-3 text-xs text-navy-800">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          Disusun dari {majors.length ? <>jurusan <b>{majors.join(", ")}</b></> : "profilmu"}
          {p.hasPretest ? " dan hasil pretest terakhir." : ". Kerjakan pretest agar topik yang lemah didahulukan."} Ubah minat di{" "}
          <Link href="/app/profil" className="font-semibold underline">Profil</Link>. Kamu tetap bebas membuka materi mana pun.
        </span>
      </p>

      <ol className="relative mt-8 space-y-8">
        {p.stages.map((stage) => (
          <li key={stage.key} className="relative">
            <div className="mb-3 flex items-center gap-3">
              <span className={cx("rounded-lg px-2.5 py-1 text-xs font-extrabold tracking-wider text-white", STAGE_COLOR[stage.key])}>{stage.key}</span>
              <div>
                <h2 className="font-extrabold">{stage.title}</h2>
                <p className="text-xs text-slate-500">{stage.desc}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs font-semibold text-slate-500">
                {stage.steps.filter((s) => s.status === "selesai").length}/{stage.steps.length}
              </span>
            </div>
            <ul className="ml-3 space-y-2 border-l-2 border-slate-200 pl-5">
              {stage.steps.map((step) => (
                <StepRow key={step.id} step={step} best={step.material ? bestQuiz(step.material.id) : null} subjectColor={subjects.find((s) => s.id === step.material?.subjectId)?.color} />
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepRow({ step, best, subjectColor }: { step: PathStep; best: number | null; subjectColor?: string }) {
  const m = step.material;
  return (
    <li className="relative">
      <span className="absolute -left-[33px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-canvas">
        {step.status === "selesai" ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-label="Selesai" />
        ) : step.status === "berikutnya" ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-marun-700 ring-4 ring-marun-100" aria-label="Langkah berikutnya">
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </span>
        ) : (
          <Circle className="h-5 w-5 text-slate-300" aria-label="Belum" />
        )}
      </span>
      <Link
        href={step.href}
        className={cx(
          "flex items-center gap-3 rounded-2xl border bg-white p-4 transition hover:border-marun-200",
          step.status === "berikutnya" ? "border-marun-300 shadow-card" : "border-slate-200",
          step.status === "selesai" && "opacity-75",
        )}
      >
        {m && <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: subjectColor }} aria-hidden />}
        <div className="min-w-0 flex-1">
          <p className={cx("font-bold", step.status === "selesai" && "text-slate-500")}>{step.title}</p>
          <p className="truncate text-xs text-slate-500">{step.reason}</p>
          {m && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <Badge tone={m.level === "Dasar" ? "navy" : "marun"}>{m.level}</Badge>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {m.minutes} mnt</span>
              {best !== null && <span>Kuis terbaik {best}%</span>}
            </div>
          )}
        </div>
        {step.status === "berikutnya" ? <Badge tone="marun">Berikutnya</Badge> : <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />}
      </Link>
    </li>
  );
}
