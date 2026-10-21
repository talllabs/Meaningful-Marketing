# First 5 OC: Program Demos (Proposal Concepts)

Three clickable demos for First 5 Orange County, plus a landing page. All three use **First 5 OC's real content**.
The page designs are proposal concepts.

| Page | What it shows |
|---|---|
| `index.html` | Landing page linking to all three demos |
| `kid-builders.html` | All 171 current Kid Builders activities with official artwork. It has an age picker (more than one age at once), the six builder areas as filters, search, a "new" filter, a Speech & Language feature with strategy videos in English/Español/Tiếng Việt, and an activity detail view |
| `edi.html` | Orange County's 2025 Early Development Index in two modes. **Explore** (default) is a plain-language, interactive view for parents: a 100-kindergartners picture (2015 vs. 2025), the five areas in everyday words, parent FAQs and help-at-home links. **Deep Dive** has everything: headline readiness figure (53.0%, up from 48.2% in 2015), a spot for First 5 OC's **live ArcGIS map**, the five domains with 2015 vs. 2025 results (chart + table), how results are classified, how the data is used, collection and privacy, and resources and data requests |
| `learning-link.html` | All 53 FY 2026-27 Learning Link sites (plus Tustin USD, coming soon). Search, district/day/time/fee filters, a clustered map and a list built from the same data, tap-to-call phones, directions and registration links |

Nothing connects to a CMS or changes the live First 5 OC site.

## Run it

It's plain HTML, CSS and JavaScript, so there's no build step and nothing to install.

- **Easiest:** open `first5oc-demos/index.html` in a browser.
- **Or serve it locally:** from the repo root run `python3 -m http.server 8000`, then visit
  <http://localhost:8000/first5oc-demos/>.
- **On the deployed site** it lives at `/first5oc-demos/` and is linked from `/for-first-5.html`.
- **Password:** `first5`. Every demo and Concept A page loads `gate.js`, which shares its unlock with
  `/for-first-5.html`, so visitors enter it once per browser tab. Pages shown as previews inside the
  proposal page skip the gate (the proposal page is already locked). Like the site's other client gates,
  this is a light screen for sharing, not real security: the pages are still publicly reachable.

## How it's organized

```
first5oc-demos/
  index.html, kid-builders.html, edi.html, learning-link.html   ← pages
  kid-builders.js, edi.js, learning-link.js                     ← page behavior
  demos-common.js                                               ← shared helpers (search, filters, dialogs)
  demos.css                                                     ← shared styles + color tokens
  data/kid-builders.js, data/edi.js, data/learning-link.js      ← CONTENT (separate from the pages)
  vendor/leaflet/                                               ← Leaflet 1.9.4 + markercluster 1.5.3 (open source, licenses included)
```

Content lives in `data/`, separate from the page code, so a CMS or API can replace those files
without redesigning the pages.

## Where the content came from

All three were compiled from first5oc.org on Oct 21, 2026 and provided as reference files.

- **Kid Builders:** `data/kid-builders.js` was generated from the Kid Builders content inventory and official
  image manifest. Titles, descriptions, ages, builder areas, "NEW" flags, age ranges and artwork are theirs.
- **EDI:** `data/edi.js` holds the page copy, the 2025 and 2015 readiness figures (First 5 OC) and the
  five domain results for 2015 and 2025 (as reported in CHOC's 2025 Community Health Needs Assessment).
  **No neighborhood values are stored**, by design (see below).
- **Learning Link:** `data/learning-link.js` was generated from the FY 2026-27 live location data. Every
  district, site, address, phone, day, time, fee, URL, status and QA note is copied unchanged.

## Assumptions and demo-only choices

- **Brand:** headers use First 5 OC's real logo (white, so it sits on a brand-blue tile in light headers),
  hotlinked from their media library. Colors and fonts match our earlier Concept A and are still
  **placeholders** until we have the official palette. Colors are tokens at the top of `demos.css`. Buttons use a darker orange (`#b8400f`) than Concept A so
  white text meets WCAG AA contrast.
- **Images are hotlinked** from First 5 OC's WordPress media library (Kid Builders artwork, the Learning
  Link photo). Before production, copy approved assets into the new site's own library. Images that fail
  to load fall back gracefully (a colored tile, or the photo is hidden).
