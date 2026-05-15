export interface CitationContext {
	filename: string;
	/** 1-indexed. Omit in reading mode (no line numbers available). */
	fromLine?: number;
	/** 1-indexed. Omit in reading mode (no line numbers available). */
	toLine?: number;
}

/**
 * Builds a citation string by expanding placeholders in the given template.
 *
 * `\\n` escapes are expanded BEFORE variable substitution so that path
 * separators such as Windows `\notes` are never mistaken for newlines.
 *
 * When `fromLine`/`toLine` are omitted (reading mode), the `{{from}}`,
 * `{{to}}`, and `{{lines}}` placeholders expand to empty strings.
 */
export function buildCitation(template: string, ctx: CitationContext): string {
	const { filename, fromLine, toLine } = ctx;

	const linesText =
		fromLine !== undefined && toLine !== undefined
			? fromLine === toLine
				? `Line ${fromLine}`
				: `Lines ${fromLine}–${toLine}`
			: "";

	return template
		.replace(/\\n/g, "\n") // expand escape sequences first, before substitution
		.replace(/\{\{filename\}\}/g, filename)
		.replace(/\{\{from\}\}/g, fromLine !== undefined ? String(fromLine) : "")
		.replace(/\{\{to\}\}/g, toLine !== undefined ? String(toLine) : "")
		.replace(/\{\{lines\}\}/g, linesText);
}
