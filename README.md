# Travers Smith: navigation and search, three designs

Three design directions for the navigation and search agreed in the greyscale
wireframes (version 1.4, https://github.com/HRHlescargotLeo/TS-Search-Nav).
Every design uses the same pages, menus, content and search; only the look
changes, so the designs can be compared like for like.

Published with GitHub Pages: **Settings → Pages → Branch: `main`, folder: `/ (root)`**.
The contents page is `index.html` at the root.

| Design | Idea | After |
|---|---|---|
| A, Linear | White, hairlines, light type, one turquoise line | Linklaters |
| B, Tabbed | Oxford blue, Services menu as three tabs | Hogan Lovells Cadwalader, Gilbert + Tobin |
| C, Dark with accent | Black header, Oxford blue menus, turquoise accent | Deloitte, EY |

## Layout

```
index.html, assets/        ← GENERATED contents page
a/  b/  c/                 ← GENERATED, one complete site per design
src/                       ← the wireframe sources (a copy of TS-Search-Nav v1.4)
designs/
  common.css               shared brand foundation (colour, type, buttons, search)
  a.css  b.css  c.css      each design's layer
  mobile.css               phone and tablet rules, applied after every design
  design.js                wordmark, design switcher, Design B's Services tabs
  hub.html  hub.css        the contents page (ClerksWell branding)
build.js                   builds src/ + designs/ into the root
validate.js                tag balance, handlers, internal links
```

## Making a change

```
node build.js && node validate.js a && node validate.js b && node validate.js c
```

Commit `designs/`, `src/` and the regenerated root files, and push to `main`.

Each design's `css/theme.css` is `common.css` + `<design>.css` + `mobile.css`;
nothing else in the wireframe CSS changes. Wireframe changes should be made in
TS-Search-Nav first and copied into `src/` here.

## Brand rules followed

From Travers Smith's design requirements (November 2026) and the design system
measured from traverssmith.com: black, Oxford blue and turquoise with tints; no
aubergine, fossil or copper; lighter weights and line work rather than block
colour; Cera Pro (Outfit is the visible stand-in, as Cera Pro is licensed); the
logo (`designs/ts-logo.svg`) is the one served on traverssmith.com, inlined at build; no
icons in the navigation; images only on the featured item, uploaded by the firm.
