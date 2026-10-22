import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpenCheck,
  Briefcase,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Flame,
  Globe2,
  GraduationCap,
  Laptop,
  ListChecks,
  MessageCircle,
  Rocket,
  Route,
  Scale,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { Halftone, Logo, LogoMark } from "@/components/Logo";

export default function Landing() {
  return (
    <>
      <LandingNav />
      <main id="konten">
        <Hero />
        <Problem />
        <Solution />
        <Values />
        <Features />
        <HowItWorks />
        <Pretest />
        <Nara />
        <Streak />
        <Career />
        <Audience />
        <Sdg />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Kicker({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? "text-amber-300" : "text-marun-600"}`}>{children}</p>;
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-marun-700 px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:pb-28">
      <Halftone className="pointer-events-none absolute -right-10 -top-6 w-[520px] text-white/15" />
      <Halftone className="pointer-events-none absolute -bottom-16 -left-24 w-[380px] rotate-180 text-black/20" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div className="fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
            <GraduationCap className="h-4 w-4 text-amber-300" /> Untuk siswa SMA/SMK, calon mahasiswa & mahasiswa baru
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Kenali Kemampuanmu, <span className="text-amber-300">Siapkan Kuliahmu.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-marun-50 sm:text-lg">
            SINAU membantu calon mahasiswa mengenali kesiapan akademik, belajar sesuai kebutuhan, dan membangun kebiasaan belajar sebelum memasuki dunia perkuliahan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/masuk?mode=daftar" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-bold text-marun-700 shadow-lift transition hover:-translate-y-0.5 hover:bg-marun-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
              Mulai Belajar <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#tentang" className="inline-flex h-12 items-center gap-2 rounded-xl px-6 font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/10">
              Kenali SINAU
            </a>
          </div>
          <p className="mt-8 text-sm font-semibold tracking-wide text-marun-100">Belajar Tepat • Tumbuh Bertahap • Lebih Siap Kuliah</p>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  const days = ["S", "S", "R", "K", "J", "S", "M"];
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label="Ilustrasi tampilan dashboard SINAU">
      <div className="absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl" aria-hidden />
      <div className="relative rotate-1 rounded-3xl bg-canvas p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="text-sm font-extrabold text-marun-700">SINAU</span>
          </div>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">Contoh tampilan</span>
        </div>
        <p className="text-lg font-extrabold text-ink">Halo, Calon Mahasiswa! 👋</p>
        <div className="mt-3 grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-2xl bg-white p-3 shadow-card">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Flame className="h-4 w-4 text-amber-500" /> Daily streak
            </div>
            <div className="mt-3 flex justify-between">
              {days.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400">{d}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${i < 5 ? "bg-marun-700" : "bg-slate-200"}`}>
                    {i < 5 && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-card">
            <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#F1E3E3" strokeWidth="4" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#9B0A0A" strokeWidth="4" strokeDasharray="94.2" strokeDashoffset="33" strokeLinecap="round" />
            </svg>
            <span className="mt-1 text-[10px] font-semibold text-slate-500">Kesiapan</span>
          </div>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-wide text-marun-600">Rekomendasi dari pretest</p>
          {["Konsep Limit Fungsi", "Distribusi Normal & Z-Score"].map((t, i) => (
            <div key={t} className="mt-2 flex items-center justify-between rounded-xl bg-canvas px-3 py-2">
              <span className="text-xs font-semibold text-ink">{t}</span>
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full bg-navy-600" style={{ width: i ? "30%" : "65%" }} />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-navy-800 p-3 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-marun-600">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-xs">
            <b>NARA:</b> “Mau aku buatkan rencana belajar minggu ini?”
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MASALAH ---------------- */
function Problem() {
  const items = [
    { icon: Zap, t: "Culture Shock", d: "Gap kecepatan belajar antara SMA dan kuliah — ritme lebih cepat dan lebih mandiri." },
    { icon: Target, t: "Garis Start Berbeda", d: "Kesenjangan dasar materi (learning gap) dari berbagai latar belakang sekolah." },
    { icon: Compass, t: "Blind Spot", d: "Minim mentor dan informasi prospek karier, sehingga berisiko salah mengambil jurusan." },
    { icon: TrendingUp, t: "Post-Exam Burnout", d: "Momentum belajar hilang setelah ujian masuk, padahal semester 1 adalah masa paling krusial." },
  ];
  return (
    <Section id="masalah">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <Kicker>Masalah yang dihadapi</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Pernah ga sih lihat mahasiswa gagal di semester 1?</h2>
          <p className="mt-4 text-slate-600">
            <b className="text-marun-700">Jangan sampai kamu mengalaminya!</b> Kurangnya persiapan adaptasi sering kali jadi bumerang di semester awal. Tanpa pengelolaan waktu dan pendampingan,
            mahasiswa baru sering kesulitan beradaptasi dan kehilangan motivasi.
          </p>
          <SurveyCard />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marun-50 text-marun-700">
                <I className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function SurveyCard() {
  // Data dari slide "Hasil Survei" presentasi SINAU (28 responden)
  const seg = [
    { v: 55.6, c: "#9B0A0A", l: "Lumayan khawatir" },
    { v: 25.9, c: "#EC9C9C", l: "Sangat khawatir" },
    { v: 18.5, c: "#1B3163", l: "Tidak khawatir" },
  ];
  let acc = 0;
  return (
    <figure className="mt-8 rounded-2xl bg-navy-800 p-5 text-white sm:p-6">
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 42 42" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label="Diagram tingkat kekhawatiran responden">
          {seg.map((s) => {
            const el = <circle key={s.l} cx="21" cy="21" r="15.9" fill="none" stroke={s.c} strokeWidth="6" strokeDasharray={`${s.v} ${100 - s.v}`} strokeDashoffset={-acc} />;
            acc += s.v;
            return el;
          })}
        </svg>
        <div>
          <p className="text-4xl font-extrabold text-amber-300">81,5%</p>
          <p className="text-sm text-navy-100">responden memiliki kekhawatiran terhadap materi kuliah.</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-1.5 text-xs text-navy-100 sm:grid-cols-3">
        {seg.map((s) => (
          <li key={s.l} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.c }} /> {s.l} ({s.v.toString().replace(".", ",")}%)
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 border-t border-white/10 pt-3 text-[11px] text-navy-200">Sumber: survei tim SINAU terhadap 28 responden, sebagaimana tercantum dalam presentasi proyek.</figcaption>
    </figure>
  );
}

/* ---------------- SOLUSI ---------------- */
function Solution() {
  const roles = ["Fasilitator transisi akademis", "Pembentukan kebiasaan konsisten", "Manajemen waktu & produktivitas", "Penjaga momentum & motivasi", "Mencegah post-exam burnout"];
  return (
    <Section id="tentang" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative overflow-hidden rounded-3xl bg-marun-700 p-8 text-white sm:p-10">
          <Halftone className="absolute -right-16 -top-10 w-80 text-white/10" />
          <Logo light />
          <p className="relative mt-6 text-lg leading-relaxed">
            Aplikasi <b>habit builder</b> dan manajemen produktivitas yang dirancang khusus untuk menjembatani masa transisi pelajar menuju dunia perkuliahan.
          </p>
          <p className="relative mt-4 text-sm text-marun-100">Berbasis pendekatan psikologis &amp; daily streak untuk melatih kemandirian akademis (self-regulated learning).</p>
        </div>
        <div>
          <Kicker>Solusi SINAU</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ubah beban belajar menjadi rutinitas harian yang memuaskan.</h2>
          <p className="mt-4 text-slate-600">
            Dilengkapi daily streak dan to-do list terfokus untuk mencegah post-exam burnout, mempertahankan momentum belajar, dan melatih kemandirian akademis. SINAU memainkan peran penting sebagai:
          </p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {roles.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm font-semibold">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-marun-600" /> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- CORE VALUES ---------------- */
function Values() {
  const v = [
    { k: "KNOW", t: "Kenali kemampuan.", d: "Mengetahui level kesiapan dan gap pengetahuan." },
    { k: "LEARN", t: "Belajar sesuai kebutuhan.", d: "Materi direkomendasikan berdasarkan jurusan dan hasil pretest." },
    { k: "GROW", t: "Berkembang bertahap.", d: "Belajar, kuis, dan evaluasi untuk melihat perkembangan." },
    { k: "READY", t: "Siap menghadapi kuliah.", d: "Membangun fondasi akademik sebelum dan saat awal semester." },
  ];
  return (
    <Section className="bg-navy-900 text-white">
      <div className="text-center">
        <Kicker light>Core values</Kicker>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Belajar Tepat • Tumbuh Bertahap • Lebih Siap Kuliah</h2>
      </div>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {v.map((x, i) => (
          <li key={x.k} className="relative rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <span className="text-xs font-bold text-navy-300">0{i + 1}</span>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-amber-300">{x.k}</p>
            <p className="mt-3 font-bold">{x.t}</p>
            <p className="mt-1 text-sm text-navy-200">{x.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- FITUR ---------------- */
function Features() {
  const f = [
    { tag: "Cepat & Mudah", icon: UserPlus, t: "Smart Onboarding", d: "Jalur B2C untuk umum dan jalur B2B lewat email kampus. Profil, jurusan, dan tujuan belajarmu menentukan isi dashboard." },
    { tag: "Anti-bosan", icon: Flame, t: "Gamification", d: "Daily streak, badge, dan to-do list harian yang menjaga konsistensi belajar — bukan sekadar mengejar angka." },
    { tag: "Siaga 24/7", icon: Sparkles, t: "AI NARA", d: "Asisten belajar untuk menjelaskan konsep, merangkum materi, dan menyusun rencana belajar." },
    { tag: "Siap Kerja", icon: Briefcase, t: "Career Lounge", d: "Eksplorasi jurusan, prospek karier, budaya kampus, beasiswa, dan ruang diskusi." },
  ];
  return (
    <Section id="fitur">
      <div className="max-w-2xl">
        <Kicker>Products &amp; Features</Kicker>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Empat fitur unggulan untuk masa transisi ke kuliah.</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {f.map(({ tag, icon: I, t, d }, i) => (
          <div key={t} className={`group flex flex-col rounded-2xl p-6 transition hover:-translate-y-1 ${i === 2 ? "bg-marun-700 text-white shadow-lift" : "border border-slate-200 bg-white shadow-card"}`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${i === 2 ? "text-amber-300" : "text-marun-600"}`}>{tag}</span>
            <I className={`mt-5 h-8 w-8 ${i === 2 ? "text-white" : "text-navy-700"}`} />
            <h3 className="mt-4 text-xl font-extrabold">{t}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${i === 2 ? "text-marun-50" : "text-slate-600"}`}>{d}</p>
          </div>
        ))}
      </div>
      <AllFeatures />
    </Section>
  );
}

function AllFeatures() {
  const groups = [
    {
      t: "Belajar",
      items: [
        [BookOpenCheck, "Learning Center", "Modul, video, dan latihan akademik."],
        [Route, "Personalized Learning Path", "Urutan modul dari jurusan & hasil pretest."],
        [ClipboardCheck, "Quiz & Evaluation", "Latihan soal dan evaluasi perkembangan."],
        [Sparkles, "AI NARA", "Jelaskan materi, bantu soal, susun rencana."],
      ],
    },
    {
      t: "Produktivitas",
      items: [
        [CalendarCheck2, "Smart Schedule", "Jadwal belajar personal otomatis."],
        [ListChecks, "To-Do List", "Tugas dan target harian."],
        [Bell, "Deadline Reminder", "Pengingat tugas yang mendekati tenggat."],
        [Flame, "Daily Learning Streak", "Dorongan konsisten belajar tiap hari."],
        [BarChart3, "Progress Tracker", "Progres modul, waktu belajar, dan tugas."],
      ],
    },
    {
      t: "Masa Depan",
      items: [
        [Compass, "Major Matching Test", "Eksplorasi kecocokan jurusan."],
        [GraduationCap, "University Recommendation", "Rekomendasi kampus sesuai jurusan."],
        [Briefcase, "Career Lounge", "Studi, karier, dan prospek masa depan."],
        [Users, "Alumni & Mentor Community", "Diskusi dengan alumni & narasumber."],
      ],
    },
  ] as const;
  return (
    <div className="mt-14">
      <h3 className="text-xl font-extrabold">Semua fitur SINAU</h3>
      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.t} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-marun-600">{g.t}</p>
            <ul className="mt-3 space-y-3">
              {g.items.map(([I, t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-marun-50 text-marun-700"><I className="h-4 w-4" /></span>
                  <span>
                    <span className="block text-sm font-bold">{t}</span>
                    <span className="block text-xs text-slate-500">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CARA KERJA ---------------- */
function HowItWorks() {
  const s = [
    { i: UserPlus, t: "Daftar & Onboarding", d: "Pilih status, jurusan yang diminati, tujuan, dan waktu belajarmu." },
    { i: ClipboardCheck, t: "Pretest", d: "Ukur pemahaman awal dan temukan topik yang perlu diperkuat." },
    { i: BookOpenCheck, t: "Belajar Terarah", d: "Pelajari materi yang direkomendasikan di Pusat Belajar." },
    { i: ListChecks, t: "Kuis & To-do", d: "Latih pemahaman dan atur jadwal belajar harian." },
    { i: Flame, t: "Jaga Streak", d: "Setiap aktivitas belajar menjaga momentum harianmu." },
    { i: BarChart3, t: "Evaluasi", d: "Pantau progres dan ulangi pretest untuk melihat perkembangan." },
  ];
  return (
    <Section id="cara-kerja" className="bg-white">
      <div className="text-center">
        <Kicker>Cara kerja</Kicker>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dari onboarding hingga evaluasi.</h2>
      </div>
      <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-marun-200 via-marun-500 to-navy-500 lg:block" aria-hidden />
        {s.map(({ i: I, t, d }, n) => (
          <li key={t} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
            <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-marun-700 shadow-card ring-1 ring-marun-100">
              <I className="h-6 w-6" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-700 text-[10px] font-bold text-white">{n + 1}</span>
            </span>
            <div>
              <h3 className="font-bold">{t}</h3>
              <p className="mt-1 text-sm text-slate-600">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- PRETEST ---------------- */
function Pretest() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker>Pretest &amp; pembelajaran personal</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Tahu harus mulai belajar dari mana.</h2>
          <p className="mt-4 text-slate-600">
            Lewat pretest dan analisis level, kamu bisa belajar secara efektif sesuai kemampuan awal. Hasilnya langsung dipakai untuk merekomendasikan materi — sesuai harapan responden yang ingin tahu
            harus mulai belajar dari mana dan mendapat materi sesuai level.
          </p>
          <ul className="mt-6 space-y-3">
            {["Analisis topik yang sudah dikuasai dan yang perlu dipelajari", "Rekomendasi materi otomatis berdasarkan hasil", "Ulangi kapan saja untuk melihat perkembangan"].map((x) => (
              <li key={x} className="flex gap-3 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-marun-600" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-bold">Contoh ringkasan hasil</p>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">Ilustrasi</span>
          </div>
          {[
            ["Limit", 100, true],
            ["Statistika Deskriptif", 100, true],
            ["Distribusi Normal", 0, false],
            ["Logika", 50, false],
          ].map(([t, v, ok]) => (
            <div key={t as string} className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t}</span>
                <span className={ok ? "font-bold text-emerald-600" : "font-bold text-marun-600"}>{ok ? "Dikuasai" : "Perlu dipelajari"}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${ok ? "bg-navy-600" : "bg-marun-500"}`} style={{ width: `${Math.max(6, v as number)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- NARA ---------------- */
function Nara() {
  return (
    <Section id="nara" className="relative overflow-hidden bg-marun-700 text-white">
      <Halftone className="pointer-events-none absolute -left-20 top-0 w-96 text-white/10" />
      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker light>AI NARA</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Narasumber akademik &amp; ruang diskusi AI.</h2>
          <p className="mt-4 text-marun-50">
            NARA membantu menjelaskan konsep yang sulit, merangkum materi, dan menyusun rencana belajar sesuai bidang studi yang kamu minati — dirancang sebagai asisten belajar yang siap kapan saja.
          </p>
          <p className="mt-4 rounded-xl bg-black/15 p-3 text-xs text-marun-100 ring-1 ring-white/15">
            Catatan: pada versi web ini NARA berjalan dalam <b>mode demo</b> (jawaban berbasis aturan dari materi SINAU), belum terhubung ke model AI.
          </p>
        </div>
        <div className="space-y-3 rounded-3xl bg-white p-5 text-ink shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marun-700 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">NARA</p>
              <p className="text-xs text-slate-500">Asisten belajar SINAU</p>
            </div>
          </div>
          <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-marun-700 px-4 py-2.5 text-sm text-white">Jelasin konsep limit dengan sederhana dong.</p>
          <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-canvas px-4 py-2.5 text-sm">
            Limit menjelaskan nilai yang <b>didekati</b> fungsi ketika x mendekati suatu titik — bukan nilai tepat di titik itu. Mau aku kasih contoh soal?
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Rangkum materi integral", "Buat rencana belajar"].map((c) => (
              <span key={c} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- STREAK ---------------- */
function Streak() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
          <div className="col-span-2 rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 font-bold">
              <CalendarCheck2 className="h-5 w-5 text-marun-600" /> To-do hari ini
            </div>
            {["Selesaikan latihan soal limit", "Baca materi distribusi normal", "Kerjakan kuis logika"].map((t, i) => (
              <div key={t} className="mt-3 flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5 text-sm">
                <span className={`h-5 w-5 rounded-md border-2 ${i === 0 ? "border-marun-700 bg-marun-700" : "border-slate-300"}`} />
                <span className={i === 0 ? "text-slate-400 line-through" : "font-semibold"}>{t}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-amber-400 p-5 text-ink">
            <Flame className="h-7 w-7" />
            <p className="mt-3 text-sm font-bold">Daily streak</p>
            <p className="text-xs">Bertambah setiap hari kamu menyelesaikan aktivitas belajar.</p>
          </div>
          <div className="rounded-2xl bg-navy-800 p-5 text-white">
            <Bell className="h-7 w-7 text-amber-300" />
            <p className="mt-3 text-sm font-bold">Pengingat</p>
            <p className="text-xs text-navy-200">Atur jam pengingat belajar sesuai waktu luangmu.</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <Kicker>Daily streak &amp; to-do list</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Konsisten sedikit setiap hari, lebih siap di semester 1.</h2>
          <p className="mt-4 text-slate-600">
            Digunakan setiap hari untuk mempertahankan daily streak dan menyelesaikan to-do list pembelajaran harian — terutama di masa jeda setelah pengumuman kelulusan (SNBP/SNBT/Jalur Mandiri)
            hingga bulan-bulan awal semester pertama.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- CAREER ---------------- */
function Career() {
  const c = [
    { i: Compass, t: "Eksplorasi jurusan", d: "Kenali mata kuliah inti dan prospek karier tiap rumpun jurusan." },
    { i: GraduationCap, t: "Budaya kampus", d: "Panduan SKS, KRS, IPK, dan etika akademik." },
    { i: Rocket, t: "Beasiswa & portofolio", d: "Informasi beasiswa dan bimbingan portofolio." },
    { i: MessageCircle, t: "Ruang diskusi", d: "Sharing session bersama sesama pengguna, alumni, dan mentor." },
  ];
  return (
    <Section id="career" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <Kicker>Career Lounge</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Kurangi risiko salah jurusan sejak awal.</h2>
          <p className="mt-4 text-slate-600">Ruang eksplorasi karier dan persiapan kuliah yang menjawab blind spot calon mahasiswa: minimnya mentor dan informasi prospek karier.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {c.map(({ i: I, t, d }) => (
            <div key={t} className="rounded-2xl bg-canvas p-5">
              <I className="h-6 w-6 text-marun-700" />
              <p className="mt-3 font-bold">{t}</p>
              <p className="mt-1 text-sm text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- TARGET & AKSES ---------------- */
function Audience() {
  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card lg:col-span-2">
          <Kicker>Untuk siapa?</Kicker>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-marun-50 p-5">
              <Users className="h-6 w-6 text-marun-700" />
              <p className="mt-3 font-bold">Siswa SMA/SMK &amp; calon mahasiswa</p>
              <p className="mt-1 text-sm text-slate-600">Jalur B2C mandiri: daftar dengan email pribadi.</p>
            </div>
            <div className="rounded-2xl bg-navy-50 p-5">
              <GraduationCap className="h-6 w-6 text-navy-700" />
              <p className="mt-3 font-bold">Mahasiswa baru</p>
              <p className="mt-1 text-sm text-slate-600">Jalur B2B kerja sama kampus dengan login email kampus (memerlukan konfigurasi kemitraan).</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-navy-800 p-6 text-white">
          <Kicker light>Di mana?</Kicker>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Laptop className="h-6 w-6 shrink-0 text-amber-300" />
              <p className="text-sm">
                <b>Website</b> — akses menyeluruh, optimal untuk eksplorasi mendalam dan pengerjaan tes.
              </p>
            </div>
            <div className="flex gap-3">
              <Smartphone className="h-6 w-6 shrink-0 text-amber-300" />
              <p className="text-sm">
                <b>Aplikasi smartphone</b> <span className="text-navy-300">(rencana)</span> — to-do list harian dan pengingat jadwal di genggaman.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- SDG ---------------- */
function Sdg() {
  const g = [
    { n: 4, t: "Pendidikan Berkualitas", c: "#C5192D", i: GraduationCap, d: "Materi kuliah dasar yang terstruktur untuk mengurangi learning gap, pretest & analisis level, serta streak dan evaluasi bertahap untuk kebiasaan belajar mandiri." },
    { n: 10, t: "Berkurangnya Kesenjangan", c: "#DD1367", i: Scale, d: "Akses belajar yang setara bagi calon mahasiswa di berbagai daerah tanpa hambatan geografis." },
    { n: 8, t: "Pekerjaan Layak & Pertumbuhan Ekonomi", c: "#A21942", i: Globe2, d: "Fondasi akademik yang kuat membantu adaptasi lebih cepat, menurunkan risiko salah jurusan, dan lebih siap menghadapi dunia kerja." },
  ];
  return (
    <Section id="sdg" className="bg-white">
      <div className="max-w-2xl">
        <Kicker>SDG&apos;s support</Kicker>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Mendukung Tujuan Pembangunan Berkelanjutan.</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {g.map(({ n, t, c, i: I, d }) => (
          <div key={n} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="flex items-center gap-3 p-5 text-white" style={{ background: c }}>
              <span className="text-4xl font-extrabold">{n}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">SDG Goal</p>
                <p className="font-bold leading-tight">{t}</p>
              </div>
              <I className="ml-auto h-7 w-7 opacity-80" />
            </div>
            <p className="p-5 text-sm leading-relaxed text-slate-600">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- CTA & FOOTER ---------------- */
function Cta() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-marun-700 px-6 py-14 text-center text-white sm:px-12">
        <Halftone className="pointer-events-none absolute -right-10 -top-10 w-96 text-white/10" />
        <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">Siap Nambah Ilmu?</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-marun-50">Mulai dari pretest singkat, lalu belajar sesuai kebutuhanmu. Bisa langsung dicoba dengan mode demo tanpa membuat akun.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/masuk?mode=daftar" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-bold text-marun-700 hover:bg-marun-50">
            Mulai Belajar <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/masuk?demo=1" className="inline-flex h-12 items-center rounded-xl px-6 font-semibold ring-1 ring-white/40 hover:bg-white/10">
            Coba Mode Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-500">Kenali Kemampuanmu, Siapkan Kuliahmu. Platform habit builder dan produktivitas akademik untuk masa transisi menuju kuliah.</p>
        </div>
        <FooterCol title="Produk" links={[["#fitur", "Fitur"], ["#cara-kerja", "Cara Kerja"], ["#nara", "AI NARA"], ["#career", "Career Lounge"]]} />
        <FooterCol title="Mulai" links={[["/masuk?mode=daftar", "Daftar"], ["/masuk", "Masuk"], ["/masuk?demo=1", "Mode Demo"]]} />
        <FooterCol title="Tentang" links={[["#tentang", "Tentang SINAU"], ["#sdg", "Dukungan SDG"], ["#masalah", "Masalah"]]} />
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} SINAU — Siap Nambah Ilmu.</p>
        <p>Versi demo: data tersimpan di browser · materi & soal bertanda “demo” bukan materi resmi.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-bold">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([h, l]) => (
          <li key={h}>
            <Link href={h} className="text-sm text-slate-500 hover:text-marun-700">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
