import Link from "next/link";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import Header from "@/components/Header";
import Stripes from "@/components/Stripes";
import Particles from "@/components/Particles";
import TypedName from "@/components/TypedName";
import RotatingBadge from "@/components/RotatingBadge";
import NetworkDiagram from "@/components/NetworkDiagram";
import Reveal from "@/components/Reveal";
import { site } from "@/content/site";
import { getPosts, getProjects, formatDate } from "@/lib/content";

function SectionHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 id={`${id}-title`} className="font-display text-4xl sm:text-5xl font-bold leading-tight">
        {title}
      </h2>
      {lead && <p className="mt-3 text-lg text-muted">{lead}</p>}
    </div>
  );
}

export default function Home() {
  const projects = getProjects();
  const posts = getPosts();

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section id="home" aria-label="Introduction" className="relative min-h-[100svh] overflow-hidden">
        <Particles />
        <Stripes />
        <Header />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] xl:pr-28 xl:pt-16">
          <div>
            <h1 className="font-display font-bold leading-[1.05] text-[44px] sm:text-[64px] xl:text-[76px]">
              Hello,
              <br />
              I&apos;m <TypedName text={site.name} />
            </h1>
            <p className="mt-6 text-xl sm:text-2xl font-bold">{site.tagline}</p>
            <p className="mt-4 max-w-[34rem] text-lg text-muted">{site.intro}</p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  className="inline-flex items-center gap-2 rounded-md border border-paper px-6 py-3 font-bold transition-colors hover:bg-paper hover:text-ink"
                >
                  <Download size={18} /> View my resume
                </a>
              )}
              <RotatingBadge />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <NetworkDiagram />
          </div>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" aria-labelledby="about-title" className="border-t border-panel-2 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 xl:pr-28">
          <Reveal>
            <SectionHeading id="about" title="About me" />
          </Reveal>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              {site.about.map((p) => (
                <p key={p} className="mb-5 max-w-[38rem] text-lg leading-relaxed text-[#e4e4e6]">
                  {p}
                </p>
              ))}
              <h3 className="mt-10 mb-4 text-lg font-bold text-muted">Skills</h3>
              <ul className="flex flex-wrap gap-2">
                {site.skills.map((s) => (
                  <li key={s} className="rounded-md border border-panel-2 bg-panel px-3 py-1.5 text-[15px]">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <ol className="relative border-l border-line pl-7">
                {site.timeline.map((t) => (
                  <li key={t.what} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-[35px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-signal bg-ink" />
                    <p className="text-sm font-bold text-signal-hi">{t.when}</p>
                    <p className="mt-0.5 text-lg font-bold">{t.what}</p>
                    <p className="text-muted">{t.where}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section id="projects" aria-labelledby="projects-title" className="border-t border-panel-2 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 xl:pr-28">
          <Reveal>
            <SectionHeading
              id="projects"
              title="Projects"
              lead="Each one is built, broken on purpose, fixed, and written up step by step."
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06} className={i === 0 ? "md:col-span-2" : ""}>
                <Link
                  href={`/projects/${p.slug}/`}
                  className="group flex h-full flex-col rounded-lg border border-panel-2 bg-panel p-7 transition-colors hover:border-alarm-line hover:bg-[#18161b]"
                >
                  {p.highlight && <p className="mb-3 text-[15px] font-bold text-signal-hi">{p.highlight}</p>}
                  <h3 className="font-display text-2xl sm:text-[28px] font-bold leading-tight">
                    {p.title}
                    <ArrowUpRight className="ml-2 inline-block align-[-2px] text-muted transition-colors group-hover:text-signal-hi" size={22} />
                  </h3>
                  <p className="mt-3 max-w-[44rem] text-muted">{p.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-[#e4e4e6]">
                    {p.stack.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Writing ---------- */}
      <section id="writing" aria-labelledby="writing-title" className="border-t border-panel-2 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 xl:pr-28">
          <Reveal>
            <SectionHeading id="writing" title="Writing" lead="Short notes on things I learned the hard way in my labs." />
          </Reveal>
          <ul className="border-t border-panel-2">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-panel-2">
                <Link href={`/writing/${post.slug}/`} className="group grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:gap-10">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold group-hover:text-signal-hi transition-colors">{post.title}</h3>
                    <p className="mt-2 max-w-[44rem] text-muted">{post.summary}</p>
                  </div>
                  <time dateTime={post.date} className="text-[15px] text-dim sm:pt-1.5">
                    {formatDate(post.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" aria-labelledby="contact-title" className="border-t border-panel-2 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 xl:pr-28">
          <Reveal>
            <div className="rounded-lg border border-alarm-line bg-alarm p-8 sm:p-12">
              <h2 id="contact-title" className="font-display text-4xl sm:text-5xl font-bold leading-tight">
                Let&apos;s talk
              </h2>
              <p className="mt-4 max-w-[36rem] text-lg text-[#e4e4e6]">
                I&apos;m looking for cloud, security and DevOps internships for 2027. If you&apos;re hiring or want to talk about any of these projects, get in touch.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {site.email && (
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-2 rounded-md bg-signal px-6 py-3 font-bold text-paper transition-colors hover:bg-signal-hi"
                  >
                    <Mail size={18} /> Email me
                  </a>
                )}
                <a
                  href={site.github}
                  className="inline-flex items-center gap-2 rounded-md border border-paper/70 px-6 py-3 font-bold transition-colors hover:bg-paper hover:text-ink"
                >
                  GitHub
                </a>
                {site.linkedin && (
                  <a
                    href={site.linkedin}
                    className="inline-flex items-center gap-2 rounded-md border border-paper/70 px-6 py-3 font-bold transition-colors hover:bg-paper hover:text-ink"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </Reveal>
          <p className="mt-12 text-sm text-dim">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </section>
    </>
  );
}
