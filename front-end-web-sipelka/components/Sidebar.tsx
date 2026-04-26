"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  {
    icon: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: "account_balance_wallet",
    label: "Grant Programs",
    href: "/dashboard/grant",
  },
  {
    icon: "database",
    label: "Researcher Data",
    href: "/dashboard/researcher-data",
  },
  {
    icon: "payments",
    label: "Disbursement Status",
    href: "/dashboard/disbursement-status",
  },
  {
    icon: "fact_check",
    label: "Eligibility Evaluation",
    href: "/dashboard/eligibility-evaluation",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = "sipelka_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // Redirect to login
    router.push("/login");
    // Force a refresh to clear any cached states
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-on-primary text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance
          </span>
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-primary font-headline">
            SIPELKA
          </h1>
          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-label">
            Institutional Portal
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-label text-sm font-semibold ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto space-y-0.5">
        <button className="w-full mb-4 gradient-primary text-on-primary py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-label text-sm font-semibold cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Analysis</span>
        </button>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-label text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span>Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-label text-sm font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
