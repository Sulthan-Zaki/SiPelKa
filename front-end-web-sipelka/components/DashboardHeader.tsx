"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authGuard";
import { userApi } from "@/lib/userApi";
import type { UserResponse } from "@/types/user";

export default function DashboardHeader() {
  const { user } = useAuth();
  const [freshUser, setFreshUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (user?.id) {
      userApi.getUserById(user.id)
        .then((fresh) => {
          setFreshUser(fresh);
          localStorage.setItem("sipelka_user", JSON.stringify(fresh));
        })
        .catch((err) => console.error("Failed to fetch fresh user in header:", err));
    }
  }, [user?.id]);

  const activeUser = freshUser || user;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${baseUrl}${photoUrl}`;
  };

  const avatarUrl = getAvatarUrl(activeUser?.profilePhotoUrl);

  return (
    <header className="w-full h-16 sticky top-0 z-40 glass-effect border-b border-outline-variant/20 flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-primary text-sm font-label">
            {activeUser?.name || "User"}
          </p>
          <p className="text-[10px] text-on-surface-variant font-label">
            {activeUser?.role || "Unknown"}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold font-label ring-2 ring-primary/10 shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={activeUser?.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : activeUser?.name ? (
            getInitials(activeUser.name)
          ) : (
            "U"
          )}
        </div>
      </div>
    </header>
  );
}
