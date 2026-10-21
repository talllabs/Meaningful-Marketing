# First 5 OC: Program Demos (Proposal Concepts)

Three clickable demos for First 5 Orange County, plus a landing page:

| Page | What it shows |
|---|---|
| `index.html` | Landing page linking to all three demos |
| `kid-builders.html` | Kid Builders activity finder: search, multi-age filter, skill area, season, type, language, speech-support videos, activity detail view |
| `edi.html` | Early Development Index: plain-language explainer, then a partner explorer (tile map by geography, domain and three-year wave; trend; domain comparison; sortable table) |
| `learning-link.html` | Learning Link directory: search and filters (day, time, language, services, location type, drop-in), list and map views, location detail with Fall/Spring schedules |

These are **proposal concepts**, not production code. Nothing connects to a CMS or the live First 5 OC site.

## Run it

It's plain HTML, CSS and JavaScript, so there's no build step and nothing to install.

- **Easiest:** open `first5oc-demos/index.html` in a browser.
- **Or serve it locally** (so the links behave like a real site): from the repo root run
  `python3 -m http.server 8000`, then visit <http://localhost:8000/first5oc-demos/>.
- **On the deployed site** it lives at `/first5oc-demos/` and is linked from `/for-first-5.html`.

## How it's organized

```
first5oc-demos/
  index.html, kid-builders.html, edi.html, learning-link.html   ← pages
  kid-builders.js, edi.js, learning-link.js                     ← page behavior
  demos-common.js                                               ← shared helpers (search, filters, dialogs)
  demos.css                                                     ← shared styles + color tokens
  data/kid-builders.js, data/edi.js, data/learning-link.js      ← SAMPLE DATA (swap for real content)
```

Sample data is kept **separate from the components**. To use real content, replace the files in `data/`
(or point them at a CMS/API feed with the same shape). The pages themselves don't need to change.

**Learning Link twice-yearly updates:** each location has a `schedules` object keyed by term
(`fall-2026`, `spring-2027`). To roll over, staff add the new term to `terms`, enter sessions under
that term, and set `currentTerm`. A location with no sessions for a term shows "Schedule coming soon"
instead of disappearing.

## Assumptions

- **Brand:** the logo mark, colors and fonts match our earlier Concept A and are **placeholders**, not official
  First 5 OC brand assets. Colors are defined as tokens at the top of `demos.css` so they're easy to swap.
  The bright orange (`#ff6b2c`) is used for decoration only. Buttons use a darker orange (`#b8400f`) so
  white text meets WCAG AA contrast.
- **All content is illustrative:** activities, videos, translations, locations, addresses, phone numbers,
  schedules, EDI geographies and every EDI number are invented. Each page carries a banner saying so, and
  data-specific labels mark illustrative details.
- **EDI domains** use the five standard EDI domain names. The "% vulnerable, lower is better" framing,
  the three-year waves and the area-level reporting are assumptions about how First 5 OC presents results.
- **The EDI map** is a simplified tile layout, and the **Learning Link map** is a simplified county
  outline. Neither is geographically accurate. Production would likely use real boundaries (e.g. a
  GeoJSON layer) or a mapping library.
- **Detail views** open in a dialog tied to the URL hash (e.g. `#activity=leaf-sort`,
  `#location=sa-1`), so they're linkable and the Back button closes them.

## Accessibility notes

- All controls are native buttons, checkboxes, radios and selects, so everything is keyboard operable.
- Visible focus outlines on every interactive element, plus a skip link on each page.
- Result counts are announced to screen readers (`aria-live`). Removable filter chips have labels.
- The EDI map never relies on color alone: every tile shows its value, and a sortable table view is provided.
- Non-English content is marked with `lang` attributes so screen readers pronounce it correctly.
- Every page has empty states (no results) with a one-click "Clear all filters".
- Tested at desktop (1366px) and phone (360–390px) widths with no horizontal scrolling.

## Needs confirmation before production

**Kid Builders**
- Real activity library: how many activities, the existing categories, and who owns updates.
- Exact age bands (single years, or ranges like 0–12 months / 1–2 / 3–5?).
- Where speech-support videos are hosted (YouTube, Vimeo, other), plus captions and transcripts.
- Spanish and Vietnamese content: does it already exist, and who reviews translations and cultural fit?
  Should other languages (e.g. Korean, Arabic) be included?
- Should the whole interface be translatable, not just the activities?

**EDI**
- Which geographies First 5 OC reports publicly (school district, city, neighborhood) and any minimum
  group sizes or suppression rules for small areas.
- Official wave years and how results are labelled.
- Preferred wording for how First 5 OC uses the data (marked "Confirm wording" in the demo).
- Whether partners need downloads (CSV/PDF) or a login for deeper data.

**Learning Link**
- Real location list, addresses, contact info and accessibility details.
- Term dates for Fall and Spring, who updates schedules, and whether updates come from a spreadsheet,
  a CMS or another system.
- Registration process: links to sign-up forms? Waitlists?
- Map provider for production (e.g. Google Maps or Mapbox), including cost and privacy review.

**General**
- CMS choice and how these collections would be modelled there.
- Official brand assets (logo files, color palette, typography).
- Analytics and privacy requirements.
