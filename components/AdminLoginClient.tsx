"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const isCooldownActive = cooldownUntil !== null && cooldownSeconds > 0;

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data.session) {
        router.replace("/admin-v2");
        return;
      }

      setIsChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSeconds(0);
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(remaining);

      if (remaining <= 0) {
        setCooldownUntil(null);
        setFailedAttempts(0);
      }
    };

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCooldownActive) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        setCooldownUntil(Date.now() + 5 * 60 * 1000);
        setErrorMessage("برای امنیت، ورود موقتاً ۵ دقیقه قفل شد. چند دقیقه بعد دوباره تلاش کن.");
      } else {
        setErrorMessage("ورود انجام نشد. اطلاعات ورود درست نبود. دوباره بررسی کن.");
      }

      setIsSubmitting(false);
      return;
    }

    setFailedAttempts(0);
    setCooldownUntil(null);
    router.replace("/admin-v2");
    router.refresh();
  }

  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#040404] px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,180,102,0.15),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d5b466]/40 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-[#d5b466]/20 bg-[#090909]/90 shadow-[0_40px_160px_rgba(0,0,0,0.55)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative hidden min-h-[720px] overflow-hidden lg:block">
            <Image
              src="/collections/velvet.jpg"
              alt="پنل مدیریت یزد افشین"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(213,180,102,0.25),transparent_28%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-[#d5b466]/25 bg-black/30 p-3">
                  <Image
                    src="/yazd-afshin-logo.png"
                    alt="یزد افشین"
                    width={78}
                    height={78}
                    className="h-16 w-16 object-contain"
                  />
                </div>

                <div>
                  <p className="text-[11px] tracking-[0.3em] text-[#d5b466]/70">YAZD AFSHIN</p>
                  <h1 className="mt-2 text-3xl font-black text-[#f3deb0]">ورود مدیریت</h1>
                </div>
              </div>

              <div className="max-w-md">
                <p className="text-sm font-bold text-[#d5b466]">پنل خصوصی مدیریت سایت</p>
                <h2 className="mt-4 text-5xl font-black leading-[1.25] text-white">
                  مدیریت محصولات
                  <br />
                  با ورود امن
                </h2>
                <p className="mt-6 text-sm leading-8 text-white/65">
                  از این بخش فقط مدیر سایت وارد می‌شود و می‌تواند محصولات، تصاویر و اطلاعات سایت را مدیریت کند.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/45">
                <span className="rounded-full border border-[#d5b466]/20 px-4 py-2 text-[#d5b466]">امن</span>
                <span className="rounded-full border border-white/10 px-4 py-2">متمرکز</span>
                <span className="rounded-full border border-white/10 px-4 py-2">ساده و کاربردی</span>
              </div>
            </div>
          </section>

          <section className="flex min-h-[720px] items-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="mb-4 flex justify-center">
                  <Image
                    src="/yazd-afshin-logo.png"
                    alt="یزد افشین"
                    width={88}
                    height={88}
                    className="h-20 w-20 object-contain"
                  />
                </div>
                <p className="text-center text-[11px] tracking-[0.35em] text-[#d5b466]/70">ADMIN PANEL</p>
                <h1 className="mt-3 text-center text-3xl font-black text-[#f3deb0]">ورود مدیریت</h1>
              </div>

              <div className="mb-8">
                <p className="text-[11px] tracking-[0.32em] text-[#d5b466]/70">SECURE SIGN IN</p>
                <h2 className="mt-3 text-3xl font-black text-white">ورود به پنل ادمین</h2>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  با ایمیل و رمز عبور مدیر وارد شو. بعد از ورود، به داشبورد مدیریت محصولات منتقل می‌شوی.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-white/70">ایمیل مدیر</span>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#d5b466]/60"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={isChecking || isSubmitting || isCooldownActive}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-white/70">رمز عبور</span>
                  <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-white/10 bg-black/35 focus-within:border-[#d5b466]/60">
                    <input
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/20"
                      autoComplete="current-password"
                      spellCheck={false}
                      disabled={isChecking || isSubmitting || isCooldownActive}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={isChecking || isSubmitting || isCooldownActive}
                      className="px-4 text-xs font-bold text-[#d5b466] disabled:opacity-50"
                    >
                      {showPassword ? "پنهان" : "نمایش"}
                    </button>
                  </div>
                </label>

                {errorMessage ? (
                  <div className="rounded-2xl border border-[#7f2431]/45 bg-[#7f2431]/10 px-4 py-3 text-xs leading-6 text-[#f4c1cb]">
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isChecking || isSubmitting || isCooldownActive}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#b78937] to-[#d7b76e] text-sm font-black text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isChecking
                    ? "در حال بررسی..."
                    : isSubmitting
                    ? "در حال ورود..."
                    : isCooldownActive
                    ? `تلاش دوباره تا ${cooldownSeconds} ثانیه دیگر`
                    : "ورود به پنل"}
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-7 text-white/45">
                اگر هنوز حساب مدیر ساخته نشده، باید یک حساب کاربری مدیر در Supabase Authentication بسازی و بعد با همان ایمیل و رمز وارد شوی.
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/35">
                <Link href="/" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[#d5b466]/35 hover:text-[#d5b466]">
                  بازگشت به سایت
                </Link>
                <span>YAZD AFSHIN ADMIN</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
