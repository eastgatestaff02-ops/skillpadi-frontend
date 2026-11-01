export function normalizeNigerianPhone(input) {
  const cleaned = String(input || '').replace(/[^\d+]/g, '');
  let national;

  if (cleaned.startsWith('+234')) national = cleaned.slice(4);
  else if (cleaned.startsWith('234')) national = cleaned.slice(3);
  else if (cleaned.startsWith('0')) national = cleaned.slice(1);
  else national = cleaned;

  if (!/^\d{10}$/.test(national)) return null;
  return `+234${national}`;
}

export function formatNigerianPhone(phone) {
  const match = /^\+234(\d{3})(\d{3})(\d{4})$/.exec(phone || '');
  return match ? `+234 ${match[1]} ${match[2]} ${match[3]}` : phone || '';
}