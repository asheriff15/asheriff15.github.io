import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Stripes from "@/components/Stripes";
import type { ReactNode } from "react";

export default function ArticleShell({
  back,
  meta,
  title,
  summary,
  aside,
  html,
}: {
  back: { href: string; label: string };
  meta?: ReactNode;
  title: string;
  summary: string;
  aside?: ReactNode;
  html: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <Stripes />
      <Header />
      <article className="relative z-10 mx-auto max-w-3xl px-6 pb-28 pt-10 sm:px-10">
        <Link href={back.href} className="inline-flex items-center gap-2 text-muted hover:text-paper transition-colors">
          <ArrowLeft size={18} /> {back.label}
        </Link>
        {meta && <div className="mt-8 text-[15px] font-bold text-signal-hi">{meta}</div>}
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-[1.1]">{title}</h1>
        <p className="mt-5 text-xl text-muted">{summary}</p>
        {aside && <div className="mt-8">{aside}</div>}
        <div className="prose-site mt-6 [&_img]:my-6 [&_img]:w-full [&_img]:rounded-md [&_img]:border [&_img]:border-panel-2" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
