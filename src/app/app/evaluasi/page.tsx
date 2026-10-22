"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardCheck, Dumbbell, Minus, RotateCcw, Table2, TrendingDown, TrendingUp, Trophy, XCircle } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Button, Card, DemoTag, EmptyState, Icon, LinkButton, PageHeader, ProgressBar } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import { compareTests, practicePool, sample, type PracticeQuestion } from "@/lib/practice";
import { progressReport } from "@/lib/progress";
import { cx, formatTanggal } from "@/lib/utils";

export default function EvaluasiPage() {
  return (
    <Suspense>
      <Evaluasi />
    </Suspense>
  );
}

function Evaluasi() {
  const params = useSearchParams();
  const [tab, setTab] = useState<"latihan" | "evaluasi">(params.get("tab") === "evaluasi" ? "evaluasi" : "latihan");
  return (
    <div>
      <PageHeader title="Kuis & Evaluasi" desc="Latih pemahamanmu dan lihat perkembangan dari waktu ke waktu." />
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1 sm:w-fit" role="tablist" aria-label="Bagian">
        {([["latihan", "Latihan Soal", Dumbbell], ["evaluasi", "Evaluasi Perkembangan", TrendingUp]] as const).map(([k, l, I]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cx("inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold sm:flex-none", tab === k ? "bg-white text-marun-700 shadow-sm" : "text-slate-500")}>
            <I className="h-4 w-4" /> {l}
          </button>
        ))}
      </div>
      {tab === "latihan" ? <Latihan /> : <Perkembangan />}
    </div>
  );
}

