import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Phone, Lock, User } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { parseIdentifier } from '@/lib/utils/identifier';
import { getPinError, PIN_MAX_LENGTH } from '@/lib/utils/pin';
import { getApiErrorMessage } from '@/lib/utils/errors';
import AuthScreen, { AuthCard, AuthField, AuthButton } from '@/components/layout/AuthScreen';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const RESEND_SECONDS = 30;
const NOT_AVAILABLE = 'PIN reset is not available yet. Please contact support.';

const toLocalPhone = (phone) => (phone?.startsWith('+234') ? `0${phone.slice(4)}` : phone || '');

const requestMessage = (err) => {
  const status = err.response?.status;
  if (status === 404 || status === 405) return NOT_AVAILABLE;
  return getApiErrorMessage(err, 'We could not send the code. Please try again.');
};

const confirmMessage = (err) => {
  const status = err.response?.status;
  if (status === 404 || status === 405) return NOT_AVAILABLE;
  if (status === 400) return 'Code incorrect or expired. Try again.';
  return getApiErrorMessage(err, 'We could not reset your PIN. Please try again.');
};

export default function ForgotPin() {
  const [value, setValue] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState(null);
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const parsed = parseIdentifier(value);
  const phone = parsed?.type === 'phone' ? parsed : null;

  const requestMutation = useMutation({
    mutationFn: (target) => authApi.requestPinReset({ phone: target.value }),
    onSuccess: (_, target) => {
      setSentTo(target);
      setSecondsLeft(RESEND_SECONDS);
      setOtp('');
      setSubmitted(false);
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => authApi.resetPin({ phone: sentTo.value, code: otp, pin }),
    onSuccess: () => {
      navigate('/auth/sign-in', { replace: true, state: { pinReset: true } });
    },
  });

  const handleSendCode = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!phone || requestMutation.isPending) return;
    requestMutation.mutate(phone);
  };

  const pinError = getPinError(pin);
  const mismatch = pin !== confirmPin;
  const otpOk = otp.length === 6;

  const handleReset = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!otpOk || pinError || mismatch || resetMutation.isPending) return;
    resetMutation.mutate();
  };

  if (!sentTo) {
    return (
      <AuthScreen
        centered
        title="Forgot your PIN?"
        subtitle="Enter your phone number or email. We will send a code so you can set a new PIN."
      >
        <AuthCard>
          <form onSubmit={handleSendCode} noValidate className="space-y-5">
            <TextField
              label="Phone number or Email"
              icon={User}
              type="text"
              autoComplete="username"
              placeholder="+234... or you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <AuthField
              label="Phone number"
              icon={Phone}
              type="tel"
              autoComplete="tel"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={submitted && !phone ? 'Enter a valid Nigerian phone number.' : ''}
            />

            {requestMutation.isError && (
              <FeedbackBanner tone="error">{requestMessage(requestMutation.error)}</FeedbackBanner>
            )}

            <AuthButton type="submit">
              {requestMutation.isPending ? 'Please wait...' : 'Send code'}
            </AuthButton>
          </form>

          <p className="mt-5 text-center text-body2 text-ochre-500">
            Remembered your PIN?{' '}
            <Link to="/auth/sign-in" className="font-bold">
              Sign In
            </Link>
          </p>
        </AuthCard>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Set a new PIN" withLogo>
      <AuthCard>
        <form onSubmit={handleReset} noValidate className="space-y-5">
          <p className="text-body1 font-semibold text-navy-500">
            We sent a 6-digit code to {toLocalPhone(sentTo.value)}
          </p>

          <AuthField
            icon={Lock}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="––––––"
            inputClassName="tracking-[0.5em]"
            aria-label="One-time passcode"
            value={otp}
            error={submitted && !otpOk ? 'Enter the 6-digit code.' : ''}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              resetMutation.reset();
            }}
          />

          <AuthField
            outlined
            label="New PIN"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={PIN_MAX_LENGTH}
            placeholder="Enter 4-digit PIN"
            inputClassName="tracking-wider"
            value={pin}
            error={submitted ? pinError : ''}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_MAX_LENGTH))}
          />

          <AuthField
            outlined
            label="Confirm new PIN"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={PIN_MAX_LENGTH}
            placeholder="Re-enter your PIN"
            inputClassName="tracking-wider"
            value={confirmPin}
            error={submitted && mismatch ? 'The PINs do not match.' : ''}
            onChange={(e) =>
              setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, PIN_MAX_LENGTH))
            }
          />

          {resetMutation.isError && (
            <FeedbackBanner tone="error">{confirmMessage(resetMutation.error)}</FeedbackBanner>
          )}

          <AuthButton type="submit">
            {resetMutation.isPending ? 'Please wait...' : 'Reset PIN'}
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
            disabled={requestMutation.isPending}
            onClick={() => requestMutation.mutate(sentTo)}
            className="mt-5 text-body1 font-bold text-ochre-500 disabled:opacity-60"
          >
            {requestMutation.isPending ? 'Sending...' : 'Resend code'}
          </button>
        )}
        {requestMutation.isError && (
          <FeedbackBanner tone="error" className="mt-3 text-left">
            {requestMessage(requestMutation.error)}
          </FeedbackBanner>
        )}
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-4 block w-full text-body2 font-bold text-navy-500/70"
        >
          Change phone number
        </button>
      </AuthCard>
    </AuthScreen>
  );
}