# [blakemulnix.io](https://blakemulnix.io)

My personal site: a single-page static résumé and introduction.

## Stack

| Concern        | Choice                                                           |
| -------------- | ---------------------------------------------------------------- |
| UI             | React 19 + TypeScript                                            |
| Build          | Vite 8 (static output to `dist/`)                                |
| Styling        | Tailwind CSS 4, configured in CSS via `@theme`                   |
| Fonts          | Inter, self-hosted through Fontsource                            |
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

| Script              | Purpose                            |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Dev server with hot reload         |
| `npm run build`     | Typecheck, then build to `dist/`   |
| `npm run preview`   | Serve the production build locally |
| `npm run lint`      | oxlint (`lint:fix` to autofix)     |
| `npm run typecheck` | `tsc -b`, no emit                  |
| `npm run format`    | Prettier (`format:check` in CI)    |

## Layout

```
src/
  components/    Presentational components, one per file
  data/          Résumé and social content, kept out of markup
  hooks/         useActiveSection — scroll-spy for the sidebar nav
  index.css      Tailwind import and design tokens
public/          Served verbatim: photo, résumé PDF, robots, sitemap
infra/           CDK app (see below)
```

To update the résumé, edit `src/data/experience.ts`; no component changes
needed.

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

## Deployment

| Workflow           | Trigger                            | Does                                      |
| ------------------ | ---------------------------------- | ----------------------------------------- |
| `ci.yml`           | Pull requests and pushes to `main` | Format, lint, typecheck, build, CDK tests |
| `deploy-site.yml`  | Pushes to `main` outside `infra/`  | Builds, syncs to S3, invalidates the CDN  |
| `deploy-infra.yml` | Pushes to `main` touching `infra/` | `cdk diff`, then `cdk deploy --all`       |

Hashed bundles under `assets/` are cached for a year and marked immutable;
everything else is served `must-revalidate` so deploys take effect at once.

No AWS credentials are stored in GitHub. Each run exchanges a short-lived OIDC
token for a session on the deploy role, which can write to this one bucket,
invalidate this one distribution, and assume the CDK bootstrap roles.
