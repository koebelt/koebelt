`Dialog` is the only overlay in the system. Scrim is `--scrim-page` with an 18px blur; the panel itself is a raised surface with a hairline.

```jsx
<Dialog open={open} title="Start a project" onClose={close}
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button>Send</Button></>}>
  <Field label="Email"><Input /></Field>
</Dialog>
```
