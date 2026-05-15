import { Editor, FileSystemAdapter, MarkdownFileInfo, MarkdownView, Notice, Plugin } from "obsidian";
import {
	AgenticNoteReferencesSettingTab,
	DEFAULT_SETTINGS,
	type AgenticNoteReferencesSettings,
} from "./settings";
import { buildCitation } from "./citation";

export default class AgenticNoteReferencesPlugin extends Plugin {
	// Assigned in onload() via loadSettings(); definitely present before any
	// command or setting handler can run.
	settings!: AgenticNoteReferencesSettings;

	async onload() {
		await this.loadSettings();
		console.log("Agentic Note References: loaded");

		this.addCommand({
			id: "copy-agentic-citation",
			name: "Copy agentic citation",
			// editorCallback is synchronous by Obsidian contract; the returned
			// Promise is intentionally ignored — all errors are caught inside
			// copyCitation and surfaced via Notice.
			editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
				void this.copyCitation(editor, ctx);
			},
			hotkeys: [
				{
					modifiers: ["Ctrl", "Alt"],
					key: "i",
				},
			],
		});

		this.addSettingTab(new AgenticNoteReferencesSettingTab(this.app, this));
	}

	onUnload() {
		console.log("Agentic Note References: unloaded");
	}

	async copyCitation(editor: Editor, ctx: MarkdownFileInfo) {
		const file = ctx.file;
		if (!file) {
			new Notice("No active file.");
			return;
		}

		const fromCursor = editor.getCursor("from");
		const toCursor = editor.getCursor("to");

		// Line numbers are 0-indexed; display as 1-indexed.
		const fromLine = fromCursor.line + 1;
		const toLine = toCursor.line + 1;

		let filename: string;
		switch (this.settings.pathFormat) {
			case "vaultRelative":
				filename = file.path;
				break;
			case "absolute": {
				const adapter = this.app.vault.adapter;
				const basePath =
					adapter instanceof FileSystemAdapter
						? adapter.getBasePath()
						: "";
				if (!basePath) {
					new Notice(
						"Absolute path is unavailable on this platform — using vault-relative path.",
					);
				}
				filename = basePath ? `${basePath}/${file.path}` : file.path;
				break;
			}
			case "filename":
			default:
				filename = file.basename;
				break;
		}

		const output = buildCitation(
			this.settings.template,
			filename,
			fromLine,
			toLine,
		);

		try {
			await navigator.clipboard.writeText(output);
			new Notice("Agentic citation copied to clipboard.");
		} catch (err) {
			new Notice("Failed to copy citation to clipboard.");
			console.error("Agentic Note References: clipboard write failed", err);
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
