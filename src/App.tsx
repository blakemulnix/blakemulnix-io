import { AboutSection } from './components/AboutSection'
import { Backdrop } from './components/Backdrop'
import { ExperienceSection } from './components/ExperienceSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

export const App = () => (
  <>
    <a
      href="#content"
      className="focus:bg-surface-800 focus:text-ink-50 sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
    >
      Skip to content
    </a>

    <Backdrop />

    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:flex lg:justify-between lg:gap-8">
        <Header />
        <main id="content" className="lg:w-1/2 lg:py-24">
          <AboutSection />
          <ExperienceSection />
          <Footer />
        </main>
      </div>
    </div>
  </>
)
