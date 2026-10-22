"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarPlus, Check, CheckCircle2, ChevronRight, Clock, Timer, Lightbulb, ListChecks, RotateCcw, Sparkles, Video, XCircle } from "lucide-react";
import { Illustration } from "@/components/Illustration";
import { Badge, Button, Card, DemoTag, EmptyState, LinkButton, ProgressBar } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import type { LearningMaterial } from "@/lib/types";
import { cx, dayKey } from "@/lib/utils";
import { formatDuration, useStudyTimer } from "@/lib/useStudyTimer";
import { youtubeEmbed, youtubeId } from "@/lib/video";

export default function MateriDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSession();
  const { materials, subjects } = useStore((s) => s.content);
  const openMaterial = useStore((s) => s.openMaterial);
  const completeMaterial = useStore((s) => s.completeMaterial);
  const uncompleteMaterial = useStore((s) => s.uncompleteMaterial);
  const addTask = useStore((s) => s.addTask);
  const [added, setAdded] = useState(false);

  const m = materials.find((x) => x.id === id);
  useEffect(() => {
    if (m) openMaterial(m.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m?.id]);
  useStudyTimer(m?.id);

  if (!m)
    return (
      <EmptyState icon="Search" title="Materi tidak ditemukan" desc="Materi mungkin sudah dihapus atau tautannya salah." action={<LinkButton href="/app/belajar">Kembali ke Pusat Belajar</LinkButton>} />
    );

  const d = data!;
  const subject = subjects.find((s) => s.id === m.subjectId);
  const siblings = materials.filter((x) => x.subjectId === m.subjectId);
  const idx = siblings.findIndex((x) => x.id === m.id);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const done = !!d.completed[m.id];
  const subjDone = siblings.filter((x) => d.completed[x.id]).length;
  const spent = d.studyLog.filter((l) => l.materialId === m.id).reduce((a, l) => a + l.seconds, 0);

  return (
    <article className="mx-auto max-w-3xl">
      <nav className="mb-4 flex items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/app/belajar" className="hover:text-marun-700">Pusat Belajar</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate">{subject?.name}</span>
      </nav>

      <header className="rounded-3xl p-6 text-white sm:p-8" style={{ background: subject?.color ?? "#9B0A0A" }}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold">{m.level}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold"><Clock className="h-3 w-3" /> {m.minutes} menit</span>
          {m.demo && <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-bold text-ink">Konten demo</span>}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold" title="Waktu belajar aktif tercatat (diperbarui tiap 30 detik)">
            <Timer className="h-3 w-3" /> {spent ? `${formatDuration(spent)} dipelajari` : "Waktu belajar mulai dicatat"}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{m.title}</h1>
        <p className="mt-2 text-white/85">{m.description}</p>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs font-semibold text-white/80">
            <span>Progres bidang {subject?.name}</span>
            <span>{subjDone}/{siblings.length}</span>
          </div>
          <div className="h-2 rounded-full bg-white/20">
            <div className="h-full rounded-full bg-amber-300 transition-all" style={{ width: `${(subjDone / siblings.length) * 100}%` }} />
          </div>
        </div>
      </header>

      {m.demo && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-300/60">
          Materi ini adalah contoh demonstrasi untuk menunjukkan alur belajar SINAU, bukan materi resmi. Konten resmi dapat dimasukkan lewat Panel Admin.
        </p>
      )}

      <VideoBlock url={m.videoUrl} title={m.title} />

      <div className="mt-6 space-y-8">
        {m.sections.map((s, i) => (
          <section key={i}>
            <h2 className="flex items-center gap-3 text-xl font-extrabold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-sm text-navy-700">{i + 1}</span>
              {s.heading}
            </h2>
            {s.body.split(/\n{2,}/).map((p, j) => (
              <p key={j} className="mt-3 leading-relaxed text-slate-700">{p}</p>
            ))}
            {s.illustration && <Illustration kind={s.illustration} />}
            {s.example && (
              <div className="mt-4 rounded-2xl border-l-4 border-marun-600 bg-marun-50/60 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-marun-700"><Lightbulb className="h-4 w-4" /> Contoh</p>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{s.example}</pre>
              </div>
            )}
          </section>
        ))}
      </div>

      <Quiz material={m} />

      <Card className="mt-8 flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-bold">{done ? "Materi ini sudah selesai ✅" : "Sudah paham materinya?"}</p>
          <p className="text-sm text-slate-500">{done ? "Aktivitas tercatat untuk streak hari itu." : "Tandai selesai agar progres dan streak-mu tercatat."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={added}
            onClick={() => {
              addTask({ title: `Pelajari: ${m.title}`, description: m.description, dueDate: dayKey(), dueTime: "19:00", priority: "sedang", category: m.subjectId, materialId: m.id, reminder: true });
              setAdded(true);
            }}
          >
            {added ? <Check className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />} {added ? "Ditambahkan" : "Jadwalkan"}
          </Button>
          <LinkButton href="/app/evaluasi" variant="outline" size="sm">
            <ListChecks className="h-4 w-4" /> Latihan soal
          </LinkButton>
          <LinkButton href={`/app/nara?q=${encodeURIComponent(`Rangkum materi ${m.title}`)}`} variant="outline" size="sm">
            <Sparkles className="h-4 w-4" /> Tanya NARA
          </LinkButton>
          {done ? (
            <Button variant="secondary" size="sm" onClick={() => uncompleteMaterial(m.id)}>
              <RotateCcw className="h-4 w-4" /> Batalkan selesai
            </Button>
          ) : (
            <Button size="sm" onClick={() => completeMaterial(m.id, m.title)}>
              <CheckCircle2 className="h-4 w-4" /> Tandai selesai
            </Button>
          )}
        </div>
      </Card>

      <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Navigasi materi">
        {prev ? (
          <Link href={`/app/belajar/${prev.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-marun-200">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500"><ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya</span>
            <span className="mt-1 block font-bold">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/app/belajar/${next.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-right hover:border-marun-200">
            <span className="flex items-center justify-end gap-1 text-xs font-semibold text-slate-500">Selanjutnya <ArrowRight className="h-3.5 w-3.5" /></span>
            <span className="mt-1 block font-bold">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}

function Quiz({ material: m }: { material: LearningMaterial }) {
  const submitQuiz = useStore((s) => s.submitQuiz);
  const { data } = useSession();
  const [ans, setAns] = useState<(number | null)[]>(() => m.quiz.map(() => null));
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setAns(m.quiz.map(() => null));
    setChecked(false);
  }, [m.id, m.quiz]);

  if (!m.quiz.length) return null;
  const correct = ans.filter((a, i) => a === m.quiz[i].answer).length;
  const all = ans.every((a) => a !== null);
  const history = data!.quizResults.filter((r) => r.materialId === m.id);
  const best = history.reduce((b, r) => Math.max(b, r.correct / r.total), 0);

  return (
    <Card as="section" className="mt-10 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-extrabold">Kuis singkat</h2>
        <div className="flex items-center gap-2">
          {history.length > 0 && <Badge tone="navy">Skor terbaik {Math.round(best * 100)}%</Badge>}
          {m.demo && <DemoTag label="Soal demo" />}
        </div>
      </div>
      <ol className="mt-5 space-y-6">
        {m.quiz.map((q, qi) => (
          <li key={q.id}>
            <fieldset>
              <legend className="font-semibold">{qi + 1}. {q.prompt}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((o, oi) => {
                  const sel = ans[qi] === oi;
                  const isRight = checked && oi === q.answer;
                  const isWrong = checked && sel && oi !== q.answer;
                  return (
                    <label key={oi} className={cx("flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-sm transition", isRight ? "border-emerald-500 bg-emerald-50" : isWrong ? "border-red-400 bg-red-50" : sel ? "border-marun-600 bg-marun-50" : "border-slate-200 hover:border-marun-200", checked && "cursor-default")}>
                      <input type="radio" name={`${m.id}-${q.id}`} className="h-4 w-4 accent-marun-700" checked={sel} disabled={checked} onChange={() => setAns((a) => a.map((x, i) => (i === qi ? oi : x)))} />
                      <span className="flex-1">{o}</span>
                      {isRight && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {isWrong && <XCircle className="h-4 w-4 text-red-500" />}
                    </label>
                  );
                })}
              </div>
              {checked && q.explanation && <p className="mt-2 text-sm text-slate-600"><b>Pembahasan:</b> {q.explanation}</p>}
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <div className="flex-1" aria-live="polite">
              <p className="font-bold">Skor: {correct}/{m.quiz.length}</p>
              <ProgressBar value={(correct / m.quiz.length) * 100} className="mt-1 max-w-xs" tone={correct === m.quiz.length ? "navy" : "marun"} label="Skor kuis" />
            </div>
            <Button variant="outline" onClick={() => { setAns(m.quiz.map(() => null)); setChecked(false); }}>
              <RotateCcw className="h-4 w-4" /> Ulangi kuis
            </Button>
          </>
        ) : (
          <>
            <p className="flex-1 text-sm text-slate-500">{all ? "Semua soal terjawab." : `Jawab ${m.quiz.length} soal untuk memeriksa hasil.`}</p>
            <Button disabled={!all} onClick={() => { setChecked(true); submitQuiz(m.id, m.title, correct, m.quiz.length); }}>
              Periksa jawaban
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

function VideoBlock({ url, title }: { url?: string; title: string }) {
  const id = youtubeId(url);
  if (id)
    return (
      <section className="mt-6" aria-label="Video materi">
        <div className="aspect-video overflow-hidden rounded-2xl bg-ink shadow-card">
          <iframe
            src={youtubeEmbed(id)}
            title={`Video: ${title}`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">Video ditampilkan dari YouTube. Jika tidak muncul, buka langsung di <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-marun-700 hover:underline">YouTube</a>.</p>
      </section>
    );
  if (url)
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-marun-200">
        <Video className="h-5 w-5 text-marun-600" />
        <span className="text-sm font-semibold">Buka video pendukung materi ini</span>
      </a>
    );
  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
      <Video className="h-5 w-5 shrink-0 text-slate-400" />
      <p>Video untuk materi ini belum tersedia. Pelajari lewat teks, ilustrasi, dan contoh di bawah.</p>
    </div>
  );
}
