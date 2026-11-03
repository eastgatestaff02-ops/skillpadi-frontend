import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { parseIdentifier, identifierPayload, formatIdentifier } from '@/lib/utils/identifier';
import { getPasswordError, PASSWORD_MIN_LENGTH } from '@/lib/utils/password';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { getRegistrationDraft, setRegistrationDraft } from '@/lib/store/registrationDraft';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import ConsentControl from '@/components/ui/ConsentControl';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function Signup() {
  const draft = getRegistrationDraft();
  const [value, setValue] = useState(draft ? formatIdentifier(draft.identifier) : '');
  const [name, setName] = useState(draft?.name || '');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const identifier = parseIdentifier(value);
  const isValid = Boolean(
    identifier && name.trim().length >= 2 && !getPasswordError(password) && consent
  );

  const identifierError =
    submitted && !identifier
      ? 'Enter a phone number (+234 followed by 10 digits) or a valid email.'
      : '';
  const nameError = submitted && name.trim().length < 2 ? 'Enter your full name.' : '';
  const passwordError = submitted ? getPasswordError(password) : '';
  const consentError = submitted && !consent ? 'Please agree to continue.' : '';

  const requestOtp = useMutation({
    mutationFn: (parsed) => authApi.requestOtp(identifierPayload(parsed)),
    onSuccess: (_, parsed) => {
      setRegistrationDraft({ identifier: parsed, name: name.trim(), password });
      navigate('/auth/register/verify');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid || requestOtp.isPending) return;
    requestOtp.mutate(identifier);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Fill in your details. We'll send a code to confirm it's you."
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
          error={identifierError}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <TextField
          label="Full name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="e.g. Adewale Okafor"
          error={nameError}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <PasswordField
          label="Password"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Create a password"
          helper={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          error={passwordError}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ConsentControl checked={consent} onChange={setConsent} error={consentError}>
          I consent to SkillPadi using my personal data to create and manage my account.
        </ConsentControl>

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