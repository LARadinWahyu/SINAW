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
import { Logo, LogoMark } from "@/components/Logo";

/* Gaya visual mengikuti referensi "Passion Finder": kanvas krem, lembar putih beradius besar,
   panel mesh gradient oranye, kartu miring, heading besar dengan tracking rapat. */

const H2 = "text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl";
const ICON_GRAD = "flex shrink-0 items-center justify-center rounded-full bg-passion-gradient text-white shadow-[0_10px_24px_-12px_rgba(155,10,10,.9)]";

export default function Landing() {
  return (
    <div className="min-h-screen bg-passion-sand p-2 sm:p-4">
      <LandingNav />
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-float sm:rounded-[2.5rem]">
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
      </div>
    </div>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Kicker({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-4 inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${light ? "glass-dark text-white ring-1 ring-white/25" : "bg-marun-50 text-marun-700"}`}>
      {children}
    </p>
  );
}

/** Panel mesh gradient bergaya referensi (dipakai hero, NARA, CTA). */
function Mesh({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`grain relative isolate overflow-hidden bg-passion-mesh text-white ${className}`}>{children}</div>;
}

/* ---------------- HERO ---------------- */
function Hero() {
  const days = ["S", "S", "R", "K", "J", "S", "M"];
  return (
    <Mesh className="px-5 pb-20 pt-32 sm:px-10 sm:pb-28 sm:pt-44">
      {/* kartu kaca melayang (dekorasi, desktop) */}
      <div className="pointer-events-none absolute left-[4%] top-[38%] hidden w-60 -rotate-6 rounded-[1.75rem] border border-white/40 p-4 shadow-2xl glass-dark xl:block" aria-hidden>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Flame className="h-4 w-4 text-amber-200" /> Daily streak
        </div>
        <div className="mt-3 flex justify-between">
          {days.map((d, i) => (
            <span key={i} className="flex flex-col items-center gap-1 text-[9px] text-white/70">
              {d}
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${i < 5 ? "bg-white text-marun-600" : "bg-white/25"}`}>{i < 5 && <CheckCircle2 className="h-3.5 w-3.5" />}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-[4%] top-[30%] hidden w-64 rotate-6 rounded-[1.75rem] border border-white/40 p-4 shadow-2xl glass-dark xl:block" aria-hidden>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/75">Rekomendasi dari pretest</p>
        {["Konsep Limit Fungsi", "Distribusi Normal & Z-Score"].map((t, i) => (
          <div key={t} className="mt-2.5 rounded-2xl bg-white/90 px-3 py-2 text-ink">
            <p className="text-xs font-semibold">{t}</p>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-black/10">
              <span className="block h-full rounded-full bg-passion-gradient" style={{ width: i ? "30%" : "65%" }} />
            </span>
          </div>
        ))}
      </div>

      <div className="fade-up relative mx-auto max-w-4xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/30 glass-dark">
          <GraduationCap className="h-4 w-4" /> Untuk siswa SMA/SMK, calon mahasiswa & mahasiswa baru
        </p>
        <div className="mx-auto mt-8 flex w-fit flex-col items-center">
          <LogoMark className="h-12 w-12 rounded-2xl bg-white/90 p-1.5" />
          <p className="mt-3 text-sm font-bold tracking-[0.14em]">SINAU</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.5em] text-white/70">Siap Nambah Ilmu</p>
        </div>
        <h1 className="mt-8 text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-7xl">
          Kenali Kemampuanmu.
          <br />
          <span className="text-white/85">Siapkan Kuliahmu.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
          SINAU membantu calon mahasiswa mengenali kesiapan akademik, belajar sesuai kebutuhan, dan membangun kebiasaan belajar sebelum memasuki dunia perkuliahan.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/masuk?mode=daftar" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-bold text-ink shadow-[0_14px_30px_-14px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Mulai Belajar <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#tentang" className="inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold ring-1 ring-white/40 glass-dark transition hover:bg-white/25">
            Kenali SINAU
          </a>
        </div>
        <p className="mt-9 text-sm font-semibold tracking-wide text-white/80">Belajar Tepat • Tumbuh Bertahap • Lebih Siap Kuliah</p>
      </div>
    </Mesh>
  );
}

