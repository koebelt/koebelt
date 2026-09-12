`Icon` renders a Lucide outline glyph inline (path data lives in `icons-data.js`, bundled — no CDN fetch, no CSS mask). Use it anywhere a glyph is needed — never hand-drawn SVG, never emoji.

```jsx
<Icon name="arrow-up-right" size={18} />
<Icon name="mail" size={24} color="var(--accent)" />
```

House glyphs (already extracted in `icons-data.js`): `arrow-up-right`, `arrow-right`, `mail`, `github`, `linkedin`, `instagram`, `download`, `menu`, `x`, `plus`, `check`, `info`, `triangle-alert`, `circle-alert`, `chevron-down`. Add more by pulling a Lucide SVG's `<path>` elements into the same map.
