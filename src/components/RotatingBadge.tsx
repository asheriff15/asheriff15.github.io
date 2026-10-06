import Link from "next/link";
import { ArrowDown } from "lucide-react";

// Circular "view my work" badge, after the one on kylesonzy.com.
export default function RotatingBadge() {
  return (
    <Link
      href="/#projects"
      aria-label="View my work"
      className="group relative inline-flex w-[148px] h-[148px] items-center justify-center rounded-full"
    >
      <svg viewBox="0 0 148 148" className="absolute inset-0 animate-spin-slow" aria-hidden>
        <defs>
          <path id="badge-circle" d="M74,74 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
        </defs>
        <text fill="#b0b0b2" fontSize="14.5" letterSpacing="3.2" fontFamily="var(--font-sans)" fontWeight="700">
          <textPath href="#badge-circle">VIEW MY WORK • VIEW MY WORK • </textPath>
        </text>
      </svg>
      <span className="flex w-14 h-14 items-center justify-center rounded-full bg-signal text-paper transition-transform group-hover:translate-y-1">
        <ArrowDown size={24} strokeWidth={2} />
      </span>
    </Link>
  );
}
