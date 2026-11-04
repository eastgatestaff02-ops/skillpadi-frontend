export const PIN_MIN_LENGTH = 4;
export const PIN_MAX_LENGTH = 6;

export function getPinError(value) {
  if (!/^\d+$/.test(value || '')) return 'Use numbers only.';
  if (value.length < PIN_MIN_LENGTH || value.length > PIN_MAX_LENGTH) {
    return `Use ${PIN_MIN_LENGTH} to ${PIN_MAX_LENGTH} digits.`;
  }
  return '';
}