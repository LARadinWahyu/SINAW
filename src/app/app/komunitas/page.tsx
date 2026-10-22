"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BellPlus, CalendarDays, Check, ExternalLink, GraduationCap, HandHelping, MessageCircle, Send, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Select, Textarea } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import type { CommunityEvent, ForumPost } from "@/lib/types";
import { cx, dayKey, formatTanggal } from "@/lib/utils";

const TOPICS = ["Persiapan Kuliah", "Jurusan & Minat", "Budaya Kampus", "Karier", "Beasiswa"];
type Tab = "diskusi" | "mentor" | "sesi";

export default function KomunitasPage() {
  return (
    <Suspense>
      <Komunitas />
    </Suspense>
  );
}

function Komunitas() {
  const params = useSearchParams();
  const initial = (params.get("tab") as Tab) ?? "diskusi";
  const [tab, setTab] = useState<Tab>(["diskusi", "mentor", "sesi"].includes(initial) ? initial : "diskusi");
  return (
    <div>
      <PageHeader title="Komunitas Alumni & Mentor" desc="Ruang diskusi, tanya narasumber akademik, dan sharing session." />
      <p className="mb-5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-300/60">
        Mode demo: diskusi dan pendaftaran tersimpan di browser ini saja dan belum dimoderasi otomatis. Jangan bagikan data pribadi (nomor HP, alamat, dll.).
      </p>
      <div className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Bagian komunitas">
        {([["diskusi", "Diskusi", MessageCircle], ["mentor", "Mentor & Alumni", Users], ["sesi", "Sharing Session", CalendarDays]] as const).map(([k, l, I]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cx("inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold", tab === k ? "bg-marun-700 text-white" : "bg-white text-slate-600 shadow-card hover:text-marun-700")}>
            <I className="h-4 w-4" /> {l}
          </button>
        ))}
      </div>
      {tab === "diskusi" && <Diskusi />}
      {tab === "mentor" && <Mentor />}
      {tab === "sesi" && <Sesi />}
    </div>
  );
}

/* ---------------- DISKUSI ---------------- */
function useMentorIds() {
  const apps = useStore((s) => s.mentorApps);
  return useMemo(() => new Set(apps.filter((a) => a.status === "disetujui").map((a) => a.userId)), [apps]);
}

/** Dijawab = ada balasan dari tim SINAU atau mentor yang disetujui, selain si penanya sendiri. */
function answeredByMentor(p: ForumPost, mentors: Set<string>) {
  return p.replies.some((r) => r.authorId !== p.authorId && (r.authorRole === "admin" || (!!r.authorId && mentors.has(r.authorId))));
}

function RoleBadge({ role, id, mentors }: { role?: string; id?: string; mentors: Set<string> }) {
  if (role === "admin") return <Badge tone="navy"><ShieldCheck className="h-3 w-3" /> Tim SINAU</Badge>;
  if (id && mentors.has(id)) return <Badge tone="green"><GraduationCap className="h-3 w-3" /> Mentor</Badge>;
  return null;
}

