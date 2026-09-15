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
      'Test driven development is the cornerstone of this mindset. Tests written after the implementation tend to describe whatever the code already does, while tests written first describe what it is supposed to do, and that difference shows up in the shape of the code: smaller units, cleaner modules, and (of course) more easily testable code.',
      'Valuing fast feedback loops means I push my team to work closely and frequently with those upstream and downstream of us (customers, or teams we are partnering with), rather than discovering an integration problem the week before a deadline.',
      'I believe in investing time in processes to quickly build and maintain a durable and healthy team: chartering a team early so we understand how each of us actually works, and holding retros often enough and (with maximum psychological safety) such that the real problems get acknowledged and resolved.',
    ],
  },
  {
    title: 'Self-organizing teams',
    lede: 'The people closest to the work know how to be most effective.',
    body: [
      'Teams trusted to organize themselves and set their own direction consistently outperform teams waiting to be told. Direction should arrive as context and constraints, not as assignments.',
      'That trust is not a reward for maturity, it is how maturity develops. A team never given the decision never learns to make it well.',
    ],
  },
  {
    title: 'Sustainable delivery',
    lede: 'Engineers are the counterweight to the pull toward deliver, deliver, deliver.',
    body: [
      "Product's instinct to ship is healthy and necessary. Left unchecked it borrows against the system's future, because technical debt is often invisible in any single sprint. Engineers should spot these costs, and making them visible to leadership is part of the job.",
      'The outcome is that the systems keep working as expected, and the team delivers reliably for years rather than impressively for one quarter and fighting fires the next.',
      'Technical debt is unavoidable. The only question is whether it is taken on deliberately and paid down, or accumulated by accident and discovered later.',
    ],
  },
]
