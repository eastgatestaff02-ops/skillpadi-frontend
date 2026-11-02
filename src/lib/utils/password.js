export const PASSWORD_MIN_LENGTH = 8;

export function getPasswordError(value) {
  return value.length < PASSWORD_MIN_LENGTH
    ? `Use at least ${PASSWORD_MIN_LENGTH} characters.`
    : '';
}