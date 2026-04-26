"use client";

export default function DashboardHeader() {
  return (
    <header className="w-full h-16 sticky top-0 z-40 glass-effect border-b border-outline-variant/20 flex items-center justify-between px-8">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-on-surface-variant text-sm outline-none focus:ring-1 focus:ring-primary/20 font-body"
            placeholder="Search proposals, researchers, or grant identifiers..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-5 ml-8">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <button className="relative hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[22px]">
              help
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3 border-l pl-5 border-outline-variant/30">
          <div className="text-right">
            <p className="font-semibold text-primary text-sm font-label">
              Dr. Sarah Wijaya
            </p>
            <p className="text-[10px] text-on-surface-variant font-label">
              Head Administrator
            </p>
          </div>
          <img
            alt="User profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5jmEX6YDyEn5PLA8VWPK6sjdL0u0oDRiAPBw52Tg82oji3_6_8SWpH8A5g50bgK04nFmaVaU99dHgz1JEll4n-D-Ax58Rp3cUQNM3eiJDz3Xm3q2dKx-zRnZV1MzuuAPGjCKwfQOvsNx95UQfeABx9XBWZa6jXQ9XbeZYNShfjRs_RF7fs-rL5aIApHx7n_NcwKGI6pvtKQx9__XVa1SrtDgi7swFjKzTt6arTG85J4vQT42KCXLuOX217fynr6PMtEVStmiFQ44"
          />
        </div>
      </div>
    </header>
  );
}
