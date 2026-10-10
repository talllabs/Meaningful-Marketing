// Vercel Serverless Function: powers the Headshots tab of the /admin page.
//
// GET  -> returns each person's photo + crop settings (checks the password).
// POST -> saves the finished two-circle image (made in the browser), the
//         crop settings, and any newly uploaded photos as ONE commit.
//
// The finished image replaces "images/ally and brad.png", which is the file
// every page already uses, so no page needs editing.
// Setup (environment variables) is described in api/_admin.js.

const crypto = require('crypto');
const { authorize, getBranch, readJson, decodeImage, uploadBlob, commit, sendError, slugify } = require('./_admin');

const DATA_PATH = 'data/headshots.json';
const COMPOSITE_PATH = 'images/ally and brad.png';
const PHOTO_DIR = 'images/team/';
const MAX_COMPOSITE_BYTES = 3 * 1024 * 1024;
const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;
const FILE_RE = /^[a-z0-9-]+\.jpg$/;

function clamp(n, min, max, fallback) {
  n = Number(n);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

module.exports = async function handler(req, res) {
  const body = authorize(req, res);
  if (!body) return;

  try {
    const branch = await getBranch();
    const current = await readJson(DATA_PATH, branch);

    if (req.method === 'GET') {
      res.status(200).json(current);
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const incoming = Array.isArray(body.people) ? body.people : [];
    if (incoming.length !== current.people.length) {
      res.status(400).json({ error: 'Both headshots need to be sent.' });
      return;
    }

    const composite = decodeImage(body.composite, 'png', MAX_COMPOSITE_BYTES);
    if (!composite) {
      res.status(400).json({ error: 'The finished headshot image could not be read. Please try again.' });
      return;
    }

    const treeEntries = [
      { path: COMPOSITE_PATH, mode: '100644', type: 'blob', sha: await uploadBlob(composite) },
    ];
    const people = [];

    for (let i = 0; i < incoming.length; i++) {
      const before = current.people[i];
      const person = incoming[i];
      let file = before.file;

      if (person.image) {
        // A new photo: the admin page converts every upload to JPEG.
        const bytes = decodeImage(person.image, 'jpeg', MAX_PHOTO_BYTES);
        if (!bytes) {
          res.status(400).json({ error: 'The photo for ' + before.name + ' could not be read. Try a JPG or PNG.' });
          return;
        }
        file = slugify(before.name, 'person') + '-' + crypto.randomBytes(3).toString('hex') + '.jpg';
        treeEntries.push({ path: PHOTO_DIR + file, mode: '100644', type: 'blob', sha: await uploadBlob(bytes) });
        if (FILE_RE.test(before.file)) {
          treeEntries.push({ path: PHOTO_DIR + before.file, mode: '100644', type: 'blob', sha: null });
        }
      }

      people.push({
        name: before.name,
        file,
        zoom: clamp(person.zoom, 1, 5, 1),
        x: clamp(person.x, 0, 1, 0.5),
        y: clamp(person.y, 0, 1, 0.5),
      });
    }

    treeEntries.push({
      path: DATA_PATH,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify({ people }, null, 2) + '\n',
    });

    await commit(branch, treeEntries, 'Update headshots from admin page');
    res.status(200).json({ ok: true, people });
  } catch (err) {
    sendError(res, err);
  }
};
