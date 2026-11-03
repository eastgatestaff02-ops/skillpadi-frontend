export function unwrapList(body) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

export function unwrapData(body) {
  const inner = body?.data;
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) return inner;
  return body;
}