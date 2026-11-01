export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err?.response) {
    return 'We could not reach the server. Check your connection and try again.';
  }
  const apiError = err.response.data?.error;
  if (apiError?.code === 'RATE_LIMITED') {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return apiError?.message || fallback;
}