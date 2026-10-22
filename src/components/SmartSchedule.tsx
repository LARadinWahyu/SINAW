"use client";

import { useMemo, useState } from "react";
import { CalendarCheck2, CheckCircle2, Info, RefreshCw, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Input, LinkButton, Select, Toggle } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import { DAY_NAMES, defaultPref, generateSchedule, sessionsToTasks, type PlannedSession } from "@/lib/schedule";
import type { SchedulePref } from "@/lib/types";
import { cx, formatTanggal } from "@/lib/utils";

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Senin → Minggu

export function SmartSchedule({ onSaved }: { onSaved: () => void }) {
  const { data } = useSession();
  const d = data!;
  const { materials, subjects } = useStore((s) => s.content);
  const saveSchedulePref = useStore((s) => s.saveSchedulePref);
  const addTasksBulk = useStore((s) => s.addTasksBulk);
  const [pref, setPref] = useState<SchedulePref>(() => d.schedulePref ?? defaultPref(d));
  const [plan, setPlan] = useState<ReturnType<typeof generateSchedule> | null>(null);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(0);
  const [err, setErr] = useState("");

  const sessions = useMemo(() => (plan ? plan.sessions.filter((s) => !removed.has(s.key)) : []), [plan, removed]);
  const byDate = useMemo(() => {
    const m: Record<string, PlannedSession[]> = {};
    sessions.forEach((s) => (m[s.date] ??= []).push(s));
    return Object.entries(m);
  }, [sessions]);
  const totalMin = sessions.reduce((a, s) => a + s.minutes, 0);

  function generate() {
    if (!pref.days.length) return setErr("Pilih minimal satu hari belajar.");
    if (!pref.start) return setErr("Isi jam mulai belajar.");
    setErr("");
    setSaved(0);
    setRemoved(new Set());
    saveSchedulePref(pref);
    setPlan(generateSchedule(pref, materials, subjects, d));
  }

  function save() {
    addTasksBulk(sessionsToTasks(sessions));
    setSaved(sessions.length);
    setPlan(null);
    onSaved();
  }

  const toggleDay = (n: number) => setPref((p) => ({ ...p, days: p.days.includes(n) ? p.days.filter((x) => x !== n) : [...p.days, n] }));

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <Card className="h-fit p-5">
        <h2 className="flex items-center gap-2 font-bold"><Wand2 className="h-5 w-5 text-marun-600" /> Atur waktu luangmu</h2>
        <p className="mt-1 text-sm text-slate-500">SINAU akan menyusun sesi belajar mengikuti jalur belajarmu (hasil pretest & jurusan).</p>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold">Hari belajar</legend>
          <div className="flex flex-wrap gap-1.5">
            {ORDER.map((n) => (
              <button key={n} type="button" aria-pressed={pref.days.includes(n)} onClick={() => toggleDay(n)} className={cx("h-10 w-12 rounded-xl text-sm font-bold transition", pref.days.includes(n) ? "bg-marun-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                {DAY_NAMES[n].slice(0, 3)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Jam mulai" htmlFor="ss-start">
            <Input id="ss-start" type="time" value={pref.start} onChange={(e) => setPref({ ...pref, start: e.target.value })} />
          </Field>
          <Field label="Durasi sesi" htmlFor="ss-min">
            <Select id="ss-min" value={pref.sessionMin} onChange={(e) => setPref({ ...pref, sessionMin: Number(e.target.value) })}>
              {[15, 20, 25, 30, 45, 60, 90].map((m) => <option key={m} value={m}>{m} menit</option>)}
            </Select>
          </Field>
          <Field label="Sesi per hari" htmlFor="ss-per">
            <Select id="ss-per" value={pref.sessionsPerDay} onChange={(e) => setPref({ ...pref, sessionsPerDay: Number(e.target.value) })}>
              {[1, 2, 3].map((m) => <option key={m} value={m}>{m} sesi</option>)}
            </Select>
          </Field>
          <Field label="Rentang" htmlFor="ss-weeks">
            <Select id="ss-weeks" value={pref.weeks} onChange={(e) => setPref({ ...pref, weeks: Number(e.target.value) })}>
              {[1, 2, 3, 4].map((m) => <option key={m} value={m}>{m} minggu</option>)}
            </Select>
          </Field>
        </div>
        <div className="mt-2 border-t border-slate-100">
          <Toggle id="ss-review" checked={pref.includeReview} onChange={(v) => setPref({ ...pref, includeReview: v })} label="Sesi pengulangan" desc="Tambahkan sesi review setiap 3 materi" />
        </div>
        <p className="text-xs text-slate-500">
          Rata-rata ±{Math.round((pref.days.length * pref.sessionsPerDay * pref.sessionMin) / 7)} menit/hari · target profilmu {d.profile.dailyMinutes} menit/hari
        </p>
        {err && <p className="mt-3 text-sm text-red-600" role="alert">{err}</p>}
        <Button className="mt-4 w-full" onClick={generate}>
          {plan ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} {plan ? "Susun ulang" : "Susun jadwal"}
        </Button>
      </Card>

      <div>
        {saved > 0 && !plan && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200" role="status">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="flex-1"><b>{saved} sesi</b> ditambahkan ke To-Do List lengkap dengan pengingat.</p>
          </div>
        )}
        {!plan ? (
          <EmptyState icon="CalendarDays" title="Belum ada jadwal yang disusun" desc="Pilih hari dan jam luangmu, lalu klik “Susun jadwal”. Kamu bisa meninjau dan menghapus sesi sebelum menyimpannya." />
        ) : sessions.length === 0 ? (
          <EmptyState
            icon="Award"
            title={plan.totalMaterials === 0 ? "Tidak ada materi yang perlu dijadwalkan" : "Tidak ada slot yang tersedia"}
            desc={
              plan.totalMaterials === 0
                ? plan.skippedAlreadyPlanned > 0
                  ? "Semua materi di jalur belajarmu sudah ada di To-Do List atau sudah selesai."
                  : "Semua materi di jalur belajarmu sudah selesai. Coba tambah bidang di Profil."
                : "Tambah hari belajar, rentang minggu, atau ubah jam mulai."
            }
            action={<LinkButton href="/app/belajar" size="sm">Ke Pusat Belajar</LinkButton>}
          />
        ) : (
          <>
            <Card className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm">
              <span><b>{sessions.length}</b> sesi</span>
              <span><b>{Math.round(totalMin / 60 * 10) / 10}</b> jam belajar</span>
              <span><b>{new Set(sessions.filter((s) => s.materialId).map((s) => s.materialId)).size}</b> materi</span>
              <Button size="sm" className="ml-auto" onClick={save}><CalendarCheck2 className="h-4 w-4" /> Simpan ke To-Do</Button>
            </Card>
            {(plan.unscheduled > 0 || plan.skippedAlreadyPlanned > 0 || plan.conflicts > 0) && (
              <p className="mb-4 flex gap-2 rounded-xl bg-navy-50 p-3 text-xs text-navy-800">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                  {plan.unscheduled > 0 && `${plan.unscheduled} sesi belum muat dalam rentang ini — tambah hari/minggu untuk menjadwalkannya. `}
                  {plan.skippedAlreadyPlanned > 0 && `${plan.skippedAlreadyPlanned} materi dilewati karena sudah ada di To-Do. `}
                  {plan.conflicts > 0 && "Beberapa sesi digeser agar tidak bentrok dengan tugas lain."}
                </span>
              </p>
            )}
            <ol className="space-y-4">
              {byDate.map(([date, list]) => (
                <li key={date}>
                  <p className="mb-2 text-sm font-bold text-slate-600">{formatTanggal(date, true)}</p>
                  <ul className="space-y-2">
                    {list.map((s) => (
                      <li key={s.key} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                        <span className="w-14 shrink-0 text-center text-sm font-extrabold text-marun-700">{s.time}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{s.title}</p>
                          <p className="truncate text-xs text-slate-500">{subjects.find((x) => x.id === s.category)?.name} · {s.minutes} menit</p>
                        </div>
                        {s.kind === "ulang" && <Badge tone="navy">Review</Badge>}
                        <button onClick={() => setRemoved(new Set(removed).add(s.key))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Hapus sesi ${s.title}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
