interface ExperienceItemProps {
  title: string;
  company: string;
  companySite: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ title, company, companySite, startDate, endDate, description, technologies }: ExperienceItemProps) => {
  const showEndDate = endDate ? endDate : "Present";

  return (
    <li className="mb-12">
      <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
        <div className="z-0 absolute -inset-x-4 -inset-y-4 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-stone-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-stone-100 sm:col-span-2">
          <div className="flex items-center">
            <span className="mr-1.5">
              {startDate} - {showEndDate}
            </span>
          </div>
        </header>
        <div className="z-10 sm:col-span-6">
          <h3 className="font-medium leading-snug text-stone-100">
            <div>
              <a
                className="inline-flex items-baseline font-medium leading-tight text-stone-100 md:hover:text-sky-300 md:focus-visible:text-sky-300 group/link text-base"
                href={companySite}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} at ${company}`}
              >
                <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                <span>
                  {title} -{" "}
                  <span className="inline-block">
                    {company}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline-block h-4 w-4 shrink-0 transition-transform lg:group-hover/link:-translate-y-1 lg:group-hover/link:translate-x-1 lg:group-focus-visible/link:-translate-y-1 lg:group-focus-visible/link:translate-x-1 lg:motion-reduce:transition-none ml-1 translate-y-px"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </span>
              </a>
            </div>
          </h3>
          <p className="mt-2 text-[0.95rem] leading-normal">{description}</p>
          <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
            {technologies.map((technology) => (
              <li className="mr-1.5 mt-2" key={technology}>
                <div className="flex items-center rounded-full bg-sky-300/20 px-3 py-1 text-xs font-medium leading-5 text-sky-200">{technology}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default ExperienceItem;
