"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import type {
  ActivityKind,
  Announcement,
  CareerArticle,
  ChatMessage,
  ChatSession,
  CommunityEvent,
  ForumPost,
  LearningMaterial,
  MajorTestResult,
  MentorApplication,
  SchedulePref,
  University,
  Major,
  Mentor,
  PretestQuestion,
  Scholarship,
  Settings,
  Subject,
  Task,
  TestResult,
  User,
  UserCategory,
  UserData,
  UserProfile,
} from "./types";
import { dayKey, hashPassword, isCampusEmail, uid } from "./utils";
import { SEED_MATERIALS, SEED_PRETEST, SEED_SUBJECTS } from "@/data/learning";
import { SEED_ANNOUNCEMENTS, SEED_ARTICLES, SEED_MAJORS, SEED_MENTORS, SEED_SCHOLARSHIPS } from "@/data/career";
import { SEED_EVENTS, SEED_UNIVERSITIES } from "@/data/universities";

/**
 * LAYANAN DATA — MODE DEMO
 * Semua data disimpan di localStorage browser (key: "sinau-v1") agar tidak hilang saat berpindah halaman.
 * Untuk produksi, ganti aksi-aksi di bawah dengan panggilan Supabase (lihat supabase/schema.sql & README).
 */

export interface ContentState {
  subjects: Subject[];
  materials: LearningMaterial[];
  pretest: PretestQuestion[];
  majors: Major[];
  articles: CareerArticle[];
  scholarships: Scholarship[];
  mentors: Mentor[];
  announcements: Announcement[];
  universities: University[];
  events: CommunityEvent[];
}

export type ContentKey = keyof ContentState;

const defaultProfile = (status: UserCategory): UserProfile => ({
  onboarded: false,
  education: "",
  status,
  majors: [],
  goals: [],
  focusSubjects: [],
  dailyMinutes: 30,
  studyTime: "",
});

const defaultSettings: Settings = {
  dailyTarget: 1,
  reminders: true,
  reminderTime: "19:00",
  emailNotif: false,
  fontScale: "normal",
  reduceMotion: false,
  highContrast: false,
  timerPretest: true,
  deadlineLeadHours: 24,
  browserNotif: false,
};

const emptyUserData = (status: UserCategory): UserData => ({
  profile: defaultProfile(status),
  settings: defaultSettings,
  completed: {},
  lastOpened: null,
  quizResults: [],
  pretests: [],
  tasks: [],
  activity: [],
  chats: [],
  studyLog: [],
  schedulePref: null,
  majorTests: [],
  savedUniversities: [],
  notified: [],
});

const seedContent = (): ContentState => ({
  subjects: SEED_SUBJECTS,
  materials: SEED_MATERIALS,
  pretest: SEED_PRETEST,
  majors: SEED_MAJORS,
  articles: SEED_ARTICLES,
  scholarships: SEED_SCHOLARSHIPS,
  mentors: SEED_MENTORS,
  announcements: SEED_ANNOUNCEMENTS,
  universities: SEED_UNIVERSITIES,
  events: SEED_EVENTS,
});

type Result = { ok: true } | { ok: false; error: string };

interface State {
  users: User[];
  sessionId: string | null;
  data: Record<string, UserData>;
  content: ContentState;
  forum: ForumPost[];
  mentorApps: MentorApplication[];

  // auth
  register: (p: { name: string; email: string; password: string; category: UserCategory }) => Promise<Result>;
  login: (email: string, password: string) => Promise<Result>;
  loginDemo: (role: "user" | "admin") => void;
  logout: () => void;
  updateAccount: (p: { name: string }) => void;
  deleteAccountData: () => void;

  // profil & pengaturan
  saveProfile: (p: Partial<UserProfile>) => void;
  saveSettings: (p: Partial<Settings>) => void;

  // belajar
  openMaterial: (id: string) => void;
  completeMaterial: (id: string, title: string) => void;
  uncompleteMaterial: (id: string) => void;
  submitQuiz: (materialId: string, title: string, correct: number, total: number) => void;
  submitPretest: (r: Omit<TestResult, "id" | "date">) => string;
  submitPractice: (key: string, label: string, correct: number, total: number) => void;
  logStudy: (materialId: string, seconds: number) => void;

  // jadwal pintar, tes jurusan, kampus, pengingat
  saveSchedulePref: (p: SchedulePref) => void;
  addTasksBulk: (t: (Omit<Task, "id" | "createdAt" | "status">)[]) => void;
  submitMajorTest: (r: Omit<MajorTestResult, "id" | "date">) => void;
  toggleSavedUniversity: (id: string) => void;
  markNotified: (ids: string[]) => void;

