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
    lede: 'Every hour between making a change and learning whether it worked is an hour spent guessing.',
    body: [
      'Test driven development is the cornerstone of this approach. Tests written after the fact tend to describe whatever the code already does, while tests written first describe what it is supposed to do, and that difference shows up in the shape of the code: smaller units, clearer seams, fewer places for behaviour to hide.',
      'It means working closely and frequently with the teams upstream and downstream of us, rather than discovering an integration problem the week before a deadline.',
      'It also means the human loops. Chartering a team early so we understand how each of us actually works, and holding retros often enough and (with maximum psychological safety) that the real problems get named instead of managed around.',
    ],
  },
  {
    title: 'Self-organizing teams',
    lede: 'The people closest to the work make the best decisions about it.',
    body: [
      'Teams trusted to organize themselves and set their own direction consistently outperform teams waiting to be told. Direction should arrive as context and constraints, not as assignments.',
      'That trust is not a reward for maturity, it is how maturity develops. A team never given the decision never learns to make it well.',
    ],
  },
  {
    title: 'Ownership and stewardship',
    lede: 'Engineering is the counterweight to the pull toward deliver, deliver, deliver.',
    body: [
      "Product's instinct to ship is healthy and necessary. Left unchecked it borrows against the system's future, because that cost is invisible in any single sprint. Engineering is where the cost becomes visible, and saying so is part of the job.",
      'I think of it as stewardship. We maintain something that has to keep working, so the team can deliver reliably for years rather than impressively for a quarter. The aim is the most value over the long run.',
      'Technical debt is unavoidable. The only question is whether it is taken on deliberately and paid down, or accumulated by accident and discovered later.',
    ],
  },
]
