"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Accessibility, Bell, BookOpen, Check, LogOut, RotateCcw, Save, SlidersHorizontal, UserRound } from "lucide-react";
import { Badge, Button, Card, Field, Input, Modal, PageHeader, ProgressBar, Select, Toggle } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { useSession, useStore } from "@/lib/store";
import { computeStreak } from "@/lib/streak";
import { latestPretest, progressStats } from "@/lib/recommend";
import type { UserCategory, UserProfile } from "@/lib/types";
import { cx } from "@/lib/utils";
import { LEAD_OPTIONS } from "@/lib/deadline";

const STATUS: Record<UserCategory, string> = { siswa: "Siswa SMA/SMK", calon: "Calon mahasiswa", maba: "Mahasiswa baru" };
const EDU = ["SMA / MA", "SMK", "Lulusan SMA/SMK (gap year)", "Mahasiswa D3/D4", "Mahasiswa S1"];

export default function Profil() {
  const router = useRouter();
  const { user, data } = useSession();
  const { subjects, materials } = useStore((s) => s.content);
  const { saveProfile, saveSettings, updateAccount, logout, deleteAccountData } = useStore();
  const d = data!;
  const [name, setName] = useState(user!.name);
  const [pref, setPref] = useState<UserProfile>(d.profile);
  const [saved, setSaved] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [perm, setPerm] = useState<string>("default");

  useEffect(() => {
    setPerm(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  }, []);
  const flash = (k: string) => {
    setSaved(k);
    setTimeout(() => setSaved(""), 2000);
  };

  const prog = progressStats(materials, subjects, d);
  const st = computeStreak(d.activity, d.settings.dailyTarget);
  const pt = latestPretest(d);
  const s = d.settings;

  const toggleArr = (k: "majors" | "focusSubjects", v: string, max = 99) =>
    setPref((p) => {
      const has = p[k].includes(v);
      if (!has && p[k].length >= max) return p;
      return { ...p, [k]: has ? p[k].filter((x) => x !== v) : [...p[k], v] };
    });

  const chip = (active: boolean) => cx("rounded-full border px-3 py-1.5 text-sm font-semibold transition", active ? "border-marun-600 bg-marun-50 text-marun-700" : "border-slate-200 bg-white text-slate-600 hover:border-marun-200");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Profil & Pengaturan" desc="Perbarui data diri, preferensi belajar, notifikasi, dan aksesibilitas." />

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-700 text-2xl font-extrabold text-white">{user!.name.slice(0, 1).toUpperCase()}</span>
        <div className="flex-1">
          <p className="text-xl font-extrabold">{user!.name}</p>
          <p className="text-sm text-slate-500">{user!.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="marun">{STATUS[d.profile.status]}</Badge>
            {d.profile.education && <Badge>{d.profile.education}</Badge>}
            {user!.role === "admin" && <Badge tone="navy">Admin</Badge>}
            {user!.isDemo && <Badge tone="amber">Akun demo</Badge>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center sm:w-72">
          <div className="rounded-xl bg-canvas p-2"><p className="text-lg font-extrabold">{prog.pct}%</p><p className="text-[11px] text-slate-500">Materi</p></div>
          <div className="rounded-xl bg-canvas p-2"><p className="text-lg font-extrabold">{st.current}</p><p className="text-[11px] text-slate-500">Streak</p></div>
          <div className="rounded-xl bg-canvas p-2"><p className="text-lg font-extrabold">{pt ? pt.score : "—"}</p><p className="text-[11px] text-slate-500">Pretest</p></div>
        </div>
      </Card>

      {/* Akun */}
      <Card as="section" className="mt-6 p-6">
        <h2 className="flex items-center gap-2 font-bold"><UserRound className="h-5 w-5 text-marun-600" /> Data akun</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nama pengguna" htmlFor="p-name">
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email" htmlFor="p-email" hint={user!.campusEmail ? "Domain kampus terdeteksi (simulasi, belum diverifikasi)." : "Email tidak dapat diubah di mode demo."}>
            <Input id="p-email" value={user!.email} readOnly className="bg-slate-50 text-slate-500" />
          </Field>
        </div>
        <Button className="mt-4" size="sm" onClick={() => { updateAccount({ name }); flash("akun"); }} disabled={name.trim().length < 2}>
          {saved === "akun" ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved === "akun" ? "Tersimpan" : "Simpan"}
        </Button>
      </Card>

      {/* Preferensi belajar */}
      <Card as="section" className="mt-6 p-6">
        <h2 className="flex items-center gap-2 font-bold"><SlidersHorizontal className="h-5 w-5 text-marun-600" /> Preferensi belajar</h2>
        <p className="mt-1 text-sm text-slate-500">Perubahan di sini memengaruhi rekomendasi materi, soal pretest, dan isi dashboard.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Jenjang pendidikan" htmlFor="p-edu">
            <Select id="p-edu" value={pref.education} onChange={(e) => setPref({ ...pref, education: e.target.value })}>
              {EDU.map((x) => <option key={x}>{x}</option>)}
            </Select>
          </Field>
          <Field label="Status" htmlFor="p-status">
            <Select id="p-status" value={pref.status} onChange={(e) => setPref({ ...pref, status: e.target.value as UserCategory })}>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Target belajar per hari" htmlFor="p-min">
            <Select id="p-min" value={pref.dailyMinutes} onChange={(e) => setPref({ ...pref, dailyMinutes: Number(e.target.value) })}>
              {[15, 30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} menit</option>)}
            </Select>
          </Field>
          <Field label="Waktu belajar favorit" htmlFor="p-time">
            <Select id="p-time" value={pref.studyTime} onChange={(e) => setPref({ ...pref, studyTime: e.target.value })}>
              <option value="pagi">Pagi</option>
              <option value="siang">Siang/Sore</option>
              <option value="malam">Malam</option>
            </Select>
          </Field>
        </div>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold">Bidang studi yang diminati (maks. 3)</legend>
          <div className="flex flex-wrap gap-2">
            {MAJOR_OPTIONS.map((m) => (
              <button key={m.id} type="button" aria-pressed={pref.majors.includes(m.id)} onClick={() => toggleArr("majors", m.id, 3)} className={chip(pref.majors.includes(m.id))}>{m.name}</button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold">Materi yang ingin dikuasai</legend>
          <div className="flex flex-wrap gap-2">
            {subjects.map((x) => (
              <button key={x.id} type="button" aria-pressed={pref.focusSubjects.includes(x.id)} onClick={() => toggleArr("focusSubjects", x.id)} className={chip(pref.focusSubjects.includes(x.id))}>{x.name}</button>
            ))}
          </div>
        </fieldset>
        <Button className="mt-5" size="sm" disabled={!pref.majors.length || !pref.focusSubjects.length} onClick={() => { saveProfile(pref); flash("pref"); }}>
          {saved === "pref" ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved === "pref" ? "Preferensi tersimpan" : "Simpan preferensi"}
        </Button>
        {(!pref.majors.length || !pref.focusSubjects.length) && <p className="mt-2 text-xs text-red-600">Pilih minimal satu bidang studi dan satu materi.</p>}
      </Card>

      {/* Notifikasi */}
      <Card as="section" className="mt-6 scroll-mt-24 p-6">
        <span id="notifikasi" className="block scroll-mt-24" />
        <h2 className="flex items-center gap-2 font-bold"><Bell className="h-5 w-5 text-marun-600" /> Notifikasi & pengingat</h2>
        <div className="mt-2 divide-y divide-slate-100">
          <Toggle id="n-rem" checked={s.reminders} onChange={(v) => saveSettings({ reminders: v })} label="Pengingat belajar harian" desc="Tampilkan pengingat di aplikasi jika target harian belum tercapai setelah jam yang ditentukan." />
          {s.reminders && (
            <div className="flex items-center justify-between gap-4 py-3">
              <label htmlFor="n-time" className="text-sm font-semibold">Jam pengingat</label>
              <Input id="n-time" type="time" value={s.reminderTime} onChange={(e) => saveSettings({ reminderTime: e.target.value })} className="w-32" />
            </div>
          )}
          <Toggle id="n-email" checked={s.emailNotif} onChange={(v) => saveSettings({ emailNotif: v })} label="Ringkasan via email" desc="Preferensi tersimpan, tetapi pengiriman email memerlukan backend (belum dikonfigurasi)." />
          <div className="flex items-center justify-between gap-4 py-3">
            <label htmlFor="n-lead" className="text-sm">
              <span className="block font-semibold">Ingatkan sebelum tenggat</span>
              <span className="block text-xs text-slate-500">Tugas berpengingat masuk ke lonceng & dashboard sejak waktu ini.</span>
            </label>
            <Select id="n-lead" value={s.deadlineLeadHours} onChange={(e) => saveSettings({ deadlineLeadHours: Number(e.target.value) })} className="w-36">
              {LEAD_OPTIONS.map((h) => <option key={h} value={h}>{h < 24 ? `${h} jam` : `${h / 24} hari`}</option>)}
            </Select>
          </div>
          <Toggle
            id="n-browser"
            checked={s.browserNotif && perm === "granted"}
            onChange={async (v) => {
              if (!v) return saveSettings({ browserNotif: false });
              if (typeof Notification === "undefined") return setPerm("unsupported");
              const r = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
              setPerm(r);
              saveSettings({ browserNotif: r === "granted" });
              if (r === "granted") new Notification("SINAU", { body: "Notifikasi tenggat aktif selama SINAU terbuka di browser ini." });
            }}
            label="Notifikasi browser"
            desc={
              perm === "denied"
                ? "Izin ditolak — ubah lewat pengaturan situs di browser."
                : perm === "unsupported"
                  ? "Browser ini tidak mendukung notifikasi."
                  : "Muncul saat SINAU terbuka. Notifikasi saat aplikasi tertutup memerlukan backend push (belum dikonfigurasi)."
            }
          />
        </div>
      </Card>

      {/* Aksesibilitas */}
      <Card as="section" className="mt-6 p-6">
        <h2 className="flex items-center gap-2 font-bold"><Accessibility className="h-5 w-5 text-marun-600" /> Aksesibilitas</h2>
        <div className="mt-2 divide-y divide-slate-100">
          <Toggle id="a-font" checked={s.fontScale === "besar"} onChange={(v) => saveSettings({ fontScale: v ? "besar" : "normal" })} label="Teks lebih besar" desc="Memperbesar ukuran teks di seluruh aplikasi." />
          <Toggle id="a-motion" checked={s.reduceMotion} onChange={(v) => saveSettings({ reduceMotion: v })} label="Kurangi animasi" desc="Menonaktifkan transisi dan animasi." />
          <Toggle id="a-contrast" checked={s.highContrast} onChange={(v) => saveSettings({ highContrast: v })} label="Kontras tinggi" desc="Mempertegas warna teks sekunder dan garis tepi." />
        </div>
      </Card>

      {/* Ringkasan progres */}
      <Card as="section" className="mt-6 p-6">
        <h2 className="flex items-center gap-2 font-bold"><BookOpen className="h-5 w-5 text-marun-600" /> Ringkasan progres</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {subjects.map((x) => {
            const ms = materials.filter((m) => m.subjectId === x.id);
            const done = ms.filter((m) => d.completed[m.id]).length;
            return (
              <li key={x.id}>
                <div className="flex justify-between"><span className="font-semibold">{x.name}</span><span className="text-slate-500">{done}/{ms.length}</span></div>
                <ProgressBar value={ms.length ? (done / ms.length) * 100 : 0} className="mt-1" tone="navy" label={`Progres ${x.name}`} />
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setConfirmReset(true)}><RotateCcw className="h-4 w-4" /> Reset data belajar</Button>
        <Button variant="danger" onClick={() => { logout(); router.replace("/"); }}><LogOut className="h-4 w-4" /> Keluar</Button>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset data belajar?">
        <p className="text-sm text-slate-600">Semua progres materi, hasil pretest, tugas, streak, dan riwayat NARA akan dihapus, lalu kamu akan diarahkan ke onboarding. Akun tetap ada.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmReset(false)}>Batal</Button>
          <Button variant="danger" onClick={() => { deleteAccountData(); setConfirmReset(false); }}>Reset</Button>
        </div>
      </Modal>
    </div>
  );
}
