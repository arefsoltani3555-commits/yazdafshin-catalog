"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AdminAuthGateProps = {
  children: ReactNode;
};

export default function AdminAuthGate({ children }: AdminAuthGateProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    let mounted = true;

    async function redirectToLogin() {
      await supabase.auth.signOut();
      if (!mounted) return;
      setStatus("unauthenticated");
      router.replace("/admin");
    }

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      const session = data.session;

      if (error || !session?.user?.id || !session?.access_token) {
        redirectToLogin();
        return;
      }

      if (session.expires_at && session.expires_at * 1000 <= Date.now()) {
        redirectToLogin();
        return;
      }

      setStatus("authenticated");
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user?.id && session?.access_token) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        router.replace("/admin");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (status !== "authenticated") {
    return (
      <main dir="rtl" className="grid min-h-screen place-items-center bg-[#050505] px-6 text-white">
        <div className="w-full max-w-md rounded-[28px] border border-[#d5b466]/20 bg-black/40 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full border border-[#d5b466]/35 bg-[#d5b466]/10" />
          <p className="text-[11px] tracking-[0.3em] text-[#d5b466]/70">ADMIN ACCESS</p>
          <h1 className="mt-3 text-2xl font-black text-[#f3deb0]">در حال بررسی دسترسی</h1>
          <p className="mt-3 text-sm leading-7 text-white/55">
            در حال بررسی ورود مدیر هستیم. اگر وارد نشده باشی، همین حالا به صفحه ورود منتقل می‌شوی.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
