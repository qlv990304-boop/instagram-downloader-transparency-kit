# Instagram Downloader Transparency Kit

A small, auditable toolkit for reviewing browser-based Instagram video downloaders without relying only on marketing copy.

## What is included

- `data/instagram-video-downloader-audit-2026-09-14.csv` — a manual feature audit of ten Google web results.
- `docs/review-checklist.md` — a reusable checklist for testing a downloader's claims and boundaries.
- `bin/classify-instagram-url.mjs` — a zero-dependency CLI that classifies supported Instagram URL shapes locally.
- `test/classify-instagram-url.test.mjs` — executable tests for the URL classifier.

## Quick start

Node.js 20 or newer is recommended.

```bash
node bin/classify-instagram-url.mjs "https://www.instagram.com/reel/ABC_123/"
npm test
```

Example output:

```json
{
  "valid": true,
  "contentType": "reel",
  "normalizedUrl": "https://www.instagram.com/reel/ABC_123/"
}
```

The classifier performs syntax checks only. It does not contact Instagram, confirm that media is public, or download anything.

## Why these fields

A useful downloader disclosure should answer six questions before a visitor submits a URL:

1. Which platform content types are accepted?
2. Which file format is returned?
3. What measurable quality ceiling applies?
4. Is a platform login required?
5. Are requests single-link or batch?
6. What usage limit applies, and do failures count?

The audit also records unsupported-content boundaries because a public URL does not imply permission to download or republish media.

## Method and provenance

The CSV is a manual, page-level observation captured on 2026-09-14. The query used Google Search with an English interface, `gl=us`, and personalization disabled. Google could not determine the browser's physical location. AI answers, video units, ads, and People Also Ask were excluded. Seven eligible web results appeared on page one, so the first three eligible web results from page two completed the ten-row sample.

Each row contains the page URL that was opened. One result could not be read because both the page reader and browser safety policy blocked it; its feature cells are marked `unknown` instead of being inferred from a snippet.

### Data dictionary

| Column | Meaning |
|---|---|
| `observed_rank` | Position among eligible web results after excluded result units were removed |
| `domain` | Display domain of the opened result |
| `page_type` | Tool, app listing, forum, or mixed tool/article page |
| `page_read_status` | `read` or `blocked` |
| `first_screen_tool` | Whether an input-and-download interface was visible near the page top |
| `content_scope` | Instagram content types the page claimed to support |
| `output_format_claim` | File format explicitly stated by the page |
| `quality_claim` | Quality or resolution explicitly stated by the page |
| `login_claim` | Whether the page said a login was required |
| `batch_claim` | Explicit single-link or batch statement; `unclear` when not stated |
| `usage_limit_claim` | Explicit allowance or limit statement |
| `access_boundaries` | Unsupported or restricted content stated by the page |
| `source_url` | Page opened for the observation |
| `checked_date` | Calendar date of the manual review |
| `notes` | Material context not captured by the normalized fields |

Values summarize page claims and are not independent endorsements. `unknown` indicates that a value could not be verified.

The disclosure checklist and URL-shape validator are implemented in a live reference at [Vidlune's Instagram video download guide](https://ig-reels-downloader.com/guides/instagram-video-download).

## Limitations

- Search results and product claims can change after the observation date.
- The dataset records what each page stated, not an independent download test of every service.
- `unknown` means the field was not verified; it does not mean the feature is absent.
- Instagram is a trademark of Meta Platforms, Inc. This project is independent and is not affiliated with Instagram or Meta.

## Responsible use

Only download media you own, have permission to save, or are otherwise legally allowed to use. Do not use this toolkit to bypass private accounts, authentication, regional restrictions, or other access controls.

## License

Code and documentation are available under the MIT License. The audit observations are provided under CC0-1.0; source-page rights remain with their respective owners.
