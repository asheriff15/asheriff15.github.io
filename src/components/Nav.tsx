"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House, User, FolderKanban, PenLine, Mail } from "lucide-react";

const items = [
  { id: "home", label: "Home", href: "/#home", icon: House },
  { id: "about", label: "About", href: "/#about", icon: User },
  { id: "projects", label: "Projects", href: "/#projects", icon: FolderKanban },
  { id: "writing", label: "Writing", href: "/#writing", icon: PenLine },
  { id: "contact", label: "Contact", href: "/#contact", icon: Mail },
];

export default function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState("home");

  // On the homepage, highlight whichever section is on screen.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname.startsWith("/projects") ? "projects" : pathname.startsWith("/writing") ? "writing" : "");
      return;
    }
    const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav
      aria-label="Main"
      className="fixed z-50 bottom-0 inset-x-0 xl:inset-x-auto xl:bottom-auto xl:right-6 xl:top-1/2 xl:-translate-y-1/2"
    >
      <ul className="flex xl:flex-col items-center justify-around xl:justify-center gap-1 xl:gap-3 px-4 py-3 xl:px-3 xl:py-5 bg-panel/85 backdrop-blur-md border-t xl:border border-panel-2 xl:rounded-full">
        {items.map(({ id, label, href, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="relative group">
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
                  isActive ? "text-signal-hi bg-alarm" : "text-muted hover:text-paper hover:bg-panel-2"
                }`}
              >
                <Icon size={21} strokeWidth={1.75} />
              </Link>
              <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden xl:group-hover:block xl:group-focus-within:block whitespace-nowrap rounded bg-paper px-2 py-1 text-sm font-bold text-ink">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
