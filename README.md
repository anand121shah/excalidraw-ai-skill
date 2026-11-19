# 🎨 excalidraw-ai-skill

**An AI agent skill that draws professional, story-driven diagrams in [Excalidraw](https://excalidraw.com) the way a human designer would.**

Give your Copilot or Claude agent a topic, a project file or a set of findings. The agent turns it into a clear, aligned, icon-rich diagram in the VS Code integrated browser. It draws with the real editor tools (mouse, keyboard and the Stats panel), not by injecting JSON. When it finishes, it asks you to rate the result.

> Built from a long hands-on session of drawing, critiquing and refining diagrams. Every mistake from that session became a rule in the skill.

---

## ✨ What it does

| | |
|---|---|
| 📖 **Story first** | Reads your project and writes the narrative (headline, evidence, so-what) before drawing anything. |
| 📐 **Grid first** | Plans a numeric layout spec (columns, gutters, row heights, icon boxes), then places every element exactly with the Stats panel. |
| 🔣 **Shapes over text** | Uses big numbers, mini charts, number circles and 54 bundled icons instead of paragraphs. |
| 🔤 **Fixed type system** | Lilita One for display, Excalifont for sections, Nunito for body text and Comic Shanns for metadata. |
| 🎨 **Semantic palette** | One accent color per idea; green for actions; red only for caveats. |
| ✅ **Fast QA** | Three screenshot checkpoints plus an automatic alignment audit, instead of dozens of checks. |
| 💾 **Safe saving** | Saves versioned `.excalidraw` files and never overwrites your work. |
| ⭐ **Feedback loop** | Asks you for a 1–10 rating and turns your corrections into new rules. |

## 🧭 The workflow (29 steps, 9 phases)

```
A. Open editor ─► B. Tell story ─► C. Design layout ─► D. Prepare canvas ─► E. Draw in passes
                                                                                  │
I. Learn from feedback ◄─ H. Ask for rating ◄─ G. Save & record ◄─ F. QA & fix ◄─┘
```

The drawing passes run in a fixed order: **text → shapes → backgrounds → icons → connectors**.

## 🧩 Templates

| Template | Best for | Status |
|---|---|---|
| Findings grid | 3–4 insights or KPIs leading to recommendations and caveats | ✅ Proven |
| Pipeline / process | Sequential stages and handoffs | ✅ Proven |
| Architecture | Systems, tiers and data movement | 🧪 Not yet tested |
| Timeline / roadmap | Phases and milestones | 🧪 Not yet tested |
| Comparison | Before vs after, option A vs option B | 🧪 Not yet tested |

---

## 📦 Repository contents

```
excalidraw-ai-skill/
├── README.md
├── LICENSE                              GPL-3.0
└── excalidraw-diagram-skill-share/      ← the package to install
    ├── INSTALL.md                       detailed install guide
    ├── install.ps1                      one-step installer (Windows)
    └── excalidraw-diagram/              the skill
        ├── SKILL.md                     entry point: rules + 29-step workflow
        ├── references/
        │   ├── design-system.md         fonts, colors, card anatomy, spacing
        │   ├── templates.md             five layout specs
        │   ├── icon-catalog.md          54 icons by id and meaning
        │   └── editor-mechanics.md      selectors and gotchas
        ├── scripts/
        │   ├── helpers.js               drawing helpers (UI input only)
        │   └── save-scene.ps1           saves versioned .excalidraw files
        └── assets/libraries/            3 icon packs (.excalidrawlib) + previews
```

## 🚀 Install

### Requirements
- Windows with **VS Code** and **GitHub Copilot Chat** (agent mode), with the integrated browser tools enabled. Claude Code is optional.
- Internet access to `https://excalidraw.com`.

### Quick install
```powershell
git clone https://github.com/anand121shah/excalidraw-ai-skill.git
cd excalidraw-ai-skill\excalidraw-diagram-skill-share
powershell -ExecutionPolicy Bypass -File .\install.ps1
```
You can also use **Code → Download ZIP**, unzip it, and run the same command from the `excalidraw-diagram-skill-share` folder.

| Option | Effect |
|---|---|
| *(none)* | Installs to `%USERPROFILE%\.copilot\skills\excalidraw-diagram` |
| `-Claude` | Also installs to `%USERPROFILE%\.claude\skills\excalidraw-diagram` |
| `-Force` | Replaces an existing install |

Then **restart VS Code** or start a new Copilot chat.

> **Why an installer?** The browser needs absolute paths to load the helpers and icon packs. The installer fills the `{{SKILL_DIR}}` placeholders in `SKILL.md` with your own path. To install by hand instead, see [INSTALL.md](excalidraw-diagram-skill-share/INSTALL.md).

### Check the install
Ask Copilot: *"What skills do you have?"* The list should include **excalidraw-diagram**.

## 💬 Usage

Ask in plain language:

```
Open the integrated browser to excalidraw.com and draw the findings
from PROJECT-churn-analysis.md as a diagram.
```
```
Draw our data ingestion pipeline as an Excalidraw diagram using the pipeline template.
```

The agent writes the story, plans the layout, draws the diagram, runs QA, saves `<topic>-v1.excalidraw` to your workspace and asks for your rating. If you fix something by hand on the canvas, tell it. It will read your change and learn from it.

## ⚠️ Notes
- `helpers.js` speeds up drawing, but its styling selectors aren't fully validated against every Excalidraw release. The agent checks styles visually at the first QA checkpoint.
- The agent never clears a canvas with existing work without asking first.
- The icon packs are Fieldnotes-style libraries covering patient journeys, human approval in AI workflows, and disagreement and debate. Icons are chosen by meaning, so a "waiting room" icon can stand for "dormant customers".

## 📄 License
[GPL-3.0](LICENSE)