  // komunitas
  togglePostUpvote: (postId: string) => void;
  deletePost: (postId: string) => void;
  applyMentor: (p: Pick<MentorApplication, "role" | "major" | "institution" | "motivation">) => void;
  reviewMentorApp: (id: string, status: "disetujui" | "ditolak") => void;

  // tugas
  addTask: (t: Omit<Task, "id" | "createdAt" | "status"> & { status?: Task["status"] }) => void;
  updateTask: (id: string, p: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: Task["status"]) => void;

  // NARA
  newChat: () => string;
  addChatMessage: (sessionId: string, m: Omit<ChatMessage, "id" | "at">) => void;
  deleteChat: (id: string) => void;

  // forum (Career Lounge)
  addPost: (topic: string, body: string, askMentor?: boolean) => void;
  addReply: (postId: string, body: string) => void;

  // admin CRUD konten
  upsertContent: <K extends ContentKey>(key: K, item: ContentState[K][number]) => void;
  removeContent: (key: ContentKey, id: string) => void;
  resetContent: () => void;
}

function logActivity(d: UserData, kind: ActivityKind, label: string, refId?: string): UserData {
  return {
    ...d,
    activity: [...d.activity, { id: refId ? `${kind}:${refId}:${Date.now()}` : uid(), date: dayKey(), at: new Date().toISOString(), kind, label }],
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const mutate = (fn: (d: UserData) => UserData) => {
        const id = get().sessionId;
        if (!id) return;
        const cur = get().data[id];
        if (!cur) return;
        set({ data: { ...get().data, [id]: fn(cur) } });
      };

      return {
        users: [],
        sessionId: null,
        data: {},
        content: seedContent(),
        forum: [],
        mentorApps: [],

        async register({ name, email, password, category }) {
          const e = email.trim().toLowerCase();
          if (get().users.some((u) => u.email === e)) return { ok: false, error: "Email ini sudah terdaftar. Silakan masuk." };
          const salt = uid();
          const user: User = {
            id: uid(),
            name: name.trim(),
            email: e,
            salt,
            passwordHash: await hashPassword(password, salt),
            role: "user",
            category,
            campusEmail: isCampusEmail(e),
            createdAt: new Date().toISOString(),
          };
          set({ users: [...get().users, user], sessionId: user.id, data: { ...get().data, [user.id]: emptyUserData(category) } });
          return { ok: true };
        },

        async login(email, password) {
          const e = email.trim().toLowerCase();
          const user = get().users.find((u) => u.email === e && !u.isDemo);
          if (!user) return { ok: false, error: "Email belum terdaftar di perangkat ini. Daftar dulu atau gunakan mode demo." };
          const h = await hashPassword(password, user.salt);
          if (h !== user.passwordHash) return { ok: false, error: "Kata sandi tidak sesuai." };
          const data = get().data[user.id] ? get().data : { ...get().data, [user.id]: emptyUserData(user.category) };
          authNav.leaving = false;
          set({ sessionId: user.id, data });
          return { ok: true };
        },

        loginDemo(role) {
          const email = role === "admin" ? "admin@demo.sinau" : "pengguna@demo.sinau";
          let user = get().users.find((u) => u.email === email);
          if (!user) {
            user = {
              id: uid(),
              name: role === "admin" ? "Admin Demo" : "Pengguna Demo",
              email,
              salt: "",
              passwordHash: "",
              role,
              category: "calon",
              campusEmail: false,
              createdAt: new Date().toISOString(),
              isDemo: true,
            };
            set({ users: [...get().users, user] });
          }
          const data = get().data[user.id] ? get().data : { ...get().data, [user.id]: emptyUserData("calon") };
          set({ sessionId: user.id, data });
        },

        logout() {
          authNav.leaving = true;
          set({ sessionId: null });
        },

        updateAccount({ name }) {
          const id = get().sessionId;
          set({ users: get().users.map((u) => (u.id === id ? { ...u, name: name.trim() || u.name } : u)) });
        },

        deleteAccountData() {
          const id = get().sessionId;
          if (!id) return;
          const u = get().users.find((x) => x.id === id);
          set({ data: { ...get().data, [id]: emptyUserData(u?.category ?? "calon") } });
        },

        saveProfile(p) {
          mutate((d) => ({ ...d, profile: { ...d.profile, ...p } }));
          if (p.status) {
            const id = get().sessionId;
            set({ users: get().users.map((u) => (u.id === id ? { ...u, category: p.status! } : u)) });
          }
        },
        saveSettings(p) {
          mutate((d) => ({ ...d, settings: { ...d.settings, ...p } }));
        },

        openMaterial(id) {
          mutate((d) => ({ ...d, lastOpened: { materialId: id, at: new Date().toISOString() } }));
        },
        completeMaterial(id, title) {
          mutate((d) => {
            if (d.completed[id]) return d;
            return logActivity({ ...d, completed: { ...d.completed, [id]: new Date().toISOString() } }, "materi", `Menyelesaikan materi “${title}”`, id);
          });
        },
        uncompleteMaterial(id) {
          mutate((d) => {
            const c = { ...d.completed };
            delete c[id];
            const today = dayKey();
            // hapus aktivitas hari ini yang berasal dari materi ini agar streak tetap jujur
            return { ...d, completed: c, activity: d.activity.filter((a) => !(a.id.startsWith(`materi:${id}:`) && a.date === today)) };
          });
        },
        submitQuiz(materialId, title, correct, total) {
          mutate((d) =>
            logActivity(
              { ...d, quizResults: [...d.quizResults, { materialId, correct, total, date: new Date().toISOString() }] },
              "kuis",
              `Kuis “${title}” (${correct}/${total})`,
              materialId,
            ),
          );
        },
        submitPretest(r) {
          const id = uid();
          mutate((d) => logActivity({ ...d, pretests: [...d.pretests, { ...r, id, date: new Date().toISOString() }] }, "pretest", `Pretest — skor ${r.score}`, id));
          return id;
        },

        submitPractice(key, label, correct, total) {
          mutate((d) =>
            logActivity({ ...d, quizResults: [...d.quizResults, { materialId: key, correct, total, date: new Date().toISOString() }] }, "latihan", `${label} (${correct}/${total})`, key),
          );
        },
        logStudy(materialId, seconds) {
          if (seconds < 1) return;
          mutate((d) => {
            const today = dayKey();
            const i = d.studyLog.findIndex((l) => l.date === today && l.materialId === materialId);
            const log = [...d.studyLog];
            if (i >= 0) log[i] = { ...log[i], seconds: log[i].seconds + Math.round(seconds) };
            else log.push({ date: today, materialId, seconds: Math.round(seconds) });
            return { ...d, studyLog: log };
          });
        },
        saveSchedulePref(p) {
          mutate((d) => ({ ...d, schedulePref: p }));
        },
        addTasksBulk(list) {
          const now = new Date().toISOString();
          mutate((d) => ({ ...d, tasks: [...d.tasks, ...list.map((t) => ({ ...t, status: "todo" as const, id: uid(), createdAt: now }))] }));
        },
        submitMajorTest(r) {
          mutate((d) => ({ ...d, majorTests: [...d.majorTests, { ...r, id: uid(), date: new Date().toISOString() }] }));
        },
        toggleSavedUniversity(id) {
          mutate((d) => ({ ...d, savedUniversities: d.savedUniversities.includes(id) ? d.savedUniversities.filter((x) => x !== id) : [...d.savedUniversities, id] }));
        },
        markNotified(ids) {
          mutate((d) => ({ ...d, notified: Array.from(new Set([...d.notified, ...ids])).slice(-500) }));
        },
        togglePostUpvote(postId) {
          const uidNow = get().sessionId;
          if (!uidNow) return;
          set({
            forum: get().forum.map((p) => {
              if (p.id !== postId) return p;
              const up = p.upvotes ?? [];
              return { ...p, upvotes: up.includes(uidNow) ? up.filter((x) => x !== uidNow) : [...up, uidNow] };
            }),
          });
        },
        deletePost(postId) {
          const u = get().users.find((x) => x.id === get().sessionId);
          const post = get().forum.find((p) => p.id === postId);
          if (!u || !post) return;
          if (u.role !== "admin" && post.authorId !== u.id) return; // hanya penulis atau admin
          set({ forum: get().forum.filter((p) => p.id !== postId) });
        },
        applyMentor(p) {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (!u) return;
          if (get().mentorApps.some((a) => a.userId === u.id && a.status === "menunggu")) return;
          set({ mentorApps: [...get().mentorApps, { ...p, id: uid(), userId: u.id, name: u.name, at: new Date().toISOString(), status: "menunggu" }] });
        },
        reviewMentorApp(id, status) {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (u?.role !== "admin") return;
          const app = get().mentorApps.find((a) => a.id === id);
          if (!app) return;
          const mentors = status === "disetujui"
            ? [...get().content.mentors, { id: uid(), name: app.name, role: app.role, major: `${app.major}${app.institution ? ` · ${app.institution}` : ""}`, bio: app.motivation, verified: true }]
            : get().content.mentors;
          set({ mentorApps: get().mentorApps.map((a) => (a.id === id ? { ...a, status } : a)), content: { ...get().content, mentors } });
        },

        addTask(t) {
          mutate((d) => ({ ...d, tasks: [...d.tasks, { ...t, status: t.status ?? "todo", id: uid(), createdAt: new Date().toISOString() }] }));
        },
        updateTask(id, p) {
          mutate((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...p } : t)) }));
        },
        deleteTask(id) {
          mutate((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
        },
        setTaskStatus(id, status) {
          mutate((d) => {
            const task = d.tasks.find((t) => t.id === id);
            if (!task || task.status === status) return d;
            const today = dayKey();
            let next: UserData = {
              ...d,
              tasks: d.tasks.map((t) => (t.id === id ? { ...t, status, completedAt: status === "done" ? new Date().toISOString() : undefined } : t)),
            };
            if (status === "done") next = logActivity(next, "tugas", `Menyelesaikan tugas “${task.title}”`, id);
            else if (task.status === "done")
              next = { ...next, activity: next.activity.filter((a) => !(a.id.startsWith(`tugas:${id}:`) && a.date === today)) };
            return next;
          });
        },

        newChat() {
          const id = uid();
          mutate((d) => ({ ...d, chats: [{ id, title: "Percakapan baru", createdAt: new Date().toISOString(), messages: [] }, ...d.chats] }));
          return id;
        },
        addChatMessage(sessionId, m) {
          mutate((d) => ({
            ...d,
            chats: d.chats.map((c: ChatSession) =>
              c.id === sessionId
                ? {
                    ...c,
                    title: c.messages.length === 0 && m.role === "user" ? m.content.slice(0, 48) : c.title,
                    messages: [...c.messages, { ...m, id: uid(), at: new Date().toISOString() }],
                  }
                : c,
            ),
          }));
        },
        deleteChat(id) {
          mutate((d) => ({ ...d, chats: d.chats.filter((c) => c.id !== id) }));
        },

        addPost(topic, body, askMentor = false) {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (!u) return;
          set({ forum: [{ id: uid(), author: u.name, authorId: u.id, authorRole: u.role, topic, body, askMentor, upvotes: [], at: new Date().toISOString(), replies: [] }, ...get().forum] });
        },
        addReply(postId, body) {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (!u) return;
          set({
            forum: get().forum.map((p) =>
              p.id === postId ? { ...p, replies: [...p.replies, { id: uid(), author: u.name, authorId: u.id, authorRole: u.role, body, at: new Date().toISOString() }] } : p,
            ),
          });
        },

        upsertContent(key, item) {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (u?.role !== "admin") return; // otorisasi sisi klien (demo). Produksi: RLS Supabase.
          const list = get().content[key] as { id: string }[];
          const exists = list.some((x) => x.id === (item as { id: string }).id);
          const next = exists ? list.map((x) => (x.id === (item as { id: string }).id ? item : x)) : [...list, item];
          set({ content: { ...get().content, [key]: next } });
        },
        removeContent(key, id) {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (u?.role !== "admin") return;
          set({ content: { ...get().content, [key]: (get().content[key] as { id: string }[]).filter((x) => x.id !== id) } });
        },
        resetContent() {
          const u = get().users.find((x) => x.id === get().sessionId);
          if (u?.role !== "admin") return;
          set({ content: seedContent() });
        },
      };
    },
    {
      name: "sinau-v1",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 → v2: struktur lama tetap dipakai; kolom baru dilengkapi di `merge` di bawah.
      // Tanpa fungsi ini, zustand membuang data lama ketika versi berubah.
      migrate: (persisted) => persisted as State,
      // lengkapi data lama dengan kolom baru agar pengguna versi sebelumnya tidak kehilangan data
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        const content = { ...seedContent(), ...(p.content ?? {}) } as ContentState;
        const data: Record<string, UserData> = {};
        for (const [k, v] of Object.entries(p.data ?? {})) {
          const base = emptyUserData(v.profile?.status ?? "calon");
          data[k] = { ...base, ...v, settings: { ...defaultSettings, ...(v.settings ?? {}) } };
        }
        return { ...current, ...p, content, data, mentorApps: p.mentorApps ?? [], forum: p.forum ?? [] };
      },
    },
  ),
);

/** Penanda logout disengaja agar guard halaman mengarah ke beranda, bukan ke halaman masuk. */
export const authNav = { leaving: false };

/** true setelah data dari localStorage termuat (hindari hydration mismatch) */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setH(true));
    if (useStore.persist.hasHydrated()) setH(true);
    return unsub;
  }, []);
  return h;
}

export function useSession() {
  const users = useStore((s) => s.users);
  const sessionId = useStore((s) => s.sessionId);
  const data = useStore((s) => s.data);
  const user = users.find((u) => u.id === sessionId) ?? null;
  const ud = user ? data[user.id] ?? null : null;
  return { user, data: ud };
}
