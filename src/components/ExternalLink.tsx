import type { ReactNode } from 'react'

interface ExternalLinkProps {
  href: string
  children: ReactNode
}

export const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-accent-200 decoration-accent-400/40 hover:text-accent-100 hover:decoration-accent-300 underline decoration-1 underline-offset-2 transition-colors"
  >
    {children}
  </a>
)
