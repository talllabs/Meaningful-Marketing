# Transcend Charter Workspace

A private working pilot for Ally's charter operations walkthrough with Transcend Cruises.

## Included

- Durable charter, client, tour, itinerary, cabin, reservation and guest records.
- 440 explicit planning fields plus per-record additional fields.
- The supplied Event Order imported as the first charter: 60 guest rows, 8 port days, 152 agenda entries, 52 source cabin records and 75 IT/AV records.
- Original workbook archive with all 17 tabs and source-conflict flags.
- CSV guest import with column mapping, preview and validation.
- Private R2 file uploads and authorized downloads.
- Approval and ship-receipt evidence fields, tasks and activity history.
- Charter-day and passenger pricing calculations, manual invoice/payment tracking by currency.
- Client Guide and Ship Report previews with server-side field filtering and browser PDF printing.
- Final handoff snapshots with required readiness checks and preserved history.
- A guided call walkthrough.

## Access and persistence

This Site is owner-private and uses ChatGPT sign-in. Each authenticated user's records and files are isolated. Client and ship screens are owner previews, not externally provisioned accounts. D1 stores workspace records, R2 stores uploaded files. Saves use optimistic revision checks to reject conflicting updates.

## Not yet connected

SharePoint, HubSpot, Docusign, Microsoft Entra, payment processing, NetSuite, WeTravel and Zapier have no live credentials or active sync. The Connections screen records a SharePoint mapping plan. Microsoft tenant access, list/library definitions, permission review and conflict rules are required to implement two-way SharePoint synchronization.

This pilot is not the Azure/Entra production deployment described in the source specification. Payment and signature statuses are recorded evidence, not executed transactions or signatures. Emailing and automated notifications are not enabled. Exact suite rules, retention policy, role access, production architecture and migration reconciliation require Transcend approval.

## Source issues

The rooming list has September header dates while the itinerary is October 29 to November 5. Passenger and rooming lists require explicit matching. Flight dates/times and SHOREX weekday labels conflict. Logo cells contain formula errors. Raw originals remain available; these conflicts were not silently resolved.

## Development

Use the Sites project helpers for install/build/publication. Generate schema-only migrations with `node node_modules/drizzle-kit/bin.cjs generate`. Production migrations are applied by Sites deployment. Browser preview is managed by `sites-preview`.

Checks: `node scripts/check-domain.mjs` and `node node_modules/typescript/bin/tsc --noEmit`. Domain checks cover source counts, pricing, signed-evidence rules, cabin capacity and blocked inventory. Signed-in end-to-end browser verification remains pending because the cloud browser reached the owner's login screen.

The complete source is in this repository. No credentials belong in source, browser bundles or the hosting manifest.
