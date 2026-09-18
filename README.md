# [blakemulnix.io](https://blakemulnix.io)

My personal site: a single-page static résumé and introduction.

## Stack

| Concern        | Choice                                                           |
| -------------- | ---------------------------------------------------------------- |
| UI             | React 19 + TypeScript                                            |
| Build          | Vite 8 (static output to `dist/`)                                |
| Styling        | Tailwind CSS 4, configured in CSS via `@theme`                   |
| Fonts          | Inter, Fraunces and JetBrains Mono, self-hosted via Fontsource   |
| Linting        | oxlint, Prettier                                                 |
| Infrastructure | AWS CDK — S3 + CloudFront + ACM + Route 53                       |
| CI/CD          | GitHub Actions, authenticating to AWS with OIDC (no stored keys) |

There is no framework beyond React. The site is one page with no routing, no
server rendering, and no data fetching, so a bundler is all it needs.

## Local development

Requires Node 24 (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:5173
```

| Script              | Purpose                             |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Dev server with hot reload          |
| `npm run build`     | Typecheck, then build to `dist/`    |
| `npm run preview`   | Serve the production build locally  |
| `npm run lint`      | oxlint (`lint:fix` to autofix)      |
| `npm run typecheck` | `tsc -b`, no emit                   |
| `npm run format`    | Prettier (`format:check` in CI)     |
| `npm run photos`    | Rebuild the photo wall (see Photos) |
| `npm run resume`    | Render the one page CV PDF          |
| `npm run og`        | Render the social preview card      |

## Layout

```
src/
  components/    The page and its parts; Segments renders shared prose
  sections/      Experience, How I Work and Outside Work content
  designs/       Parked layout explorations, reachable in dev only
  data/          Content, kept out of markup (photos.generated.ts is built)
  theme.ts       Palette and the three section definitions
  index.css      Tailwind import and design tokens
photos/          manifest.json plus gitignored originals
public/          Served verbatim: photo derivatives, favicon, robots, sitemap
add-photos/      The photo import and labelling tool
scripts/         Photo pipeline, resume and social card renderers
explorations/    Standalone review pages (favicon options)
infra/           CDK app (see below)
```

To update work history, edit `src/data/experience.ts`, and About copy
`src/data/about.ts`; neither needs a component change.

## CV

```sh
npm run resume       # resume/out/blake-mulnix-cv.pdf
```

Two files: [`resume/content.yaml`](resume/content.yaml) is the words,
[`resume/cv.typ`](resume/cv.typ) is the layout. The content is deliberately not
the site's prose, because the site has room to explain and a CV has one page
and a reader who is skimming.

Typeset by [Typst](https://typst.app/) through its Python wheel, so a real
typesetting engine handles line breaking and vertical rhythm, and there is no
TeX distribution to install. The layout echoes the site: the same three faces,
the same palette, the same accent rule down the left of each entry, and the
technology pills moved into a column beside each role rather than stranded in a
list at the bottom of the page. The page is paper rather than pine, since sand
on a dark ground is unkind to a printer and to anyone reading in a light PDF
viewer.

The fonts come from `node_modules`, converted from woff2 to TTF on demand, so
the CV is set in the same files the browser serves rather than a second copy
that can drift.

First run creates a virtualenv under `scripts/resume/` and converts the fonts.
After that a render takes well under a second. One page is the brief, so the
script asks `pdfinfo` how many came out and fails on two rather than shipping
quietly.

## Social preview card

```sh
npm run og           # public/og.jpg, the link preview card
```

Built from the site's own photography, fonts and palette by
[`scripts/og-card/card.html`](scripts/og-card/card.html), printed by headless
Chrome. The name, role and tagline are read out of `src/data/about.ts`, so the
card cannot drift from the site. Bump the `?v=` on `og:image` in `index.html`
after regenerating: Facebook, LinkedIn and Slack all cache previews by URL,
several of them for weeks.

## Photos

The Outside Work wall is built from `photos/originals/`, which is **gitignored**
(26MP files, ~200MB). What ships is the WebP derivatives in `public/photos/`,
which _are_ committed.

### Adding new photos

```bash
cp ~/wherever/*.JPG photos/originals/
npm run add-photos
```

That is the whole flow. It scans the originals, builds the derivatives, and
serves a page at `http://localhost:4321` listing every photo with its
thumbnail and a location field. **Labels save to `photos/manifest.json` as you
type**, `Enter` jumps to the next unlabelled photo, and _Save and rebuild_
regenerates the site's photo data when you are done. Then commit.

The tool lives in [`add-photos/`](add-photos/). It runs a small local server
rather than being a page you open directly, because a page loaded over
`file://` cannot write to disk, and a labelling page that asks you to copy JSON
back out by hand is how labels get lost.

Only `location` is taken from the page. Slugs, dates and dimensions are derived
from the original file, so a stale tab cannot overwrite them.

An unlabelled photo still renders, falling back to its date.

### The two scripts behind it

| Script                | Does                                                        |
| --------------------- | ----------------------------------------------------------- |
| `photos-manifest.mjs` | Scans originals, adds new entries to `photos/manifest.json` |
| `photos-build.mjs`    | Encodes derivatives, writes `src/data/photos.generated.ts`  |

`npm run photos` runs both, which is all `add-photos` does on startup and on
_Save and rebuild_. `photos/manifest.json` is the source of truth;
`src/data/photos.generated.ts` and `public/photos/` are generated from it.

### Guarantees worth knowing

- **Idempotent.** Re-running never overwrites a `location` or `caption` you
  typed. They are matched by original filename, so renaming an original loses
  its label.
- **Slugs are permanent.** They come from the capture date
  (`2026-09-04-01.webp`), and once assigned they never move, even if you later
  add a photo taken earlier the same day. They are public URLs cached for a
  month, so they must not be reused for different content.
- **Incremental.** Existing derivatives are skipped unless the original is
  newer, so a rerun after labelling costs no re-encoding.
- **Self-pruning.** Removing an original, or setting `"hidden": true` on its
  entry, deletes its derivatives on the next run.
- **Metadata is stripped**, including GPS. Two originals carry coordinates, and
  publishing where a photo was taken is not something to do by accident. EXIF
  orientation is applied before stripping, so nothing lands sideways.
- **Deterministically shuffled.** The wall reads as unordered but is stable
  across builds, which is what lets it be prerendered.

Three widths (400 / 900 / 1800) are emitted per photo and served via `srcset`,
plus a 20px inline blur-up placeholder that doubles as the lightbox backdrop.
Requires ImageMagick (`magick`) on `PATH`. AVIF is deliberately not used: the
local ImageMagick has no AVIF delegate and silently writes JPEG under an
`.avif` name.

## Infrastructure

Everything the site needs is defined in CDK, including DNS. Nothing is created
by hand in the console or with the CLI.

CloudFront serves a private S3 bucket through Origin Access Control, so the
bucket is never publicly readable. TLS comes from an ACM certificate in
`us-east-1` (CloudFront's requirement), validated via DNS against the zone this
app owns, and Route 53 holds A and AAAA aliases for both the apex and `www`.

Three stacks:

- **`SiteGithubOidc`** — the GitHub OIDC provider and the deploy role. Its trust
  policy is pinned to this repository and the `main` branch; any other
  repository presenting a token is rejected.
- **`SiteDns`** — the public hosted zone, marked `RETAIN` so it survives stack
  changes. Also holds `NS` records delegating subdomains to other project
  accounts.
- **`Site`** — bucket, distribution, certificate, and the apex/`www` records.

CDK manages infrastructure only. Site content is published by `s3 sync`, so a
copy change does not require a CloudFormation deployment.

```bash
cd infra
npm ci
npx jest              # assertions over the synthesized templates
npx cdk synth         # works offline; no credentials or context lookups
npx cdk diff
npx cdk deploy --all
```

Account-specific values live in `cdk.json` context (`domainName`,
`githubRepo`, `deployBranch`) and can be overridden per invocation with
`-c domainName=...`.

### Delegating a subdomain to another account

To point `mycoolthing.blakemulnix.io` at a different project account, create a
hosted zone for it in that account and add its name servers to the
`delegations` context:

```json
"delegations": [
  { "subdomain": "mycoolthing", "nameServers": ["ns-1.awsdns-00.org", "..."] }
]
```

`SiteDns` turns each entry into an `NS` record. The apex stays here.

### The two steps CDK cannot do

Domain _registration_ has no CloudFormation resource, so these are unavoidably
manual:

1. **Registering or transferring the domain** into the target account.
   Transfers between accounts in the same organization must be accepted by the
   receiving account within three days.
2. **Pointing the registrar at the zone.** Deploy `SiteDns` first, read its
   `NameServers` output, and set those as the domain's name servers. Until that
   propagates the zone is not authoritative, and the certificate in `Site`
   cannot pass DNS validation.

Hence the deployment order for a new account:

```bash
cd infra
npx cdk bootstrap aws://<account-id>/us-east-1
npx cdk deploy SiteDns                      # then set name servers at registrar
npx cdk deploy SiteGithubOidc Site          # once DNS is authoritative
```

Copy the `DeployRoleArn` output into a repository variable named
`AWS_DEPLOY_ROLE_ARN`, and create a GitHub environment named `production`,
which both deploy workflows reference.

Then restrict that environment to `main`:

```bash
gh api -X PUT repos/<owner>/<repo>/environments/production \
  -F 'deployment_branch_policy[protected_branches]=false' \
  -F 'deployment_branch_policy[custom_branch_policies]=true'
gh api -X POST repos/<owner>/<repo>/environments/production/deployment-branch-policies \
  -f name=main -f type=branch
```

This is not cosmetic. GitHub varies the OIDC `sub` claim by context: a job
declaring an environment presents `repo:<owner>/<repo>:environment:production`,
which names no branch, while a job without one presents
`repo:<owner>/<repo>:ref:refs/heads/main`. `SiteGithubOidc` trusts both, so the
only thing stopping a workflow on some other branch from deploying is this
deployment branch policy. It lives in GitHub rather than CDK because it is a
GitHub resource, which is exactly why it is easy to forget.

## Deployment

| Workflow           | Trigger                            | Does                                      |
| ------------------ | ---------------------------------- | ----------------------------------------- |
| `ci.yml`           | Pull requests and pushes to `main` | Format, lint, typecheck, build, CDK tests |
| `deploy-site.yml`  | Pushes to `main` outside `infra/`  | Builds, syncs to S3, invalidates the CDN  |
| `deploy-infra.yml` | Pushes to `main` touching `infra/` | `cdk diff`, then `cdk deploy --all`       |

Three cache tiers: hashed bundles under `assets/` for a year and marked
immutable, photos under `photos/` for 30 days, and everything else
`must-revalidate` so copy changes take effect at once. Photos are not immutable
because their names come from the capture date rather than a content hash.

`aws s3 sync` compares size and mtime, not metadata, so changing a
`--cache-control` header alone will not re-upload an unchanged file. Rewriting
headers on existing objects needs `s3 cp --recursive --metadata-directive
REPLACE`.

No AWS credentials are stored in GitHub. Each run exchanges a short-lived OIDC
token for a session on the deploy role, which can write to this one bucket,
invalidate this one distribution, and assume the CDK bootstrap roles.
