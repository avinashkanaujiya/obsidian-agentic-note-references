# Agentic Note References

An Obsidian plugin that copies a citation with file link, line numbers, and a custom prompt — ready to paste into any AI agent chat.

## How it works

### Editor mode

1. Place your cursor (or select a range) in any note.
2. Press **Ctrl+Alt+I** (or run *Copy agentic citation* from the command palette).
3. A picker appears listing all available ref modes:

   | Mode | What gets copied |
   |------|-----------------|
   | **Reference Note** | Just the file link, e.g. `[[My Note]]` |
   | **Default** | File link + line range + prompt (configurable) |
   | *Custom modes* | Whatever you define in Settings |

4. Select a mode and the citation is copied to the clipboard.

### Reading mode

Press **Ctrl+Alt+I** while in Reading mode. The note reference is copied directly — no picker, no line numbers:

```
[[My Note]]
```

The reading mode template is configurable in Settings.

## Settings

Go to **Settings → Agentic Note References**.

### Path format

Applies to all modes and both reading/editor mode:

- **File name only** (default) — `My Note`
- **Relative to vault root** — `folder/My Note.md`
- **Absolute filesystem path** — `/home/user/vault/folder/My Note.md`

### Editor mode — Default citation template

Template used by the built-in **Default** mode in the editor picker.

Default:
```
[[{{filename}}]] — Lines {{from}}–{{to}}

Here is the referenced section:
```

### Reading mode template

Template used when Ctrl+Alt+I is pressed in Reading mode.

Default: `[[{{filename}}]]`

### Custom ref modes

Add as many ref modes as you like. Each mode has a **name** (shown in the picker) and a **template**.

#### Template placeholders

| Placeholder | Description | Available in |
|-------------|-------------|-------------|
| `{{filename}}` | File reference per path format | All modes |
| `{{from}}` | Starting line number (1-indexed) | Editor mode only |
| `{{to}}` | Ending line number (1-indexed) | Editor mode only |
| `{{lines}}` | Human-friendly range, e.g. `Line 5` or `Lines 3–7` | Editor mode only |

Use `\n` for explicit newlines in templates.

## Installation

1. Clone or download this repo into your vault's `.obsidian/plugins/agentic-note-references/` folder.
2. Run `npm install && npm run build`.
3. Enable **Agentic Note References** in Obsidian's Community Plugins settings.
