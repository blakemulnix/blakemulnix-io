interface SectionHeadingProps {
  title: string
}

/**
 * Sticky on small screens where the sidebar nav is hidden; visually hidden on
 * large screens, where the sidebar already labels each section.
 */
export const SectionHeading = ({ title }: SectionHeadingProps) => (
  <div className="bg-surface-900/60 sticky top-0 z-20 -mx-6 mb-6 w-screen px-6 py-5 backdrop-blur-md md:-mx-12 md:px-12 lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0">
    <h2 className="text-ink-100 text-sm font-bold tracking-widest uppercase lg:sr-only">{title}</h2>
  </div>
)
