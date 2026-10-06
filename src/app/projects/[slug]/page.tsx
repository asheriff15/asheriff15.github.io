import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleShell from "@/components/ArticleShell";
import { getProjects } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjects().find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProjects().find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <ArticleShell
      back={{ href: "/#projects", label: "All projects" }}
      meta={p.highlight}
      title={p.title}
      summary={p.summary}
      html={p.html}
      aside={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-panel-2 py-4">
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="rounded-md border border-panel-2 bg-panel px-3 py-1 text-[15px]">
                {s}
              </li>
            ))}
          </ul>
          {p.repo && (
            <a href={p.repo} className="ml-auto font-bold underline decoration-signal underline-offset-4 hover:text-signal-hi">
              View the code on GitHub
            </a>
          )}
        </div>
      }
    />
  );
}
