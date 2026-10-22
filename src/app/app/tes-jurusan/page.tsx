"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Briefcase, Building2, Check, Compass, Info, RotateCcw, Star } from "lucide-react";
import { Badge, Button, Card, Modal, PageHeader, ProgressBar } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { DIMENSIONS, LIKERT, MAJOR_TEST_QUESTIONS, scoreMajorTest } from "@/data/major-test";
import { useSession, useStore } from "@/lib/store";
import type { MajorTestResult } from "@/lib/types";
import { cx, formatTanggal } from "@/lib/utils";

const PER_PAGE = 6;
const majorName = (id: string) => MAJOR_OPTIONS.find((m) => m.id === id)?.name ?? id;

export default function TesJurusan() {
  const { data } = useSession();
  const d = data!;
  const submit = useStore((s) => s.submitMajorTest);
  const [phase, setPhase] = useState<"intro" | "run" | "hasil">(d.majorTests.length ? "hasil" : "intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);
  const [showErr, setShowErr] = useState(false);
  const pages = Math.ceil(MAJOR_TEST_QUESTIONS.length / PER_PAGE);
  const current = MAJOR_TEST_QUESTIONS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const answered = Object.keys(answers).length;

  function next() {
    if (current.some((q) => answers[q.id] === undefined)) return setShowErr(true);
    setShowErr(false);
    if (page < pages - 1) {
      setPage(page + 1);
      window.scrollTo({ top: 0 });
    } else {
      submit(scoreMajorTest(answers));
      setPhase("hasil");
      window.scrollTo({ top: 0 });
    }
  }

  if (phase === "run")
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Tes Kecocokan Jurusan" desc={`Bagian ${page + 1} dari ${pages} · seberapa sesuai pernyataan berikut dengan dirimu?`} />
        <ProgressBar value={(answered / MAJOR_TEST_QUESTIONS.length) * 100} label="Pernyataan terjawab" />
        <p className="mt-2 text-xs text-slate-500">{answered} dari {MAJOR_TEST_QUESTIONS.length} terjawab · tidak ada jawaban benar atau salah</p>
        <ol className="mt-6 space-y-4" start={page * PER_PAGE + 1}>
          {current.map((q, k) => {
            const missing = showErr && answers[q.id] === undefined;
            return (
              <li key={q.id}>
                <Card className={cx("p-5", missing && "ring-2 ring-red-400")}>
                  <fieldset>
                    <legend className="font-semibold">
                      {page * PER_PAGE + k + 1}. {q.text}
                    </legend>
                    <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
                      {LIKERT.map((l, v) => (
                        <label key={v} className={cx("flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2.5 text-center transition", answers[q.id] === v ? "border-marun-600 bg-marun-50" : "border-slate-200 hover:border-marun-200")}>
                          <input type="radio" name={q.id} className="sr-only" checked={answers[q.id] === v} onChange={() => setAnswers({ ...answers, [q.id]: v })} />
                          <span className={cx("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", answers[q.id] === v ? "bg-marun-700 text-white" : "bg-slate-100 text-slate-500")}>{v + 1}</span>
                          <span className="text-[10px] leading-tight text-slate-600 sm:text-xs">{l}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {missing && <p className="mt-2 text-xs font-medium text-red-600" role="alert">Pilih salah satu jawaban.</p>}
                </Card>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 flex justify-between gap-3">
          <Button variant="ghost" onClick={() => (page === 0 ? setPhase(d.majorTests.length ? "hasil" : "intro") : setPage(page - 1))}>
            <ArrowLeft className="h-4 w-4" /> {page === 0 ? "Batal" : "Sebelumnya"}
          </Button>
          <Button onClick={next}>
            {page < pages - 1 ? "Lanjut" : "Lihat hasil"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );

  if (phase === "hasil" && d.majorTests.length)
    return (
      <Hasil
        r={d.majorTests[d.majorTests.length - 1]}
        count={d.majorTests.length}
        onRetry={() => {
          setAnswers({});
          setPage(0);
          setPhase("run");
        }}
      />
    );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Tes Kecocokan Jurusan" desc="Eksplorasi minatmu untuk menemukan rumpun jurusan yang mungkin cocok." />
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-marun-50 text-marun-700"><Compass className="h-6 w-6" /></span>
          <div>
            <p className="font-bold">{MAJOR_TEST_QUESTIONS.length} pernyataan · ±5 menit</p>
            <p className="mt-1 text-sm text-slate-600">Nilai seberapa sesuai setiap pernyataan dengan dirimu (1–5). Hasilnya menunjukkan rumpun jurusan yang paling sejalan dengan minatmu, beserta prospek kariernya.</p>
          </div>
        </div>
        <p className="mt-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-300/60">
          <Info className="h-4 w-4 shrink-0" />
          Ini alat eksplorasi minat sederhana, <b>bukan tes psikologi yang tervalidasi</b>. Gunakan sebagai bahan diskusi dengan guru BK, orang tua, atau mentor — bukan satu-satunya dasar memilih jurusan.
        </p>
        <Button size="lg" className="mt-5" onClick={() => setPhase("run")}>
          Mulai tes <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
}

function Hasil({ r, count, onRetry }: { r: MajorTestResult; count: number; onRetry: () => void }) {
  const { data } = useSession();
  const majors = useStore((s) => s.content.majors);
  const saveProfile = useStore((s) => s.saveProfile);
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const ranked = Object.entries(r.scores).sort((a, b) => b[1] - a[1]);
  const top3 = ranked.slice(0, 3);
  const dims = Object.entries(r.dims).sort((a, b) => b[1] - a[1]);
  const flat = ranked[0][1] - ranked[ranked.length - 1][1] < 15;
  const current = data!.profile.majors;
  const proposed = top3.map(([id]) => id);
  const same = proposed.every((p) => current.includes(p)) && current.length === proposed.length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Hasil Tes Kecocokan Jurusan"
        desc={`${formatTanggal(r.date.slice(0, 10), true)}${count > 1 ? ` · tes ke-${count}` : ""}`}
        actions={<Button variant="outline" size="sm" onClick={onRetry}><RotateCcw className="h-4 w-4" /> Ulangi tes</Button>}
      />

      {flat && (
        <p className="mb-4 flex gap-2 rounded-xl bg-navy-50 p-3 text-sm text-navy-800">
          <Info className="h-4 w-4 shrink-0" /> Skormu cukup seimbang di banyak rumpun — minatmu belum terlihat dominan. Coba eksplorasi beberapa jurusan teratas dan ulangi tes nanti.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {top3.map(([id, score], k) => {
          const info = majors.find((m) => m.id === id);
          return (
            <Card key={id} className={cx("flex flex-col p-5", k === 0 && "ring-2 ring-marun-600")}>
              <div className="flex items-center justify-between">
                <Badge tone={k === 0 ? "marun" : "navy"}>#{k + 1}</Badge>
                <span className="text-2xl font-extrabold text-marun-700">{score}%</span>
              </div>
              <h2 className="mt-3 text-lg font-extrabold leading-snug">{majorName(id)}</h2>
              {info ? (
                <>
                  <p className="mt-1 line-clamp-3 flex-1 text-sm text-slate-600">{info.description}</p>
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500"><Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {info.careers.slice(0, 3).join(", ")}</p>
                </>
              ) : (
                <p className="mt-1 flex-1 text-sm text-slate-500">Informasi rumpun ini belum tersedia di Career Lounge.</p>
              )}
              {current.includes(id) && <p className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600"><Star className="h-3.5 w-3.5" /> Sudah jadi minatmu</p>}
            </Card>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => setConfirm(true)} disabled={same || saved}>
          {saved || same ? <Check className="h-4 w-4" /> : <Star className="h-4 w-4" />} {saved ? "Minat diperbarui" : same ? "Sudah sesuai profil" : "Jadikan minat di profil"}
        </Button>
        <Link href="/app/karier" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-marun-50"><Compass className="h-4 w-4" /> Jelajahi jurusan</Link>
        <Link href="/app/kampus" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-marun-50"><Building2 className="h-4 w-4" /> Rekomendasi kampus</Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-bold">Kecocokan semua rumpun</h2>
          <ul className="mt-4 space-y-3">
            {ranked.map(([id, v]) => (
              <li key={id}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{majorName(id)}</span><span className="font-bold">{v}%</span></div>
                <ProgressBar value={v} tone={top3.some(([t]) => t === id) ? "marun" : "navy"} className="mt-1" label={`${majorName(id)} ${v}%`} />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold">Profil minatmu</h2>
          <p className="text-xs text-slate-500">Rata-rata jawaban per dimensi minat</p>
          <ul className="mt-4 space-y-3">
            {dims.map(([k, v]) => (
              <li key={k}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{DIMENSIONS[k].label}</span><span className="text-slate-500">{v}%</span></div>
                <ProgressBar value={v} tone="amber" className="mt-1" label={`${DIMENSIONS[k].label} ${v}%`} />
                <p className="mt-0.5 text-[11px] text-slate-500">{DIMENSIONS[k].desc}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <p className="mt-6 text-xs text-slate-500">Alat eksplorasi minat sederhana, bukan tes psikologi tervalidasi. Kurikulum dan prospek dapat berbeda di tiap kampus.</p>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Perbarui minat jurusan?">
        <p className="text-sm text-slate-600">Minat jurusan di profilmu akan diganti. Ini memengaruhi rekomendasi materi, jalur belajar, dan rekomendasi kampus.</p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">Saat ini</p>{current.length ? current.map((c) => <p key={c}>{majorName(c)}</p>) : <p className="text-slate-400">—</p>}</div>
          <div className="rounded-xl bg-marun-50 p-3"><p className="text-xs font-bold text-marun-700">Menjadi</p>{proposed.map((c) => <p key={c}>{majorName(c)}</p>)}</div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>Batal</Button>
          <Button onClick={() => { saveProfile({ majors: proposed }); setSaved(true); setConfirm(false); }}>Perbarui minat</Button>
        </div>
      </Modal>
    </div>
  );
}
