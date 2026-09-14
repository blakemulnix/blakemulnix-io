export interface Principle {
  title: string
  /** Short framing line, set larger than the body. */
  lede: string
  body: string[]
}

export const principles: Principle[] = [
  {
    title: 'Test-driven development',
    lede: 'Tests first, because it is the fastest way I know to keep a design honest.',
    body: [
      'Tests written after the fact tend to describe whatever the code already does. Tests written first describe what it is supposed to do, and that difference shows up in the shape of the code — smaller units, clearer seams, fewer places where behaviour hides.',
      'It is not dogma. It is that I would rather find a design problem in the first ten minutes than in code review, and rather find it in code review than in production.',
    ],
  },
  {
    title: 'Fast feedback loops',
    lede: 'Every hour between making a change and learning whether it worked is an hour spent guessing.',
    body: [
      'In practice that means developer environments that run the whole system, not a convincing subset of it. It means working closely and frequently with the teams upstream and downstream of us, rather than discovering an integration problem the week before a deadline.',
      'It also means the human loops. Chartering a team early so we understand how each of us actually works, and holding retros often enough — and safely enough — that the real problems get named instead of managed around.',
    ],
  },
  {
    title: 'Self-organizing teams',
    lede: 'The people closest to the work make the best decisions about it.',
    body: [
      'Teams trusted to organize themselves and set their own direction consistently outperform teams waiting to be told. Direction should come as context and constraints, not as assignments.',
      'That trust is not a reward for maturity; it is how maturity develops. A team never given the decision never learns to make it well.',
    ],
  },
  {
    title: 'Ownership and stewardship',
    lede: 'Engineering is the counterweight to the pull toward deliver, deliver, deliver.',
    body: [
      "Product's instinct to ship is healthy and necessary. Left unchecked it borrows against the system's future, because that cost is invisible in any single sprint. Engineering is where that cost becomes visible, and saying so is part of the job.",
      'I think of it as stewardship. We maintain something that has to keep working, so that the team can deliver reliably for years rather than impressively for a quarter. The aim is the most value over the long run.',
      'Technical debt is unavoidable — the question is only whether it is taken on deliberately and paid down, or accumulated by accident and discovered later.',
    ],
  },
]
