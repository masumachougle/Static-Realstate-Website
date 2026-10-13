type LogoProps = {
  tone?: "light" | "brand";
  showWordmark?: boolean;
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 30.5 36 6l28 24.5h-8.2L36 14.2 16.2 30.5H8z" />
      <path d="M22 33h8.5v31H22z" />
      <path
        fillRule="evenodd"
        d="M30.5 33H43c8.4 0 14 5.1 14 12.8S51.4 58.6 43 58.6H30.5V33zm8.2 6.6v12.2h3.2c3.7 0 6-2.2 6-6.1s-2.3-6.1-6-6.1h-3.2z"
      />
      <path d="M41 54.2 58.5 68h-9.2L34 56.4v-2.2H41z" />
    </svg>
  );
}

export default function Logo({
  tone = "brand",
  showWordmark = true,
  className = "",
}: LogoProps) {
  const isLight = tone === "light";

  return (
    <div
      className={`flex items-center gap-2.5 sm:gap-3 ${
        isLight ? "text-white drop-shadow-lg" : "text-primary"
      } ${className}`}
    >
      <LogoMark
        className={
          showWordmark
            ? "h-9 w-9 sm:h-11 sm:w-11 shrink-0"
            : "h-full w-full"
        }
      />
      {showWordmark && (
        <div className="leading-none text-left">
          <div className="font-heading font-semibold tracking-wide text-lg sm:text-xl lg:text-[1.65rem]">
            RealState
          </div>
          <div
            className={`mt-1 text-[9px] sm:text-[10px] font-medium tracking-[0.28em] uppercase ${
              isLight ? "text-white/80" : "text-muted-foreground"
            }`}
          >
            Properties
          </div>
        </div>
      )}
    </div>
  );
}
