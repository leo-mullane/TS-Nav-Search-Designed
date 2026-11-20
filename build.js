#!/usr/bin/env node
/* build.js
 *
 * Builds the three designed versions of the Travers Smith navigation and
 * search prototype into the repository root, which GitHub Pages serves
 * (branch: main, folder: / root):
 *
 *   /index.html      the contents page comparing the three designs
 *   /a/  /b/  /c/    one complete site per design
 *
 * Every design is built from the SAME wireframe sources in src/ (the
 * greyscale v1.4 prototype). A design only adds:
 *   - css/theme.css   = designs/common.css + designs/<x>.css
 *   - js/design.js    small presentational enhancements (wordmark, the
 *                     design switcher, Design B's Services tabs)
 *   - data-design="<x>" on <html>
 * so layouts, content and search behaviour stay identical to the wireframes.
 *
 * Run from the project root:  node build.js && node validate.js a && node validate.js b && node validate.js c
 */

const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const designsDir = path.join(root, 'designs');
const DESIGNS = ['a', 'b', 'c'];

const includes = {};
for (const f of fs.readdirSync(path.join(src, 'includes'))) {
  includes[f] = fs.readFileSync(path.join(src, 'includes', f), 'utf8');
}
function resolve(content, depth = 0) {
  if (depth > 5) return content;
  let changed = false;
  const out = content.replace(/[ \t]*<!--\s*@@include\s+([\w.-]+)\s*-->/g, (m, name) => {
    if (!includes[name]) { console.warn('  ! missing include: ' + name); return m; }
    changed = true;
    return includes[name];
  });
  return changed ? resolve(out, depth + 1) : out;
}
function prefixFor(rel) {
  const depth = rel.split(path.sep).length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
}
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
}

/* Travers Smith's own logo, as served in the header of traverssmith.com
   (November 2026). Inlined so each design can colour it with CSS. */
const LOGO = fs.readFileSync(path.join(designsDir, 'ts-logo.svg'), 'utf8').trim();
const LOGO_PLACEHOLDER = '<span class="wf-placeholder logo">Travers Smith logo</span>';

let pages = 0;
for (const d of DESIGNS) {
  const out = path.join(root, d);
  fs.rmSync(out, { recursive: true, force: true });
  copyDir(path.join(src, 'css'), path.join(out, 'css'));
  copyDir(path.join(src, 'js'), path.join(out, 'js'));
  copyDir(path.join(src, 'assets'), path.join(out, 'assets'));

  /* The design layer: theme.css is the only stylesheet that changes. */
  fs.writeFileSync(path.join(out, 'css', 'theme.css'),
    fs.readFileSync(path.join(designsDir, 'common.css'), 'utf8') + '\n' +
    fs.readFileSync(path.join(designsDir, d + '.css'), 'utf8') + '\n' +
    fs.readFileSync(path.join(designsDir, 'mobile.css'), 'utf8'));
  fs.copyFileSync(path.join(designsDir, 'design.js'), path.join(out, 'js', 'design.js'));

  const build = (file, rel) => {
    let html = resolve(fs.readFileSync(file, 'utf8'))
      .replace(LOGO_PLACEHOLDER, LOGO)
      .replace(/<html lang="en-GB">/, '<html lang="en-GB" data-design="' + d + '">')
      .replace('</body>', '  <script src="~/js/design.js"></script>\n</body>')
      .replace(/(href|src|action)="~\//g, '$1="' + prefixFor(rel));
    const target = path.join(out, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
    pages += 1;
  };
  for (const f of fs.readdirSync(path.join(src, 'pages'))) {
    if (f.endsWith('.html')) build(path.join(src, 'pages', f), path.join('pages', f));
  }
  /* Each design's own index simply opens its home page. */
  fs.writeFileSync(path.join(out, 'index.html'),
    '<!DOCTYPE html>\n<html lang="en-GB" data-design="' + d + '">\n<head>\n  <meta charset="UTF-8">\n' +
    '  <meta http-equiv="refresh" content="0; url=pages/home.html">\n  <title>Design ' + d.toUpperCase() + '</title>\n</head>\n' +
    '<body>\n  <p><a href="pages/home.html">Open Design ' + d.toUpperCase() + '</a></p>\n</body>\n</html>\n');
  pages += 1;
}

/* The contents page at the root. */
copyDir(path.join(src, 'assets'), path.join(root, 'assets'));
fs.copyFileSync(path.join(designsDir, 'hub.html'), path.join(root, 'index.html'));
fs.copyFileSync(path.join(designsDir, 'hub.css'), path.join(root, 'assets', 'hub.css'));
pages += 1;

console.log('Built ' + pages + ' page(s): contents page plus designs ' + DESIGNS.join(', ').toUpperCase());
