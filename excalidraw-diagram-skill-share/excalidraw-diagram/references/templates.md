# Templates (layout coordinates, where (0,0) is the diagram's top-left)

Choose one, copy its spec into the plan, then fill in the content. Every template shares the **header**:

| Element | Position | Spec |
|---|---|---|
| Title | x 0, y 0 | Lilita One 58, `#1e1e1e` |
| Tag pill (optional) | right edge = W, y 14 | Comic Shanns 14 text in a rounded `#868e96` outline box |
| Subtitle | x 0, y 80 | Nunito 20, `#495057`, one line |
| Section tag | x 0, y 140 | Comic Shanns 14, `#868e96`, uppercase ("FINDINGS") |

Content starts at y 170. Footer: Comic Shanns 14 `#868e96` at x 0, 40 below the last content.

---

## 1. Findings grid (PROVEN: v2.2, rated 8/10)

Use for N findings, KPIs or insights that lead to recommendations. W = 1420.

- **Row 1 cards:** 4 × 325 wide, 40 gutter → x = 0, 365, 730, 1095; y 206, h 430. Anatomy in [design-system.md](design-system.md).
  - 3 cards: 3 × 446 with 41 gutter (keep W = 1420).
- **Connectors:**
  - Drop line from each card's bottom center (cx = x + 162.5), y 636 → 664.
  - Horizontal converge line at y 664 from the first to the last card center.
  - Arrows down from the converge line at the row-2 panel centers (x 345 and 1075), y 666 → 706.
- **Row 2:** 2 panels of 690 × 240 at x 0 and 730, y 710.
  - Left panel = "What to do" (green): section title Excalifont 28 at (20,20); 3 step circles centered at x 115/345/575 (y 830, d 70) with icons; labels Excalifont 20 below; arrows between circles at y 830.
  - Right panel = "Caveats" (red): title, a list in Nunito 20 at (20,84), and an icon centered at (585, 846).
- **Footer:** y 970.

## 2. Pipeline / process flow (PROVEN STYLE: campaign canvas reference)

Use for N sequential stages, from data flow through to handoff. Stage width S = 300, gutter G = 80 with an arrow in it.

- W = N·S + (N−1)·G (for example, 5 stages → 1820; 4 stages → 1440).
- **Stage card** at x = i·(S+G), y 206, h 360, accent per stage (blue, teal, orange, violet, green):

  | Part | Position (card-relative) | Spec |
  |---|---|---|
  | Number circle | (16,16) | d 44 |
  | Title | (72,24) | Excalifont 26, accent |
  | Icon | center (150,140) | 80 h box, max 110 w |
  | Body | (20,206) | Nunito 16, up to 2 lines |
  | Output pill | (20,292) | (S−40)×44, solid accent, white label |

- **Arrows** at y = 206+180 = 386, from x = i·(S+G)+S+12 to (i+1)·(S+G)−12. Unbound, gray, Medium.
- **Optional bottom lane:** y 606, full width × 120, `#f8f9fa` fill, `#ced4da` stroke, Excalifont 22 title, used for owners, tools or controls. Optional dashed final stage = "future or out of scope".

## 3. Architecture / system (UNPROVEN: verify with an extra screenshot)

Use for components and data movement between them.

- **Columns** = tiers (sources → processing → storage → consumers): 4 columns of 300 with 100 gutters. W = 1500.
- **Tier header:** Excalifont 26 at the column's top, y 206, with a thin `#ced4da` underline at y 246.
- **Component:** a 260 × 110 rounded box centered in its column, with a 56 px icon on the left (center x+48), a Lilita One 22 name and a Comic Shanns 14 tech label. Stack them every 140 px from y 270.
- **Connectors:** horizontal arrows between box edges, with labels in Comic Shanns 14 above the arrow midpoint. Dashed means async or optional.
- **Boundary:** a dashed `#adb5bd` rectangle with a 24 px pad around the components of one platform, and a tag in its top-left corner.

## 4. Timeline / roadmap (UNPROVEN)

Use for phases, milestones and dated events.

- **Axis:** a horizontal line at y 420, `#868e96` Bold, x 0 → W (W = 1420).
- **Milestones:** evenly spaced, cx = 70 + i·(W−140)/(N−1). Each is a 28 px accent dot on the axis, with the date in Comic Shanns 14 below it at y 448.
- **Cards** alternate above and below the axis: 260 × 150, centered on cx. Above: y 220, with a stem from 370 to 406. Below: y 470, with a stem from 434 to 470.
- **Card contents:** icon 56 h at top-left, title Lilita One 24, 2 lines of Nunito 16.
- **Phase bands:** pale fills behind the axis spans, y 400–440, sent to the back.

## 5. Comparison / before-after (UNPROVEN)

Use for comparing options or showing a current versus target state.

- **Columns:** 2 (or 3) of 660 with a 100 gutter; the gutter holds a big "vs" or a right arrow in a 64 px circle. W = 1420.
- **Column header:** a solid accent band 660 × 72 with a white Lilita One 32 bound label (gray `#868e96` for "before", green for "after").
- **Rows:** shared row lines every 110 px from y 300. Each row has a 56 px icon at x+40 and Nunito 18 text at x+96. Use the same row order on both sides.
- **Verdict strip:** full width at the bottom, 1420 × 90, pale green, with Excalifont 26 centered.
