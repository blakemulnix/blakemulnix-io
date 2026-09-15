export interface ExperienceEntry {
  title: string
  company: string
  companyUrl: string
  start: string
  /** Omitted for the current role, which renders as "Present". */
  end?: string
  summary: string
  technologies: string[]
}

export const experience: ExperienceEntry[] = [
  {
    title: 'Software Consultant',
    company: 'Source Allies',
    companyUrl: 'https://www.sourceallies.com/',
    start: 'September 2023',
    summary:
      'Partner with client teams to design and ship enterprise applications on the cloud, spanning application code, infrastructure, and delivery pipelines. Much of the work is coaching teams toward test driven development, smaller iterations, and tooling that makes delivery predictable.',
    technologies: ['TypeScript', 'Node.js', 'React', 'C#', 'AWS', 'Azure', 'Bicep', 'GraphQL'],
  },
  {
    title: 'Software Engineer',
    company: 'Gravity Legal',
    companyUrl: 'https://www.gravity-legal.com/',
    start: 'June 2022',
    end: 'January 2023',
    summary:
      'Improved payment processing software for law firms and legal tech companies. Built out end-to-end test coverage and led integration testing through an overhaul of the payment flow.',
    technologies: ['React', 'Node.js', 'TypeScript', 'TypeORM', 'MySQL', 'AWS'],
  },
  {
    title: 'Software Engineer II',
    company: 'Principal Financial Group',
    companyUrl: 'https://www.principal.com/',
    start: 'August 2020',
    end: 'June 2022',
    summary:
      'Built customer-facing experiences on the Enterprise Experience Enablement team, including the home page, messaging, and user profile. Led the integration of a new customer segment following an acquisition, coordinating across many teams.',
    technologies: ['JavaEE', 'JSP', 'WebSphere', 'DB2', 'Python', 'Flask', 'API Gateway', 'AWS'],
  },
  {
    title: 'Software Scientist',
    company: 'Ames Laboratory, Department of Energy',
    companyUrl: 'https://www.ameslab.gov/',
    start: 'January 2020',
    end: 'July 2020',
    summary:
      'Contributed to CMakePP, an open-source project for building cross-platform C and C++ build systems for computational chemistry. Extended the CMakePP language and wrote its documentation.',
    technologies: ['CMake', 'GNU Make', 'Sphinx', 'Linux'],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Herzog Technologies',
    companyUrl: 'https://www.herzog.com/',
    start: 'May 2018',
    end: 'August 2019',
    summary:
      'Worked across three projects: a LiDAR-based application for railroad clearance analysis, a technical lead role on an in-house compensation management tool, and the migration of a proprietary desktop railroad data validation tool to the web.',
    technologies: ['Python', 'Tornado', 'Angular', 'SQLAlchemy', 'Bootstrap', 'Docker', 'C#', 'WPF'],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Collins Aerospace',
    companyUrl: 'https://www.collinsaerospace.com/',
    start: 'June 2014',
    end: 'January 2018',
    summary:
      'Part of the team behind an automated testing system for radio hardware, translating feedback from test engineers into new features and fixes that shortened their test cycles.',
    technologies: ['JavaFX', 'Python', 'Tornado', 'Angular'],
  },
]
