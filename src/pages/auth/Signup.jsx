import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { parseIdentifier, identifierPayload } from '@/lib/utils/identifier';
import { getApiErrorMessage } from '@/lib/utils/errors';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function Signup() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const identifier = parseIdentifier(value);
  const fieldError =
    submitted && !identifier
      ? 'Enter a phone number (+234 followed by 10 digits) or a valid email.'
      : '';

  const requestOtp = useMutation({
    mutationFn: (parsed) => authApi.requestOtp(identifierPayload(parsed)),
    onSuccess: (_, parsed) => {
      localStorage.setItem('reg_identifier', JSON.stringify(parsed));
      localStorage.removeItem('reg_token');
      navigate('/auth/register/verify', { state: { identifier: parsed } });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!identifier || requestOtp.isPending) return;
    requestOtp.mutate(identifier);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up with your phone number or email."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="font-bold text-ochre-900 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="Phone number or email"
          icon={User}
          type="text"
          autoComplete="username"
          placeholder="+234 801 234 5678 or you@example.com"
          helper="We'll send a one-time code to verify it."
          error={fieldError}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {requestOtp.isError && (
          <FeedbackBanner tone="error">{getApiErrorMessage(requestOtp.error)}</FeedbackBanner>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={requestOtp.isPending}
          rightIcon={ArrowRight}
        >
          Send code
        </Button>
      </form>
    </AuthLayout>
  );
}