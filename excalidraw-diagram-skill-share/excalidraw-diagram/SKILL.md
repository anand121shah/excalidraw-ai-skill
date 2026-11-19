---
name: excalidraw-diagram
description: Draw professional, story-driven diagrams on excalidraw.com in the integrated browser, drawing by hand the way a human designer would (tools, mouse, keyboard, Stats panel) with the user's icon packs, a fixed design system (Lilita One / Excalifont / Nunito / Comic Shanns, semantic palette), exact grid alignment and a fast QA loop. Use when asked to draw, sketch, visualize or diagram something in Excalidraw (findings, pipeline, process, architecture, roadmap/timeline, comparison), to turn a project story or dossier into a diagram, or to fix the alignment or aesthetics of an Excalidraw drawing.
argument-hint: "<topic or PROJECT-*.md> [template: findings|pipeline|architecture|timeline|comparison]"
---

# Excalidraw diagram skill

Draw expressive, aligned and **shape-first** diagrams in excalidraw.com, through the integrated browser, the way a human would. Target time: **5–8 minutes** for a 150–250 element diagram, compared with 24 minutes for the first unguided attempt.

Skill folder: `{{SKILL_DIR}}`

| File | Purpose |
|---|---|
| [scripts/helpers.js](scripts/helpers.js) | Drawing helper library (`H.*`), all through UI input |
| [scripts/save-scene.ps1](scripts/save-scene.ps1) | Writes the copied scene to a versioned `.excalidraw` file |
| [references/design-system.md](references/design-system.md) | Fonts, colors, card anatomy, spacing. **Read it every time.** |
| [references/templates.md](references/templates.md) | Five layout specs in layout coordinates |
| [references/icon-catalog.md](references/icon-catalog.md) | All 54 icons with id and meaning |
| [references/editor-mechanics.md](references/editor-mechanics.md) | Selectors and gotchas; read it when something misbehaves |
| `assets/libraries/*.excalidrawlib` | Icon packs A052, B004, C015 |

## Hard rules
1. **Draw by hand only.** Use editor tools, clicks, keys and Stats fields. Never inject element JSON into the scene or localStorage.
2. **Shapes and symbols over text.** Every card or stage has an icon; numbers become big numbers or mini charts; sentences are 3 lines at most.
3. **Four type roles:** Lilita One for the display title, big numbers and card titles; Excalifont for sections, steps and circle numbers; Nunito for body text; Comic Shanns for meta. **Use only the palette** in design-system.md, and keep red for caveats.
4. **The grid comes first.** Write a numeric layout spec before drawing, and place every element exactly with the Stats panel (`H.put`). Never eyeball positions.
5. **Load the icon libraries before drawing.**
6. **QA budget: 3 screenshots** (typography, layout plus icons, final) and `H.audit()` before each one. No per-element screenshots.
7. **Never overwrite** a saved diagram. Save `-v2`, `-v2.1`, and so on. Never clear a non-empty canvas until it is saved or the user agrees.
8. **Work only on the diagram the user requested.** Do not create a separate example or test drawing just to validate the skill.

## Workflow: end to end (follow every step in order)

Phases: **A** open the editor, **B** tell the story, **C** design the layout, **D** prepare the canvas, **E** draw, **F** check and fix, **G** save and record, **H** hand over and ask for a rating, **I** learn from feedback.

### A. Open the editor
1. **Open the integrated browser at `https://excalidraw.com`** (openBrowserPage). If an Excalidraw page is already open, reuse it instead of opening another one.
2. **Check what's already on the canvas.** Count the non-deleted elements in `localStorage['excalidraw']`. If the canvas isn't empty, **ask the user** whether to save it first (step 23) or start a new drawing. Never clear existing work without consent.

### B. Tell the story first (in chat, before drawing)
3. **Read the source.** Scan the project from the workspace root and read the relevant `PROJECT-*.md`, notes and results. Don't invent numbers.
4. **Write the story** in chat: a title, a one-line takeaway, 3–5 beats (each with one number and one "so what"), actions, caveats and a source line.
5. **Confirm the story** with the user if the topic, audience or scope is unclear. Otherwise, state your assumptions and continue.

