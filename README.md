# Agentic Note References

An Obsidian plugin that copies a formatted note reference to the clipboard — ready to paste into any AI agent chat.

## How it works

### Editor mode (Live Preview / Source)

1. Place your cursor on a line, or select a range of lines.
2. Press **Ctrl+Alt+I** (or run *Copy agentic citation* from the command palette).
3. A picker appears — type to filter, arrow keys or mouse to choose:

   - **Default** — built-in; uses the Default citation template from Settings
   - *Custom modes* — any modes you define in Settings, in the order you set

4. The formatted citation is copied to the clipboard.

### Reading mode

Press **Ctrl+Alt+I** while in Reading mode. The note reference is copied directly — no picker, no line numbers.

Default output: `[[My Note]]`

The template is configurable (see [Reading mode template](#reading-mode-template) below).

---

## Settings

Go to **Settings → Agentic Note References**.

### Path format

Controls how `{{filename}}` resolves in every template:

| Option | Example |
|--------|---------|
| File name only *(default)* | `My Note` |
| Relative to vault root | `folder/My Note.md` |
| Absolute filesystem path | `/home/user/vault/folder/My Note.md` |

### Editor mode — Default citation template

The template used by the built-in **Default** mode in the picker.

Default value:
```
[[{{filename}}]] — Lines {{from}}–{{to}}

Here is the referenced section:
```

### Reading mode template

The template used when Ctrl+Alt+I is pressed in Reading mode.

Default value: `[[{{filename}}]]`

### Custom ref modes

Click **Add ref mode** to create a new mode. Each mode has:

- **Name** — shown in the picker list
- **Template** — the text that gets copied

Use the **↑ / ↓** buttons to reorder modes. Their order in Settings is the order they appear in the picker, below the built-in **Default**.

### Template placeholders

| Placeholder | Expands to | Available in |
|-------------|------------|--------------|
| `{{filename}}` | File reference per path format | All modes |
| `{{from}}` | Starting line number (1-indexed) | Editor modes only |
| `{{to}}` | Ending line number (1-indexed) | Editor modes only |
| `{{lines}}` | `Line 5` or `Lines 3–7` | Editor modes only |

In Reading mode, `{{from}}`, `{{to}}`, and `{{lines}}` are not available — use only `{{filename}}`.

Use `\n` for explicit newlines in any template.

---

## Installation

```bash
git clone <repo> ~/.obsidian/plugins/agentic-note-references
cd ~/.obsidian/plugins/agentic-note-references
npm install && npm run build
```

Enable **Agentic Note References** in **Settings → Community Plugins**.

## Development

Build and sync to your vault in one step:

```bash
./sync.sh
```

Options:

```
-n, --no-build      Skip npm build (copy existing main.js)
-v, --vault <path>  Target vault root  (default: ~/obsidian/notes)
-s, --src   <path>  Plugin source dir  (default: ~/github/obsidian-agentic-note-references)
```

After syncing, reload the plugin in Obsidian: **Settings → Community Plugins → toggle off/on**.
