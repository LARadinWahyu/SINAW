"use client";

import { useMemo, useState } from "react";
import { Database, Pencil, Plus, RotateCcw, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Input, LinkButton, Modal, PageHeader, Select, Textarea } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { useSession, useStore, type ContentKey } from "@/lib/store";
import type { LearningMaterial, MaterialSection, PretestQuestion, QuizQuestion } from "@/lib/types";
import { cx, uid } from "@/lib/utils";
import { youtubeId } from "@/lib/video";

/**
 * PANEL ADMIN — MODE DEMO
 * Otorisasi saat ini dicek di sisi klien (role "admin" pada akun demo) + di setiap aksi store.
 * Ini BUKAN perlindungan produksi. Untuk produksi, gunakan Supabase Auth + Row Level Security
 * (lihat supabase/schema.sql) sehingga hanya admin yang bisa menulis tabel konten di server.
 */

type FieldDef = { key: string; label: string; type: "text" | "textarea" | "number" | "select" | "list" | "check"; options?: { v: string; l: string }[]; required?: boolean; hint?: string };
type SimpleKey = Exclude<ContentKey, "materials" | "pretest">;

const ICON_OPTS = ["Sigma", "BarChart3", "Brain", "Code2", "GraduationCap", "TrendingUp", "Microscope", "BookOpen", "Calculator", "Languages", "Globe", "Scale", "Palette", "Briefcase", "Users"].map((v) => ({ v, l: v }));

