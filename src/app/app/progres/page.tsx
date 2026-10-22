"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenCheck, CheckCircle2, Clock, ListChecks, Table2, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, EmptyState, Icon, LinkButton, PageHeader, ProgressBar } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import { progressReport } from "@/lib/progress";
import { formatDuration } from "@/lib/useStudyTimer";
import { cx, dayKey, formatTanggal, hariSingkat, parseDay } from "@/lib/utils";

const MARUN = "#9B0A0A";
const NAVY = "#3A5795";
const MUTED = "#CBD5E1";
const AXIS = { fontSize: 12, fill: "#64748b" };

export default function ProgressTracker() {
  const { data } = useSession();
  const { materials, subjects } = useStore((s) => s.content);
  const d = data!;
  const r = useMemo(() => progressReport(d, materials, subjects), [d, materials, subjects]);
  const [table1, setTable1] = useState(false);
  const [table2, setTable2] = useState(false);
  const target = d.profile.dailyMinutes;
  const delta = r.weekMin - r.lastWeekMin;
  const today = dayKey();
  const daily = r.daily14.map((x) => ({ ...x, label: x.key === today ? "Hari ini" : `${hariSingkat(parseDay(x.key))} ${parseDay(x.key).getDate()}` }));
  const hasTasks = r.tasks.weeks.some((w) => w.selesai + w.belum > 0);

  return (
    <div>
      <PageHeader title="Progress Tracker" desc="Pantau penyelesaian modul, waktu belajar, dan tugas dari data aktivitasmu sendiri." />

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Clock className="h-4 w-4 text-marun-600" /> Waktu belajar minggu ini</p>
          <p className="mt-2 text-3xl font-extrabold">{formatDuration(r.weekMin * 60)}</p>
          <p className={cx("mt-1 flex items-center gap-1 text-xs font-semibold", delta > 0 ? "text-emerald-700" : delta < 0 ? "text-marun-700" : "text-slate-500")}>
            {delta > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : delta < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : null}
            {r.lastWeekMin === 0 && r.weekMin === 0 ? "Belum ada catatan" : `${delta >= 0 ? "+" : "−"}${formatDuration(Math.abs(delta) * 60)} dari minggu lalu`}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Rata-rata 7 hari terakhir</p>
          <p className="mt-2 text-3xl font-extrabold">{r.avg7 === 0 ? 0 : r.avg7 < 1 ? "<1" : r.avg7 < 10 ? r.avg7.toFixed(1).replace(".", ",") : Math.round(r.avg7)}<span className="text-base font-bold text-slate-400"> / {target} mnt</span></p>
          <ProgressBar value={target ? (r.avg7 / target) * 100 : 0} className="mt-2" tone="amber" label="Rata-rata terhadap target harian" />
          <p className="mt-1 text-xs text-slate-500">{r.daysOnTarget7} dari 7 hari mencapai target {target} menit</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><BookOpenCheck className="h-4 w-4 text-navy-600" /> Modul selesai</p>
          <p className="mt-2 text-3xl font-extrabold">{r.modDone}<span className="text-base font-bold text-slate-400"> / {r.modTotal}</span></p>
          <ProgressBar value={r.modTotal ? (r.modDone / r.modTotal) * 100 : 0} className="mt-2" tone="navy" label="Modul selesai" />
          <p className="mt-1 text-xs text-slate-500">Rata-rata kuis: {r.quizPct === null ? "belum ada" : `${r.quizPct}% benar (${r.quizCount}×)`}</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><ListChecks className="h-4 w-4 text-marun-600" /> Tugas selesai</p>
          <p className="mt-2 text-3xl font-extrabold">{r.tasks.done}<span className="text-base font-bold text-slate-400"> / {r.tasks.total}</span></p>
          <p className="mt-2 text-xs text-slate-600">
            <b className="text-emerald-700">{r.tasks.onTime}</b> tepat waktu · <b className="text-amber-600">{r.tasks.late}</b> terlambat · <b className="text-red-600">{r.tasks.overdueOpen}</b> terlewat
          </p>
        </Card>
      </div>

      {/* Waktu belajar */}
      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-bold">Waktu belajar harian (14 hari)</h2>
            <p className="text-xs text-slate-500">Menit belajar aktif di halaman materi · garis putus-putus = target {target} menit</p>
          </div>
          <button onClick={() => setTable1(!table1)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100" aria-pressed={table1}>
            <Table2 className="h-3.5 w-3.5" /> {table1 ? "Lihat grafik" : "Lihat tabel"}
          </button>
        </div>
        {r.totalMin === 0 ? (
          <div className="mt-4">
            <EmptyState icon="Clock" title="Belum ada waktu belajar tercatat" desc="Waktu dihitung otomatis saat kamu aktif membaca materi di Pusat Belajar (tab terbuka & ada aktivitas)." action={<LinkButton href="/app/belajar" size="sm">Mulai belajar</LinkButton>} />
          </div>
        ) : table1 ? (
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs text-slate-500"><tr><th className="py-2">Tanggal</th><th className="py-2 text-right">Menit</th><th className="py-2 text-right">Target</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {[...r.daily14].reverse().map((x) => (
                <tr key={x.key}><td className="py-2">{formatTanggal(x.key, true)}</td><td className="py-2 text-right font-semibold">{x.menit}</td><td className="py-2 text-right">{x.menit >= target ? "✓ tercapai" : "—"}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-4 h-60" role="img" aria-label={`Menit belajar 14 hari terakhir: ${r.daily14.map((x) => x.menit).join(", ")}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 12, right: 8, left: -18, bottom: 0 }} barCategoryGap={4}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS} interval="preserveStartEnd" minTickGap={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={AXIS} unit="m" domain={[0, (max: number) => Math.ceil(Math.max(max, target) * 1.1)]} />
                <Tooltip cursor={{ fill: "#FDF3F3" }} formatter={(v) => [`${v} menit`, "Waktu belajar"]} />
                <ReferenceLine y={target} stroke="#C9720C" strokeDasharray="5 4" label={{ value: `Target ${target}m`, position: "insideTopRight", fill: "#C9720C", fontSize: 11 }} />
                <Bar dataKey="menit" fill={MARUN} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Modul per bidang */}
        <Card className="p-5">
          <h2 className="font-bold">Progres modul per bidang</h2>
          <ul className="mt-4 space-y-4">
            {r.perSubject.map((x) => (
              <li key={x.subject.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: x.subject.color }}>
                  <Icon name={x.subject.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="truncate font-semibold">{x.subject.name}</span>
                    <span className="shrink-0 text-slate-500">{x.done}/{x.total}</span>
                  </div>
                  <ProgressBar value={(x.done / x.total) * 100} className="mt-1" tone="navy" label={`Progres ${x.subject.name}`} />
                  <p className="mt-1 text-xs text-slate-500">
                    {x.minutes ? `${formatDuration(x.minutes * 60)} belajar` : "Belum ada waktu tercatat"} · kuis {x.quizPct === null ? "—" : `${x.quizPct}%`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Tugas per minggu */}
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-bold">Penyelesaian tugas per minggu</h2>
              <p className="text-xs text-slate-500">Berdasarkan tanggal tenggat (Senin–Minggu)</p>
            </div>
            {hasTasks && (
              <button onClick={() => setTable2(!table2)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100" aria-pressed={table2}>
                <Table2 className="h-3.5 w-3.5" /> {table2 ? "Lihat grafik" : "Lihat tabel"}
              </button>
            )}
          </div>
          {!hasTasks ? (
            <div className="mt-4">
              <EmptyState icon="ClipboardList" title="Belum ada tugas dalam 4 minggu terakhir" action={<LinkButton href="/app/tugas" size="sm">Ke Tugas & Jadwal</LinkButton>} />
            </div>
          ) : table2 ? (
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs text-slate-500"><tr><th className="py-2">Minggu</th><th className="py-2 text-right">Selesai</th><th className="py-2 text-right">Belum</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {r.tasks.weeks.map((w) => <tr key={w.label}><td className="py-2">{w.label}</td><td className="py-2 text-right font-semibold">{w.selesai}</td><td className="py-2 text-right">{w.belum}</td></tr>)}
              </tbody>
            </table>
          ) : (
            <div className="mt-4 h-56" role="img" aria-label={`Tugas per minggu: ${r.tasks.weeks.map((w) => `${w.label} ${w.selesai} selesai, ${w.belum} belum`).join("; ")}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={r.tasks.weeks} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={AXIS} />
                  <Tooltip cursor={{ fill: "#F1F4FA" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: "#475569" }}>{v}</span>} />
                  <Bar dataKey="selesai" name="Selesai" stackId="t" fill={NAVY} maxBarSize={36} stroke="#fff" strokeWidth={2} />
                  <Bar dataKey="belum" name="Belum selesai" stackId="t" fill={MUTED} radius={[4, 4, 0, 0]} maxBarSize={36} stroke="#fff" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-emerald-50 p-2"><CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" /><p className="mt-1 font-bold text-ink">{r.tasks.onTime}</p><p className="text-slate-500">tepat waktu</p></div>
            <div className="rounded-xl bg-amber-50 p-2"><Clock className="mx-auto h-4 w-4 text-amber-600" /><p className="mt-1 font-bold text-ink">{r.tasks.late}</p><p className="text-slate-500">selesai terlambat</p></div>
            <div className="rounded-xl bg-red-50 p-2"><ListChecks className="mx-auto h-4 w-4 text-red-600" /><p className="mt-1 font-bold text-ink">{r.tasks.overdueOpen}</p><p className="text-slate-500">masih terlewat</p></div>
          </div>
        </Card>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Semua angka dihitung dari aktivitasmu yang tersimpan di perangkat ini. Lihat juga <Link href="/app/pencapaian" className="font-semibold text-marun-700 hover:underline">Streak & Pencapaian</Link>.
      </p>
    </div>
  );
}
