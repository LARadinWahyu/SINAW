import type { LearningMaterial, Subject, UserData } from "./types";
import { latestPretest, recommendMaterials, topicAnalysis } from "./recommend";
import { MAJOR_OPTIONS } from "@/data/career";

/**
 * NARA — MODE DEMO
 * Jawaban disusun oleh aturan sederhana dari konten Pusat Belajar & data belajar pengguna.
 * Ini BUKAN keluaran model AI. Lihat src/app/api/nara/route.ts untuk mengaktifkan AI sungguhan.
 */

interface Ctx {
  materials: LearningMaterial[];
  subjects: Subject[];
  data: UserData | null;
  name: string;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");

const STOP = new Set(["dengan", "untuk", "adalah", "yang", "dari", "pada", "atau", "dalam", "akan", "tidak", "sebuah", "setiap", "nilai", "hasil", "lalu", "jika", "maka", "data", "contoh", "bagian", "lebih", "dapat", "menjadi"]);
const words = (s: string, min = 4) => Array.from(new Set(norm(s).split(/\s+/).filter((w) => w.length >= min && !STOP.has(w))));

/** Cocokkan teks ke materi: judul/topik/subjudul berbobot 3, kata di isi materi berbobot 1. */
function findMaterial(q: string, materials: LearningMaterial[], useBody = false) {
  const qWords = new Set(words(q, 4));
  let best: { m: LearningMaterial; score: number } | null = null;
  for (const m of materials) {
    const head = words([m.title, m.topic, ...m.sections.map((s) => s.heading)].join(" "));
    let score = head.filter((k) => qWords.has(k)).length * 3;
    if (useBody) score += words(m.sections.map((s) => `${s.body} ${s.example ?? ""}`).join(" "), 5).filter((k) => qWords.has(k)).length;
    if (score > 0 && (!best || score > best.score)) best = { m, score };
  }
  return best && best.score >= (useBody ? 2 : 1) ? best.m : null;
}

/** Kenali topik dari notasi matematika yang terlalu pendek untuk dicocokkan sebagai kata. */
function notationTopic(text: string): string | null {
  if (/\blim\b|lim\s*[_(]?\s*[a-z]\s*(→|->)/i.test(text)) return "Limit";
  if (/∫/.test(text)) return "Integral";
  if (/[a-z]\s*['′]\s*\(|d\s*\/\s*dx|\bdy\s*\/\s*dx/i.test(text)) return "Turunan";
  if (/[∧∨¬]|\b[pq]\s*(→|->|↔)\s*[pq]\b/i.test(text)) return "Logika";
  return null;
}

/** Hitung statistik sederhana bila soal memuat deret angka "a, b, c, …". */
function quickStats(text: string): string | null {
  const t = norm(text);
  const wants = { mean: /rata rata|mean/.test(t), median: /median|nilai tengah/.test(t), modus: /modus/.test(t), range: /jangkauan|range/.test(t) };
  if (!Object.values(wants).some(Boolean)) return null;
  const seq = text.match(/-?\d+(?:[.,]\d+)?(?:\s*,\s+-?\d+(?:[.,]\d+)?){2,}/);
  if (!seq) return null;
  const xs = seq[0].split(/\s*,\s+/).map((v) => Number(v.replace(",", ".")));
  if (xs.some((v) => Number.isNaN(v))) return null;
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", ","));
  const lines = [`Data (${n} nilai) diurutkan: ${s.map(fmt).join(", ")}`];
  if (wants.mean) lines.push(`Rata-rata = ${fmt(s.reduce((a, b) => a + b, 0))} ÷ ${n} = **${fmt(s.reduce((a, b) => a + b, 0) / n)}**`);
  if (wants.median) lines.push(`Median = ${n % 2 ? `nilai ke-${(n + 1) / 2}` : `rata-rata nilai ke-${n / 2} & ${n / 2 + 1}`} = **${fmt(n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2)}**`);
  if (wants.modus) {
    const c = new Map<number, number>();
    s.forEach((v) => c.set(v, (c.get(v) || 0) + 1));
    const max = Math.max(...c.values());
    const mods = [...c].filter(([, k]) => k === max).map(([v]) => v);
    lines.push(max === 1 ? "Modus: tidak ada (semua nilai muncul sekali)" : `Modus = **${mods.map(fmt).join(" dan ")}** (muncul ${max}×)`);
  }
  if (wants.range) lines.push(`Jangkauan = ${fmt(s[n - 1])} − ${fmt(s[0])} = **${fmt(s[n - 1] - s[0])}**`);
  return lines.join("\n");
}

function firstSentences(text: string, n = 2) {
  return text.replace(/\n+/g, " ").split(/(?<=\.)\s+/).slice(0, n).join(" ");
}

export function naraDemoReply(question: string, ctx: Ctx): string {
  const q = norm(question);

  // 0. Soal hasil scan / soal yang ditempel
  const soal = question.match(/^bantu jelaskan soal ini:\s*([\s\S]+)/i);
  if (soal) {
    const body = soal[1].trim();
    const nt = notationTopic(body);
    const calc = quickStats(body);
    const m =
      (nt && ctx.materials.find((x) => x.topic === nt)) ||
      findMaterial(body, ctx.materials, true) ||
      (calc ? ctx.materials.find((x) => x.topic === "Statistika Deskriptif") : undefined) ||
      null;
    const quote = body.split("\n").slice(0, 6).join("\n");
    const out = [`Aku membaca soal ini:\n\`\`\`\n${quote}\n\`\`\``];
    if (calc) out.push(`**Perhitungan:**\n\`\`\`\n${calc.replace(/\*\*/g, "")}\n\`\`\`\n_Dihitung otomatis dari angka di soal — periksa lagi bila ada angka yang salah ketik._`);
    if (m) {
      const ex = m.sections.find((x) => x.example);
      out.push(`Topik terdeteksi: **${m.topic}** (materi “${m.title}”).`);
      out.push(`**Konsep kunci:** ${firstSentences(m.sections[0].body, 2)}`);
      if (ex && !calc) out.push(`**Contoh langkah serupa:**\n\`\`\`\n${ex.example}\n\`\`\``);
      out.push(`Coba kerjakan dengan langkah di atas, lalu cocokkan dengan pilihan jawaban. Pelajari lengkapnya di materi **“${m.title}”**.`);
    } else if (!calc) {
      out.push("Aku belum mengenali topik soal ini dari materi yang tersedia. Coba ketik ulang kata kunci pentingnya (misalnya “limit”, “median”, “implikasi”).");
    }
    out.push("_Mode demo: NARA belum bisa menyelesaikan semua jenis soal secara otomatis._");
    return out.join("\n\n");
  }
  const majors = ctx.data?.profile.majors.map((id) => MAJOR_OPTIONS.find((m) => m.id === id)?.name).filter(Boolean) ?? [];

  // 1. Rencana belajar
  if (/(rencana|jadwal|plan|susun).*(belajar|minggu|harian)|rencana belajar/.test(q)) {
    const recs = recommendMaterials(ctx.materials, ctx.subjects, ctx.data, 5);
    const minutes = ctx.data?.profile.dailyMinutes ?? 30;
    if (!recs.length)
      return "Aku belum punya cukup data untuk menyusun rencana. Coba lengkapi onboarding atau kerjakan pretest dulu, ya — setelah itu rencananya bisa disesuaikan dengan hasilmu.";
    const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const lines = recs.map((r, i) => `• **${hari[i]}** — ${r.material.title} (±${r.material.minutes} menit). _${r.reason}._`);
    return [
      `Ini draf rencana belajar 5 hari dengan waktu belajar sekitar **${minutes} menit/hari**:`,
      "",
      ...lines,
      "",
      "Tips: setelah menyelesaikan materi, kerjakan kuis singkatnya agar progres dan streak tercatat. Kamu bisa menambahkan tiap sesi ke menu **Tugas & Jadwal**.",
    ].join("\n");
  }

  // 2. Hasil pretest
  if (/(pretest|hasil tes|kemampuan|level)/.test(q)) {
    const pt = latestPretest(ctx.data);
    if (!pt) return "Kamu belum mengerjakan pretest. Buka menu **Pretest** untuk mengenali kemampuan awalmu — hasilnya akan aku pakai untuk merekomendasikan materi.";
    const { mastered, weak } = topicAnalysis(pt);
    return [
      `Skor pretest terakhirmu **${pt.score}** (${pt.correct}/${pt.total} benar).`,
      mastered.length ? `Sudah cukup dikuasai: ${mastered.join(", ")}.` : "",
      weak.length ? `Perlu diperkuat: **${weak.join(", ")}**. Mulai dari materi tingkat Dasar di topik tersebut.` : "Semua topik sudah di atas ambang panduan. Lanjutkan ke materi Menengah!",
      "_Catatan: pretest ini contoh demonstrasi, bukan alat ukur psikometrik tervalidasi._",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  // 3. Rangkuman materi
  const m = findMaterial(question, ctx.materials);
  if (m && /(rangkum|ringkas|summary|intisari|poin)/.test(q)) {
    return [
      `**Rangkuman: ${m.title}**`,
      "",
      ...m.sections.map((s) => `• **${s.heading}** — ${firstSentences(s.body, 1)}`),
      "",
      `Mau latihan? Buka materinya di Pusat Belajar dan kerjakan ${m.quiz.length} soal kuisnya.`,
    ].join("\n");
  }

  // 4. Jelaskan konsep
  if (m) {
    const s = m.sections[0];
    const ex = m.sections.find((x) => x.example);
    return [
      `Oke, aku jelaskan **${m.topic}** dengan sederhana ya.`,
      "",
      firstSentences(s.body, 3),
      ex ? `\n**Contoh:**\n\`\`\`\n${ex.example}\n\`\`\`` : "",
      majors.length ? `\nKonsep ini berguna untuk jurusan seperti ${majors.slice(0, 2).join(" dan ")}.` : "",
      `\nPenjelasan lengkap ada di materi **“${m.title}”** di Pusat Belajar.`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // 5. Kuliah / adaptasi
  if (/(kuliah|maba|semester|sks|kampus|dosen|adaptasi)/.test(q)) {
    return "Masa transisi ke kuliah memang menantang: ritme belajar lebih cepat dan lebih mandiri. Tiga langkah awal yang bisa kamu lakukan:\n\n• Kenali mata kuliah semester 1 jurusanmu dan ulangi materi dasarnya.\n• Bangun kebiasaan belajar kecil setiap hari — jaga streak-mu.\n• Baca panduan Budaya Kampus di **Career Lounge** (SKS, KRS, IPK, etika menghubungi dosen).";
  }

  if (/^(halo|hai|hi|pagi|siang|sore|malam|hello)\b/.test(q.trim())) {
    return `Halo ${ctx.name.split(" ")[0]}! Aku NARA, asisten belajar SINAU. Kamu bisa minta aku menjelaskan konsep (misalnya limit atau distribusi normal), merangkum materi, atau menyusun rencana belajar.`;
  }

  return "Maaf, dalam mode demo aku hanya bisa menjawab topik yang ada di Pusat Belajar (misalnya limit, turunan, integral, statistika, peluang, logika, algoritma, ekonomi, biologi sel, SKS), merangkum materi, membaca hasil pretest, dan menyusun rencana belajar. Coba tanyakan salah satu topik itu, ya!";
}
