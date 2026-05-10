import { App, PluginSettingTab, Setting } from "obsidian";
import type AgenticLineRefsPlugin from "./main";

export interface AgenticLineRefsSettings {
	template: string;
}

export const DEFAULT_SETTINGS: AgenticLineRefsSettings = {
	template: "[[{{filename}}]] — Lines {{from}}–{{to}}\n\nHere is the referenced section:",
};

export class AgenticLineRefsSettingTab extends PluginSettingTab {
	plugin: AgenticLineRefsPlugin;

	constructor(app: App, plugin: AgenticLineRefsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

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
