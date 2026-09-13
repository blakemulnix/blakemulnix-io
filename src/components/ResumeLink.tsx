import { ArrowRightIcon } from './icons'

export const ResumeLink = () => (
  <a
    href="/BlakeMulnixResume.pdf"
    className="group text-ink-50 mt-12 inline-flex items-center font-semibold"
    aria-label="View full resume (PDF)"
  >
    <span className="group-hover:border-accent-300 border-b border-transparent pb-px transition-colors">
      View Full Resume
    </span>
    <ArrowRightIcon className="ml-1.5 h-4 w-4 shrink-0 transition-transform duration-300 ease-(--ease-out-soft) group-hover:translate-x-1.5" />
  </a>
)
