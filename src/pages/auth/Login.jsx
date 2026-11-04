import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { parseIdentifier } from '@/lib/utils/identifier';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { unwrapData } from '@/lib/utils/api';
import { normalizeUser } from '@/lib/utils/user';
import { homePathFor } from '@/lib/utils/routes';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const parsed = parseIdentifier(identifier);
      const loggedIn = await authApi.login({
        identifier: parsed ? parsed.value : identifier.trim(),
        pin,
      });
      const session = unwrapData(loggedIn.data);
      setAuth(session.accessToken, session.refreshToken, normalizeUser(session.user));

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

  const canSubmit = identifier.trim() !== '' && pin !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-cream">
      
      <div className="flex md:w-1/2 relative bg-ochre-100 min-h-[30vh] md:min-h-0 md:order-2">
        <img 
          src="/onboarding_worker.jpg" 
          alt="Skilled Worker" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Subtle overlay so it doesn't look too bright */}
        <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply"></div>
        
        {/* Optional text overlay on the image for mobile/desktop branding */}
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white z-10 md:p-12 bg-gradient-to-t from-black/60 to-transparent md:bg-none">
          <h2 className="text-3xl font-bold md:hidden">SkillPadi</h2>
          <p className="text-sm opacity-90 md:hidden">From Apprentice to Master.</p>
        </div>
      </div>

      {/* LEFT SIDE: The Form */}
      <div className="flex w-full flex-col justify-center px-4 py-10 md:w-1/2 lg:px-20 md:order-1 bg-cream relative z-20 -mt-6 md:mt-0 rounded-t-3xl md:rounded-none">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="mb-8 text-center md:text-left">
            <p className="text-h3 font-bold text-navy-500 hidden md:block">SkillPadi</p>
            <p className="mt-1 text-body2 text-navy-500/70 hidden md:block">From Apprentice to Master.</p>
          </div>

          <Card className="p-6">
            <h1 className="text-h2 font-bold text-navy-500">Welcome back</h1>
            <p className="mt-1 text-body2 text-navy-500/70">
              Sign in with phone number/email and PIN.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <TextField
                label="Phone number/email"
                icon={User}
                type="text"
                autoComplete="username"
                placeholder="+234 803 456 7890 or you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              <PasswordField
                label="PIN"
                icon={Lock}
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              />

              {loginMutation.isError && (
                <FeedbackBanner tone="error">
                  {getApiErrorMessage(loginMutation.error, 'Invalid credentials')}
                </FeedbackBanner>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loginMutation.isPending}
                disabled={!canSubmit}
                rightIcon={ArrowRight}
              >
                Sign in
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-body2 text-navy-500/70">
            New to SkillPadi?{' '}
            <Link to="/auth/sign-up" className="font-bold text-ochre-900 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}