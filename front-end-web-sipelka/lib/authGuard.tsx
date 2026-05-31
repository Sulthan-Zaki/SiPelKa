"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { UserResponse } from "@/types/user";

const PUBLIC_PATHS = ["/login", "/register", "/"];

export function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("sipelka_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  return { user, loading, isAuthenticated };
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sipelka_token");
      const storedUser = localStorage.getItem("sipelka_user");

      if (!token || !storedUser) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

export function getCurrentUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("sipelka_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
}

export function isReviewer(): boolean {
  const user = getCurrentUser();
  return user?.role === "REVIEWER";
}