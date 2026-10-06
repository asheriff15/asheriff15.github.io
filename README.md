# Adnan Sheriff — Portfolio

My personal site: cloud and security projects, each built, broken on purpose, fixed and written up.

**Stack:** Next.js (static export) · Tailwind CSS · Motion · GitHub Actions → GitHub Pages

## Editing content

| What | Where |
|---|---|
| Name, intro, skills, timeline, contact links | `src/content/site.ts` |
| Projects | `content/projects/*.md` — one Markdown file per project |
| Blog posts | `content/posts/*.md` — one Markdown file per post |
| Images | `public/projects/...` |

To add a project or post, copy an existing `.md` file, change the frontmatter at the top, and write the body in Markdown.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Deployment

Every push to `main` builds the site and publishes it with GitHub Actions (`.github/workflows/deploy.yml`).

**Planned:** move hosting to AWS S3 + CloudFront with Terraform, deployed from GitHub Actions using OIDC instead of stored access keys.
