# Agentic Note References

An Obsidian plugin that copies a citation with file link, line numbers, and a custom prompt — ready to paste into any AI agent chat.

## How it works

1. Select text in any note (or just place your cursor on a line).
2. Press **Ctrl+I** (or run the command *Copy agentic citation* from the palette).
3. The plugin copies a formatted citation to your clipboard, e.g.:

   ```
   [[My Note]] — Lines 47–52

   Here is the referenced section:
   ```

4. Paste it into your agent chat. The agent knows exactly which file and lines you mean.

## Customizing the citation

Go to **Settings → Agentic Note References** to edit the citation template.

Available placeholders:

- `{{filename}}` — basename of the note (e.g. `My Note`)
- `{{from}}` — starting line number (1-indexed)
- `{{to}}` — ending line number (1-indexed)
- `{{lines}}` — human-friendly line range (e.g. `Line 5` or `Lines 47–52`)

Use `\n` for explicit newlines in the template.

## Installation

1. Clone or download this repo into your vault's `.obsidian/plugins/agentic-line-refs/` folder.
2. Run `npm install && npm run build`.
3. Enable **Agentic Note References** in Obsidian's Community Plugins settings.
