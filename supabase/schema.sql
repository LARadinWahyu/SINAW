-- =====================================================================
-- SINAU — skema database untuk Supabase (rencana integrasi produksi)
-- Jalankan di Supabase → SQL Editor. Belum dipakai oleh mode demo.
-- Autentikasi memakai Supabase Auth (tabel auth.users); kata sandi tidak
-- pernah disimpan di tabel aplikasi.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Profil & peran ----------
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'user' check (role in ('user','admin')),
  category text not null check (category in ('siswa','calon','maba')),
  campus_verified boolean not null default false,   -- diisi oleh proses SSO/B2B kampus
  education text,
  majors text[] not null default '{}',
  goals text[] not null default '{}',
  focus_subjects text[] not null default '{}',
  daily_minutes int not null default 30,
  study_time text,
  onboarded boolean not null default false,
  settings jsonb not null default '{"dailyTarget":1,"reminders":true,"reminderTime":"19:00"}',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- Konten (dikelola admin) ----------
create table public.subjects (
  id text primary key, name text not null, icon text, color text, description text,
  majors text[] not null default '{*}'
);
create table public.learning_materials (
  id text primary key, subject_id text not null references public.subjects(id) on delete cascade,
  title text not null, description text, minutes int not null default 15,
  level text not null check (level in ('Dasar','Menengah','Lanjut')),
  topic text not null, sections jsonb not null default '[]', is_demo boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.questions (            -- kuis materi (material_id) & bank soal pretest (material_id null)
  id uuid primary key default gen_random_uuid(),
  material_id text references public.learning_materials(id) on delete cascade,
  subject_id text references public.subjects(id) on delete set null,
  topic text, prompt text not null, explanation text
);
create table public.answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  position int not null, label text not null, is_correct boolean not null default false
);
create table public.pretests (id uuid primary key default gen_random_uuid(), title text not null, active boolean default true);
create table public.majors (id text primary key, name text not null, cluster text, description text, subjects text[], careers text[], is_demo boolean default false);
create table public.career_articles (id uuid primary key default gen_random_uuid(), title text not null, category text, summary text, body text, minutes int, is_demo boolean default false);
create table public.scholarships (id uuid primary key default gen_random_uuid(), name text not null, provider text, description text, link text, verified boolean default false);
create table public.mentors (id uuid primary key default gen_random_uuid(), name text not null, role text, major text, bio text, verified boolean default false);
create table public.announcements (id uuid primary key default gen_random_uuid(), title text not null, body text, date date default current_date);

-- ---------- Data milik pengguna ----------
create table public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pretest_id uuid references public.pretests(id),
  started_at timestamptz default now(), submitted_at timestamptz,
  answers jsonb not null default '[]'
);
create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.test_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null, correct int not null, total int not null, by_topic jsonb not null,
  created_at timestamptz default now()
);
create table public.learning_progress (
  user_id uuid references auth.users(id) on delete cascade,
  material_id text references public.learning_materials(id) on delete cascade,
  completed_at timestamptz, last_opened_at timestamptz,
  primary key (user_id, material_id)
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) >= 3), description text,
  due_date date not null, due_time time not null default '19:00',
  priority text not null default 'sedang' check (priority in ('rendah','sedang','tinggi')),
  category text, material_id text references public.learning_materials(id) on delete set null,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  reminder boolean default true, completed_at timestamptz, created_at timestamptz default now()
);
create table public.study_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weekday int check (weekday between 0 and 6), start_time time, end_time time, subject_id text
);
create table public.streak_records (       -- satu baris per aktivitas belajar
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null, kind text not null check (kind in ('materi','kuis','pretest','tugas')),
  ref_id text, label text, created_at timestamptz default now()
);
create table public.achievements (
  user_id uuid references auth.users(id) on delete cascade, code text, earned_at timestamptz default now(),
  primary key (user_id, code)
);
create table public.chat_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text, created_at timestamptz default now());
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant')), content text not null, created_at timestamptz default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text, body text, read boolean default false, created_at timestamptz default now()
);
create table public.study_logs (            -- waktu belajar aktif per materi per hari
  user_id uuid references auth.users(id) on delete cascade,
  material_id text references public.learning_materials(id) on delete cascade,
  log_date date not null, seconds int not null default 0,
  primary key (user_id, material_id, log_date)
);
create table public.major_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scores jsonb not null, dims jsonb not null, created_at timestamptz default now()
);
create table public.universities (
  id text primary key, name text not null, short text, city text, province text, island text,
  type text check (type in ('PTN','PTS')), clusters text[] not null default '{}', website text, verified boolean default false
);
create table public.saved_universities (
  user_id uuid references auth.users(id) on delete cascade,
  university_id text references public.universities(id) on delete cascade,
  primary key (user_id, university_id)
);
create table public.community_events (
  id uuid primary key default gen_random_uuid(), title text not null, speaker text, event_date date not null,
  event_time time, description text, link text, verified boolean default false
);
create table public.mentor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text, major text, institution text, motivation text,
  status text not null default 'menunggu' check (status in ('menunggu','disetujui','ditolak')),
  created_at timestamptz default now()
);
create table public.forum_upvotes (
  post_id uuid, user_id uuid references auth.users(id) on delete cascade, primary key (post_id, user_id)
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  parent_id uuid references public.forum_posts(id) on delete cascade, topic text, body text not null, created_at timestamptz default now()
);

-- ---------- Row Level Security ----------
do $$
declare t text;
begin
  -- konten: semua pengguna login boleh membaca, hanya admin yang menulis
  foreach t in array array['subjects','learning_materials','questions','answer_options','pretests','majors','career_articles','scholarships','mentors','announcements','universities','community_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%s_read" on public.%I for select to authenticated using (true)', t, t);
    execute format('create policy "%s_admin_write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
  -- data pribadi: hanya pemiliknya (admin boleh membaca untuk analitik)
  foreach t in array array['test_attempts','test_results','learning_progress','tasks','study_schedules','streak_records','achievements','chat_sessions','notifications','study_logs','major_test_results','saved_universities','mentor_applications','forum_upvotes'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%s_own" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t, t);
    execute format('create policy "%s_admin_read" on public.%I for select to authenticated using (public.is_admin())', t, t);
  end loop;
end $$;

-- PENTING: kunci jawaban (answer_options.is_correct) sebaiknya TIDAK dibaca langsung oleh klien.
-- Untuk produksi, ganti policy baca answer_options dengan view tanpa kolom is_correct
-- dan nilai jawaban lewat Edge Function / RPC berikut.

alter table public.user_profiles enable row level security;
create policy "profile_own" on public.user_profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = 'user');
create policy "profile_admin" on public.user_profiles for all to authenticated using (public.is_admin());

alter table public.chat_messages enable row level security;
create policy "chat_msg_own" on public.chat_messages for all to authenticated
  using (exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = auth.uid()));

alter table public.forum_posts enable row level security;
create policy "forum_read" on public.forum_posts for select to authenticated using (true);
create policy "forum_write_own" on public.forum_posts for insert to authenticated with check (user_id = auth.uid());
create policy "forum_delete" on public.forum_posts for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- admin perlu mengubah status pengajuan mentor
create policy "mentor_app_admin_update" on public.mentor_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
