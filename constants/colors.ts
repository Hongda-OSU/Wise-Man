// Dark only. There is no light theme and no theme switch.
export const COLORS = {
  // Surfaces, from the page up. Anything stacked on a card uses `elevated`.
  background: "#0F1512",
  surface: "#18211D",
  elevated: "#232E28",
  // The brand green. Too close to the surfaces to carry an action, so it is reserved
  // for hero cards that should read as branded rather than as plain containers.
  surfaceBrand: "#1A2E28",
  border: "#2A322E",

  // Text
  textPrimary: "#F5F0E8",
  textSecondary: "#9AA5A0",
  // For text and icons sitting on `accent`.
  onAccent: "#0F1512",

  // Primary action. The light theme put dark green on cream; dark mode inverts that
  // pairing rather than brightening the green, which would collide with `income`.
  accent: "#F5F0E8",

  // Semantic
  income: "#2ECC80",
  expense: "#E85D4C",

  // Translucent whites for detail on top of dark surfaces.
  overlaySoft: "rgba(245,240,232,0.06)",
  overlayMuted: "rgba(245,240,232,0.16)",
  overlayStrong: "rgba(245,240,232,0.55)",

  shadow: "#000000",
} as const;
