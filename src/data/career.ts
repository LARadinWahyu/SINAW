import type { Announcement, CareerArticle, Major, Mentor, Scholarship } from "@/lib/types";

/**
 * KONTEN CONTOH untuk Career Lounge.
 * Deskripsi jurusan dan prospek karier bersifat umum (bukan data kampus tertentu).
 * Beasiswa & mentor TIDAK diisi data nyata karena belum tersedia di dokumen sumber —
 * admin dapat menambahkan data terverifikasi lewat Panel Admin.
 */

export const MAJOR_OPTIONS = [
  { id: "informatika", name: "Informatika / Sistem Informasi" },
  { id: "teknik", name: "Teknik (Sipil, Mesin, Elektro, Industri)" },
  { id: "kesehatan", name: "Kesehatan (Kedokteran, Farmasi, Keperawatan)" },
  { id: "ekonomi", name: "Ekonomi, Manajemen & Akuntansi" },
  { id: "hukum", name: "Hukum" },
  { id: "psikologi", name: "Psikologi" },
  { id: "komunikasi", name: "Ilmu Komunikasi & Sosial" },
  { id: "sains", name: "Sains (Matematika, Fisika, Kimia, Biologi)" },
  { id: "pendidikan", name: "Pendidikan / Keguruan" },
  { id: "desain", name: "Desain & Seni" },
];

export const SEED_MAJORS: Major[] = [
  {
    id: "informatika",
    name: "Informatika / Sistem Informasi",
    cluster: "Saintek",
    description: "Mempelajari komputasi, pemrograman, basis data, dan perancangan sistem informasi untuk memecahkan masalah dengan teknologi.",
    subjects: ["Matematika Diskrit", "Algoritma & Pemrograman", "Basis Data", "Statistika"],
    careers: ["Software Engineer", "Data Analyst", "System Analyst", "UI/UX Designer", "IT Consultant"],
    demo: true,
  },
  {
    id: "teknik",
    name: "Teknik",
    cluster: "Saintek",
    description: "Menerapkan matematika dan sains untuk merancang, membangun, dan memelihara struktur, mesin, maupun sistem.",
    subjects: ["Kalkulus", "Fisika Dasar", "Menggambar Teknik", "Statika"],
    careers: ["Insinyur Proyek", "Quality Engineer", "Konsultan Teknik", "Peneliti"],
    demo: true,
  },
  {
    id: "kesehatan",
    name: "Rumpun Kesehatan",
    cluster: "Saintek",
    description: "Mempelajari tubuh manusia, penyakit, dan pelayanan kesehatan. Umumnya memiliki praktikum dan tahap profesi.",
    subjects: ["Biologi Sel", "Anatomi", "Biokimia", "Statistika Kesehatan"],
    careers: ["Dokter", "Apoteker", "Perawat", "Tenaga Kesehatan Masyarakat"],
    demo: true,
  },
  {
    id: "ekonomi",
    name: "Ekonomi, Manajemen & Akuntansi",
    cluster: "Soshum",
    description: "Mempelajari perilaku ekonomi, pengelolaan organisasi, keuangan, dan pelaporan bisnis.",
    subjects: ["Pengantar Ekonomi", "Matematika Ekonomi", "Statistika Bisnis", "Pengantar Akuntansi"],
    careers: ["Analis Keuangan", "Akuntan", "Marketing", "Wirausaha", "Konsultan Bisnis"],
    demo: true,
  },
  {
    id: "hukum",
    name: "Hukum",
    cluster: "Soshum",
    description: "Mempelajari sistem norma, peraturan perundang-undangan, dan penalaran hukum.",
    subjects: ["Pengantar Ilmu Hukum", "Logika & Penalaran", "Hukum Perdata", "Hukum Pidana"],
    careers: ["Advokat", "Notaris", "Legal Officer", "Hakim / Jaksa"],
    demo: true,
  },
  {
    id: "psikologi",
    name: "Psikologi",
    cluster: "Soshum",
    description: "Mempelajari perilaku dan proses mental manusia, termasuk metode penelitian dan statistika.",
    subjects: ["Psikologi Umum", "Statistika", "Biopsikologi", "Metode Penelitian"],
    careers: ["HR / People Development", "Peneliti", "Konselor (melalui jenjang profesi)", "UX Researcher"],
    demo: true,
  },
  {
    id: "komunikasi",
    name: "Ilmu Komunikasi",
    cluster: "Soshum",
    description: "Mempelajari proses penyampaian pesan, media, jurnalistik, dan hubungan masyarakat.",
    subjects: ["Pengantar Komunikasi", "Penulisan Kreatif", "Riset Komunikasi"],
    careers: ["Public Relations", "Jurnalis", "Content Strategist", "Digital Marketer"],
    demo: true,
  },
  {
    id: "sains",
    name: "Sains Murni (MIPA)",
    cluster: "Saintek",
    description: "Mendalami matematika, fisika, kimia, atau biologi secara teoretis dan eksperimental.",
    subjects: ["Kalkulus", "Fisika/Kimia/Biologi Dasar", "Statistika", "Praktikum"],
    careers: ["Peneliti", "Analis Laboratorium", "Data Scientist", "Pendidik"],
    demo: true,
  },
];

