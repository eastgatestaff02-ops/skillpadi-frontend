import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { unwrapData } from '@/lib/utils/api';
import { normalizeUser } from '@/lib/utils/user';
import { getPinError, PIN_MAX_LENGTH } from '@/lib/utils/pin';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { getRegistrationDraft, clearRegistrationDraft } from '@/lib/store/registrationDraft';
import AuthScreen, { AuthCard, AuthField, AuthButton } from '@/components/layout/AuthScreen';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function CreatePin() {
  const [draft] = useState(getRegistrationDraft);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const completeMutation = useMutation({
    mutationFn: async () => {
      const completed = await authApi.completeRegistration({
        registrationToken: draft.registrationToken,
        pin,
      });
      return unwrapData(completed.data);
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, normalizeUser(data.user));
      clearRegistrationDraft();
      navigate('/auth/select-role');
    },
  });

  if (!draft || !draft.registrationToken) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  const pinError = getPinError(pin);
  const mismatch = pin !== confirmPin;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (pinError || mismatch || completeMutation.isPending) return;
    completeMutation.mutate();
  };

  return (
    <AuthScreen
      centered
      title="Create your PIN"
      subtitle="Create a PIN to secure your SkillPadi account."
    >
      <AuthCard>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthField
            outlined
            label="Enter PIN"
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
            label="Confirm PIN"
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

          {completeMutation.isError && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(completeMutation.error)}
            </FeedbackBanner>
          )}

          <AuthButton type="submit">
            {completeMutation.isPending ? 'Please wait...' : 'Create PIN'}
          </AuthButton>
        </form>
      </AuthCard>
    </AuthScreen>
  );
}