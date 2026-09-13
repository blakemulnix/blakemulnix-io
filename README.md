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

CloudFront serves a private S3 bucket through Origin Access Control, so the
bucket is never publicly readable. TLS comes from an ACM certificate in
`us-east-1` (CloudFront's requirement), validated via DNS, and Route 53 holds
A and AAAA aliases for both the apex and `www`.

Two stacks:

- **`SiteGithubOidc`** — the GitHub OIDC provider and the deploy role. Its trust
  policy is pinned to this repository and the `main` branch; any other
  repository presenting a token is rejected.
- **`Site`** — bucket, distribution, certificate, and DNS records.

CDK manages infrastructure only. Site content is published by `s3 sync`, so a
copy change does not require a CloudFormation deployment.

```bash
cd infra
npm ci
npx jest              # assertions over the synthesized templates
npx cdk diff --all
npx cdk deploy --all
```

Account-specific values live in `cdk.json` context (`domainName`,
`githubRepo`, `deployBranch`) and can be overridden per invocation with
`-c domainName=...`.

### One-time setup in a new AWS account

1. **Register or transfer the domain** into Route 53 so a hosted zone for
   `blakemulnix.io` exists in the target account. The CDK app looks this zone up
   by name and will not create it.
2. **Bootstrap CDK**, once per account and region:
   ```bash
   cd infra && npx cdk bootstrap aws://<account-id>/us-east-1
   ```
3. **Deploy the stacks** with administrator credentials:
   ```bash
   npx cdk deploy --all
   ```
   `SiteGithubOidc` must exist before CI can authenticate. If the account
   already has a GitHub OIDC provider, pass `-c createOidcProvider=false`.
4. **Wire up GitHub.** Copy the `DeployRoleArn` output into a repository
   variable named `AWS_DEPLOY_ROLE_ARN`, and create an environment named
   `production` (both deploy workflows reference it, so it is also where you can
   add a required reviewer).
5. **Point DNS at the account** by updating the registrar's nameservers to the
   hosted zone's, if the domain is registered elsewhere.

After that, pushes to `main` deploy themselves.

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