- **EDI Explore mode** uses only the published figures, rounded into everyday phrases (e.g. 80.3% becomes
  "about 8 in 10"). The exact numbers are shown alongside. Parent-friendly area names and FAQ answers live
  in `data/edi.js` next to the official wording, so First 5 OC can edit them. The "Try at home" links open
  Kid Builders pre-filtered (`kid-builders.html?b=word`). Mode is kept in the URL (`#explore`, `#deep-dive`).
- **EDI map:** First 5 OC's neighborhood map is a live ArcGIS application. Their guidance is to embed it,
  not rebuild it, so neighborhood data, filters and future updates keep working without a website
  change. The demo shows a labeled placeholder that links to the current map. **To turn the live map on,**
  paste the exact iframe `src` from the current EDI page into `mapUrl` in `data/edi.js`. Don't guess the URL.
- **Learning Link map:** production should use First 5 OC's Google Maps setup (it needs their API key).
  The demo uses the open-source Leaflet library with OpenStreetMap tiles instead, with the same clustered-pin
  behavior. Because the data has no coordinates yet, **pins sit at the approximate center of each site's
  city**, fanned out slightly when several share a city. This is labeled on the page. Before production,
  geocode each address once and store `latitude`/`longitude`.
- **Learning Link day/time filters** are read from the published text (e.g. "Mondays through Thursdays",
  "1st and 3rd Wednesdays"), and the original text is always shown unchanged on each card.
- **Kid Builders has no season or activity-type filters.** The real content has no such tags, so the six
  builder areas are the filters.
- **Kid Builders GIFs are animated**, with a "Pause animations" button. They start paused for anyone whose
  device asks for reduced motion.
- **Kid Builders language downloads** open each builder page on first5oc.org, where the English, Spanish
  and Vietnamese PDFs live. The individual PDF URLs weren't in the inventory.

## Accessibility notes

- Native buttons, checkboxes, radios and selects, so everything is keyboard operable. Visible focus
  outlines everywhere, plus a skip link on each page.
- Result counts are announced to screen readers (`aria-live`). Removable filter chips have labels.
- Every Learning Link site is fully described in text. The map is never the only way to see a location,
  and the list works even if the map fails to load.
- The EDI chart has a data table alternative and is redrawn at the screen's real width so text stays
  readable on phones. Map instructions and privacy notes are in text.
- Phone numbers use `tel:` links (including extensions). External links say they open a new tab.
- Tested at desktop (1366px) and phone (360–390px) widths with no horizontal scrolling.

## Needs confirmation before production

**Kid Builders**
- Permission to reuse the existing artwork, and the original files (to replace the hotlinks).
- Direct URLs for the 90 English/Spanish/Vietnamese activity PDFs.
- Full activity instructions (the inventory has one-line summaries) and which activities have videos.
- Artwork for Baby "A Safe Bed" (none verified) and the 3 Years builder-card images.
- Review of time-sensitive health and safety guidance (car seats, safe sleep, helmets, sunscreen, dental).

**EDI**
- The exact ArcGIS iframe `src` from the current EDI page (for `mapUrl`).
- That the CHOC-reported domain figures are the "on track" percentages First 5 OC wants to show, or
  First 5 OC's own published domain figures to use instead.
- Whether to keep Cristina Blevins as the listed EDI contact.
- Review of the Explore-mode wording (plain-language area names, FAQ answers, Kid Builders pairings).
- An inventory of the Domain Spotlight images and downloads.

**Learning Link**
- **BESST Center (Newport-Mesa):** the live page says `12:30am-2:00pm`, likely meant to be 12:30pm.
  It's shown as published and flagged on the card until First 5 OC confirms.
- First 5 OC's Google Maps API key (domain-restricted) and geocoded coordinates for each site.
- Who updates the location data each fiscal year, and whether it should live in the CMS.

**General**
- CMS choice and how these collections would be modelled there.
- Official brand assets (logo files, color palette, typography).
- Analytics and privacy requirements.
