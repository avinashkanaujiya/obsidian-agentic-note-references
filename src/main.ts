import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import {
	AgenticLineRefsSettingTab,
	DEFAULT_SETTINGS,
	type AgenticLineRefsSettings,
} from "./settings";

export default class AgenticLineRefsPlugin extends Plugin {
	settings: AgenticLineRefsSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "copy-agentic-citation",
			name: "Copy agentic citation",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.copyCitation(editor, view);
			},
			hotkeys: [
				{
					modifiers: ["Ctrl"],
					key: "i",
				},
			],
		});

		this.addSettingTab(new AgenticLineRefsSettingTab(this.app, this));
	}

	async copyCitation(editor: Editor, view: MarkdownView) {
		const file = view.file;
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
				const adapter = file.vault.adapter as any;
				const basePath = adapter.basePath ?? "";
				filename = basePath ? `${basePath}/${file.path}` : file.path;
				break;
			}
			case "filename":
			default:
				filename = file.basename;
				break;
		}
		const linesText =
			fromLine === toLine
				? `Line ${fromLine}`
				: `Lines ${fromLine}–${toLine}`;

		const output = this.settings.template
			.replace(/\{\{filename\}\}/g, filename)
			.replace(/\{\{from\}\}/g, String(fromLine))
			.replace(/\{\{to\}\}/g, String(toLine))
			.replace(/\{\{lines\}\}/g, linesText)
			.replace(/\\n/g, "\n");

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
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
