#!/usr/bin/env bash
#
# obsidian-plugin-sync — Build and install an Obsidian plugin into a vault
#
# Usage:
#   obsidian-plugin-sync [--no-build] [--vault <path>]
#
# Defaults:
#   SRC   ~/github/obsidian-agentic-note-references
#   VAULT ~/obsidian/notes
#

set -euo pipefail

# ── ANSI colors ──────────────────────────────────────────────────────────────
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
WHITE='\033[1;37m'

TERM_WIDTH=${COLUMNS:-80}

# ── Helpers ──────────────────────────────────────────────────────────────────

rule() {
    local char="$1" color="$2"
    printf "${color}%*s${RESET}\n" "$TERM_WIDTH" "" | sed "s/ /${char}/g"
}

print_header() {
    rule "─" "$BLUE"
    printf "${CYAN}${BOLD}  %s${RESET}\n" "$1"
    rule "─" "$BLUE"
}

print_step() {
    printf "${WHITE}${BOLD}  → %s${RESET}\n" "$1"
}

print_ok() {
    printf "${GREEN}  ✔ %s${RESET}\n" "$1"
}

print_warn() {
    printf "${YELLOW}  ⚠ %s${RESET}\n" "$1"
}

print_error() {
    printf "${RED}  ✖ %s${RESET}\n" "$1" >&2
}

# ── Defaults ─────────────────────────────────────────────────────────────────

SRC_DIR="$HOME/github/obsidian-agentic-note-references"
VAULT_DIR="$HOME/obsidian/notes"
BUILD=1

# ── Argument parsing ─────────────────────────────────────────────────────────

usage() {
    cat <<EOF
Usage: ${0##*/} [options]

  -n, --no-build      Skip npm build (use existing main.js)
  -v, --vault <path>  Target vault root  (default: $VAULT_DIR)
  -s, --src   <path>  Plugin source dir  (default: $SRC_DIR)
  -h, --help          Show this help

EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)    usage; exit 0 ;;
        -n|--no-build) BUILD=0; shift ;;
        -v|--vault)   VAULT_DIR="${2:?--vault requires a path}"; shift 2 ;;
        -s|--src)     SRC_DIR="${2:?--src requires a path}";   shift 2 ;;
        *) print_error "Unknown option: $1"; usage >&2; exit 1 ;;
    esac
done

# ── Derived paths ─────────────────────────────────────────────────────────────

MANIFEST="$SRC_DIR/manifest.json"

if [[ ! -f "$MANIFEST" ]]; then
    print_error "manifest.json not found: $MANIFEST"
    exit 1
fi

PLUGIN_ID=$(grep '"id"' "$MANIFEST" | head -1 | sed 's/.*"id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
PLUGIN_NAME=$(grep '"name"' "$MANIFEST" | head -1 | sed 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
PLUGIN_VERSION=$(grep '"version"' "$MANIFEST" | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

DEST_DIR="$VAULT_DIR/.obsidian/plugins/$PLUGIN_ID"

# ── Main ──────────────────────────────────────────────────────────────────────

main() {
    print_header "Obsidian Plugin Sync — $PLUGIN_NAME v$PLUGIN_VERSION"

    # Validate source
    if [[ ! -d "$SRC_DIR" ]]; then
        print_error "Source directory not found: $SRC_DIR"
        exit 1
    fi

    # Validate vault
    if [[ ! -d "$VAULT_DIR/.obsidian" ]]; then
        print_error "Not an Obsidian vault: $VAULT_DIR"
        exit 1
    fi

    printf "${DIM}  src  : %s${RESET}\n" "$SRC_DIR"
    printf "${DIM}  dest : %s${RESET}\n" "$DEST_DIR"
    printf "\n"

    # Build
    if [[ $BUILD -eq 1 ]]; then
        print_step "Building plugin…"
        (cd "$SRC_DIR" && npm run build) || {
            print_error "Build failed."
            exit 1
        }
        print_ok "Build succeeded."
    else
        print_warn "Skipping build (--no-build)."
    fi

    # Ensure destination exists
    mkdir -p "$DEST_DIR"

    # Copy artefacts
    print_step "Copying artefacts…"
    local copied=()

    cp "$SRC_DIR/main.js"      "$DEST_DIR/main.js"
    copied+=("main.js")

    cp "$SRC_DIR/manifest.json" "$DEST_DIR/manifest.json"
    copied+=("manifest.json")

    # styles.css is optional
    if [[ -f "$SRC_DIR/styles.css" ]]; then
        cp "$SRC_DIR/styles.css" "$DEST_DIR/styles.css"
        copied+=("styles.css")
    fi

    for f in "${copied[@]}"; do
        print_ok "Copied $f"
    done

    printf "\n"
    rule "─" "$GREEN"
    printf "${GREEN}${BOLD}  ✔ Plugin installed.${RESET}\n"
    printf "${DIM}  Reload the plugin in Obsidian: Settings → Community Plugins → toggle off/on.${RESET}\n"
    rule "─" "$GREEN"
}

main
