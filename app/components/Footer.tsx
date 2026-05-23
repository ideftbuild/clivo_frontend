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
            className="flex items-start gap-3.5 p-[18px_20px] rounded-(--clivo-radius-md) border border-(--clivo-border) bg-(--clivo-surface) transition-colors duration-200 hover:border-(--clivo-border-hover)"
          >
            {/* Icon box */}
            <div className="w-9 h-9 rounded-(--clivo-radius-sm) bg-(--clivo-muted) flex items-center justify-center shrink-0">
              <Icon
                size={16}
                className="text-(--clivo-text-primary)"
                style={{ strokeWidth: 1.8 }}
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-[13px] font-semibold text-(--clivo-text-primary) mb-0.5 tracking-[-0.01em]">
                {label}
              </p>
              <p className="text-[12px] text-(--clivo-text-tertiary) leading-snug">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-[12px] text-(--clivo-text-tertiary)">
          © {new Date().getFullYear()} Clivo — Split smarter.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
