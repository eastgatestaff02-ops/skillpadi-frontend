import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { parseIdentifier } from '@/lib/utils/identifier';
import { PIN_MAX_LENGTH } from '@/lib/utils/pin';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { unwrapData } from '@/lib/utils/api';
import { normalizeUser } from '@/lib/utils/user';
import { homePathFor } from '@/lib/utils/routes';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const inputClass =
  'block h-12 w-full rounded-xl bg-cream px-4 text-body1 text-navy-500 outline-none focus:ring-2 focus:ring-ochre-500';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const parsed = parseIdentifier(identifier);
      const loggedIn = await authApi.login({
        identifier: parsed ? parsed.value : identifier.trim(),
        pin,
      });
      const session = unwrapData(loggedIn.data);
      setAuth(session.accessToken, session.refreshToken, normalizeUser(session.user), remember);

      try {
        const me = await authApi.getMe();
        return normalizeUser(unwrapData(me.data));
      } catch (err) {
        useAuthStore.getState().logout();
        throw err;
      }
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      navigate(homePathFor(user, useAuthStore.getState().mode));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginMutation.isPending) return;
    if (identifier.trim() === '' || pin === '') {
      setFormError('Enter your phone number or email and your PIN.');
      return;
    }
    setFormError('');
    loginMutation.mutate();
  };

  const errorMessage =
    formError ||
    (loginMutation.isError ? getApiErrorMessage(loginMutation.error, 'Invalid credentials') : '');

  return (
    <div className="min-h-screen bg-cream px-4 pb-10 pt-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-center text-h2 font-bold text-navy-500">Welcome back</h1>
        <p className="mt-3 text-center text-body2 text-navy-500/60">
          Enter your phone number or email to continue.
        </p>

        {location.state?.pinReset && (
          <FeedbackBanner tone="success" className="mt-6">
            Your PIN has been updated. Sign in with your new PIN.
          </FeedbackBanner>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 rounded-3xl bg-white p-5">
          <div>
            <label htmlFor="login-identifier" className="mb-2 block text-body2 text-navy-500">
              Email address/phone number
            </label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setFormError('');
              }}
              className={inputClass}
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="login-pin" className="text-body2 text-navy-500">
                PIN
              </label>
              <Link to="/auth/forgot-pin" className="text-body2 text-ochre-500 hover:underline">
                Forgot PIN?
              </Link>
            </div>
            <input
              id="login-pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              maxLength={PIN_MAX_LENGTH}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_MAX_LENGTH));
                setFormError('');
              }}
              className={inputClass}
            />
          </div>

          {errorMessage && (
            <p role="alert" className="mt-3 text-body2 text-danger-500">
              {errorMessage}
            </p>
          )}

          <label className="mt-6 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-navy-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy-500">
              {remember && <Check size={16} strokeWidth={3} className="text-navy-500" />}
            </span>
            <span className="text-lg text-navy-500">Remember me</span>
          </label>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-6 h-12 w-full rounded-xl bg-ochre-500 text-lg text-navy-500 transition-colors hover:bg-ochre-600 active:bg-ochre-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-5 text-center text-body2 text-ochre-500">
            New here?{' '}
            <Link to="/auth/sign-up" className="font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}