// Vercel Serverless Function for the private "Pitch Pages" dashboard
// (admin.meaningfulmarketinghouse.com → /admin/pitches.html).
//
// GET  (header x-admin-password)            → list every top-level for-* page
// POST {password, action: 'delete', name}   → delete one for-* page in one commit
//
// Uses the same Vercel environment variables as the existing /admin page:
//   admin_pw (the password), GITHUB_TOKEN (Contents: read & write), optional GITHUB_REPO,
//   GITHUB_BRANCH, and optional SITE_URL (defaults to the live site).

const { authorize, gh, getBranch, commit, sendError } = require('./_admin');

const SITE_URL = (process.env.SITE_URL || 'https://www.meaningfulmarketinghouse.com').replace(/\/+$/, '');
const NAME_RE = /^for-[a-z0-9-]+(\.html)?$/;
const PW_RE = /(?:CORRECT_PW|PASSWORD|PASS|PW)\w*\s*=\s*['"]([^'"]{1,60})['"]/;

function decode(blob) {
  return Buffer.from(blob.content || '', 'base64').toString('utf8');
}

function htmlTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
}

function metaDescription(html) {
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  return m ? m[1].replace(/&amp;/g, '&').trim() : '';
}

// Which files belong to one for-* page (a folder, or a single .html file).
function filesFor(name, blobs) {
  if (name.endsWith('.html')) return blobs.filter((b) => b.path === name);
  return blobs.filter((b) => b.path.startsWith(name + '/'));
}

// The page's "Ask Us Anything" helper, if it has one (e.g. for-first-5 → api/ask-first5.js).
function apiFileFor(slug, blobs) {
  const candidates = ['api/ask-' + slug + '.js', 'api/ask-' + slug.replace(/-/g, '') + '.js'];
  const hit = blobs.find((b) => candidates.includes(b.path));
  return hit ? hit.path : null;
}

// Shared folders every page uses; never listed as "also uses".
const COMMON_DIRS = new Set(['css', 'js', 'images', 'api', 'admin', 'data', 'apps']);

// Other top-level folders this page links to (e.g. its mockup lives elsewhere).
function linkedFolders(name, html, topDirs) {
  const found = new Set();
  const re = /(?:href|src)=["']\/?([a-z0-9][a-z0-9_-]*)\//gi;
  let m;
  while ((m = re.exec(html))) {
    const dir = m[1];
    if (topDirs.has(dir) && !COMMON_DIRS.has(dir) && !dir.startsWith('for-') && dir !== name) found.add(dir);
  }
  return [...found].sort();
}

async function readBlob(sha) {
  return decode(await gh('/git/blobs/' + sha));
}

async function describe(name, blobs, robotsTxt, branch, topDirs) {
  const slug = name.replace(/\.html$/, '').replace(/^for-/, '');
  const files = filesFor(name, blobs);
  const mainPath = name.endsWith('.html') ? name : name + '/index.html';
  const main = blobs.find((b) => b.path === mainPath);
  const html = main ? await readBlob(main.sha) : '';

  let password = (html.match(PW_RE) || [])[1] || '';
  if (!password) {
    const gate = files.find((f) => /(^|\/)gate\.js$/.test(f.path));
    if (gate) password = ((await readBlob(gate.sha)).match(PW_RE) || [])[1] || '';
  }

  let lastUpdated = null;
  try {
    const commits = await gh('/commits?sha=' + encodeURIComponent(branch) + '&path=' + encodeURIComponent(name) + '&per_page=1');
    if (commits[0]) {
      lastUpdated = {
        date: commits[0].commit.committer.date,
        message: commits[0].commit.message.split('\n')[0].slice(0, 140),
      };
    }
  } catch (e) { /* not fatal: the list still works without it */ }

  const urlPath = '/' + name.replace(/\.html$/, '');
  const robotsBlocked = robotsTxt.split('\n').some((line) => {
    const m = line.match(/^\s*Disallow:\s*(\S+)/i);
    return m && (urlPath + '/').startsWith(m[1].replace(/\/?$/, '/'));
  });

  return {
    name,
    slug,
    url: SITE_URL + urlPath,
    title: htmlTitle(html),
    description: metaDescription(html),
    password,
    lastUpdated,
    fileCount: files.length,
    pageCount: files.filter((f) => f.path.endsWith('.html')).length,
    sizeBytes: files.reduce((sum, f) => sum + (f.size || 0), 0),
    alsoUses: linkedFolders(name, html, topDirs),
    aiHelper: apiFileFor(name.replace(/\.html$/, '').replace(/^for-/, ''), blobs),
    hiddenFromSearch: /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html) || robotsBlocked,
    robotsBlocked,
  };
}

async function loadTree(branch) {
  const tree = await gh('/git/trees/' + encodeURIComponent(branch) + '?recursive=1');
  const blobs = tree.tree.filter((t) => t.type === 'blob');
  const names = tree.tree
    .filter((t) => !t.path.includes('/') && NAME_RE.test(t.path) && (t.type === 'tree' || t.path.endsWith('.html')))
    .map((t) => t.path);
  const topDirs = new Set(tree.tree.filter((t) => t.type === 'tree' && !t.path.includes('/')).map((t) => t.path));
  return { blobs, names, topDirs };
}

module.exports = async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = authorize(req, res);
  if (!body) {
    // Slow down password guessing a little.
    await new Promise((r) => setTimeout(r, 800));
    return;
  }

  try {
    const branch = await getBranch();
    const { blobs, names, topDirs } = await loadTree(branch);
    const robots = blobs.find((b) => b.path === 'robots.txt');
    const robotsTxt = robots ? await readBlob(robots.sha) : '';

    if (req.method === 'GET') {
      const pages = await Promise.all(names.map((n) => describe(n, blobs, robotsTxt, branch, topDirs)));
      pages.sort((a, b) => ((b.lastUpdated && b.lastUpdated.date) || '').localeCompare((a.lastUpdated && a.lastUpdated.date) || ''));
      res.status(200).json({ pages, branch, siteUrl: SITE_URL });
      return;
    }

    // ---- DELETE ----
    if (body.action !== 'delete') {
      res.status(400).json({ error: 'Unknown action.' });
      return;
    }
    const name = String(body.name || '');
    if (!NAME_RE.test(name) || !names.includes(name)) {
      res.status(400).json({ error: 'That page was not found. Reload the list and try again.' });
      return;
    }

    const slug = name.replace(/\.html$/, '').replace(/^for-/, '');
    const remove = filesFor(name, blobs).map((f) => f.path);
    const apiFile = apiFileFor(slug, blobs);
    if (apiFile) remove.push(apiFile);

    const entries = remove.map((path) => ({ path, mode: '100644', type: 'blob', sha: null }));

    // Also drop its line from robots.txt, so robots.txt doesn't point at a deleted page.
    const urlPath = '/' + name.replace(/\.html$/, '');
    const newRobots = robotsTxt.split('\n').filter((line) => {
      const m = line.match(/^\s*Disallow:\s*(\S+)/i);
      return !(m && m[1].replace(/\/$/, '') === urlPath);
    }).join('\n');
    if (robots && newRobots !== robotsTxt) {
      entries.push({ path: 'robots.txt', mode: '100644', type: 'blob', content: newRobots });
    }

    await commit(branch, entries, 'Remove ' + urlPath + ' (deleted from the admin dashboard)');
    res.status(200).json({ ok: true, removed: remove });
  } catch (err) {
    sendError(res, err);
  }
};
