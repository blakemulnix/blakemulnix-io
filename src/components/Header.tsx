import { Navigation } from './Navigation'
import { SocialLinks } from './SocialLinks'

export const Header = () => (
  <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
    <div>
      <h1 className="text-ink-50 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Blake Mulnix</h1>
      <p className="text-ink-100 mt-3 text-lg font-medium tracking-tight sm:text-xl">Software Consultant</p>
      <p className="text-ink-300 mt-4 max-w-xs leading-relaxed">I build reliable, scalable software on the cloud.</p>
      <Navigation />
      <SocialLinks />
    </div>
  </header>
)
