"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AdminLogoutButtonProps = {
  className?: string;
};

export default function AdminLogoutButton({ className = "" }: AdminLogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.replace("/admin");
    router.refresh();
    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "در حال خروج..." : "خروج از حساب"}
    </button>
  );
}
