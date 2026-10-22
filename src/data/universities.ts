import type { CommunityEvent, University } from "@/lib/types";

/**
 * DATA KAMPUS — CONTOH, PERLU VERIFIKASI
 * Berisi beberapa perguruan tinggi yang umum dikenal, hanya dengan informasi dasar (nama, kota, jenis)
 * dan perkiraan rumpun program studi yang tersedia. Daftar ini BUKAN mitra SINAU, bukan peringkat,
 * dan tidak memuat akreditasi/daya tampung/biaya. Pastikan detail di situs resmi masing-masing kampus.
 * Admin dapat menambah, mengubah, dan menandai data sebagai terverifikasi lewat Panel Admin.
 */
export const SEED_UNIVERSITIES: University[] = [
  { id: "ui", name: "Universitas Indonesia", short: "UI", city: "Depok", province: "Jawa Barat", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.ui.ac.id", verified: false },
  { id: "itb", name: "Institut Teknologi Bandung", short: "ITB", city: "Bandung", province: "Jawa Barat", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "sains", "desain"], website: "https://www.itb.ac.id", verified: false },
  { id: "ugm", name: "Universitas Gadjah Mada", short: "UGM", city: "Sleman", province: "DI Yogyakarta", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.ugm.ac.id", verified: false },
  { id: "unpad", name: "Universitas Padjadjaran", short: "Unpad", city: "Sumedang", province: "Jawa Barat", island: "Jawa", type: "PTN", clusters: ["informatika", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.unpad.ac.id", verified: false },
  { id: "ipb", name: "IPB University", short: "IPB", city: "Bogor", province: "Jawa Barat", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "ekonomi", "komunikasi", "sains"], website: "https://www.ipb.ac.id", verified: false },
  { id: "upi", name: "Universitas Pendidikan Indonesia", short: "UPI", city: "Bandung", province: "Jawa Barat", island: "Jawa", type: "PTN", clusters: ["pendidikan", "informatika", "ekonomi", "psikologi", "komunikasi", "sains", "desain"], website: "https://www.upi.edu", verified: false },
  { id: "undip", name: "Universitas Diponegoro", short: "Undip", city: "Semarang", province: "Jawa Tengah", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.undip.ac.id", verified: false },
  { id: "uns", name: "Universitas Sebelas Maret", short: "UNS", city: "Surakarta", province: "Jawa Tengah", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "pendidikan", "sains", "desain"], website: "https://www.uns.ac.id", verified: false },
  { id: "its", name: "Institut Teknologi Sepuluh Nopember", short: "ITS", city: "Surabaya", province: "Jawa Timur", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "sains", "desain"], website: "https://www.its.ac.id", verified: false },
  { id: "unair", name: "Universitas Airlangga", short: "Unair", city: "Surabaya", province: "Jawa Timur", island: "Jawa", type: "PTN", clusters: ["informatika", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.unair.ac.id", verified: false },
  { id: "ub", name: "Universitas Brawijaya", short: "UB", city: "Malang", province: "Jawa Timur", island: "Jawa", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.ub.ac.id", verified: false },
  { id: "usu", name: "Universitas Sumatera Utara", short: "USU", city: "Medan", province: "Sumatera Utara", island: "Sumatra", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.usu.ac.id", verified: false },
  { id: "unand", name: "Universitas Andalas", short: "Unand", city: "Padang", province: "Sumatera Barat", island: "Sumatra", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "komunikasi", "sains"], website: "https://www.unand.ac.id", verified: false },
  { id: "unhas", name: "Universitas Hasanuddin", short: "Unhas", city: "Makassar", province: "Sulawesi Selatan", island: "Sulawesi", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "komunikasi", "sains"], website: "https://www.unhas.ac.id", verified: false },
  { id: "udayana", name: "Universitas Udayana", short: "Unud", city: "Badung", province: "Bali", island: "Bali & Nusa Tenggara", type: "PTN", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "sains"], website: "https://www.unud.ac.id", verified: false },
  { id: "binus", name: "BINUS University", short: "BINUS", city: "Jakarta", province: "DKI Jakarta", island: "Jawa", type: "PTS", clusters: ["informatika", "teknik", "ekonomi", "hukum", "psikologi", "komunikasi", "desain"], website: "https://binus.ac.id", verified: false },
  { id: "telu", name: "Telkom University", short: "Tel-U", city: "Bandung", province: "Jawa Barat", island: "Jawa", type: "PTS", clusters: ["informatika", "teknik", "ekonomi", "komunikasi", "desain"], website: "https://telkomuniversity.ac.id", verified: false },
  { id: "uii", name: "Universitas Islam Indonesia", short: "UII", city: "Sleman", province: "DI Yogyakarta", island: "Jawa", type: "PTS", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "psikologi", "komunikasi", "sains"], website: "https://www.uii.ac.id", verified: false },
  { id: "umy", name: "Universitas Muhammadiyah Yogyakarta", short: "UMY", city: "Bantul", province: "DI Yogyakarta", island: "Jawa", type: "PTS", clusters: ["informatika", "teknik", "kesehatan", "ekonomi", "hukum", "komunikasi", "pendidikan"], website: "https://www.umy.ac.id", verified: false },
  { id: "petra", name: "Universitas Kristen Petra", short: "UK Petra", city: "Surabaya", province: "Jawa Timur", island: "Jawa", type: "PTS", clusters: ["informatika", "teknik", "ekonomi", "komunikasi", "desain"], website: "https://www.petra.ac.id", verified: false },
];

// Jadwal sharing session belum tersedia di dokumen sumber → kosong, diisi admin.
export const SEED_EVENTS: CommunityEvent[] = [];
