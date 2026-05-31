"use client";

import { useAuth } from "@/lib/authGuard";

export default function DashboardHeader() {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="w-full h-16 sticky top-0 z-40 glass-effect border-b border-outline-variant/20 flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-primary text-sm font-label">
            {user?.name || "User"}
          </p>
          <p className="text-[10px] text-on-surface-variant font-label">
            {user?.role || "Unknown"}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold font-label ring-2 ring-primary/10 shrink-0">
          {user?.name ? getInitials(user.name) : "U"}
        </div>
      </div>
    </header>
  );
}
