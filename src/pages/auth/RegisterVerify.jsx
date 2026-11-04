import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { unwrapData } from '@/lib/utils/api';
import { identifierPayload } from '@/lib/utils/identifier';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { getRegistrationDraft, setRegistrationDraft } from '@/lib/store/registrationDraft';
import AuthScreen, { AuthCard, AuthField, AuthButton } from '@/components/layout/AuthScreen';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const RESEND_SECONDS = 30;

const toLocalPhone = (phone) => (phone?.startsWith('+234') ? `0${phone.slice(4)}` : phone || '');

const getOtpMessage = (err) => {
  if (err.response?.status === 400) return 'Code incorrect or expired. Try again.';
  return getApiErrorMessage(err, 'Verification failed. Please try again.');
};

export default function RegisterVerify() {
  const [draft] = useState(getRegistrationDraft);
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const { phone } = identifierPayload(draft.identifier);
      const verified = await authApi.verifyOtp({ phone, code: otp });
      const { registrationToken } = unwrapData(verified.data);
      return registrationToken;
    },
    onSuccess: (registrationToken) => {
      setRegistrationDraft({ ...draft, registrationToken });
      navigate('/auth/create-pin');
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
    <AuthScreen title="OTP Verification" withLogo>
      <AuthCard>
        <form onSubmit={handleSubmit} noValidate>
          <p className="text-body1 font-semibold text-navy-500">
            We sent a 6-digit code to {toLocalPhone(draft.identifier.value)}
          </p>

          <AuthField
            className="mt-4"
            icon={Lock}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="––––––"
            inputClassName="tracking-[0.5em]"
            aria-label="One-time passcode"
            value={otp}
            error={errorMsg}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setErrorMsg('');
            }}
          />

          <AuthButton type="submit" disabled={!canSubmit} className="mt-4">
            {verifyMutation.isPending ? 'Verifying...' : 'Verify phone number'}
          </AuthButton>
        </form>
      </AuthCard>

      <AuthCard className="mt-4 text-center">
        <p className="text-body2 text-navy-500">Didn't receive the code? Check your SMS.</p>
        {secondsLeft > 0 ? (
          <p className="mt-5 text-body1 font-medium text-ochre-500">
            Enter the code sent to your phone.
          </p>
        ) : (
          <button
            type="button"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
            className="mt-5 text-body1 font-bold text-ochre-500 disabled:opacity-60"
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend code'}
          </button>
        )}
        {resendMutation.isError && (
          <FeedbackBanner tone="error" className="mt-3 text-left">
            {getApiErrorMessage(resendMutation.error)}
          </FeedbackBanner>
        )}
      </AuthCard>

      <p className="mt-6 text-body2 text-navy-500/70">
        Keep this code private. SkillPadi support will never ask you to share it.
      </p>
    </AuthScreen>
  );
}