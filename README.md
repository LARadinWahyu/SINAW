# SINAU — Siap Nambah Ilmu

**Kenali Kemampuanmu, Siapkan Kuliahmu.**
Website pembelajaran & habit builder untuk siswa SMA/SMK, calon mahasiswa, dan mahasiswa baru. Dibangun dengan Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide + Recharts + Zustand.

---

## 1. Menjalankan di komputer

Butuh **Node.js 18.18+** (disarankan 20).

```bash
npm install
npm run dev        # buka http://localhost:3000
```

Build produksi: `npm run build && npm start`.

## 2. Deploy ke Vercel

1. Push folder ini ke repo GitHub baru.
2. Di Vercel → **Add New → Project** → pilih repo → Framework otomatis terdeteksi **Next.js** → **Deploy**.
3. Tidak perlu environment variable apa pun untuk mode demo.
4. Setiap kali kamu `git push`, Vercel otomatis men-deploy ulang.
5. **Memperbarui versi yang sudah online:** ganti isi folder proyek lama dengan isi zip ini (kecuali `.git`, `node_modules`), lalu `git add . && git commit -m "Update fitur SINAU" && git push`. Data demo pengguna versi lama otomatis dimigrasikan.

## 3. Cara mencoba

| Akun | Cara |
|---|---|
| Pengguna baru | Klik **Mulai Belajar** → isi form daftar → Smart Onboarding → Pretest |
| Mode demo (tanpa daftar) | Halaman Masuk → **Masuk Mode Demo** |
| Admin | Halaman Masuk → **Demo sebagai Admin** → menu **Panel Admin** |

Alur utama: Landing → Daftar/Demo → Onboarding → Pretest → Jalur Belajar → Pusat Belajar (materi + video + kuis) → Smart Schedule & To-Do → Streak & Progress Tracker → Kuis & Evaluasi → NARA → Tes Jurusan → Rekomendasi Kampus → Career Lounge & Komunitas.

### Daftar fitur & lokasinya

| Fitur | Menu |
|---|---|
| Smart Schedule | Tugas & Jadwal → tab *Smart Schedule* |
| To-Do List | Tugas & Jadwal (daftar & kalender) |
| Deadline Reminder | Dashboard (kartu *Mendekati tenggat*), lonceng, Profil → Notifikasi |
| Daily Learning Streak | Streak & Pencapaian, badge api di header |
| Progress Tracker | Progress Tracker (waktu belajar dicatat otomatis di halaman materi) |
| Major Matching Test | Tes Jurusan |
| University Recommendation | Rekomendasi Kampus |
| Career Lounge | Career Lounge |
| Alumni & Mentor Community | Komunitas (diskusi, daftar mentor, sharing session) |
| Personalized Learning Path | Jalur Belajar |
| Learning Center | Pusat Belajar (video YouTube per materi diisi lewat Panel Admin) |
| Quiz & Evaluation | Kuis & Evaluasi |
| NARA AI | NARA AI (jelaskan materi, tempel soal, rencana belajar) |

## 4. Status fitur (jujur)

