// Blake Mulnix, CV.
//
// Laid out to echo blakemulnix.io: the same three faces, the same palette, an
// accent rule down the left of every entry, and the technology pills moved
// into a column beside each role rather than stranded in a list at the bottom.
//
// One page, always. Each engagement gets one sentence and its five most
// telling technologies, which is all a skim needs; the site carries the rest.
//
// Content is content.yaml. Nothing below is copy.

#let data = yaml("content.yaml")

// The site's palette. Sand on pine is the site itself, so it runs as a band
// across the header rather than over the whole page, which would be unkind to
// a printer and to anyone reading in a light viewer.
#let pine = rgb("#141d17")
#let sand = rgb("#e7dcc4")
#let moss = rgb("#93b06e")
#let ochre = rgb("#d9a05b")
#let rust = rgb("#d4795c")
#let paper = rgb("#fbf8f0")
#let body = rgb("#1b2a22")
#let muted = rgb("#515c53")
#let faint = rgb("#79827a")
#let hairline = rgb("#ddd6c4")
// Moss and rust hold up on pine but not on paper, so the accents are the same
// hues taken darker for the body of the page.
#let leaf = rgb("#4a6b32")
#let brick = rgb("#a8482c")
// The pills are the one place on the page that gets to be bright: they are
// what a skimming reader scans for. A tint rather than a solid, so five of
// them beside two lines of prose still sit behind the words.
#let panel = paper.darken(3.5%)
// Ochre is too pale to read on paper, so the education label is the same hue
// taken darker, the way leaf and brick are.
#let amber = rgb("#a97b30")
#let chip = rgb("#dbe7ef")
#let chipText = rgb("#2b5a78")

#let serif = "Fraunces"
#let sans = "Inter"
#let mono = "JetBrains Mono"

// One spacing scale, so every gap on the page is a multiple of something
// rather than a number I liked at the time.
#let step = 3.6pt
#let gapRole = step * 2.4
#let gapClient = step * 2.5
#let pillCap = 7

#let margin = 0.56in

// Horizontal margin on the page rather than a pad around the body, so the flow
// is the page's own. The header band bleeds back out to the paper's edge with
// an outset.
// No running footer. It earned nothing, and a viewer that trims the bottom of
// the sheet cut it in half.
#set page(
  paper: "us-letter",
  margin: (x: margin, top: 0pt, bottom: 0.5in),
  fill: paper,
)

#set text(font: sans, size: 9.7pt, fill: body, lang: "en")
#set par(justify: false, leading: 0.58em, spacing: 0.58em)

// Mono, uppercase, tracked out: the site's label voice.
#let tag(content, fill: faint, size: 6.5pt) = text(
  font: mono, size: size, fill: fill, tracking: 0.9pt, weight: 500,
)[#upper(content)]

// Title left, dates hard right, both on one baseline. A grid with bottom
// alignment lines up the boxes rather than the baselines, which left every
// date sitting a point or two off its own heading.
#let heading-row(title, dates, dateSize: 6.5pt) = [
  #title#h(1fr)#tag(dates, size: dateSize)
]

#let pill(name) = box(
  fill: chip,
  radius: 2.5pt,
  inset: (x: 2.9pt, y: 2pt),
  outset: (y: 1pt),
  text(font: mono, size: 5.9pt, fill: chipText)[#name],
)

#let pillGap = 2pt
#let pillColumn = 1.58in

// Capped, and ordered most telling first in content.yaml. Uncapped, a ten
// technology stack ran four rows deep beside two lines of prose, and the row
// took its height from the pills, which is what made the spacing between
// engagements look arbitrary.
//
// First fit rather than the natural line break, which is strictly sequential:
// a wide pill that will not fit forces a break even when a later, narrower one
// would have. First fit lets that later pill fill the gap, so the same set
// packs into fewer rows while the order stays close to the one in the file.
#let pills(items, cap: pillCap) = if items != none {
  set par(leading: 0.62em, spacing: 0.38em)
  context {
    let rows = ()
    for name in items.slice(0, calc.min(items.len(), cap)) {
      let width = measure(pill(name)).width
      let target = none
      for (index, row) in rows.enumerate() {
        if target == none and row.used + pillGap + width <= pillColumn {
          target = index
        }
      }
      if target == none {
        rows.push((used: width, names: (name,)))
      } else {
        let row = rows.at(target)
        rows.at(target) = (used: row.used + pillGap + width, names: row.names + (name,))
      }
    }
    block(width: 100%, stack(
      spacing: 3.9pt,
      ..rows.map(row => align(right, row.names.map(pill).join(h(pillGap)))),
    ))
  }
}

