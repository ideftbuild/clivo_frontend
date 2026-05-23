const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full px-6 h-16 flex items-center justify-between border-b border-(--clivo-border) bg-(--clivo-bg) backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        {/* SVG Logo Mark */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Clivo logo"
        >
          {/* Outer rounded square */}
          <rect
            width="32"
            height="32"
            rx="9"
            fill="var(--clivo-text-primary)"
          />

          {/* Film/clip icon */}
          <path
            d="M10 10 L16 16 L10 22"
            stroke="var(--clivo-bg)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 10 L23 16 L17 22"
            stroke="var(--clivo-bg)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
          />
        </svg>

        <span className="font-semibold text-[18px] tracking-[-0.03em] text-(--clivo-text-primary) leading-none">
          clivo
        </span>
      </div>

      {/* Right badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.25 rounded-full border border-(--clivo-border) bg-(--clivo-muted)">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
        <span className="text-[12px] font-medium text-(--clivo-text-secondary) tracking-[0.01em]">
          Free to use
        </span>
      </div>
    </header>
  );
};

export default Header;
