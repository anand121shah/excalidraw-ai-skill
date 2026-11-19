# Excalidraw diagram skill: install guide

This skill teaches a Copilot (or Claude) agent to draw professional, story-driven diagrams on excalidraw.com in the VS Code integrated browser. The agent draws by hand with the editor's tools, mouse, keyboard and Stats panel. It uses a fixed design system, three icon packs (54 icons), exact grid alignment and a 3-screenshot QA loop. At the end, it asks you to rate the diagram.

## What's in the package

```
excalidraw-diagram-skill-share/
├── INSTALL.md                  ← this file
├── install.ps1                 ← one-step installer (Windows)
└── excalidraw-diagram/         ← the skill itself
    ├── SKILL.md                ← entry point: rules + 29-step workflow
    ├── references/
    │   ├── design-system.md    ← fonts, colors, card anatomy, spacing
    │   ├── templates.md        ← findings, pipeline, architecture, timeline, comparison
    │   ├── icon-catalog.md     ← all 54 icons by id and meaning
    │   └── editor-mechanics.md ← selectors and gotchas
    ├── scripts/
    │   ├── helpers.js          ← drawing helpers (UI input only)
    │   └── save-scene.ps1      ← saves the drawing to a versioned .excalidraw file
    └── assets/libraries/       ← 3 .excalidrawlib icon packs + previews + catalog.json
```

## Requirements
- Windows with VS Code and GitHub Copilot Chat (agent mode), with the **integrated browser** tools enabled.
- Internet access to `https://excalidraw.com`.
- Optional: Claude Code, if you want the skill there as well.

## Install (recommended)
1. Unzip `excalidraw-diagram-skill-share.zip` anywhere, such as Downloads.
2. Open PowerShell in the unzipped folder and run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\install.ps1
   ```
   - Add `-Claude` to also install into `%USERPROFILE%\.claude\skills`.
   - Add `-Force` to replace an older install.
3. Restart VS Code, or start a new Copilot chat.

The installer copies the skill to `%USERPROFILE%\.copilot\skills\excalidraw-diagram`. It also replaces the `{{SKILL_DIR}}` placeholders in `SKILL.md` with your own absolute path, because the browser needs absolute paths to load the helpers and icon packs.

## Install (manual)
1. Copy the `excalidraw-diagram` folder to `%USERPROFILE%\.copilot\skills\`.
2. Open `SKILL.md` in that folder and replace each placeholder:
   - `{{SKILL_DIR}}` → `C:\Users\<you>\.copilot\skills\excalidraw-diagram`
   - `{{SKILL_DIR_JS}}` → `C:\\Users\\<you>\\.copilot\\skills\\excalidraw-diagram` (double backslashes)
3. Restart VS Code.

## Check that it works
In a new Copilot chat, ask: *"What skills do you have?"* The list should include **excalidraw-diagram**.

## How to use it
Ask in plain language, for example:
- *"Open the integrated browser to excalidraw.com and draw the findings from PROJECT-xyz.md as a diagram."*
- *"Draw our data pipeline as an Excalidraw diagram using the pipeline template."*

The agent will:
1. Write the story.
2. Plan a numeric layout.
3. Load the icon packs, then draw in passes.
4. Run three QA checkpoints.
5. Save a versioned `.excalidraw` file to your workspace.
6. Ask you to rate the diagram from 1 to 10.

If you make fixes by hand on the canvas, tell the agent. It will read your changes and turn them into new rules.

## Notes
- **Templates:** findings and pipeline are proven; architecture, timeline and comparison haven't been tried yet.
- **Helper script:** `helpers.js` speeds up drawing, but its styling selectors aren't fully validated. The agent checks styles visually at the first QA checkpoint.
- **Existing work:** the agent never clears a canvas that has work on it without asking, and never overwrites a saved file.
