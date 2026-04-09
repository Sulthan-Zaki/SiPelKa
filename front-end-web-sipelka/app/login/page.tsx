import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col editorial-gradient relative overflow-hidden">
      {/* Decorative background element */}
      <div
        className="absolute top-0 right-0 z-0 w-1/3 h-full opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGg-kQYSPwSaRJaxHUa4UrCXKOjjsnEwqFD2LUTndB7bb5EkSQ0YejUir-WjFwHIW6Ed-K9P-u7W2kPV8xw3kD9fcDuYicdtgndLYaiFNlDrRqmcNPFK957of_Lz9bMhQwZUcxs_Eskwu9gpzGGVKeQiyBa4RiKqlrV7qjdmPCewMsTILuMnVZMLI_tqrne6b66ZPk72FolSo1UiUNFYTj2oPKpRIW7COUW-GCy40ErblThs9ZYqi1jQmQXr2is-Is7yPnND6pdsc')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content Canvas */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl ambient-shadow">
          {/* Left Side: Institutional Branding */}
          <div className="hidden md:flex md:w-5/12 bg-surface-container-low p-12 flex-col justify-between">
            <div>
              <div className="mb-12">
                <h1 className="text-3xl font-black tracking-tighter text-primary font-headline">
                  SIPELKA
                </h1>
                <p className="text-xs font-bold tracking-widest text-on-surface-variant/60 uppercase mt-1 font-label">
                  Institutional Research Platform
                </p>
              </div>
              <div className="space-y-8">
                <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-on-surface font-headline">
                  Secure Portal for Institutional Research{" "}
                  <span className="text-secondary">Excellence</span>.
                </h2>
                <p className="text-on-surface-variant leading-relaxed max-w-sm font-body text-sm">
                  Access the centralized intelligence hub for grant programs,
                  researcher metrics, and eligibility evaluation frameworks.
                </p>
                {/* Features mini list */}
                <div className="space-y-3 pt-4">
                  {[
                    { icon: "verified_user", label: "Secure Institutional Access" },
                    { icon: "analytics", label: "Real-time Research Analytics" },
                    { icon: "fact_check", label: "Eligibility Automation Engine" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[18px]">{f.icon}</span>
                      <span className="text-xs font-label text-on-surface-variant font-semibold">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-3 text-[10px] font-semibold tracking-widest text-on-surface-variant/40 font-label">
                <span>RELIABILITY</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span>TRANSPARENCY</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span>AUTHORITY</span>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex-grow md:w-7/12 bg-surface-container-lowest p-8 md:p-14 lg:p-20">
            {/* Mobile Logo */}
            <div className="md:hidden mb-8">
              <h1 className="text-2xl font-black tracking-tighter text-primary font-headline">
                SIPELKA
              </h1>
            </div>

            <div className="max-w-md mx-auto md:mx-0">
              <header className="mb-10">
                <h3 className="text-2xl font-bold tracking-tight text-on-surface font-headline mb-2">
                  Institutional Login
                </h3>
                <p className="text-on-surface-variant text-sm font-body">
                  Please enter your authorized credentials to proceed.
                </p>
              </header>

              <form className="space-y-6">
                {/* Institutional ID */}
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label"
                    htmlFor="institutional-id"
                  >
                    Institutional ID
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]">
                      badge
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low rounded-xl text-on-surface outline-none placeholder:text-on-surface-variant/40 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                      id="institutional-id"
                      name="id"
                      placeholder="EX: ADM-9928-SK"
                      type="text"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label
                      className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a
                      className="text-xs font-bold text-secondary hover:underline underline-offset-4 font-body"
                      href="#"
                    >
                      Forgot Access?
                    </a>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low rounded-xl text-on-surface outline-none placeholder:text-on-surface-variant/40 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                      id="password"
                      name="password"
                      placeholder="••••••••••••"
                      type="password"
                    />
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-3 py-2">
                  <input
                    className="w-5 h-5 rounded border-outline-variant accent-primary cursor-pointer"
                    id="remember"
                    type="checkbox"
                  />
                  <label
                    className="text-sm font-medium text-on-surface-variant select-none cursor-pointer font-body"
                    htmlFor="remember"
                  >
                    Maintain session on this workstation
                  </label>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link href="/dashboard" className="block w-full">
                    <button
                      className="w-full gradient-primary text-on-primary font-bold py-5 px-8 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 ambient-shadow cursor-pointer font-label"
                      type="button"
                    >
                      Sign In
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_forward
                      </span>
                    </button>
                  </Link>
                </div>
              </form>

              <div className="mt-10 pt-8 border-t border-outline-variant/20 text-center md:text-left">
                <p className="text-sm text-on-surface-variant font-body">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="text-primary font-bold hover:underline underline-offset-4 transition-colors"
                    href="/register"
                  >
                    Request Access / Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-8 glass-effect relative z-10 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[14px]">
                verified_user
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 font-label">
              SIPELKA Institutional Security Protocol v4.2.1
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["PRIVACY POLICY", "SECURITY AUDIT", "SYSTEM STATUS", "ADMIN SUPPORT"].map((link) => (
              <a
                key={link}
                className="text-[10px] font-bold text-on-surface-variant/60 hover:text-primary transition-colors font-label"
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="text-[10px] text-on-surface-variant/40 font-medium font-body">
            © 2026 SIPELKA Institutional.
          </div>
        </div>
      </footer>
    </main>
  );
}
