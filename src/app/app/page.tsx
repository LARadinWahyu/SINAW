"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlarmClock, ArrowRight, BookOpen, Briefcase, CalendarClock, CheckCircle2, ClipboardCheck, Clock, Flame, Megaphone, Plus, Sparkles, Target } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, EmptyState, Icon, LinkButton, ProgressBar, Ring } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { useSession, useStore } from "@/lib/store";
import { computeStreak, lastNDays } from "@/lib/streak";
import { latestPretest, progressStats, recommendMaterials, topicAnalysis } from "@/lib/recommend";
import { addDays, cx, dayKey, formatRelatif, hariSingkat, parseDay, sapaan } from "@/lib/utils";
import { deadlineAlerts } from "@/lib/deadline";

const STATUS_LABEL = { siswa: "Siswa SMA/SMK", calon: "Calon mahasiswa", maba: "Mahasiswa baru" };
const PRI = { tinggi: "marun", sedang: "amber", rendah: "slate" } as const;

export default function Dashboard() {
  const { user, data } = useSession();
  const content = useStore((s) => s.content);
  const setTaskStatus = useStore((s) => s.setTaskStatus);
  const d = data!;
  const today = dayKey();

  const streak = useMemo(() => computeStreak(d.activity, d.settings.dailyTarget), [d.activity, d.settings.dailyTarget]);
  const pt = latestPretest(d);
  const analysis = pt ? topicAnalysis(pt) : null;
  const recs = recommendMaterials(content.materials, content.subjects, d, 4);
  const prog = progressStats(content.materials, content.subjects, d);
  const last = d.lastOpened ? content.materials.find((m) => m.id === d.lastOpened!.materialId) : null;
  const todayTasks = d.tasks.filter((t) => t.dueDate === today || (t.dueDate < today && t.status !== "done")).sort((a, b) => a.dueTime.localeCompare(b.dueTime));
  const upcoming = d.tasks.filter((t) => t.status !== "done" && t.dueDate > today && t.dueDate <= addDays(today, 7)).sort((a, b) => (a.dueDate + a.dueTime).localeCompare(b.dueDate + b.dueTime));
  const week = lastNDays(7).map((k) => ({ day: hariSingkat(parseDay(k)), aktivitas: streak.byDay[k] || 0, key: k }));
  const majors = d.profile.majors.map((id) => MAJOR_OPTIONS.find((m) => m.id === id)?.name.split(" (")[0]).filter(Boolean);
  const first = user!.name.split(" ")[0];
  const alerts = deadlineAlerts(d.tasks, d.settings.deadlineLeadHours);

  return (
    <div className="space-y-6">
      {/* Sapaan — panel mesh gradient dengan kartu kaca melayang */}
      <section className="grain relative isolate overflow-hidden rounded-[2rem] bg-passion-mesh p-6 text-white shadow-lift sm:rounded-[2.5rem] sm:p-10">
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-white/80">{sapaan()},</p>
            <h1 className="mt-1 text-4xl font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl">{first}! 👋</h1>
            <p className="mt-3 text-sm text-white/85 sm:text-base">
              {STATUS_LABEL[d.profile.status]}
              {majors.length > 0 && <> · Minat: {majors.join(", ")}</>}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/app/belajar" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink shadow-[0_14px_30px_-14px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5">
                <BookOpen className="h-4 w-4 text-marun-600" /> Pusat Belajar
              </Link>
              <Link href="/app/nara" className="glass-dark inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 ring-white/35 transition hover:bg-white/25">
                <Sparkles className="h-4 w-4" /> Tanya NARA
              </Link>
            </div>
          </div>
          {/* ringkasan cepat (data asli) */}
          <div className="relative grid grid-cols-3 gap-3 lg:block lg:h-60" aria-hidden>
            <div className="glass-dark rounded-[1.5rem] p-4 ring-1 ring-white/30 lg:absolute lg:right-[11rem] lg:top-0 lg:w-40 lg:-rotate-6">
              <Flame className="h-5 w-5" />
              <p className="mt-2 text-3xl font-semibold tracking-tight">{streak.current}</p>
              <p className="text-[11px] text-white/80">hari beruntun</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 text-ink shadow-2xl lg:absolute lg:right-0 lg:top-2 lg:w-40 lg:rotate-6">
              <Target className="h-5 w-5 text-marun-600" />
              <p className="mt-2 text-3xl font-semibold tracking-tight">{pt ? pt.score : "—"}</p>
              <p className="text-[11px] text-slate-500">nilai pretest</p>
            </div>
            <div className="glass-dark rounded-[1.5rem] p-4 ring-1 ring-white/30 lg:absolute lg:right-[5.5rem] lg:top-[8.75rem] lg:w-40 lg:rotate-2">
              <BookOpen className="h-5 w-5" />
              <p className="mt-2 text-3xl font-semibold tracking-tight">{prog.pct}%</p>
              <p className="text-[11px] text-white/80">materi selesai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deadline reminder */}
      {alerts.length > 0 && (
        <section aria-labelledby="tenggat" className="rounded-[2rem] border border-marun-200 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="tenggat" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-passion-gradient text-white">
                <AlarmClock className="h-4 w-4" />
              </span>
              Mendekati tenggat
              <span className="rounded-full bg-marun-50 px-2.5 text-xs font-bold text-marun-700">{alerts.length}</span>
            </h2>
            <Link href="/app/tugas" className="rounded-full bg-black/[0.04] px-4 py-2 text-sm font-bold text-ink hover:bg-black/[0.08]">Kelola tugas →</Link>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.task.id} className="flex items-center gap-3 rounded-full bg-passion-bg py-2.5 pl-4 pr-3">
                <input type="checkbox" onChange={() => setTaskStatus(a.task.id, "done")} className="h-5 w-5 shrink-0 cursor-pointer accent-marun-600" aria-label={`Tandai ${a.task.title} selesai`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.task.title}</p>
                  <p className="text-xs text-slate-500">{formatRelatif(a.task.dueDate)}, {a.task.dueTime}</p>
                </div>
                <span className={cx("shrink-0 rounded-full px-2.5 py-1 text-xs font-bold", a.level === "terlewat" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-600")}>{a.label}</span>
              </li>
            ))}
          </ul>
          {alerts.length > 4 && <p className="mt-2 text-xs text-slate-500">+{alerts.length - 4} pengingat lainnya di menu Tugas.</p>}
        </section>
      )}

      {/* Ringkasan — susunan asimetris */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Kesiapan akademik</h2>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marun-50 text-marun-600">
              <Target className="h-4 w-4" />
            </span>
          </div>
          {pt ? (
            <div className="mt-5 flex items-center gap-4">
              <Ring value={pt.score} sub="skor pretest" label={`Skor pretest terakhir ${pt.score}`} />
              <div className="text-sm">
                <p className="font-semibold">
                  {pt.correct}/{pt.total} soal benar
                </p>
                <p className="mt-1 text-slate-500">{analysis!.weak.length ? `${analysis!.weak.length} topik perlu diperkuat` : "Semua topik di atas ambang panduan"}</p>
                <Link href="/app/pretest" className="mt-2 inline-flex text-xs font-bold text-marun-700 hover:underline">
                  Ulangi pretest →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-4">
              <Ring value={null} sub="belum ada data" label="Belum ada data kesiapan" />
              <div className="text-sm">
                <p className="text-slate-500">Kerjakan pretest untuk mengetahui level kesiapanmu.</p>
                <LinkButton href="/app/pretest" size="sm" className="mt-2">
                  Mulai Pretest
                </LinkButton>
              </div>
            </div>
          )}
        </Card>

        <section className="relative overflow-hidden rounded-[2rem] bg-passion-gradient p-6 text-white shadow-lift md:col-span-2 lg:col-span-5 lg:-rotate-1">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" aria-hidden />
          <div className="relative flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Daily streak</h2>
            <span className="inline-flex items-center gap-1 text-3xl font-semibold tracking-tight">
              <Flame className="h-7 w-7" /> {streak.current}
            </span>
          </div>
          <ol className="relative mt-5 flex justify-between" aria-label="Aktivitas 7 hari terakhir">
            {week.map((w) => {
              const met = w.aktivitas >= d.settings.dailyTarget;
              return (
                <li key={w.key} className="flex flex-col items-center gap-1.5">
                  <span className={cx("text-[11px] font-semibold", w.key === today ? "text-white" : "text-white/70")}>{w.day}</span>
                  <span className={cx("flex h-9 w-9 items-center justify-center rounded-full", met ? "bg-white text-marun-600 shadow" : w.key === today ? "border-2 border-dashed border-white/80" : "bg-white/20")} title={`${w.aktivitas} aktivitas`}>
                    {met && <CheckCircle2 className="h-4 w-4" />}
                    <span className="sr-only">{met ? "target tercapai" : "belum tercapai"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="relative mt-5 text-xs text-white/90">
            Hari ini: <b className="text-white">{streak.todayCount}</b> dari target {d.settings.dailyTarget} aktivitas belajar.
          </p>
        </section>

        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Progres pembelajaran</h2>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600">
              <BookOpen className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-5 text-5xl font-semibold tracking-tight">
            {prog.pct}
            <span className="text-xl text-slate-400">%</span>
          </p>
          <ProgressBar value={prog.pct} className="mt-3" tone="marun" label="Progres materi" />
          <p className="mt-2 text-xs text-slate-500">
            {prog.done} dari {prog.total} materi relevan selesai
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0 space-y-6">
          {/* Lanjut belajar */}
          {last && (
            <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md" style={{ background: content.subjects.find((s) => s.id === last.subjectId)?.color ?? "#9B0A0A" }}>
                <Icon name={content.subjects.find((s) => s.id === last.subjectId)?.icon ?? "BookOpen"} className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-marun-600">Materi terakhir dipelajari</p>
                <p className="text-lg font-semibold tracking-tight">{last.title}</p>
                <p className="text-xs text-slate-500">{d.completed[last.id] ? "Sudah selesai" : `±${last.minutes} menit · ${last.level}`}</p>
              </div>
              <LinkButton href={`/app/belajar/${last.id}`} variant="primary" size="sm">
                {d.completed[last.id] ? "Buka lagi" : "Lanjutkan"} <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </Card>
          )}

          {/* Rekomendasi */}
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Rekomendasi belajar</h2>
                <p className="text-xs text-slate-500">{pt ? "Berdasarkan hasil pretest & profilmu" : "Berdasarkan profil onboarding-mu"}</p>
              </div>
              <Link href="/app/belajar" className="rounded-full bg-black/[0.04] px-4 py-2 text-sm font-bold text-ink hover:bg-black/[0.08]">
                Semua
              </Link>
            </div>
            {recs.length === 0 ? (
              <EmptyState icon="Award" title="Semua materi rekomendasi sudah selesai" desc="Hebat! Jelajahi bidang lain di Pusat Belajar atau ulangi pretest." />
            ) : (
              <ul className="space-y-2">
                {recs.map(({ material: m, reason }) => {
                  const sub = content.subjects.find((s) => s.id === m.subjectId);
                  return (
                    <li key={m.id}>
                      <Link href={`/app/belajar/${m.id}`} className="flex items-center gap-3 rounded-[1.5rem] bg-passion-bg/70 p-3 transition hover:bg-marun-50">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: sub?.color }}>
                          <Icon name={sub?.icon ?? "BookOpen"} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold">{m.title}</span>
                          <span className="block truncate text-xs text-slate-500">{reason}</span>
                        </span>
                        <Badge tone={m.level === "Dasar" ? "navy" : "marun"}>{m.level}</Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Grafik aktivitas */}
          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold tracking-tight">Aktivitas belajar 7 hari terakhir</h2>
            <p className="text-xs text-slate-500">Jumlah aktivitas tercatat (materi, kuis, pretest, tugas selesai)</p>
            {d.activity.length === 0 ? (
              <div className="mt-4">
                <EmptyState icon="BarChart3" title="Belum ada aktivitas" desc="Selesaikan materi, kuis, atau tugas pertamamu — grafik ini akan terisi otomatis." />
              </div>
            ) : (
              <div className="mt-4 h-44" role="img" aria-label={`Aktivitas 7 hari: ${week.map((w) => `${w.day} ${w.aktivitas}`).join(", ")}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#CC2E2E" />
                        <stop offset="100%" stopColor="#9B0A0A" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip cursor={{ fill: "#FDF3F3" }} formatter={(v) => [`${v} aktivitas`, ""]} labelFormatter={(l) => `${l}`} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 30px rgba(26,26,26,.08)" }} />
                    <Bar dataKey="aktivitas" fill="url(#dashBar)" radius={[10, 10, 10, 10]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          {/* To-do hari ini */}
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">To-do hari ini</h2>
              <Link href="/app/tugas?baru=1" className="inline-flex items-center gap-1 rounded-full bg-marun-600 px-3.5 py-2 text-xs font-bold text-white shadow-[0_8px_18px_-10px_rgba(155,10,10,.9)] hover:bg-marun-700">
                <Plus className="h-3.5 w-3.5" /> Tambah
              </Link>
            </div>
            {todayTasks.length === 0 ? (
              <EmptyState icon="ClipboardList" title="Belum ada tugas hari ini" desc="Tambahkan aktivitas belajar agar harimu lebih terarah." />
            ) : (
              <ul className="space-y-2">
                {todayTasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 rounded-[1.5rem] bg-passion-bg p-3.5">
                    <input type="checkbox" checked={t.status === "done"} onChange={() => setTaskStatus(t.id, t.status === "done" ? "todo" : "done")} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-marun-600" aria-label={`Tandai ${t.title} selesai`} />
                    <div className="min-w-0 flex-1">
                      <p className={cx("text-sm font-semibold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</p>
                      <p className={cx("flex items-center gap-1 text-xs", t.dueDate < today && t.status !== "done" ? "font-semibold text-red-600" : "text-slate-500")}>
                        <Clock className="h-3 w-3" /> {t.dueDate < today ? `Terlewat · ${formatRelatif(t.dueDate)}` : t.dueTime}
                      </p>
                    </div>
                    <Badge tone={PRI[t.priority]}>{t.priority}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Jadwal */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-600">
                <CalendarClock className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">Jadwal & pengingat</h2>
            </div>
            {upcoming.length === 0 ? (
              <div className="rounded-[1.5rem] bg-passion-bg p-4 text-sm">
                <p className="text-slate-500">Tidak ada jadwal dalam 7 hari ke depan.</p>
                <Link href="/app/tugas?view=pintar" className="mt-1 inline-block font-bold text-marun-700 hover:underline">Susun jadwal otomatis dengan Smart Schedule →</Link>
              </div>
            ) : (
              <ul className="divide-y divide-black/5">
                {upcoming.slice(0, 4).map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="truncate font-semibold">{t.title}</span>
                    <span className="shrink-0 rounded-full bg-passion-bg px-2.5 py-1 text-xs text-slate-600">
                      {formatRelatif(t.dueDate)} · {t.dueTime}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-slate-500">
              Pengingat belajar harian: {d.settings.reminders ? <b className="text-ink">aktif pukul {d.settings.reminderTime}</b> : "nonaktif"} ·{" "}
              <Link href="/app/profil#notifikasi" className="font-semibold text-marun-700 hover:underline">
                atur
              </Link>
            </p>
          </Card>

          {/* Hasil pretest */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marun-50 text-marun-600">
                <ClipboardCheck className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">Hasil pretest terakhir</h2>
            </div>
            {pt && analysis ? (
              <div className="space-y-3 text-sm">
                {analysis.mastered.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs font-bold text-emerald-700">Sudah dikuasai</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.mastered.map((t) => (
                        <Badge key={t} tone="green">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.weak.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs font-bold text-marun-700">Perlu dipelajari</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.weak.map((t) => (
                        <Badge key={t} tone="marun">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState icon="Target" title="Belum ada hasil" action={<LinkButton href="/app/pretest" size="sm">Mulai Pretest</LinkButton>} />
            )}
          </Card>

          {/* Akses cepat — kartu miring */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Link href="/app/nara" className="grain relative isolate -rotate-2 overflow-hidden rounded-[2rem] bg-passion-mesh p-5 text-white shadow-lift transition hover:rotate-0">
              <Sparkles className="h-7 w-7" strokeWidth={1.6} />
              <p className="mt-4 text-lg font-semibold tracking-tight">AI NARA</p>
              <p className="text-xs text-white/85">Jelaskan konsep & buat rencana belajar</p>
            </Link>
            <Link href="/app/karier" className="rotate-2 rounded-[2rem] bg-ink p-5 text-white shadow-float transition hover:rotate-0">
              <Briefcase className="h-7 w-7 text-amber-300" strokeWidth={1.6} />
              <p className="mt-4 text-lg font-semibold tracking-tight">Career Lounge</p>
              <p className="text-xs text-white/70">Jurusan, karier & budaya kampus</p>
            </Link>
          </div>

          {content.announcements.length > 0 && (
            <Card className="p-5 sm:p-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marun-50 text-marun-600">
                  <Megaphone className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight">Pengumuman</h2>
              </div>
              {content.announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="mt-2">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.body}</p>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
