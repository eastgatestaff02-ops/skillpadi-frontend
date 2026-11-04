const REMEMBER_KEY = 'remember_me';
const TOKEN_KEYS = ['access_token', 'refresh_token'];

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const tokenStorage = {
  get: (key) => safe(() => sessionStorage.getItem(key) ?? localStorage.getItem(key)),

  set: (key, value) =>
    safe(() => {
      const remember = localStorage.getItem(REMEMBER_KEY) !== '0';
      const target = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;
      other.removeItem(key);
      target.setItem(key, value);
    }),

  setRemember: (remember) => safe(() => localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0')),

  clear: () =>
    safe(() => {
      TOKEN_KEYS.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }),
};