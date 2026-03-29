# I Don't Need a Website

A case study documenting the spam that follows registering a .US domain — where WHOIS privacy redaction is not allowed.

After registering `idontneedawebsite.us` with a ProtonMail email and Google Voice number, the registrant's personal information (name, address, phone, email) was immediately exposed via WHOIS. Within days, a flood of spam emails and phone calls arrived — web developers, SEO firms, and marketing agencies all eager to build a website for someone who doesn't need one.

This project collects and displays that spam as a public record.

## Live Site

[idontneedawebsite.us](https://idontneedawebsite.us)

## Setup

Requires [uv](https://docs.astral.sh/uv/) and Python 3.12+.

```bash
uv sync
```

### Credentials

Copy `.env.example` and fill in your password:

```bash
cp .env.example .env
```

## Usage

### Sync new emails from ProtonMail

```bash
uv run python sync.py
```

This will:

1. Auto-download `proton-mail-export-cli` if not present
2. Log in and export all emails
3. Copy new `.eml` + `.metadata.json` files into `data/emails/`
4. Rebuild `public/emails/*.html` and `public/email-metadata.json`

## Project Structure

```text
├── sync.py                 # Email sync + build (pexpect + proton-mail-export-cli)
├── lib/eml_parser.py       # MIME email parser
├── index.html              # Static site entry point
├── scripts/main.js         # Frontend: renders email feed from metadata JSON
├── data/
│   ├── emails/             # Raw .eml + .metadata.json files
│   └── calls/              # Google Voice call logs (via Google Takeout)
├── public/
│   ├── emails/             # Generated HTML from parsed .eml files
│   ├── email-metadata.json # Aggregated metadata for frontend
│   └── assets/             # DALL-E portraits, logos
├── pyproject.toml          # Python project config (uv)
└── .env                    # Credentials (gitignored)
```

## Data Sources

- **Emails**: Exported from ProtonMail using [proton-mail-export-cli](https://github.com/ProtonMail/proton-mail-export)
- **Calls**: Exported from Google Voice using [Google Takeout](https://takeout.google.com/)
  - Call records span January 29 to March 21, 2024 — the only period for which data was exported. A subsequent export was not possible because Google had deleted the associated account (see below). The frequency of calls during this two-month window alone is indicative of their spammy nature: multiple calls on most workdays, and occasionally on weekends.
  - **Note:** The Google Voice number was originally associated with `thanks.dont.need.a.website@gmail.com`. Google has since deleted this account (circa 2024). The call data was exported via Google Takeout before the account was removed.

## Third-Party Assets

- **Segoe UI Font**: Microsoft's system font, used to match the Windows Vista UI. Sourced from [CDNFonts](https://www.cdnfonts.com/segoe-ui-4.font). Free for personal use.

## License

A [Switcheristic Telecommunications](https://swtch.tel) project.
