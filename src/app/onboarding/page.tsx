"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Moon, Sun, Sunrise } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, Icon } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { useHydrated, useSession, useStore } from "@/lib/store";
import type { UserCategory, UserProfile } from "@/lib/types";
import { cx } from "@/lib/utils";

const EDU = ["SMA / MA", "SMK", "Lulusan SMA/SMK (gap year)", "Mahasiswa D3/D4", "Mahasiswa S1"];
const STATUS: { id: UserCategory; t: string; d: string }[] = [
  { id: "siswa", t: "Siswa SMA/SMK sederajat", d: "Masih sekolah dan sedang mempersiapkan kuliah." },
  { id: "calon", t: "Calon mahasiswa", d: "Sudah diterima di perguruan tinggi, menunggu semester dimulai." },
  { id: "maba", t: "Mahasiswa baru", d: "Sedang menjalani semester pertama." },
];
const GOALS = [
  "Menguatkan materi dasar sebelum kuliah",
  "Mengetahui level kemampuan awal",
  "Membangun kebiasaan belajar rutin",
  "Beradaptasi dengan ritme kuliah",
  "Memantapkan pilihan jurusan",
  "Mempersiapkan karier sejak awal",
];
const MINUTES = [15, 30, 45, 60, 90];
const TIMES = [
  { id: "pagi", t: "Pagi", icon: Sunrise },
  { id: "siang", t: "Siang/Sore", icon: Sun },
  { id: "malam", t: "Malam", icon: Moon },
];

export default function Onboarding() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { user, data } = useSession();
  const subjects = useStore((s) => s.content.subjects);
  const pretestCount = useStore((s) => s.content.pretest.length);
  const saveProfile = useStore((s) => s.saveProfile);
  const [step, setStep] = useState(0);
  const [p, setP] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/masuk");
    else if (data && !p) setP({ ...data.profile, status: data.profile.status || user.category });
  }, [hydrated, user, data, p, router]);

  if (!p || !user) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Memuat…</div>;

  const toggle = (k: "majors" | "goals" | "focusSubjects", v: string, max = 99) =>
    setP((x) => {
      if (!x) return x;
      const has = x[k].includes(v);
      if (!has && x[k].length >= max) return x;
      return { ...x, [k]: has ? x[k].filter((y) => y !== v) : [...x[k], v] };
    });

  const steps = [
    { t: "Jenjang pendidikanmu saat ini?", ok: !!p.education },
    { t: "Apa statusmu sekarang?", ok: !!p.status },
    { t: "Jurusan atau bidang studi yang kamu minati?", d: "Pilih maksimal 3.", ok: p.majors.length > 0 },
    { t: "Apa tujuan belajarmu di SINAU?", d: "Boleh pilih lebih dari satu.", ok: p.goals.length > 0 },
    { t: "Materi apa yang ingin kamu kuasai?", d: "Boleh pilih lebih dari satu.", ok: p.focusSubjects.length > 0 },
    { t: "Berapa waktu belajar yang tersedia setiap hari?", ok: !!p.dailyMinutes && !!p.studyTime },
  ];
  const cur = steps[step];
  const last = step === steps.length - 1;

  function finish() {
    if (!p) return;
    saveProfile({ ...p, onboarded: true });
    router.push(pretestCount > 0 ? "/app/pretest?dari=onboarding" : "/app");
  }

  const opt = (active: boolean) =>
    cx("flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marun-500", active ? "border-marun-600 bg-marun-50" : "border-slate-200 bg-white hover:border-marun-200");
  const check = (active: boolean) => (
    <span className={cx("ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2", active ? "border-marun-700 bg-marun-700 text-white" : "border-slate-300")}>{active && <Check className="h-3.5 w-3.5" />}</span>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Logo sub={false} />
          <span className="text-sm font-semibold text-slate-500">
            Langkah {step + 1} dari {steps.length}
          </span>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-marun-700 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-marun-600">Smart Onboarding</p>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{cur.t}</h1>
        {cur.d && <p className="mt-1 text-slate-500">{cur.d}</p>}

        <div key={step} className="fade-up mt-6">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Jenjang pendidikan">
              {EDU.map((e) => (
                <button key={e} role="radio" aria-checked={p.education === e} className={opt(p.education === e)} onClick={() => setP({ ...p, education: e })}>
                  <span className="font-semibold">{e}</span>
                  {check(p.education === e)}
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-3" role="radiogroup" aria-label="Status">
              {STATUS.map((s) => (
                <button key={s.id} role="radio" aria-checked={p.status === s.id} className={opt(p.status === s.id)} onClick={() => setP({ ...p, status: s.id })}>
                  <span>
                    <span className="block font-bold">{s.t}</span>
                    <span className="block text-sm text-slate-500">{s.d}</span>
                  </span>
                  {check(p.status === s.id)}
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {MAJOR_OPTIONS.map((m) => {
                const a = p.majors.includes(m.id);
                const disabled = !a && p.majors.length >= 3;
                return (
                  <button key={m.id} aria-pressed={a} disabled={disabled} className={cx(opt(a), disabled && "opacity-50")} onClick={() => toggle("majors", m.id, 3)}>
                    <span className="font-semibold">{m.name}</span>
                    {check(a)}
                  </button>
                );
              })}
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const a = p.goals.includes(g);
                return (
                  <button key={g} aria-pressed={a} className={opt(a)} onClick={() => toggle("goals", g)}>
                    <span className="font-semibold">{g}</span>
                    {check(a)}
                  </button>
                );
              })}
            </div>
          )}
          {step === 4 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {subjects.map((s) => {
                const a = p.focusSubjects.includes(s.id);
                return (
                  <button key={s.id} aria-pressed={a} className={opt(a)} onClick={() => toggle("focusSubjects", s.id)}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: s.color }}>
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-bold">{s.name}</span>
                      <span className="line-clamp-1 text-xs text-slate-500">{s.description}</span>
                    </span>
                    {check(a)}
                  </button>
                );
              })}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Menit per hari">
                {MINUTES.map((m) => (
                  <button key={m} role="radio" aria-checked={p.dailyMinutes === m} onClick={() => setP({ ...p, dailyMinutes: m })} className={cx("inline-flex items-center gap-2 rounded-xl border-2 px-4 py-3 font-bold transition", p.dailyMinutes === m ? "border-marun-600 bg-marun-50 text-marun-700" : "border-slate-200 bg-white")}>
                    <Clock className="h-4 w-4" /> {m} menit
                  </button>
                ))}
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold">Waktu belajar favorit</p>
                <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Waktu belajar">
                  {TIMES.map(({ id, t, icon: I }) => (
                    <button key={id} role="radio" aria-checked={p.studyTime === id} onClick={() => setP({ ...p, studyTime: id })} className={cx(opt(p.studyTime === id), "flex-col justify-center text-center")}>
                      <I className={cx("h-6 w-6", p.studyTime === id ? "text-marun-700" : "text-slate-400")} />
                      <span className="font-bold">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
          {last ? (
            <Button size="lg" onClick={finish} disabled={!cur.ok}>
              Simpan & Lanjut ke Pretest <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={() => setStep(step + 1)} disabled={!cur.ok}>
              Lanjut <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {!cur.ok && <p className="mt-3 text-right text-xs text-slate-500">Pilih minimal satu jawaban untuk melanjutkan.</p>}
      </main>
    </div>
  );
}
