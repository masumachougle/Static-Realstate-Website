import { Link } from "wouter";
import DubaiLocationIcon from "@/components/DubaiLocationIcon";

interface MapsNavButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function MapsNavButton({ onClick, className = "" }: MapsNavButtonProps) {
  return (
    <Link href="/map" onClick={onClick}>
      <button
        type="button"
        className={`inline-flex items-center justify-center px-4 xl:px-6 py-1.5 rounded-full shadow-lg bg-white text-primary font-semibold transition-transform hover:scale-105 active:scale-95 ${className}`}
        data-testid="button-maps"
        aria-label="Open property map"
      >
        <span className="text-xs xl:text-sm tracking-wide">MAPS</span>
        <DubaiLocationIcon size={22} className="text-foreground ml-1.5" />
      </button>
    </Link>
  );
}