/* ================= LATIHAN ================= */
function Latihan() {
  const { data } = useSession();
  const { materials, pretest, subjects } = useStore((s) => s.content);
  const submitPractice = useStore((s) => s.submitPractice);
  const d = data!;
  const [subject, setSubject] = useState<string>("campuran");
  const [count, setCount] = useState(5);
  const [qs, setQs] = useState<PracticeQuestion[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const poolSize = useMemo(() => practicePool(materials, pretest, subject).length, [materials, pretest, subject]);
  const label = subject === "campuran" ? "Campuran" : subjects.find((s) => s.id === subject)?.name ?? subject;

  function begin() {
    const pool = practicePool(materials, pretest, subject);
    const s = sample(pool, count);
    setQs(s);
    setPicked(s.map(() => null));
    setI(0);
    setFinished(false);
  }

  const history = d.quizResults.filter((r) => r.materialId.startsWith("latihan:")).slice(-6).reverse();

  if (qs && !finished) {
    const q = qs[i];
    const ans = picked[i];
    const answered = ans !== null;
    const correctSoFar = picked.filter((p, k) => p !== null && p === qs[k].answer).length;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
          <span>Latihan {label} · soal {i + 1} dari {qs.length}</span>
          <span>{correctSoFar} benar</span>
        </div>
        <ProgressBar value={((i + (answered ? 1 : 0)) / qs.length) * 100} label="Progres latihan" />
        <Card className="mt-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="navy">{q.topic}</Badge>
            <span className="text-xs text-slate-400">Sumber: {q.source}</span>
          </div>
          <fieldset className="mt-4">
            <legend className="text-lg font-bold leading-snug">{q.prompt}</legend>
            <div className="mt-5 space-y-2.5">
              {q.options.map((o, oi) => {
                const isAns = oi === q.answer;
                const isPick = ans === oi;
                return (
                  <button
                    key={oi}
                    disabled={answered}
                    onClick={() => setPicked((p) => p.map((x, k) => (k === i ? oi : x)))}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition disabled:cursor-default",
                      !answered && "border-slate-200 hover:border-marun-200",
                      answered && isAns && "border-emerald-500 bg-emerald-50",
                      answered && isPick && !isAns && "border-red-400 bg-red-50",
                      answered && !isAns && !isPick && "border-slate-200 opacity-60",
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">{String.fromCharCode(65 + oi)}</span>
                    <span className="flex-1 font-medium">{o}</span>
                    {answered && isAns && <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="Jawaban benar" />}
                    {answered && isPick && !isAns && <XCircle className="h-5 w-5 text-red-500" aria-label="Jawabanmu salah" />}
                  </button>
                );
              })}
            </div>
          </fieldset>
          {answered && (
            <div className={cx("mt-4 rounded-xl p-3 text-sm", ans === q.answer ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800")} role="status">
              <b>{ans === q.answer ? "Benar!" : `Kurang tepat. Jawaban: ${q.options[q.answer]}`}</b>
              {q.explanation && <p className="mt-1 text-slate-700">{q.explanation}</p>}
            </div>
          )}
        </Card>
        <div className="mt-5 flex justify-between gap-3">
          <Button variant="ghost" onClick={() => setQs(null)}>Batalkan</Button>
          {i < qs.length - 1 ? (
            <Button disabled={!answered} onClick={() => setI(i + 1)}>Soal berikutnya <ArrowRight className="h-4 w-4" /></Button>
          ) : (
            <Button
              disabled={!answered}
              onClick={() => {
                const correct = picked.filter((p, k) => p === qs[k].answer).length;
                submitPractice(`latihan:${subject}`, `Latihan ${label}`, correct, qs.length);
                setFinished(true);
              }}
            >
              Lihat hasil
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (qs && finished) {
    const correct = picked.filter((p, k) => p === qs[k].answer).length;
    const pct = Math.round((correct / qs.length) * 100);
    const wrongTopics = Array.from(new Set(qs.filter((q, k) => picked[k] !== q.answer).map((q) => q.topic)));
    const recMats = materials.filter((m) => wrongTopics.includes(m.topic) && !d.completed[m.id]).slice(0, 3);
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-6 text-center">
          <Trophy className={cx("mx-auto h-10 w-10", pct >= 80 ? "text-amber-500" : "text-slate-300")} />
          <p className="mt-3 text-3xl font-extrabold">{correct}/{qs.length} benar</p>
          <p className="text-slate-500">Latihan {label} · {pct}%</p>
          <p className="mt-2 text-xs text-slate-400">Tercatat sebagai aktivitas belajar hari ini.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={begin}><RotateCcw className="h-4 w-4" /> Latihan lagi</Button>
            <Button variant="outline" onClick={() => setQs(null)}>Pilih bidang lain</Button>
          </div>
        </Card>
        {wrongTopics.length > 0 && (
          <Card className="mt-4 p-5">
            <p className="font-bold">Perlu diulang: {wrongTopics.join(", ")}</p>
            {recMats.length > 0 && (
              <ul className="mt-3 space-y-2">
                {recMats.map((m) => (
                  <li key={m.id}>
                    <Link href={`/app/belajar/${m.id}`} className="flex items-center justify-between rounded-xl bg-canvas p-3 text-sm font-semibold hover:bg-marun-50">
                      {m.title} <ArrowRight className="h-4 w-4 text-marun-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-bold"><Dumbbell className="h-5 w-5 text-marun-600" /> Mulai latihan</h2>
        <p className="mt-1 text-sm text-slate-500">Soal diambil acak dari kuis materi dan bank soal pretest. Jawaban langsung diperiksa beserta pembahasannya.</p>
        <div className="mt-2"><DemoTag label="Soal demonstrasi" /></div>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold">Bidang</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[{ id: "campuran", name: "Campuran semua bidang", icon: "Sparkles", color: "#1B3163" }, ...subjects].map((s) => {
              const n = practicePool(materials, pretest, s.id).length;
              return (
                <button key={s.id} aria-pressed={subject === s.id} disabled={n === 0} onClick={() => setSubject(s.id)} className={cx("flex items-center gap-3 rounded-xl border-2 p-3 text-left transition disabled:opacity-40", subject === s.id ? "border-marun-600 bg-marun-50" : "border-slate-200 hover:border-marun-200")}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: s.color }}>
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{s.name}</span>
                    <span className="block text-xs text-slate-500">{n} soal tersedia</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold">Jumlah soal</legend>
          <div className="flex gap-2">
            {[5, 10, 15].map((n) => (
              <button key={n} aria-pressed={count === n} onClick={() => setCount(n)} className={cx("rounded-xl px-4 py-2 text-sm font-bold", count === n ? "bg-marun-700 text-white" : "bg-slate-100 text-slate-600")}>
                {n}
              </button>
            ))}
          </div>
          {poolSize < count && <p className="mt-2 text-xs text-slate-500">Bidang ini baru punya {poolSize} soal — latihan akan berisi {poolSize} soal.</p>}
        </fieldset>
        <Button className="mt-6" size="lg" disabled={poolSize === 0} onClick={begin}>
          Mulai latihan {label} <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
      <Card className="h-fit p-5">
        <h2 className="font-bold">Riwayat latihan</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Belum ada latihan.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.map((h, k) => {
              const sid = h.materialId.split(":")[1];
              const name = sid === "campuran" ? "Campuran" : subjects.find((s) => s.id === sid)?.name ?? sid;
              return (
                <li key={k} className="flex items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{name}</span>
                    <span className="text-xs text-slate-500">{formatTanggal(h.date.slice(0, 10))}</span>
                  </span>
                  <b className={h.correct / h.total >= 0.7 ? "text-emerald-700" : "text-marun-700"}>{h.correct}/{h.total}</b>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ================= EVALUASI ================= */
function Perkembangan() {
  const { data } = useSession();
  const { materials, subjects } = useStore((s) => s.content);
  const d = data!;
  const [asTable, setAsTable] = useState(false);
  const tests = d.pretests;
  const first = tests[0];
  const last = tests[tests.length - 1];
  const cmp = tests.length >= 2 ? compareTests(first, last) : [];
  const report = useMemo(() => progressReport(d, materials, subjects), [d, materials, subjects]);
  const withQuiz = report.perSubject.filter((x) => x.quizPct !== null).sort((a, b) => b.quizPct! - a.quizPct!);
  const chart = tests.map((t, k) => ({ label: `#${k + 1}`, skor: t.score, tanggal: formatTanggal(t.date.slice(0, 10)) }));

  if (!tests.length && !d.quizResults.length)
    return <EmptyState icon="Target" title="Belum ada data evaluasi" desc="Kerjakan pretest dan latihan soal — perkembanganmu akan tampil di sini." action={<LinkButton href="/app/pretest">Mulai Pretest</LinkButton>} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Pretest pertama</p>
          <p className="mt-2 text-3xl font-extrabold">{first ? first.score : "—"}</p>
          <p className="text-xs text-slate-500">{first ? formatTanggal(first.date.slice(0, 10)) : "Belum ada"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Pretest terakhir</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-extrabold">
            {last ? last.score : "—"}
            {tests.length >= 2 && (
              <span className={cx("inline-flex items-center gap-0.5 text-sm font-bold", last.score > first.score ? "text-emerald-700" : last.score < first.score ? "text-marun-700" : "text-slate-500")}>
                {last.score > first.score ? <TrendingUp className="h-4 w-4" /> : last.score < first.score ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                {last.score - first.score >= 0 ? "+" : ""}{last.score - first.score}
              </span>
            )}
          </p>
          <p className="text-xs text-slate-500">{tests.length} kali dikerjakan</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Akurasi kuis & latihan</p>
          <p className="mt-2 text-3xl font-extrabold">{report.quizPct === null ? "—" : `${report.quizPct}%`}</p>
          <p className="text-xs text-slate-500">{report.quizCount} sesi kuis/latihan</p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-bold">Riwayat skor pretest</h2>
            <p className="text-xs text-slate-500">Skor 0–100 setiap percobaan</p>
          </div>
          {tests.length > 0 && (
            <button onClick={() => setAsTable(!asTable)} aria-pressed={asTable} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100">
              <Table2 className="h-3.5 w-3.5" /> {asTable ? "Lihat grafik" : "Lihat tabel"}
            </button>
          )}
        </div>
        {tests.length === 0 ? (
          <div className="mt-4"><EmptyState icon="ClipboardList" title="Belum ada pretest" action={<LinkButton href="/app/pretest" size="sm">Mulai Pretest</LinkButton>} /></div>
        ) : tests.length === 1 && !asTable ? (
          <p className="mt-4 rounded-xl bg-canvas p-4 text-sm text-slate-600">Baru 1 percobaan (skor <b>{first.score}</b>). Ulangi pretest setelah belajar beberapa materi untuk melihat grafik perkembangan.</p>
        ) : asTable ? (
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs text-slate-500"><tr><th className="py-2">Percobaan</th><th className="py-2">Tanggal</th><th className="py-2 text-right">Benar</th><th className="py-2 text-right">Skor</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {tests.map((t, k) => <tr key={t.id}><td className="py-2">#{k + 1}</td><td className="py-2">{formatTanggal(t.date.slice(0, 10))}</td><td className="py-2 text-right">{t.correct}/{t.total}</td><td className="py-2 text-right font-bold">{t.score}</td></tr>)}
            </tbody>
          </table>
        ) : (
          <div className="mt-4 h-56" role="img" aria-label={`Skor pretest: ${tests.map((t) => t.score).join(", ")}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} padding={{ left: 24, right: 24 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip formatter={(v) => [v, "Skor"]} labelFormatter={(l, p) => (p?.[0]?.payload?.tanggal ? `${l} · ${p[0].payload.tanggal}` : String(l))} />
                <Line type="monotone" dataKey="skor" stroke="#9B0A0A" strokeWidth={2} dot={{ r: 5, fill: "#9B0A0A", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={600} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {cmp.length > 0 && (
        <Card className="p-5">
          <h2 className="font-bold">Perbandingan per topik: pretest pertama vs terakhir</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500"><tr><th className="py-2">Topik</th><th className="py-2 text-right">Pertama</th><th className="py-2 text-right">Terakhir</th><th className="py-2 text-right">Perubahan</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {cmp.map((c) => (
                  <tr key={c.topic}>
                    <td className="py-2 font-semibold">{c.topic}</td>
                    <td className="py-2 text-right">{c.before ?? "—"}{c.before !== null && "%"}</td>
                    <td className="py-2 text-right">{c.after ?? "—"}{c.after !== null && "%"}</td>
                    <td className={cx("py-2 text-right font-bold", c.delta === null ? "text-slate-400" : c.delta > 0 ? "text-emerald-700" : c.delta < 0 ? "text-marun-700" : "text-slate-500")}>
                      {c.delta === null ? "—" : `${c.delta > 0 ? "▲ +" : c.delta < 0 ? "▼ " : ""}${c.delta}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="font-bold">Akurasi kuis & latihan per bidang</h2>
        {withQuiz.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Belum ada kuis atau latihan yang dikerjakan.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {withQuiz.map((x) => (
              <li key={x.subject.id}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{x.subject.name}</span><span className="font-bold">{x.quizPct}%</span></div>
                <ProgressBar value={x.quizPct!} tone={x.quizPct! >= 70 ? "navy" : "marun"} className="mt-1" label={`Akurasi ${x.subject.name}`} />
              </li>
            ))}
          </ul>
        )}
        {withQuiz.length >= 2 && (
          <p className="mt-4 rounded-xl bg-canvas p-3 text-sm">
            Terkuat: <b>{withQuiz[0].subject.name}</b> · Perlu latihan: <b>{withQuiz[withQuiz.length - 1].subject.name}</b>
          </p>
        )}
      </Card>
      <p className="flex items-center gap-2 text-xs text-slate-500"><ClipboardCheck className="h-4 w-4" /> Pretest dan latihan adalah alat bantu belajar, bukan pengukuran psikometrik tervalidasi.</p>
    </div>
  );
}
