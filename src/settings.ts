import { App, PluginSettingTab, Setting } from "obsidian";
import type AgenticNoteReferencesPlugin from "./main";

export type PathFormat = "filename" | "vaultRelative" | "absolute";

export interface AgenticNoteReferencesSettings {
	template: string;
	pathFormat: PathFormat;
}

export const DEFAULT_SETTINGS: AgenticNoteReferencesSettings = {
	template: "[[{{filename}}]] — Lines {{from}}–{{to}}\n\nHere is the referenced section:",
	pathFormat: "filename",
};

export class AgenticNoteReferencesSettingTab extends PluginSettingTab {
	plugin: AgenticNoteReferencesPlugin;

	constructor(app: App, plugin: AgenticNoteReferencesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Path format")
			.setDesc("Choose how the file path is inserted into the citation.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("filename", "File name only")
					.addOption("vaultRelative", "Relative to vault root")
					.addOption("absolute", "Absolute filesystem path")
					.setValue(this.plugin.settings.pathFormat)
					.onChange(async (value) => {
						this.plugin.settings.pathFormat = value as PathFormat;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Citation template")
			.setDesc(
				"Available placeholders: {{filename}}, {{from}}, {{to}}, {{lines}}. " +
				"{{lines}} expands to 'Lines X–Y'. Use \\n for new lines."
			)
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.template)
					.onChange(async (value) => {
						this.plugin.settings.template = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
