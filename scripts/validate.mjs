// Validates projects.json so a typo can't break the websites that load it.
// Run locally with `node scripts/validate.mjs` (no dependencies needed).
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

let projects;
try {
    projects = JSON.parse(readFileSync(join(root, 'projects.json'), 'utf8'));
} catch (e) {
    console.error(`projects.json is not valid JSON:\n  ${e.message}`);
    process.exit(1);
}
if (!Array.isArray(projects)) {
    console.error('projects.json must be a top-level array (older sites depend on this).');
    process.exit(1);
}

const isString = (v) => typeof v === 'string' && v.trim() !== '';
const isUrl = (v) => isString(v) && /^https?:\/\//.test(v);
const checkImage = (where, path) => {
    if (!isString(path)) return fail(where, 'missing image path');
    if (path.startsWith('/')) fail(where, `"${path}" must not start with "/"`);
    else if (!/^https?:\/\//.test(path) && !existsSync(join(root, path))) fail(where, `file "${path}" does not exist`);
};

const ids = new Set();
const slugs = new Set();

projects.forEach((p, i) => {
    const at = `project[${i}]${p && p.title ? ` "${p.title}"` : ''}`;

    // Required fields (also read by the gamified portfolio).
    if (!Number.isInteger(p.id)) fail(at, '"id" must be an integer');
    else if (ids.has(p.id)) fail(at, `duplicate id ${p.id}`);
    else ids.add(p.id);
    for (const key of ['title', 'description', 'category', 'status']) {
        if (!isString(p[key])) fail(at, `"${key}" must be a non-empty string`);
    }
    if (!Array.isArray(p.technologies) || !p.technologies.every(isString)) fail(at, '"technologies" must be an array of strings');
    if (typeof p.featured !== 'boolean') fail(at, '"featured" must be true or false');
    checkImage(at, p.image);
    if (!Array.isArray(p.links)) fail(at, '"links" must be an array (can be empty)');
    else p.links.forEach((l, j) => {
        if (!isString(l.type)) fail(`${at} links[${j}]`, 'missing "type"');
        if (!isUrl(l.url)) fail(`${at} links[${j}]`, '"url" must start with http(s)://');
        if (!isString(l.label)) fail(`${at} links[${j}]`, 'missing "label"');
    });

    // Optional fields.
    if (p.slug !== undefined) {
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) fail(at, `"slug" must be lowercase-with-dashes, got "${p.slug}"`);
        else if (slugs.has(p.slug)) fail(at, `duplicate slug "${p.slug}"`);
        else slugs.add(p.slug);
    }
    if (p.date !== undefined && !/^\d{4}(-\d{2})?$/.test(p.date)) fail(at, '"date" must be "YYYY" or "YYYY-MM"');
    for (const key of ['tagline', 'context', 'role', 'imageAlt']) {
        if (p[key] !== undefined && !isString(p[key])) fail(at, `"${key}" must be a non-empty string`);
    }
    if (p.highlights !== undefined && !(Array.isArray(p.highlights) && p.highlights.every(isString))) fail(at, '"highlights" must be an array of strings');
    if (p.awards !== undefined) {
        if (!Array.isArray(p.awards)) fail(at, '"awards" must be an array');
        else p.awards.forEach((a, j) => { if (!isString(a.title)) fail(`${at} awards[${j}]`, 'missing "title"'); });
    }
    if (p.story !== undefined) {
        if (!Array.isArray(p.story)) fail(at, '"story" must be an array');
        else p.story.forEach((s, j) => { if (!isString(s.body)) fail(`${at} story[${j}]`, 'missing "body"'); });
    }
    if (p.team !== undefined) {
        if (!Array.isArray(p.team)) fail(at, '"team" must be an array');
        else p.team.forEach((m, j) => {
            if (!isString(m.name)) fail(`${at} team[${j}]`, 'missing "name"');
            if (m.url !== undefined && !isUrl(m.url)) fail(`${at} team[${j}]`, '"url" must start with http(s)://');
        });
    }
    if (p.gallery !== undefined) {
        if (!Array.isArray(p.gallery)) fail(at, '"gallery" must be an array');
        else p.gallery.forEach((g, j) => {
            checkImage(`${at} gallery[${j}]`, g.src);
            if (!isString(g.alt)) fail(`${at} gallery[${j}]`, 'missing "alt" text');
        });
    }
});

if (errors.length) {
    console.error(`projects.json has ${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
}
console.log(`projects.json OK (${projects.length} projects)`);
