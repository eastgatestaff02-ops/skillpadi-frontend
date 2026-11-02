import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Phone, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { normalizeNigerianPhone } from '@/lib/utils/phone';
import { getApiErrorMessage } from '@/lib/utils/errors';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function Signup() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const phone = normalizeNigerianPhone(value);
  const fieldError = submitted && !phone ? 'Enter +234 followed by 10 digits.' : '';

  const requestOtp = useMutation({
    mutationFn: (number) => authApi.requestOtp({ phone: number }),
    onSuccess: (_, number) => {
      localStorage.setItem('reg_phone', number);
      localStorage.removeItem('reg_token');
      navigate('/auth/register/verify', { state: { phone: number } });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!phone || requestOtp.isPending) return;
    requestOtp.mutate(phone);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start with your phone number. We only ask for what we need now."
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
          label="Nigerian phone number"
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+234 801 234 5678"
          helper="We'll send a one-time code by SMS."
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