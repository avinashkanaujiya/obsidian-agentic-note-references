#!/usr/bin/env node
/**
 * Version bump script — run via `npm version <patch|minor|major>`.
 *
 * npm sets npm_package_version to the NEW version before running the
 * "version" lifecycle hook.  This script syncs manifest.json and
 * versions.json to match, then `git add` in the npm script stages them
 * alongside the automatic package.json bump.
 */

import { readFileSync, writeFileSync } from "node:fs";

const newVersion = process.env.npm_package_version;
if (!newVersion) {
	console.error(
		"version-bump.mjs: npm_package_version is not set.\n" +
		"Run this via `npm version patch|minor|major`.",
	);
	process.exit(1);
}

// ── manifest.json ──────────────────────────────────────────────────────────
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = newVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t") + "\n");
console.log(`manifest.json  → ${newVersion}`);

// ── versions.json ──────────────────────────────────────────────────────────
const versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[newVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t") + "\n");
console.log(`versions.json  → added "${newVersion}": "${minAppVersion}"`);
