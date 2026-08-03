export const HOME_VIEW_MODES = {
  list: "list",
  calendar: "calendar",
} as const;

export type HomeViewMode = (typeof HOME_VIEW_MODES)[keyof typeof HOME_VIEW_MODES];
