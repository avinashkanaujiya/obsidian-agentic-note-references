import {
	Editor,
	FileSystemAdapter,
	MarkdownView,
	Notice,
	Plugin,
	TFile,
} from "obsidian";
import {
	AgenticNoteReferencesSettingTab,
	DEFAULT_SETTINGS,
	type AgenticNoteReferencesSettings,
} from "./settings";
import { buildCitation } from "./citation";
import { RefModeSuggestModal, type RefModeItem } from "./ref-mode-modal";

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
			// Available whenever a Markdown view is open (editor or reading).
			checkCallback: (checking: boolean) => {
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;

				if (!checking) {
					if (view.getMode() === "preview") {
						// Reading mode: copy the note reference without line numbers.
						void this.copyReadingCitation(view);
					} else {
						// Editor mode: let the user pick a ref mode.
						this.showRefModeModal(view.editor, view);
					}
				}
				return true;
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

	/** Resolves the file display string according to the current pathFormat. */
	private resolveFilename(file: TFile): string {
		switch (this.settings.pathFormat) {
			case "vaultRelative":
				return file.path;
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
				return basePath ? `${basePath}/${file.path}` : file.path;
			}
			case "filename":
			default:
				return file.basename;
		}
	}

	/** Reading mode: directly copies the note reference (no line numbers). */
	private async copyReadingCitation(view: MarkdownView): Promise<void> {
		const file = view.file;
		if (!file) {
			new Notice("No active file.");
			return;
		}

		const filename = this.resolveFilename(file);
		const output = buildCitation(this.settings.readingModeTemplate, {
			filename,
		});

		await this.writeToClipboard(output);
	}

	/**
	 * Editor mode: opens the ref-mode picker, then copies the citation built
	 * from the chosen mode's template.
	 */
	private showRefModeModal(editor: Editor, view: MarkdownView): void {
		const file = view.file;
		if (!file) {
			new Notice("No active file.");
			return;
		}

		const filename = this.resolveFilename(file);
		const fromLine = editor.getCursor("from").line + 1;
		const toLine = editor.getCursor("to").line + 1;

		const allModes: RefModeItem[] = [
			{
				name: "Default",
				template: this.settings.template,
			},
			...this.settings.customRefModes.map((m) => ({
				name: m.name,
				template: m.template,
			})),
		];

		new RefModeSuggestModal(this.app, allModes, async (item) => {
			const output = buildCitation(item.template, {
				filename,
				fromLine,
				toLine,
			});
			await this.writeToClipboard(output);
		}).open();
	}

	private async writeToClipboard(text: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
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
