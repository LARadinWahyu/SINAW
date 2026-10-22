"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  ChevronsLeft,
  ClipboardCheck,
  FlaskConical,
  Flame,
  Home,
  ListTodo,
  UsersRound,
  Building2,
  Compass,
  Dumbbell,
  Route,
  LineChart,
  LogOut,
  Menu,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Logo, LogoMark } from "./Logo";
import { useStore, useSession } from "@/lib/store";
import { computeStreak } from "@/lib/streak";
import { cx } from "@/lib/utils";
import { deadlineAlerts } from "@/lib/deadline";

type NavItem = { href: string; label: string; icon: typeof Home };
const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  { title: "", items: [{ href: "/app", label: "Beranda", icon: Home }] },
  {
    title: "Belajar",
    items: [
      { href: "/app/belajar", label: "Pusat Belajar", icon: BookOpen },
      { href: "/app/jalur", label: "Jalur Belajar", icon: Route },
      { href: "/app/pretest", label: "Pretest", icon: ClipboardCheck },
      { href: "/app/evaluasi", label: "Kuis & Evaluasi", icon: Dumbbell },
      { href: "/app/nara", label: "NARA AI", icon: Sparkles },
    ],
  },
  {
    title: "Produktivitas",
    items: [
      { href: "/app/tugas", label: "Tugas & Jadwal", icon: ListTodo },
      { href: "/app/progres", label: "Progress Tracker", icon: LineChart },
      { href: "/app/pencapaian", label: "Streak & Pencapaian", icon: Award },
    ],
  },
  {
    title: "Masa Depan",
    items: [
      { href: "/app/tes-jurusan", label: "Tes Jurusan", icon: Compass },
      { href: "/app/karier", label: "Career Lounge", icon: Briefcase },
      { href: "/app/kampus", label: "Rekomendasi Kampus", icon: Building2 },
      { href: "/app/komunitas", label: "Komunitas", icon: UsersRound },
    ],
  },
  { title: "Akun", items: [{ href: "/app/profil", label: "Profil & Pengaturan", icon: UserRound }] },
];
const MOBILE = [
  { href: "/app", label: "Beranda", icon: Home },
  { href: "/app/belajar", label: "Belajar", icon: BookOpen },
  { href: "/app/tugas", label: "Tugas", icon: ListTodo },
  { href: "/app/nara", label: "NARA AI", icon: Sparkles },
  { href: "/app/profil", label: "Profil", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { user, data } = useSession();
  const logout = useStore((s) => s.logout);
  const announcements = useStore((s) => s.content.announcements);
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [bell, setBell] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("sinau-sidebar") === "1");
    } catch {}
  }, []);
  useEffect(() => {
    setDrawer(false);
    setBell(false);
  }, [path]);
  useEffect(() => {
    const f = (e: MouseEvent) => bellRef.current && !bellRef.current.contains(e.target as Node) && setBell(false);
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);

  // terapkan preferensi aksesibilitas
  const s = data?.settings;
  useEffect(() => {
    if (!s) return;
    const h = document.documentElement;
    h.dataset.font = s.fontScale;
    h.dataset.motion = s.reduceMotion ? "reduce" : "";
    h.dataset.contrast = s.highContrast ? "tinggi" : "";
  }, [s]);

  const streak = useMemo(() => computeStreak(data?.activity ?? [], s?.dailyTarget ?? 1), [data?.activity, s?.dailyTarget]);

  // jam berjalan (diperbarui tiap menit) agar pengingat tenggat selalu terkini
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const alerts = useMemo(() => (data ? deadlineAlerts(data.tasks, s?.deadlineLeadHours ?? 24, now) : []), [data, s?.deadlineLeadHours, now]);
  const notifications = useMemo(() => {
    const out: { id: string; title: string; body: string; href: string; tone: "red" | "amber" | "info" }[] = alerts.map((a) => ({
      id: a.task.id,
      title: a.level === "terlewat" ? `Tenggat terlewat (${a.label.replace("terlewat ", "")} lalu)` : `Tenggat ${a.label}`,
      body: `${a.task.title} · pukul ${a.task.dueTime}`,
      href: "/app/tugas",
      tone: a.level === "terlewat" ? "red" : "amber",
    }));
    announcements.forEach((a) => out.push({ id: a.id, title: a.title, body: a.body, href: "/app", tone: "info" }));
    return out;
  }, [alerts, announcements]);
  const markNotified = useStore((st) => st.markNotified);

  // notifikasi browser (hanya saat aplikasi terbuka; push di latar belakang butuh backend)
  useEffect(() => {
    if (!s?.browserNotif || !data || typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const fresh = alerts.filter((a) => !data.notified.includes(`${a.task.id}:${a.level}`));
    if (!fresh.length) return;
    fresh.slice(0, 3).forEach((a) => {
      try {
        new Notification(a.level === "terlewat" ? "Tenggat terlewat" : "Tenggat mendekat", { body: `${a.task.title} — ${a.label}`, tag: `${a.task.id}:${a.level}` });
      } catch {}
    });
    markNotified(fresh.map((a) => `${a.task.id}:${a.level}`));
  }, [alerts, s?.browserNotif, data, markNotified]);

  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const showReminder = !!s?.reminders && !streak.todayMet && hhmm >= (s?.reminderTime ?? "19:00") && !dismissed;

  function toggleCollapse() {
    setCollapsed((c) => {
      try {
        localStorage.setItem("sinau-sidebar", c ? "0" : "1");
      } catch {}
      return !c;
    });
  }
  function doLogout() {
    logout();
    router.replace("/");
  }

  const isActive = (href: string) => (href === "/app" ? path === "/app" : path.startsWith(href));
  const groups = user?.role === "admin" ? NAV_GROUPS.map((g) => (g.title === "Akun" ? { ...g, items: [...g.items, { href: "/app/admin", label: "Panel Admin", icon: ShieldCheck }] } : g)) : NAV_GROUPS;
  const first = user?.name.split(" ")[0] ?? "";

  const navList = (compact: boolean) => (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.title || "utama"}>
          {g.title && (compact ? <div className="mx-3 mb-2 border-t border-slate-100" aria-hidden /> : <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{g.title}</p>)}
          <ul className="space-y-0.5">
      {g.items.map(({ href, label, icon: I }) => (
        <li key={href}>
          <Link
            href={href}
            title={compact ? label : undefined}
            aria-current={isActive(href) ? "page" : undefined}
            className={cx(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marun-500",
              compact && "justify-center px-0",
              isActive(href) ? "bg-marun-700 text-white shadow-sm" : "text-slate-600 hover:bg-marun-50 hover:text-marun-700",
            )}
          >
            <I className="h-5 w-5 shrink-0" />
            {!compact && <span>{label}</span>}
          </Link>
        </li>
      ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Lompat ke konten
      </a>
      {/* Sidebar desktop */}
      <aside className={cx("fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-white transition-all lg:flex", collapsed ? "w-[76px]" : "w-64")}>
        <div className={cx("flex h-16 items-center border-b border-slate-100", collapsed ? "justify-center" : "px-5")}>
          <Link href="/app" aria-label="Beranda SINAU">
            {collapsed ? <LogoMark /> : <Logo />}
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Menu aplikasi">
          {navList(collapsed)}
        </nav>
        <div className="space-y-1 border-t border-slate-100 p-3">
          <button onClick={toggleCollapse} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100", collapsed && "justify-center px-0")} aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}>
            <ChevronsLeft className={cx("h-5 w-5 transition", collapsed && "rotate-180")} />
            {!collapsed && "Ciutkan"}
          </button>
          <button onClick={doLogout} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600", collapsed && "justify-center px-0")} title="Keluar">
            <LogOut className="h-5 w-5" />
            {!collapsed && "Keluar"}
          </button>
        </div>
      </aside>

      {/* Drawer mobile */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setDrawer(false)}>
          <nav className="h-full w-72 overflow-y-auto bg-white p-4" onClick={(e) => e.stopPropagation()} aria-label="Menu aplikasi">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2" aria-label="Tutup menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {navList(false)}
            <button onClick={doLogout} className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
              <LogOut className="h-5 w-5" /> Keluar
            </button>
          </nav>
        </div>
      )}

      <div className={cx("transition-all", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
            <button className="rounded-lg p-2 lg:hidden" onClick={() => setDrawer(true)} aria-label="Buka menu">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/app" className="lg:hidden" aria-label="Beranda">
              <LogoMark className="h-8 w-8" />
            </Link>
            {user?.isDemo && (
              <span className="hidden items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 ring-1 ring-amber-300/60 sm:inline-flex">
                <FlaskConical className="h-3.5 w-3.5" /> Mode demo
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Link href="/app/pencapaian" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600 ring-1 ring-amber-300/60" title="Streak saat ini">
                <Flame className={cx("h-4 w-4", streak.todayMet ? "text-amber-500" : "text-slate-400")} /> {streak.current}
                <span className="sr-only">hari streak</span>
              </Link>
              <div className="relative" ref={bellRef}>
                <button onClick={() => setBell(!bell)} className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100" aria-label={`Notifikasi (${alerts.length} pengingat tenggat)`} aria-expanded={bell}>
                  <Bell className="h-5 w-5" />
                  {alerts.length > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-marun-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">{alerts.length}</span>
                  ) : notifications.length > 0 ? (
                    <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-navy-500 ring-2 ring-white" />
                  ) : null}
                </button>
                {bell && (
                  <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <p className="px-3 py-2 text-sm font-bold">Notifikasi</p>
                    {notifications.length === 0 ? (
                      <p className="px-3 pb-3 text-sm text-slate-500">Belum ada notifikasi.</p>
                    ) : (
                      <ul className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <li key={n.id}>
                            <Link href={n.href} className="flex gap-2.5 rounded-xl px-3 py-2.5 hover:bg-canvas">
                              <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.tone === "red" ? "bg-red-500" : n.tone === "amber" ? "bg-amber-400" : "bg-navy-400")} />
                              <span className="min-w-0">
                              <p className={cx("text-sm font-semibold", n.tone === "red" && "text-red-700")}>{n.title}</p>
                              <p className="line-clamp-2 text-xs text-slate-500">{n.body}</p>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href="/app/profil#notifikasi" className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-canvas">
                      <Settings2 className="h-3.5 w-3.5" /> Atur pengingat
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/app/profil" className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100" aria-label="Profil">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">{first.slice(0, 1).toUpperCase()}</span>
                <span className="hidden text-sm font-semibold md:block">{first}</span>
              </Link>
            </div>
          </div>
        </header>

        {showReminder && (
          <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
            <div className="flex items-center gap-3 rounded-2xl bg-navy-800 px-4 py-3 text-sm text-white">
              <Bell className="h-5 w-5 shrink-0 text-amber-300" />
              <p className="flex-1">
                Pengingat belajar ({s?.reminderTime}): kamu belum memenuhi target {s?.dailyTarget} aktivitas hari ini. Satu materi atau satu tugas sudah cukup untuk menjaga streak!
              </p>
              <button onClick={() => setDismissed(true)} className="rounded-lg p-1 hover:bg-white/10" aria-label="Tutup pengingat">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Navigasi bawah">
        <ul className="grid grid-cols-5">
          {MOBILE.map(({ href, label, icon: I }) => (
            <li key={href}>
              <Link href={href} aria-current={isActive(href) ? "page" : undefined} className={cx("flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold", isActive(href) ? "text-marun-700" : "text-slate-500")}>
                <I className="h-5 w-5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
