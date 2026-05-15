import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCitation } from "../src/citation.ts";

test("single-line citation uses 'Line X'", () => {
	const result = buildCitation("{{lines}}", { filename: "Note", fromLine: 5, toLine: 5 });
	assert.equal(result, "Line 5");
});

test("multi-line citation uses 'Lines X–Y'", () => {
	const result = buildCitation("{{lines}}", { filename: "Note", fromLine: 3, toLine: 7 });
	assert.equal(result, "Lines 3–7");
});

test("{{filename}} is substituted", () => {
	const result = buildCitation("{{filename}}", { filename: "My Note", fromLine: 1, toLine: 1 });
	assert.equal(result, "My Note");
});

test("{{from}} and {{to}} are substituted", () => {
	const result = buildCitation("{{from}}-{{to}}", { filename: "f", fromLine: 2, toLine: 8 });
	assert.equal(result, "2-8");
});

test("\\n in template is expanded to a real newline", () => {
	const result = buildCitation("a\\nb", { filename: "f", fromLine: 1, toLine: 1 });
	assert.equal(result, "a\nb");
});

test("Windows path containing \\n sequence is not corrupted", () => {
	// "C:\notes\file.md" has a literal backslash-n which the old code
	// would expand to a newline after substitution. With the fix the
	// template escape-expansion runs first, leaving the path intact.
	const windowsPath = "C:\\notes\\file.md";
	const result = buildCitation("{{filename}}", { filename: windowsPath, fromLine: 1, toLine: 1 });
	assert.equal(result, windowsPath);
});

test("default template renders full citation correctly", () => {
	const template =
		"[[{{filename}}]] — Lines {{from}}–{{to}}\\n\\nHere is the referenced section:";
	const result = buildCitation(template, { filename: "My Note", fromLine: 47, toLine: 52 });
	assert.equal(
		result,
		"[[My Note]] — Lines 47–52\n\nHere is the referenced section:",
	);
});

test("single-line default template renders with 'Line X'", () => {
	const template = "[[{{filename}}]] — {{lines}}";
	const result = buildCitation(template, { filename: "My Note", fromLine: 5, toLine: 5 });
	assert.equal(result, "[[My Note]] — Line 5");
});

// Reading mode: no line numbers
test("reading mode: omitted line numbers produce empty placeholders", () => {
	const result = buildCitation(
		"[[{{filename}}]] {{from}} {{to}} {{lines}}",
		{ filename: "Note" },
	);
	assert.equal(result, "[[Note]]   ");
});

test("reading mode: filename-only template", () => {
	const result = buildCitation("[[{{filename}}]]", { filename: "My Note" });
	assert.equal(result, "[[My Note]]");
});

test("reading mode: \\n expansion works without line numbers", () => {
	const result = buildCitation("[[{{filename}}]]\\n", { filename: "My Note" });
	assert.equal(result, "[[My Note]]\n");
});