/** Tampilan "aplikasi" di tengah lingkaran oranye, seperti mockup ponsel pada referensi. */
function AppMock() {
  const days = ["S", "S", "R", "K", "J", "S", "M"];
  return (
    <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6" aria-label="Ilustrasi tampilan dashboard SINAU">
      <div className="absolute left-1/2 top-1/2 aspect-square w-[118%] -translate-x-1/2 -translate-y-[42%] rounded-full bg-gradient-to-b from-marun-300 via-marun-500 to-marun-700 opacity-90" aria-hidden />
      <div className="relative w-full rounded-[2.25rem] border border-white/60 bg-white/85 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="text-gradient text-sm font-extrabold">SINAU</span>
          </div>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">Contoh tampilan</span>
        </div>
        <p className="text-lg font-bold tracking-tight text-ink">Halo, Calon Mahasiswa! 👋</p>
        <div className="mt-3 grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-[1.25rem] bg-passion-bg p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Flame className="h-4 w-4 text-marun-500" /> Daily streak
            </div>
            <div className="mt-3 flex justify-between">
              {days.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400">{d}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${i < 5 ? "bg-passion-gradient" : "bg-slate-200"}`}>{i < 5 && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center rounded-[1.25rem] bg-passion-bg p-3">
            <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#F1E3E3" strokeWidth="4" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#9B0A0A" strokeWidth="4" strokeDasharray="94.2" strokeDashoffset="33" strokeLinecap="round" />
            </svg>
            <span className="mt-1 text-[10px] font-semibold text-slate-500">Kesiapan</span>
          </div>
        </div>
        <div className="mt-3 rounded-[1.25rem] bg-marun-100/70 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-marun-700">Rekomendasi dari pretest</p>
          {["Konsep Limit Fungsi", "Distribusi Normal & Z-Score"].map((t, i) => (
            <div key={t} className={`mt-2 flex items-center justify-between rounded-2xl px-3 py-2 ${i === 0 ? "bg-white shadow-sm" : "bg-white/60"}`}>
              <span className="text-xs font-semibold text-ink">{t}</span>
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full bg-passion-gradient" style={{ width: i ? "30%" : "65%" }} />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-[1.25rem] bg-ink p-3 text-white">
          <span className={`${ICON_GRAD} h-8 w-8`}>
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

/** Kartu fitur miring berwarna oranye (mirip kartu "Intro course / Lessons / Exercises"). */
function TiltCards() {
  const cards = [
    { i: ClipboardCheck, t: "Pretest", d: "Kenali level & gap pengetahuanmu.", r: "-rotate-6", bg: "from-marun-700 to-marun-500" },
    { i: BookOpenCheck, t: "Belajar terarah", d: "Materi sesuai jurusan & hasil pretest.", r: "rotate-2 lg:translate-x-6", bg: "from-navy-500 via-marun-600 to-marun-400" },
    { i: Flame, t: "Daily streak", d: "Kebiasaan kecil yang konsisten.", r: "rotate-6", bg: "from-marun-600 to-marun-400" },
  ];
  return (
    <ul className="flex flex-col gap-4">
      {cards.map(({ i: I, t, d, r, bg }) => (
        <li key={t} className={`flex items-center gap-4 rounded-[1.5rem] bg-gradient-to-br ${bg} p-4 text-white shadow-[0_20px_40px_-20px_rgba(94,12,12,.6)] ${r}`}>
          <I className="h-9 w-9 shrink-0 opacity-90" strokeWidth={1.5} />
          <span>
            <span className="block text-lg font-semibold tracking-tight">{t}</span>
            <span className="block text-xs text-white/85">{d}</span>
          </span>
        </li>
      ))}
    </ul>
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
          <h2 className={H2}>Pernah ga sih lihat mahasiswa gagal di semester 1?</h2>
          <p className="mt-5 text-slate-600">
            <b className="text-marun-700">Jangan sampai kamu mengalaminya!</b> Kurangnya persiapan adaptasi sering kali jadi bumerang di semester awal. Tanpa pengelolaan waktu dan pendampingan,
            mahasiswa baru sering kesulitan beradaptasi dan kehilangan motivasi.
          </p>
          <SurveyCard />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: I, t, d }, n) => (
            <div key={t} className={`rounded-[2rem] bg-passion-bg p-6 transition hover:-translate-y-1 hover:shadow-card ${n % 2 ? "sm:translate-y-8" : ""}`}>
              <span className={`${ICON_GRAD} h-12 w-12`}>
                <I className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{t}</h3>
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
    { v: 18.5, c: "#94A8D0", l: "Tidak khawatir" },
  ];
  let acc = 0;
  return (
    <figure className="mt-8 rounded-[2rem] bg-ink p-6 text-white shadow-float sm:p-7">
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 42 42" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label="Diagram tingkat kekhawatiran responden">
          {seg.map((s) => {
            const el = <circle key={s.l} cx="21" cy="21" r="15.9" fill="none" stroke={s.c} strokeWidth="6" strokeDasharray={`${s.v} ${100 - s.v}`} strokeDashoffset={-acc} />;
            acc += s.v;
            return el;
          })}
        </svg>
        <div>
          <p className="text-5xl font-semibold tracking-tight text-amber-300">81,5%</p>
          <p className="text-sm text-white/75">responden memiliki kekhawatiran terhadap materi kuliah.</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-1.5 text-xs text-white/75 sm:grid-cols-3">
        {seg.map((s) => (
          <li key={s.l} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.c }} /> {s.l} ({s.v.toString().replace(".", ",")}%)
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 border-t border-white/10 pt-3 text-[11px] text-white/55">Sumber: survei tim SINAU terhadap 28 responden, sebagaimana tercantum dalam presentasi proyek.</figcaption>
    </figure>
  );
}

/* ---------------- SOLUSI ---------------- */
function Solution() {
  const roles = ["Fasilitator transisi akademis", "Pembentukan kebiasaan konsisten", "Manajemen waktu & produktivitas", "Penjaga momentum & motivasi", "Mencegah post-exam burnout"];
  return (
    <Section id="tentang" className="bg-passion-bg">
      <div className="mx-auto max-w-3xl text-center">
        <Kicker>Solusi SINAU</Kicker>
        <h2 className={H2}>Ubah beban belajar menjadi rutinitas harian yang memuaskan.</h2>
      </div>
      <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr_1fr]">
        <div>
          <span className={`${ICON_GRAD} h-12 w-12`}>
            <Target className="h-5 w-5" />
          </span>
          <div className="mt-5">
            <Logo />
          </div>
          <p className="mt-4 leading-relaxed text-slate-600">
            Aplikasi <b className="text-ink">habit builder</b> dan manajemen produktivitas yang dirancang khusus untuk menjembatani masa transisi pelajar menuju dunia perkuliahan.
          </p>
          <p className="mt-3 text-sm text-slate-500">Berbasis pendekatan psikologis &amp; daily streak untuk melatih kemandirian akademis (self-regulated learning).</p>
        </div>
        <AppMock />
        <TiltCards />
      </div>
      <div className="mt-16 rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
        <p className="text-slate-600">
          Dilengkapi daily streak dan to-do list terfokus untuk mencegah post-exam burnout, mempertahankan momentum belajar, dan melatih kemandirian akademis. SINAU memainkan peran penting sebagai:
        </p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {roles.map((r) => (
            <li key={r} className="inline-flex items-center gap-2 rounded-full bg-passion-bg px-4 py-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-marun-600" /> {r}
            </li>
          ))}
        </ul>
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
    <Section className="bg-passion-cream">
      <div className="text-center">
        <Kicker>Core values</Kicker>
        <h2 className="text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
          Belajar Tepat.
          <br />
          <span className="text-[#6E6862]">Tumbuh Bertahap.</span>
          <br />
          <span className="text-[#8C857D]">Lebih Siap Kuliah.</span>
        </h2>
      </div>
      <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {v.map((x, i) => (
          <li key={x.k} className={`relative rounded-[2rem] bg-white p-6 shadow-card ${i % 2 ? "lg:translate-y-6" : ""}`}>
            <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
            <p className="text-gradient mt-2 text-4xl font-semibold tracking-tight">{x.k}</p>
            <p className="mt-3 font-semibold">{x.t}</p>
            <p className="mt-1 text-sm text-slate-500">{x.d}</p>
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
        <h2 className={H2}>Empat fitur unggulan untuk masa transisi ke kuliah.</h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {f.map(({ tag, icon: I, t, d }, i) =>
          i === 2 ? (
            <Mesh key={t} className="flex flex-col rounded-[2rem] p-6 shadow-lift transition hover:-translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">{tag}</span>
              <I className="mt-6 h-9 w-9" strokeWidth={1.6} />
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/90">{d}</p>
            </Mesh>
          ) : (
            <div key={t} className="flex flex-col rounded-[2rem] bg-passion-bg p-6 transition hover:-translate-y-1 hover:shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-marun-600">{tag}</span>
              <span className={`${ICON_GRAD} mt-5 h-12 w-12`}>
                <I className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
            </div>
          ),
        )}
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
    <div className="mt-20">
      <h3 className="text-3xl font-semibold tracking-[-0.035em]">Semua fitur SINAU</h3>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.t} className="rounded-[2rem] border border-black/[0.05] bg-white p-6 shadow-card">
            <p className="inline-flex rounded-full bg-marun-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-marun-700">{g.t}</p>
            <ul className="mt-4 space-y-3.5">
              {g.items.map(([I, t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-passion-bg text-marun-600">
                    <I className="h-4 w-4" />
                  </span>
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
    <Section id="cara-kerja" className="bg-passion-bg">
      <div className="text-center">
        <Kicker>Cara kerja</Kicker>
        <h2 className={H2}>Dari onboarding hingga evaluasi.</h2>
      </div>
      <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <div className="absolute left-[8%] right-[8%] top-8 hidden h-0.5 bg-gradient-to-r from-marun-200 via-marun-500 to-navy-500 lg:block" aria-hidden />
        {s.map(({ i: I, t, d }, n) => (
          <li key={t} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
            <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-marun-600 shadow-card ring-4 ring-passion-bg">
              <I className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-passion-gradient text-[11px] font-bold text-white">{n + 1}</span>
            </span>
            <div>
              <h3 className="font-semibold">{t}</h3>
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
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker>Pretest &amp; pembelajaran personal</Kicker>
          <h2 className={H2}>Tahu harus mulai belajar dari mana.</h2>
          <p className="mt-5 text-slate-600">
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
        <div className="relative">
          <div className="absolute -inset-6 -z-0 rounded-[3rem] bg-passion-soft" aria-hidden />
          <div className="relative rounded-[2rem] border border-black/[0.05] bg-white p-7 shadow-float">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold tracking-tight">Contoh ringkasan hasil</p>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">Ilustrasi</span>
            </div>
            {[
              ["Limit", 100, true],
              ["Statistika Deskriptif", 100, true],
              ["Distribusi Normal", 0, false],
              ["Logika", 50, false],
            ].map(([t, v, ok]) => (
              <div key={t as string} className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{t}</span>
                  <span className={ok ? "font-bold text-emerald-600" : "font-bold text-marun-600"}>{ok ? "Dikuasai" : "Perlu dipelajari"}</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-black/[0.06]">
                  <div className={`h-full rounded-full ${ok ? "bg-navy-500" : "bg-passion-gradient"}`} style={{ width: `${Math.max(6, v as number)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- NARA ---------------- */
function Nara() {
  return (
    <section id="nara" className="scroll-mt-24 px-3 sm:px-6">
      <Mesh className="rounded-[2rem] px-5 py-20 sm:rounded-[2.5rem] sm:px-10 sm:py-24">
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Kicker light>AI NARA</Kicker>
            <h2 className={H2}>
              Narasumber akademik
              <br />
              <span className="text-amber-100">&amp; ruang diskusi AI.</span>
            </h2>
            <p className="mt-5 text-white/90">
              NARA membantu menjelaskan konsep yang sulit, merangkum materi, dan menyusun rencana belajar sesuai bidang studi yang kamu minati — dirancang sebagai asisten belajar yang siap kapan saja.
            </p>
            <p className="mt-5 rounded-[1.25rem] p-3.5 text-xs text-white ring-1 ring-white/25 glass-dark">
              Catatan: pada versi web ini NARA berjalan dalam <b>mode demo</b> (jawaban berbasis aturan dari materi SINAU), belum terhubung ke model AI.
            </p>
          </div>
          <div className="space-y-3 rounded-[2rem] bg-white/90 p-5 text-ink shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-3 border-b border-black/5 pb-3">
              <span className={`${ICON_GRAD} h-11 w-11`}>
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">NARA</p>
                <p className="text-xs text-slate-500">Asisten belajar SINAU</p>
              </div>
            </div>
            <p className="ml-auto max-w-[80%] rounded-3xl rounded-br-md bg-marun-600 px-4 py-2.5 text-sm text-white">Jelasin konsep limit dengan sederhana dong.</p>
            <p className="max-w-[85%] rounded-3xl rounded-bl-md bg-passion-bg px-4 py-2.5 text-sm">
              Limit menjelaskan nilai yang <b>didekati</b> fungsi ketika x mendekati suatu titik — bukan nilai tepat di titik itu. Mau aku kasih contoh soal?
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Rangkum materi integral", "Buat rencana belajar"].map((c) => (
                <span key={c} className="rounded-full bg-marun-50 px-3 py-1.5 text-xs font-semibold text-marun-700">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Mesh>
    </section>
  );
}

/* ---------------- STREAK ---------------- */
function Streak() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
          <div className="col-span-2 rounded-[2rem] bg-white p-6 shadow-float">
            <div className="flex items-center gap-2 font-semibold">
              <CalendarCheck2 className="h-5 w-5 text-marun-600" /> To-do hari ini
            </div>
            {["Selesaikan latihan soal limit", "Baca materi distribusi normal", "Kerjakan kuis logika"].map((t, i) => (
              <div key={t} className="mt-3 flex items-center gap-3 rounded-full bg-passion-bg px-4 py-2.5 text-sm">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${i === 0 ? "border-marun-500 bg-marun-500" : "border-slate-300"}`}>{i === 0 && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}</span>
                <span className={i === 0 ? "text-slate-400 line-through" : "font-semibold"}>{t}</span>
              </div>
            ))}
          </div>
          <div className="-rotate-2 rounded-[2rem] bg-passion-gradient p-5 text-white shadow-lift">
            <Flame className="h-8 w-8" strokeWidth={1.6} />
            <p className="mt-3 font-semibold">Daily streak</p>
            <p className="text-xs text-white/90">Bertambah setiap hari kamu menyelesaikan aktivitas belajar.</p>
          </div>
          <div className="rotate-2 rounded-[2rem] bg-ink p-5 text-white shadow-float">
            <Bell className="h-8 w-8 text-amber-300" strokeWidth={1.6} />
            <p className="mt-3 font-semibold">Pengingat</p>
            <p className="text-xs text-white/70">Atur jam pengingat belajar sesuai waktu luangmu.</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <Kicker>Daily streak &amp; to-do list</Kicker>
          <h2 className={H2}>Konsisten sedikit setiap hari, lebih siap di semester 1.</h2>
          <p className="mt-5 text-slate-600">
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
    <Section id="career" className="bg-passion-bg">
      <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <Kicker>Career Lounge</Kicker>
          <h2 className={H2}>
            Kurangi risiko
            <br />
            <span className="text-[#6E6862]">salah jurusan sejak awal.</span>
          </h2>
          <p className="mt-5 text-slate-600">Ruang eksplorasi karier dan persiapan kuliah yang menjawab blind spot calon mahasiswa: minimnya mentor dan informasi prospek karier.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {c.map(({ i: I, t, d }) => (
            <div key={t} className="rounded-[2rem] bg-white p-6 shadow-card transition hover:-translate-y-1">
              <span className={`${ICON_GRAD} h-11 w-11`}>
                <I className="h-5 w-5" />
              </span>
              <p className="mt-4 font-semibold">{t}</p>
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
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-passion-bg p-6 sm:p-8 lg:col-span-2">
          <Kicker>Untuk siapa?</Kicker>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-card">
              <Users className="h-6 w-6 text-marun-600" />
              <p className="mt-3 font-semibold">Siswa SMA/SMK &amp; calon mahasiswa</p>
              <p className="mt-1 text-sm text-slate-600">Jalur B2C mandiri: daftar dengan email pribadi.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-card">
              <GraduationCap className="h-6 w-6 text-navy-600" />
              <p className="mt-3 font-semibold">Mahasiswa baru</p>
              <p className="mt-1 text-sm text-slate-600">Jalur B2B kerja sama kampus dengan login email kampus (memerlukan konfigurasi kemitraan).</p>
            </div>
          </div>
        </div>
        <Mesh className="rounded-[2rem] p-6 sm:p-8">
          <Kicker light>Di mana?</Kicker>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Laptop className="h-6 w-6 shrink-0" />
              <p className="text-sm">
                <b>Website</b> — akses menyeluruh, optimal untuk eksplorasi mendalam dan pengerjaan tes.
              </p>
            </div>
            <div className="flex gap-3">
              <Smartphone className="h-6 w-6 shrink-0" />
              <p className="text-sm">
                <b>Aplikasi smartphone</b> <span className="text-white/75">(rencana)</span> — to-do list harian dan pengingat jadwal di genggaman.
              </p>
            </div>
          </div>
        </Mesh>
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
    <Section id="sdg" className="bg-passion-cream">
      <div className="max-w-2xl">
        <Kicker>SDG&apos;s support</Kicker>
        <h2 className={H2}>Mendukung Tujuan Pembangunan Berkelanjutan.</h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {g.map(({ n, t, c, i: I, d }) => (
          <div key={n} className="overflow-hidden rounded-[2rem] bg-white shadow-card">
            <div className="m-2 flex items-center gap-3 rounded-[1.6rem] p-5 text-white" style={{ background: c }}>
              <span className="text-4xl font-semibold tracking-tight">{n}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">SDG Goal</p>
                <p className="font-bold leading-tight">{t}</p>
              </div>
              <I className="ml-auto h-7 w-7 opacity-80" />
            </div>
            <p className="px-6 pb-6 pt-3 text-sm leading-relaxed text-slate-600">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- CTA & FOOTER ---------------- */
function Cta() {
  return (
    <section className="px-3 py-16 sm:px-6">
      <Mesh className="rounded-[2rem] px-6 py-20 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-24">
        {/* kartu miring dekoratif */}
        <div className="pointer-events-none absolute -left-10 top-10 hidden h-64 w-48 -rotate-12 rounded-[2rem] bg-gradient-to-br from-white/35 to-white/5 ring-1 ring-white/30 md:block" aria-hidden />
        <div className="pointer-events-none absolute -bottom-10 left-24 hidden h-48 w-40 rotate-12 rounded-[2rem] bg-gradient-to-br from-navy-400/50 to-white/10 ring-1 ring-white/25 md:block" aria-hidden />
        <div className="pointer-events-none absolute -right-8 top-8 hidden h-64 w-48 rotate-12 rounded-[2rem] bg-gradient-to-br from-white/30 to-white/5 ring-1 ring-white/30 md:block" aria-hidden />
        <div className="relative">
          <LogoMark className="mx-auto h-11 w-11 rounded-2xl bg-white/90 p-1.5" />
          <p className="mt-3 text-sm font-bold tracking-[0.14em]">SINAU</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.5em] text-white/70">Siap Nambah Ilmu</p>
          <h2 className="mt-8 text-4xl font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl">Siap Nambah Ilmu?</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/90">Mulai dari pretest singkat, lalu belajar sesuai kebutuhanmu. Bisa langsung dicoba dengan mode demo tanpa membuat akun.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/masuk?mode=daftar" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-bold text-ink shadow-[0_14px_30px_-14px_rgba(0,0,0,.45)] hover:-translate-y-0.5">
              Mulai Belajar <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/masuk?demo=1" className="inline-flex h-12 items-center rounded-full px-7 font-semibold ring-1 ring-white/40 glass-dark hover:bg-white/25">
              Coba Mode Demo
            </Link>
          </div>
        </div>
      </Mesh>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 pb-10 pt-6 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-500">Kenali Kemampuanmu, Siapkan Kuliahmu. Platform habit builder dan produktivitas akademik untuk masa transisi menuju kuliah.</p>
        </div>
        <FooterCol title="Produk" links={[["#fitur", "Fitur"], ["#cara-kerja", "Cara Kerja"], ["#nara", "AI NARA"], ["#career", "Career Lounge"]]} />
        <FooterCol title="Mulai" links={[["/masuk?mode=daftar", "Daftar"], ["/masuk", "Masuk"], ["/masuk?demo=1", "Mode Demo"]]} />
        <FooterCol title="Tentang" links={[["#tentang", "Tentang SINAU"], ["#sdg", "Dukungan SDG"], ["#masalah", "Masalah"]]} />
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-black/5 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
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
