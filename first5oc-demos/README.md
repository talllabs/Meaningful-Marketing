# First 5 OC: Program Demos (Proposal Concepts)

Three clickable demos for First 5 Orange County, plus a landing page:

| Page | What it shows |
|---|---|
| `index.html` | Landing page linking to all three demos |
| `kid-builders.html` | Kid Builders activity finder with all 171 current activities and official artwork: age picker (multi-select), the six builder areas, search, "new" filter, speech & language feature, activity detail view |
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

**Kid Builders uses real content.** `data/kid-builders.js` is generated from First 5 OC's Kid Builders content
inventory and official image manifest (compiled Oct 21, 2026 from first5oc.org). Activity titles, descriptions,
ages, builder areas, "NEW" flags, recommended age ranges and artwork are theirs; nothing is invented.
Learning Link and EDI still use illustrative sample data.

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
- **Kid Builders content is real; the rest is illustrative.** Learning Link locations, addresses, phone
  numbers and schedules, plus EDI geographies and every EDI number, are invented. Each page carries a
  banner saying which is which.
- **Kid Builders artwork is hotlinked** from First 5 OC's current WordPress media library
  (`first5oc.org` and the legacy `first5oc.wpengine.com`). That's fine for a demo, but before production
  the approved assets should be copied into the new site's own library and `imageUrl` updated. If an image
  fails to load, the card shows a builder-colored tile with the activity title instead of a broken image.
- **Kid Builders GIFs are animated**, as on the current site. A "Pause animations" button freezes them,
  and they start paused for anyone whose device asks for reduced motion.
- **No season or activity-type filters on Kid Builders.** The original brief asked for them, but the
  real content has no season or type tags. The six builder areas (Mind, Word, Body, Relationship, Safety,
  Health) are the real taxonomy, so those are the filters. Season or type could be added later as new
  data fields.
- **Language downloads:** each builder page on first5oc.org has English, Spanish and Vietnamese PDFs.
  The demo's download buttons open that page, because the individual PDF URLs weren't in the inventory.
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
- Permission to reuse the existing artwork in the new site, and a copy of the original files
  (to replace the hotlinks).
- Direct URLs for the 90 English/Spanish/Vietnamese activity PDFs.
- Full activity instructions and caregiver language (the inventory has one-line summaries).
- Which activities have embedded videos, and where the 18 activity and 20 speech videos are hosted.
- Artwork for Baby "A Safe Bed" (none verified), and the 3 Years builder-card images.
- Should seasonal or activity-type tags be added to the content?
- Review of time-sensitive health and safety guidance (car seats, safe sleep, helmets, sunscreen, dental).
- Should the whole interface be translatable, not just the downloads?

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
