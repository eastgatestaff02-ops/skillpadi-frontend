import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { identifierPayload, readRegistrationIdentifier } from '@/lib/utils/identifier';
import { getPasswordError, PASSWORD_MIN_LENGTH } from '@/lib/utils/password';
import { getApiErrorMessage } from '@/lib/utils/errors';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import ConsentControl from '@/components/ui/ConsentControl';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function CompleteRegistration() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const identifier = readRegistrationIdentifier();
  const regToken = localStorage.getItem('reg_token');

  const completeMutation = useMutation({
    mutationFn: () =>
      authApi.completeRegistration({
        ...identifierPayload(identifier),
        otp_token: regToken,
        name: name.trim(),
        password,
      }),
    onSuccess: (res) => {
      const { access_token, refresh_token, user } = res.data;
      setAuth(access_token, refresh_token, user);
      localStorage.removeItem('reg_identifier');
      localStorage.removeItem('reg_token');
      navigate('/auth/select-role');
    },
  });

  if (!identifier || !regToken) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  const passwordError = password ? getPasswordError(password) : '';
  const mismatch = confirmPassword !== '' && confirmPassword !== password;
  const canSubmit =
    name.trim().length >= 2 &&
    !getPasswordError(password) &&
    confirmPassword === password &&
    consent;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || completeMutation.isPending) return;
    completeMutation.mutate();
  };

  return (
    <AuthLayout
      title="Almost there"
      subtitle="Tell us your name and choose a password to secure your account."
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

        <PasswordField
          label="Create a password"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Password"
          helper={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          error={passwordError}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordField
          label="Confirm your password"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Password again"
          error={mismatch ? 'Passwords do not match.' : ''}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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