import { experience } from '../data/experience'
import { ExperienceItem } from './ExperienceItem'
import { ResumeLink } from './ResumeLink'
import { SectionHeading } from './SectionHeading'

export const ExperienceSection = () => (
  <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
    <SectionHeading title="Experience" />
    <ol className="group/list">
      {experience.map((entry) => (
        <ExperienceItem key={`${entry.company}-${entry.start}`} {...entry} />
      ))}
    </ol>
    <ResumeLink />
  </section>
)
