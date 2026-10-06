import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Markdown files in /content/projects and /content/posts become pages.
// Add a new .md file with the same frontmatter fields to add a project or post.

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  repo?: string;
  highlight?: string;
  order: number;
  html: string;
};

export type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  html: string;
};

const root = path.join(process.cwd(), "content");

function read(dir: string) {
  const full = path.join(root, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      return { slug: f.replace(/\.md$/, ""), data, html: marked.parse(content, { async: false }) as string };
    });
}

export function getProjects(): Project[] {
  return read("projects")
    .map(({ slug, data, html }) => ({
      slug,
      title: data.title,
      summary: data.summary,
      stack: data.stack ?? [],
      repo: data.repo,
      highlight: data.highlight,
      order: data.order ?? 99,
      html,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getPosts(): Post[] {
  return read("posts")
    .map(({ slug, data, html }) => ({
      slug,
      title: data.title,
      summary: data.summary,
      date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
      html,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
