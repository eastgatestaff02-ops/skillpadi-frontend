import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getApiErrorMessage } from '@/lib/utils/errors';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import ConsentControl from '@/components/ui/ConsentControl';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function CompleteRegistration() {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const phone = localStorage.getItem('reg_phone');
  const regToken = localStorage.getItem('reg_token');

  const completeMutation = useMutation({
    mutationFn: () =>
      authApi.completeRegistration({
        phone,
        otp_token: regToken,
        pin,
        name: name.trim(),
      }),
    onSuccess: (res) => {
      const { access_token, refresh_token, user } = res.data;
      setAuth(access_token, refresh_token, user);
      localStorage.removeItem('reg_phone');
      localStorage.removeItem('reg_token');
      navigate('/auth/select-role');
    },
  });

  if (!phone || !regToken) {
    return <Navigate to="/auth/signup" replace />;
  }

  const pinMismatch = confirmPin.length === 4 && confirmPin !== pin;
  const canSubmit =
    name.trim().length >= 2 && /^\d{4}$/.test(pin) && confirmPin === pin && consent;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || completeMutation.isPending) return;
    completeMutation.mutate();
  };

  return (
    <AuthLayout
      title="Almost there"
      subtitle="Tell us your name and choose a 4-digit PIN to secure your account."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="Full name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="e.g. Adewale Okafor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Create a PIN"
          icon={Lock}
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={4}
          placeholder="4 digits"
          helper="Choose 4 digits you will remember."
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
        />

        <TextField
          label="Confirm your PIN"
          icon={Lock}
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={4}
          placeholder="4 digits"
          error={pinMismatch ? 'PINs do not match.' : ''}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
        />

        <ConsentControl checked={consent} onChange={setConsent}>
          I consent to SkillPadi using my personal data to create and manage my account.
        </ConsentControl>

        {completeMutation.isError && (
          <FeedbackBanner tone="error">
            {getApiErrorMessage(completeMutation.error, 'Failed to complete registration.')}
          </FeedbackBanner>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={completeMutation.isPending}
          disabled={!canSubmit}
          rightIcon={ArrowRight}
        >
          Create my account
        </Button>
      </form>
    </AuthLayout>
  );
}