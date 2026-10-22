"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, Eye, EyeOff, FlaskConical, GraduationCap, Info, School, ShieldCheck, UserRound } from "lucide-react";
import { Halftone, Logo } from "@/components/Logo";
import { Button, Field, Input } from "@/components/ui";
import { useHydrated, useSession, useStore } from "@/lib/store";
import type { UserCategory } from "@/lib/types";
import { EMAIL_RE, cx, isCampusEmail } from "@/lib/utils";

export default function MasukPage() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  );
}

const CATS: { id: UserCategory; t: string; d: string; icon: typeof School }[] = [
  { id: "siswa", t: "Siswa SMA/SMK", d: "Sedang mempersiapkan kuliah", icon: School },
  { id: "calon", t: "Calon mahasiswa", d: "Sudah diterima di perguruan tinggi", icon: UserRound },
  { id: "maba", t: "Mahasiswa baru", d: "Semester pertama · email kampus", icon: GraduationCap },
];

function Auth() {
  const params = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const { user, data } = useSession();
  const [mode, setMode] = useState<"masuk" | "daftar">(params.get("mode") === "daftar" ? "daftar" : "masuk");
  const register = useStore((s) => s.register);
  const login = useStore((s) => s.login);
  const loginDemo = useStore((s) => s.loginDemo);

  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", category: "calon" as UserCategory });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const demoFocus = params.get("demo") === "1";

  useEffect(() => {
    if (hydrated && user) router.replace(data?.profile.onboarded ? "/app" : "/onboarding");
  }, [hydrated, user, data, router]);

  const set = (k: keyof typeof f, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setFormError("");
  };

  function validate() {
    const e: Record<string, string> = {};
    if (mode === "daftar" && f.name.trim().length < 2) e.name = "Nama minimal 2 karakter.";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Format email belum benar, contoh: nama@email.com";
    if (f.password.length < (mode === "daftar" ? 8 : 1)) e.password = mode === "daftar" ? "Kata sandi minimal 8 karakter." : "Kata sandi wajib diisi.";
    if (mode === "daftar" && f.password && !/\d/.test(f.password)) e.password = "Kata sandi perlu mengandung minimal 1 angka.";
    if (mode === "daftar" && f.confirm !== f.password) e.confirm = "Konfirmasi kata sandi tidak sama.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const r = mode === "daftar" ? await register(f) : await login(f.email, f.password);
    setLoading(false);
    if (!r.ok) setFormError(r.error);
  }

  const campus = mode === "daftar" && f.category === "maba";
  const campusDetected = isCampusEmail(f.email);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-marun-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Halftone className="absolute -right-10 top-10 w-[420px] text-white/10" />
        <Link href="/" aria-label="Kembali ke beranda">
          <Logo light />
        </Link>
        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight">Kenali Kemampuanmu, Siapkan Kuliahmu.</h1>
          <p className="mt-4 max-w-md text-marun-50">Satu akun untuk pretest, Pusat Belajar, to-do list, daily streak, NARA, dan Career Lounge.</p>
        </div>
        <p className="relative text-sm text-marun-100">Belajar Tepat • Tumbuh Bertahap • Lebih Siap Kuliah</p>
      </aside>

      <main className="flex flex-col px-4 py-6 sm:px-10 lg:py-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-marun-700">
            <ArrowLeft className="h-4 w-4" /> Beranda
          </Link>
          <span className="lg:hidden">
            <Logo sub={false} />
          </span>
        </div>

        <div className="mx-auto w-full max-w-md flex-1 py-8">
          <div className="mb-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-300/60">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <b>Mode demo:</b> backend autentikasi belum dikonfigurasi. Akun disimpan hanya di browser ini, kata sandi disimpan dalam bentuk hash (SHA-256 + salt), bukan teks biasa.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Pilih masuk atau daftar">
            {(["masuk", "daftar"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setErrors({});
                  setFormError("");
                }}
                className={cx("rounded-lg py-2.5 text-sm font-bold transition", mode === m ? "bg-white text-marun-700 shadow-sm" : "text-slate-500 hover:text-ink")}
              >
                {m === "masuk" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold">{mode === "masuk" ? "Selamat datang kembali 👋" : "Buat akun SINAU"}</h2>
          <p className="mt-1 text-sm text-slate-500">{mode === "masuk" ? "Masuk untuk melanjutkan belajarmu." : "Gratis untuk dicoba. Lengkapi profilmu setelah mendaftar."}</p>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            {mode === "daftar" && (
              <>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">Kategori pengguna</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {CATS.map(({ id, t, d, icon: I }) => (
                      <label key={id} className={cx("flex cursor-pointer flex-col rounded-xl border-2 p-3 transition", f.category === id ? "border-marun-600 bg-marun-50" : "border-slate-200 hover:border-marun-200")}>
                        <input type="radio" name="category" value={id} checked={f.category === id} onChange={() => set("category", id)} className="sr-only" />
                        <I className={cx("h-5 w-5", f.category === id ? "text-marun-700" : "text-slate-400")} />
                        <span className="mt-2 text-sm font-bold leading-tight">{t}</span>
                        <span className="mt-0.5 text-[11px] leading-tight text-slate-500">{d}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <Field label="Nama lengkap" htmlFor="name" error={errors.name}>
                  <Input id="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} placeholder="Nama kamu" />
                </Field>
              </>
            )}
            <Field
              label={campus ? "Email kampus" : "Email"}
              htmlFor="email"
              error={errors.email}
              hint={campus ? "Gunakan email kampus (misalnya …@ac.id) untuk jalur B2B." : undefined}
            >
              <Input id="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} placeholder={campus ? "nim@student.kampus.ac.id" : "nama@email.com"} />
            </Field>
            {campus && f.email && (
              <div className={cx("flex gap-2 rounded-xl p-3 text-xs", campusDetected ? "bg-navy-50 text-navy-700" : "bg-slate-50 text-slate-600")}>
                <Building2 className="h-4 w-4 shrink-0" />
                <p>
                  {campusDetected
                    ? "Domain email kampus terdeteksi. Ini hanya simulasi — verifikasi kemitraan kampus (SSO) belum aktif, sehingga akun tetap terdaftar sebagai pengguna umum."
                    : "Email ini tidak terlihat seperti email kampus. Kamu tetap bisa mendaftar sebagai pengguna umum."}
                </p>
              </div>
            )}
            <Field label="Kata sandi" htmlFor="password" error={errors.password} hint={mode === "daftar" ? "Minimal 8 karakter dan mengandung angka." : undefined}>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} autoComplete={mode === "daftar" ? "new-password" : "current-password"} value={f.password} onChange={(e) => set("password", e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-err" : undefined} className="pr-11" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-ink" aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            {mode === "daftar" && (
              <Field label="Konfirmasi kata sandi" htmlFor="confirm" error={errors.confirm}>
                <Input id="confirm" type={show ? "text" : "password"} autoComplete="new-password" value={f.confirm} onChange={(e) => set("confirm", e.target.value)} aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? "confirm-err" : undefined} />
              </Field>
            )}
            {formError && (
              <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {mode === "masuk" ? "Masuk" : "Daftar & Mulai Onboarding"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> atau coba tanpa akun <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className={cx("grid gap-2 rounded-2xl p-1 sm:grid-cols-2", demoFocus && "ring-2 ring-amber-400 ring-offset-4")}>
            <Button variant="outline" onClick={() => loginDemo("user")}>
              <FlaskConical className="h-4 w-4 text-amber-500" /> Masuk Mode Demo
            </Button>
            <Button variant="outline" onClick={() => loginDemo("admin")}>
              <ShieldCheck className="h-4 w-4 text-navy-600" /> Demo sebagai Admin
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">Mode demo dimulai dengan data kosong — tidak ada progres atau nilai palsu.</p>
        </div>
      </main>
    </div>
  );
}
