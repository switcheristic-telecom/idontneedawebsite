# I Don't Need a Website

When you register a .US domain, your full name, home address, phone number, and email are published in a public WHOIS database. There is no way to opt out.

In 2024, [Yufeng](https://yufengzhao.com) registered `yufeng.us` because it was the cheapest domain available. Spam emails and robocalls followed within days — all sent to the contact info from the registration form. He changed the WHOIS record to a fake contact, but data brokers had already scraped the real one. The spam kept coming.

He registered `idontneedawebsite.us` under the name **Webb Notneeded** and started saving everything that arrived. Most of it is from companies trying to sell web design services.

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
├── index.html              # Vite entry point
├── src/
│   ├── app.tsx             # Root Preact component
│   ├── main.tsx            # Preact entry point
│   ├── components/         # UI components (email client, about, calendar, etc.)
│   ├── data/               # Data loaders (emails, calls)
│   ├── hooks/              # Custom hooks
│   └── utils/              # Helpers (search, highlight)
├── data/
│   ├── emails/             # Raw .eml + .metadata.json files
│   └── calls/              # Google Voice call logs (via Google Takeout)
├── public/
│   ├── emails/             # Generated HTML from parsed .eml files
│   ├── email-metadata.json # Aggregated metadata for frontend
│   └── assets/             # DALL-E portraits, logos
├── pyproject.toml          # Python project config (uv)
├── vite.config.ts          # Vite + Preact config
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
