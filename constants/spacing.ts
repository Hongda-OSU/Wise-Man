// A 4px scale. Padding, margin and gap all come from here; a value between two
// steps is a decision nobody made.
export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  // The page gutter.
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// Bottom padding on a tab's list, so its last row scrolls clear of the floating
// tab bar.
export const TAB_BAR_CLEARANCE = 120;
