import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    items: [
      { label: "Workflow Studio", href: "#get-started" },
      { label: "Integrations", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Docs", href: "https://docs.chainflow.app" },
      { label: "Status", href: "https://status.chainflow.app" },
      { label: "Support", href: "mailto:support@chainflow.app" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "mailto:hello@chainflow.app" },
    ],
  },
];

export const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/40">
              ⛓️
            </span>
            ChainFlow
          </div>
          <p className="text-sm text-slate-400">
            Build resilient automations that respond to every on-chain event with actionable workflows.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 text-sm text-slate-300 sm:grid-cols-3">
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ChainFlow. All rights reserved.
      </div>
    </footer>
  );
};
