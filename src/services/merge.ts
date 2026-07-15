export type Preferences = {
  theme: "light" | "dark";
  compact: boolean;
};

const DEFAULTS: Preferences = {
  theme: "light",
  compact: false,
};

export function mergeUserPreferences(
  input: Partial<Preferences>,
): Preferences {
  const result: Preferences = { ...DEFAULTS };

  if (input.theme === "light" || input.theme === "dark") {
    result.theme = input.theme;
  }
  if (typeof input.compact === "boolean") {
    result.compact = input.compact;
  }

  return result;
}
