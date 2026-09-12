// Runtime barrel for the KOEBELT design system.
//
// The system ships no entry point, but its own `_adherence.oxlintrc.json` forbids
// deep-importing `components/**` with the message "Import design-system components
// from 'index.js'" — and exempts `**/index.js` from that rule. This is that file.
//
// Explicit .jsx specifiers match the convention used inside the components themselves.

export { Badge } from "./components/core/Badge.jsx";
export { Button } from "./components/core/Button.jsx";
export { Divider } from "./components/core/Divider.jsx";
export { Icon } from "./components/core/Icon.jsx";
export { IconButton } from "./components/core/IconButton.jsx";
export { Tag } from "./components/core/Tag.jsx";
export { ICONS } from "./components/core/icons-data.js";

export { Checkbox } from "./components/forms/Checkbox.jsx";
export { Field } from "./components/forms/Field.jsx";
export { Input } from "./components/forms/Input.jsx";
export { Select } from "./components/forms/Select.jsx";
export { Switch } from "./components/forms/Switch.jsx";
export { Textarea } from "./components/forms/Textarea.jsx";

export { Card } from "./components/content/Card.jsx";
export { MediaFrame } from "./components/content/MediaFrame.jsx";
export { ProjectCard } from "./components/content/ProjectCard.jsx";
export { Quote } from "./components/content/Quote.jsx";
export { SectionHeading } from "./components/content/SectionHeading.jsx";
export { WorkRow } from "./components/content/WorkRow.jsx";

export { Logo } from "./components/brand/Logo.jsx";
export { Marquee } from "./components/brand/Marquee.jsx";

export { FooterBar } from "./components/navigation/FooterBar.jsx";
export { NavBar } from "./components/navigation/NavBar.jsx";
export { Tabs } from "./components/navigation/Tabs.jsx";

export { Dialog } from "./components/feedback/Dialog.jsx";
export { Notice } from "./components/feedback/Notice.jsx";
