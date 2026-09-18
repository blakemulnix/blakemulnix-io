/**
 * A single client engagement inside a consulting role. Listed under the role
 * rather than as a role of its own, since the employer never changed.
 */
export interface ClientEngagement {
  /*
   * An industry descriptor, not a company name. Client MSAs typically carry a
   * mutual publicity clause requiring written consent before either party
   * uses the other's name in marketing, and Source Allies anonymises its own
   * case studies this way: three of roughly fifty name the client. Swap in a
   * real name only for a client who has agreed to it in writing.
   */
  client: string
  start: string
  /** Omitted for a current engagement, which renders as "Present". */
  end?: string
  /** Paragraphs, so a long engagement is not one wall of text. */
  summary: string[]
  /** Per engagement, not per role: the stack changes with the client. */
  technologies: string[]
}

export interface ExperienceEntry {
  title: string
  company: string
  companyUrl: string
  start: string
  /** Omitted for the current role, which renders as "Present". */
  end?: string
  summary: string
  technologies: string[]
  /**
   * Consulting roles only. Newest first, like the roles themselves. When
   * present these carry the technology pills, since the role's own list would
   * just be the union of theirs.
   */
  clients?: ClientEngagement[]
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
    clients: [
      {
        client: 'Global agricultural equipment manufacturer',
        start: 'December 2025',
        summary: [
          'Capturing metrics on how their technology is actually used in the field, then surfacing them to product teams and dealers so they can step in with a customer or make a call on where the roadmap goes next. Pipelines aggregate the raw utilization data, and a federated graph serves it out to the teams and tools downstream.',
          'When I showed up, testing meant a run in our Databricks runtime against huge production datasets, requiring hours of waiting to verify a single change. I pushed for local test driven development and established the data factory pattern that enabled it, so pipeline logic could be split into modular units and unit tested against small, readable inputs in seconds. My team ran with it. I made the same case for inner source packaging, to move away from copy pasting between repos. Both have since spread to other data product teams.',
          'All of this shows up in how fast we can deliver a new dataset, and how often it arrives without surprises. What holds us up now sits upstream of us, in product requirements and source data rather than in our own code or execution.',
        ],
        technologies: [
          'Python',
          'Spark',
          'Databricks',
          'GraphQL',
          'Netflix DGS',
          'Apollo Federation',
          'Spring',
          'Kubernetes',
          'AWS',
          'Datadog',
        ],
      },
      {
        client: 'Multinational crop nutrition and agricultural retail provider',
        start: 'September 2024',
        end: 'December 2025',
        summary: [
          'Worked in a data product ecosystem dealing in geospatial field data ("field" as in the kind with dirt). Our services held the source of truth for field boundaries and acted as the hub between their platform and the other ag tech companies it exchanges data with. Most of my time went into the architecture around that, event driven data products with a GraphQL API in front.',
          'Also paired closely with the team building the customer facing map interface, where a grower sees their own fields alongside yields and application rates.',
        ],
        technologies: ['AWS', 'GraphQL', 'Kafka', 'SQS', 'PostgreSQL', 'GeoJSON', 'CloudFormation', 'React'],
      },
      {
        client: 'Global automotive OEM components manufacturer',
        start: 'June 2024',
        end: 'September 2024',
        summary: [
          'Two applications for different parts of the business. The first let project managers follow a product from an identified industry need through to handoff to manufacturing. The second was a search tool for their OEM parts catalog, which meant letting internal salespeople filter fasteners the way their customers actually ask for them, by things like thread length, diameter, flange width, and a long list of other descriptors.',
        ],
        technologies: ['React', 'GraphQL', 'PostgreSQL', 'Azure', 'Bicep'],
      },
      {
        client: 'Plant breeding and nursery company',
        start: 'August 2023',
        end: 'June 2024',
        summary: [
          'Built the central hub for their contract royalty management, a GraphQL API that was both the source of truth for financial agreements and the integration point between their third party SaaS and CRM tooling.',
          'I stood up the admin interface on top of it as well, so their finance team had a direct way to see and correct the data every other system was reading.',
        ],
        technologies: ['C#', '.NET', 'HotChocolate', 'GraphQL', 'PostgreSQL', 'Azure', 'Bicep', 'React'],
      },
    ],
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
    title: 'Software Engineer',
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
