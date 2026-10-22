import { NextResponse } from "next/server";

/**
 * Endpoint server untuk AI NARA.
 * - Jika NARA_AI_API_KEY & NARA_AI_MODEL BELUM diisi → { mode: "demo" } dan frontend memakai jawaban demo.
 * - Jika diisi → meneruskan pertanyaan ke Anthropic Messages API dari SERVER (API key tidak pernah dikirim ke browser).
 *   Ganti blok fetch di bawah bila ingin memakai penyedia AI lain.
 */

export const dynamic = "force-dynamic";

const SYSTEM = `Kamu adalah NARA, asisten belajar platform SINAU (Siap Nambah Ilmu) untuk calon mahasiswa dan mahasiswa baru di Indonesia.
Jawab selalu dalam bahasa Indonesia yang ramah, jelas, dan ringkas. Bantu menjelaskan konsep, membuat rangkuman, dan menyusun rencana belajar.
Sesuaikan contoh dengan jurusan yang diminati pengguna bila diketahui. Jika tidak yakin, katakan terus terang.`;

export async function GET() {
  const live = Boolean(process.env.NARA_AI_API_KEY && process.env.NARA_AI_MODEL);
  return NextResponse.json({ mode: live ? "live" : "demo" });
}

export async function POST(req: Request) {
  const key = process.env.NARA_AI_API_KEY;
  const model = process.env.NARA_AI_MODEL;
  if (!key || !model) return NextResponse.json({ mode: "demo" });

  let body: { messages?: { role: "user" | "assistant"; content: string }[]; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const messages = (body.messages ?? []).filter((m) => m && typeof m.content === "string" && m.content.trim()).slice(-20);
  if (!messages.length) return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM + (body.context ? `\n\nKonteks pengguna: ${String(body.context).slice(0, 1500)}` : ""),
        messages,
      }),
    });
    if (!r.ok) return NextResponse.json({ error: "Layanan AI sedang tidak dapat dihubungi." }, { status: 502 });
    const j = await r.json();
    const text = (j.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n");
    return NextResponse.json({ mode: "live", reply: text });
  } catch {
    return NextResponse.json({ error: "Layanan AI sedang tidak dapat dihubungi." }, { status: 502 });
  }
}
