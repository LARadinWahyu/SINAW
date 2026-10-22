import type { MaterialSection } from "@/lib/types";

const M = "#9B0A0A";
const N = "#1B3163";
const L = "#E1E7F3";

export function Illustration({ kind }: { kind: NonNullable<MaterialSection["illustration"]> }) {
  const wrap = (children: React.ReactNode, caption: string) => (
    <figure className="my-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-navy-50/60 p-4">
      <svg viewBox="0 0 320 160" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={caption}>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-slate-500">{caption}</figcaption>
    </figure>
  );
  const axes = (
    <>
      <line x1="30" y1="140" x2="300" y2="140" stroke={N} strokeWidth="1.5" />
      <line x1="30" y1="140" x2="30" y2="12" stroke={N} strokeWidth="1.5" />
    </>
  );
  switch (kind) {
    case "limit":
      return wrap(
        <>
          {axes}
          <path d="M40 130 Q120 110 170 70 T290 20" fill="none" stroke={N} strokeWidth="2.5" />
          <line x1="170" y1="140" x2="170" y2="70" stroke={M} strokeDasharray="4 4" />
          <line x1="30" y1="70" x2="170" y2="70" stroke={M} strokeDasharray="4 4" />
          <circle cx="170" cy="70" r="5" fill="#fff" stroke={M} strokeWidth="2" />
          <path d="M120 150 L160 150" stroke={M} strokeWidth="2" markerEnd="url(#a)" />
          <path d="M225 150 L182 150" stroke={M} strokeWidth="2" markerEnd="url(#a)" />
          <defs>
            <marker id="a" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10z" fill={M} />
            </marker>
          </defs>
          <text x="165" y="158" fontSize="10" fill={M}>a</text>
          <text x="12" y="74" fontSize="10" fill={M}>L</text>
        </>,
        "x mendekati a dari kiri dan kanan → f(x) mendekati L (titik kosong: f(a) boleh tidak terdefinisi)",
      );
    case "normal": {
      const pts = Array.from({ length: 81 }, (_, i) => {
        const x = -4 + i * 0.1;
        return `${160 + x * 34},${140 - 120 * Math.exp(-(x * x) / 2)}`;
      }).join(" ");
      return wrap(
        <>
          <rect x={160 - 34} y="10" width="68" height="130" fill={M} opacity="0.12" />
          <rect x={160 - 68} y="10" width="136" height="130" fill={M} opacity="0.06" />
          <polyline points={pts} fill="none" stroke={N} strokeWidth="2.5" />
          <line x1="20" y1="140" x2="300" y2="140" stroke={N} />
          <line x1="160" y1="20" x2="160" y2="140" stroke={M} strokeDasharray="4 4" />
          {[-2, -1, 0, 1, 2].map((k) => (
            <text key={k} x={160 + k * 34 - 6} y="154" fontSize="9" fill={N}>{k === 0 ? "μ" : `${k > 0 ? "+" : "−"}${Math.abs(k)}σ`}</text>
          ))}
          <text x="146" y="80" fontSize="11" fontWeight="700" fill={M}>68%</text>
          <text x="236" y="120" fontSize="9" fill={M}>95% (±2σ)</text>
        </>,
        "Kurva normal: ±1σ memuat sekitar 68% data, ±2σ sekitar 95%",
      );
    }
    case "truth": {
      const rows = [["B", "B", "B", "B", "B"], ["B", "S", "S", "B", "S"], ["S", "B", "S", "B", "B"], ["S", "S", "S", "S", "B"]];
      const head = ["p", "q", "p∧q", "p∨q", "p→q"];
      return wrap(
        <>
          {head.map((h, i) => (
            <g key={h}>
              <rect x={20 + i * 57} y="10" width="54" height="26" rx="6" fill={i < 2 ? N : M} />
              <text x={47 + i * 57} y="28" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="700">{h}</text>
            </g>
          ))}
          {rows.map((r, ri) =>
            r.map((v, ci) => (
              <g key={`${ri}${ci}`}>
                <rect x={20 + ci * 57} y={42 + ri * 28} width="54" height="24" rx="6" fill={v === "B" ? L : "#FBE4E4"} />
                <text x={47 + ci * 57} y={58 + ri * 28} fontSize="12" textAnchor="middle" fill={v === "B" ? N : M} fontWeight="600">{v}</text>
              </g>
            )),
          )}
        </>,
        "Tabel kebenaran (B = benar, S = salah)",
      );
    }
    case "flow":
      return wrap(
        <>
          <rect x="10" y="62" width="50" height="30" rx="15" fill={N} />
          <text x="35" y="81" fontSize="10" fill="#fff" textAnchor="middle">Mulai</text>
          <path d="M80 62 L130 62 L120 92 L70 92Z" fill={L} stroke={N} />
          <text x="100" y="81" fontSize="10" fill={N} textAnchor="middle">Input n</text>
          <path d="M190 45 L230 77 L190 109 L150 77Z" fill="#FBE4E4" stroke={M} />
          <text x="190" y="80" fontSize="9" fill={M} textAnchor="middle">n mod 2=0?</text>
          <rect x="250" y="20" width="62" height="28" rx="6" fill={L} stroke={N} />
          <text x="281" y="38" fontSize="10" fill={N} textAnchor="middle">Genap</text>
          <rect x="250" y="106" width="62" height="28" rx="6" fill={L} stroke={N} />
          <text x="281" y="124" fontSize="10" fill={N} textAnchor="middle">Ganjil</text>
          <g stroke={N} strokeWidth="1.5" fill="none">
            <path d="M60 77 L75 77" />
            <path d="M125 77 L150 77" />
            <path d="M210 61 L250 34" />
            <path d="M210 93 L250 120" />
          </g>
          <text x="222" y="42" fontSize="9" fill={M}>Ya</text>
          <text x="218" y="122" fontSize="9" fill={M}>Tidak</text>
        </>,
        "Flowchart: oval (mulai), jajar genjang (input), belah ketupat (keputusan), persegi (proses/output)",
      );
    case "time": {
      const days = ["Sen", "Sel", "Rab", "Kam", "Jum"];
      return wrap(
        <>
          {days.map((d, i) => (
            <g key={d}>
              <text x={45 + i * 58} y="20" fontSize="10" fill={N} textAnchor="middle" fontWeight="700">{d}</text>
              <rect x={20 + i * 58} y="28" width="50" height="34" rx="6" fill={N} opacity="0.85" />
              <rect x={20 + i * 58} y="66" width="50" height={i % 2 ? 26 : 40} rx="6" fill={M} opacity="0.75" />
              <rect x={20 + i * 58} y={i % 2 ? 96 : 110} width="50" height="20" rx="6" fill="#F8B13A" opacity="0.8" />
            </g>
          ))}
          <g fontSize="9">
            <rect x="20" y="140" width="10" height="10" fill={N} /><text x="34" y="149" fill={N}>Kelas</text>
            <rect x="90" y="140" width="10" height="10" fill={M} /><text x="104" y="149" fill={N}>Tugas terstruktur</text>
            <rect x="200" y="140" width="10" height="10" fill="#F8B13A" /><text x="214" y="149" fill={N}>Belajar mandiri</text>
          </g>
        </>,
        "Ilustrasi blok mingguan: waktu di luar kelas juga bagian dari beban studi",
      );
    }
    case "supply":
      return wrap(
        <>
          {axes}
          <line x1="50" y1="25" x2="280" y2="130" stroke={N} strokeWidth="2.5" />
          <line x1="50" y1="130" x2="280" y2="25" stroke={M} strokeWidth="2.5" />
          <circle cx="165" cy="77.5" r="5" fill="#F8B13A" stroke={N} />
          <line x1="165" y1="77.5" x2="165" y2="140" stroke={N} strokeDasharray="3 3" />
          <line x1="30" y1="77.5" x2="165" y2="77.5" stroke={N} strokeDasharray="3 3" />
          <text x="282" y="134" fontSize="10" fill={N}>D</text>
          <text x="282" y="26" fontSize="10" fill={M}>S</text>
          <text x="10" y="20" fontSize="10" fill={N}>P</text>
          <text x="292" y="154" fontSize="10" fill={N}>Q</text>
          <text x="172" y="72" fontSize="9" fill={N}>Keseimbangan</text>
        </>,
        "Kurva permintaan (D) dan penawaran (S) berpotongan di titik keseimbangan",
      );
    case "cell":
      return wrap(
        <>
          <ellipse cx="160" cy="80" rx="140" ry="68" fill="#FBE4E4" stroke={M} strokeWidth="2" />
          <circle cx="150" cy="78" r="28" fill={L} stroke={N} strokeWidth="2" />
          <circle cx="150" cy="78" r="9" fill={N} />
          <ellipse cx="235" cy="60" rx="24" ry="11" fill="#F8B13A" stroke={M} />
          <ellipse cx="80" cy="105" rx="22" ry="10" fill="#F8B13A" stroke={M} />
          {[[210, 110], [100, 50], [250, 100], [195, 35]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill={N} />
          ))}
          <text x="132" y="122" fontSize="9" fill={N}>Inti sel</text>
          <text x="215" y="85" fontSize="9" fill={M}>Mitokondria</text>
          <text x="214" y="125" fontSize="9" fill={N}>Ribosom</text>
        </>,
        "Skema sederhana sel eukariotik",
      );
    case "paper":
      return wrap(
        <>
          {["Abstrak", "Pendahuluan", "Metode", "Hasil", "Pembahasan", "Simpulan"].map((t, i) => (
            <g key={t}>
              <rect x={20 + (i % 3) * 98} y={20 + Math.floor(i / 3) * 66} width="88" height="54" rx="8" fill={i === 0 || i === 5 ? M : L} />
              <text x={64 + (i % 3) * 98} y={52 + Math.floor(i / 3) * 66} fontSize="11" textAnchor="middle" fill={i === 0 || i === 5 ? "#fff" : N} fontWeight="700">{t}</text>
            </g>
          ))}
        </>,
        "Struktur umum artikel ilmiah — baca bagian berwarna merah lebih dulu",
      );
    default:
      return null;
  }
}
