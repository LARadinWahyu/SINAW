"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, CalendarDays, ChevronLeft, ChevronRight, Clock, List, Pencil, Plus, Search, Trash2, Wand2 } from "lucide-react";
import { SmartSchedule } from "@/components/SmartSchedule";
import { urgency } from "@/lib/deadline";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, ProgressBar, Select, Textarea, Toggle } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import type { Priority, Task, TaskStatus } from "@/lib/types";
import { addDays, cx, dayKey, formatRelatif, namaBulan, parseDay } from "@/lib/utils";

const STATUS: Record<TaskStatus, string> = { todo: "Belum dikerjakan", doing: "Sedang dikerjakan", done: "Selesai" };
const PRI_TONE = { tinggi: "marun", sedang: "amber", rendah: "slate" } as const;

export default function TugasPage() {
  return (
    <Suspense>
      <Tugas />
    </Suspense>
  );
}

function weekStart(key: string) {
  const d = parseDay(key);
  const diff = (d.getDay() + 6) % 7; // Senin
  return addDays(key, -diff);
}

function Tugas() {
  const params = useSearchParams();
  const { data } = useSession();
  const { subjects } = useStore((s) => s.content);
  const { setTaskStatus, deleteTask } = useStore();
  const d = data!;
  const today = dayKey();
  const [view, setView] = useState<"list" | "kalender" | "pintar">(() => (params.get("view") === "pintar" ? "pintar" : "list"));
  const [tab, setTab] = useState<"hari" | "mendatang" | "terlewat" | "selesai" | "semua">("hari");
  const [q, setQ] = useState("");
  const [fPri, setFPri] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState(today);

  useEffect(() => {
    if (params.get("baru") === "1") setOpen(true);
  }, [params]);

  const catName = (c: string) => (c === "umum" ? "Umum" : subjects.find((s) => s.id === c)?.name ?? c);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return d.tasks
      .filter((x) => {
        if (tab === "hari" && x.dueDate !== today) return false;
        if (tab === "mendatang" && (x.dueDate <= today || x.status === "done")) return false;
        if (tab === "terlewat" && (x.dueDate >= today || x.status === "done")) return false;
        if (tab === "selesai" && x.status !== "done") return false;
        if (fPri !== "all" && x.priority !== fPri) return false;
        if (fCat !== "all" && x.category !== fCat) return false;
        if (fStatus !== "all" && x.status !== fStatus) return false;
        if (t && !`${x.title} ${x.description}`.toLowerCase().includes(t)) return false;
        return true;
      })
      .sort((a, b) => Number(a.status === "done") - Number(b.status === "done") || (a.dueDate + a.dueTime).localeCompare(b.dueDate + b.dueTime));
  }, [d.tasks, tab, q, fPri, fCat, fStatus, today]);

  const counts = {
    hari: d.tasks.filter((x) => x.dueDate === today).length,
    mendatang: d.tasks.filter((x) => x.dueDate > today && x.status !== "done").length,
    terlewat: d.tasks.filter((x) => x.dueDate < today && x.status !== "done").length,
    selesai: d.tasks.filter((x) => x.status === "done").length,
    semua: d.tasks.length,
  };

  const todayTasks = d.tasks.filter((x) => x.dueDate === today);
  const todayDone = todayTasks.filter((x) => x.status === "done").length;
  const ws = weekStart(today);
  const weekTasks = d.tasks.filter((x) => x.dueDate >= ws && x.dueDate <= addDays(ws, 6));
  const weekDone = weekTasks.filter((x) => x.status === "done").length;

  return (
    <div>
      <PageHeader
        title="Tugas & Jadwal Belajar"
        desc="Kelola ritme belajar dan tenggat waktu akademikmu."
        actions={
          <Button onClick={() => { setEditing(null); setInitialDate(today); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Tambah Tugas
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-bold">Progres hari ini</p>
          <p className="mt-1 text-sm text-slate-500">{todayTasks.length ? `${todayDone} dari ${todayTasks.length} selesai` : "Belum ada tugas untuk hari ini"}</p>
          <ProgressBar value={todayTasks.length ? (todayDone / todayTasks.length) * 100 : 0} className="mt-3" label="Progres hari ini" />
        </Card>
        <Card className="p-5">
          <p className="text-sm font-bold">Progres minggu ini</p>
          <p className="mt-1 text-sm text-slate-500">{weekTasks.length ? `${weekDone} dari ${weekTasks.length} selesai (Senin–Minggu)` : "Belum ada tugas minggu ini"}</p>
          <ProgressBar value={weekTasks.length ? (weekDone / weekTasks.length) * 100 : 0} className="mt-3" tone="navy" label="Progres minggu ini" />
        </Card>
      </div>
      <p className="mt-3 text-xs text-slate-500">💡 Menyelesaikan tugas dihitung sebagai aktivitas belajar untuk daily streak.</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Tampilan">
          {([["list", "Daftar", List], ["kalender", "Kalender", CalendarDays], ["pintar", "Smart Schedule", Wand2]] as const).map(([v, l, I]) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cx("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold", view === v ? "bg-white text-marun-700 shadow-sm" : "text-slate-500")}>
              <I className="h-4 w-4" /> {l}
            </button>
          ))}
        </div>
      </div>

      {view === "pintar" ? (
        <SmartSchedule onSaved={() => setTab("mendatang")} />
      ) : view === "kalender" ? (
        <CalendarView tasks={d.tasks} onPick={(k) => { setEditing(null); setInitialDate(k); setOpen(true); }} onEdit={(t) => { setEditing(t); setOpen(true); }} />
      ) : (
        <>
          <div className="scrollbar-none -mx-4 mt-4 flex gap-1 overflow-x-auto border-b border-slate-200 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter waktu">
            {([["hari", "Hari ini"], ["mendatang", "Mendatang"], ["terlewat", "Terlewat"], ["selesai", "Selesai"], ["semua", "Semua"]] as const).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cx("-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-bold", tab === k ? "border-marun-700 text-marun-700" : "border-transparent text-slate-500 hover:text-ink")}>
                {l} <span className={cx("ml-1 rounded-full px-1.5 text-xs", k === "terlewat" && counts.terlewat ? "bg-red-100 text-red-600" : "bg-slate-100")}>{counts[k]}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <label htmlFor="cari-tugas" className="sr-only">Cari tugas</label>
              <Input id="cari-tugas" placeholder="Cari tugas…" value={q} onChange={(e) => setQ(e.target.value)} className="py-2 pl-9" />
            </div>
            <Select aria-label="Filter prioritas" value={fPri} onChange={(e) => setFPri(e.target.value)} className="py-2">
              <option value="all">Semua prioritas</option>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </Select>
            <Select aria-label="Filter kategori" value={fCat} onChange={(e) => setFCat(e.target.value)} className="py-2">
              <option value="all">Semua kategori</option>
              <option value="umum">Umum</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <Select aria-label="Filter status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="py-2">
              <option value="all">Semua status</option>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>

          <div className="mt-4">
            {filtered.length === 0 ? (
              <EmptyState
                icon="ClipboardList"
                title={d.tasks.length === 0 ? "Belum ada tugas" : "Tidak ada tugas yang cocok"}
                desc={d.tasks.length === 0 ? "Tambahkan tugas atau sesi belajar pertamamu untuk mulai membangun rutinitas." : "Ubah tab atau filter untuk melihat tugas lainnya."}
                action={<Button size="sm" onClick={() => { setEditing(null); setInitialDate(today); setOpen(true); }}><Plus className="h-4 w-4" /> Tambah Tugas</Button>}
              />
            ) : (
              <ul className="space-y-2">
                {filtered.map((t) => {
                  const overdue = t.dueDate < today && t.status !== "done";
                  const u = urgency(t);
                  return (
                    <li key={t.id}>
                      <Card className="flex items-start gap-3 p-4">
                        <input type="checkbox" checked={t.status === "done"} onChange={() => setTaskStatus(t.id, t.status === "done" ? "todo" : "done")} className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-marun-700" aria-label={`Tandai “${t.title}” ${t.status === "done" ? "belum selesai" : "selesai"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">{catName(t.category)}</span>
                            <Badge tone={PRI_TONE[t.priority]}>Prioritas {t.priority}</Badge>
                            {t.reminder && <Bell className="h-3.5 w-3.5 text-slate-400" aria-label="Pengingat aktif" />}
                            {u.tone && <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-bold", u.tone === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>⏰ {u.label}</span>}
                          </div>
                          <p className={cx("mt-1 font-bold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</p>
                          {t.description && <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{t.description}</p>}
                          <p className={cx("mt-1.5 flex items-center gap-1 text-xs", overdue ? "font-bold text-red-600" : "text-slate-500")}>
                            <Clock className="h-3.5 w-3.5" /> {overdue && "Terlewat · "}{formatRelatif(t.dueDate)}, {t.dueTime}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                          <Select aria-label="Ubah status" value={t.status} onChange={(e) => setTaskStatus(t.id, e.target.value as TaskStatus)} className="w-auto py-1.5 text-xs">
                            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </Select>
                          <div className="flex">
                            <button onClick={() => { setEditing(t); setOpen(true); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={`Ubah ${t.title}`}><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => setToDelete(t)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Hapus ${t.title}`}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {open && <TaskForm open onClose={() => setOpen(false)} task={editing} initialDate={initialDate} />}
      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Hapus tugas?">
        <p className="text-sm text-slate-600">“{toDelete?.title}” akan dihapus permanen.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setToDelete(null)}>Batal</Button>
          <Button variant="danger" onClick={() => { deleteTask(toDelete!.id); setToDelete(null); }}>Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}

function TaskForm({ open, onClose, task, initialDate }: { open: boolean; onClose: () => void; task: Task | null; initialDate: string }) {
  const { subjects, materials } = useStore((s) => s.content);
  const addTask = useStore((s) => s.addTask);
  const updateTask = useStore((s) => s.updateTask);
  const setTaskStatus = useStore((s) => s.setTaskStatus);
  const blank = { title: "", description: "", dueDate: initialDate, dueTime: "19:00", priority: "sedang" as Priority, category: "umum", materialId: "", reminder: true, status: "todo" as TaskStatus };
  // komponen di-mount ulang setiap kali modal dibuka, jadi state awal selalu bersih
  const [f, setF] = useState(() => (task ? { ...task, materialId: task.materialId ?? "" } : blank));
  const [err, setErr] = useState<Record<string, string>>({});

  function save(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.title.trim().length < 3) er.title = "Judul minimal 3 karakter.";
    if (!f.dueDate) er.dueDate = "Tanggal tenggat wajib diisi.";
    if (!f.dueTime) er.dueTime = "Jam wajib diisi.";
    setErr(er);
    if (Object.keys(er).length) return;
    const payload = { title: f.title.trim(), description: f.description.trim(), dueDate: f.dueDate, dueTime: f.dueTime, priority: f.priority, category: f.category, materialId: f.materialId || undefined, reminder: f.reminder };
    if (task) {
      updateTask(task.id, payload);
      if (f.status !== task.status) setTaskStatus(task.id, f.status);
    } else addTask({ ...payload, status: f.status });
    onClose();
  }

  const mats = materials.filter((m) => f.category === "umum" || m.subjectId === f.category);

  return (
    <Modal open={open} onClose={onClose} title={task ? "Ubah Tugas" : "Tambah Tugas"}>
      <form onSubmit={save} noValidate className="space-y-4">
        <Field label="Judul tugas" htmlFor="t-title" error={err.title}>
          <Input id="t-title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Contoh: Latihan 5 soal limit" aria-invalid={!!err.title} />
        </Field>
        <Field label="Deskripsi (opsional)" htmlFor="t-desc">
          <Textarea id="t-desc" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Catatan singkat…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tanggal tenggat" htmlFor="t-date" error={err.dueDate}>
            <Input id="t-date" type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} aria-invalid={!!err.dueDate} />
          </Field>
          <Field label="Jam" htmlFor="t-time" error={err.dueTime}>
            <Input id="t-time" type="time" value={f.dueTime} onChange={(e) => setF({ ...f, dueTime: e.target.value })} />
          </Field>
          <Field label="Prioritas" htmlFor="t-pri">
            <Select id="t-pri" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor="t-status">
            <Select id="t-status" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as TaskStatus })}>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Kategori" htmlFor="t-cat">
            <Select id="t-cat" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value, materialId: "" })}>
              <option value="umum">Umum</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="Materi terkait" htmlFor="t-mat">
            <Select id="t-mat" value={f.materialId} onChange={(e) => setF({ ...f, materialId: e.target.value })}>
              <option value="">— Tidak ada —</option>
              {mats.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </Select>
          </Field>
        </div>
        <Toggle id="t-rem" checked={f.reminder} onChange={(v) => setF({ ...f, reminder: v })} label="Pengingat" desc="Masuk ke lonceng notifikasi &amp; dashboard saat tenggat mendekat" />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit">{task ? "Simpan Perubahan" : "Tambah Tugas"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function CalendarView({ tasks, onPick, onEdit }: { tasks: Task[]; onPick: (k: string) => void; onEdit: (t: Task) => void }) {
  const today = dayKey();
  const [cursor, setCursor] = useState(() => { const n = new Date(); return { y: n.getFullYear(), m: n.getMonth() }; });
  const first = new Date(cursor.y, cursor.m, 1);
  const startKey = addDays(dayKey(first), -((first.getDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, i) => addDays(startKey, i));
  const [sel, setSel] = useState(today);
  const byDay = useMemo(() => {
    const m: Record<string, Task[]> = {};
    tasks.forEach((t) => (m[t.dueDate] ??= []).push(t));
    return m;
  }, [tasks]);
  const move = (n: number) => setCursor((c) => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const selTasks = (byDay[sel] ?? []).sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => move(-1)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Bulan sebelumnya"><ChevronLeft className="h-5 w-5" /></button>
          <p className="font-bold">{namaBulan(cursor.m)} {cursor.y}</p>
          <button onClick={() => move(1)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Bulan berikutnya"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((h) => <div key={h} className="py-1">{h}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((k) => {
            const inMonth = parseDay(k).getMonth() === cursor.m;
            const list = byDay[k] ?? [];
            return (
              <button key={k} onClick={() => setSel(k)} aria-pressed={sel === k} aria-label={`${k}, ${list.length} tugas`} className={cx("flex min-h-[56px] flex-col items-center rounded-xl p-1 text-sm transition sm:min-h-[72px]", sel === k ? "bg-marun-700 text-white" : k === today ? "bg-marun-50 font-bold text-marun-700" : "hover:bg-slate-50", !inMonth && sel !== k && "text-slate-300")}>
                <span>{parseDay(k).getDate()}</span>
                <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {list.slice(0, 3).map((t) => (
                    <span key={t.id} className={cx("h-1.5 w-1.5 rounded-full", sel === k ? "bg-white" : t.status === "done" ? "bg-emerald-500" : t.priority === "tinggi" ? "bg-marun-600" : "bg-navy-500")} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold">{formatRelatif(sel)}</p>
          <Button size="sm" variant="secondary" onClick={() => onPick(sel)}><Plus className="h-4 w-4" /> Tambah</Button>
        </div>
        {selTasks.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Tidak ada jadwal di tanggal ini.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selTasks.map((t) => (
              <li key={t.id}>
                <button onClick={() => onEdit(t)} className="w-full rounded-xl bg-canvas p-3 text-left hover:bg-marun-50">
                  <p className={cx("text-sm font-semibold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</p>
                  <p className="text-xs text-slate-500">{t.dueTime} · {STATUS[t.status]}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