export const SEED_ARTICLES: CareerArticle[] = [
  {
    id: "a1",
    title: "Kamus Kampus: SKS, KRS, IPK, dan Istilah Lain",
    category: "Budaya Kampus",
    summary: "Istilah yang akan sering kamu dengar di minggu pertama kuliah.",
    minutes: 5,
    demo: true,
    body:
      "SKS (Satuan Kredit Semester) adalah satuan beban belajar sebuah mata kuliah.\n\nKRS (Kartu Rencana Studi) adalah daftar mata kuliah yang kamu ambil pada satu semester — biasanya diisi di sistem akademik kampus dan disetujui dosen wali.\n\nIPK (Indeks Prestasi Kumulatif) adalah rata-rata nilai seluruh semester, sedangkan IP adalah nilai satu semester.\n\nDosen wali / pembimbing akademik membantumu merencanakan studi. Detail aturan setiap kampus berbeda, jadi selalu baca buku panduan akademik kampusmu.",
  },
  {
    id: "a2",
    title: "Etika Menghubungi Dosen Lewat Email atau Chat",
    category: "Budaya Kampus",
    summary: "Format pesan yang sopan dan jelas agar cepat ditanggapi.",
    minutes: 4,
    demo: true,
    body:
      "Gunakan salam pembuka dan perkenalkan diri (nama, NIM, kelas/mata kuliah).\n\nSampaikan keperluan secara singkat dan spesifik dalam satu pesan.\n\nKirim pada jam kerja, hindari mengirim pesan berulang dalam waktu dekat, dan tutup dengan ucapan terima kasih.",
  },
  {
    id: "a3",
    title: "Checklist Sebelum Semester 1 Dimulai",
    category: "Persiapan Kuliah",
    summary: "Hal-hal praktis yang sebaiknya kamu siapkan di masa jeda setelah pengumuman kelulusan.",
    minutes: 6,
    demo: true,
    body:
      "Kenali kurikulum semester 1 jurusanmu dan mata kuliah dasarnya.\n\nUlangi materi dasar yang relevan (misalnya matematika atau statistika) lewat pretest dan Pusat Belajar.\n\nBangun rutinitas belajar harian kecil sejak sekarang agar momentum belajar tidak hilang setelah ujian masuk.\n\nSiapkan akun dan perangkat yang dibutuhkan, lalu catat agenda penting kampus di to-do list.",
  },
  {
    id: "a4",
    title: "Mengenal Minatmu Sebelum Memantapkan Jurusan",
    category: "Minat & Jurusan",
    summary: "Pertanyaan reflektif untuk mengurangi risiko salah jurusan.",
    minutes: 5,
    demo: true,
    body:
      "Mata pelajaran apa yang membuatmu lupa waktu saat mengerjakannya?\n\nMasalah seperti apa yang ingin kamu selesaikan di masa depan?\n\nApakah kamu lebih menikmati bekerja dengan angka, orang, ide, atau benda?\n\nCocokkan jawabanmu dengan mata kuliah inti setiap jurusan di Eksplorasi Jurusan, lalu diskusikan dengan orang yang menjalaninya.",
  },
  {
    id: "a5",
    title: "Membangun Portofolio Sejak Mahasiswa Baru",
    category: "Karier",
    summary: "Portofolio tidak harus menunggu tingkat akhir.",
    minutes: 4,
    demo: true,
    body:
      "Dokumentasikan tugas atau proyek terbaikmu sejak semester 1.\n\nIkuti organisasi, kepanitiaan, atau lomba yang relevan dengan minat kariermu.\n\nCatat keterampilan yang kamu pelajari dan hasil yang bisa diukur dari setiap kegiatan.",
  },
];

// Belum ada data beasiswa terverifikasi di dokumen sumber → contoh kerangka saja.
export const SEED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "s1",
    name: "[Contoh] Beasiswa Pemerintah untuk Mahasiswa Baru",
    provider: "Perlu diisi admin",
    description: "Kerangka entri beasiswa. Admin perlu mengisi nama program, syarat, periode, dan tautan resmi yang terverifikasi.",
    link: "",
    verified: false,
  },
  {
    id: "s2",
    name: "[Contoh] Beasiswa Prestasi dari Kampus Mitra",
    provider: "Perlu diisi admin",
    description: "Kerangka entri beasiswa internal kampus. Belum ada kampus mitra yang terkonfirmasi.",
    link: "",
    verified: false,
  },
];

// Profil mentor/alumni belum tersedia di dokumen → kosong (empty state).
export const SEED_MENTORS: Mentor[] = [];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "n1",
    title: "Selamat datang di SINAU (versi demo)",
    body: "Website ini masih mode demo: data tersimpan di browser kamu. Materi dan soal yang tersedia adalah contoh demonstrasi.",
    date: "2026-10-21",
  },
];