### C. Design the layout (in chat, numbers only)
6. **Read [design-system.md](references/design-system.md)**, which covers fonts, colors, card anatomy and spacing.
7. **Pick a template** from [templates.md](references/templates.md): findings, pipeline, architecture, timeline or comparison. Map each beat to a card or stage.
8. **Pick one accent color and one icon per beat** from [icon-catalog.md](references/icon-catalog.md). Choose icons by meaning, not by pack title.
9. **Write the layout spec:**
   - W and H, columns, gutters and row y values.
   - Card size, an 80 px icon box, chart baselines and connector paths.
   - The exact text for every label.
   - Check that the text fits: Lilita One 28 is about 15 px per character.

### D. Prepare the canvas
10. **Bootstrap the helpers** once per page, and again after editing `helpers.js`:
```js
await page.evaluate(()=>{const i=document.createElement('input');i.type='file';i.id='dg-boot';i.style.display='none';document.body.appendChild(i);});
await page.locator('#dg-boot').setInputFiles('{{SKILL_DIR_JS}}\\scripts\\helpers.js');
await page.evaluate(async()=>{const i=document.getElementById('dg-boot');localStorage.setItem('dg:helpers',await i.files[0].text());i.remove();});
```
   Start every later runPlaywrightCode call with:
```js
const H = await new (async()=>{}).constructor('page', await page.evaluate(()=>localStorage.getItem('dg:helpers')))(page);
```
   The helpers save time but don't replace checking the editor. Their styling selectors aren't fully validated, so confirm the styles visually at the first QA checkpoint.
11. **Load the icon libraries before drawing anything.** Packs that are already loaded are skipped.
12. **Set up the canvas:** zoom so the layout fits the safe click zone, fix the origin, and open the Stats panel (Alt+/).
```js
const D='{{SKILL_DIR_JS}}\\assets\\libraries\\';
const lib = await H.loadLibraries([D+'A052-patient-appointment-journey-v1.0.excalidrawlib', D+'B004-human-approval-in-ai-workflows-v1.0.excalidrawlib', D+'C015-disagreement-and-debate-v1.0.excalidrawlib']);
const s = await H.setup({W:1420, H:1000});   // pass clear:true only after the user agrees (step 2)
return {lib, s};
```
   **Don't pan or zoom while drawing.** If you must, call `H.refresh()` afterwards.
13. **Start the timer** (`Date.now()`) so you can report how long the drawing took.

### E. Draw by hand, in passes (batch one card or section per call)
14. **Text pass:** title, subtitle, tags, card titles, big numbers and body text, placed on empty canvas with exact F, X and Y.
    `await H.text('The Signal',{x, y, size:28, font:'Lilita One', color:'#1971c2'})`
15. **Shapes pass:** number circles, chart bars or dots, and pills, with bound labels added through `H.label`.
16. **Backgrounds pass:** cards and panels, each followed straight away by `H.toBack()`.
17. **Icon pass:** `H.icon(id,{cx,cy})`. Fit each icon to its 80 px box as soon as it's inserted.
18. **Connector pass:** unbound lines and arrows, drawn last.

### F. Check and fix (3 screenshots at most)
19. **QA checkpoint 1**, after the text and shapes passes: run `H.audit()`, then `H.shot()` and one screenshot. Check typography, hierarchy and colors.
20. **QA checkpoint 2**, after icons and connectors: run `H.audit()`, then one screenshot. Check balance, symmetry, equal gaps and icon size parity.
21. **Fix every finding** with `H.sel` and `H.put`, or `H.align`, then go through the polish checklist:
    - Big numbers sit **under** the number circles, left-aligned with them.
    - Card titles are **Lilita One 28**.
    - All icons are the same height and centered on the same line.
    - Charts share one baseline, and the arrows between steps are the same length.
    - No text overflows its box, and the header tag is right-aligned to the grid.
    - Red is used only for caveats.