const SIMPLE: Record<SimpleKey, { label: string; title: (x: Record<string, unknown>) => string; sub: (x: Record<string, unknown>) => string; fields: FieldDef[]; blank: () => Record<string, unknown> }> = {
  subjects: {
    label: "Kategori Mata Pelajaran",
    title: (x) => String(x.name),
    sub: (x) => String(x.description),
    fields: [
      { key: "name", label: "Nama bidang", type: "text", required: true },
      { key: "description", label: "Deskripsi", type: "textarea", required: true },
      { key: "icon", label: "Ikon", type: "select", options: ICON_OPTS },
      { key: "color", label: "Warna (hex)", type: "text", hint: "Contoh: #9B0A0A" },
      { key: "majors", label: "Jurusan relevan (id, pisahkan koma; * = semua)", type: "list", hint: MAJOR_OPTIONS.map((m) => m.id).join(", ") },
    ],
    blank: () => ({ id: uid(), name: "", description: "", icon: "BookOpen", color: "#1B3163", majors: ["*"] }),
  },
  majors: {
    label: "Informasi Jurusan",
    title: (x) => String(x.name),
    sub: (x) => `${x.cluster} · ${(x.careers as string[]).length} prospek karier`,
    fields: [
      { key: "name", label: "Nama jurusan", type: "text", required: true },
      { key: "cluster", label: "Rumpun", type: "select", options: [{ v: "Saintek", l: "Saintek" }, { v: "Soshum", l: "Soshum" }] },
      { key: "description", label: "Deskripsi", type: "textarea", required: true },
      { key: "subjects", label: "Mata kuliah (pisahkan koma)", type: "list" },
      { key: "careers", label: "Prospek karier (pisahkan koma)", type: "list" },
      { key: "demo", label: "Tandai sebagai konten contoh", type: "check" },
    ],
    blank: () => ({ id: uid(), name: "", cluster: "Saintek", description: "", subjects: [], careers: [], demo: false }),
  },
  articles: {
    label: "Artikel Career Lounge",
    title: (x) => String(x.title),
    sub: (x) => `${x.category} · ${x.minutes} menit`,
    fields: [
      { key: "title", label: "Judul", type: "text", required: true },
      { key: "category", label: "Kategori", type: "select", options: ["Budaya Kampus", "Persiapan Kuliah", "Minat & Jurusan", "Karier"].map((v) => ({ v, l: v })) },
      { key: "summary", label: "Ringkasan", type: "text", required: true },
      { key: "body", label: "Isi (pisahkan paragraf dengan baris kosong)", type: "textarea", required: true },
      { key: "minutes", label: "Estimasi baca (menit)", type: "number" },
      { key: "demo", label: "Tandai sebagai konten contoh", type: "check" },
    ],
    blank: () => ({ id: uid(), title: "", category: "Persiapan Kuliah", summary: "", body: "", minutes: 5, demo: false }),
  },
  scholarships: {
    label: "Informasi Beasiswa",
    title: (x) => String(x.name),
    sub: (x) => `${x.provider} · ${x.verified ? "terverifikasi" : "belum terverifikasi"}`,
    fields: [
      { key: "name", label: "Nama beasiswa", type: "text", required: true },
      { key: "provider", label: "Penyelenggara", type: "text", required: true },
      { key: "description", label: "Deskripsi & syarat", type: "textarea", required: true },
      { key: "link", label: "Tautan resmi (https://…)", type: "text" },
      { key: "verified", label: "Data sudah diverifikasi dari sumber resmi", type: "check" },
    ],
    blank: () => ({ id: uid(), name: "", provider: "", description: "", link: "", verified: false }),
  },
  mentors: {
    label: "Data Mentor & Alumni",
    title: (x) => String(x.name),
    sub: (x) => `${x.role} · ${x.major}`,
    fields: [
      { key: "name", label: "Nama", type: "text", required: true },
      { key: "role", label: "Peran (alumni/dosen/mentor)", type: "text", required: true },
      { key: "major", label: "Bidang/jurusan", type: "text" },
      { key: "bio", label: "Bio singkat", type: "textarea" },
      { key: "verified", label: "Sudah diverifikasi & bersedia ditampilkan", type: "check" },
    ],
    blank: () => ({ id: uid(), name: "", role: "", major: "", bio: "", verified: false }),
  },
  universities: {
    label: "Data Kampus",
    title: (x) => String(x.name),
    sub: (x) => `${x.type} · ${x.city}, ${x.province} · ${(x.clusters as string[]).length} rumpun`,
    fields: [
      { key: "name", label: "Nama perguruan tinggi", type: "text", required: true },
      { key: "short", label: "Singkatan", type: "text", required: true },
      { key: "type", label: "Jenis", type: "select", options: [{ v: "PTN", l: "PTN" }, { v: "PTS", l: "PTS" }] },
      { key: "city", label: "Kota/Kabupaten", type: "text", required: true },
      { key: "province", label: "Provinsi", type: "text", required: true },
      { key: "island", label: "Wilayah", type: "select", options: ["Jawa", "Sumatra", "Sulawesi", "Kalimantan", "Bali & Nusa Tenggara", "Papua & Maluku"].map((v) => ({ v, l: v })) },
      { key: "clusters", label: "Rumpun jurusan tersedia (id, pisahkan koma)", type: "list", hint: MAJOR_OPTIONS.map((m) => m.id).join(", ") },
      { key: "website", label: "Situs resmi (https://…)", type: "text" },
      { key: "verified", label: "Data sudah diverifikasi dari situs resmi", type: "check" },
    ],
    blank: () => ({ id: uid(), name: "", short: "", type: "PTN", city: "", province: "", island: "Jawa", clusters: [], website: "", verified: false }),
  },
  events: {
    label: "Sharing Session",
    title: (x) => String(x.title),
    sub: (x) => `${x.date} ${x.time} · ${x.speaker}`,
    fields: [
      { key: "title", label: "Judul sesi", type: "text", required: true },
      { key: "speaker", label: "Narasumber", type: "text", required: true },
      { key: "date", label: "Tanggal (YYYY-MM-DD)", type: "text", required: true },
      { key: "time", label: "Jam (HH:mm)", type: "text" },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "link", label: "Tautan pendaftaran/meeting (https://…)", type: "text" },
      { key: "verified", label: "Narasumber & jadwal sudah dikonfirmasi", type: "check" },
    ],
    blank: () => ({ id: uid(), title: "", speaker: "", date: new Date().toISOString().slice(0, 10), time: "19:00", description: "", link: "", verified: false }),
  },
  announcements: {
    label: "Pengumuman",
    title: (x) => String(x.title),
    sub: (x) => String(x.date),
    fields: [
      { key: "title", label: "Judul", type: "text", required: true },
      { key: "body", label: "Isi", type: "textarea", required: true },
      { key: "date", label: "Tanggal (YYYY-MM-DD)", type: "text" },
    ],
    blank: () => ({ id: uid(), title: "", body: "", date: new Date().toISOString().slice(0, 10) }),
  },
};

