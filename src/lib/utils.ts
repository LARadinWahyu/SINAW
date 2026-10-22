export const uid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36));

/** Tanggal lokal format YYYY-MM-DD */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function parseDay(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, n: number): string {
  const d = parseDay(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const BULAN_PANJANG = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const hariSingkat = (d: Date) => HARI[d.getDay()].slice(0, 3);
export const namaBulan = (m: number) => BULAN_PANJANG[m];

export function formatTanggal(key: string, withDay = false): string {
  const d = parseDay(key);
  const s = `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
  return withDay ? `${HARI[d.getDay()]}, ${s}` : s;
}

export function formatRelatif(key: string): string {
  const today = dayKey();
  if (key === today) return "Hari ini";
  if (key === addDays(today, 1)) return "Besok";
  if (key === addDays(today, -1)) return "Kemarin";
  return formatTanggal(key);
}

export function sapaan(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 19) return "Selamat sore";
  return "Selamat malam";
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Simulasi deteksi email kampus (domain .ac.id / .edu). BUKAN verifikasi nyata. */
export const isCampusEmail = (email: string) => /\.(ac\.id|edu)(\.[a-z]{2})?$/i.test(email.trim());
