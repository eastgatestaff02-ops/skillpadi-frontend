import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { parseIdentifier, formatIdentifier } from '@/lib/utils/identifier';
import { getPinError, PIN_MIN_LENGTH, PIN_MAX_LENGTH } from '@/lib/utils/pin';
import { getApiErrorMessage } from '@/lib/utils/errors';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const RESEND_SECONDS = 30;
const NOT_AVAILABLE = 'PIN reset is not available yet. Please contact support.';

const formatCountdown = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const rest = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
};

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
  const canReset = otp.length === 6 && !pinError && !mismatch;

  const handleReset = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canReset || resetMutation.isPending) return;
    resetMutation.mutate();
  };

  const footer = (
    <Link to="/auth/sign-in" className="font-bold text-ochre-900 hover:underline">
      Back to sign in
    </Link>
  );

  if (!sentTo) {
    return (
      <AuthLayout
        title="Forgot your PIN?"
        subtitle="Enter your phone number. We will send a code so you can set a new PIN."
        footer={footer}
      >
        <form onSubmit={handleSendCode} noValidate className="space-y-4">
          <TextField
            label="Phone number"
            icon={User}
            type="tel"
            autoComplete="tel"
            placeholder="+234 801 234 5678"
            error={
              submitted && !phone ? 'Enter a phone number: +234 followed by 10 digits.' : ''
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {requestMutation.isError && (
            <FeedbackBanner tone="error">{requestMessage(requestMutation.error)}</FeedbackBanner>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={requestMutation.isPending}
            rightIcon={ArrowRight}
          >
            Send code
          </Button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new PIN"
      subtitle={`Enter the 6-digit code sent to ${formatIdentifier(sentTo)}.`}
      footer={footer}
    >
      <form onSubmit={handleReset} noValidate className="space-y-4">
        <TextField
          label="One-time passcode"
          icon={Lock}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          inputClassName="tracking-[0.4em]"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
            resetMutation.reset();
          }}
        />

        <PasswordField
          label="New PIN"
          icon={Lock}
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={PIN_MAX_LENGTH}
          placeholder="Create a new PIN"
          helper={`${PIN_MIN_LENGTH} to ${PIN_MAX_LENGTH} digits.`}
          error={submitted ? pinError : ''}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_MAX_LENGTH))}
        />

        <PasswordField
          label="Confirm new PIN"
          icon={Lock}
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={PIN_MAX_LENGTH}
          placeholder="Enter the PIN again"
          error={submitted && mismatch ? 'The PINs do not match.' : ''}
          value={confirmPin}
          onChange={(e) =>
            setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, PIN_MAX_LENGTH))
          }
        />

        {resetMutation.isError && (
          <FeedbackBanner tone="error">{confirmMessage(resetMutation.error)}</FeedbackBanner>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={resetMutation.isPending}
          rightIcon={ArrowRight}
        >
          Reset PIN
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <Button
          variant="outlined"
          fullWidth
          loading={requestMutation.isPending}
          disabled={secondsLeft > 0}
          onClick={() => requestMutation.mutate(sentTo)}
        >
          {secondsLeft > 0 ? `Resend in ${formatCountdown(secondsLeft)}` : 'Resend code'}
        </Button>
        {requestMutation.isError && (
          <FeedbackBanner tone="error">{requestMessage(requestMutation.error)}</FeedbackBanner>
        )}
        <Button variant="text" fullWidth onClick={() => setSentTo(null)}>
          Change phone number
        </Button>
      </div>
    </AuthLayout>
  );
}