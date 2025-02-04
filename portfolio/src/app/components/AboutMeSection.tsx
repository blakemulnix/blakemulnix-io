import HighlightLink from './HighlightLink'
import SectionTitle from './SectionTitle'

const AboutMeSection = () => {
  return (
    <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <SectionTitle title="About" />
      <div className="text-pretty leading-relaxed">
        <p className="mb-4 text-xl">Hey, I&apos;m Blake 👋🏻</p>
        <p className="mb-4">
          I&apos;ve been into computers since I was a youngster—back in the days of dial-up internet. My early curiosity
          grew into a deep appreciation for technology&apos;s potential to enrich our lives. So today, I build software
          for a living.
        </p>
        {/* <p className="mb-4">
          Lately, I've been working with cloud infrastructure, building out backends (lots of GraphQL), and working with
          React. Oh, and I have been learning Go on side!
        </p> */}
        {/* <p className="mb-4">
          In my career thus far, I have had the privilege of building software for a large{' '}
          <HighlightLink text="defense company" url="https://www.collinsaerospace.com" />, a small tech shop in the{' '}
          <HighlightLink text="railroad industry" url="https://www.herzog.com" />, the{' '}
          <HighlightLink text="Department of Energy" url="https://www.ameslab.gov/" />, an{' '}
          <HighlightLink text="insurance corporation" url="https://www.principal.com" />, and a{' '}
          <HighlightLink text="startup" url="https://www.gravity-legal.com" /> in the legal tech industry.
        </p> */}
        <p className="mb-4">
          As a consultant at <HighlightLink text="Source Allies" url="https://www.sourceallies.com" />
          {', '}I apply my expertise in the realm of cloud applications and infrastructure. I work with our team of
          experts to help our partners deliver high-quality software solutions.
        </p>
        <p className="mb-4">
          Outside of work, you&apos;ll find me on my gravel bike, road-tripping across the country, or trekking around
          our deserts and national forests taking photos. See some highlights of my adventures in my{' '}
          <HighlightLink text="photo journal" url="https://adventures.blakemulnix.com" />.
        </p>
      </div>
    </section>
  )
}

export default AboutMeSection
