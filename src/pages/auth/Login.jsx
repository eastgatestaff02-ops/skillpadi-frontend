import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const getErrorMessage = (err) => {
  if (!err.response) {
    return 'We could not reach the server. Check your connection and try again.';
  }
  const apiError = err.response.data?.error;
  if (apiError?.code === 'RATE_LIMITED') {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return apiError?.message || 'Invalid credentials';
};

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: () => authApi.login({ identifier: identifier.trim(), password: credential }),
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

  const canSubmit = identifier.trim() !== '' && credential !== '';

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
            Log in with your phone number or email and your PIN.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <TextField
              label="Phone number or email"
              icon={User}
              type="text"
              autoComplete="username"
              placeholder="+234 803 456 7890"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <TextField
              label="PIN or password"
              icon={Lock}
              type="password"
              autoComplete="current-password"
              placeholder="Enter your PIN"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />

            {loginMutation.isError && (
              <FeedbackBanner tone="error">{getErrorMessage(loginMutation.error)}</FeedbackBanner>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loginMutation.isPending}
              disabled={!canSubmit}
              rightIcon={ArrowRight}
            >
              Log in
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-body2 text-navy-500/70">
          New to SkillPadi?{' '}
          <Link to="/auth/signup" className="font-bold text-ochre-900 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}