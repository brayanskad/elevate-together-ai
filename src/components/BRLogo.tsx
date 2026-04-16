interface BRLogoProps {
  size?: number;
  showWordmark?: boolean;
  variant?: "light" | "dark";
}

/**
 * Logo BR Petrobras (recriação visual para fins de protótipo).
 * Quadrado verde escuro com "BR" amarelo + wordmark "PETROBRAS".
 */
export const BRLogo = ({ size = 32, showWordmark = true, variant = "light" }: BRLogoProps) => {
  const wordmarkColor = variant === "light" ? "text-white" : "text-primary";
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="shrink-0 rounded-md"
        aria-label="Logo BR"
      >
        <rect width="64" height="64" rx="6" fill="hsl(158 60% 22%)" />
        <path d="M0 14 L64 14 L64 22 L0 22 Z" fill="hsl(48 96% 53%)" />
        <path d="M0 42 L64 42 L64 50 L0 50 Z" fill="hsl(48 96% 53%)" />
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="hsl(48 96% 53%)"
          fontFamily="Arial, sans-serif"
          letterSpacing="-0.5"
        >
          BR
        </text>
      </svg>
      {showWordmark && (
        <span className={`font-black tracking-tight text-[15px] ${wordmarkColor}`}>
          PETROBRAS
        </span>
      )}
    </div>
  );
};
