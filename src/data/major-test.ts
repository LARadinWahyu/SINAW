/**
 * TES KECOCOKAN JURUSAN — alat eksplorasi minat sederhana.
 * Bukan tes psikologi/psikometri yang tervalidasi. Hasil hanya titik awal untuk menjelajah jurusan
 * dan sebaiknya didiskusikan dengan guru BK, orang tua, atau mentor.
 */

export const DIMENSIONS: Record<string, { label: string; desc: string }> = {
  angka: { label: "Angka & Logika", desc: "Menikmati hitungan, pola, dan pemecahan masalah runtut." },
  teknologi: { label: "Teknologi", desc: "Tertarik pada komputer, perangkat, dan cara kerja sistem." },
  alam: { label: "Sains & Alam", desc: "Penasaran dengan fenomena alam dan eksperimen." },
  merawat: { label: "Membantu & Merawat", desc: "Senang membantu orang dan peduli kesehatan." },
  sosial: { label: "Sosial & Komunikasi", desc: "Nyaman berinteraksi, bercerita, dan memahami orang lain." },
  bisnis: { label: "Bisnis & Kepemimpinan", desc: "Suka mengatur, bernegosiasi, dan melihat peluang." },
  argumen: { label: "Analisis & Argumen", desc: "Senang berdebat, menimbang aturan, dan membaca mendalam." },
  kreatif: { label: "Kreatif & Visual", desc: "Senang menggambar, mendesain, dan mencipta karya." },
  mengajar: { label: "Mengajar & Membimbing", desc: "Senang menjelaskan sesuatu kepada orang lain." },
};

export const MAJOR_TEST_QUESTIONS: { id: string; text: string; dim: string }[] = [
  { id: "q1", text: "Saya senang mengerjakan soal matematika atau teka-teki logika.", dim: "angka" },
  { id: "q2", text: "Saya suka mencari pola dari data atau angka.", dim: "angka" },
  { id: "q3", text: "Saya penasaran bagaimana aplikasi atau situs web dibuat.", dim: "teknologi" },
  { id: "q4", text: "Saya senang mengutak-atik perangkat, komputer, atau mesin.", dim: "teknologi" },
  { id: "q5", text: "Saya menikmati praktikum atau percobaan di laboratorium.", dim: "alam" },
  { id: "q6", text: "Saya tertarik memahami fenomena alam, makhluk hidup, atau zat kimia.", dim: "alam" },
  { id: "q7", text: "Saya ingin pekerjaan yang membantu orang menjadi lebih sehat.", dim: "merawat" },
  { id: "q8", text: "Saya tetap tenang dan peduli saat ada orang yang membutuhkan pertolongan.", dim: "merawat" },
  { id: "q9", text: "Saya mudah memulai percakapan dan senang bekerja dalam kelompok.", dim: "sosial" },
  { id: "q10", text: "Saya suka menulis, membuat konten, atau menyampaikan cerita.", dim: "sosial" },
  { id: "q11", text: "Saya tertarik berjualan, memulai usaha, atau mengelola keuangan.", dim: "bisnis" },
  { id: "q12", text: "Saya sering dipercaya memimpin atau mengatur kegiatan.", dim: "bisnis" },
  { id: "q13", text: "Saya senang berdebat dan mempertahankan pendapat dengan alasan yang kuat.", dim: "argumen" },
  { id: "q14", text: "Saya tertarik memahami aturan, keadilan, dan isu sosial.", dim: "argumen" },
  { id: "q15", text: "Saya senang menggambar, mendesain, atau membuat karya visual.", dim: "kreatif" },
  { id: "q16", text: "Saya memperhatikan estetika — warna, tata letak, dan bentuk.", dim: "kreatif" },
  { id: "q17", text: "Teman sering meminta saya menjelaskan pelajaran.", dim: "mengajar" },
  { id: "q18", text: "Saya membayangkan diri saya membimbing atau mengajar orang lain.", dim: "mengajar" },
];

/** Bobot setiap dimensi minat terhadap rumpun jurusan (id MAJOR_OPTIONS). */
export const MAJOR_WEIGHTS: Record<string, Record<string, number>> = {
  informatika: { teknologi: 3, angka: 2, kreatif: 1 },
  teknik: { angka: 3, teknologi: 2, alam: 2 },
  kesehatan: { merawat: 3, alam: 2, sosial: 1 },
  ekonomi: { bisnis: 3, angka: 2, sosial: 1 },
  hukum: { argumen: 3, sosial: 1, bisnis: 1 },
  psikologi: { sosial: 2, merawat: 2, argumen: 1, mengajar: 1 },
  komunikasi: { sosial: 3, kreatif: 2, bisnis: 1 },
  sains: { alam: 3, angka: 2 },
  pendidikan: { mengajar: 3, sosial: 2 },
  desain: { kreatif: 3, teknologi: 1, sosial: 1 },
};

export const LIKERT = ["Sangat tidak sesuai", "Tidak sesuai", "Netral", "Sesuai", "Sangat sesuai"];

export function scoreMajorTest(answers: Record<string, number>) {
  const sum: Record<string, number> = {};
  const cnt: Record<string, number> = {};
  for (const q of MAJOR_TEST_QUESTIONS) {
    const a = answers[q.id];
    if (a === undefined) continue;
    sum[q.dim] = (sum[q.dim] || 0) + a; // 0..4
    cnt[q.dim] = (cnt[q.dim] || 0) + 1;
  }
  const dims: Record<string, number> = {};
  for (const d of Object.keys(DIMENSIONS)) dims[d] = cnt[d] ? Math.round((sum[d] / (cnt[d] * 4)) * 100) : 0;
  const scores: Record<string, number> = {};
  for (const [m, w] of Object.entries(MAJOR_WEIGHTS)) {
    const total = Object.values(w).reduce((a, b) => a + b, 0);
    scores[m] = Math.round(Object.entries(w).reduce((a, [d, k]) => a + dims[d] * k, 0) / total);
  }
  return { dims, scores };
}
