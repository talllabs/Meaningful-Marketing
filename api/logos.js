// Vercel Serverless Function: powers the /admin logo manager.
//
// GET  -> returns the current logo list (checks the password).
// POST -> saves a new logo list + any newly uploaded images as ONE commit
//         to GitHub, which makes Vercel redeploy the site (~1 minute).
//
// Needs these Vercel environment variables:
//   ADMIN_PASSWORD  - the password for /admin
//   GITHUB_TOKEN    - a GitHub token with "Contents: read & write" on this repo
// Optional:
//   GITHUB_REPO     - defaults to "talllabs/Meaningful-Marketing"
//   GITHUB_BRANCH   - defaults to the repo's default branch

const crypto = require('crypto');

const REPO = process.env.GITHUB_REPO || 'talllabs/Meaningful-Marketing';
const LIST_PATH = 'data/logos.json';
const IMAGE_DIR = 'images/logos/';
const MAX_IMAGE_BYTES = 1024 * 1024;
const FILE_RE = /^[a-z0-9-]+\.(png|jpe?g|webp|svg)$/;

function passwordOk(given) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

async function gh(path, options = {}) {
  const res = await fetch('https://api.github.com/repos/' + REPO + path, {
    ...options,
    headers: {
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'meaningful-marketing-admin',
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'GitHub request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

async function getBranch() {
  if (process.env.GITHUB_BRANCH) return process.env.GITHUB_BRANCH;
  const repo = await gh('');
  return repo.default_branch;
}

async function readList(branch) {
  const file = await gh('/contents/' + LIST_PATH + '?ref=' + encodeURIComponent(branch));
  return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
}

function slugify(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'logo';
}

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
  res.setHeader('Cache-Control', 'no-store');

  if (!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN) {
    res.status(500).json({
      error: 'The admin page is not set up yet: ADMIN_PASSWORD and GITHUB_TOKEN need to be added in Vercel.',
    });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const password = req.method === 'GET' ? req.headers['x-admin-password'] : (body || {}).password;
  if (!passwordOk(password)) {
    res.status(401).json({ error: 'Wrong password.' });
    return;
  }

  try {
    const branch = await getBranch();

    if (req.method === 'GET') {
      res.status(200).json({ logos: await readList(branch) });
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

    const current = await readList(branch);
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
        const bytes = Buffer.from(String(logo.image).replace(/^data:image\/png;base64,/, ''), 'base64');
        const isPng = bytes.length > 8 && bytes.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
        if (!isPng || bytes.length > MAX_IMAGE_BYTES) {
          res.status(400).json({ error: 'The logo "' + name + '" could not be read. Try a PNG or JPG under 1 MB.' });
          return;
        }
        file = slugify(name) + '-' + crypto.randomBytes(3).toString('hex') + '.png';
        const blob = await gh('/git/blobs', {
          method: 'POST',
          body: JSON.stringify({ content: bytes.toString('base64'), encoding: 'base64' }),
        });
        treeEntries.push({ path: IMAGE_DIR + file, mode: '100644', type: 'blob', sha: blob.sha });
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

    const ref = await gh('/git/ref/heads/' + encodeURIComponent(branch));
    const parent = await gh('/git/commits/' + ref.object.sha);
    const tree = await gh('/git/trees', {
      method: 'POST',
      body: JSON.stringify({ base_tree: parent.tree.sha, tree: treeEntries }),
    });
    const commit = await gh('/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Update logo carousel from admin page',
        tree: tree.sha,
        parents: [ref.object.sha],
      }),
    });
    await gh('/git/refs/heads/' + encodeURIComponent(branch), {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha }),
    });

    res.status(200).json({ ok: true, logos: newList });
  } catch (err) {
    console.error('Logo admin error:', err);
    const hint = err.status === 401 || err.status === 403 || err.status === 404
      ? ' (GitHub refused the request: check that GITHUB_TOKEN is valid and has write access to the repo.)'
      : err.status === 422
        ? ' (The site changed while you were editing. Reload the page and try again.)'
        : '';
    res.status(500).json({ error: 'Saving failed.' + hint });
  }
};
