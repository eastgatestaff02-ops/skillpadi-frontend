export const PIN_LENGTH = 4;
export const PIN_MIN_LENGTH = PIN_LENGTH;
export const PIN_MAX_LENGTH = PIN_LENGTH;

export function getPinError(value) {
  if (!/^\d+$/.test(value || '')) return 'Use numbers only.';
  if (value.length !== PIN_LENGTH) return `Use exactly ${PIN_LENGTH} digits.`;
  return '';
}