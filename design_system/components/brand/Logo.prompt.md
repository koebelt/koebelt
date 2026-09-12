`Logo` renders the monogram from `assets/`. Because the mark's counters are transparent, the surface behind becomes part of the letterforms — always place it on a flat brand surface.

```jsx
<Logo size={40} />
<Logo variant="accent" size={32} wordmark />
```

Pass `assetBase` when the page isn't served from the root (e.g. `assetBase="../../assets/"`). Clear space: at least half the mark's width on all sides. Minimum size 24px.
