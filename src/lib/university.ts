import type { University } from "./types";

/**
 * REKOMENDASI KAMPUS
 * Skor kecocokan (0–100) dihitung transparan dari preferensi pengguna:
 *  - 70 poin: proporsi rumpun jurusan pilihan yang tersedia di kampus
 *  - 20 poin: wilayah sesuai (atau penuh bila tidak memilih wilayah)
 *  - 10 poin: jenis PTN/PTS sesuai (atau penuh bila "semua")
 * Kampus tanpa satu pun rumpun yang dipilih tidak direkomendasikan.
 * Ini BUKAN peringkat mutu kampus.
 */

export interface UniPrefs {
  majors: string[];
  islands: string[];
  type: "semua" | "PTN" | "PTS";
  q: string;
}

export interface UniMatch {
  uni: University;
  score: number;
  matched: string[];
  regionOk: boolean;
  typeOk: boolean;
}

export function recommendUniversities(unis: University[], p: UniPrefs): UniMatch[] {
  const q = p.q.trim().toLowerCase();
  return unis
    .filter((u) => !q || `${u.name} ${u.short} ${u.city} ${u.province}`.toLowerCase().includes(q))
    .map((u) => {
      const matched = p.majors.filter((m) => u.clusters.includes(m));
      const regionOk = p.islands.length === 0 || p.islands.includes(u.island);
      const typeOk = p.type === "semua" || u.type === p.type;
      const majorPart = p.majors.length ? (matched.length / p.majors.length) * 70 : 70;
      const score = Math.round(majorPart + (regionOk ? 20 : 0) + (typeOk ? 10 : 0));
      return { uni: u, score, matched, regionOk, typeOk };
    })
    .filter((m) => p.majors.length === 0 || m.matched.length > 0)
    .sort((a, b) => b.score - a.score || Number(b.uni.verified) - Number(a.uni.verified) || a.uni.name.localeCompare(b.uni.name));
}

export const ISLANDS: University["island"][] = ["Jawa", "Sumatra", "Sulawesi", "Kalimantan", "Bali & Nusa Tenggara", "Papua & Maluku"];
