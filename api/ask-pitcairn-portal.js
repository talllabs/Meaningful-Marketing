// Vercel Serverless Function: answers questions about the Pitcairn Portal
// using OpenAI, grounded only in the curated project notes below plus the
// Q&As in data/pitcairn-portal-faq.json.
//
// To teach it something new: add a Q&A to data/pitcairn-portal-faq.json
// (it also shows on the page), or add a line to PROJECT_NOTES below.

const FAQ = require('../data/pitcairn-portal-faq.json');

const PROJECT_NOTES = `
STATUS (as of ${FAQ.updated})
- The Pitcairn Portal is a working demo being refined. It is NOT live to the
  public yet. No launch date has been set.
- Next steps: (1) a design review with the marketing team, (2) "acceptance"
  walk-throughs where the tourism office and the finance team try it and say
  what's missing, (3) integration: putting it on the website, choosing a
  payment company, and sorting out how the sailing schedule gets loaded in.
- A follow-up walk-through with the tourism office and finance was planned for
  about two weeks after late October 2026. The plan is to walk through the full
  journey for each type of traveller together.
- The core scope is booking a Silver Supporter berth together with
  accommodation. Tours and activities were a "nice to have," not something
  needed for launch.
- The developer adds new features quickly, so small gaps (a missing button or
  field) are usually quick fixes. Design decisions take longer than building.

THE PARTS OF THE PORTAL (about six connected sites, each for a different group)
1. Public booking portal (travellers)
   - Designed to sit inside a page on visitpitcairn.pn, which is why it looks
     plain on its own (the website supplies the header and menu).
   - Start by picking dates on a calendar (only sailing dates are clickable) or
     by browsing places to stay. There is also a path for cruise ship visitors
     who just want an Island Pass.
   - Places to stay show as available or unavailable. Sample photos are being
     replaced with real photos and details.
   - Travellers sign in / create an account to book.
   - A step-by-step guided process: traveller details, adding party members by
     email, accommodation. Each party member gets an email to add their own
     passport, medical, emergency contact, travel insurance and flight
     confirmation details. The booking can't be completed until required steps
     are done.
   - No single cabins on the Silver Supporter. Travellers do NOT choose or rank
     cabins. Agreed direction: one open text box, e.g. "Single occupancy is not
     available. Please tell us anything we should consider when assigning
     rooms." Room sharing is complex (people travelling together may not share;
     people travelling separately may want to; accessibility needs).
   - Bookings start with a short hold like normal booking sites. Exactly when a
     hold becomes a firm request, and how long a request stays pending, is
     still being confirmed by the developer. Pending requests stay open until
     confirmed or turned down.
   - Before the portal, Silver Supporter bookings were paid by invoice, normally
     by bank transfer.
2. Admin portal (tourism office)
   - Upcoming sailings with beds booked and beds not yet assigned.
   - Voyage numbers are shown prominently (inbound and outbound share a number).
   - Drag-and-drop cabin assignment for each sailing.
   - Sailings can be added by importing a spreadsheet (CSV) or by hand, and
     sailing dates can be edited directly.
   - Users and roles: anyone who signs up starts as a traveller. Admins can make
     someone a resident (gets resident rates), vendor, agent or admin. Nobody can
     be made a system admin from here, on purpose.
   - Admins can manage any accommodation on an owner's behalf (property >
     bedrooms > beds) and confirm booking requests for owners who'd rather not
     use the system. Existing listings are being copied in from the current
     website so owners don't start from scratch. New properties can be added at
     any time.
   - Paper slip entry for the Island Pass.
   - A simple bulletin board (nice to have), e.g. upcoming cruise ship visits.
   - Trip management (being built as of late October 2026): look up any person,
     see their voyages and stays, and move them to a different voyage (e.g. they
     got sick and need the next boat). Until that's finished, those changes are
     made in the technical back end.
3. Vendor portal (accommodation owners and people offering services)
   - Works on a phone. Dashboard, listings, booking requests, calendar.
   - Calendar can block dates for a whole property or one bedroom (shown as an
     "off-platform booking"), e.g. family visiting, owner off island, repairs.
   - Listings can be unpublished (hidden from the public site, not deleted).
     This is easy in the admin portal; making it easier to find in the vendor
     portal is being improved.
   - A services/tours section exists but hasn't been tested much. Whether a
     price must always be set isn't known yet. Tours aren't a launch priority.
   - Island Pass checkout on the phone, including a signature. Works offline and
     syncs later. A full-screen "kiosk" mode is being added so the customer
     doesn't see the vendor's private info.
4. Agent portal (approved travel agents)
   - Only people an admin approves as agents can use it.
   - A fast, high-detail booking screen for agents who book groups. The agent
     sets up the trip and people; each traveller gets an email link to complete
     their own details.
   - Will also be used by the tourism office for groups such as scientific
     teams (e.g. RSPB), contractors and government visitors (doctor, teacher,
     officials). Someone who is both an admin and an agent will also see
     restricted options (like government housing or Marine Science Base beds)
     that tourists and regular agents never see. That part is being added.
   - The name might change to something like "third-party booking."
   - How agents are paid today (commission, net rates, etc.) needs to be
     confirmed with the tourism office. There is no plan to start paying
     commissions.
5. Finance portal (Pitcairn Islands Office finance)
   - A central ledger: payments in (including bank transfers), vendor accounts,
     balances, and recording payouts to vendors.
   - Shows exactly how much each vendor is owed out of a lump-sum deposit, so
     paying people out is about a ten-minute job. Vendors can see a breakdown
     of what each payment covers.
6. System admin (technical back end)
   - For technical support only. Every action in the system is recorded in a
     searchable history, so nothing changes without a record.
   - Can override or fix anything the other screens don't yet allow.
   - Can run on several cloud machines at once. Only the system owners, with
     engineering help, get this level of access.

ISLAND PASS
- Optional, like signing to your room at a resort. Visitors (including cruise
  ship passengers) register a card and get a three-digit number plus an email.
- Vendor enters the number, the visitor's name (a check against typos), what was
  bought and the price; the visitor signs. Or paper slips are handed to the
  tourism office to enter (and keep the signed slip).
- Charges are processed shortly after visitors leave (e.g. by the Tuesday after
  a Sunday departure). Vendors are then paid out.
- Card disputes can happen. A signed slip is strong evidence but not foolproof.
  Proposed: vendors sign something saying they understand they carry that risk,
  and build it into their prices.
- If every vendor ends up with tap-to-pay, the Island Pass may not be needed.
  It's simple to switch on or leave off.

PAYMENTS (NOT DECIDED)
- The payment company has not been chosen. The options are Stripe and the
  existing Shopify setup. The developer can connect either one easily.
- Reasons for Stripe: lower fees, a separate report for each vendor, clearer
  descriptions on card statements, and vendors can't see each other's sales.
- Shopify concerns: about 4.5% fees, everything shows as one lump sum under the
  artisan gallery, a lot of extra admin work, and tap-to-pay users may be able
  to see everyone's transactions.
- A Stripe account application was still waiting for approval.
- International card fees were estimated at around 5–5.5%. Fees on the
  roughly $6,000 Silver Supporter fare are a real concern.
- Card surcharges: on-island sales can carry a surcharge, based on earlier legal
  advice. Charges handled in New Zealand (like the berth fare) need further
  advice, and New Zealand is bringing in a ban on card surcharges.
- Silver Supporter pricing and the per-day island fee are tourism decisions
  under discussion. Nothing has changed.

SAILING SCHEDULE (OPEN QUESTIONS)
- The tourism office sends the schedule about once or twice a year as a
  spreadsheet, and the layout changes. How it gets loaded into the portal isn't
  decided. Ideas: an AI-assisted upload that understands any spreadsheet, or a
  schedule tool in the portal that the tourism office uses and can export as a
  PDF or Excel file.
- How to handle cancelled voyages and renumbering is open. The portal treats
  voyage numbers like flight numbers. A guided "remove a voyage, shift the
  numbers?" option is being considered. To be worked out with the tourism office.

WEBSITE INTEGRATION
- The portal is meant to be the single source of truth for places to stay and
  the shipping schedule, shown live on the public website.
- A search-engine-friendly accommodation listing that drops into the website is
  built. A mock-up of the "Where to Stay" page using it was planned.
- The shipping schedule will be shown on the website the same way.
- The wider idea of connecting the government website too was raised but not
  decided.

WHO DOES WHAT AFTER LAUNCH
- Much less emailing, scanning and printing for booking paperwork.
- The finance team still handles paying vendors and checking the books.
- The tourism office runs the admin portal: assigning cabins, helping vendors,
  and keeping calendars accurate. A regular check-in with owners and a
  "fresh calendar" reminder were suggested.
- If a booking request is turned down, the idea is to show the traveller ALL
  places available for their dates, never a hand-picked few, for fairness.
  Proposed, not final. Reviews were mentioned as something to look at later.
`.trim();

