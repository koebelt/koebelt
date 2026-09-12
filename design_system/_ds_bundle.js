/* @ds-bundle: {"format":4,"namespace":"KOEBELTDesignSystem_35e9bf","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Marquee","sourcePath":"components/brand/Marquee.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"MediaFrame","sourcePath":"components/content/MediaFrame.jsx"},{"name":"ProjectCard","sourcePath":"components/content/ProjectCard.jsx"},{"name":"Quote","sourcePath":"components/content/Quote.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"WorkRow","sourcePath":"components/content/WorkRow.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ICONS","sourcePath":"components/core/icons-data.js"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Notice","sourcePath":"components/feedback/Notice.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"FooterBar","sourcePath":"components/navigation/FooterBar.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"94bdc441d894","components/brand/Marquee.jsx":"f6f648a77c77","components/content/Card.jsx":"e2999ea918e4","components/content/MediaFrame.jsx":"74566fbb5867","components/content/ProjectCard.jsx":"cdb238758f03","components/content/Quote.jsx":"4f23c8b5e812","components/content/SectionHeading.jsx":"644afbb41e0f","components/content/WorkRow.jsx":"2cefa670635c","components/core/Badge.jsx":"97f41a19e49b","components/core/Button.jsx":"5cee81aa02a8","components/core/Divider.jsx":"999816aba51a","components/core/Icon.jsx":"6383bb9b201e","components/core/IconButton.jsx":"7272ac6a4681","components/core/Tag.jsx":"d22bd8fc7f83","components/core/icons-data.js":"7a02b13b27c1","components/feedback/Dialog.jsx":"7051a7e83916","components/feedback/Notice.jsx":"b3363c33c4cb","components/forms/Checkbox.jsx":"110eba8fe3a9","components/forms/Field.jsx":"18651f19c9a7","components/forms/Input.jsx":"02f992dc04b4","components/forms/Select.jsx":"19a9e3136ecc","components/forms/Switch.jsx":"30bced35ace1","components/forms/Textarea.jsx":"f1d18a0cc1b4","components/navigation/FooterBar.jsx":"bd2acab0718a","components/navigation/NavBar.jsx":"196def3d0402","components/navigation/Tabs.jsx":"868fd5bb151c","ui_kits/cv/CV.jsx":"0f2d33a6e692"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KOEBELTDesignSystem_35e9bf = window.KOEBELTDesignSystem_35e9bf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SRC = {
  white: "logo-mark-white.png",
  dark: "logo-mark-dark.png",
  accent: "logo-mark-accent.png"
};
const RES_ID = {
  white: "logowhite",
  dark: "logodark",
  accent: "logoaccent"
};
function Logo({
  variant = "white",
  size = 36,
  wordmark = false,
  assetBase = "/assets/",
  style,
  ...rest
}) {
  const color = variant === "dark" ? "var(--ink-700)" : variant === "accent" ? "var(--accent)" : "var(--white)";
  const resolvedSrc = typeof window !== "undefined" && window.__resources && window.__resources[RES_ID[variant]] || assetBase + SRC[variant];
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: resolvedSrc,
    alt: "KOEBELT",
    width: size,
    height: size,
    style: {
      display: "block",
      width: size,
      height: size
    }
  }), wordmark && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-semibold) " + size * 0.55 + "px/1 var(--font-display)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color
    }
  }, "KOEBELT"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Marquee.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Marquee({
  items = [],
  speed = 28,
  separator = "/",
  style,
  ...rest
}) {
  const run = [...items, ...items];
  const id = React.useMemo(() => "kb-mq-" + Math.random().toString(36).slice(2, 7), []);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      overflow: "hidden",
      borderTop: "var(--border-width) solid var(--border-hairline)",
      borderBottom: "var(--border-width) solid var(--border-hairline)",
      padding: "var(--space-5) 0",
      ...style
    }
  }), /*#__PURE__*/React.createElement("style", null, "@keyframes " + id + "{from{transform:translateX(0)}to{transform:translateX(-50%)}}"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "max-content",
      gap: "var(--space-9)",
      animation: id + " " + speed + "s linear infinite"
    }
  }, run.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      gap: "var(--space-9)",
      alignItems: "center",
      font: "var(--text-label-md)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-secondary)",
      whiteSpace: "nowrap"
    }
  }, t, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, separator)))));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Marquee.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  padding = "var(--space-7)",
  interactive = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-raised)",
      borderRadius: "var(--radius-card)",
      border: "var(--border-width) solid var(--border-hairline)",
      padding,
      transition: "var(--transition-control)",
      ...(interactive ? {
        cursor: "pointer"
      } : null),
      ...(interactive && hover ? {
        borderColor: "var(--border-subtle)",
        background: "var(--surface-hover)"
      } : null),
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/MediaFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MediaFrame({
  src,
  alt = "",
  ratio = "4/3",
  label = "Image",
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: "relative",
      aspectRatio: ratio,
      overflow: "hidden",
      borderRadius: "var(--radius-media)",
      background: "var(--surface-sunken)",
      boxShadow: "var(--shadow-inset-hairline)",
      ...style
    }
  }), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-faint)"
    }
  }, label), children);
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/content/Quote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Quote({
  children,
  attribution,
  role,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("figure", _extends({}, rest, {
    style: {
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-7)",
      borderLeft: "var(--border-width-strong) solid var(--accent)",
      paddingLeft: "var(--space-8)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      font: "var(--text-heading-md)",
      letterSpacing: "var(--tr-heading)",
      color: "var(--text-primary)",
      maxWidth: "32ch",
      textWrap: "pretty"
    }
  }, children), (attribution || role) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, attribution, role && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-faint)"
    }
  }, " / ", role)));
}
Object.assign(__ds_scope, { Quote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Quote.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
      borderTop: "var(--border-width) solid var(--border-hairline)",
      paddingTop: "var(--space-6)",
      textAlign: align,
      ...style
    }
  }), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-accent)"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--space-8)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-heading-lg)",
      letterSpacing: "var(--tr-heading)",
      maxWidth: "20ch"
    }
  }, title), action), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-lg)",
      color: "var(--text-muted)",
      maxWidth: "var(--measure-prose)"
    }
  }, description));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  positive: "var(--signal-positive)",
  warning: "var(--signal-warning)",
  negative: "var(--signal-negative)",
  info: "var(--signal-info)",
  accent: "var(--accent)"
};
function Badge({
  tone = "positive",
  dot = true,
  children,
  style,
  ...rest
}) {
  const c = tones[tone];
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: c,
      ...style
    }
  }), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "var(--radius-pill)",
      background: c,
      flex: "0 0 auto"
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--space-3)",
  border: "var(--border-width) solid transparent",
  borderRadius: "var(--radius-control)",
  font: "var(--text-label-md)",
  letterSpacing: "var(--tr-label)",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "var(--transition-control)",
  textDecoration: "none",
  whiteSpace: "nowrap"
};
const sizes = {
  sm: {
    height: 32,
    padding: "0 var(--space-4)",
    fontSize: "var(--fs-label-sm)"
  },
  md: {
    height: 44,
    padding: "0 var(--space-6)",
    fontSize: "var(--fs-label-md)"
  },
  lg: {
    height: 56,
    padding: "0 var(--space-8)",
    fontSize: "var(--fs-label-md)"
  }
};
const variants = {
  primary: {
    background: "var(--accent)",
    color: "var(--text-on-accent)",
    borderColor: "var(--accent)"
  },
  secondary: {
    background: "transparent",
    color: "var(--text-primary)",
    borderColor: "var(--border-subtle)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    borderColor: "transparent"
  },
  inverse: {
    background: "var(--surface-inverse)",
    color: "var(--text-inverse)",
    borderColor: "var(--surface-inverse)"
  }
};
const hovers = {
  primary: {
    background: "var(--accent-hover)",
    borderColor: "var(--accent-hover)"
  },
  secondary: {
    borderColor: "var(--border-strong)"
  },
  ghost: {
    color: "var(--text-primary)",
    background: "var(--white-a08)"
  },
  inverse: {
    background: "var(--ink-050)",
    borderColor: "var(--ink-050)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  as = "button",
  href,
  children,
  style,
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const Tag = as === "a" ? "a" : "button";
  const s = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    ...(press && !disabled ? {
      transform: "scale(var(--press-scale))"
    } : null),
    ...(disabled ? {
      opacity: .38,
      cursor: "not-allowed"
    } : null),
    ...(fullWidth ? {
      width: "100%"
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    href: Tag === "a" ? href : undefined,
    style: s,
    disabled: Tag === "button" ? disabled : undefined,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Divider({
  label,
  tone = "hairline",
  style,
  ...rest
}) {
  const c = tone === "strong" ? "var(--border-strong)" : tone === "accent" ? "var(--border-accent)" : "var(--border-hairline)";
  if (!label) return /*#__PURE__*/React.createElement("hr", _extends({}, rest, {
    style: {
      border: 0,
      height: 1,
      background: c,
      margin: 0,
      ...style
    }
  }));
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      flex: "0 0 auto"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: c
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: {
    background: "transparent",
    color: "var(--text-muted)",
    borderColor: "var(--border-hairline)"
  },
  accent: {
    background: "var(--surface-accent-soft)",
    color: "var(--text-accent)",
    borderColor: "var(--lime-a32)"
  },
  solid: {
    background: "var(--accent)",
    color: "var(--text-on-accent)",
    borderColor: "var(--accent)"
  }
};
function Tag({
  tone = "neutral",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 26,
      padding: "0 var(--space-4)",
      borderRadius: "var(--radius-tag)",
      border: "var(--border-width) solid",
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      ...tones[tone],
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/icons-data.js
try { (() => {
const ICONS = {
  "arrow-up-right": ["<path d=\"M7 7h10v10\"/>", "<path d=\"M7 17 17 7\"/>"],
  "arrow-right": ["<path d=\"M5 12h14\"/>", "<path d=\"m12 5 7 7-7 7\"/>"],
  "mail": ["<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\"/>", "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/>"],
  "github": ["<path d=\"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4\"/>", "<path d=\"M9 18c-4.51 2-5-2-7-2\"/>"],
  "linkedin": ["<path d=\"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z\"/>", "<rect width=\"4\" height=\"12\" x=\"2\" y=\"9\"/>", "<circle cx=\"4\" cy=\"4\" r=\"2\"/>"],
  "instagram": ["<rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"5\" ry=\"5\"/>", "<path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/>", "<line x1=\"17.5\" x2=\"17.51\" y1=\"6.5\" y2=\"6.5\"/>"],
  "download": ["<path d=\"M12 15V3\"/>", "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/>", "<path d=\"m7 10 5 5 5-5\"/>"],
  "menu": ["<path d=\"M4 5h16\"/>", "<path d=\"M4 12h16\"/>", "<path d=\"M4 19h16\"/>"],
  "x": ["<path d=\"M18 6 6 18\"/>", "<path d=\"m6 6 12 12\"/>"],
  "plus": ["<path d=\"M5 12h14\"/>", "<path d=\"M12 5v14\"/>"],
  "check": ["<path d=\"M20 6 9 17l-5-5\"/>"],
  "info": ["<circle cx=\"12\" cy=\"12\" r=\"10\"/>", "<path d=\"M12 16v-4\"/>", "<path d=\"M12 8h.01\"/>"],
  "triangle-alert": ["<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/>", "<path d=\"M12 9v4\"/>", "<path d=\"M12 17h.01\"/>"],
  "circle-alert": ["<circle cx=\"12\" cy=\"12\" r=\"10\"/>", "<line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"/>", "<line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"/>"],
  "chevron-down": ["<path d=\"m6 9 6 6 6-6\"/>"]
};
Object.assign(__ds_scope, { ICONS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/icons-data.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 18,
  color = "currentColor",
  style,
  ...rest
}) {
  const els = __ds_scope.ICONS[name];
  if (!els) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({}, rest, {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      display: "inline-block",
      flex: "0 0 auto",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: els.join("")
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProjectCard({
  title,
  year,
  summary,
  tags = [],
  image,
  ratio = "4/3",
  href = "#",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({}, rest, {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
      textDecoration: "none",
      border: 0,
      color: "var(--text-primary)",
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.MediaFrame, {
    src: image,
    ratio: ratio,
    label: title,
    style: {
      transition: "var(--transition-control)",
      boxShadow: hover ? "inset 0 0 0 1px var(--accent)" : "var(--shadow-inset-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "var(--space-4)",
      right: "var(--space-4)",
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xs)",
      background: hover ? "var(--accent)" : "var(--ink-a70)",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 16,
    style: {
      background: hover ? "var(--text-on-accent)" : "var(--white)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--text-heading-sm)",
      letterSpacing: "var(--tr-heading)",
      color: hover ? "var(--accent)" : "var(--text-primary)",
      transition: "var(--transition-control)"
    }
  }, title), year && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      color: "var(--text-faint)",
      flex: "0 0 auto"
    }
  }, year)), summary && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-muted)",
      maxWidth: "var(--measure-narrow)"
    }
  }, summary), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)",
      marginTop: "var(--space-2)"
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: t
  }, t)))));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/content/WorkRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function WorkRow({
  index,
  title,
  discipline,
  year,
  href = "#",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({}, rest, {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "grid",
      gridTemplateColumns: "48px 1fr 200px 80px 24px",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "var(--space-6) 0",
      textDecoration: "none",
      border: 0,
      borderTop: "var(--border-width) solid var(--border-hairline)",
      color: hover ? "var(--accent)" : "var(--text-primary)",
      transition: "var(--transition-control)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      color: "var(--text-faint)"
    }
  }, index), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-heading-sm)",
      letterSpacing: "var(--tr-heading)"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: hover ? "var(--accent)" : "var(--text-muted)"
    }
  }, discipline), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      color: "var(--text-faint)"
    }
  }, year), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 18,
    style: {
      opacity: hover ? 1 : 0,
      transform: hover ? "none" : "translateX(-6px)",
      transition: "var(--transition-control)"
    }
  }));
}
Object.assign(__ds_scope, { WorkRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/WorkRow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 32,
  md: 40,
  lg: 48
};
function IconButton({
  name,
  label,
  size = "md",
  variant = "outline",
  style,
  disabled = false,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const d = sizes[size];
  const v = variant === "solid" ? {
    background: "var(--accent)",
    color: "var(--text-on-accent)",
    borderColor: "var(--accent)"
  } : variant === "bare" ? {
    background: "transparent",
    color: "var(--text-secondary)",
    borderColor: "transparent"
  } : {
    background: "transparent",
    color: "var(--text-primary)",
    borderColor: "var(--border-subtle)"
  };
  const h = variant === "solid" ? {
    background: "var(--accent-hover)",
    borderColor: "var(--accent-hover)"
  } : variant === "bare" ? {
    color: "var(--text-primary)",
    background: "var(--white-a08)"
  } : {
    borderColor: "var(--border-strong)"
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: d,
      height: d,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "var(--border-width) solid",
      borderRadius: "var(--radius-control)",
      cursor: "pointer",
      transition: "var(--transition-control)",
      ...v,
      ...(hover && !disabled ? h : null),
      ...(disabled ? {
        opacity: .38,
        cursor: "not-allowed"
      } : null),
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: size === "sm" ? 16 : 18
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dialog({
  open = false,
  title,
  onClose,
  children,
  footer,
  width = 520,
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-7)",
      background: "var(--scrim-page)",
      backdropFilter: "var(--blur-overlay)",
      WebkitBackdropFilter: "var(--blur-overlay)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: width,
      background: "var(--surface-raised)",
      border: "var(--border-width) solid var(--border-subtle)",
      borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-overlay)",
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-5)",
      padding: "var(--space-6) var(--space-7)",
      borderBottom: "var(--border-width) solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--text-heading-xs)",
      letterSpacing: "var(--tr-heading)"
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    name: "x",
    label: "Close",
    size: "sm",
    variant: "bare",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-7)",
      font: "var(--text-body-sm)",
      color: "var(--text-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--space-4)",
      padding: "var(--space-6) var(--space-7)",
      borderTop: "var(--border-width) solid var(--border-hairline)"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Notice.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  info: {
    c: "var(--signal-info)",
    icon: "info"
  },
  positive: {
    c: "var(--signal-positive)",
    icon: "check"
  },
  warning: {
    c: "var(--signal-warning)",
    icon: "triangle-alert"
  },
  negative: {
    c: "var(--signal-negative)",
    icon: "circle-alert"
  }
};
function Notice({
  tone = "info",
  title,
  children,
  style,
  ...rest
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      padding: "var(--space-5) var(--space-6)",
      border: "var(--border-width) solid var(--border-hairline)",
      borderLeft: "var(--border-width-strong) solid " + t.c,
      borderRadius: "var(--radius-xs)",
      background: "var(--surface-sunken)",
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 18,
    style: {
      background: t.c,
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      font: "var(--text-label-md)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: t.c
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-secondary)"
    }
  }, children)));
}
Object.assign(__ds_scope, { Notice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Notice.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  checked,
  defaultChecked,
  label,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked ?? false);
  const val = checked === undefined ? on : checked;
  return /*#__PURE__*/React.createElement("label", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .38 : 1,
      font: "var(--text-body-sm)",
      color: "var(--text-secondary)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (disabled) return;
      const n = !val;
      if (checked === undefined) setOn(n);
      onChange && onChange(n);
    },
    style: {
      width: 20,
      height: 20,
      flex: "0 0 auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xs)",
      border: "var(--border-width) solid",
      borderColor: val ? "var(--accent)" : "var(--border-subtle)",
      background: val ? "var(--accent)" : "transparent",
      transition: "var(--transition-control)"
    }
  }, val && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    style: {
      background: "var(--text-on-accent)"
    }
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      ...style
    }
  }), label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      display: "flex",
      gap: "var(--space-2)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "*")), children, (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: error ? "var(--signal-negative)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldBase = {
  width: "100%",
  background: "var(--surface-sunken)",
  color: "var(--text-primary)",
  border: "var(--border-width) solid var(--border-hairline)",
  borderRadius: "var(--radius-control)",
  font: "var(--text-body-md)",
  padding: "0 var(--space-5)",
  height: 48,
  outline: "none",
  transition: "var(--transition-control)"
};
function Input({
  invalid = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      ...fieldBase,
      borderColor: invalid ? "var(--signal-negative)" : focus ? "var(--accent)" : "var(--border-hairline)",
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldBase = {
  width: "100%",
  background: "var(--surface-sunken)",
  color: "var(--text-primary)",
  border: "var(--border-width) solid var(--border-hairline)",
  borderRadius: "var(--radius-control)",
  font: "var(--text-body-md)",
  padding: "0 var(--space-5)",
  height: 48,
  outline: "none",
  transition: "var(--transition-control)"
};
function Select({
  options = [],
  invalid = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...fieldBase,
      appearance: "none",
      paddingRight: "var(--space-9)",
      cursor: "pointer",
      borderColor: invalid ? "var(--signal-negative)" : focus ? "var(--accent)" : "var(--border-hairline)"
    }
  }), options.map(o => {
    const v = typeof o === "string" ? o : o.value,
      l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v,
      style: {
        background: "var(--ink-800)"
      }
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      position: "absolute",
      right: "var(--space-5)",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      background: "var(--text-muted)"
    }
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked,
  defaultChecked,
  label,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked ?? false);
  const val = checked === undefined ? on : checked;
  return /*#__PURE__*/React.createElement("label", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .38 : 1,
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (disabled) return;
      const n = !val;
      if (checked === undefined) setOn(n);
      onChange && onChange(n);
    },
    style: {
      width: 40,
      height: 22,
      flex: "0 0 auto",
      borderRadius: "var(--radius-pill)",
      border: "var(--border-width) solid",
      borderColor: val ? "var(--accent)" : "var(--border-subtle)",
      background: val ? "var(--accent)" : "transparent",
      position: "relative",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: val ? 20 : 2,
      width: 16,
      height: 16,
      borderRadius: "var(--radius-pill)",
      background: val ? "var(--text-on-accent)" : "var(--text-muted)",
      transition: "left var(--dur-fast) var(--ease-standard)"
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldBase = {
  width: "100%",
  background: "var(--surface-sunken)",
  color: "var(--text-primary)",
  border: "var(--border-width) solid var(--border-hairline)",
  borderRadius: "var(--radius-control)",
  font: "var(--text-body-md)",
  padding: "0 var(--space-5)",
  height: 48,
  outline: "none",
  transition: "var(--transition-control)"
};
function Textarea({
  rows = 5,
  invalid = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({}, rest, {
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...fieldBase,
      height: "auto",
      padding: "var(--space-4) var(--space-5)",
      resize: "vertical",
      lineHeight: "var(--lh-body)",
      fontFamily: "var(--font-text)",
      borderColor: invalid ? "var(--signal-negative)" : focus ? "var(--accent)" : "var(--border-hairline)",
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FooterBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FooterBar({
  email = "hello@koebelt.com",
  socials = [],
  note,
  assetBase = "/assets/",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({}, rest, {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-9)",
      borderTop: "var(--border-width) solid var(--border-hairline)",
      padding: "var(--space-10) var(--gutter-inline-lg) var(--space-8)",
      background: "var(--surface-sunken)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--space-9)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:" + email,
    style: {
      font: "var(--text-display-md)",
      letterSpacing: "var(--tr-display)",
      border: 0,
      color: "var(--text-primary)"
    }
  }, email), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)"
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    key: s.name,
    name: s.name,
    label: s.label || s.name
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-7)",
      borderTop: "var(--border-width) solid var(--border-hairline)",
      paddingTop: "var(--space-6)",
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: 24,
    assetBase: assetBase
  }), /*#__PURE__*/React.createElement("span", null, note || "Thomas Koebel — Software Engineer"), /*#__PURE__*/React.createElement("span", null, "© " + new Date().getFullYear())));
}
Object.assign(__ds_scope, { FooterBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FooterBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavBar({
  items = [],
  active,
  onNavigate,
  action,
  assetBase = "/assets/",
  sticky = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      position: sticky ? "sticky" : "static",
      top: 0,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-8)",
      padding: "var(--space-5) var(--gutter-inline-lg)",
      background: "rgba(40,37,38,.82)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)",
      borderBottom: "var(--border-width) solid var(--border-hairline)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(items[0]);
    },
    style: {
      border: 0,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: 32,
    assetBase: assetBase
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "var(--space-8)"
    }
  }, items.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it,
      href: "#" + it,
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(it);
      },
      style: {
        font: "var(--text-label-md)",
        letterSpacing: "var(--tr-label)",
        textTransform: "uppercase",
        color: on ? "var(--accent)" : "var(--text-secondary)",
        border: 0,
        transition: "var(--transition-control)"
      }
    }, it);
  })), action !== undefined ? action : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "secondary"
  }, "Contact"));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  const [inner, setInner] = React.useState(items[0]);
  const cur = value === undefined ? inner : value;
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    role: "tablist",
    style: {
      display: "flex",
      gap: "var(--space-7)",
      borderBottom: "var(--border-width) solid var(--border-hairline)",
      ...style
    }
  }), items.map(it => {
    const on = it === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        if (value === undefined) setInner(it);
        onChange && onChange(it);
      },
      style: {
        background: "none",
        border: 0,
        borderBottom: "var(--border-width-strong) solid",
        borderBottomColor: on ? "var(--accent)" : "transparent",
        padding: "0 0 var(--space-4)",
        marginBottom: -1,
        cursor: "pointer",
        font: "var(--text-label-md)",
        letterSpacing: "var(--tr-label)",
        textTransform: "uppercase",
        color: on ? "var(--text-primary)" : "var(--text-muted)",
        transition: "var(--transition-control)"
      }
    }, it);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cv/CV.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CvRow({
  role,
  org,
  period,
  summary
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "140px 1fr",
      gap: "var(--space-7)",
      padding: "var(--space-6) 0",
      borderTop: "var(--border-width) solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      color: "var(--text-faint)"
    }
  }, period), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-4)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-heading-xs)"
    }
  }, role), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-muted)"
    }
  }, org)), summary && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-muted)",
      maxWidth: "var(--measure-narrow)",
      margin: 0
    }
  }, summary)));
}
function CV() {
  const {
    SectionHeading,
    Tag
  } = window.KOEBELTDesignSystem_35e9bf;
  const experience = [{
    period: "2019—Present",
    role: "Independent software engineer",
    org: "koebelt",
    summary: "Product engineering and web development for studios and small institutions."
  }, {
    period: "2017—2019",
    role: "Software engineer",
    org: "Studio Nord, Strasbourg",
    summary: "Web and internal tooling for cultural clients."
  }, {
    period: "2016—2017",
    role: "Engineering intern",
    org: "Atelier Fabrique",
    summary: "Frontend development and tooling."
  }];
  const education = [{
    period: "2013—2016",
    role: "BA Graphic Design",
    org: "HEAR Strasbourg"
  }, {
    period: "2012—2013",
    role: "Foundation year",
    org: "Lycée des Arts"
  }];
  const skills = ["Figma", "Adobe Illustrator", "Adobe InDesign", "Adobe Photoshop", "HTML/CSS", "After Effects"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-page)",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-11) var(--gutter-inline-lg) var(--space-8)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "CV",
    title: "R\xE9sum\xE9"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: "var(--text-label-md)",
      letterSpacing: "var(--tr-label)",
      textTransform: "uppercase",
      border: 0,
      color: "var(--text-accent)",
      display: "inline-flex",
      gap: "var(--space-3)"
    }
  }, "Download CV (PDF)")), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--gutter-inline-lg) var(--space-10)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "01 \u2014 Experience",
    title: "Work history"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-7)"
    }
  }, experience.map(e => /*#__PURE__*/React.createElement(CvRow, _extends({
    key: e.role + e.org
  }, e))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--gutter-inline-lg) var(--space-11)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-12)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "02 \u2014 Education",
    title: "School"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-7)"
    }
  }, education.map(e => /*#__PURE__*/React.createElement(CvRow, _extends({
    key: e.role + e.org
  }, e))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "03 \u2014 Skills",
    title: "Tools & software"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-3)",
      marginTop: "var(--space-7)"
    }
  }, skills.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))))));
}
window.CV = CV;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cv/CV.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Marquee = __ds_scope.Marquee;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.Quote = __ds_scope.Quote;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.WorkRow = __ds_scope.WorkRow;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Notice = __ds_scope.Notice;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.FooterBar = __ds_scope.FooterBar;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
