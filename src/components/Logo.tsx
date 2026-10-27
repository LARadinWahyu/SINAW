import { cx } from "@/lib/utils";

/** Emblem SINAU: buku terbuka, topi wisuda, dan panah naik (digambar ulang dari logo presentasi). */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
      <path d="M32 50 C24 44 14 42 4 43 L4 18 C14 17 24 19 32 25 C40 19 50 17 60 18 L60 43 C50 42 40 44 32 50Z" fill="#1B3163" />
      <path d="M32 46 C25 41 16 39.5 8 40 L8 21.5 C16 21 25 23 32 28 C39 23 48 21 56 21.5 L56 40 C48 39.5 39 41 32 46Z" fill="#fff" />
      <path d="M32 44 C26 40 18 38.5 11 39 L11 24 C18 24 26 26 32 30.5 C38 26 46 24 53 24 L53 39 C46 38.5 38 40 32 44Z" fill="none" stroke="#C8161D" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M17 38 L25 31 L30 35 L41 25" fill="none" stroke="#C8161D" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36.5 24 L43.5 22.5 L42 29.5Z" fill="#C8161D" />
      <path d="M32 2 L52 10 L32 18 L12 10Z" fill="#1B3163" />
      <path d="M21 13.5 L21 19 C25 21.5 39 21.5 43 19 L43 13.5 L32 18Z" fill="#1B3163" />
      <path d="M50 11 L50 19" stroke="#C8161D" strokeWidth="1.6" />
      <circle cx="50" cy="20.5" r="1.8" fill="#C8161D" />
    </svg>
  );
}

export function Logo({ className, light = false, sub = true }: { className?: string; light?: boolean; sub?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="leading-none">
        <span className={cx("block text-xl font-extrabold tracking-tight", light ? "text-white" : "text-gradient")}>SINAU</span>
        {sub && (
          <span className={cx("block text-[10px] font-semibold uppercase tracking-[0.18em]", light ? "text-white/75" : "text-slate-500")}>
            Siap Nambah Ilmu
          </span>
        )}
      </span>
    </span>
  );
}

/** Motif titik halftone — diambil dari gaya visual presentasi SINAU */
export function Halftone({ className, color = "currentColor" }: { className?: string; color?: string }) {
  const dots = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 14; c++) {
      const size = Math.max(0.4, 4.2 - Math.hypot(r - 1, c - 3) * 0.42);
      dots.push(<circle key={`${r}-${c}`} cx={c * 12 + 6} cy={r * 12 + 6} r={size} fill={color} />);
    }
  return (
    <svg viewBox="0 0 168 108" className={className} aria-hidden="true">
      {dots}
    </svg>
  );
}
