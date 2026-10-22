"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, ImageIcon, ListChecks, Search, SlidersHorizontal, Sparkles, Video } from "lucide-react";
import { youtubeId } from "@/lib/video";
import { Badge, Card, DemoTag, EmptyState, Icon, Input, PageHeader, ProgressBar, Select } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import { progressStats, recommendMaterials, relevantSubjects } from "@/lib/recommend";
import { cx } from "@/lib/utils";

export default function PusatBelajar() {
  const { data } = useSession();
  const { subjects, materials } = useStore((s) => s.content);
  const d = data!;
  const relevant = relevantSubjects(subjects, d).map((s) => s.id);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"jurusan" | "semua">("jurusan");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("all");

  const prog = progressStats(materials, subjects, d);
  const recs = recommendMaterials(materials, subjects, d, 3);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return materials.filter((m) => {
      if (scope === "jurusan" && !relevant.includes(m.subjectId)) return false;
      if (subject !== "all" && m.subjectId !== subject) return false;
      if (level !== "all" && m.level !== level) return false;
      if (status === "done" && !d.completed[m.id]) return false;
      if (status === "todo" && d.completed[m.id]) return false;
      if (format === "video" && !m.videoUrl) return false;
      if (format === "kuis" && !m.quiz.length) return false;
      if (t && !`${m.title} ${m.description} ${m.topic}`.toLowerCase().includes(t)) return false;
      return true;
    });
  }, [materials, q, scope, subject, level, status, format, relevant, d.completed]);

  const visibleSubjects = scope === "jurusan" ? subjects.filter((s) => relevant.includes(s.id)) : subjects;

  return (
    <div>
      <PageHeader title="Pusat Belajar" desc="Jelajahi modul persiapan kuliah dan keterampilan akademik." kicker={<DemoTag label="Materi berlabel demo — bukan materi resmi SINAU" />} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="p-5">
          <p className="text-sm font-bold">Progres materi {scope === "jurusan" ? "sesuai jurusanmu" : ""}</p>
          <p className="mt-2 text-3xl font-extrabold">{prog.pct}%</p>
          <ProgressBar value={prog.pct} className="mt-2" label="Progres materi" />
          <p className="mt-2 text-xs text-slate-500">
            {prog.done} dari {prog.total} materi selesai
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-marun-600" /> Rekomendasi untukmu
            </p>
            <Link href="/app/jalur" className="text-xs font-bold text-marun-700 hover:underline">Lihat jalur lengkap →</Link>
          </div>
          {recs.length ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-3">
              {recs.map(({ material: m, reason }) => (
                <li key={m.id}>
                  <Link href={`/app/belajar/${m.id}`} className="block h-full rounded-xl bg-marun-50 p-3 hover:bg-marun-100">
                    <span className="line-clamp-2 text-sm font-bold text-marun-800">{m.title}</span>
                    <span className="mt-1 line-clamp-2 block text-[11px] text-marun-700/80">{reason}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Semua rekomendasi sudah selesai. Coba jelajahi semua bidang.</p>
          )}
        </Card>
      </div>

      {/* Bidang */}
      <h2 className="mb-3 mt-8 text-lg font-extrabold">Bidang pembelajaran</h2>
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {visibleSubjects.map((s) => {
          const ms = materials.filter((m) => m.subjectId === s.id);
          const done = ms.filter((m) => d.completed[m.id]).length;
          const active = subject === s.id;
          return (
            <button key={s.id} onClick={() => setSubject(active ? "all" : s.id)} aria-pressed={active} className={cx("min-w-[220px] rounded-2xl border-2 bg-white p-4 text-left transition sm:min-w-0", active ? "border-marun-600" : "border-transparent shadow-card hover:border-marun-200")}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: s.color }}>
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 font-bold">{s.name}</p>
              <p className="text-xs text-slate-500">
                {done}/{ms.length} materi selesai
              </p>
              <ProgressBar value={ms.length ? (done / ms.length) * 100 : 0} className="mt-2 h-1.5" tone="navy" label={`Progres ${s.name}`} />
            </button>
          );
        })}
      </div>

      {/* Filter */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="cari" className="sr-only">
            Cari materi
          </label>
          <Input id="cari" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari topik, rumus, atau mata kuliah…" className="pl-10" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="hidden h-4 w-4 text-slate-400 lg:block" />
          <div className="flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Cakupan">
            {(["jurusan", "semua"] as const).map((s) => (
              <button key={s} onClick={() => { setScope(s); setSubject("all"); }} aria-pressed={scope === s} className={cx("rounded-lg px-3 py-1.5 text-xs font-bold", scope === s ? "bg-white text-marun-700 shadow-sm" : "text-slate-500")}>
                {s === "jurusan" ? "Jurusanku" : "Semua bidang"}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="f-level">Tingkat kesulitan</label>
          <Select id="f-level" value={level} onChange={(e) => setLevel(e.target.value)} className="w-auto py-2">
            <option value="all">Semua tingkat</option>
            <option>Dasar</option>
            <option>Menengah</option>
            <option>Lanjut</option>
          </Select>
          <label className="sr-only" htmlFor="f-status">Status</label>
          <Select id="f-status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto py-2">
            <option value="all">Semua status</option>
            <option value="todo">Belum selesai</option>
            <option value="done">Selesai</option>
          </Select>
          <label className="sr-only" htmlFor="f-format">Format</label>
          <Select id="f-format" value={format} onChange={(e) => setFormat(e.target.value)} className="w-auto py-2">
            <option value="all">Semua format</option>
            <option value="video">Ada video</option>
            <option value="kuis">Ada kuis</option>
          </Select>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500" aria-live="polite">
        {list.length} materi{subject !== "all" && ` · ${subjects.find((s) => s.id === subject)?.name}`}
      </p>
      {list.length === 0 ? (
        <div className="mt-3">
          <EmptyState icon="Search" title="Materi tidak ditemukan" desc="Coba kata kunci lain atau ubah filter ke “Semua bidang”." />
        </div>
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => {
            const s = subjects.find((x) => x.id === m.subjectId);
            const done = !!d.completed[m.id];
            return (
              <li key={m.id}>
                <Link href={`/app/belajar/${m.id}`} className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-marun-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: s?.color }}>{s?.name}</span>
                    {done ? (
                      <Badge tone="green"><CheckCircle2 className="h-3 w-3" /> Selesai</Badge>
                    ) : d.lastOpened?.materialId === m.id ? (
                      <Badge tone="amber">Sedang dipelajari</Badge>
                    ) : (
                      <Badge>Belum mulai</Badge>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold leading-snug group-hover:text-marun-700">{m.title}</h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">{m.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {m.minutes} menit</span>
                    <Badge tone={m.level === "Dasar" ? "navy" : "marun"}>{m.level}</Badge>
                    {m.demo && <DemoTag label="Demo" />}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-500" aria-label="Format konten">
                    <span>Teks & contoh</span>
                    {m.sections.some((x) => x.illustration) && <span className="inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Ilustrasi</span>}
                    {m.videoUrl && <span className="inline-flex items-center gap-1 text-marun-700"><Video className="h-3 w-3" /> {youtubeId(m.videoUrl) ? "Video" : "Tautan video"}</span>}
                    {m.quiz.length > 0 && <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" /> {m.quiz.length} soal kuis</span>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
