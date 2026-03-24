#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
# sync-emails.sh
# Automates ProtonMail email export and syncs
# new emails into the project data directory.
# ──────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_EMAILS_DIR="$SCRIPT_DIR/data/emails"
EXPORT_DIR="$SCRIPT_DIR/.export-tmp"

# ── Credentials (set via env vars or .env file) ──
ENV_FILE="$SCRIPT_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
    # shellcheck source=/dev/null
    source "$ENV_FILE"
fi

PROTON_USER="${PROTON_USER:?Set PROTON_USER in .env or environment}"
PROTON_PASS="${PROTON_PASS:?Set PROTON_PASS in .env or environment}"
PROTON_2FA="${PROTON_2FA:-}"          # optional, leave empty if not using 2FA
PROTON_MAILBOX_PASS="${PROTON_MAILBOX_PASS:-}"  # optional

# ── Auto-install proton-mail-export-cli if missing ──
BIN_DIR="$SCRIPT_DIR/.bin"
EXPORT_CLI="${PROTON_EXPORT_CLI:-}"

if [[ -z "$EXPORT_CLI" ]]; then
    # Check PATH first, then local .bin
    if command -v proton-mail-export-cli &>/dev/null; then
        EXPORT_CLI="proton-mail-export-cli"
    elif [[ -x "$BIN_DIR/proton-mail-export-cli" ]]; then
        EXPORT_CLI="$BIN_DIR/proton-mail-export-cli"
    fi
fi

if [[ -z "$EXPORT_CLI" ]] || ! command -v "$EXPORT_CLI" &>/dev/null && [[ ! -x "$EXPORT_CLI" ]]; then
    echo "==> proton-mail-export-cli not found. Downloading..."
    mkdir -p "$BIN_DIR"

    PLATFORM="$(uname -s)"
    case "$PLATFORM" in
        Darwin) ASSET="proton-mail-export-cli-macos.zip" ;;
        Linux)  ASSET="proton-mail-export-cli-linux_x86_64.tar.gz" ;;
        *)      echo "ERROR: Unsupported platform: $PLATFORM"; exit 1 ;;
    esac

    DOWNLOAD_URL="https://github.com/ProtonMail/proton-mail-export/releases/latest/download/$ASSET"
    TEMP_ARCHIVE="$BIN_DIR/$ASSET"

    echo "    Downloading from $DOWNLOAD_URL"
    curl -fSL -o "$TEMP_ARCHIVE" "$DOWNLOAD_URL"

    echo "    Extracting..."
    case "$ASSET" in
        *.zip)    unzip -o -q "$TEMP_ARCHIVE" -d "$BIN_DIR" ;;
        *.tar.gz) tar -xzf "$TEMP_ARCHIVE" -C "$BIN_DIR" ;;
    esac
    rm -f "$TEMP_ARCHIVE"

    # Find the binary and its dylib (might be nested in a folder or .app bundle)
    FOUND_CLI=$(find "$BIN_DIR" -name "proton-mail-export-cli" -type f 2>/dev/null | head -1)
    FOUND_DYLIB=$(find "$BIN_DIR" -name "proton-mail-export.dylib" -type f 2>/dev/null | head -1)

    if [[ -z "$FOUND_CLI" ]]; then
        echo "ERROR: Could not find proton-mail-export-cli after extraction."
        echo "Contents of $BIN_DIR:"
        ls -laR "$BIN_DIR"
        exit 1
    fi

    chmod +x "$FOUND_CLI"
    # Move binary to top-level .bin if nested
    if [[ "$FOUND_CLI" != "$BIN_DIR/proton-mail-export-cli" ]]; then
        mv "$FOUND_CLI" "$BIN_DIR/proton-mail-export-cli"
    fi
    # Copy dylib next to binary (required by @loader_path)
    if [[ -n "$FOUND_DYLIB" && "$FOUND_DYLIB" != "$BIN_DIR/proton-mail-export.dylib" ]]; then
        cp "$FOUND_DYLIB" "$BIN_DIR/proton-mail-export.dylib"
    fi

    EXPORT_CLI="$BIN_DIR/proton-mail-export-cli"
    echo "==> Installed to $EXPORT_CLI"
fi

if ! command -v expect &>/dev/null; then
    echo "ERROR: 'expect' is required. Install with: brew install expect"
    exit 1
fi

# ── Clean up previous temp export ──
rm -rf "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR"

