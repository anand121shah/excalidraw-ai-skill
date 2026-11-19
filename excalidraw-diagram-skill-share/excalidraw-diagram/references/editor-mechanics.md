# Editor mechanics, selectors and gotchas

Every item here cost time during the original sessions. `scripts/helpers.js` already handles most of them, so read this when a helper fails or you need to work by hand.

## Coordinates
- The Stats panel (Alt+/) shows **scene** coordinates. Typing X, Y, W, H or F into it is exact at any zoom, so this is the only placement method you should trust.
- Screen = (scene + scroll) × zoom, with scroll and zoom read from `localStorage['excalidraw-state']`. That save is **debounced**, so wait about 500 ms after zooming or panning before reading it (`H.refresh()`).
- Helpers use layout coordinates: scene = layout + origin (`localStorage['dg:origin']`).

## Safe click zone
- The **Stats panel** covers the right side, roughly screen x ≥ viewport − 210. Clicks there hit the panel, not the canvas. Card 4's icon click missed once because of this.
- The **left properties panel** covers about x ≤ 240, y ≤ 640 while a tool or selection is active.
- Keep content inside screen x 270 → viewport−240. Zoom out with Ctrl+Minus (steps of 0.1). `H.setup()` does this.

## Text
- The click point sets the **vertical center of the first line**, not the top. Afterwards, set the exact position with Stats.
- Clicking on existing text **edits** it, and clicking inside a shape **binds** text to the shape. So draw free text before backgrounds, in empty space.
- **Never use Ctrl+Shift+> or <** to resize text: it changes the default size for the next text, and it compounded to 242 px once. Use the Stats **F** field.
- Escape commits text and leaves it selected, which is useful for `put()`.
- Use `keyboard.insertText` for typing, because it's fast and handles Unicode.
- Measure long titles after placing them (`info().w`), because one overflowed its card.

## Fonts
- The quick buttons are "Hand-drawn" (Excalifont, 5), "Normal" (Nunito, 6) and "Code" (Comic Shanns, 8).
- **Lilita One (7)** is only in the font picker: click "Show font picker", then the "Lilita One" button.
- **Never press Escape while the font picker is open**, because it reverts the font (it turned "Beyond Recency" into Helvetica). Close the picker by clicking its toggle again.
- To change fonts on existing text, select the text with the selection tool, not by editing it.

## Colors and properties
- `button[aria-label="Show stroke color picker"]` / `"Show background color picker"` → fill `input.color-picker-input` with the hex **without #** → click the same button to close. Arrows and lines have no background picker.
- Properties are in the `region "Selected shape actions"`, in groups by name ("Stroke width", "Stroke style", "Sloppiness", "Edges", "Font size", "Text align", "Fill") with title buttons.
- Setting a style while a tool is active changes the default for the next element. Set the style first, then draw.

## Selecting
- A marquee that **starts on an element drags it**. Start in empty space, or lock the backgrounds first (Ctrl+Shift+L).
- Clicking a transparent gap inside an icon group misses it. Click its largest filled part.
- Ctrl+A while a text is being edited selects that text only, so press Escape twice and click empty canvas first.
- Shift+click adds to the selection. The align buttons (`Align left`, `Center horizontally`, `Distribute horizontally`, …) appear for 2 or more selected elements.
- Shift+Arrow nudges by 5, Arrow by 1.

## Connectors
- Hold **Ctrl while dragging** so arrows don't bind. Bound arrows drift and reroute when shapes move.
- Draw connectors **last**, after everything else is in its final place.
- Arrow type: "Sharp arrow" (straight). For an exact horizontal or vertical arrow, set W or H in Stats.

## Library and icons
- The library is stored in IndexedDB `excalidraw-library-db` / `excalidraw-library-store` / key `libraryData` → `libraryItems[]`. The ids (`A052-icon-01` …) let you pick by id no matter what order they were imported in.
- The sidebar shows `.library-unit` tiles in that same order. **With a selection active, an extra "add to library" tile appears first and shifts every index**, so deselect first (`offset = tiles − items`).
- Clicking a tile inserts the icon at the viewport center, **selected as a Group**. Fit it immediately with W (and H if the aspect ratio is off), then center it.
- Close the sidebar with "Close" or the Library toggle. **Escape deselects the inserted icon.**
- **Native file pickers are blocked under automation.** Import a library by dropping the file: a hidden `<input type=file>` + `setInputFiles` gives you a File, re-type it as `application/vnd.excalidrawlib+json`, then dispatch dragenter, dragover and drop with a DataTransfer on the canvas.

## Layering
- Send to back: Ctrl+Shift+[ . Bring to front: Ctrl+Shift+] .
- Draw card backgrounds after their content, then send them to the back. Alternatively, draw backgrounds first, lock them, and place the content on top.

## Saving
- Excalidraw keeps the scene in `localStorage['excalidraw']`, but the user wants versioned files on disk.
- To save: Escape, click empty canvas, Ctrl+A, right-click, Copy, read the clipboard (`H.copyAll()` checks the count), then run `scripts/save-scene.ps1 -OutPath … -ExpectedCount n`. The script never overwrites.
- The Stats "Storage" readout once showed 0 b while the data was fine, so ignore it.

## Running code (runPlaywrightCode)
- There is no `require` or `import`. Use `new (async()=>{}).constructor('page', src)(page)` to run helper source stored in `localStorage['dg:helpers']`.
- Batch many actions in one call. Each call has overhead; a full card (about 12 elements) fits in one call.
- Screenshots are the slow part: take at most 3 per diagram, and rely on `H.audit()` and `H.info()` for numeric checks.
