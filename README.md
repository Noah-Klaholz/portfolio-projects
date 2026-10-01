# portfolio-projects
Stores JSON data on portfolio projects that can be loaded into multiple websites.

Both [noahklaholz.netlify.app](https://noahklaholz.netlify.app) and the
[gamified portfolio](https://noahklaholz-dev.netlify.app) fetch `projects.json`
straight from the `main` branch, so a push here updates both sites (allow ~5 minutes
for GitHub's cache).

## Adding a project

1. Put the cover image in `assets/images/projects/` (landscape works best, roughly 16:10 or wider).
2. Add an entry to `projects.json`. **Order in the file is the order on the site**, so put new work at the top.
3. Run `node scripts/validate.mjs` (the GitHub Action runs it on every push too).

## Format

`projects.json` is a top-level array. The required fields are the original format,
which the gamified portfolio still reads, so don't rename or remove them.
Everything else is optional and only shows up on the main site when present.

### Required

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Unique. Never reuse a number. |
| `title` | string | |
| `description` | string | One or two sentences, shown on the project list. |
| `technologies` | string[] | |
| `image` | string | Path inside this repo, e.g. `assets/images/projects/X.png` (no leading `/`). |
| `category` | string | Used for filters, e.g. `software`, `game`, `hardware`, `blockchain`, `website`, `leadership`. New values create a new filter automatically. |
| `status` | string | `COMPLETED`, `UNDER CONSTRUCTION`, or `ONGOING`. |
| `links` | object[] | `{ "type", "url", "label" }`. Known types: `github`, `website`, `devpost`, `demo`, `video`, `instagram`, `download`, `paper`. `label` is for the gamified site (e.g. `VIEW_CODE`). |
| `featured` | boolean | Featured projects are shown first and never hidden behind "show all". |

### Optional (new)

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string | lowercase-with-dashes. Gives the project a shareable link: `/#spidey-irl`. Without it, the project has no detail page. |
| `tagline` | string | Short hook shown at the top of the detail page. |
| `date` | string | `"2026"` or `"2026-09"`. |
| `context` | string | Where it happened: a hackathon, course, job, ... e.g. `"Hack the North 2026"`. |
| `role` | string | What *you* did on a team project. |
| `imageAlt` | string | Alt text for `image`. Defaults to the title. |
| `awards` | object[] | `{ "title": "3rd Place", "detail": "QNX track" }` |
| `highlights` | string[] | Short, scannable facts and numbers. |
| `story` | object[] | Long-form sections for the detail page: `{ "heading": "How it works", "body": "..." }`. Separate paragraphs in `body` with `\n\n`. |
| `team` | object[] | Teammates (not yourself): `{ "name": "...", "url": "https://..." }`. `url` is optional. |
| `gallery` | object[] | Extra images: `{ "src": "assets/...", "alt": "...", "caption": "..." }`. |

### Example

```json
{
    "id": 11,
    "slug": "my-project",
    "title": "My Project",
    "tagline": "One line that makes people want to click.",
    "description": "What it is, in one or two sentences.",
    "date": "2026-11",
    "context": "HackZurich 2026",
    "role": "Built the backend and the hardware integration.",
    "technologies": ["Python", "FastAPI"],
    "image": "assets/images/projects/MyProject.png",
    "category": "software",
    "status": "COMPLETED",
    "awards": [{ "title": "1st Place", "detail": "Best use of AI" }],
    "highlights": ["Shipped in 36 hours", "Used by 200 people on day one"],
    "story": [{ "heading": "The idea", "body": "First paragraph.\n\nSecond paragraph." }],
    "team": [{ "name": "Jane Doe", "url": "https://github.com/janedoe" }],
    "links": [{ "type": "github", "url": "https://github.com/Noah-Klaholz/my-project", "label": "VIEW_CODE" }],
    "featured": true
}
```
