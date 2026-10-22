"use client";

import { useMemo } from "react";
import { Award, BookCheck, CalendarCheck, CheckCheck, ClipboardCheck, Flame, Info, Lock, MessageSquare, Star, Target, Trophy, Zap } from "lucide-react";
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from "@/components/ui";
import { useSession, useStore } from "@/lib/store";
import { computeStreak } from "@/lib/streak";
import { addDays, cx, dayKey, formatTanggal, parseDay } from "@/lib/utils";

const KIND_LABEL = { materi: "Materi", kuis: "Kuis", pretest: "Pretest", tugas: "Tugas", latihan: "Latihan" };

export default function Pencapaian() {
  const { data } = useSession();
  const saveSettings = useStore((s) => s.saveSettings);
  const d = data!;
  const target = d.settings.dailyTarget;
  const st = useMemo(() => computeStreak(d.activity, target), [d.activity, target]);
  const today = dayKey();
  // mulai dari hari Senin, 11 minggu sebelum minggu ini
  const start = addDays(today, -((parseDay(today).getDay() + 6) % 7) - 77);
  const days: string[] = [];
  for (let k = start; k <= today; k = addDays(k, 1)) days.push(k);

  const doneTasks = d.tasks.filter((t) => t.status === "done").length;
  const doneMats = Object.keys(d.completed).length;
  const perfectQuiz = d.quizResults.some((r) => r.correct === r.total);
  const badges = [
    { i: BookCheck, t: "Langkah Pertama", d: "Selesaikan 1 materi", got: doneMats >= 1, p: Math.min(1, doneMats / 1) },
    { i: ClipboardCheck, t: "Kenali Diri", d: "Kerjakan pretest pertama", got: d.pretests.length >= 1, p: Math.min(1, d.pretests.length) },
    { i: Flame, t: "Mulai Panas", d: "Streak 3 hari", got: st.longest >= 3, p: Math.min(1, st.longest / 3) },
    { i: Zap, t: "Seminggu Konsisten", d: "Streak 7 hari", got: st.longest >= 7, p: Math.min(1, st.longest / 7) },
    { i: Trophy, t: "Kebiasaan Terbentuk", d: "Streak 21 hari", got: st.longest >= 21, p: Math.min(1, st.longest / 21) },
    { i: Star, t: "Sempurna!", d: "Nilai penuh di satu kuis", got: perfectQuiz, p: perfectQuiz ? 1 : 0 },
    { i: CheckCheck, t: "Produktif", d: "Selesaikan 10 tugas", got: doneTasks >= 10, p: Math.min(1, doneTasks / 10) },
    { i: Target, t: "Pembelajar Tekun", d: "Selesaikan 5 materi", got: doneMats >= 5, p: Math.min(1, doneMats / 5) },
    { i: MessageSquare, t: "Rajin Bertanya", d: "Mulai percakapan dengan NARA", got: d.chats.some((c) => c.messages.length > 0), p: d.chats.some((c) => c.messages.length > 0) ? 1 : 0 },
  ];
  const earned = badges.filter((b) => b.got).length;

  const motivation = st.todayMet
    ? "Target hari ini tercapai. Istirahat juga bagian dari belajar — sampai besok!"
    : st.current > 0
      ? `Streak ${st.current} hari-mu masih aman. Satu aktivitas belajar hari ini akan melanjutkannya.`
      : "Mulai dari yang kecil: selesaikan satu materi atau satu tugas hari ini.";

  return (
    <div>
      <PageHeader title="Streak & Pencapaian" desc="Bangun konsistensi belajar, bukan sekadar mengejar angka." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-amber-400 p-5 text-ink">
          <Flame className="h-7 w-7" />
          <p className="mt-3 text-4xl font-extrabold">{st.current}</p>
          <p className="text-sm font-semibold">hari streak saat ini</p>
        </Card>
        <Card className="p-5">
          <Trophy className="h-6 w-6 text-marun-600" />
          <p className="mt-3 text-3xl font-extrabold">{st.longest}</p>
          <p className="text-sm text-slate-500">streak terpanjang</p>
        </Card>
        <Card className="p-5">
          <CalendarCheck className="h-6 w-6 text-navy-600" />
          <p className="mt-3 text-3xl font-extrabold">{st.activeDays}</p>
          <p className="text-sm text-slate-500">total hari aktif</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-bold">Target harian</p>
          <p className="mt-2 text-sm text-slate-500">{st.todayCount}/{target} aktivitas hari ini</p>
          <ProgressBar value={(st.todayCount / target) * 100} className="mt-2" tone="amber" label="Target harian" />
          <label htmlFor="target" className="mt-3 block text-xs font-semibold text-slate-500">Ubah target</label>
          <select id="target" value={target} onChange={(e) => saveSettings({ dailyTarget: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} aktivitas/hari</option>)}
          </select>
        </Card>
      </div>

      <p className="mt-4 rounded-2xl bg-navy-50 p-4 text-sm font-medium text-navy-800">{motivation}</p>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">Kalender aktivitas (12 minggu)</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            Sedikit
            {["bg-slate-100", "bg-marun-200", "bg-marun-400", "bg-marun-700"].map((c) => <span key={c} className={cx("h-3 w-3 rounded", c)} />)}
            Banyak
          </div>
        </div>
        <div className="scrollbar-none mt-4 overflow-x-auto">
          <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
            {days.map((k) => {
              const n = st.byDay[k] || 0;
              const met = n >= target;
              return (
                <div key={k} title={`${formatTanggal(k, true)}: ${n} aktivitas${met ? " (target tercapai)" : ""}`} className={cx("h-4 w-4 rounded sm:h-5 sm:w-5", n === 0 ? "bg-slate-100" : !met ? "bg-marun-200" : n < target + 2 ? "bg-marun-400" : "bg-marun-700", k === today && "ring-2 ring-amber-400")}>
                  <span className="sr-only">{formatTanggal(k)}: {n} aktivitas</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">Mulai {formatTanggal(days[0])} · tiap kolom = satu minggu (Senin di atas)</p>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Badge pencapaian</h2>
            <Badge tone="amber"><Award className="h-3 w-3" /> {earned}/{badges.length}</Badge>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {badges.map(({ i: I, t, d: desc, got, p }) => (
              <li key={t} className={cx("rounded-2xl border p-4 text-center", got ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white")}>
                <span className={cx("mx-auto flex h-12 w-12 items-center justify-center rounded-full", got ? "bg-amber-400 text-ink" : "bg-slate-100 text-slate-400")}>
                  {got ? <I className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                </span>
                <p className="mt-2 text-sm font-bold">{t}</p>
                <p className="text-xs text-slate-500">{desc}</p>
                {!got && <ProgressBar value={p * 100} className="mt-2 h-1.5" tone="amber" label={`Progres badge ${t}`} />}
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-bold">Riwayat streak</h2>
            {st.runs.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Belum ada streak tercatat.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {st.runs.slice(0, 5).map((r) => (
                  <li key={r.start} className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2 text-sm">
                    <span>{formatTanggal(r.start)}{r.start !== r.end && ` – ${formatTanggal(r.end)}`}</span>
                    <b className="text-amber-600">{r.length} hari</b>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="font-bold">Aktivitas terbaru</h2>
            {d.activity.length === 0 ? (
              <div className="mt-3"><EmptyState icon="Flame" title="Belum ada aktivitas" desc="Aktivitas belajarmu akan tercatat di sini." /></div>
            ) : (
              <ul className="mt-3 space-y-2">
                {[...d.activity].reverse().slice(0, 8).map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-sm">
                    <Badge tone="navy" className="shrink-0">{KIND_LABEL[a.kind]}</Badge>
                    <span className="flex-1">{a.label}</span>
                    <span className="shrink-0 text-xs text-slate-400">{parseDay(a.date).getDate()}/{parseDay(a.date).getMonth() + 1}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card className="mt-6 flex gap-3 p-5 text-sm text-slate-600">
        <Info className="h-5 w-5 shrink-0 text-navy-600" />
        <div>
          <p className="font-bold text-ink">Aturan streak</p>
          <p className="mt-1">
            Aktivitas yang dihitung: menyelesaikan materi, mengerjakan kuis materi atau latihan soal, mengumpulkan pretest, atau menyelesaikan tugas. Satu hari dianggap aktif jika jumlah aktivitas ≥ target harian
            ({target}). Streak bertambah untuk setiap hari aktif berturut-turut; jika hari ini belum aktif, streak kemarin tetap terjaga sampai hari berganti. Membatalkan status selesai pada hari yang sama
            akan menghapus aktivitasnya.
          </p>
        </div>
      </Card>
    </div>
  );
}
