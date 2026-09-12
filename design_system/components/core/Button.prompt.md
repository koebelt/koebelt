Use `Button` for any committed action — submit, download, open a case study. One `primary` per view; everything else is `secondary` or `ghost`.

```jsx
<Button variant="primary" size="lg" iconRight={<Icon name="arrow-up-right" />}>View work</Button>
<Button variant="secondary">Download CV</Button>
```

Variants: `primary` (lime on dark), `secondary` (hairline outline), `ghost` (text only), `inverse` (white fill, for use on top of lime or imagery). Sizes 32 / 44 / 56px. Labels are always uppercase and short — two words maximum.
