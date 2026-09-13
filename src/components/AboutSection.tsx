import { ExternalLink } from './ExternalLink'
import { SectionHeading } from './SectionHeading'

export const AboutSection = () => (
  <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
    <SectionHeading title="About" />
    <div className="space-y-4 leading-relaxed text-pretty">
      <p className="text-ink-100 text-xl">Hey, I&apos;m Blake 👋</p>
      <p>
        I&apos;ve been into computers since I was a youngster, back in the days of dial-up internet. That early
        curiosity turned into a lasting appreciation for what technology can do for the people who use it. So today, I
        build software for a living.
      </p>
      <p>
        I&apos;ve had the privilege of writing software for a large{' '}
        <ExternalLink href="https://www.collinsaerospace.com">defense company</ExternalLink>, a small tech shop in the{' '}
        <ExternalLink href="https://www.herzog.com">railroad industry</ExternalLink>, the{' '}
        <ExternalLink href="https://www.ameslab.gov/">Department of Energy</ExternalLink>, an{' '}
        <ExternalLink href="https://www.principal.com">insurance corporation</ExternalLink>, and a{' '}
        <ExternalLink href="https://www.gravity-legal.com">startup</ExternalLink> in legal tech.
      </p>
      <p>
        These days I&apos;m a consultant at{' '}
        <ExternalLink href="https://www.sourceallies.com">Source Allies</ExternalLink>, where I work on cloud
        applications and infrastructure alongside a team of people who care a great deal about the craft. Together we
        help our partners ship software they can rely on.
      </p>
      <p>
        Outside of work you&apos;ll find me on my gravel bike, road-tripping across the country, or trekking around the
        western United States.
      </p>
    </div>
  </section>
)
