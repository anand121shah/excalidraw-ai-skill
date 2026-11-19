# Design system

These values come from the casino propensity story v2.2, which the user rated 8/10 and then corrected by hand. The rule behind all of them: **shapes and symbols tell the story, and text only labels it.**

## Typography: four roles, never mixed

| Role | Font (family id) | Size | Color | Used for |
|---|---|---|---|---|
| Display | **Lilita One** (7) | 58 for the title; 64 for big numbers | `#1e1e1e` for the title; the accent color for numbers | Diagram title, KPI and big numbers |
| Card headline | **Lilita One** (7) | 28 | accent | Card and finding titles ("The Signal") |
| Section voice | **Excalifont** (5) | 28 for section and panel titles; 20 for step labels; 26 for numbers in circles | accent or `#1e1e1e` | Section headers, step names, handwritten feel |
| Body | **Nunito** (6) | 20 for the subtitle; 16–18 for body | `#343a40` for body; `#495057` for the subtitle | Explanations, at most 3 lines and about 285 px wide in a card |
| Meta | **Comic Shanns** (8) | 14 | `#868e96` | Tags ("FINDINGS"), axis labels, footer, sources |

- Card titles use Lilita One, not Excalifont. The user corrected this.
- Pill labels use Nunito 16 or Excalifont 20, white on a solid fill.
- Don't use more than about 7 distinct font sizes in one diagram.

## Color: semantic, not decorative

| Meaning | Stroke | Pale fill (cards) | Notes |
|---|---|---|---|
| Finding / stage 1 | `#1971c2` blue | `#e7f1fb` | |
| Finding / stage 2 | `#0c8599` teal | `#e3f6f7` | |
| Finding / stage 3 | `#e8590c` orange (or `#e67700`) | `#fff4e0` | |
| Finding / stage 4 | `#6741d9` violet (or `#7048e8`) | `#f1ecff` | |
| Action / outcome / go | `#2f9e44`, text `#2b8a3e` | `#e9f7ec` | Recommendations, final stage |
| Caveat / risk ONLY | `#e03131`, text `#c92a2a` | `#fff5f5` | Never use red decoratively |
| Connectors / meta | `#868e96` | none | Arrows, drop lines, tags |
| Structure | `#ced4da` / `#adb5bd` | `#f8f9fa` | Panels, dividers, chart axes |
| Text | `#1e1e1e` titles, `#343a40` body, `#495057` muted | | |

- One accent per card or stage, repeated in the circle, title, number, chart marks and pill.
- Cards get a pale fill with an accent stroke (Medium). Pills get a solid accent fill and white text.
- Background `#ffffff`. Sloppiness: **Architect** for structure; Artist is fine for icons, which keep their own style.

## Shapes and symbols before text

- Every card or stage gets a library icon of the same size: an 80 px tall box, at most 110 wide, centered on a fixed point.
- Show numbers as big numbers and mini charts (bars, dots, gauges), not sentences.
- Use number circles (40–56 px, white fill, accent stroke, Excalifont number) to show reading order.
- Connectors: unbound straight arrows, gray `#868e96`, Medium width. Use drop lines plus a converge line to show "these feed into that".
- Emoji: avoid them in body text, because they render inconsistently. Library icons replace them. "→" also renders badly in Nunito body text; write "vs" or "from…to".

## Card anatomy (325 × 430, offsets from the card's top-left)

| Part | Position | Spec |
|---|---|---|
| Number circle | (16,16) | 44×44, white fill, accent stroke; number in Excalifont 26 centered |
| Title | (68,22) | Lilita One 28, accent; must fit width 325−68−16 |
| Big number | (20,75) | Lilita One 64, accent, **left-aligned under the circle** |
| Icon | center (250,112) | 80 h box, max 110 w |
| Body | (20,172) | Nunito 16, `#343a40`, up to 3 lines, max width about 285 |
| Chart zone | y 240–332 | baseline at 332, bars 24–36 wide, labels Comic Shanns 14 at y 339 |
| Pill | (16,372) | 293×44, solid accent, rounded, white bound label |

## Spacing scale

Use 8, 16, 24, 40 (gutter), 60 (gutter with arrows) and 90 (between sections). Pick a value from the scale rather than eyeballing it.