22. **QA checkpoint 3 (final):** run `H.audit()` again, which should report nothing, then take the final screenshot.

### G. Save and record
23. **Save a new version** and never overwrite:
```js
return await H.copyAll();   // {type:'excalidraw/clipboard', n, sceneTotal, ok:true}
```
```powershell
powershell -File {{SKILL_DIR}}\scripts\save-scene.ps1 -OutPath "<workspace>\<slug>-v1.excalidraw" -ExpectedCount <n>
```
24. **Update the topic's `PROJECT-*.md`:** checkpoint, milestone, and decision-log entries for any style choices. Register the saved file as an artifact.

### H. Hand over and ask for a rating
25. **Report briefly:** the file path, element count, time taken, template used, and any known weak spots.
26. **Ask the user to rate the diagram** with the ask_user tool. Use a 1–10 rating field plus a free-text field for "What should change?", and offer to make another round of edits.

### I. Learn from the feedback
27. **If the user edited the canvas by hand,** take one screenshot and read the scene to find exactly what they changed: positions, fonts and sizes.
28. **Apply the requested edits** and save as the next version (`-v1.1`, …). Then repeat steps 25–26.
29. **Turn each correction into a permanent rule.** Add a row to "Mistakes already made" below, update [design-system.md](references/design-system.md) or [templates.md](references/templates.md), and note it in the project's decision log.
## Helper cheat-sheet (layout coordinates)
| Call | Does |
|---|---|
| `H.text(str,{x\|cx\|right, y\|cy, size, font, color, align})` | Free text, exact F and position |
| `H.rect(x,y,w,h,style)`, `H.ellipse`, `H.circle(cx,cy,d,style)` | Shapes, exact box |
| `H.line(x1,y1,x2,y2,style)`, `H.arrow(...)` | Unbound connectors |
| `H.label(x,y,str,{color,font})` | Bound centered text inside the shape at (x,y) |
| `H.icon(id,{cx,cy},{h:80,w:110})` | Library icon, fitted and centered |
| `H.sel(x,y,{shift})`, `H.marquee(x1,y1,x2,y2)` | Select (start the marquee in empty space) |
| `H.info()`, `H.put({...})`, `H.place({...})`, `H.move(dx,dy)`, `H.align(name)` | Measure and position the selection |
| `H.style({stroke,bg,fill,width,dash,rough,edges,arrow,font,preset,align})` | Properties on the selection or the next element |
| `H.toBack()`, `H.lock()` | Layering |
| `H.audit(tol)`, `H.items()`, `H.shot()`, `H.copyAll()` | QA and save |

## Mistakes already made (don't repeat them)
| Mistake | Rule |
|---|---|
| 24 minutes, with a screenshot after nearly every step | 3 screenshots plus `audit()`; batch actions per call |
| Text-heavy, generic fonts and colors | Four type roles, semantic palette, an icon per beat |
| Icons loaded mid-drawing | Load libraries in step 2 |
| Eyeballed positions, ragged edges | Layout spec, then Stats placement for everything |
| Icons of different sizes | `H.icon` fits them all to the same 80 px box |
| Big number beside the circle | Big number **below** the circle, left-aligned with it (Lilita One 64) |
| Card titles in Excalifont | Card titles in **Lilita One 28** |
| Escape with the font picker open, reverting the font | Close the picker with its toggle |
| Ctrl+Shift+> for size, compounding to 242 | Stats F field |
| Clicks under the Stats or properties panel missed | `setup()` safe zone; don't pan |
| Bound arrows drifted after moves | Unbound arrows, drawn last |
| Marquee dragged a text | Start the marquee in empty space, or lock backgrounds |
| Title overflowed its card | Check `info().w` against the card width |
| "→" glyph rendered badly | Write "vs" or "from…to" |
| Library tile index shifted by one | Deselect before inserting (the helper handles it) |
| Started a separate test drawing nobody asked for | Draw only the requested diagram; the skill itself needs no demo drawing |
| Finished without asking for feedback | Always end with step 26 (rating 1–10 plus what should change) |
