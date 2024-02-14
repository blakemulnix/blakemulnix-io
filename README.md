# [blakemulnix.io](https://blakemulnix.io)

This repository contains my portfolio site which showcases my software engineering background and a bit about me.

## Technology Overview

I built this portfolio site using the following technologies:

- **Frontend**: The frontend is built using [TypeScript](https://www.typescriptlang.org) and [React](https://react.dev), while leveraging the [Next.js](https://nextjs.org) framework for static site generation. I am using [Tailwind CSS](https://tailwindcss.com) for styling and design.

- **Infrastructure**: The website is deployed on AWS using:
  - Amazon S3 for hosting static assets
  - Amazon CloudFront for the sites content delivery network
  - Amazon Route 53 for DNS needs
  - AWS ACM for managing SSL/TLS certificates

- **SST**: The infrastructure provisioning is automated using [SST](https://sst.dev).

- **Github Codespaces**: I am using Github Codespaces along with [Dev Container](https://containers.dev/) tooling for my development environment.