| Fitur | Status |
|---|---|
| Landing page, onboarding, dashboard, pusat belajar (+ video), jalur belajar, pretest, kuis & evaluasi, tugas (CRUD + kalender + Smart Schedule), pengingat tenggat, streak & badge, progress tracker, tes jurusan, rekomendasi kampus, Career Lounge, komunitas (diskusi, mentor, sharing session), profil & pengaturan, panel admin (CRUD konten, pengajuan mentor) | ✅ Berjalan & teruji |
| Penyimpanan data | ⚠️ **Mode demo** — di `localStorage` browser masing-masing (tidak hilang saat pindah halaman/refresh, tapi tidak sinkron antar-perangkat) |
| Login | ⚠️ Mode demo — kata sandi di-hash SHA-256 + salt di browser. Untuk produksi gunakan Supabase Auth |
| Login email kampus (B2B) | ⚠️ **Simulasi** — hanya mendeteksi domain `.ac.id`/`.edu`, belum ada verifikasi/SSO kampus |
| AI NARA | ⚠️ **Mode demo** — jawaban berbasis aturan dari materi & data belajar, **bukan** model AI (soal statistika sederhana dihitung sungguhan). Endpoint server untuk AI sungguhan sudah disiapkan |
| Scan soal dari foto | ⏸️ Ditunda — sementara gunakan *Tempel Soal* di NARA |
| Data kampus | ⚠️ 20 kampus contoh (nama, kota, jenis, perkiraan rumpun) berlabel *perlu verifikasi* — **bukan mitra SINAU**, bukan peringkat |
| Tes Jurusan | ⚠️ Alat eksplorasi minat sederhana, bukan tes psikologi tervalidasi |
| Mentor & sharing session | Kosong sampai ada pengajuan yang disetujui admin / jadwal dari admin (tanpa profil fiktif) |
| Notifikasi browser | ✅ Saat SINAU terbuka. Push saat aplikasi tertutup butuh backend |
| Proteksi Panel Admin | ⚠️ Dicek di sisi klien (demo). Produksi: RLS Supabase (`supabase/schema.sql`) |
| Pengingat | ✅ Di dalam aplikasi (banner + lonceng notifikasi) dan izin notifikasi browser. Email: butuh backend |
| Aplikasi mobile | 🗓️ Rencana (website sudah responsif) |

**Konten:** materi, kuis, dan soal pretest adalah **konten demo** (berlabel jelas), karena dokumen presentasi belum memuat materi kuliah terperinci. Beasiswa berupa kerangka contoh (belum terverifikasi); profil mentor/alumni kosong. Semua bisa diganti lewat **Panel Admin** tanpa mengubah kode. Data yang berasal dari presentasi: konsep, masalah, fitur, core values, target pengguna, SDG 4/10/8, dan hasil survei 28 responden.

## 5. Aturan streak

Aktivitas yang dihitung: menyelesaikan materi, mengerjakan kuis materi atau latihan soal, mengumpulkan pretest, menyelesaikan tugas. Hari dianggap aktif jika jumlah aktivitas ≥ target harian (default 1, bisa diubah). Streak = hari aktif berturut-turut; jika hari ini belum aktif, streak kemarin tetap terjaga sampai hari berganti. Logika ada di `src/lib/streak.ts`.

**Waktu belajar** (Progress Tracker) dihitung hanya saat tab materi terbuka dan pengguna aktif; berhenti setelah 2 menit tanpa aktivitas.

**Skor rekomendasi kampus** = rumpun jurusan tersedia (70) + wilayah sesuai (20) + jenis PTN/PTS sesuai (10).

## 6. Mengaktifkan AI NARA sungguhan

Isi environment variable di Vercel (Settings → Environment Variables), lalu redeploy:

```
NARA_AI_API_KEY=...   # kunci API penyedia AI (disimpan di server, tidak dikirim ke browser)
NARA_AI_MODEL=...     # nama model
```

Endpoint `src/app/api/nara/route.ts` saat ini memakai format Anthropic Messages API; ganti blok `fetch` jika memakai penyedia lain. Tanpa variabel ini NARA tetap jalan dalam mode demo.

## 7. Migrasi ke Supabase (produksi)

1. Buat project di supabase.com → SQL Editor → jalankan `supabase/schema.sql` (tabel + Row Level Security).
2. `npm install @supabase/supabase-js`, isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Ganti isi aksi di `src/lib/store.ts` (register/login/addTask/completeMaterial/dll.) dengan query Supabase — antarmuka halaman tidak perlu diubah.
4. Jadikan akun admin dengan `update user_profiles set role='admin' where id='<uuid>'`.
5. Penilaian pretest sebaiknya dipindah ke server (Edge Function) agar kunci jawaban tidak terbaca klien.

## 8. Struktur folder

```
src/
  app/                 halaman (landing, masuk, onboarding, app/*, api/nara)
  components/          AppShell, UI kit, Logo, Illustration
  data/                konten awal (materi & soal demo, jurusan, artikel)
  lib/                 store (layanan data), tipe, streak, rekomendasi, jalur belajar,
                       jadwal pintar, pengingat tenggat, progres, kampus, NARA demo
supabase/schema.sql    skema database + RLS untuk produksi
```
