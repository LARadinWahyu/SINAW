// ===== Model data SINAU (mengikuti struktur yang disarankan di brief) =====

export type Role = "user" | "admin";
export type UserCategory = "calon" | "maba" | "siswa";
export type Level = "Dasar" | "Menengah" | "Lanjut";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // SHA-256 + salt (mode demo). Produksi: gunakan Supabase Auth.
  salt: string;
  role: Role;
  category: UserCategory;
  campusEmail: boolean; // simulasi jalur B2B email kampus (BELUM terverifikasi)
  createdAt: string;
  isDemo?: boolean;
}

export interface UserProfile {
  onboarded: boolean;
  education: string; // jenjang
  status: UserCategory;
  majors: string[]; // id jurusan yang diminati
  goals: string[];
  focusSubjects: string[]; // id subject
  dailyMinutes: number;
  studyTime: string; // pagi/siang/malam
}

export interface Settings {
  dailyTarget: number; // jumlah aktivitas belajar per hari agar streak bertambah
  reminders: boolean;
  reminderTime: string;
  emailNotif: boolean;
  fontScale: "normal" | "besar";
  reduceMotion: boolean;
  highContrast: boolean;
  timerPretest: boolean;
  deadlineLeadHours: number; // berapa jam sebelum tenggat pengingat muncul
  browserNotif: boolean;
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // nama ikon lucide
  color: string;
  description: string;
  majors: string[]; // jurusan yang relevan; "*" = semua
}

export interface MaterialSection {
  heading: string;
  body: string; // paragraf dipisah \n\n
  example?: string;
  illustration?: "limit" | "normal" | "truth" | "flow" | "matrix" | "time" | "supply" | "cell" | "paper";
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // index jawaban benar
  explanation?: string;
}

export interface LearningMaterial {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  minutes: number;
  level: Level;
  topic: string; // dipakai untuk mencocokkan hasil pretest
  sections: MaterialSection[];
  quiz: QuizQuestion[];
  demo: boolean;
  videoUrl?: string; // URL YouTube (opsional, diisi admin)
}

export interface PretestQuestion extends QuizQuestion {
  topic: string;
  subjectId: string;
}

export interface AnswerRecord {
  questionId: string;
  selected: number | null;
}

export interface TestResult {
  id: string;
  date: string;
  score: number; // 0-100
  correct: number;
  total: number;
  durationSec: number;
  byTopic: Record<string, { correct: number; total: number }>;
  answers: AnswerRecord[];
}

export interface QuizResult {
  materialId: string;
  date: string;
  correct: number;
  total: number;
}

export type TaskStatus = "todo" | "doing" | "done";
export type Priority = "rendah" | "sedang" | "tinggi";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: Priority;
  category: string; // subjectId atau "umum"
  materialId?: string;
  status: TaskStatus;
  reminder: boolean;
  createdAt: string;
  completedAt?: string;
}

export type ActivityKind = "materi" | "kuis" | "pretest" | "tugas" | "latihan";
export interface ActivityEvent {
  id: string;
  date: string; // YYYY-MM-DD (lokal)
  at: string; // ISO
  kind: ActivityKind;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface Major {
  id: string;
  name: string;
  cluster: string;
  description: string;
  subjects: string[];
  careers: string[];
  demo: boolean;
}

export interface CareerArticle {
  id: string;
  title: string;
  category: "Budaya Kampus" | "Persiapan Kuliah" | "Karier" | "Minat & Jurusan";
  summary: string;
  body: string;
  minutes: number;
  demo: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  link: string;
  verified: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  major: string;
  bio: string;
  verified: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface ForumPost {
  id: string;
  author: string;
  authorId?: string;
  authorRole?: Role;
  topic: string;
  body: string;
  at: string;
  askMentor?: boolean;
  upvotes?: string[];
  replies: { id: string; author: string; authorId?: string; authorRole?: Role; body: string; at: string }[];
}

export interface University {
  id: string;
  name: string;
  short: string;
  city: string;
  province: string;
  island: "Jawa" | "Sumatra" | "Sulawesi" | "Kalimantan" | "Bali & Nusa Tenggara" | "Papua & Maluku";
  type: "PTN" | "PTS";
  clusters: string[]; // id jurusan (MAJOR_OPTIONS) yang umumnya tersedia
  website: string;
  verified: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  speaker: string;
  date: string; // YYYY-MM-DD
  time: string;
  description: string;
  link: string;
  verified: boolean;
}

export interface MentorApplication {
  id: string;
  userId: string;
  name: string;
  role: string; // alumni / mahasiswa tingkat akhir / dosen
  major: string;
  institution: string;
  motivation: string;
  at: string;
  status: "menunggu" | "disetujui" | "ditolak";
}

export interface StudyLog {
  date: string; // YYYY-MM-DD
  materialId: string;
  seconds: number;
}

export interface SchedulePref {
  days: number[]; // 0=Minggu … 6=Sabtu
  start: string; // HH:mm
  sessionMin: number;
  sessionsPerDay: number;
  weeks: number;
  includeReview: boolean;
}

export interface MajorTestResult {
  id: string;
  date: string;
  scores: Record<string, number>; // majorId -> 0..100
  dims: Record<string, number>; // dimensi minat -> 0..100
}

export interface UserData {
  profile: UserProfile;
  settings: Settings;
  completed: Record<string, string>; // materialId -> ISO tanggal selesai
  lastOpened: { materialId: string; at: string } | null;
  quizResults: QuizResult[];
  pretests: TestResult[];
  tasks: Task[];
  activity: ActivityEvent[];
  chats: ChatSession[];
  studyLog: StudyLog[];
  schedulePref: SchedulePref | null;
  majorTests: MajorTestResult[];
  savedUniversities: string[];
  notified: string[]; // id pengingat tenggat yang sudah dikirim (hindari duplikat)
}
