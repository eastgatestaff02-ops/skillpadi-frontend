export const queryDefaults = {
  networkMode: 'always',
  retry: (failureCount, error) => {
    if (error?.response) return false;
    if (!navigator.onLine) return false;
    return failureCount < 2;
  },
};

export const mutationDefaults = {
  networkMode: 'always',
};