import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Frosted-glass sticky nav */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tight text-primary font-headline">
            SIPELKA
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body"
              href="#platforms"
            >
              Platforms
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body"
              href="#target-users"
            >
              Target Users
            </a>
          </div>
          <Link href="/login">
            <button className="gradient-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 hover:scale-95 duration-200 ease-in-out font-label cursor-pointer transition-all">
              Login
            </button>
          </Link>
        </div>
      </nav>

      <main className="connectivity-grid pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <span className="text-surface-tint font-label font-bold tracking-widest uppercase text-xs mb-4 block">
              Digital Research Management
            </span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight mb-6">
              The Digital <br />
              <span className="text-secondary">Vanguard</span> of
              <br />
              Institutional Research
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-body">
              An integrated platform bridging researchers with DPPM.
              Streamlining grant programs, proposal reviews, and research
              outcomes across Web and Mobile.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <button className="gradient-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:opacity-90 hover:scale-95 transition-all duration-200 font-label cursor-pointer">
                  Institutional Login
                </button>
              </Link>
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface-container transition-colors font-label cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
            <img
              alt="SIPELKA Ecosystem"
              className="w-full h-auto rounded-2xl ambient-shadow object-cover aspect-[4/3]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVpoG3u6zTVjheUYZyvq-ZNUAYQd0cNIMnvdh6Wedzqp0G5C6HeeKWCbNeJuWHbwi-l4qtRuP79ztd4x0ICsjC95XHpPGgr_JAUbOmh0wc0AfnwR78RdC1VHZfKQz6C-wR9EKwxcConh8Njc28YG92zqjzxlSbcJ3Cfd1nLYzcY-y0-n0ZF-s1J_goBSLnhz6vHB3_CaGoFRrt4fcmJK65DIVEQB3UI_93ME5JdR6IWJ2eXp1U3L94cbl_FH5zCmbRGInajoJwT8M"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-container-low py-24" id="features">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16 text-center">
              <span className="text-surface-tint font-label font-bold tracking-widest uppercase text-xs mb-3 block">
                Capabilities
              </span>
              <h2 className="font-headline text-4xl font-bold text-primary mb-4">
                The Curator&apos;s Edge
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto font-body">
                Advanced tools designed for high-impact research management and
                institutional integrity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "digital_out_of_home",
                  title: "End-to-End Digitalization",
                  desc: "From proposal submission to real-time outcome monitoring, manage every lifecycle phase within a unified digital environment.",
                },
                {
                  icon: "fact_check",
                  title: "Rule-Based Eligibility",
                  desc: "Automated screening for compliance, budget limits, and document completeness ensures high standards before review begins.",
                },
                {
                  icon: "devices",
                  title: "Multi-Platform Accessibility",
                  desc: "Dedicated Web Portal for Admins/Reviewers and a streamlined Mobile App for Researchers to track progress on the go.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-surface-container-lowest p-10 rounded-xl ambient-shadow hover:translate-y-[-4px] transition-transform duration-300 group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200">
                    <span className="material-symbols-outlined text-[28px]">
                      {card.icon}
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-4 text-primary">
                    {card.title}
                  </h3>
                  <p className="text-on-surface-variant font-body leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section id="platforms" className="bg-[#8B0000] text-white py-24">
          <div className="max-w-5xl mx-auto px-8 text-center">
            {/* TITLE */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bridging the Gap: Researchers & DPPM
            </h2>

            {/* DESCRIPTION */}
            <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Transparency and accountability in grant management. SIPELKA
              creates a seamless flow of data between the academic community and
              the Directorate of Research and Community Service (DPPM).
            </p>
          </div>

          {/* STATS */}
          <div className="max-w-6xl mx-auto px-8 mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "100%", subtitle: "DIGITAL SUBMISSION" },
              { title: "Real-time", subtitle: "OUTCOME MONITORING" },
              { title: "Secure", subtitle: "DOCUMENT INTEGRITY" },
              { title: "Accountable", subtitle: "BUDGET OVERSIGHT" },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-white/20 rounded-xl py-6 px-4 text-center hover:bg-white/5 transition"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] tracking-widest text-white/60 uppercase">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Users Section */}
        <section className="py-24" id="target-users">
          <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <img
                alt="Collaboration"
                className="rounded-2xl ambient-shadow aspect-square object-cover w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsvKZCGRqwd9vBkSkfquGMvR3h4mXC4gZglf5vdKt1Hl6m5X27C95C0ENOGnI5Ek7ZXPpJJOTluRLhp4tn3LrpIMb-qBjlaezGXJ3Au8iJhcA_YsxqCqET79Ty7tTCd9MsFbaQgxEcW87r86Hix-CMdQc2GR9s028Tces6CGXaSj9-dyU6JDzDL37nTDVQLKQqPoqoeqiJHXMLgx0TsTWXBrFRTH_89Wl3xdPTUT0VtqKS0fL_8mpjSbATyoWUs5WO4xCEMLAecaU"
              />
            </div>
            <div className="lg:w-1/2">
              <span className="text-surface-tint font-label font-bold tracking-widest uppercase text-xs mb-4 block">
                Stakeholders
              </span>
              <h2 className="font-headline text-4xl font-bold text-primary mb-8">
                Architected for Every Role
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: "shield_person",
                    title: "Admins (Management)",
                    desc: "Oversee the entire research ecosystem, manage grants, and configure institutional parameters.",
                  },
                  {
                    icon: "rate_review",
                    title: "Reviewers (Evaluation)",
                    desc: "Efficiently evaluate proposals with integrated tools for scoring, feedback, and decision tracking.",
                  },
                  {
                    icon: "school",
                    title: "Researchers (Dosen & Mahasiswa)",
                    desc: "Submit proposals, monitor funding status, and upload outcomes via mobile or web interfaces.",
                  },
                ].map((role) => (
                  <div key={role.title} className="flex items-start gap-4">
                    <span className="gradient-primary text-on-primary p-2.5 rounded-xl material-symbols-outlined text-[22px] shrink-0">
                      {role.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-primary font-headline">
                        {role.title}
                      </h4>
                      <p className="text-on-surface-variant font-body">
                        {role.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-low w-full py-12 border-t border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-black text-primary font-headline mb-4">
              SIPELKA
            </div>
            <p className="text-on-surface-variant text-sm font-body">
              © 2026 SIPELKA Institutional Research Systems. All rights
              reserved.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4 font-label text-sm uppercase tracking-wide">
              Institutional Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                  href="#"
                >
                  DPPM Home
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                  href="#"
                >
                  Research Guidelines
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4 font-label text-sm uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                  href="#"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                  href="#"
                >
                  System Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4 font-label text-sm uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
