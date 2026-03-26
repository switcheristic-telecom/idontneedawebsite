"""
Sync emails from ProtonMail using proton-mail-export-cli.
Auto-downloads the CLI binary if not found.
Usage: uv run python sync.py
"""

import os
import re as _re
import sys
import json
import shutil
import platform
import subprocess
import zipfile
import tarfile
from pathlib import Path
from html.parser import HTMLParser

import pexpect

ROOT = Path(__file__).parent
DATA_EMAILS_DIR = ROOT / "data" / "emails"
DATA_CALLS_DIR = ROOT / "data" / "calls"
EXPORT_DIR = ROOT / ".export-tmp"
BIN_DIR = ROOT / ".bin"
HTML_OUTPUT_DIR = ROOT / "public" / "emails"
METADATA_JSON_PATH = ROOT / "public" / "email-metadata.json"
CALL_METADATA_PATH = ROOT / "public" / "call-metadata.json"
SEARCH_INDEX_PATH = ROOT / "public" / "email-search-index.json"


def load_env():
    """Load credentials from .env file and environment."""
    env_file = ROOT / ".env"
    env = {}
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, _, value = line.partition("=")
                env[key.strip()] = value.strip()

    def get(key, required=False):
        val = os.environ.get(key, env.get(key, ""))
        if required and not val:
            print(f"ERROR: {key} not set. Add it to .env or environment.")
            sys.exit(1)
        return val

    return {
        "user": get("PROTON_USER", required=True),
        "password": get("PROTON_PASS", required=True),
        "twofa": get("PROTON_2FA"),
        "mailbox_pass": get("PROTON_MAILBOX_PASS"),
    }


def find_cli():
    """Find or auto-download proton-mail-export-cli."""
    # Check env override
    cli_path = os.environ.get("PROTON_EXPORT_CLI", "")
    if cli_path and Path(cli_path).is_file():
        return cli_path

    # Check PATH
    if shutil.which("proton-mail-export-cli"):
        return "proton-mail-export-cli"

    # Check local .bin
    local_cli = BIN_DIR / "proton-mail-export-cli"
    if local_cli.is_file() and os.access(local_cli, os.X_OK):
        return str(local_cli)

    # Download
    print("==> proton-mail-export-cli not found. Downloading...")
    BIN_DIR.mkdir(exist_ok=True)

    system = platform.system()
    if system == "Darwin":
        asset = "proton-mail-export-cli-macos.zip"
    elif system == "Linux":
        asset = "proton-mail-export-cli-linux_x86_64.tar.gz"
    else:
        print(f"ERROR: Unsupported platform: {system}")
        sys.exit(1)

    url = f"https://github.com/ProtonMail/proton-mail-export/releases/latest/download/{asset}"
    archive_path = BIN_DIR / asset

    print(f"    Downloading from {url}")
    subprocess.run(["curl", "-fSL", "-o", str(archive_path), url], check=True)

    print("    Extracting...")
    if asset.endswith(".zip"):
        with zipfile.ZipFile(archive_path) as zf:
            zf.extractall(BIN_DIR)
    elif asset.endswith(".tar.gz"):
        with tarfile.open(archive_path) as tf:
            tf.extractall(BIN_DIR)
    archive_path.unlink()

    # Find binary and dylib (may be nested in .app bundle)
    found_cli = next(BIN_DIR.rglob("proton-mail-export-cli"), None)
    found_dylib = next(BIN_DIR.rglob("proton-mail-export.dylib"), None)

    if not found_cli or not found_cli.is_file():
        print("ERROR: Could not find proton-mail-export-cli after extraction.")
        sys.exit(1)

    # Move to top-level .bin/
    if found_cli != local_cli:
        shutil.move(str(found_cli), str(local_cli))
    local_cli.chmod(0o755)

    # Copy dylib next to binary (required by @loader_path)
    local_dylib = BIN_DIR / "proton-mail-export.dylib"
    if found_dylib and found_dylib != local_dylib:
        shutil.copy2(str(found_dylib), str(local_dylib))

    print(f"==> Installed to {local_cli}")
    return str(local_cli)


