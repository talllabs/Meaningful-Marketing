// Shared helpers for the /admin page's serverless functions.
// (Files starting with "_" are not turned into routes by Vercel.)
//
// Needs these Vercel environment variables:
//   ADMIN_PASSWORD  - the password for /admin
//   GITHUB_TOKEN    - a GitHub token with "Contents: read & write" on this repo
// Optional:
//   GITHUB_REPO     - defaults to "talllabs/Meaningful-Marketing"
//   GITHUB_BRANCH   - defaults to the repo's default branch

const crypto = require('crypto');

const REPO = process.env.GITHUB_REPO || 'talllabs/Meaningful-Marketing';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

function passwordOk(given) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

// Checks setup + password. Returns the parsed body, or null after replying.
function authorize(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN) {
    res.status(500).json({
      error: 'The admin page is not set up yet: ADMIN_PASSWORD and GITHUB_TOKEN need to be added in Vercel.',
    });
    return null;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};
  const password = req.method === 'GET' ? req.headers['x-admin-password'] : body.password;
  if (!passwordOk(password)) {
    res.status(401).json({ error: 'Wrong password.' });
    return null;
  }
  return body;
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

async function readJson(path, branch) {
  const file = await gh('/contents/' + path + '?ref=' + encodeURIComponent(branch));
  return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
}

// Decodes a data URL and checks it really is the expected image type.
function decodeImage(dataUrl, type, maxBytes) {
  const bytes = Buffer.from(String(dataUrl || '').replace(/^data:[^,]*,/, ''), 'base64');
  const magic = type === 'png' ? PNG_MAGIC : JPEG_MAGIC;
  if (bytes.length <= magic.length || !bytes.slice(0, magic.length).equals(magic)) return null;
  if (bytes.length > maxBytes) return null;
  return bytes;
}

async function uploadBlob(bytes) {
  const blob = await gh('/git/blobs', {
    method: 'POST',
    body: JSON.stringify({ content: bytes.toString('base64'), encoding: 'base64' }),
  });
  return blob.sha;
}

// Saves all the changes as ONE commit, which makes Vercel redeploy the site.
async function commit(branch, treeEntries, message) {
  const ref = await gh('/git/ref/heads/' + encodeURIComponent(branch));
  const parent = await gh('/git/commits/' + ref.object.sha);
  const tree = await gh('/git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: parent.tree.sha, tree: treeEntries }),
  });
  const newCommit = await gh('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: tree.sha, parents: [ref.object.sha] }),
  });
  await gh('/git/refs/heads/' + encodeURIComponent(branch), {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });
}

function sendError(res, err) {
  console.error('Admin error:', err);
  const hint = err.status === 401 || err.status === 403 || err.status === 404
    ? ' (GitHub refused the request: check that GITHUB_TOKEN is valid and has write access to the repo.)'
    : err.status === 422
      ? ' (The site changed while you were editing. Reload the page and try again.)'
      : '';
  res.status(500).json({ error: 'Saving failed.' + hint });
}

function slugify(name, fallback) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || fallback;
}

module.exports = { authorize, gh, getBranch, readJson, decodeImage, uploadBlob, commit, sendError, slugify };
