import type { LearningMaterial, PretestQuestion, Subject } from "@/lib/types";

/**
 * KONTEN DEMO — bukan materi resmi SINAU.
 * Dokumen presentasi SINAU belum memuat materi mata kuliah secara terperinci,
 * sehingga materi & soal di bawah ini hanya contoh untuk demonstrasi alur belajar.
 * Admin dapat menambah / mengubah / menghapus konten lewat Panel Admin tanpa mengubah kode.
 */

export const SEED_SUBJECTS: Subject[] = [
  {
    id: "mat",
    name: "Matematika Dasar",
    icon: "Sigma",
    color: "#9B0A0A",
    description: "Fondasi kalkulus: limit, turunan, dan integral yang dipakai di banyak mata kuliah semester 1.",
    majors: ["informatika", "teknik", "sains", "ekonomi"],
  },
  {
    id: "stat",
    name: "Statistika & Peluang",
    icon: "BarChart3",
    color: "#1B3163",
    description: "Membaca data, menghitung peluang, dan memahami distribusi — bekal hampir semua jurusan.",
    majors: ["*"],
  },
  {
    id: "logika",
    name: "Logika & Penalaran",
    icon: "Brain",
    color: "#7E0B0B",
    description: "Logika proposisi dan penalaran deduktif untuk berpikir runtut dan argumentatif.",
    majors: ["informatika", "hukum", "sains", "teknik", "psikologi"],
  },
  {
    id: "prog",
    name: "Dasar Pemrograman",
    icon: "Code2",
    color: "#26407A",
    description: "Algoritma, flowchart, variabel, dan percabangan sebelum menulis program pertama.",
    majors: ["informatika", "teknik", "sains"],
  },
  {
    id: "akad",
    name: "Keterampilan Akademik",
    icon: "GraduationCap",
    color: "#C9720C",
    description: "Ritme kuliah: SKS, manajemen waktu, membaca jurnal, dan menulis akademik.",
    majors: ["*"],
  },
  {
    id: "eko",
    name: "Pengantar Ekonomi",
    icon: "TrendingUp",
    color: "#B31616",
    description: "Konsep permintaan, penawaran, dan keseimbangan pasar.",
    majors: ["ekonomi", "hukum", "komunikasi"],
  },
  {
    id: "bio",
    name: "Biologi Dasar",
    icon: "Microscope",
    color: "#3A5795",
    description: "Sel sebagai unit dasar kehidupan — pintu masuk rumpun kesehatan dan sains hayati.",
    majors: ["kesehatan", "sains", "psikologi"],
  },
];

