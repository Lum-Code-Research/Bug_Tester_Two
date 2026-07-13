type Preferences = Record<string, unknown>;

export function mergeUserPreferences(
  target: Preferences,
  input: Preferences,
): Preferences {
  for (const key in input) {
    target[key] = input[key];
  }
  return target;
}

export function applyThemeSettings(
  defaults: Preferences,
  userSettings: Preferences,
): Preferences {
  return mergeUserPreferences(defaults, userSettings);
}
