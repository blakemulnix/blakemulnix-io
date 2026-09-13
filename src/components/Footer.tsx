import { ExternalLink } from './ExternalLink'

export const Footer = () => (
  <footer className="text-ink-400 max-w-md pb-12 text-sm lg:pb-24">
    <p>
      Built with <ExternalLink href="https://react.dev/">React</ExternalLink>,{' '}
      <ExternalLink href="https://vite.dev/">Vite</ExternalLink>, and{' '}
      <ExternalLink href="https://tailwindcss.com/">Tailwind CSS</ExternalLink>. Deployed to{' '}
      <ExternalLink href="https://aws.amazon.com/">AWS</ExternalLink> with the{' '}
      <ExternalLink href="https://aws.amazon.com/cdk/">CDK</ExternalLink>. Source on{' '}
      <ExternalLink href="https://github.com/blakemulnix/blakemulnix-io">GitHub</ExternalLink>.
    </p>
  </footer>
)
