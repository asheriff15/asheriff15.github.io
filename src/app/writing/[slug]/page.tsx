import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleShell from "@/components/ArticleShell";
import { getPosts, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPosts().find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPosts().find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <ArticleShell
      back={{ href: "/#writing", label: "All writing" }}
      meta={<time dateTime={p.date}>{formatDate(p.date)}</time>}
      title={p.title}
      summary={p.summary}
      html={p.html}
    />
  );
}
