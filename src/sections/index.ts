import type { SectionId } from '../theme'
import { ExperienceContent } from './ExperienceContent'
import { OutsideContent } from './OutsideContent'
import { ValuesContent } from './ValuesContent'

/** Content is identical across designs; only the shell differs. */
export const sectionContent: Record<SectionId, (props: { accent: string }) => React.ReactElement> = {
  experience: ExperienceContent,
  values: ValuesContent,
  outside: OutsideContent,
}