const TABS: { id: ContentKey | "data" | "apps"; l: string }[] = [
  { id: "materials", l: "Materi" },
  { id: "subjects", l: "Kategori" },
  { id: "pretest", l: "Bank Soal" },
  { id: "data", l: "Data Pretest" },
  { id: "majors", l: "Jurusan" },
  { id: "articles", l: "Artikel" },
  { id: "scholarships", l: "Beasiswa" },
  { id: "mentors", l: "Mentor" },
  { id: "apps", l: "Pengajuan Mentor" },
  { id: "events", l: "Sharing Session" },
  { id: "universities", l: "Kampus" },
  { id: "announcements", l: "Pengumuman" },
];

export default function Admin() {
  const { user } = useSession();
  const content = useStore((s) => s.content);
  const resetContent = useStore((s) => s.resetContent);
  const [tab, setTab] = useState<ContentKey | "data" | "apps">("materials");
  const [confirmReset, setConfirmReset] = useState(false);

  if (user?.role !== "admin")
    return (
      <EmptyState icon="Inbox" title="Akses ditolak" desc="Halaman ini hanya untuk admin. Masuk menggunakan akun admin untuk mengelola konten." action={<LinkButton href="/app">Kembali ke Beranda</LinkButton>} />
    );

  return (
    <div>
      <PageHeader
        title="Panel Admin"
        desc="Kelola konten SINAU tanpa mengubah kode aplikasi."
        kicker={<Badge tone="navy"><ShieldCheck className="h-3 w-3" /> Admin</Badge>}
        actions={<Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}><RotateCcw className="h-4 w-4" /> Kembalikan konten awal</Button>}
      />
      <p className="mb-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-300/60">
        <ShieldAlert className="h-4 w-4 shrink-0" /> Mode demo: perubahan disimpan di browser ini saja dan kontrol akses masih di sisi klien. Untuk produksi, aktifkan Supabase Auth + Row Level Security (lihat README & supabase/schema.sql).
      </p>

      <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b border-slate-200 px-4 sm:mx-0 sm:px-0" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cx("-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-bold", tab === t.id ? "border-marun-700 text-marun-700" : "border-transparent text-slate-500 hover:text-ink")}>
            {t.l}
            {t.id !== "data" && t.id !== "apps" && <span className="ml-1 rounded-full bg-slate-100 px-1.5 text-xs">{(content[t.id] as unknown[]).length}</span>}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "materials" && <MaterialsAdmin />}
        {tab === "pretest" && <QuestionsAdmin />}
        {tab === "data" && <PretestData />}
        {tab === "apps" && <MentorApps />}
        {tab !== "materials" && tab !== "pretest" && tab !== "data" && tab !== "apps" && <SimpleAdmin k={tab} />}
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Kembalikan konten awal?">
        <p className="text-sm text-slate-600">Semua perubahan konten (materi, soal, jurusan, artikel, dll.) akan diganti dengan konten bawaan.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmReset(false)}>Batal</Button>
          <Button variant="danger" onClick={() => { resetContent(); setConfirmReset(false); }}>Kembalikan</Button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ title, sub, badge, onEdit, onDelete }: { title: string; sub: string; badge?: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{title || <i className="text-slate-400">(tanpa judul)</i>}</p>
        <p className="truncate text-xs text-slate-500">{sub}</p>
      </div>
      {badge}
      <button onClick={onEdit} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={`Ubah ${title}`}><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Hapus ${title}`}><Trash2 className="h-4 w-4" /></button>
    </li>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }: { name: string | null; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal open={!!name} onClose={onCancel} title="Hapus data?">
      <p className="text-sm text-slate-600">“{name}” akan dihapus.</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Batal</Button>
        <Button variant="danger" onClick={onConfirm}>Hapus</Button>
      </div>
    </Modal>
  );
}

function SimpleAdmin({ k }: { k: SimpleKey }) {
  const cfg = SIMPLE[k];
  const items = useStore((s) => s.content[k]) as unknown as Record<string, unknown>[];
  const upsert = useStore((s) => s.upsertContent);
  const remove = useStore((s) => s.removeContent);
  const [edit, setEdit] = useState<Record<string, unknown> | null>(null);
  const [del, setDel] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState<Record<string, string>>({});

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const er: Record<string, string> = {};
    cfg.fields.forEach((f) => f.required && !String(edit[f.key] ?? "").trim() && (er[f.key] = "Wajib diisi."));
    for (const lk of ["link", "website"]) if (edit[lk] && !/^https:\/\//.test(String(edit[lk]))) er[lk] = "Gunakan tautan https://";
    setErr(er);
    if (Object.keys(er).length) return;
    upsert(k, edit as never);
    setEdit(null);
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">{cfg.label}</h2>
        <Button size="sm" onClick={() => { setErr({}); setEdit(cfg.blank()); }}><Plus className="h-4 w-4" /> Tambah</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState title="Belum ada data" desc="Tambahkan data pertama." />
      ) : (
        <ul className="space-y-2">
          {items.map((x) => (
            <Row key={String(x.id)} title={cfg.title(x)} sub={cfg.sub(x)} badge={"verified" in x ? <Badge tone={x.verified ? "green" : "amber"}>{x.verified ? "Terverifikasi" : "Belum"}</Badge> : "demo" in x && x.demo ? <Badge tone="amber">Contoh</Badge> : null} onEdit={() => { setErr({}); setEdit({ ...x }); }} onDelete={() => setDel(x)} />
          ))}
        </ul>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={`${items.some((x) => x.id === edit?.id) ? "Ubah" : "Tambah"} ${cfg.label}`} wide>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-4">
            {cfg.fields.map((f) => {
              const id = `fx-${f.key}`;
              const v = edit[f.key];
              if (f.type === "check")
                return (
                  <label key={f.key} className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" className="h-4 w-4 accent-marun-700" checked={!!v} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.checked })} /> {f.label}
                  </label>
                );
              return (
                <Field key={f.key} label={f.label} htmlFor={id} error={err[f.key]} hint={f.hint}>
                  {f.type === "textarea" ? (
                    <Textarea id={id} value={String(v ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} className="min-h-[120px]" />
                  ) : f.type === "select" ? (
                    <Select id={id} value={String(v ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}>
                      {f.options!.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </Select>
                  ) : f.type === "list" ? (
                    <Input id={id} value={((v as string[]) ?? []).join(", ")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  ) : (
                    <Input id={id} type={f.type === "number" ? "number" : "text"} min={1} value={String(v ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} />
                  )}
                </Field>
              );
            })}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEdit(null)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        )}
      </Modal>
      <ConfirmDelete name={del ? cfg.title(del) : null} onCancel={() => setDel(null)} onConfirm={() => { remove(k, String(del!.id)); setDel(null); }} />
    </>
  );
}

/* ---------- Editor soal (dipakai kuis materi & bank soal) ---------- */
function QuestionFields({ q, onChange, prefix }: { q: QuizQuestion; onChange: (q: QuizQuestion) => void; prefix: string }) {
  return (
    <div className="space-y-3">
      <Field label="Pertanyaan" htmlFor={`${prefix}-p`}>
        <Textarea id={`${prefix}-p`} value={q.prompt} onChange={(e) => onChange({ ...q, prompt: e.target.value })} className="min-h-[60px]" />
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Pilihan jawaban (pilih kunci jawaban)</legend>
        <div className="space-y-2">
          {q.options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name={`${prefix}-ans`} checked={q.answer === i} onChange={() => onChange({ ...q, answer: i })} className="h-4 w-4 accent-marun-700" aria-label={`Jadikan pilihan ${String.fromCharCode(65 + i)} kunci jawaban`} />
              <span className="w-5 text-sm font-bold text-slate-500">{String.fromCharCode(65 + i)}</span>
              <Input value={o} onChange={(e) => onChange({ ...q, options: q.options.map((x, k) => (k === i ? e.target.value : x)) })} className="py-2" aria-label={`Pilihan ${String.fromCharCode(65 + i)}`} />
            </div>
          ))}
        </div>
      </fieldset>
      <Field label="Pembahasan (opsional)" htmlFor={`${prefix}-e`}>
        <Input id={`${prefix}-e`} value={q.explanation ?? ""} onChange={(e) => onChange({ ...q, explanation: e.target.value })} />
      </Field>
    </div>
  );
}
const blankQ = (): QuizQuestion => ({ id: uid().slice(0, 8), prompt: "", options: ["", "", "", ""], answer: 0, explanation: "" });
const validQ = (q: QuizQuestion) => q.prompt.trim() && q.options.every((o) => o.trim());

function QuestionsAdmin() {
  const items = useStore((s) => s.content.pretest);
  const subjects = useStore((s) => s.content.subjects);
  const materials = useStore((s) => s.content.materials);
  const upsert = useStore((s) => s.upsertContent);
  const remove = useStore((s) => s.removeContent);
  const [edit, setEdit] = useState<PretestQuestion | null>(null);
  const [del, setDel] = useState<PretestQuestion | null>(null);
  const [err, setErr] = useState("");
  const topics = Array.from(new Set(materials.map((m) => m.topic)));

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold">Bank Soal Pretest</h2>
          <p className="text-xs text-slate-500">Topik soal dicocokkan dengan “topik” materi untuk rekomendasi.</p>
        </div>
        <Button size="sm" onClick={() => { setErr(""); setEdit({ ...blankQ(), subjectId: subjects[0]?.id ?? "", topic: topics[0] ?? "" }); }}><Plus className="h-4 w-4" /> Tambah soal</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="ClipboardList" title="Bank soal kosong" desc="Pretest tidak dapat dikerjakan sampai ada soal." />
      ) : (
        <ul className="space-y-2">
          {items.map((q) => (
            <Row key={q.id} title={q.prompt} sub={`${q.topic} · kunci: ${q.options[q.answer]}`} onEdit={() => { setErr(""); setEdit({ ...q, options: [...q.options] }); }} onDelete={() => setDel(q)} />
          ))}
        </ul>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Soal pretest" wide>
        {edit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!validQ(edit) || !edit.topic.trim()) return setErr("Lengkapi pertanyaan, topik, dan semua pilihan jawaban.");
              upsert("pretest", edit);
              setEdit(null);
            }}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Bidang" htmlFor="q-sub">
                <Select id="q-sub" value={edit.subjectId} onChange={(e) => setEdit({ ...edit, subjectId: e.target.value })}>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="Topik" htmlFor="q-topic" hint="Samakan dengan topik materi">
                <Input id="q-topic" list="topics" value={edit.topic} onChange={(e) => setEdit({ ...edit, topic: e.target.value })} />
                <datalist id="topics">{topics.map((t) => <option key={t} value={t} />)}</datalist>
              </Field>
            </div>
            <QuestionFields q={edit} onChange={(q) => setEdit({ ...edit, ...q })} prefix="pq" />
            {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEdit(null)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        )}
      </Modal>
      <ConfirmDelete name={del?.prompt ?? null} onCancel={() => setDel(null)} onConfirm={() => { remove("pretest", del!.id); setDel(null); }} />
    </>
  );
}

/* ---------- Materi: konten ditulis dengan format sederhana ---------- */
function sectionsToText(s: MaterialSection[]) {
  return s.map((x) => `## ${x.heading}\n${x.body}${x.example ? `\n>>> Contoh\n${x.example}\n<<<` : ""}`).join("\n\n");
}
function textToSections(t: string, prev: MaterialSection[]): MaterialSection[] {
  return t
    .split(/^## /m)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      const [heading, ...rest] = b.split("\n");
      let body = rest.join("\n");
      let example: string | undefined;
      const m = body.match(/>>> Contoh\n([\s\S]*?)\n<<</);
      if (m) {
        example = m[1].trim();
        body = body.replace(m[0], "");
      }
      const old = prev.find((p) => p.heading === heading.trim());
      return { heading: heading.trim(), body: body.trim(), example, illustration: old?.illustration };
    });
}

