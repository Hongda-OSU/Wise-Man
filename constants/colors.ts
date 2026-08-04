// Dark only. There is no light theme and no theme switch.
// Surfaces are deliberately neutral: the only colour in the interface is the
// income/expense pair, which is what makes a finance app read as formal rather
// than friendly.
export const COLORS = {
  // Surfaces, from the page up. Anything stacked on a card uses `elevated`.
  background: "#0E0F10",
  surface: "#17191B",
  elevated: "#202326",
  border: "#2C2F33",

  // Text
  textPrimary: "#F2F3F4",
  textSecondary: "#8E9298",
  // For text and icons sitting on `accent`.
  onAccent: "#0E0F10",

  // Primary action. Near-white rather than the brand green, which on a neutral
  // dark ground would collide with `income`.
  accent: "#F2F3F4",

  // Semantic
  income: "#2ECC80",
  expense: "#E5584A",

  // Translucent whites for detail on top of dark surfaces.
  overlaySoft: "rgba(242,243,244,0.05)",
  overlayMuted: "rgba(242,243,244,0.14)",
  overlayStrong: "rgba(242,243,244,0.5)",

  shadow: "#000000",
} as const;
