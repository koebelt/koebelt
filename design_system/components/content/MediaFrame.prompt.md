`MediaFrame` holds every image in the system at a fixed ratio with a 2px radius and an inset hairline. With no `src` it renders a labelled placeholder — use that rather than inventing artwork.

```jsx
<MediaFrame ratio="16/9" label="Case study hero" />
<MediaFrame src="/assets/work-01.jpg" alt="Poster series" ratio="4/3" />
```
