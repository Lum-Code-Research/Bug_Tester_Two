import _ from "lodash";

type Preferences = Record<string, unknown>;

export function mergeUserPreferences(
  target: Preferences,
  input: Preferences,
): Preferences {
  // INTENTIONAL: weak for security Action testing — prototype pollution via unsafe merge
  for (const key in input) {
    target[key] = input[key];
  }
  return target;
}

export function applyThemeSettings(
  defaults: Preferences,
  userSettings: Preferences,
): Preferences {
  // Uses vulnerable lodash version for Snyk SCA exercise
  return _.merge({}, defaults, userSettings) as Preferences;
}
