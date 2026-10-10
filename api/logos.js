// Vercel Serverless Function: powers the Logos tab of the /admin page.
//
// GET  -> returns the current logo list (checks the password).
// POST -> saves a new logo list + any newly uploaded images as ONE commit
//         to GitHub, which makes Vercel redeploy the site (~1 minute).
//
// Setup (environment variables) is described in api/_admin.js.

const crypto = require('crypto');
const { authorize, getBranch, readJson, decodeImage, uploadBlob, commit, sendError, slugify } = require('./_admin');

const LIST_PATH = 'data/logos.json';
const IMAGE_DIR = 'images/logos/';
const MAX_IMAGE_BYTES = 1024 * 1024;
const FILE_RE = /^[a-z0-9-]+\.(png|jpe?g|webp|svg)$/;

function cleanUrl(url) {
  if (!url) return undefined;
  const s = String(url).trim();
  if (!s) return undefined;
  const withScheme = /^https?:\/\//i.test(s) ? s : 'https://' + s;
  try {
    return new URL(withScheme).href;
  } catch (e) {
    return undefined;
  }
}

module.exports = async function handler(req, res) {
  const body = authorize(req, res);
  if (!body) return;

  try {
    const branch = await getBranch();

    if (req.method === 'GET') {
      res.status(200).json({ logos: await readJson(LIST_PATH, branch) });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const incoming = Array.isArray(body.logos) ? body.logos : null;
    if (!incoming) {
      res.status(400).json({ error: 'No logo list was sent.' });
      return;
    }

    const current = await readJson(LIST_PATH, branch);
    const currentFiles = new Set(current.map((l) => l.file));
    const newList = [];
    const treeEntries = [];

    for (const logo of incoming) {
      const name = String(logo.name || '').trim().slice(0, 100);
      if (!name) {
        res.status(400).json({ error: 'Every logo needs a name.' });
        return;
      }
      let file = logo.file;

      if (logo.image) {
        // A newly uploaded logo: the admin page converts every upload to PNG.
        const bytes = decodeImage(logo.image, 'png', MAX_IMAGE_BYTES);
        if (!bytes) {
          res.status(400).json({ error: 'The logo "' + name + '" could not be read. Try a PNG or JPG under 1 MB.' });
          return;
        }
        file = slugify(name, 'logo') + '-' + crypto.randomBytes(3).toString('hex') + '.png';
        treeEntries.push({ path: IMAGE_DIR + file, mode: '100644', type: 'blob', sha: await uploadBlob(bytes) });
      } else if (!FILE_RE.test(String(file)) || !currentFiles.has(file)) {
        res.status(400).json({ error: 'Unknown logo file: ' + file });
        return;
      }

      const entry = { name, file };
      const url = cleanUrl(logo.url);
      if (url) entry.url = url;
      newList.push(entry);
    }

    // Delete image files for logos that were removed.
    const keptFiles = new Set(newList.map((l) => l.file));
    for (const file of currentFiles) {
      if (!keptFiles.has(file) && FILE_RE.test(file)) {
        treeEntries.push({ path: IMAGE_DIR + file, mode: '100644', type: 'blob', sha: null });
      }
    }

    treeEntries.push({
      path: LIST_PATH,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(newList, null, 2) + '\n',
    });

    await commit(branch, treeEntries, 'Update logo carousel from admin page');
    res.status(200).json({ ok: true, logos: newList });
  } catch (err) {
    sendError(res, err);
  }
};
