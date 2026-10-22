"use client";

import { AlertCircle, BarChart3, BookOpen, Brain, Briefcase, Calculator, Circle, Code2, FlaskConical, Globe, GraduationCap, Inbox, Languages, Loader2, Microscope, Palette, Scale, Sigma, TrendingUp, Users, X, ClipboardList, MessageSquare, Target, Flame, CalendarDays, Award, Search, UserRound, Megaphone, Clock, Sparkles, type LucideIcon } from "lucide-react";

export const ICONS: Record<string, LucideIcon> = { BarChart3, BookOpen, Brain, Briefcase, Calculator, Code2, FlaskConical, Globe, GraduationCap, Inbox, Languages, Microscope, Palette, Scale, Sigma, TrendingUp, Users, ClipboardList, MessageSquare, Target, Flame, CalendarDays, Award, Search, UserRound, Megaphone, Clock, Sparkles };
import Link from "next/link";
import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "navy" | "danger" | "outline";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-marun-700 text-white hover:bg-marun-800 shadow-sm",
  navy: "bg-navy-700 text-white hover:bg-navy-800 shadow-sm",
  secondary: "bg-marun-50 text-marun-800 hover:bg-marun-100",
  outline: "border border-slate-300 bg-white text-ink hover:border-marun-300 hover:bg-marun-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marun-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const SIZES = { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-sm", lg: "h-12 px-6 text-base" };

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: keyof typeof SIZES;
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "primary", size = "md", loading, className, children, disabled, ...p },
  ref,
) {
  return (
    <button ref={ref} type="button" className={cx(base, VARIANTS[variant], SIZES[size], className)} disabled={disabled || loading} aria-busy={loading} {...p}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

export function LinkButton({ href, variant = "primary", size = "md", className, children }: { href: string; variant?: Variant; size?: keyof typeof SIZES; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={cx(base, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  );
}

export function Card({ className, children, as: As = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "article" }) {
  return <As className={cx("rounded-2xl border border-slate-200/70 bg-white shadow-card", className)}>{children}</As>;
}

export function Badge({ children, tone = "slate", className }: { children: ReactNode; tone?: "slate" | "marun" | "navy" | "amber" | "green"; className?: string }) {
  const t = {
    slate: "bg-slate-100 text-slate-700",
    marun: "bg-marun-50 text-marun-700 ring-1 ring-inset ring-marun-200",
    navy: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200",
    amber: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-300/60",
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  }[tone];
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", t, className)}>{children}</span>;
}

export function DemoTag({ label = "Konten demo", className }: { label?: string; className?: string }) {
  return (
    <span title="Contoh untuk demonstrasi, bukan materi/data resmi SINAU" className={cx("inline-flex items-center gap-1 rounded-full border border-dashed border-amber-500/70 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600", className)}>
      <FlaskConical className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

export function ProgressBar({ value, className, tone = "marun", label }: { value: number; className?: string; tone?: "marun" | "navy" | "amber"; label?: string }) {
  const c = { marun: "bg-marun-600", navy: "bg-navy-600", amber: "bg-amber-400" }[tone];
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cx("h-full rounded-full transition-all", c)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function Ring({ value, size = 88, stroke = 9, label, sub }: { value: number | null; size?: number; stroke?: number; label?: string; sub?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = value ?? 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label ?? `${v}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#F1E3E3" strokeWidth={stroke} fill="none" />
        {value !== null && (
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#9B0A0A" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} className="transition-all duration-700" />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-ink">{value === null ? "—" : `${v}%`}</span>
        {sub && <span className="text-[10px] font-medium text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}

export function EmptyState({ icon = "Inbox", title, desc, action }: { icon?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-marun-700 shadow-card">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <p className="font-bold text-ink">{title}</p>
      {desc && <p className="mt-1 max-w-sm text-sm text-slate-500">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Circle;
  return <C className={className} aria-hidden />;
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.activeElement as HTMLElement | null;
    setTimeout(() => ref.current?.querySelector<HTMLElement>("input,select,textarea,button")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cx("max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6", wide ? "sm:max-w-2xl" : "sm:max-w-lg")}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, htmlFor, error, hint, children, className }: { label: string; htmlFor: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-err`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600" role="alert">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 transition focus:border-marun-500 focus:outline-none focus:ring-2 focus:ring-marun-500/20 aria-[invalid=true]:border-red-500";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cx(inputCls, className)} {...p} />;
});
export function Textarea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(inputCls, "min-h-[88px]", className)} {...p} />;
}
export function Select({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(inputCls, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[right_0.75rem_center] bg-no-repeat pr-9", className)} {...p}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, desc, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string; id: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {desc && <span className="block text-xs text-slate-500">{desc}</span>}
      </label>
      <button type="button" id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cx("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marun-500 focus-visible:ring-offset-2", checked ? "bg-marun-700" : "bg-slate-300")}>
        <span className={cx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </div>
  );
}

export function PageHeader({ title, desc, actions, kicker }: { title: string; desc?: string; actions?: ReactNode; kicker?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && <div className="mb-2">{kicker}</div>}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-sm text-slate-500 sm:text-base">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Format markdown ringan untuk pesan NARA: **tebal**, _miring_, `kode`, ```blok```, • daftar */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/```/);
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((b, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-navy-900 p-3 font-mono text-xs text-navy-50">
            {b.trim()}
          </pre>
        ) : (
          b
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((p, j) => (
              <p key={`${i}-${j}`} className="whitespace-pre-line">
                {inline(p.trim())}
              </p>
            ))
        ),
      )}
    </div>
  );
}
function inline(s: string): ReactNode[] {
  const parts = s.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("_") && p.endsWith("_") && p.length > 2) return <em key={i} className="text-slate-500">{p.slice(1, -1)}</em>;
    if (p.startsWith("`")) return <code key={i} className="rounded bg-slate-100 px-1 font-mono text-xs">{p.slice(1, -1)}</code>;
    return p;
  });
}
