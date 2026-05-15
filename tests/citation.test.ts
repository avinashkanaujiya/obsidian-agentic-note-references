import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCitation } from "../src/citation.ts";

test("single-line citation uses 'Line X'", () => {
	const result = buildCitation("{{lines}}", "Note", 5, 5);
	assert.equal(result, "Line 5");
});

test("multi-line citation uses 'Lines X–Y'", () => {
	const result = buildCitation("{{lines}}", "Note", 3, 7);
	assert.equal(result, "Lines 3–7");
});

test("{{filename}} is substituted", () => {
	const result = buildCitation("{{filename}}", "My Note", 1, 1);
	assert.equal(result, "My Note");
});

test("{{from}} and {{to}} are substituted", () => {
	const result = buildCitation("{{from}}-{{to}}", "f", 2, 8);
	assert.equal(result, "2-8");
});

test("\\n in template is expanded to a real newline", () => {
	const result = buildCitation("a\\nb", "f", 1, 1);
	assert.equal(result, "a\nb");
});

test("Windows path containing \\n sequence is not corrupted", () => {
	// "C:\notes\file.md" has a literal backslash-n which the old code
	// would expand to a newline after substitution. With the fix the
	// template escape-expansion runs first, leaving the path intact.
	const windowsPath = "C:\\notes\\file.md";
	const result = buildCitation("{{filename}}", windowsPath, 1, 1);
	assert.equal(result, windowsPath);
});

test("default template renders full citation correctly", () => {
	const template =
		"[[{{filename}}]] — Lines {{from}}–{{to}}\\n\\nHere is the referenced section:";
	const result = buildCitation(template, "My Note", 47, 52);
	assert.equal(
		result,
		"[[My Note]] — Lines 47–52\n\nHere is the referenced section:",
	);
});

test("single-line default template renders with 'Line X'", () => {
	const template = "[[{{filename}}]] — {{lines}}";
	const result = buildCitation(template, "My Note", 5, 5);
	assert.equal(result, "[[My Note]] — Line 5");
});
