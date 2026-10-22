"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CalendarRange, ClipboardPaste, FlaskConical, History, Lightbulb, MessageSquarePlus, Send, Sparkles, Trash2, X } from "lucide-react";
import { Button, RichText } from "@/components/ui";
import { MAJOR_OPTIONS } from "@/data/career";
import { naraDemoReply } from "@/lib/nara-mock";
import { useSession, useStore } from "@/lib/store";
import { latestPretest, topicAnalysis } from "@/lib/recommend";
import { cx, formatRelatif } from "@/lib/utils";

const SUGGESTIONS = ["Jelaskan konsep limit dengan sederhana", "Rangkum materi distribusi normal", "Buatkan rencana belajar minggu ini", "Bagaimana hasil pretest-ku?", "Apa itu SKS dan bagaimana mengatur waktunya?"];

export default function NaraPage() {
  return (
    <Suspense>
      <Nara />
    </Suspense>
  );
}

function Nara() {
  const params = useSearchParams();
  const { user, data } = useSession();
  const { materials, subjects } = useStore((s) => s.content);
  const newChat = useStore((s) => s.newChat);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const deleteChat = useStore((s) => s.deleteChat);
  const d = data!;
  const [activeId, setActiveId] = useState<string | null>(d.chats[0]?.id ?? null);
  const [input, setInput] = useState(params.get("q") ?? "");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"demo" | "live" | "cek">("cek");
  const [showHistory, setShowHistory] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const chat = d.chats.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    fetch("/api/nara")
      .then((r) => r.json())
      .then((j) => setMode(j.mode === "live" ? "live" : "demo"))
      .catch(() => setMode("demo"));
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat?.messages.length, thinking]);

  function context() {
    const majors = d.profile.majors.map((id) => MAJOR_OPTIONS.find((m) => m.id === id)?.name).join(", ");
    const pt = latestPretest(d);
    const weak = pt ? topicAnalysis(pt).weak.join(", ") : "belum pretest";
    return `Nama: ${user!.name}. Status: ${d.profile.status}. Jurusan diminati: ${majors || "-"}. Topik lemah: ${weak}. Waktu belajar: ${d.profile.dailyMinutes} menit/hari.`;
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || thinking) return;
    setError("");
    let id = activeId;
    if (!id || !chat) {
      id = newChat();
      setActiveId(id);
    }
    addChatMessage(id, { role: "user", content: msg });
    setInput("");
    setThinking(true);
    try {
      let reply: string;
      if (mode === "live") {
        const history = [...(chat?.messages ?? []).map((m) => ({ role: m.role, content: m.content })), { role: "user" as const, content: msg }];
        const r = await fetch("/api/nara", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: history, context: context() }) });
        const j = await r.json();
        if (!r.ok || j.error) throw new Error(j.error || "Gagal menghubungi NARA.");
        reply = j.mode === "live" ? j.reply : naraDemoReply(msg, { materials, subjects, data: d, name: user!.name });
      } else {
        await new Promise((res) => setTimeout(res, 700 + Math.random() * 600));
        reply = naraDemoReply(msg, { materials, subjects, data: d, name: user!.name });
      }
      addChatMessage(id, { role: "assistant", content: reply });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setThinking(false);
      taRef.current?.focus();
    }
  }

  function startNew() {
    setActiveId(null);
    setShowHistory(false);
    setError("");
    taRef.current?.focus();
  }

  const history = (
    <div className="flex h-full flex-col">
      <Button onClick={startNew} className="w-full">
        <MessageSquarePlus className="h-4 w-4" /> Percakapan baru
      </Button>
      <p className="mb-2 mt-5 px-1 text-xs font-bold uppercase tracking-wide text-slate-400">Riwayat</p>
      {d.chats.filter((c) => c.messages.length).length === 0 ? (
        <p className="px-1 text-sm text-slate-500">Belum ada riwayat percakapan.</p>
      ) : (
        <ul className="-mx-1 flex-1 space-y-1 overflow-y-auto">
          {d.chats
            .filter((c) => c.messages.length)
            .map((c) => (
              <li key={c.id} className="group flex items-center">
                <button onClick={() => { setActiveId(c.id); setShowHistory(false); }} className={cx("min-w-0 flex-1 rounded-xl px-3 py-2 text-left", c.id === activeId ? "bg-marun-50 text-marun-800" : "hover:bg-slate-100")}>
                  <span className="block truncate text-sm font-semibold">{c.title}</span>
                  <span className="block text-[11px] text-slate-400">{formatRelatif(c.createdAt.slice(0, 10))}</span>
                </button>
                <button onClick={() => { deleteChat(c.id); if (c.id === activeId) setActiveId(null); }} className="rounded-lg p-2 text-slate-400 opacity-100 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Hapus percakapan ${c.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="-mb-6 grid h-[calc(100vh-11rem)] min-h-[520px] gap-4 lg:h-[calc(100vh-8rem)] lg:grid-cols-[260px_1fr]">
      <aside className="hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card lg:block">{history}</aside>
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setShowHistory(false)}>
          <div className="h-full w-72 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowHistory(false)} className="mb-3 ml-auto block rounded-lg p-1" aria-label="Tutup riwayat"><X className="h-5 w-5" /></button>
            {history}
          </div>
        </div>
      )}

      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card">
        <header className="flex items-center gap-3 border-b border-slate-100 p-4">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-marun-700 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold">NARA</p>
            <p className="truncate text-xs text-slate-500">Asisten belajar SINAU</p>
          </div>
          {mode === "demo" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600 ring-1 ring-amber-300/60" title="Jawaban disusun dari materi SINAU dengan aturan sederhana, bukan model AI">
              <FlaskConical className="h-3.5 w-3.5" /> Mode demo
            </span>
          )}
          {mode === "live" && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">AI aktif</span>}
          <button onClick={() => setShowHistory(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Riwayat percakapan"><History className="h-5 w-5" /></button>
          <button onClick={startNew} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Percakapan baru"><MessageSquarePlus className="h-5 w-5" /></button>
        </header>

        <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-2.5" role="group" aria-label="Aksi cepat">
          <button onClick={() => { setInput("Bantu jelaskan soal ini:\n"); taRef.current?.focus(); }} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-marun-50 px-3 py-1.5 text-xs font-bold text-marun-700 hover:bg-marun-100">
            <ClipboardPaste className="h-3.5 w-3.5" /> Tempel Soal
          </button>
          <button onClick={() => { setInput("Jelaskan konsep "); taRef.current?.focus(); }} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200">
            <Lightbulb className="h-3.5 w-3.5" /> Jelaskan Materi
          </button>
          <button onClick={() => send("Buatkan rencana belajar minggu ini")} disabled={thinking} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50">
            <CalendarRange className="h-3.5 w-3.5" /> Buat Rencana
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6" aria-live="polite">
          {!chat || chat.messages.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center py-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-marun-50 text-marun-700"><Sparkles className="h-8 w-8" /></span>
              <h1 className="mt-4 text-xl font-extrabold">Halo {user!.name.split(" ")[0]}, ada yang bisa NARA bantu?</h1>
              <p className="mt-2 text-sm text-slate-500">NARA dapat menjelaskan konsep, merangkum materi, membaca hasil pretest, dan menyusun rencana belajar sesuai jurusan yang kamu minati.</p>
              {mode === "demo" && (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                  Mode demo: jawaban bukan hasil model AI langsung, melainkan disusun dari materi Pusat Belajar dan data belajarmu. Integrasi AI dapat diaktifkan melalui konfigurasi server.
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-navy-200 bg-navy-50 px-3.5 py-2 text-sm font-semibold text-navy-700 transition hover:bg-navy-100">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {chat.messages.map((m) => (
                <li key={m.id} className={cx("flex gap-2.5", m.role === "user" && "justify-end")}>
                  {m.role === "assistant" && <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-marun-700 text-white"><Sparkles className="h-4 w-4" /></span>}
                  <div className={cx("max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]", m.role === "user" ? "rounded-br-md bg-marun-700 text-white" : "rounded-bl-md bg-canvas text-ink")}>
                    {m.role === "user" ? <p className="whitespace-pre-wrap text-sm">{m.content}</p> : <RichText text={m.content} />}
                    <p className={cx("mt-1 text-right text-[10px]", m.role === "user" ? "text-marun-100" : "text-slate-400")}>{new Date(m.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </li>
              ))}
              {thinking && (
                <li className="flex gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-marun-700 text-white"><Sparkles className="h-4 w-4" /></span>
                  <div className="typing flex items-center gap-1 rounded-2xl rounded-bl-md bg-canvas px-4 py-3" aria-label="NARA sedang menjawab">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                  </div>
                </li>
              )}
            </ul>
          )}
          {thinking && (!chat || chat.messages.length === 0) && <p className="text-center text-sm text-slate-500">NARA sedang menjawab…</p>}
          {error && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-slate-100 p-3 sm:p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 focus-within:border-marun-500 focus-within:ring-2 focus-within:ring-marun-500/20">
            <label htmlFor="nara-input" className="sr-only">Tulis pertanyaan untuk NARA</label>
            <textarea
              id="nara-input"
              ref={taRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Tanyakan konsep, minta rangkuman, atau rencana belajar…"
              className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none"
              maxLength={1000}
            />
            <Button type="submit" size="sm" className="h-10 w-10 shrink-0 px-0" disabled={!input.trim() || thinking} loading={thinking} aria-label="Kirim">
              {!thinking && <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-slate-400">Enter untuk kirim · Shift+Enter baris baru · NARA bisa keliru, periksa kembali informasi penting.</p>
        </form>
      </section>
    </div>
  );
}
