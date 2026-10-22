"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { LogoMark } from "@/components/Logo";
import { authNav, useHydrated, useSession } from "@/lib/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const { user, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace(authNav.leaving ? "/" : "/masuk");
    else if (data && !data.profile.onboarded) router.replace("/onboarding");
  }, [hydrated, user, data, router]);

  if (!hydrated || !user || !data?.profile.onboarded)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-slate-500">
        <LogoMark className="h-12 w-12 animate-pulse" />
        Memuat SINAU…
      </div>
    );
  return <AppShell>{children}</AppShell>;
}
