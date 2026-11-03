import { describe, it, expect } from 'vitest';
import { resolveContact, buildWhatsappLink, buildCallLink } from '@/lib/utils/contact';

describe('resolveContact', () => {
  it('reads a ready-made link inside the data envelope', () => {
    expect(resolveContact({ data: { whatsappUrl: 'https://wa.me/2348031112222' } })).toEqual({
      url: 'https://wa.me/2348031112222',
      phone: null,
    });
  });

  it('reads a phone number from the top level', () => {
    expect(resolveContact({ phone: '+2348031112222' })).toEqual({
      url: null,
      phone: '+2348031112222',
    });
  });

  it('reads snake_case names', () => {
    expect(
      resolveContact({
        data: { phone_number: '+2348031112222', whatsapp_url: 'https://wa.me/2348031112222' },
      })
    ).toEqual({ url: 'https://wa.me/2348031112222', phone: '+2348031112222' });
  });

  it('ignores values that are not text', () => {
    expect(resolveContact({ data: { phone: 123 } })).toEqual({ url: null, phone: null });
  });

  it('copes with a missing answer', () => {
    expect(resolveContact(undefined)).toEqual({ url: null, phone: null });
  });
});

describe('buildWhatsappLink', () => {
  it('builds a link from a formatted phone number', () => {
    expect(buildWhatsappLink('+234 803 456 7890')).toBe('https://wa.me/2348034567890');
  });

  it('adds an encoded message', () => {
    expect(buildWhatsappLink('+2348034567890', 'Hi there')).toBe(
      'https://wa.me/2348034567890?text=Hi%20there'
    );
  });

  it('returns null when there is no number', () => {
    expect(buildWhatsappLink('')).toBeNull();
    expect(buildWhatsappLink(undefined)).toBeNull();
  });
});

describe('buildCallLink', () => {
  it('builds a tel link without spaces or dashes', () => {
    expect(buildCallLink('+234 803-456 7890')).toBe('tel:+2348034567890');
  });

  it('returns null when there is no number', () => {
    expect(buildCallLink('')).toBeNull();
  });
});