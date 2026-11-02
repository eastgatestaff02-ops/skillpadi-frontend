import { normalizeNigerianPhone, formatNigerianPhone } from './phone';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseIdentifier(input) {
  const value = String(input || '').trim();

  if (value.includes('@')) {
    const email = value.toLowerCase();
    return EMAIL_PATTERN.test(email) ? { type: 'email', value: email } : null;
  }

  const phone = normalizeNigerianPhone(value);
  return phone ? { type: 'phone', value: phone } : null;
}

export function identifierPayload(identifier) {
  return identifier.type === 'email'
    ? { email: identifier.value }
    : { phone: identifier.value };
}

export function formatIdentifier(identifier) {
  return identifier.type === 'phone' ? formatNigerianPhone(identifier.value) : identifier.value;
}

export function readRegistrationIdentifier() {
  try {
    const stored = JSON.parse(localStorage.getItem('reg_identifier'));
    return stored?.type && stored?.value ? stored : null;
  } catch {
    return null;
  }
}