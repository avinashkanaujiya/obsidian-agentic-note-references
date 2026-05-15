import { App, SuggestModal } from "obsidian";

export interface RefModeItem {
	name: string;
	template: string;
}

/**
 * Keyboard-navigable picker shown in editor mode when the user triggers
 * Ctrl+Alt+I. Lists all built-in and custom ref modes.
 */
export class RefModeSuggestModal extends SuggestModal<RefModeItem> {
	private readonly items: RefModeItem[];
	private readonly onChoose: (item: RefModeItem) => void;

	constructor(
		app: App,
		items: RefModeItem[],
		onChoose: (item: RefModeItem) => void,
	) {
		super(app);
		this.items = items;
		this.onChoose = onChoose;
		this.setPlaceholder("Select a ref mode…");
	}

	getSuggestions(query: string): RefModeItem[] {
		const lower = query.toLowerCase();
		return this.items.filter((item) =>
			item.name.toLowerCase().includes(lower),
		);
	}

	renderSuggestion(item: RefModeItem, el: HTMLElement): void {
		el.createEl("div", { text: item.name, cls: "suggestion-title" });
		el.createEl("small", { text: item.template, cls: "suggestion-note" });
	}

	onChooseSuggestion(item: RefModeItem): void {
		this.onChoose(item);
	}
}
