# Transcend Charter Workspace (source)

This folder is the source code for **/for-transcend/workspace/**. It is not
uploaded to the live site (see `/.vercelignore`); only the built files are.

## Making a change

```bash
cd apps/transcend-workspace
npm install
npm run build
```

`npm run build` checks the code and writes the finished site into
`/for-transcend/workspace/`. Commit both this folder and that one.

## How it works

- **Pages** (`src/pages`): Dashboard, Charters (one central charter record with
  Overview, Day by day, Cabins & rooming, Money & contracts), Guests,
  Documents, Reports.
- **Ask Transcend AI** (`src/ui/assistant.tsx`): answers questions and drafts
  updates from the open charter's saved data. It never sends anything.
- **AI import** (`src/ui/ai-import.tsx`, `src/lib/ai.ts`): reads pasted text,
  CSV, Excel, Word, PDF and photos, suggests records, and saves only what a
  person approves. Guests are never marked "Verified" and waivers/contracts
  are never marked "Signed" by AI.
- **Needs attention & rooming matches** (`src/lib/insights.ts`): calculated
  from the saved records.
- **Saving** (`src/lib/store.ts`): everything, including uploaded files, is kept
  in the browser (IndexedDB). Reports > Download backup / Restore backup moves
  it between computers.
- **Server**: `/api/transcend-ingest.js` calls OpenAI using the existing
  `OPENAI_API_KEY` Vercel variable (optional `TRANSCEND_AI_MODEL`, default
  `gpt-4o-mini`).

`ORIGINAL-README.md` is the README from the original exported pilot.