const FAQ_TEXT = FAQ.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');

const SYSTEM_PROMPT = `
You are the "Ask about the Pitcairn Portal" helper on a page for Pitcairn
Islands Tourism. You give straight, honest answers about the Pitcairn Portal
(the new booking and management system) to the people who will use it.

YOUR ONLY SOURCES OF TRUTH
=== APPROVED Q&A ===
${FAQ_TEXT}

=== PROJECT NOTES ===
${PROJECT_NOTES}

RULES
- Answer ONLY from the sources above. Never guess, assume or fill gaps with
  "typical" booking-system behaviour.
- If something is marked as not decided, being built, or to be confirmed, say
  so plainly ("That hasn't been decided yet" / "That's still being built").
- If the answer isn't in the sources, say: "I don't have an answer to that yet."
  Then suggest raising it with the portal project team. Do not invent a contact.
- Never quote, mention or refer to meetings, calls, transcripts, recordings or
  who said what. Just state the facts.
- Don't discuss individual people, staffing changes or anything personal.
- Plain, friendly language. Short answers: 1-4 sentences, or a few short bullet
  points (lines starting with "- ") when listing. You may use **bold** sparingly.
- Off-topic questions (not about the portal): politely say you can only help
  with the Pitcairn Portal.
`.trim();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const question = (body && body.question ? String(body.question) : '').trim().slice(0, 500);
  if (!question) {
    res.status(400).json({ error: 'Please include a question.' });
    return;
  }

  // Keep the last few turns so follow-ups like "what about agents?" make sense.
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  const priorTurns = history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'The assistant is not configured yet (missing OPENAI_API_KEY).' });
    return;
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...priorTurns,
          { role: 'user', content: question },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('OpenAI error', upstream.status, detail);
      res.status(502).json({ error: "Sorry, I couldn't get an answer just now. Please try again in a moment." });
      return;
    }

    const data = await upstream.json();
    const answer = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content.trim()
      : "Sorry, I couldn't come up with an answer to that.";

    res.status(200).json({ answer });
  } catch (err) {
    console.error('ask-pitcairn-portal handler error', err);
    res.status(500).json({ error: 'Sorry, something went wrong answering that. Please try again.' });
  }
};
