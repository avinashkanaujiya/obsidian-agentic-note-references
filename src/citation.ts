/**
 * Builds a citation string by expanding placeholders in the given template.
 *
 * `\\n` escapes are expanded BEFORE variable substitution so that path
 * separators such as Windows `\notes` are never mistaken for newlines.
 */
export function buildCitation(
	template: string,
	filename: string,
	fromLine: number,
	toLine: number,
): string {
	const linesText =
		fromLine === toLine
			? `Line ${fromLine}`
			: `Lines ${fromLine}–${toLine}`;

	return template
		.replace(/\\n/g, "\n") // expand escape sequences first, before substitution
		.replace(/\{\{filename\}\}/g, filename)
		.replace(/\{\{from\}\}/g, String(fromLine))
		.replace(/\{\{to\}\}/g, String(toLine))
		.replace(/\{\{lines\}\}/g, linesText);
}
