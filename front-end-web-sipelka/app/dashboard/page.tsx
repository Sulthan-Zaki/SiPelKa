export default function DashboardPage() {
  return (
    <>
      {/* Page title */}
      <div className="flex flex-col gap-1">
        <h2 className="font-headline text-3xl font-bold text-primary">
          Institutional Overview
        </h2>
        <p className="text-on-surface-variant font-body text-sm">
          Welcome back, Dr. Wijaya. Here is the latest research activity
          update.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "description",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            badge: "+12% vs last month",
            badgeColor: "text-emerald-700 bg-emerald-50",
            label: "Active Proposals",
            value: "142",
          },
          {
            icon: "payments",
            iconBg: "bg-secondary/10",
            iconColor: "text-secondary",
            badge: "Budget Pacing",
            badgeColor: "text-primary bg-primary-fixed",
            label: "Total Budget Allocated",
            value: "Rp 4.2B",
            sub: "/ 6.0B",
            progress: 70,
          },
          {
            icon: "pending_actions",
            iconBg: "bg-tertiary/10",
            iconColor: "text-tertiary",
            badge: "Requires Attention",
            badgeColor: "text-amber-700 bg-amber-50",
            label: "Pending Reviews",
            value: "28",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}
              >
                <span
                  className={`material-symbols-outlined ${card.iconColor} text-[22px]`}
                >
                  {card.icon}
                </span>
              </div>
              <span
                className={`text-xs font-label font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>
            <div>
              <p className="text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
                {card.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-headline font-extrabold text-primary">
                  {card.value}
                </h3>
                {card.sub && (
                  <span className="text-sm text-on-surface-variant font-body">
                    {card.sub}
                  </span>
                )}
              </div>
              {card.progress && (
                <div className="mt-3 w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full"
                    style={{ width: `${card.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl ambient-shadow border border-outline-variant/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-headline text-xl font-bold text-primary">
                Monthly Research Trends
              </h4>
              <p className="text-xs text-on-surface-variant font-body">
                Proposal volume by category over the last 6 months
              </p>
            </div>
            <select className="text-xs font-label border border-outline-variant/30 bg-surface-container-low rounded-lg focus:ring-0 cursor-pointer outline-none p-2 text-on-surface-variant">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex flex-col justify-between">
            <div className="flex items-end justify-between h-48 gap-3 px-2">
              {[40, 55, 75, 65, 85, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-surface-container-low rounded-t relative group"
                >
                  <div
                    className="absolute bottom-0 w-full gradient-primary rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${h}%` }}
                  ></div>
                  <div
                    className="absolute bottom-0 w-full bg-primary/10 rounded-t-lg"
                    style={{ height: `${h * 0.45}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-label px-2 pt-4 border-t border-outline-variant/10">
              {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Doughnut chart */}
        <div className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow border border-outline-variant/15 flex flex-col">
          <h4 className="font-headline text-xl font-bold text-primary mb-1">
            Budget Utilization
          </h4>
          <p className="text-xs text-on-surface-variant mb-8 font-body">
            Allocation by Department
          </p>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="relative w-40 h-40">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#eeeef0"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#6e0000"
                  strokeDasharray="125.6"
                  strokeDashoffset="30"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#fe8a79"
                  strokeDasharray="125.6"
                  strokeDashoffset="112"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-headline font-bold text-primary">
                  70%
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase font-label">
                  Utilized
                </span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {[
                { color: "bg-primary", label: "Life Sciences", pct: "45%" },
                {
                  color: "bg-secondary-container",
                  label: "Engineering",
                  pct: "25%",
                },
                {
                  color: "bg-surface-container",
                  label: "Others",
                  pct: "30%",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs font-label"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                    ></span>
                    <span className="text-on-surface font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-bold text-on-surface">
                    {item.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
        <div className="p-8 border-b border-surface-container-low flex items-center justify-between">
          <div>
            <h4 className="font-headline text-xl font-bold text-primary">
              Recent Submissions
            </h4>
            <p className="text-xs text-on-surface-variant font-body">
              Detailed view of latest research grant applications
            </p>
          </div>
          <button className="text-primary font-semibold text-sm hover:underline font-label cursor-pointer">
            View All Submissions
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label">
                <th className="px-8 py-4">Investigator</th>
                <th className="px-8 py-4">Research Title</th>
                <th className="px-8 py-4 text-center">Submission Date</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {[
                {
                  initials: "AP",
                  name: "Dr. Agus Pratama",
                  dept: "Bio-Molecular Lab",
                  title:
                    "AI-Driven Genomics for Tropical Disease Resistance",
                  program: "International Research Grant 2024",
                  date: "Oct 24, 2023",
                  status: "Review",
                  statusColor:
                    "bg-secondary-container text-on-secondary-container",
                  avatarColor: "bg-secondary/20 text-secondary",
                },
                {
                  initials: "LS",
                  name: "Linda Setiawan, Ph.D.",
                  dept: "Civil Engineering Dept.",
                  title: "Sustainable Concrete from Agricultural Waste",
                  program: "Infrastructure Innovation Fund",
                  date: "Oct 22, 2023",
                  status: "Pending",
                  statusColor:
                    "bg-surface-container text-on-surface-variant",
                  avatarColor: "bg-tertiary/10 text-tertiary",
                },
                {
                  initials: "BK",
                  name: "Budi Kusuma",
                  dept: "Social Sciences",
                  title: "Urban Migration Dynamics in Southeast Asia",
                  program: "Strategic Humanities Fund",
                  date: "Oct 21, 2023",
                  status: "Review",
                  statusColor:
                    "bg-secondary-container text-on-secondary-container",
                  avatarColor: "bg-primary/10 text-primary",
                },
              ].map((row) => (
                <tr
                  key={row.name}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${row.avatarColor} flex items-center justify-center text-[11px] font-bold font-label shrink-0`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-primary font-headline">
                          {row.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-body">
                          {row.dept}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-on-surface line-clamp-1 font-body">
                      {row.title}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-body">
                      Program: {row.program}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-center text-xs text-on-surface-variant font-label">
                    {row.date}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.statusColor} font-label`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