function MaterialsAdmin() {
  const items = useStore((s) => s.content.materials);
  const subjects = useStore((s) => s.content.subjects);
  const upsert = useStore((s) => s.upsertContent);
  const remove = useStore((s) => s.removeContent);
  const [edit, setEdit] = useState<(LearningMaterial & { text: string }) | null>(null);
  const [del, setDel] = useState<LearningMaterial | null>(null);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all");
  const list = items.filter((m) => filter === "all" || m.subjectId === filter);

  function open(m?: LearningMaterial) {
    setErr("");
    const base: LearningMaterial = m ?? { id: uid().slice(0, 12), subjectId: subjects[0]?.id ?? "", title: "", description: "", minutes: 15, level: "Dasar", topic: "", sections: [], quiz: [], demo: false };
    setEdit({ ...base, quiz: base.quiz.map((q) => ({ ...q, options: [...q.options] })), text: sectionsToText(base.sections) || "## Judul bagian\nTulis penjelasan di sini.\n>>> Contoh\nTulis contoh di sini (opsional)\n<<<" });
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const sections = textToSections(edit.text, edit.sections);
    if (!edit.title.trim() || !edit.description.trim() || !edit.topic.trim()) return setErr("Judul, deskripsi, dan topik wajib diisi.");
    if (!sections.length) return setErr("Konten minimal satu bagian (diawali “## ”).");
    if (!edit.quiz.every(validQ)) return setErr("Lengkapi semua soal kuis atau hapus soal yang kosong.");
    if (edit.videoUrl?.trim() && !youtubeId(edit.videoUrl)) return setErr("URL video harus tautan YouTube yang valid (atau kosongkan).");
    const { text, ...m } = edit;
    void text;
    upsert("materials", { ...m, sections, videoUrl: m.videoUrl?.trim() || undefined });
    setEdit(null);
  }

  const counts = useMemo(() => Object.fromEntries(subjects.map((s) => [s.id, items.filter((m) => m.subjectId === s.id).length])), [subjects, items]);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">Materi Pembelajaran</h2>
        <div className="flex gap-2">
          <Select aria-label="Filter bidang" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-auto py-2">
            <option value="all">Semua bidang</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({counts[s.id]})</option>)}
          </Select>
          <Button size="sm" onClick={() => open()}><Plus className="h-4 w-4" /> Tambah materi</Button>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="BookOpen" title="Belum ada materi" />
      ) : (
        <ul className="space-y-2">
          {list.map((m) => (
            <Row key={m.id} title={m.title} sub={`${subjects.find((s) => s.id === m.subjectId)?.name ?? "?"} · ${m.level} · ${m.sections.length} bagian · ${m.quiz.length} soal kuis${m.videoUrl ? " · video" : ""}`} badge={m.demo ? <Badge tone="amber">Demo</Badge> : <Badge tone="green">Resmi</Badge>} onEdit={() => open(m)} onDelete={() => setDel(m)} />
          ))}
        </ul>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Materi pembelajaran" wide>
        {edit && (
          <form onSubmit={save} noValidate className="space-y-4">
            <Field label="Judul" htmlFor="m-title"><Input id="m-title" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Deskripsi singkat" htmlFor="m-desc"><Input id="m-desc" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Bidang" htmlFor="m-sub" className="sm:col-span-2">
                <Select id="m-sub" value={edit.subjectId} onChange={(e) => setEdit({ ...edit, subjectId: e.target.value })}>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="Tingkat" htmlFor="m-lvl">
                <Select id="m-lvl" value={edit.level} onChange={(e) => setEdit({ ...edit, level: e.target.value as LearningMaterial["level"] })}>
                  <option>Dasar</option><option>Menengah</option><option>Lanjut</option>
                </Select>
              </Field>
              <Field label="Menit" htmlFor="m-min"><Input id="m-min" type="number" min={1} value={edit.minutes} onChange={(e) => setEdit({ ...edit, minutes: Number(e.target.value) || 1 })} /></Field>
            </div>
            <Field label="Topik (untuk pencocokan pretest)" htmlFor="m-topic"><Input id="m-topic" value={edit.topic} onChange={(e) => setEdit({ ...edit, topic: e.target.value })} /></Field>
            <Field label="URL video YouTube (opsional)" htmlFor="m-video" hint={edit.videoUrl ? (youtubeId(edit.videoUrl) ? "✓ Video YouTube terdeteksi — akan ditanam di halaman materi." : "Bukan URL YouTube yang valid.") : "Contoh: https://www.youtube.com/watch?v=… atau https://youtu.be/…"}>
              <Input id="m-video" value={edit.videoUrl ?? ""} onChange={(e) => setEdit({ ...edit, videoUrl: e.target.value })} placeholder="https://youtu.be/…" />
            </Field>
            <Field label="Isi materi" htmlFor="m-text" hint="Awali tiap bagian dengan “## Judul”. Paragraf dipisah baris kosong. Bungkus contoh dengan “>>> Contoh” … “<<<”.">
              <Textarea id="m-text" value={edit.text} onChange={(e) => setEdit({ ...edit, text: e.target.value })} className="min-h-[220px] font-mono text-xs" />
            </Field>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Kuis materi ({edit.quiz.length} soal)</p>
                <Button type="button" size="sm" variant="secondary" onClick={() => setEdit({ ...edit, quiz: [...edit.quiz, blankQ()] })}><Plus className="h-4 w-4" /> Soal</Button>
              </div>
              <div className="space-y-3">
                {edit.quiz.map((q, i) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Soal {i + 1}</span>
                      <button type="button" onClick={() => setEdit({ ...edit, quiz: edit.quiz.filter((_, k) => k !== i) })} className="text-xs font-semibold text-red-600 hover:underline">Hapus</button>
                    </div>
                    <QuestionFields q={q} prefix={`mq-${q.id}`} onChange={(nq) => setEdit({ ...edit, quiz: edit.quiz.map((x, k) => (k === i ? nq : x)) })} />
                  </div>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="h-4 w-4 accent-marun-700" checked={edit.demo} onChange={(e) => setEdit({ ...edit, demo: e.target.checked })} /> Tandai sebagai konten demo
            </label>
            {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEdit(null)}>Batal</Button>
              <Button type="submit">Simpan materi</Button>
            </div>
          </form>
        )}
      </Modal>
      <ConfirmDelete name={del?.title ?? null} onCancel={() => setDel(null)} onConfirm={() => { remove("materials", del!.id); setDel(null); }} />
    </>
  );
}

function PretestData() {
  const users = useStore((s) => s.users);
  const data = useStore((s) => s.data);
  const rows = users.flatMap((u) => (data[u.id]?.pretests ?? []).map((p) => ({ u, p })));
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.p.score, 0) / rows.length) : null;
  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-xs text-slate-500">Akun di perangkat ini</p><p className="text-2xl font-extrabold">{users.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Total percobaan pretest</p><p className="text-2xl font-extrabold">{rows.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Rata-rata skor</p><p className="text-2xl font-extrabold">{avg ?? "—"}</p></Card>
      </div>
      <p className="mb-3 flex items-center gap-2 text-xs text-slate-500"><Database className="h-4 w-4" /> Mode demo hanya membaca data dari browser ini. Dengan Supabase, data ini diambil dari tabel test_results seluruh pengguna.</p>
      {rows.length === 0 ? (
        <EmptyState icon="BarChart3" title="Belum ada data pretest" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Pengguna</th><th className="px-4 py-3">Tanggal</th><th className="px-4 py-3">Benar</th><th className="px-4 py-3">Skor</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.reverse().map(({ u, p }) => (
                <tr key={p.id}><td className="px-4 py-3 font-semibold">{u.name}</td><td className="px-4 py-3">{p.date.slice(0, 10)}</td><td className="px-4 py-3">{p.correct}/{p.total}</td><td className="px-4 py-3 font-bold">{p.score}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function MentorApps() {
  const apps = useStore((s) => s.mentorApps);
  const review = useStore((s) => s.reviewMentorApp);
  if (!apps.length) return <EmptyState icon="Users" title="Belum ada pengajuan" desc="Pengguna dapat mendaftar sebagai alumni/mentor dari halaman Komunitas." />;
  return (
    <ul className="space-y-3">
      {[...apps].reverse().map((a) => (
        <li key={a.id}>
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{a.name}</p>
              <Badge tone={a.status === "disetujui" ? "green" : a.status === "ditolak" ? "slate" : "amber"}>{a.status}</Badge>
            </div>
            <p className="text-sm text-slate-500">{a.role} · {a.major}{a.institution && ` · ${a.institution}`}</p>
            <p className="mt-2 text-sm">{a.motivation}</p>
            {a.status === "menunggu" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => review(a.id, "disetujui")}>Setujui & tampilkan</Button>
                <Button size="sm" variant="ghost" onClick={() => review(a.id, "ditolak")}>Tolak</Button>
              </div>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