def run_export(cli_path, creds):
    """Run proton-mail-export-cli with pexpect to automate interactive prompts."""
    if EXPORT_DIR.exists():
        shutil.rmtree(EXPORT_DIR)
    EXPORT_DIR.mkdir(parents=True)

    print("==> Exporting emails from ProtonMail...")

    child = pexpect.spawn(cli_path, timeout=7200, encoding="utf-8")
    child.logfile_read = sys.stdout

    # Username
    child.expect("Username:")
    child.sendline(creds["user"])

    # Password
    child.expect("Password:")
    child.sendline(creds["password"])

    # After login: may get 2FA, mailbox password, or Operation prompt
    while True:
        idx = child.expect([
            "2FA",
            "TOTP",
            "Mailbox password",
            "Failed to login",
            "Operation",
        ])
        if idx in (0, 1):
            if not creds["twofa"]:
                print("\nERROR: 2FA required but PROTON_2FA not set.")
                child.close()
                sys.exit(1)
            child.sendline(creds["twofa"])
        elif idx == 2:
            child.sendline(creds["mailbox_pass"] or "")
        elif idx == 3:
            print("\nERROR: Login failed. Check credentials in .env")
            child.close()
            sys.exit(1)
        elif idx == 4:
            child.sendline("B")
            break

    # Export path — decline default, provide our path
    child.expect("Do you wish to proceed?")
    child.sendline("No")

    child.expect(":")
    child.sendline(str(EXPORT_DIR))

    # May ask to confirm again
    idx = child.expect(["Do you wish to proceed?", pexpect.TIMEOUT], timeout=10)
    if idx == 0:
        child.sendline("Yes")

    # Wait for export to finish
    idx = child.expect(["Export Finished", "Failed", pexpect.TIMEOUT], timeout=7200)
    if idx == 0:
        print("\n==> Export completed successfully.")
    elif idx == 1:
        print("\nERROR: Export failed.")
        child.close()
        sys.exit(1)
    else:
        print("\nERROR: Export timed out.")
        child.close()
        sys.exit(1)

    child.close()


def sync_emails():
    """Copy new .eml and .metadata.json files from export to data/emails/."""
    print(f"==> Syncing new emails to {DATA_EMAILS_DIR}...")

    # Find where the .eml files landed (may be in a subdirectory)
    eml_files = list(EXPORT_DIR.rglob("*.eml"))
    if not eml_files:
        print("WARNING: No .eml files found in export. Nothing to sync.")
        return 0

    export_src = eml_files[0].parent
    new_count = 0

    for eml_file in export_src.glob("*.eml"):
        dest = DATA_EMAILS_DIR / eml_file.name
        if not dest.exists():
            shutil.copy2(eml_file, dest)
            new_count += 1

    for json_file in export_src.glob("*.metadata.json"):
        dest = DATA_EMAILS_DIR / json_file.name
        if not dest.exists():
            shutil.copy2(json_file, dest)

    print(f"==> Synced {new_count} new email(s).")
    return new_count


class _HTMLTextExtractor(HTMLParser):
    """Extract visible text from HTML, skipping style/script blocks."""

    def __init__(self):
        super().__init__()
        self._parts: list[str] = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("style", "script"):
            self._skip = True

    def handle_endtag(self, tag):
        if tag in ("style", "script"):
            self._skip = False

    def handle_data(self, data):
        if not self._skip:
            self._parts.append(data)

    def get_text(self) -> str:
        text = " ".join(self._parts)
        return _re.sub(r"\s+", " ", text).strip()


def strip_html_to_text(html: str) -> str:
    """Convert HTML to plain text for search indexing."""
    parser = _HTMLTextExtractor()
    parser.feed(html)
    return parser.get_text()


