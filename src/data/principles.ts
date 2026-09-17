export interface Principle {
  title: string
  /** Short framing line, set larger than the body. */
  lede: string
  body: string[]
}

/** Section lede, shared by every design. */
export const valuesLede = 'A few things I believe are load-bearing if a team is going to excel over the long term.'

export const principles: Principle[] = [
  {
    title: 'Fast feedback loops',
    lede: 'I would rather be wrong in an hour than right in a month.',
    body: [
      'Test driven development is the cornerstone of this mindset. Tests written after implementation tend to describe whatever the code already does, while tests written first describe what it is supposed to do and code quality reflects that: smaller units, cleaner modules, and (of course) truly testable code.',
      'I push my team to work closely and frequently with those upstream and downstream of us (customers, or teams we are partnering with). There are always unknown unknowns, I prefer to find them early rather than a week before a deadline.',
      'Lastly, I believe in investing time in ceremonies to build and maintain a durable and healthy team: chartering a team early so we understand how each of us actually works + holding quality retros so that the real problems get acknowledged and resolved.',
    ],
  },
  {
    title: 'Self-organizing teams',
    lede: 'The people closest to the work know how to be most effective.',
    body: [
      'In my experience, teams trusted to organize themselves and set their own direction consistently outperform teams waiting to be told. Direction should arrive in the form of stakeholder needs, not a Jira ticket.',
      'That trust is not a reward for maturity, it is how maturity develops. A team never given the responsibility to make the decision never learns to make it well.',
    ],
  },
  {
    title: 'Sustainable delivery',
    lede: 'Engineers are the counterweight to the pull toward deliver, deliver, deliver.',
    body: [
      "Product's instinct to ship is healthy and necessary. Left unchecked it borrows against a system's future, because technical debt is often invisible in any single deliverable. Engineers should spot these costs, and making them visible to leadership is part of the job.",
      'The goal is that the team delivers reliably for years rather than impressing stakeholders one quarter and fighting fires the next.',
      'Of course, technical debt is unavoidable. The question is whether it is taken on deliberately and paid down, or accumulated unintentionally and discovered later.',
    ],
  },
]