function Diskusi() {
  const { user } = useSession();
  const forum = useStore((s) => s.forum);
  const { addPost, addReply, togglePostUpvote, deletePost } = useStore();
  const mentors = useMentorIds();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [body, setBody] = useState("");
  const [ask, setAsk] = useState(false);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("semua");
  const [sort, setSort] = useState<"baru" | "populer">("baru");
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [del, setDel] = useState<ForumPost | null>(null);

  const list = useMemo(() => {
    const l = forum.filter((p) => filter === "semua" || (filter === "mentor" ? p.askMentor : filter === "belum" ? p.askMentor && !answeredByMentor(p, mentors) : p.topic === filter));
    return sort === "populer" ? [...l].sort((a, b) => (b.upvotes?.length ?? 0) - (a.upvotes?.length ?? 0) || b.replies.length - a.replies.length) : l;
  }, [forum, filter, sort, mentors]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card className="h-fit p-5">
        <h2 className="font-bold">Mulai diskusi</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const v = body.trim();
            if (v.length < 10) return setErr("Tulis minimal 10 karakter.");
            if (/(\+62|08)\d{8,}/.test(v.replace(/[\s-]/g, ""))) return setErr("Sepertinya ada nomor telepon. Demi keamanan, jangan bagikan data pribadi.");
            addPost(topic, v, ask);
            setBody("");
            setAsk(false);
            setErr("");
          }}
        >
          <Field label="Topik" htmlFor="f-topic">
            <Select id="f-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Pertanyaan atau cerita" htmlFor="f-body" error={err}>
            <Textarea id="f-body" value={body} onChange={(e) => { setBody(e.target.value); setErr(""); }} placeholder="Contoh: Ada tips adaptasi di minggu pertama kuliah?" maxLength={600} />
          </Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={ask} onChange={(e) => setAsk(e.target.checked)} className="mt-0.5 h-4 w-4 accent-marun-700" />
            <span><b>Tanya mentor</b> — tandai agar mentor & alumni memprioritaskan pertanyaan ini</span>
          </label>
          <Button type="submit" className="w-full"><Send className="h-4 w-4" /> Kirim</Button>
        </form>
      </Card>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Select aria-label="Filter diskusi" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-auto py-2">
            <option value="semua">Semua topik</option>
            <option value="mentor">Pertanyaan untuk mentor</option>
            <option value="belum">Belum dijawab mentor</option>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <div className="flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Urutkan">
            {(["baru", "populer"] as const).map((s) => (
              <button key={s} aria-pressed={sort === s} onClick={() => setSort(s)} className={cx("rounded-lg px-3 py-1.5 text-xs font-bold", sort === s ? "bg-white text-marun-700 shadow-sm" : "text-slate-500")}>
                {s === "baru" ? "Terbaru" : "Paling membantu"}
              </button>
            ))}
          </div>
        </div>
        {list.length === 0 ? (
          <EmptyState icon="MessageSquare" title={forum.length ? "Tidak ada diskusi untuk filter ini" : "Belum ada diskusi"} desc={forum.length ? "Ubah filter untuk melihat diskusi lain." : "Jadilah yang pertama memulai sharing session."} />
        ) : (
          <ul className="space-y-4">
            {list.map((p) => {
              const voted = !!user && (p.upvotes ?? []).includes(user.id);
              const canDelete = user?.role === "admin" || p.authorId === user?.id;
              const answered = answeredByMentor(p, mentors);
              return (
                <li key={p.id}>
                  <Card className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">{p.author.slice(0, 1)}</span>
                      <span className="text-sm font-bold">{p.author}</span>
                      <RoleBadge role={p.authorRole} id={p.authorId} mentors={mentors} />
                      <Badge tone="slate">{p.topic}</Badge>
                      {p.askMentor && <Badge tone={answered ? "green" : "amber"}>{answered ? "Dijawab mentor" : "Tanya mentor"}</Badge>}
                      <span className="ml-auto text-xs text-slate-400">{formatTanggal(p.at.slice(0, 10))}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm">{p.body}</p>
                    {p.replies.length > 0 && (
                      <ul className="mt-4 space-y-2 border-l-2 border-marun-100 pl-4">
                        {p.replies.map((r) => (
                          <li key={r.id} className="text-sm">
                            <span className="inline-flex flex-wrap items-center gap-1.5"><b>{r.author}</b><RoleBadge role={r.authorRole} id={r.authorId} mentors={mentors} /></span>
                            <p className="whitespace-pre-wrap text-slate-700">{r.body}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button onClick={() => togglePostUpvote(p.id)} aria-pressed={voted} className={cx("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold", voted ? "bg-marun-50 text-marun-700" : "text-slate-500 hover:bg-slate-100")}>
                        <HandHelping className="h-4 w-4" /> Membantu {(p.upvotes?.length ?? 0) > 0 && `· ${p.upvotes!.length}`}
                      </button>
                      <span className="text-xs text-slate-400">{p.replies.length} balasan</span>
                      {canDelete && (
                        <button onClick={() => setDel(p)} className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Hapus diskusi ${p.body.slice(0, 20)}`}>
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      )}
                    </div>
                    <form
                      className="mt-3 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const v = (replies[p.id] ?? "").trim();
                        if (!v) return;
                        addReply(p.id, v);
                        setReplies({ ...replies, [p.id]: "" });
                      }}
                    >
                      <label htmlFor={`r-${p.id}`} className="sr-only">Balas</label>
                      <Input id={`r-${p.id}`} value={replies[p.id] ?? ""} onChange={(e) => setReplies({ ...replies, [p.id]: e.target.value })} placeholder="Tulis balasan…" className="py-2" maxLength={600} />
                      <Button type="submit" size="sm" variant="secondary">Balas</Button>
                    </form>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Modal open={!!del} onClose={() => setDel(null)} title="Hapus diskusi?">
        <p className="text-sm text-slate-600">Diskusi beserta semua balasannya akan dihapus.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDel(null)}>Batal</Button>
          <Button variant="danger" onClick={() => { deletePost(del!.id); setDel(null); }}>Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- MENTOR ---------------- */
function Mentor() {
  const { user } = useSession();
  const mentors = useStore((s) => s.content.mentors);
  const apps = useStore((s) => s.mentorApps);
  const applyMentor = useStore((s) => s.applyMentor);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ role: "Alumni", major: "", institution: "", motivation: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const mine = [...apps].reverse().find((a) => a.userId === user?.id);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.major.trim().length < 3) er.major = "Isi jurusan/bidang.";
    if (f.motivation.trim().length < 30) er.motivation = "Ceritakan minimal 30 karakter.";
    setErr(er);
    if (Object.keys(er).length) return;
    applyMentor({ role: f.role, major: f.major.trim(), institution: f.institution.trim(), motivation: f.motivation.trim() });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-50 text-navy-700"><UserPlus className="h-6 w-6" /></span>
        <div className="flex-1">
          <p className="font-bold">Alumni, mahasiswa tingkat akhir, atau dosen?</p>
          <p className="text-sm text-slate-500">Bagikan pengalamanmu sebagai mentor. Pengajuan ditinjau tim SINAU sebelum profilmu tampil.</p>
          {mine && (
            <p className="mt-2 text-sm">
              Status pengajuanmu: <Badge tone={mine.status === "disetujui" ? "green" : mine.status === "ditolak" ? "slate" : "amber"}>{mine.status}</Badge>
            </p>
          )}
        </div>
        <Button onClick={() => setOpen(true)} disabled={mine?.status === "menunggu" || mine?.status === "disetujui"}>
          {mine?.status === "menunggu" ? "Menunggu tinjauan" : mine?.status === "disetujui" ? <><Check className="h-4 w-4" /> Kamu mentor</> : "Daftar jadi mentor"}
        </Button>
      </Card>

      {mentors.length === 0 ? (
        <EmptyState icon="Users" title="Belum ada mentor terdaftar" desc="Profil mentor & alumni akan tampil setelah pengajuan disetujui atau ditambahkan admin. SINAU tidak menampilkan profil fiktif." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m) => (
            <li key={m.id}>
              <Card className="h-full p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-700 text-lg font-bold text-white">{m.name.slice(0, 1)}</span>
                <h3 className="mt-3 font-bold">{m.name}</h3>
                <p className="text-xs font-semibold text-slate-500">{m.role} · {m.major}</p>
                <p className="mt-2 line-clamp-4 text-sm text-slate-600">{m.bio}</p>
                <div className="mt-3">{m.verified ? <Badge tone="green"><ShieldCheck className="h-3 w-3" /> Ditinjau tim SINAU</Badge> : <Badge tone="amber">Belum diverifikasi</Badge>}</div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Daftar jadi mentor / alumni">
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Peran" htmlFor="m-role">
            <Select id="m-role" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
              {["Alumni", "Mahasiswa tingkat akhir", "Dosen", "Praktisi"].map((r) => <option key={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Jurusan / bidang keahlian" htmlFor="m-major" error={err.major}>
            <Input id="m-major" value={f.major} onChange={(e) => setF({ ...f, major: e.target.value })} placeholder="Contoh: Sistem Informasi" />
          </Field>
          <Field label="Institusi (opsional)" htmlFor="m-inst">
            <Input id="m-inst" value={f.institution} onChange={(e) => setF({ ...f, institution: e.target.value })} />
          </Field>
          <Field label="Pengalaman & topik yang bisa kamu bantu" htmlFor="m-mot" error={err.motivation}>
            <Textarea id="m-mot" value={f.motivation} onChange={(e) => setF({ ...f, motivation: e.target.value })} maxLength={500} />
          </Field>
          <p className="text-xs text-slate-500">Nama akunmu ({user?.name}) akan ditampilkan bila disetujui.</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit">Kirim pengajuan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------------- SHARING SESSION ---------------- */
function Sesi() {
  const { data } = useSession();
  const events = useStore((s) => s.content.events);
  const addTask = useStore((s) => s.addTask);
  const today = dayKey();
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const reminded = (e: CommunityEvent) => data!.tasks.some((t) => t.title === `Sharing session: ${e.title}` && t.dueDate === e.date);

  const card = (e: CommunityEvent, isPast: boolean) => (
    <li key={e.id}>
      <Card className={cx("flex flex-col gap-4 p-5 sm:flex-row sm:items-center", isPast && "opacity-70")}>
        <div className="w-16 shrink-0 rounded-2xl bg-marun-50 p-2 text-center text-marun-700">
          <p className="text-2xl font-extrabold leading-none">{Number(e.date.slice(8))}</p>
          <p className="text-[11px] font-bold uppercase">{formatTanggal(e.date).split(" ")[1]}</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">{e.title}</h3>
            {!e.verified && <Badge tone="amber">Belum dikonfirmasi</Badge>}
          </div>
          <p className="text-sm text-slate-500">{e.speaker} · {formatTanggal(e.date, true)}, {e.time} WIB</p>
          {e.description && <p className="mt-1 text-sm text-slate-600">{e.description}</p>}
        </div>
        {!isPast && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={reminded(e)}
              onClick={() => addTask({ title: `Sharing session: ${e.title}`, description: `${e.speaker}${e.link ? ` · ${e.link}` : ""}`, dueDate: e.date, dueTime: e.time || "19:00", priority: "sedang", category: "umum", reminder: true })}
            >
              {reminded(e) ? <><Check className="h-4 w-4" /> Di To-Do</> : <><BellPlus className="h-4 w-4" /> Ingatkan saya</>}
            </Button>
            {e.link && (
              <a href={e.link} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50">
                Daftar <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </Card>
    </li>
  );

  if (!events.length) return <EmptyState icon="CalendarDays" title="Belum ada jadwal sharing session" desc="Jadwal sesi bersama alumni, dosen, atau narasumber akan diumumkan di sini setelah dikonfirmasi tim SINAU." />;
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 font-bold">Akan datang</h2>
        {upcoming.length ? <ul className="space-y-3">{upcoming.map((e) => card(e, false))}</ul> : <p className="text-sm text-slate-500">Belum ada sesi mendatang.</p>}
      </section>
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 font-bold">Sudah lewat</h2>
          <ul className="space-y-3">{past.map((e) => card(e, true))}</ul>
        </section>
      )}
    </div>
  );
}
