import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { identifierPayload, formatIdentifier } from '@/lib/utils/identifier';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { getRegistrationDraft, clearRegistrationDraft } from '@/lib/store/registrationDraft';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const RESEND_SECONDS = 30;

const formatCountdown = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const rest = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
};

const getOtpMessage = (err) => {
  const code = err.response?.data?.error?.code;
  if (code === 'OTP_INVALID') return 'Code incorrect. Try again.';
  if (code === 'OTP_EXPIRED') return 'Code expired. Please request a new one.';
  if (code === 'OTP_ATTEMPTS_EXCEEDED') return 'Too many attempts. Try again later.';
  return getApiErrorMessage(err, 'Verification failed. Please try again.');
};

export default function RegisterVerify() {
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const draft = getRegistrationDraft();

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const payload = identifierPayload(draft.identifier);
      const verified = await authApi.verifyOtp({ ...payload, otp });
      const completed = await authApi.completeRegistration({
        ...payload,
        otp_token: verified.data.registration_token,
        name: draft.name,
        password: draft.password,
      });
      return completed.data;
    },
    onSuccess: (data) => {
      const { access_token, refresh_token, user } = data;
      setAuth(access_token, refresh_token, user);
      clearRegistrationDraft();
      navigate('/auth/select-role');
    },
    onError: (err) => setErrorMsg(getOtpMessage(err)),
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.requestOtp(identifierPayload(draft.identifier)),
    onSuccess: () => {
      setSecondsLeft(RESEND_SECONDS);
      setOtp('');
      setErrorMsg('');
    },
  });

  if (!draft) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  const canSubmit = otp.length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || verifyMutation.isPending) return;
    verifyMutation.mutate();
  };

  return (
    <AuthLayout
      title="Verify your account"
      subtitle="Enter the 6-digit code we sent you."
      footer={
        <Link to="/auth/sign-up" className="font-bold text-ochre-900 hover:underline">
          Change my details
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="One-time passcode"
          icon={Lock}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          inputClassName="tracking-[0.4em]"
          helper={`Sent to ${formatIdentifier(draft.identifier)}`}
          error={errorMsg}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
            setErrorMsg('');
          }}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={verifyMutation.isPending}
          disabled={!canSubmit}
          rightIcon={ArrowRight}
        >
          Verify and create account
        </Button>
      </form>

      <Card className="mt-6 border-navy-100 p-3">
        <p className="mb-2 text-body2 text-navy-500">Didn't receive the code?</p>
        <Button
          variant="outlined"
          fullWidth
          loading={resendMutation.isPending}
          disabled={secondsLeft > 0}
          onClick={() => resendMutation.mutate()}
        >
          {secondsLeft > 0 ? `Resend in ${formatCountdown(secondsLeft)}` : 'Resend code'}
        </Button>
        {resendMutation.isError && (
          <FeedbackBanner tone="error" className="mt-3">
            {getApiErrorMessage(resendMutation.error)}
          </FeedbackBanner>
        )}
        {resendMutation.isSuccess && secondsLeft > 0 && (
          <FeedbackBanner tone="success" className="mt-3">
            A new code has been sent.
          </FeedbackBanner>
        )}
      </Card>
    </AuthLayout>
  );
}