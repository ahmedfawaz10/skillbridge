# SkillBridge — Exchange Skills, Not Money

A Bootstrap 5 website for a peer-to-peer skill-exchange community: instead of paying
for courses, members trade what they know (e.g. "I teach you React, you teach me Arabic
conversation").

## Pages

- `index.html` — Home: hero, stats, "How It Works" process, featured members carousel, FAQ
- `members.html` — Directory: search, filters, sorting, pagination, exchange requests
- `profile.html` — Single member profile: about / skills / reviews tabs
- `contact.html` — Contact form with validation

## Color Palette — "Ledger"

Inspired by the idea of a shared ledger of favors: warm, paper-adjacent neutrals with a
teal-and-gold pairing standing in for the two sides of every exchange (what you give /
what you receive).

| Token       | Hex       | Use                                     |
| ----------- | --------- | --------------------------------------- |
| `--sb-teal` | `#0E7C74` | Primary — brand, links, primary actions |
| `--sb-gold` | `#D9A441` | Secondary — credits, value, CTA accents |
| `--sb-sage` | `#4C9A63` | Success states                          |
| `--sb-clay` | `#C1503C` | Danger / alerts                         |
| `--sb-ink`  | `#142826` | Body text, headings                     |
| `--sb-mist` | `#EEF2EF` | Page background                         |

Typography: **Fraunces** (display/headings), **Inter** (body/UI), **IBM Plex Mono**
(stats, credits, percentages) — a small nod to the "currency" feel of a credits system.

## Bootstrap components used

Navbar, Cards, Buttons (solid/outline/sizes), Forms with validation, Tables, Alerts,
Badges, Breadcrumbs, Button Groups, List Groups, Progress Bars, Spinners, Pagination,
Accordion, Pills/Tabs, Carousel, Modal, Tooltips, Popovers, Collapse, Dropdown, Toast,
Offcanvas.

## Notes

- Data lives in `data/members.json` and is loaded with `fetch`.
- Members without an uploaded photo automatically fall back to a generated
  initials avatar (see `avatarFallback` / the inline `onerror` handlers), so all
  24 profiles always show a picture.
- No backend: the contact form and exchange modal simulate a submission using
  Bootstrap's client-side validation, then show a success `alert` / `toast`.

## Running the project

Because member data is loaded using `fetch()`, the project must be served through a local web server (e.g. VS Code Live Server). Opening `index.html` directly with the `file://` protocol will prevent the JSON data from loading.
