import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, MapPin, Phone, Check } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { parseIdentifier, identifierPayload } from '@/lib/utils/identifier';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { getRegistrationDraft, setRegistrationDraft } from '@/lib/store/registrationDraft';
import AuthScreen, { AuthCard, AuthField, AuthButton } from '@/components/layout/AuthScreen';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toLocalPhone = (phone) => (phone?.startsWith('+234') ? `0${phone.slice(4)}` : phone || '');

export default function Signup() {
  const draft = getRegistrationDraft();
  const [fullName, setFullName] = useState(draft?.fullName || '');
  const [email, setEmail] = useState(draft?.email || '');
  const [address, setAddress] = useState(draft?.address || '');
  const [phone, setPhone] = useState(draft?.identifier ? toLocalPhone(draft.identifier.value) : '');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const parsedPhone = parseIdentifier(phone);
  const identifier = parsedPhone?.type === 'phone' ? parsedPhone : null;
  const nameOk = fullName.trim().length >= 2;
  const emailOk = EMAIL_PATTERN.test(email.trim());
  const addressOk = address.trim().length >= 3;
  const isValid = nameOk && emailOk && addressOk && Boolean(identifier) && consent;

  const requestOtp = useMutation({
    mutationFn: (target) => authApi.requestOtp(identifierPayload(target)),
    onSuccess: (_, target) => {
      setRegistrationDraft({
        identifier: target,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
      });
      navigate('/auth/register/verify');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!consent || !isValid || requestOtp.isPending) return;
    requestOtp.mutate(identifier);
  };

  return (
    <AuthScreen title="Welcome to SkillPadi" subtitle="Create an account to continue.">
      <AuthCard>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthField
            label="Full name"
            icon={User}
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={submitted && !nameOk ? 'Enter your full name.' : ''}
          />

          <AuthField
            label="Email address"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={submitted && !emailOk ? 'Enter a valid email address.' : ''}
          />

          <AuthField
            label="Residential address"
            icon={MapPin}
            type="text"
            autoComplete="street-address"
            placeholder="Enter your residential address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={submitted && !addressOk ? 'Enter your residential address.' : ''}
          />

          <AuthField
            label="Phone number"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={submitted && !identifier ? 'Enter a valid Nigerian phone number.' : ''}
          />

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="peer sr-only"
            />
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy-500 ${
                consent ? 'bg-ochre-500' : 'border border-navy-200 bg-white'
              }`}
            >
              {consent && <Check size={18} className="text-navy-500" />}
            </span>
            <span className="text-body2 text-navy-500">
              I agree to the{' '}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ochre-500"
              >
                Privacy Notice
              </Link>
            </span>
          </label>

          {requestOtp.isError && (
            <FeedbackBanner tone="error">{getApiErrorMessage(requestOtp.error)}</FeedbackBanner>
          )}

          <AuthButton type="submit" disabled={!consent}>
            {requestOtp.isPending ? 'Please wait...' : 'Create account'}
          </AuthButton>
        </form>

        <p className="mt-5 text-center text-body2 text-ochre-500">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="font-bold">
            Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthScreen>
  );
}