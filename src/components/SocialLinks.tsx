import { socialLinks } from '../data/social'

export const SocialLinks = () => (
  <ul className="mt-8 mb-12 flex items-center gap-5 lg:mt-10" aria-label="Social profiles">
    {socialLinks.map(({ label, url, Icon }) => (
      <li key={label}>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-ink-300 hover:text-ink-50 block transition-colors"
        >
          <span className="sr-only">{label}</span>
          <Icon className="h-6 w-6" />
        </a>
      </li>
    ))}
  </ul>
)
