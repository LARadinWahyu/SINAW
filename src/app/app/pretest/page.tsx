"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Clock, Info, ListChecks, RotateCcw, Send, Timer, XCircle } from "lucide-react";
import { Badge, Button, Card, DemoTag, EmptyState, LinkButton, Modal, PageHeader, ProgressBar, Ring, Toggle } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import { MASTERY_THRESHOLD, recommendMaterials, relevantSubjects, topicAnalysis } from "@/lib/recommend";
import type { PretestQuestion, TestResult } from "@/lib/types";
import { cx, formatTanggal } from "@/lib/utils";

const SEC_PER_Q = 90;

export default function PretestPage() {
  return (
    <Suspense>
      <Pretest />
    </Suspense>
  );
}

function Pretest() {
  const params = useSearchParams();
  const fromOnboarding = params.get("dari") === "onboarding";
  const { data } = useSession();
  const d = data!;
  const { pretest, subjects } = useStore((s) => s.content);
  const saveSettings = useStore((s) => s.saveSettings);
  const [phase, setPhase] = useState<"intro" | "run" | "result">("intro");
  const [resultId, setResultId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PretestQuestion[]>([]);

  const pool = useMemo(() => {
    const rel = relevantSubjects(subjects, d).map((s) => s.id);
    const r = pretest.filter((q) => rel.includes(q.subjectId));
    return r.length >= 5 ? r : pretest;
  }, [pretest, subjects, d]);

  const result = resultId ? d.pretests.find((p) => p.id === resultId) ?? null : null;

  if (pretest.length === 0)
    return (
      <div>
        <PageHeader title="Pretest & Analisis Level" />
        <EmptyState icon="ClipboardList" title="Bank soal belum tersedia" desc="Admin perlu menambahkan soal dan kunci jawaban melalui Panel Admin → Bank Soal Pretest." action={<LinkButton href="/app">Kembali ke Beranda</LinkButton>} />
      </div>
    );

  if (phase === "run") return <Runner questions={questions} timer={d.settings.timerPretest} onDone={(id) => { setResultId(id); setPhase("result"); }} onCancel={() => setPhase("intro")} />;
  if (phase === "result" && result) return <ResultView r={result} questions={questions} onRetry={() => setPhase("intro")} />;

  return (
    <div className="mx-auto max-w-3xl">
      {fromOnboarding && (
        <div className="mb-6 rounded-2xl bg-navy-800 p-5 text-white">
          <p className="font-bold">Profilmu tersimpan! 🎉</p>
          <p className="mt-1 text-sm text-navy-100">Langkah berikutnya: kerjakan pretest agar SINAU bisa merekomendasikan materi sesuai kemampuan awalmu.</p>
          <Link href="/app" className="mt-3 inline-block text-sm font-semibold text-amber-300 hover:underline">Lewati dulu, ke Beranda →</Link>
        </div>
      )}
      <PageHeader title="Pretest & Analisis Level" desc="Kenali kemampuan awalmu sebelum mulai belajar." kicker={<DemoTag label="Soal demonstrasi" />} />

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { i: ListChecks, t: `${pool.length} soal`, d: "Pilihan ganda" },
            { i: Clock, t: d.settings.timerPretest ? `${Math.round((pool.length * SEC_PER_Q) / 60)} menit` : "Tanpa batas", d: "Batas waktu" },
            { i: ClipboardCheck, t: `${new Set(pool.map((q) => q.topic)).size} topik`, d: "Dianalisis" },
          ].map(({ i: I, t, d: dd }) => (
            <div key={dd} className="flex items-center gap-3 rounded-xl bg-canvas p-3">
              <I className="h-5 w-5 text-marun-600" />
              <div>
                <p className="font-bold">{t}</p>
                <p className="text-xs text-slate-500">{dd}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="mt-6 font-bold">Petunjuk pengerjaan</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
          <li>Pilih satu jawaban yang paling tepat untuk setiap soal.</li>
          <li>Gunakan tombol nomor soal untuk berpindah dan meninjau jawaban.</li>
          <li>Klik <b>Kumpulkan</b> setelah selesai; kamu akan diminta konfirmasi terlebih dahulu.</li>
          <li>Jika timer aktif, jawaban otomatis dikumpulkan saat waktu habis.</li>
          <li>Kerjakan dengan jujur — hasilnya dipakai untuk menentukan rekomendasi materi.</li>
        </ol>
        <div className="mt-4 border-t border-slate-100">
          <Toggle id="timer" checked={d.settings.timerPretest} onChange={(v) => saveSettings({ timerPretest: v })} label="Gunakan timer" desc={`${SEC_PER_Q} detik per soal`} />
        </div>
        <p className="mt-2 flex gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <Info className="h-4 w-4 shrink-0" />
          Pretest ini bersifat latihan diagnostik sederhana untuk panduan belajar, bukan pengukuran psikometrik yang tervalidasi dan tidak menentukan kelulusan.
        </p>
        <Button size="lg" className="mt-5 w-full sm:w-auto" onClick={() => { setQuestions(pool); setPhase("run"); }}>
          Mulai Pretest <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>

      {d.pretests.length > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="font-bold">Riwayat pretest</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {[...d.pretests].reverse().map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>{formatTanggal(p.date.slice(0, 10), true)}</span>
                <span className="text-slate-500">{p.correct}/{p.total} benar</span>
                <button onClick={() => { setQuestions(pretest); setResultId(p.id); setPhase("result"); }} className="font-bold text-marun-700 hover:underline">
                  Skor {p.score} · Lihat
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Runner({ questions, timer, onDone, onCancel }: { questions: PretestQuestion[]; timer: boolean; onDone: (id: string) => void; onCancel: () => void }) {
  const submitPretest = useStore((s) => s.submitPretest);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<(number | null)[]>(() => questions.map(() => null));
  const [confirm, setConfirm] = useState(false);
  const [start] = useState(() => Date.now());
  const limit = questions.length * SEC_PER_Q;
  const [elapsed, setElapsed] = useState(0);

  const submit = useCallback(() => {
    const byTopic: TestResult["byTopic"] = {};
    let correct = 0;
    questions.forEach((q, k) => {
      byTopic[q.topic] ??= { correct: 0, total: 0 };
      byTopic[q.topic].total++;
      if (ans[k] === q.answer) {
        correct++;
        byTopic[q.topic].correct++;
      }
    });
    const id = submitPretest({
      score: Math.round((correct / questions.length) * 100),
      correct,
      total: questions.length,
      durationSec: Math.round((Date.now() - start) / 1000),
      byTopic,
      answers: questions.map((q, k) => ({ questionId: q.id, selected: ans[k] })),
    });
    onDone(id);
  }, [ans, questions, start, submitPretest, onDone]);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.round((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [start]);
  useEffect(() => {
    if (timer && elapsed >= limit) submit();
  }, [timer, elapsed, limit, submit]);

  const q = questions[i];
  const answered = ans.filter((a) => a !== null).length;
  const remain = Math.max(0, limit - elapsed);
  const mm = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button onClick={onCancel} className="text-sm font-semibold text-slate-500 hover:text-marun-700">✕ Batalkan</button>
        <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums", timer && remain < 60 ? "bg-red-50 text-red-600" : "bg-navy-50 text-navy-700")} aria-live="off">
          <Timer className="h-4 w-4" /> {timer ? `Sisa ${mm(remain)}` : mm(elapsed)}
        </span>
      </div>
      <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>Soal {i + 1} dari {questions.length}</span>
        <span>{answered} terjawab</span>
      </div>
      <ProgressBar value={(answered / questions.length) * 100} label="Soal terjawab" />

      <Card className="mt-5 p-6">
        <div className="flex items-center gap-2">
          <Badge tone="navy">{q.topic}</Badge>
          <DemoTag label="Demo" />
        </div>
        <fieldset className="mt-4">
          <legend className="text-lg font-bold leading-snug">{q.prompt}</legend>
          <div className="mt-5 space-y-2.5">
            {q.options.map((o, oi) => {
              const sel = ans[i] === oi;
              return (
                <label key={oi} className={cx("flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition", sel ? "border-marun-600 bg-marun-50" : "border-slate-200 hover:border-marun-200")}>
                  <input type="radio" name={`pt-${q.id}`} checked={sel} onChange={() => setAns((a) => a.map((x, k) => (k === i ? oi : x)))} className="sr-only" />
                  <span className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold", sel ? "bg-marun-700 text-white" : "bg-slate-100 text-slate-600")}>{String.fromCharCode(65 + oi)}</span>
                  <span className="font-medium">{o}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setI(i - 1)} disabled={i === 0}>
          <ArrowLeft className="h-4 w-4" /> Sebelumnya
        </Button>
        {i < questions.length - 1 ? (
          <Button onClick={() => setI(i + 1)}>
            Selanjutnya <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => setConfirm(true)}>
            <Send className="h-4 w-4" /> Kumpulkan
          </Button>
        )}
      </div>

      <Card className="mt-6 p-5">
        <p className="mb-3 text-sm font-bold">Navigasi soal</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((x, k) => (
            <button key={x.id} onClick={() => setI(k)} aria-label={`Soal ${k + 1}${ans[k] !== null ? ", sudah dijawab" : ""}`} aria-current={k === i} className={cx("h-10 w-10 rounded-xl text-sm font-bold transition", k === i ? "ring-2 ring-marun-600 ring-offset-2" : "", ans[k] !== null ? "bg-navy-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
              {k + 1}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" className="mt-4" onClick={() => setConfirm(true)}>
          <Send className="h-4 w-4" /> Kumpulkan jawaban
        </Button>
      </Card>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Kumpulkan jawaban?">
        {answered < questions.length ? (
          <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle className="h-5 w-5 shrink-0" /> Masih ada {questions.length - answered} soal yang belum dijawab. Soal kosong dihitung salah.
          </p>
        ) : (
          <p className="text-sm text-slate-600">Semua soal sudah terjawab. Setelah dikumpulkan, jawaban tidak dapat diubah.</p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>Periksa lagi</Button>
          <Button onClick={submit}>Ya, kumpulkan</Button>
        </div>
      </Modal>
    </div>
  );
}

function ResultView({ r, questions, onRetry }: { r: TestResult; questions: PretestQuestion[]; onRetry: () => void }) {
  const { data } = useSession();
  const { materials, subjects, pretest } = useStore((s) => s.content);
  const [review, setReview] = useState(false);
  const { mastered, weak } = topicAnalysis(r);
  const recs = recommendMaterials(materials, subjects, data, 4);
  const qmap = new Map([...pretest, ...questions].map((q) => [q.id, q]));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Hasil Pretest" desc={`${formatTanggal(r.date.slice(0, 10), true)} · durasi ${Math.floor(r.durationSec / 60)} mnt ${r.durationSec % 60} dtk`} />
      <Card className="flex flex-col items-center gap-6 p-6 sm:flex-row">
        <Ring value={r.score} size={120} stroke={12} sub="skor" label={`Skor ${r.score}`} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-2xl font-extrabold">{r.correct} dari {r.total} benar</p>
          <p className="mt-1 text-sm text-slate-500">
            {weak.length ? `Ada ${weak.length} topik yang perlu kamu perkuat. Mulai dari rekomendasi di bawah.` : "Kerja bagus! Semua topik sudah di atas ambang panduan."}
          </p>
          <p className="mt-2 text-xs text-slate-400">Ambang panduan “dikuasai”: ≥{MASTERY_THRESHOLD * 100}% benar per topik (panduan belajar, bukan standar kelulusan).</p>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-bold">Analisis per topik</h2>
        <ul className="mt-4 space-y-4">
          {Object.entries(r.byTopic).map(([t, v]) => {
            const ok = v.correct / v.total >= MASTERY_THRESHOLD;
            return (
              <li key={t}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{t}</span>
                  <span className={ok ? "font-bold text-emerald-600" : "font-bold text-marun-600"}>{v.correct}/{v.total} · {ok ? "Dikuasai" : "Perlu dipelajari"}</span>
                </div>
                <ProgressBar value={Math.max(4, (v.correct / v.total) * 100)} tone={ok ? "navy" : "marun"} className="mt-1.5" label={`${t} ${v.correct} dari ${v.total}`} />
              </li>
            );
          })}
        </ul>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-3 text-sm"><b className="text-emerald-700">Sudah dikuasai:</b> {mastered.join(", ") || "—"}</div>
          <div className="rounded-xl bg-marun-50 p-3 text-sm"><b className="text-marun-700">Perlu dipelajari:</b> {weak.join(", ") || "—"}</div>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-bold">Rekomendasi materi</h2>
        {recs.length ? (
          <ul className="mt-3 space-y-2">
            {recs.map(({ material: m, reason }) => (
              <li key={m.id}>
                <Link href={`/app/belajar/${m.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-canvas p-3 hover:bg-marun-50">
                  <span>
                    <span className="block text-sm font-bold">{m.title}</span>
                    <span className="block text-xs text-slate-500">{reason}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-marun-700" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Tidak ada rekomendasi tambahan — semua materi terkait sudah selesai.</p>
        )}
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <LinkButton href="/app/belajar">Ke Pusat Belajar</LinkButton>
        <LinkButton href="/app/evaluasi?tab=evaluasi" variant="outline">Lihat perkembangan</LinkButton>
        <Button variant="outline" onClick={() => setReview(!review)}>{review ? "Sembunyikan pembahasan" : "Lihat pembahasan"}</Button>
        <Button variant="ghost" onClick={onRetry}><RotateCcw className="h-4 w-4" /> Ulangi pretest</Button>
      </div>

      {review && (
        <Card className="mt-6 p-6">
          <h2 className="font-bold">Pembahasan</h2>
          <ol className="mt-4 space-y-5">
            {r.answers.map((a, k) => {
              const q = qmap.get(a.questionId);
              if (!q) return <li key={k} className="text-sm text-slate-400">Soal sudah dihapus dari bank soal.</li>;
              const ok = a.selected === q.answer;
              return (
                <li key={k} className="text-sm">
                  <p className="flex gap-2 font-semibold">
                    {ok ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <XCircle className="h-5 w-5 shrink-0 text-red-500" />}
                    {k + 1}. {q.prompt}
                  </p>
                  <p className="ml-7 mt-1 text-slate-600">
                    Jawabanmu: {a.selected === null ? <i>tidak dijawab</i> : q.options[a.selected]} · Kunci: <b>{q.options[q.answer]}</b>
                  </p>
                  {q.explanation && <p className="ml-7 mt-1 text-slate-500">{q.explanation}</p>}
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </div>
  );
}