// A faint panel behind a group, so Source Allies and its four clients read as
// one object rather than five siblings. The tint does the grouping that an
// accent rule alone could not once the clients were nested inside it. Every
// section uses it, each with its own accent, the way the site gives each
// section a colour.
#let panelled(accent, body) = block(
  fill: panel,
  stroke: (left: 1.6pt + accent.transparentize(50%)),
  inset: (left: 9pt, right: 8pt, top: 6.5pt, bottom: 6.5pt),
  width: 100%,
  body,
)

#let section(name) = block(above: step * 3.5, below: step * 2.0)[
  #tag(name, fill: brick, size: 7pt)
  #v(3pt)
  #line(length: 100%, stroke: 0.5pt + hairline)
]

// Narrative left, stack right: what I did and what I did it with, side by side.
#let entry-body(narrative, technologies, cap: pillCap) = grid(
  columns: (1fr, 1.58in),
  column-gutter: 12pt,
  align: top,
  narrative,
  pills(technologies, cap: cap),
)

// ─── Header band ──────────────────────────────────────────────────────────────
#block(
  width: 100%,
  fill: pine,
  outset: (x: margin),
  inset: (top: 0.24in, bottom: 0.21in),
)[
  #set text(fill: sand)
  #grid(
    columns: (1fr, 2in),
    column-gutter: 20pt,
    align: (left + bottom, right + bottom),
    [
      #text(font: serif, size: 27pt, weight: 600, tracking: -0.3pt)[#data.name]
      #v(2pt)
      #text(font: serif, size: 11.5pt, style: "italic", fill: moss)[#data.role]
      #v(4pt)
      #text(font: serif, size: 9.8pt)[#data.tagline]
    ],
    // The links are a left aligned stack inside a right aligned column, so the
    // marks line up in a single vertical edge instead of sitting on a ragged
    // right margin. There is room to the left of them either way.
    [
      #let secondary = data.links.filter(item => not item.at("primary", default: false))
      #let site = data.links.find(item => item.at("primary", default: false))

      // The pill spans the column, and the marks sit under its left edge, so
      // the block reads as one object rather than three right aligned scraps.
      // The arrow is the same mark the site uses on its outbound links, in the
      // pill's own dark ink, so the block reads as something to click rather
      // than as a printed string.
      #link(site.url)[#box(
        width: 100%,
        fill: rust,
        radius: 4pt,
        inset: (x: 9pt, y: 5.5pt),
        align(center)[
          #text(font: mono, size: 10.5pt, fill: pine, weight: 700)[#site.label]
          #h(4pt)
          #box(baseline: 1pt, image("../scripts/resume/icons/arrowupright.svg", width: 9pt))
        ],
      )]

      #v(7pt)

      #align(left)[#grid(
        columns: (auto, auto),
        column-gutter: 6pt,
        row-gutter: 5.5pt,
        align: (center + horizon, left + horizon),
        ..secondary
          .map(item => (
            image("../scripts/resume/icons/" + item.icon + ".svg", width: 9.5pt),
            link(item.url)[#text(font: mono, size: 7.6pt, fill: sand.darken(8%))[#item.label]],
          ))
          .flatten()
      )]

      #v(6pt)
      #align(left, tag(data.location, fill: sand.darken(34%), size: 6.6pt))
    ],
  )
]

#v(0.14in)

