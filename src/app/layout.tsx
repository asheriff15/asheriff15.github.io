import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { default: `${site.name} · Cloud & Security`, template: `%s · ${site.name}` },
  description: site.intro,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-20 xl:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
