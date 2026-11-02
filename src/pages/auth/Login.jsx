import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { parseIdentifier } from '@/lib/utils/identifier';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: () => {
      const parsed = parseIdentifier(identifier);
      return authApi.login({
        identifier: parsed ? parsed.value : identifier.trim(),
        password,
      });
    },
    onSuccess: (res) => {
      const { access_token, refresh_token, user } = res.data;

      setAuth(access_token, refresh_token, user);

      if (!user.role) {
        navigate('/auth/select-role');
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    },
  });

  const canSubmit = identifier.trim() !== '' && password !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-h3 font-bold text-navy-500">SkillPadi</p>
          <p className="mt-1 text-body2 text-navy-500/70">From Apprentice to Master.</p>
        </div>

        <Card className="p-6">
          <h1 className="text-h2 font-bold text-navy-500">Welcome back</h1>
          <p className="mt-1 text-body2 text-navy-500/70">
            Sign in with your phone number or email and your password.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <TextField
              label="Phone number or email"
              icon={User}
              type="text"
              autoComplete="username"
              placeholder="+234 803 456 7890 or you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <PasswordField
              label="Password"
              icon={Lock}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  );
}