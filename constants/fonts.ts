export const FONTS = {
  // UI text
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semiBold: "DMSans_600SemiBold",

  // Display: money amounts and the wordmark
  displayBold: "Manrope_700Bold",
  displayExtraBold: "Manrope_800ExtraBold",
} as const;

export const FONT_SIZES = {
  // The headline figure: net worth, the month's total, the month-on-month change.
  display: 30,
  // Screen titles and the wordmark.
  heading1: 19,
  heading2: 17,
  body: 16,
  subBody: 15,
  caption: 13,
  micro: 11,
  // Fine print: swipe-action labels and anything else that must not compete.
  fine: 10,
} as const;
