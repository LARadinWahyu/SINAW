"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Building2, ExternalLink, MapPin, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge, Card, EmptyState, Input, PageHeader } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { useSession, useStore } from "@/lib/store";
import { ISLANDS, recommendUniversities, type UniPrefs } from "@/lib/university";
import { cx } from "@/lib/utils";

const short = (id: string) => MAJOR_OPTIONS.find((m) => m.id === id)?.name.split(" (")[0].split(" /")[0] ?? id;

export default function RekomendasiKampus() {
  const { data } = useSession();
  const d = data!;
  const universities = useStore((s) => s.content.universities);
  const toggleSaved = useStore((s) => s.toggleSavedUniversity);
  const [prefs, setPrefs] = useState<UniPrefs>({ majors: d.profile.majors.slice(0, 3), islands: [], type: "semua", q: "" });
  const [tab, setTab] = useState<"rekomendasi" | "tersimpan">("rekomendasi");
  const results = useMemo(() => recommendUniversities(universities, prefs), [universities, prefs]);
  const saved = universities.filter((u) => d.savedUniversities.includes(u.id));
  const list = tab === "tersimpan" ? recommendUniversities(saved, { ...prefs, majors: [], q: "" }) : results;

  const toggle = (k: "majors" | "islands", v: string, max = 99) =>
    setPrefs((p) => {
      const has = p[k].includes(v);
      if (!has && p[k].length >= max) return p;
      return { ...p, [k]: has ? p[k].filter((x) => x !== v) : [...p[k], v] };
    });
  const chip = (on: boolean) => cx("rounded-full border px-3 py-1.5 text-xs font-semibold transition", on ? "border-marun-600 bg-marun-50 text-marun-700" : "border-slate-200 bg-white text-slate-600 hover:border-marun-200");

  return (
    <div>
      <PageHeader title="Rekomendasi Kampus" desc="Temukan perguruan tinggi yang menyediakan rumpun jurusan pilihanmu." />

      <p className="mb-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-300/60">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>
          Data kampus adalah <b>contoh yang perlu diverifikasi</b>: hanya nama, lokasi, jenis, dan perkiraan rumpun program studi. Kampus di daftar ini <b>bukan mitra SINAU</b>, dan skor kecocokan
          bukan peringkat mutu. Pastikan program studi, akreditasi, daya tampung, dan biaya di situs resmi kampus.
        </span>
      </p>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit p-5 lg:sticky lg:top-24">
          <h2 className="font-bold">Preferensimu</h2>
          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Rumpun jurusan (maks. 3)</legend>
            <div className="flex flex-wrap gap-1.5">
              {MAJOR_OPTIONS.map((m) => (
                <button key={m.id} aria-pressed={prefs.majors.includes(m.id)} onClick={() => toggle("majors", m.id, 3)} className={chip(prefs.majors.includes(m.id))}>
                  {short(m.id)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Diisi otomatis dari minat di profil. Belum yakin? <Link href="/app/tes-jurusan" className="font-semibold text-marun-700 hover:underline">Tes Jurusan</Link>
            </p>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Wilayah (opsional)</legend>
            <div className="flex flex-wrap gap-1.5">
              {ISLANDS.map((i) => (
                <button key={i} aria-pressed={prefs.islands.includes(i)} onClick={() => toggle("islands", i)} className={chip(prefs.islands.includes(i))}>
                  {i}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Jenis</legend>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {(["semua", "PTN", "PTS"] as const).map((t) => (
                <button key={t} aria-pressed={prefs.type === t} onClick={() => setPrefs({ ...prefs, type: t })} className={cx("flex-1 rounded-lg py-1.5 text-xs font-bold", prefs.type === t ? "bg-white text-marun-700 shadow-sm" : "text-slate-500")}>
                  {t === "semua" ? "Semua" : t}
                </button>
              ))}
            </div>
          </fieldset>
        </Card>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-xl bg-slate-100 p-1" role="tablist">
              {(["rekomendasi", "tersimpan"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("rounded-lg px-3 py-1.5 text-sm font-bold", tab === t ? "bg-white text-marun-700 shadow-sm" : "text-slate-500")}>
                  {t === "rekomendasi" ? `Rekomendasi (${results.length})` : `Tersimpan (${saved.length})`}
                </button>
              ))}
            </div>
            {tab === "rekomendasi" && (
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <label htmlFor="cari-kampus" className="sr-only">Cari kampus</label>
                <Input id="cari-kampus" value={prefs.q} onChange={(e) => setPrefs({ ...prefs, q: e.target.value })} placeholder="Cari nama kampus atau kota…" className="py-2 pl-9" />
              </div>
            )}
          </div>
          {tab === "rekomendasi" && prefs.majors.length === 0 && <p className="mt-3 text-sm text-slate-500">Pilih rumpun jurusan agar rekomendasi lebih tepat. Saat ini menampilkan semua kampus.</p>}

          <div className="mt-4">
            {list.length === 0 ? (
              tab === "tersimpan" ? (
                <EmptyState icon="Inbox" title="Belum ada kampus tersimpan" desc="Simpan kampus incaranmu agar mudah dibandingkan nanti." />
              ) : (
                <EmptyState icon="Search" title="Tidak ada kampus yang cocok" desc="Coba ubah kata kunci, wilayah, atau rumpun jurusan." />
              )
            ) : (
              <ul className="space-y-3">
                {list.map(({ uni: u, score, matched, regionOk, typeOk }) => {
                  const isSaved = d.savedUniversities.includes(u.id);
                  return (
                    <li key={u.id}>
                      <Card className="p-5">
                        <div className="flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-50 text-center text-xs font-extrabold leading-tight text-navy-700" aria-hidden>
                            {u.short.length <= 5 ? u.short : u.short.split(/\s+/).map((w) => w[0]).join("").slice(0, 4)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-extrabold">{u.name}</h2>
                              <Badge tone={u.type === "PTN" ? "navy" : "slate"}>{u.type}</Badge>
                              {u.verified ? <Badge tone="green"><ShieldCheck className="h-3 w-3" /> Terverifikasi</Badge> : <Badge tone="amber">Perlu verifikasi</Badge>}
                            </div>
                            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" /> {u.city}, {u.province}</p>
                            {tab === "rekomendasi" && prefs.majors.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                                {prefs.majors.map((m) => (
                                  <span key={m} className={cx("rounded-full px-2 py-0.5 font-semibold", matched.includes(m) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400 line-through")}>
                                    {matched.includes(m) ? "✓" : "✗"} {short(m)}
                                  </span>
                                ))}
                                {!regionOk && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">Di luar wilayah pilihan</span>}
                                {!typeOk && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">Bukan {prefs.type}</span>}
                              </div>
                            )}
                          </div>
                          {tab === "rekomendasi" && (
                            <div className="shrink-0 text-right">
                              <p className="text-2xl font-extrabold text-marun-700">{score}%</p>
                              <p className="text-[11px] text-slate-500">kecocokan</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                          <button onClick={() => toggleSaved(u.id)} aria-pressed={isSaved} className={cx("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold", isSaved ? "bg-marun-50 text-marun-700" : "text-slate-600 hover:bg-slate-100")}>
                            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />} {isSaved ? "Tersimpan" : "Simpan"}
                          </button>
                          {u.website && (
                            <a href={u.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-navy-700 hover:bg-navy-50">
                              Situs resmi <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <span className="ml-auto text-xs text-slate-400">Rumpun: {u.clusters.map(short).join(", ")}</span>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><Building2 className="h-3.5 w-3.5" /> Skor = rumpun tersedia (70) + wilayah (20) + jenis (10). Admin dapat menambah & memverifikasi data kampus.</p>
        </div>
      </div>
    </div>
  );
}
