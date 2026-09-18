// Blake Mulnix, CV.
//
// Laid out to echo blakemulnix.io: the same three typefaces, the same palette,
// the same accent rule down the left of each entry, and the same technology
// pills, moved to a column beside each role rather than under it. Content is
// content.yaml; nothing below is copy.

#let data = yaml("content.yaml")

// The site's palette. Sand on pine is the site itself, so it runs as a band
// across the header rather than the whole page, which would be unkind to a
// printer and to anyone reading in a light viewer.
#let pine = rgb("#141d17")
#let sand = rgb("#e7dcc4")
#let moss = rgb("#93b06e")
#let ochre = rgb("#d9a05b")
#let paper = rgb("#fbf8f0")
#let body = rgb("#1b2a22")
#let muted = rgb("#515c53")
#let faint = rgb("#7d867d")
#let rule = rgb("#ded7c5")
// Moss and rust hold up on pine, but not on paper, so the accents are the same
// hues taken darker for the body of the page.
#let leaf = rgb("#4a6b32")
#let brick = rgb("#a8482c")
#let chipFill = rgb("#eceadb")

#let serif = "Fraunces"
#let sans = "Inter"
#let mono = "JetBrains Mono"

#set page(
  paper: "us-letter",
  margin: (x: 0pt, top: 0pt, bottom: 0.36in),
  fill: paper,
  footer-descent: 0.13in,
  footer: pad(x: 0.55in)[
    #line(length: 100%, stroke: 0.6pt + rgb("#ded7c5"))
    #v(5pt)
    #grid(
      columns: (1fr, auto),
      text(font: "JetBrains Mono", size: 6.4pt, fill: rgb("#7d867d"), tracking: 1.4pt)[
        #upper("The long version, with the photos, at blakemulnix.io")
      ],
      text(font: "JetBrains Mono", size: 6.4pt, fill: rgb("#7d867d"), tracking: 1.4pt)[
        #upper("Updated " + datetime.today().display("[month repr:long] [year]"))
      ],
    )
  ],
)
#set text(font: sans, size: 9.1pt, fill: body, lang: "en")
#set par(justify: false, leading: 0.56em, spacing: 0.56em)

// Mono, uppercase, wide tracking: the site's label voice.
#let tag(content, fill: faint, size: 6.6pt) = text(
  font: mono, size: size, fill: fill, tracking: 1.4pt, weight: 500,
)[#upper(content)]

#let pill(name) = box(
  fill: chipFill, radius: 2.5pt, inset: (x: 3.2pt, y: 2.1pt), outset: (y: 1pt),
  text(font: mono, size: 6.1pt, fill: muted)[#name],
)

#let pills(items) = if items != none {
  set par(leading: 0.58em, spacing: 0.35em)
  items.map(pill).join(h(2.2pt))
}

#let sectionTitle(name) = block(above: 15pt, below: 8pt)[
  #tag(name, fill: brick, size: 7.2pt)
  #v(3.4pt)
  #line(length: 100%, stroke: 0.6pt + rule)
]

// Narrative left, stack right. The whole point of the layout: what I did and
// what I did it with, side by side, rather than the stack orphaned in a list
// at the bottom of the page.
#let entryGrid(narrative, technologies) = grid(
  columns: (1fr, 1.62in), column-gutter: 12pt, align: top,
  narrative, pills(technologies),
)

// ─── Header band ──────────────────────────────────────────────────────────────
#block(width: 100%, fill: pine, inset: (x: 0.55in, top: 0.33in, bottom: 0.3in))[
  #set text(fill: sand)
  #grid(
    columns: (1fr, auto), column-gutter: 18pt, align: (left + bottom, right + bottom),
    [
      #text(font: serif, size: 27pt, weight: 600, tracking: -0.3pt)[#data.name]
      #v(1.5pt)
      #text(font: serif, size: 11.5pt, style: "italic", fill: moss)[#data.role]
      #v(4pt)
      #text(font: serif, size: 9.6pt, fill: sand.lighten(4%))[#data.tagline]
    ],
    [
      #set text(font: mono, size: 7.1pt, fill: sand.darken(12%))
      #for item in data.links [
        #link(item.url)[#text(
          fill: if item.label == "blakemulnix.io" { ochre } else { sand.darken(10%) },
        )[#item.label]]
        #linebreak()
      ]
      #tag(data.location, fill: sand.darken(28%), size: 6.6pt)
    ],
  )
]

#pad(x: 0.55in, top: 0.27in, bottom: 0.1in)[

  #text(size: 9.8pt, fill: muted)[#data.summary]

  #sectionTitle("Experience")

  #for (index, role) in data.experience.enumerate() [
    #block(above: if index == 0 { 0pt } else { 13.5pt }, breakable: false)[
      // Accent rule down the left, as on the site.
      #block(
        stroke: (left: 1.6pt + leaf.transparentize(50%)),
        inset: (left: 9pt),
        width: 100%,
      )[
          #grid(
            columns: (1fr, auto), align: (left + bottom, right + bottom),
            [
              #text(font: serif, size: 12.2pt, weight: 600)[#role.title]
              #text(font: serif, size: 12.2pt, fill: muted, style: "italic")[ at ]
              #text(font: serif, size: 12.2pt, weight: 600, fill: leaf)[#role.company]
            ],
            tag(role.dates),
          )
          #v(2.6pt)
          #entryGrid(text(fill: muted)[#role.summary], role.at("technologies", default: none))

          #if "clients" in role [
            #v(6.5pt)
            #tag("Client projects", fill: brick)
            #v(4.5pt)
            #block(
              stroke: (left: 1.4pt + brick.transparentize(58%)),
              inset: (left: 8pt),
              width: 100%,
            )[
              #for (clientIndex, client) in role.clients.enumerate() [
                  #block(above: if clientIndex == 0 { 0pt } else { 8.5pt }, breakable: false)[
                    #grid(
                      columns: (1fr, auto), align: (left + bottom, right + bottom),
                      text(font: serif, size: 9.8pt, weight: 600)[#client.name],
                      tag(client.dates, size: 6.2pt),
                    )
                    #v(2pt)
                    #entryGrid(text(size: 8.8pt, fill: muted)[#client.summary], client.technologies)
                  ]
              ]
            ]
          ]
      ]
    ]
  ]

  #sectionTitle("Earlier")

  #for role in data.earlier [
    #block(above: 4.5pt)[
      #grid(
        columns: (1fr, auto), column-gutter: 10pt, align: (left + top, right + top),
        [#text(weight: 600)[#role.role]#text(fill: muted)[, #role.company. ]#text(fill: faint)[#role.note]],
        tag(role.dates, size: 6.2pt),
      )
    ]
  ]

  #sectionTitle("How I Work")

  #grid(
    columns: (1fr, 1fr, 1fr), column-gutter: 15pt,
    ..data.principles.map(principle => [
      #text(font: serif, size: 9.9pt, weight: 600)[#principle.title]
      #v(1.6pt)
      #text(size: 8.6pt, fill: muted, style: "italic")[#principle.lede]
    ])
  )

]