export const SEED_MATERIALS: LearningMaterial[] = [
  {
    id: "mat-limit",
    subjectId: "mat",
    title: "Konsep Limit Fungsi",
    description: "Memahami arti 'mendekati' dalam matematika dan cara menghitung limit sederhana.",
    minutes: 20,
    level: "Dasar",
    topic: "Limit",
    demo: true,
    sections: [
      {
        heading: "Apa itu limit?",
        body:
          "Limit menjelaskan nilai yang didekati oleh sebuah fungsi ketika variabelnya mendekati suatu titik — bukan nilai fungsi tepat di titik itu.\n\nDitulis lim x→a f(x) = L, artinya ketika x makin dekat ke a (dari kiri maupun kanan), nilai f(x) makin dekat ke L.",
        illustration: "limit",
      },
      {
        heading: "Menghitung dengan substitusi dan faktorisasi",
        body:
          "Langkah pertama selalu substitusi langsung. Jika hasilnya bentuk tak tentu 0/0, sederhanakan dulu bentuk aljabarnya (misalnya dengan faktorisasi), lalu substitusi lagi.",
        example:
          "lim x→2 (x² − 4)/(x − 2)\nSubstitusi langsung → 0/0 (tak tentu).\nFaktorkan: (x − 2)(x + 2)/(x − 2) = x + 2.\nSubstitusi x = 2 → 4. Jadi limitnya 4.",
      },
      {
        heading: "Limit kiri dan limit kanan",
        body:
          "Limit di suatu titik ada hanya jika limit kiri (x→a⁻) sama dengan limit kanan (x→a⁺). Konsep ini menjadi dasar kekontinuan dan turunan.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Nilai lim x→3 (2x + 1) adalah …", options: ["5", "6", "7", "9"], answer: 2, explanation: "Substitusi langsung: 2(3) + 1 = 7." },
      { id: "q2", prompt: "lim x→1 (x² − 1)/(x − 1) = …", options: ["0", "1", "2", "Tidak ada"], answer: 2, explanation: "(x−1)(x+1)/(x−1) = x+1 → 2." },
    ],
  },
  {
    id: "mat-turunan",
    subjectId: "mat",
    title: "Turunan & Laju Perubahan",
    description: "Turunan sebagai kemiringan garis singgung dan aturan pangkat untuk menghitungnya.",
    minutes: 25,
    level: "Menengah",
    topic: "Turunan",
    demo: true,
    sections: [
      {
        heading: "Makna turunan",
        body:
          "Turunan f'(x) mengukur laju perubahan sesaat sebuah fungsi. Secara geometris, turunan adalah kemiringan garis singgung kurva di titik tersebut.\n\nContoh nyata: jika s(t) adalah posisi, maka s'(t) adalah kecepatan.",
      },
      {
        heading: "Aturan pangkat",
        body: "Untuk f(x) = a·xⁿ, turunannya f'(x) = a·n·xⁿ⁻¹. Turunan konstanta adalah 0, dan turunan penjumlahan adalah penjumlahan turunannya.",
        example: "f(x) = 3x⁴ − 2x + 7\nf'(x) = 12x³ − 2",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Turunan dari f(x) = 5x³ adalah …", options: ["15x²", "5x²", "15x³", "3x²"], answer: 0, explanation: "5 · 3 · x² = 15x²." },
      { id: "q2", prompt: "Turunan dari konstanta 9 adalah …", options: ["9", "1", "0", "x"], answer: 2 },
    ],
  },
  {
    id: "mat-integral",
    subjectId: "mat",
    title: "Integral Tak Tentu & Tentu",
    description: "Integral sebagai kebalikan turunan dan sebagai luas daerah di bawah kurva.",
    minutes: 30,
    level: "Menengah",
    topic: "Integral",
    demo: true,
    sections: [
      {
        heading: "Integral tak tentu",
        body:
          "Integral tak tentu adalah antiturunan: mencari fungsi F(x) yang turunannya f(x). Karena turunan konstanta adalah 0, hasilnya selalu ditambah konstanta C.",
        example: "∫ 3x² dx = x³ + C",
      },
      {
        heading: "Integral tentu",
        body:
          "Integral tentu ∫ₐᵇ f(x) dx menghasilkan sebuah angka, yaitu akumulasi (luas bertanda) di bawah kurva dari a sampai b. Hitung dengan F(b) − F(a).",
        example: "∫₀² 2x dx = [x²]₀² = 4 − 0 = 4",
      },
    ],
    quiz: [
      { id: "q1", prompt: "∫ 4x³ dx = …", options: ["12x² + C", "x⁴ + C", "4x⁴ + C", "x³ + C"], answer: 1 },
      { id: "q2", prompt: "Integral tentu menghasilkan …", options: ["Fungsi baru", "Sebuah angka", "Turunan", "Konstanta C"], answer: 1 },
    ],
  },
  {
    id: "stat-deskriptif",
    subjectId: "stat",
    title: "Statistika Deskriptif",
    description: "Rata-rata, median, modus, dan simpangan untuk meringkas data.",
    minutes: 20,
    level: "Dasar",
    topic: "Statistika Deskriptif",
    demo: true,
    sections: [
      {
        heading: "Ukuran pemusatan",
        body:
          "Mean (rata-rata) = jumlah data ÷ banyak data. Median = nilai tengah setelah data diurutkan. Modus = nilai yang paling sering muncul.\n\nMedian lebih tahan terhadap pencilan (outlier) dibanding mean.",
        example: "Data: 4, 7, 7, 9, 23\nMean = 50/5 = 10\nMedian = 7\nModus = 7",
      },
      {
        heading: "Ukuran penyebaran",
        body: "Jangkauan = data terbesar − terkecil. Simpangan baku menggambarkan seberapa jauh data rata-rata menyebar dari mean.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Median dari 3, 9, 1, 5, 7 adalah …", options: ["1", "5", "7", "9"], answer: 1, explanation: "Urutkan: 1, 3, 5, 7, 9 → nilai tengah 5." },
      { id: "q2", prompt: "Ukuran yang paling tahan terhadap pencilan adalah …", options: ["Mean", "Median", "Jangkauan", "Jumlah"], answer: 1 },
    ],
  },
  {
    id: "stat-peluang",
    subjectId: "stat",
    title: "Dasar Peluang",
    description: "Ruang sampel, kejadian, dan cara menghitung peluang sederhana.",
    minutes: 20,
    level: "Dasar",
    topic: "Peluang",
    demo: true,
    sections: [
      {
        heading: "Ruang sampel dan kejadian",
        body: "Ruang sampel adalah semua hasil yang mungkin. Peluang suatu kejadian A (jika setiap hasil sama mungkin) = banyak hasil A ÷ banyak ruang sampel. Nilainya selalu antara 0 dan 1.",
        example: "Melempar satu dadu: P(bilangan genap) = 3/6 = 1/2.",
      },
      {
        heading: "Komplemen",
        body: "Peluang suatu kejadian tidak terjadi: P(Aᶜ) = 1 − P(A).",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Peluang muncul angka pada satu lemparan koin adalah …", options: ["0", "1/4", "1/2", "1"], answer: 2 },
      { id: "q2", prompt: "Jika P(A) = 0,3 maka P(bukan A) = …", options: ["0,3", "0,7", "1,3", "0"], answer: 1 },
    ],
  },
  {
    id: "stat-normal",
    subjectId: "stat",
    title: "Distribusi Normal & Z-Score",
    description: "Kurva lonceng dan cara membandingkan nilai dengan skor-z.",
    minutes: 30,
    level: "Menengah",
    topic: "Distribusi Normal",
    demo: true,
    sections: [
      {
        heading: "Kurva lonceng",
        body:
          "Distribusi normal berbentuk simetris seperti lonceng dengan puncak di mean. Aturan empiris: sekitar 68% data berada dalam ±1 simpangan baku, 95% dalam ±2, dan 99,7% dalam ±3.",
        illustration: "normal",
      },
      {
        heading: "Z-score",
        body: "Skor-z menunjukkan berapa simpangan baku sebuah nilai berada di atas atau di bawah mean: z = (x − μ) / σ.",
        example: "Nilai ujian 85, mean 70, simpangan baku 10\nz = (85 − 70)/10 = 1,5 → 1,5 simpangan baku di atas rata-rata.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Jika μ = 50, σ = 5, dan x = 60, maka z = …", options: ["1", "2", "5", "10"], answer: 1 },
      { id: "q2", prompt: "Sekitar berapa persen data berada dalam ±1σ?", options: ["50%", "68%", "95%", "99,7%"], answer: 1 },
    ],
  },
  {
    id: "logika-proposisi",
    subjectId: "logika",
    title: "Logika Proposisi & Tabel Kebenaran",
    description: "Pernyataan, konjungsi, disjungsi, implikasi, dan cara menguji nilai kebenarannya.",
    minutes: 25,
    level: "Dasar",
    topic: "Logika",
    demo: true,
    sections: [
      {
        heading: "Proposisi dan operator",
        body:
          "Proposisi adalah kalimat yang bernilai benar (B) atau salah (S). Operator dasar: negasi (¬p), konjungsi (p ∧ q), disjungsi (p ∨ q), implikasi (p → q), dan biimplikasi (p ↔ q).",
        illustration: "truth",
      },
      {
        heading: "Implikasi sering mengecoh",
        body: "p → q hanya bernilai SALAH ketika p benar dan q salah. Jika p salah, implikasi selalu benar.",
        example: "\"Jika hujan, maka jalan basah.\" Pernyataan ini tidak dilanggar pada hari tidak hujan, apa pun kondisi jalannya.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "p ∧ q bernilai benar jika …", options: ["Salah satu benar", "Keduanya benar", "Keduanya salah", "p salah"], answer: 1 },
      { id: "q2", prompt: "p → q bernilai salah ketika …", options: ["p B, q B", "p S, q B", "p B, q S", "p S, q S"], answer: 2 },
    ],
  },
  {
    id: "prog-algoritma",
    subjectId: "prog",
    title: "Algoritma & Flowchart",
    description: "Menyusun langkah penyelesaian masalah secara runtut sebelum menulis kode.",
    minutes: 20,
    level: "Dasar",
    topic: "Algoritma",
    demo: true,
    sections: [
      {
        heading: "Algoritma",
        body: "Algoritma adalah urutan langkah yang jelas, terbatas, dan menghasilkan keluaran. Sebelum menulis program, rumuskan masukan, proses, dan keluarannya.",
      },
      {
        heading: "Simbol flowchart",
        body: "Oval untuk mulai/selesai, jajar genjang untuk input/output, persegi panjang untuk proses, dan belah ketupat untuk keputusan (percabangan).",
        illustration: "flow",
        example: "Menentukan bilangan genap:\nMulai → Input n → n mod 2 = 0? → Ya: tampilkan \"Genap\" / Tidak: tampilkan \"Ganjil\" → Selesai",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Simbol flowchart untuk keputusan adalah …", options: ["Oval", "Persegi panjang", "Belah ketupat", "Jajar genjang"], answer: 2 },
      { id: "q2", prompt: "Ciri algoritma yang baik adalah …", options: ["Langkahnya tak terbatas", "Langkahnya jelas dan berhenti", "Tanpa keluaran", "Acak"], answer: 1 },
    ],
  },
  {
    id: "prog-variabel",
    subjectId: "prog",
    title: "Variabel, Tipe Data & Percabangan",
    description: "Menyimpan nilai, mengenali tipe data, dan membuat keputusan dengan if-else.",
    minutes: 25,
    level: "Dasar",
    topic: "Algoritma",
    demo: true,
    sections: [
      {
        heading: "Variabel dan tipe data",
        body: "Variabel adalah nama untuk menyimpan nilai. Tipe data umum: bilangan bulat (int), desimal (float), teks (string), dan benar/salah (boolean).",
        example: "nama = \"Rani\"\numur = 18\nlulus = True",
      },
      {
        heading: "Percabangan",
        body: "Percabangan membuat program memilih jalur berdasarkan kondisi.",
        example: "if nilai >= 75:\n    print(\"Tuntas\")\nelse:\n    print(\"Remedial\")",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Tipe data untuk nilai True/False adalah …", options: ["int", "string", "boolean", "float"], answer: 2 },
      { id: "q2", prompt: "Jika nilai = 70, program contoh mencetak …", options: ["Tuntas", "Remedial", "Error", "Tidak ada"], answer: 1 },
    ],
  },
  {
    id: "akad-waktu",
    subjectId: "akad",
    title: "SKS & Manajemen Waktu Kuliah",
    description: "Memahami beban SKS dan menyusun ritme belajar mandiri mingguan.",
    minutes: 15,
    level: "Dasar",
    topic: "Keterampilan Akademik",
    demo: true,
    sections: [
      {
        heading: "Satu SKS bukan hanya jam di kelas",
        body:
          "Di banyak kampus, 1 SKS mencakup kegiatan tatap muka, penugasan terstruktur, dan belajar mandiri. Artinya, waktu belajar di luar kelas sama pentingnya dengan kehadiran. Cek aturan resmi kampusmu karena rinciannya bisa berbeda.",
        illustration: "time",
      },
      {
        heading: "Susun blok belajar",
        body: "Gunakan blok 25–50 menit dengan jeda singkat, tetapkan satu tujuan per blok, dan catat tenggat tugas sejak awal semester di to-do list.",
        example: "Senin 19.00–19.50 → Ulang materi Kalkulus bab 1\nSelasa 20.00–20.30 → Latihan 5 soal limit",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Kegiatan yang umumnya termasuk dalam beban SKS adalah …", options: ["Hanya tatap muka", "Tatap muka, tugas terstruktur, dan belajar mandiri", "Hanya ujian", "Hanya praktikum"], answer: 1 },
      { id: "q2", prompt: "Strategi blok belajar yang dianjurkan adalah …", options: ["Belajar 5 jam tanpa jeda", "Blok pendek dengan satu tujuan", "Belajar hanya saat ujian", "Multitasking"], answer: 1 },
    ],
  },
  {
    id: "akad-jurnal",
    subjectId: "akad",
    title: "Membaca Jurnal & Menulis Akademik",
    description: "Struktur artikel ilmiah, cara membaca cepat, dan etika mengutip.",
    minutes: 20,
    level: "Menengah",
    topic: "Keterampilan Akademik",
    demo: true,
    sections: [
      {
        heading: "Struktur artikel ilmiah",
        body: "Umumnya: Abstrak, Pendahuluan, Metode, Hasil, Pembahasan, Simpulan, Daftar Pustaka. Baca abstrak dan simpulan terlebih dahulu untuk menilai relevansi.",
        illustration: "paper",
      },
      {
        heading: "Mengutip dengan benar",
        body: "Setiap ide atau data dari sumber lain wajib dicantumkan sumbernya sesuai gaya sitasi yang diminta dosen (misalnya APA). Parafrase tetap perlu sitasi.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Bagian yang dibaca pertama untuk menilai relevansi artikel adalah …", options: ["Metode", "Abstrak & simpulan", "Daftar pustaka", "Lampiran"], answer: 1 },
      { id: "q2", prompt: "Parafrase dari sumber lain …", options: ["Tidak perlu sitasi", "Tetap perlu sitasi", "Dilarang", "Hanya untuk jurnal asing"], answer: 1 },
    ],
  },
  {
    id: "eko-permintaan",
    subjectId: "eko",
    title: "Permintaan, Penawaran & Keseimbangan",
    description: "Hukum permintaan dan penawaran serta titik keseimbangan pasar.",
    minutes: 20,
    level: "Dasar",
    topic: "Ekonomi",
    demo: true,
    sections: [
      {
        heading: "Hukum permintaan dan penawaran",
        body: "Ceteris paribus, ketika harga naik jumlah barang yang diminta turun, sedangkan jumlah yang ditawarkan naik. Keseimbangan terjadi saat jumlah diminta sama dengan jumlah ditawarkan.",
        illustration: "supply",
      },
      {
        heading: "Contoh perhitungan",
        body: "Titik keseimbangan dicari dengan menyamakan fungsi permintaan dan penawaran.",
        example: "Qd = 100 − 2P dan Qs = 20 + 2P\n100 − 2P = 20 + 2P → P = 20, Q = 60",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Menurut hukum permintaan, jika harga naik maka jumlah diminta …", options: ["Naik", "Turun", "Tetap", "Nol"], answer: 1 },
      { id: "q2", prompt: "Qd = 50 − P, Qs = 10 + P. Harga keseimbangan P = …", options: ["10", "20", "30", "40"], answer: 1 },
    ],
  },
  {
    id: "bio-sel",
    subjectId: "bio",
    title: "Sel: Unit Dasar Kehidupan",
    description: "Perbedaan sel prokariotik dan eukariotik serta fungsi organel utama.",
    minutes: 20,
    level: "Dasar",
    topic: "Biologi",
    demo: true,
    sections: [
      {
        heading: "Prokariotik vs eukariotik",
        body: "Sel prokariotik (misalnya bakteri) tidak memiliki inti sel bermembran. Sel eukariotik (hewan, tumbuhan, jamur) memiliki inti dan organel bermembran.",
        illustration: "cell",
      },
      {
        heading: "Organel penting",
        body: "Mitokondria menghasilkan energi (ATP), ribosom menyintesis protein, retikulum endoplasma dan badan Golgi memproses serta mengemas protein, kloroplas (pada tumbuhan) melakukan fotosintesis.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Organel penghasil energi (ATP) adalah …", options: ["Ribosom", "Mitokondria", "Golgi", "Lisosom"], answer: 1 },
      { id: "q2", prompt: "Sel bakteri termasuk sel …", options: ["Eukariotik", "Prokariotik", "Tumbuhan", "Hewan"], answer: 1 },
    ],
  },
];

/** Bank soal pretest — DEMO. Dapat dikelola di Panel Admin → Bank Soal. */
export const SEED_PRETEST: PretestQuestion[] = [
  { id: "p1", subjectId: "mat", topic: "Limit", prompt: "lim x→4 (x² − 16)/(x − 4) = …", options: ["0", "4", "8", "16"], answer: 2, explanation: "Faktorkan menjadi x + 4 lalu substitusi x = 4." },
  { id: "p2", subjectId: "mat", topic: "Limit", prompt: "Limit suatu fungsi di x = a ada jika …", options: ["f(a) terdefinisi", "Limit kiri = limit kanan", "f(a) = 0", "Fungsi linear"], answer: 1 },
  { id: "p3", subjectId: "mat", topic: "Turunan", prompt: "Turunan dari f(x) = x⁴ − 3x adalah …", options: ["4x³ − 3", "x³ − 3", "4x³", "4x⁴ − 3"], answer: 0 },
  { id: "p4", subjectId: "mat", topic: "Integral", prompt: "∫₁³ 2 dx = …", options: ["2", "4", "6", "8"], answer: 1, explanation: "[2x]₁³ = 6 − 2 = 4." },
  { id: "p5", subjectId: "stat", topic: "Statistika Deskriptif", prompt: "Rata-rata dari 2, 4, 6, 8 adalah …", options: ["4", "5", "6", "20"], answer: 1 },
  { id: "p6", subjectId: "stat", topic: "Peluang", prompt: "Dua koin dilempar. Peluang keduanya gambar adalah …", options: ["1/2", "1/3", "1/4", "3/4"], answer: 2 },
  { id: "p7", subjectId: "stat", topic: "Distribusi Normal", prompt: "μ = 60, σ = 8, x = 52. Nilai z = …", options: ["−1", "1", "−8", "0,5"], answer: 0 },
  { id: "p8", subjectId: "logika", topic: "Logika", prompt: "Negasi dari \"Semua mahasiswa hadir\" adalah …", options: ["Semua mahasiswa tidak hadir", "Ada mahasiswa yang tidak hadir", "Tidak ada mahasiswa hadir", "Ada mahasiswa hadir"], answer: 1 },
  { id: "p9", subjectId: "logika", topic: "Logika", prompt: "Jika p salah dan q benar, nilai p → q adalah …", options: ["Benar", "Salah", "Tak tentu", "Tidak bisa ditentukan"], answer: 0 },
  { id: "p10", subjectId: "prog", topic: "Algoritma", prompt: "Dalam flowchart, simbol jajar genjang digunakan untuk …", options: ["Keputusan", "Proses", "Input/Output", "Mulai/Selesai"], answer: 2 },
  { id: "p11", subjectId: "akad", topic: "Keterampilan Akademik", prompt: "Cara paling efektif menyaring artikel jurnal yang relevan adalah …", options: ["Membaca semua halaman", "Membaca abstrak dan simpulan dulu", "Melihat jumlah halaman", "Membaca daftar pustaka"], answer: 1 },
  { id: "p12", subjectId: "eko", topic: "Ekonomi", prompt: "Keseimbangan pasar terjadi ketika …", options: ["Harga tertinggi", "Jumlah diminta = jumlah ditawarkan", "Penawaran nol", "Permintaan naik"], answer: 1 },
  { id: "p13", subjectId: "bio", topic: "Biologi", prompt: "Ciri sel eukariotik adalah …", options: ["Tidak punya inti", "Punya inti bermembran", "Hanya pada bakteri", "Tidak punya ribosom"], answer: 1 },
];
