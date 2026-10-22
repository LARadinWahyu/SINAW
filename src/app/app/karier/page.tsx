"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Briefcase, Building2, Clock, Compass, ExternalLink, GraduationCap, MessageCircle, Search, ShieldAlert, Star, Users } from "lucide-react";
import { Badge, Card, DemoTag, EmptyState, Input, Modal, PageHeader, Select } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import type { CareerArticle, Major } from "@/lib/types";
import { cx } from "@/lib/utils";

type Tab = "jurusan" | "artikel" | "beasiswa";
const TABS: { id: Tab; l: string; i: typeof Compass }[] = [
  { id: "jurusan", l: "Eksplorasi Jurusan", i: Compass },
  { id: "artikel", l: "Artikel & Panduan", i: BookOpen },
  { id: "beasiswa", l: "Beasiswa", i: GraduationCap },
];

export default function CareerLounge() {
  const { data } = useSession();
  const { majors, articles, scholarships } = useStore((s) => s.content);
  const [tab, setTab] = useState<Tab>("jurusan");
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState("all");
  const [cat, setCat] = useState("all");
  const [major, setMajor] = useState<Major | null>(null);
  const [article, setArticle] = useState<CareerArticle | null>(null);
  const mine = data!.profile.majors;
  const t = q.trim().toLowerCase();

  const fMajors = useMemo(
    () =>
      majors
        .filter((m) => (cluster === "all" || m.cluster === cluster) && (!t || `${m.name} ${m.description} ${m.careers.join(" ")} ${m.subjects.join(" ")}`.toLowerCase().includes(t)))
        .sort((a, b) => Number(mine.includes(b.id)) - Number(mine.includes(a.id))),
    [majors, cluster, t, mine],
  );
  const fArticles = articles.filter((a) => (cat === "all" || a.category === cat) && (!t || `${a.title} ${a.summary} ${a.body}`.toLowerCase().includes(t)));
  const fSch = scholarships.filter((s) => !t || `${s.name} ${s.provider} ${s.description}`.toLowerCase().includes(t));

  return (
    <div>
      <PageHeader title="Career Lounge" desc="Eksplorasi jurusan, karier, budaya kampus, dan persiapan kuliah." kicker={<DemoTag label="Konten contoh — perlu verifikasi admin" />} />

      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Bagian Career Lounge">
        {TABS.map(({ id, l, i: I }) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setQ(""); }} className={cx("inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition", tab === id ? "bg-marun-700 text-white" : "bg-white text-slate-600 shadow-card hover:text-marun-700")}>
            <I className="h-4 w-4" /> {l}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/app/komunitas" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-marun-200">
          <Users className="h-6 w-6 shrink-0 text-marun-700" />
          <span className="flex-1"><span className="block text-sm font-bold">Komunitas Alumni & Mentor</span><span className="block text-xs text-slate-500">Ruang diskusi, tanya mentor, sharing session</span></span>
          <MessageCircle className="h-4 w-4 text-slate-400" />
        </Link>
        <Link href="/app/kampus" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-marun-200">
          <Building2 className="h-6 w-6 shrink-0 text-navy-700" />
          <span className="flex-1"><span className="block text-sm font-bold">Rekomendasi Kampus</span><span className="block text-xs text-slate-500">Kampus yang menyediakan jurusan pilihanmu</span></span>
        </Link>
      </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor="cari-karier" className="sr-only">Cari</label>
            <Input id="cari-karier" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === "jurusan" ? "Cari jurusan, mata kuliah, atau profesi…" : "Cari…"} className="pl-10" />
          </div>
          {tab === "jurusan" && (
            <Select aria-label="Filter rumpun" value={cluster} onChange={(e) => setCluster(e.target.value)} className="sm:w-48">
              <option value="all">Semua rumpun</option>
              <option value="Saintek">Saintek</option>
              <option value="Soshum">Soshum</option>
            </Select>
          )}
          {tab === "artikel" && (
            <Select aria-label="Filter kategori" value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-52">
              <option value="all">Semua kategori</option>
              {["Budaya Kampus", "Persiapan Kuliah", "Minat & Jurusan", "Karier"].map((c) => <option key={c}>{c}</option>)}
            </Select>
          )}
        </div>

      <div className="mt-5">
        {tab === "jurusan" && (
          <Link href="/app/tes-jurusan" className="mb-4 flex items-center gap-4 rounded-2xl bg-navy-800 p-4 text-white transition hover:bg-navy-700">
            <Compass className="h-8 w-8 shrink-0 text-amber-300" />
            <span className="flex-1">
              <span className="block font-bold">{data!.majorTests.length ? "Lihat hasil tes kecocokan jurusanmu" : "Belum yakin? Ikuti Tes Kecocokan Jurusan"}</span>
              <span className="block text-sm text-navy-200">18 pernyataan · ±5 menit · hasilnya bisa langsung jadi minat di profil</span>
            </span>
            <span className="hidden text-sm font-bold sm:block">Mulai →</span>
          </Link>
        )}
        {tab === "jurusan" &&
          (fMajors.length === 0 ? (
            <EmptyState icon="Search" title="Jurusan tidak ditemukan" />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fMajors.map((m) => (
                <li key={m.id}>
                  <button onClick={() => setMajor(m)} className="flex h-full w-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:border-marun-200">
                    <div className="flex items-center gap-2">
                      <Badge tone={m.cluster === "Saintek" ? "navy" : "marun"}>{m.cluster}</Badge>
                      {mine.includes(m.id) && <Badge tone="amber"><Star className="h-3 w-3" /> Minatmu</Badge>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{m.name}</h3>
                    <p className="mt-1 line-clamp-3 flex-1 text-sm text-slate-500">{m.description}</p>
                    <p className="mt-3 text-xs font-semibold text-slate-500">Prospek: {m.careers.slice(0, 3).join(", ")}…</p>
                  </button>
                </li>
              ))}
            </ul>
          ))}

        {tab === "artikel" &&
          (fArticles.length === 0 ? (
            <EmptyState icon="Search" title="Artikel tidak ditemukan" />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {fArticles.map((a) => (
                <li key={a.id}>
                  <button onClick={() => setArticle(a)} className="flex h-full w-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 text-left shadow-card transition hover:border-marun-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-marun-600">{a.category}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3 w-3" /> {a.minutes} mnt</span>
                    </div>
                    <h3 className="mt-2 font-bold">{a.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{a.summary}</p>
                  </button>
                </li>
              ))}
            </ul>
          ))}

        {tab === "beasiswa" && (
          <>
            <p className="mb-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-300/60">
              <ShieldAlert className="h-5 w-5 shrink-0" /> Informasi beasiswa aktif belum tersedia. Entri di bawah adalah kerangka contoh dan perlu diisi admin dengan data resmi yang terverifikasi.
            </p>
            {fSch.length === 0 ? (
              <EmptyState icon="GraduationCap" title="Belum ada informasi beasiswa" />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {fSch.map((s) => (
                  <li key={s.id}>
                    <Card className="h-full p-5">
                      <div className="flex items-center justify-between">
                        <Badge tone={s.verified ? "green" : "amber"}>{s.verified ? "Terverifikasi" : "Perlu pembaruan"}</Badge>
                      </div>
                      <h3 className="mt-3 font-bold">{s.name}</h3>
                      <p className="text-xs font-semibold text-slate-500">{s.provider}</p>
                      <p className="mt-2 text-sm text-slate-600">{s.description}</p>
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-marun-700 hover:underline">
                          Situs resmi <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

      </div>

      <Modal open={!!major} onClose={() => setMajor(null)} title={major?.name ?? ""} wide>
        {major && (
          <div className="space-y-4 text-sm">
            <div className="flex gap-2"><Badge tone="navy">{major.cluster}</Badge>{major.demo && <DemoTag label="Deskripsi umum" />}</div>
            <p className="text-slate-600">{major.description}</p>
            <div>
              <p className="mb-2 font-bold">Contoh mata kuliah awal</p>
              <div className="flex flex-wrap gap-1.5">{major.subjects.map((s) => <Badge key={s}>{s}</Badge>)}</div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 font-bold"><Briefcase className="h-4 w-4" /> Contoh prospek karier</p>
              <ul className="grid gap-1.5 sm:grid-cols-2">{major.careers.map((c) => <li key={c} className="rounded-lg bg-canvas px-3 py-2">{c}</li>)}</ul>
            </div>
            <p className="text-xs text-slate-400">Informasi bersifat umum. Kurikulum dan prospek dapat berbeda di setiap perguruan tinggi — cek situs resmi program studi.</p>
          </div>
        )}
      </Modal>
      <Modal open={!!article} onClose={() => setArticle(null)} title={article?.title ?? ""} wide>
        {article && (
          <div className="text-sm">
            <div className="flex items-center gap-2"><Badge tone="marun">{article.category}</Badge>{article.demo && <DemoTag label="Panduan contoh" />}</div>
            {article.body.split(/\n{2,}/).map((p, i) => <p key={i} className="mt-3 leading-relaxed text-slate-700">{p}</p>)}
          </div>
        )}
      </Modal>
    </div>
  );
}
