const FOOTER_LINKS = {
  Product: [
    { label: "API Docs", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  Social: [
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1a1c1c] w-full pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8 mb-16 h-px bg-gradient-to-r from-transparent via-[#FFB95F]/20 to-transparent" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
        <div className="col-span-2 md:col-span-1">
          <span className="font-headline italic text-2xl text-amber-200">Snip</span>
          <p className="mt-6 text-emerald-50/50 font-mono text-xs uppercase tracking-widest leading-relaxed">
            © 2024 Snip.<br />Built for the digital curator.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section} className="flex flex-col gap-4">
            <h6 className="text-emerald-50 font-bold font-mono text-[10px] uppercase tracking-widest mb-2">
              {section}
            </h6>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-emerald-50/50 font-mono text-xs uppercase tracking-widest hover:text-amber-200 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-24 pt-8 border-t border-white/5 text-center">
        <span className="text-emerald-50/20 font-mono text-[10px] uppercase tracking-[0.4em]">
          Curated Connections — Made Precise
        </span>
      </div>
    </footer>
  );
}

export default Footer;
