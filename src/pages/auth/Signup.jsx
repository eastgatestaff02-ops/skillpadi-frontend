import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { parseIdentifier, identifierPayload, formatIdentifier } from '@/lib/utils/identifier';
import { getPinError, PIN_MIN_LENGTH, PIN_MAX_LENGTH } from '@/lib/utils/pin';
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
  const [pin, setPin] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const parsed = parseIdentifier(value);
  const identifier = parsed?.type === 'phone' ? parsed : null;
  const pinError = getPinError(pin);
  const isValid = Boolean(identifier && !pinError && consent);

  const identifierError =
    submitted && !identifier ? 'Enter a phone number: +234 followed by 10 digits.' : '';
  const pinMessage = submitted ? pinError : '';
  const consentError = submitted && !consent ? 'Please agree to continue.' : '';

  const requestOtp = useMutation({
    mutationFn: (phone) => authApi.requestOtp(identifierPayload(phone)),
    onSuccess: (_, phone) => {
      setRegistrationDraft({ identifier: phone, pin });
      navigate('/auth/register/verify');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid || requestOtp.isPending) return;
    requestOtp.mutate(identifier);
  };

  const formContent = (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label="Phone number"
        icon={User}
        type="tel"
        autoComplete="tel"
        placeholder="+234 801 234 5678"
        error={identifierError}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <PasswordField
        label="PIN"
        icon={Lock}
        inputMode="numeric"
        autoComplete="new-password"
        maxLength={PIN_MAX_LENGTH}
        placeholder="Create a PIN"
        helper={`${PIN_MIN_LENGTH} to ${PIN_MAX_LENGTH} digits. You will use it to sign in.`}
        error={pinMessage}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_MAX_LENGTH))}
      />

      <ConsentControl
        checked={consent}
        onChange={setConsent}
        error={consentError}
        onReadNotice={() => window.open('/privacy', '_blank', 'noopener')}
      >
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
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-cream">
      
      {/* RIGHT SIDE: The Image (Shows on mobile as a top banner) */}
      <div className="flex w-full min-h-[30vh] relative bg-ochre-100 md:w-1/2 md:min-h-0 md:order-2">
        <img 
          src="/signup_mobile.jpg" 
          alt="Secure Mobile Sign Up" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply"></div>
        
        {/* Mobile-only branding overlay */}
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white z-10 md:hidden bg-gradient-to-t from-black/60 to-transparent">
          <h2 className="text-3xl font-bold">SkillPadi</h2>
          <p className="text-sm opacity-90">From Apprentice to Master.</p>
        </div>
      </div>

      {/* LEFT SIDE: The Form (Moves to bottom on mobile) */}
      <div className="flex w-full flex-col justify-center px-4 py-10 md:w-1/2 lg:px-20 md:order-1 -mt-6 md:mt-0 bg-cream relative z-20 rounded-t-3xl md:rounded-none">
        <div className="mx-auto w-full max-w-sm">
          <AuthLayout
            title="Create your account"
            subtitle="Enter your phone number. We'll send a code to confirm it's you."
            footer={
              <>
                Already have an account?{' '}
                <Link to="/auth/sign-in" className="font-bold text-ochre-900 hover:underline">
                  Sign in
                </Link>
              </>
            }
          >
            {formContent}
          </AuthLayout>
        </div>
      </div>

    </div>
  );
}