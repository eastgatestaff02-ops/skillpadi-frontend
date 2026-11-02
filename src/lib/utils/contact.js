export function resolveContact(body) {
  const data = body?.data ?? body ?? {};
  const url =
    data.whatsappUrl || data.whatsapp_url || data.whatsappLink || data.url || data.link;
  const phone =
    data.phone ||
    data.phoneNumber ||
    data.phone_number ||
    data.whatsapp ||
    data.whatsappNumber;

  return {
    url: typeof url === 'string' ? url : null,
    phone: typeof phone === 'string' ? phone : null,
  };
}

export function buildWhatsappLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export function buildCallLink(phone) {
  const cleaned = String(phone || '').replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : null;
}