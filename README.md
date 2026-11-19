# excalidraw-ai-skill

**What's in the zip:**
- `INSTALL.md`: the install and usage guide.
- `install.ps1`: a one-step installer.
- `excalidraw-diagram/`: the skill itself. It contains `SKILL.md`, the 4 reference files, the 2 scripts and the 3 icon packs (54 icons).

**Install instructions for your coworker (Windows):**
1. Unzip the file anywhere.
2. In PowerShell, from the unzipped folder, run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\install.ps1
   ```
   - Add `-Claude` to also install it for Claude Code.
   - Add `-Force` to replace an older install.
3. Restart VS Code, or start a new Copilot chat.
4. To check it worked, ask Copilot: *"What skills do you have?"* The list should include **excalidraw-diagram**.
