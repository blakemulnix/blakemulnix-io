import type { SectionId } from '../theme'
import { ExperienceContent } from './ExperienceContent'
import { OutsideContent } from './OutsideContent'
import { PhotosContent } from './PhotosContent'
import { ValuesContent } from './ValuesContent'
import { WritingContent } from './WritingContent'

/** Content is identical across designs; only the shell differs. */
export const sectionContent: Record<
  SectionId,
  (props: { accent: string }) => React.ReactElement
> = {
  experience: ExperienceContent,
  values: ValuesContent,
  outside: OutsideContent,
  photos: PhotosContent,
  writing: WritingContent,
}