// The years count is derived, not typed, so it matches the site's own
// CAREER_START_YEAR arithmetic and cannot quietly go stale in January.
#let years = str(datetime.today().year() - data.career_start)
#text(size: 10pt, fill: muted)[#data.summary.replace("{years}", years)]

#section("Experience")

#for (index, role) in data.experience.enumerate() [
  #block(above: if index == 0 { 0pt } else { gapRole }, breakable: false)[
    #panelled(leaf)[
      #heading-row([
        #text(font: serif, size: 12.2pt, weight: 600)[#role.title]
        #text(font: serif, size: 12.2pt, fill: muted, style: "italic")[ at ]
        #text(font: serif, size: 12.2pt, weight: 600, fill: leaf)[#role.company]
      ], role.dates)

      #v(step * 0.7)
      // The role's spine runs longer than a client's five to seven: the block
      // beside it is two lines of prose and otherwise empty space.
      #entry-body(text(fill: muted)[#role.summary], role.at("technologies", default: none), cap: 9)

      #if "clients" in role [
        #v(step * 1.9)
        #tag("Client projects", fill: brick)
        #v(step * 1.2)
        #block(stroke: (left: 1.4pt + brick.transparentize(58%)), inset: (left: 8pt), width: 100%)[
          #for (clientIndex, client) in role.clients.enumerate() [
            #block(above: if clientIndex == 0 { 0pt } else { gapClient }, breakable: false)[
              #heading-row(
                text(font: serif, size: 9.9pt, weight: 600)[#client.name],
                client.dates,
                dateSize: 6.2pt,
              )
              #v(step * 0.45)
              #entry-body(text(size: 9.1pt, fill: muted)[#client.summary], client.technologies)
            ]
          ]
        ]
      ]
    ]
  ]
]

#section("Education & Internships")

// One grid with a row gutter, rather than a block per row. Per row blocks
// collapsed against each other and the three roles ran together.
//
// The degree is the first row rather than a section of its own: one line does
// not earn a rule, and a rule is what every other section here has.
// The degree is the first row rather than a section of its own: one line does
// not earn a rule, and a rule is what every other section here has. It is set
// in the serif the headings use, which is enough to tell it apart from the
// three sans rows under it without a label column breaking the prose.
// heading-row rather than a two column grid, the same as every other dated
// line on the page: a grid aligns the boxes, which left each date sitting a
// point or two off its own row. h(1fr) puts them on one baseline.
#block(below: step * 3.4)[
  #heading-row(
    [#text(font: serif, size: 10.4pt, weight: 600)[#data.education.degree]#text(fill: muted)[, #data.education.school]],
    data.education.dates,
    dateSize: 6.2pt,
  )
]

#for (index, role) in data.earlier.enumerate() [
  #block(above: if index == 0 { 0pt } else { step * 2.3 })[
    #heading-row(
      [#text(weight: 600)[#role.role]#text(fill: muted)[, #role.company. ]#text(fill: faint)[#role.note]],
      role.dates,
      dateSize: 6.2pt,
    )
  ]
]

#section("How I Work")

#let principle-body(principle) = [
  #text(font: serif, size: 9.9pt, weight: 600)[#principle.title]
  #v(step * 0.45)
  #text(size: 8.9pt, fill: muted, style: "italic")[#principle.lede]
]

// A grid row does not stretch its cells to match each other, so the panel
// under a lede that wraps to three lines hung below the other two. Measuring
// the tallest and giving all three that height levels them, and keeps the
// ledes free to be whatever length they need to be.
#let principleGutter = 16pt
// The column width is derived from the page rather than from layout(), which
// claims the whole region and left a blank second page behind it.
#let principleColumn = (8.5in - margin * 2 - principleGutter * 2) / 3
#context {
  let tallest = calc.max(
    ..data.principles.map(principle => measure(
      block(width: principleColumn, principle-body(principle)),
    ).height),
  )
  grid(
    columns: (1fr, 1fr, 1fr),
    column-gutter: principleGutter,
    ..data.principles.map(principle => block(height: tallest, principle-body(principle))),
  )
}