echo "==> Exporting emails from ProtonMail..."

# Write expect script to a temp file (avoids quoting issues with -c)
EXPECT_FILE=$(mktemp /tmp/proton-export-XXXXXX)
trap 'rm -f "$EXPECT_FILE"' EXIT

cat > "$EXPECT_FILE" <<EXPECT_EOF
#!/usr/bin/expect -f
set timeout 7200
log_user 1

spawn "$EXPORT_CLI"

# Wait for Username: prompt (appears after version check)
expect "Username:"
send "$PROTON_USER\r"

# Wait for Password: prompt
expect "Password:"
send "$PROTON_PASS\r"

# After password, the CLI shows a "Logging In" spinner, then one of:
#   - 2FA prompt
#   - Mailbox password prompt
#   - Backup/Restore prompt
#   - Login failure
expect {
    "2FA" {
        $(if [[ -n "$PROTON_2FA" ]]; then
            echo "send \"$PROTON_2FA\r\""
        else
            echo 'puts "ERROR: 2FA required but PROTON_2FA not set"; exit 1'
        fi)
        exp_continue
    }
    "TOTP" {
        $(if [[ -n "$PROTON_2FA" ]]; then
            echo "send \"$PROTON_2FA\r\""
        else
            echo 'puts "ERROR: 2FA required but PROTON_2FA not set"; exit 1'
        fi)
        exp_continue
    }
    "Mailbox password" {
        $(if [[ -n "$PROTON_MAILBOX_PASS" ]]; then
            echo "send \"$PROTON_MAILBOX_PASS\r\""
        else
            echo "send \"\r\""
        fi)
        exp_continue
    }
    "Failed to login" {
        puts "\nERROR: Login failed. Check your credentials in .env"
        exit 1
    }
    "Operation" {
        send "B\r"
    }
}

# Export path prompt — say No to use default, then provide our path
expect "Do you wish to proceed?"
send "No\r"

# CLI will ask for a custom path
expect ":"
send "$EXPORT_DIR\r"

# It may ask to confirm again
expect {
    "Do you wish to proceed?" {
        send "Yes\r"
    }
    -re {(?i)export|start} {
        # Export started
    }
}

# Wait for export to finish (up to 2 hours)
expect {
    -re {(?i)finished|complete|done|exported|success} {
        puts "\nExport completed successfully."
    }
    "Failed" {
        puts "\nERROR: Export failed."
        exit 1
    }
    timeout {
        puts "\nERROR: Export timed out after 2 hours."
        exit 1
    }
}

expect eof
EXPECT_EOF

chmod +x "$EXPECT_FILE"
expect "$EXPECT_FILE"

# ── Sync new emails ──
echo "==> Syncing new emails to $DATA_EMAILS_DIR..."

NEW_COUNT=0

# The export tool saves files in a subdirectory named after the user
# Find where the .eml files actually landed
EXPORT_SRC=$(find "$EXPORT_DIR" -name "*.eml" -print -quit 2>/dev/null | xargs -I{} dirname {} 2>/dev/null || echo "")

if [[ -z "$EXPORT_SRC" ]]; then
    echo "WARNING: No .eml files found in export. Nothing to sync."
    rm -rf "$EXPORT_DIR"
    exit 0
fi

for eml_file in "$EXPORT_SRC"/*.eml; do
    filename=$(basename "$eml_file")
    if [[ ! -f "$DATA_EMAILS_DIR/$filename" ]]; then
        cp "$eml_file" "$DATA_EMAILS_DIR/"
        NEW_COUNT=$((NEW_COUNT + 1))
    fi
done

for json_file in "$EXPORT_SRC"/*.metadata.json; do
    [[ -f "$json_file" ]] || continue
    filename=$(basename "$json_file")
    if [[ ! -f "$DATA_EMAILS_DIR/$filename" ]]; then
        cp "$json_file" "$DATA_EMAILS_DIR/"
    fi
done

echo "==> Synced $NEW_COUNT new email(s)."

# ── Rebuild public HTML + metadata ──
if [[ $NEW_COUNT -gt 0 ]]; then
    echo "==> Regenerating public email HTMLs..."
    python3 "$SCRIPT_DIR/emails-to-htmls.py"
    echo "==> Done! $NEW_COUNT new email(s) added and site rebuilt."
else
    echo "==> No new emails. Site is up to date."
fi

# ── Cleanup ──
rm -rf "$EXPORT_DIR"
