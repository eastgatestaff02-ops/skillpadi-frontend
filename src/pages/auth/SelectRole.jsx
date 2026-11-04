import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { unwrapData } from '@/lib/utils/api';
import { normalizeUser } from '@/lib/utils/user';
import AuthScreen, { AuthCard, AuthButton } from '@/components/layout/AuthScreen';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const roleOptions = [
  {
    id: 'worker',
    title: 'Worker',
    description: 'Seeking services/jobs',
    apiRole: 'WORKER',
    next: '/worker/profile',
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'In need of services',
    apiRole: 'EMPLOYER',
    next: '/employer/search',
  },
  {
    id: 'apprentice',
    title: 'Apprentice',
    description: 'Learn a trade with a trainer',
    apiRole: 'APPRENTICE',
    next: '/apprentice/dashboard',
  },
];

export default function SelectRole() {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const { user, setUser, setMode, setAccessToken } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (option) => authApi.updateRole(option.apiRole),
    onSuccess: (res, option) => {
      const data = unwrapData(res.data);
      if (data.accessToken) setAccessToken(data.accessToken);
      const updated = normalizeUser({ ...user, roles: data.roles || [option.apiRole] });
      setUser({ ...updated, role: option.apiRole.toLowerCase() });
      setMode(null);
      navigate(option.next, { replace: true });
    },
  });

  const selected = roleOptions.find((option) => option.id === selectedId);

  const handleContinue = () => {
    if (!selected || mutation.isPending) return;
    mutation.mutate(selected);
  };

  return (
    <AuthScreen title="Select Role" withLogo>
      <AuthCard>
        <h2 className="text-h3 font-bold text-navy-500">Who are you?</h2>
        <p className="mt-2 text-body2 text-navy-500/70">Choose one role to continue.</p>

        <div role="radiogroup" aria-label="Choose your role" className="mt-5 space-y-3">
          {roleOptions.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={mutation.isPending}
                onClick={() => setSelectedId(option.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-500 disabled:opacity-60 ${
                  isSelected
                    ? 'border-ochre-500 bg-ochre-50'
                    : 'border-navy-50 bg-white hover:border-ochre-200'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-ochre-500' : 'border-navy-200'
                  }`}
                >
                  {isSelected && <span className="h-3.5 w-3.5 rounded-full bg-ochre-500" />}
                </span>
                <span>
                  <span className="block text-body1 font-semibold text-navy-500">
                    {option.title}
                  </span>
                  <span className="block text-body2 text-navy-500/70">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        {mutation.isError && (
          <FeedbackBanner tone="error" className="mt-4">
            {getApiErrorMessage(mutation.error, 'Failed to set your role. Please try again.')}
          </FeedbackBanner>
        )}

        <AuthButton
          type="button"
          className="mt-6"
          disabled={!selected}
          onClick={handleContinue}
        >
          {mutation.isPending ? 'Please wait...' : 'Continue'}
        </AuthButton>
      </AuthCard>
    </AuthScreen>
  );
}