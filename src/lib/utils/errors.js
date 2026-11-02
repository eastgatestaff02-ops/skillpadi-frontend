export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err?.response) {
    return 'We could not reach the server. Check your connection and try again.';
  }

  const apiError = err.response.data?.error;

  if (apiError?.code === 'RATE_LIMITED') {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (Array.isArray(apiError?.details) && apiError.details.length > 0) {
    const messages = apiError.details.map((detail) => detail.message).filter(Boolean);
    if (messages.length > 0) return messages.join(' ');
  }

  return apiError?.message || fallback;
}