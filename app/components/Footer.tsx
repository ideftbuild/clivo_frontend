import { Clock, Download, Shield } from "lucide-react";

const features = [
  {
    Icon: Clock,
    label: "Fast",
    desc: "Lightning-fast processing",
  },
  {
    Icon: Shield,
    label: "Private",
    desc: "Your videos stay yours",
  },
  {
    Icon: Download,
    label: "Easy export",
    desc: "Download clips individually or all at once",
  },
];

const Footer = () => {
  return (
    <footer className="w-full pb-10">
      {/* Feature strip */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 mb-10">
        {features.map(({ Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-[14px] p-[18px_20px] rounded-[var(--clivo-radius-md)] border border-[var(--clivo-border)] bg-[var(--clivo-surface)] transition-colors duration-200 hover:border-[var(--clivo-border-hover)]"
          >
            {/* Icon box */}
            <div className="w-9 h-9 rounded-[var(--clivo-radius-sm)] bg-[var(--clivo-muted)] flex items-center justify-center flex-shrink-0">
              <Icon
                size={16}
                className="text-[var(--clivo-text-primary)]"
                style={{ strokeWidth: 1.8 }}
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-[13px] font-semibold text-[var(--clivo-text-primary)] mb-[2px] tracking-[-0.01em]">
                {label}
              </p>
              <p className="text-[12px] text-[var(--clivo-text-tertiary)] leading-snug">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-[6px]">
        <span className="text-[12px] text-[var(--clivo-text-tertiary)]">
          © {new Date().getFullYear()} Clivo — Split smarter.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