def build_html():
    """Parse .eml files and generate public HTML + metadata JSON + search index."""
    from lib import EmlParser

    print("==> Regenerating public email HTMLs...")

    FILE_IGNORE = {".DS_Store", "labels.json"}
    email_data = {}

    for filename in os.listdir(DATA_EMAILS_DIR):
        if filename in FILE_IGNORE:
            continue

        email_id = filename.split(".")[0]

        if filename.endswith(".eml"):
            with open(DATA_EMAILS_DIR / filename, "rb") as f:
                html = EmlParser(f.read()).html
            email_data.setdefault(email_id, {})["html"] = html

        elif filename.endswith(".json"):
            with open(DATA_EMAILS_DIR / filename) as f:
                metadata = f.read()
            email_data.setdefault(email_id, {})["metadata"] = metadata

    # Filter: need both html (non-None) and metadata
    email_data = {
        k: v for k, v in email_data.items() if v.get("html") and "metadata" in v
    }

    HTML_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    metadata_list = []
    search_index = {}
    for email_id, data in email_data.items():
        with open(HTML_OUTPUT_DIR / f"{email_id}.html", "w") as f:
            f.write(data["html"])

        metadata = json.loads(data["metadata"])
        metadata["id"] = email_id
        metadata_list.append(metadata)

        # Build search index entry — lowercase, full body
        text = strip_html_to_text(data["html"])
        search_index[email_id] = text.lower()

    with open(METADATA_JSON_PATH, "w") as f:
        json.dump(metadata_list, f)

    with open(SEARCH_INDEX_PATH, "w") as f:
        json.dump(search_index, f)

    idx_size = SEARCH_INDEX_PATH.stat().st_size / 1024
    print(f"==> Built {len(metadata_list)} email(s), search index {idx_size:.1f} KB.")


def build_call_metadata():
    """Parse call log filenames from data/calls/ and generate call-metadata.json."""
    import re

    print("==> Building call metadata...")

    if not DATA_CALLS_DIR.exists():
        print("WARNING: data/calls/ directory not found. Skipping.")
        return

    pattern = re.compile(
        r"^\+(\d+) - (Missed|Voicemail) - (\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}Z)\.(html|mp3)$"
    )

    calls = {}
    for filename in os.listdir(DATA_CALLS_DIR):
        m = pattern.match(filename)
        if not m:
            continue
        phone, call_type, raw_time, ext = m.groups()
        time_iso = raw_time.replace("_", ":")
        key = f"{phone}-{raw_time}"

        if key not in calls:
            calls[key] = {
                "phone": f"+{phone}",
                "type": call_type,
                "time": time_iso,
                "hasAudio": False,
            }
        if ext == "mp3":
            calls[key]["hasAudio"] = True

    call_list = sorted(calls.values(), key=lambda c: c["time"])

    with open(CALL_METADATA_PATH, "w") as f:
        json.dump(call_list, f)

    print(f"==> Built metadata for {len(call_list)} call(s).")


def cleanup():
    """Remove the temporary export directory."""
    if EXPORT_DIR.exists():
        shutil.rmtree(EXPORT_DIR)
        print("==> Cleaned up export temp directory.")
    else:
        print("==> Nothing to clean up.")


def prompt_action():
    """Ask the user what to do."""
    print()
    print("What would you like to do?")
    print()
    print("  1. Backup + Parse + Delete  (full sync)")
    print("     Export emails from ProtonMail, copy new .eml/.json to data/emails/,")
    print("     rebuild public/ HTML + metadata, then remove temp export.")
    print()
    print("  2. Backup only")
    print("     Export emails from ProtonMail and copy new ones to data/emails/.")
    print("     Keeps temp export in .export-tmp/ for inspection.")
    print()
    print("  3. Parse only")
    print("     Rebuild public/emails/*.html and email-metadata.json from")
    print("     existing data/emails/ without re-downloading from ProtonMail.")
    print()
    print("  4. Delete only")
    print("     Remove the .export-tmp/ directory left over from a previous backup.")
    print()

    choice = input("Choose [1-4]: ").strip()
    if choice not in ("1", "2", "3", "4"):
        print("Invalid choice.")
        sys.exit(1)
    return int(choice)


def main():
    action = prompt_action()

    if action in (1, 2):
        creds = load_env()
        cli_path = find_cli()
        run_export(cli_path, creds)
        new_count = sync_emails()

        if action == 1:
            build_html()
            build_call_metadata()
            cleanup()
            print(f"==> Done! {new_count} new email(s) synced, site rebuilt, temp cleaned.")
        else:
            print(f"==> Done! {new_count} new email(s) synced. Temp data kept in {EXPORT_DIR}")

    elif action == 3:
        build_html()
        build_call_metadata()
        print("==> Done! Site rebuilt from data/emails.")

    elif action == 4:
        cleanup()


if __name__ == "__main__":
    main()
