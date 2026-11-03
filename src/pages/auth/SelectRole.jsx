import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Wrench, Briefcase, BookOpen, Users, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { unwrapData } from '@/lib/utils/api';
import { normalizeUser } from '@/lib/utils/user';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import RoleCard from '@/components/ui/RoleCard';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const roleOptions = [
  {
    id: 'worker',
    title: 'Worker',
    description: 'Show your skills and find work.',
    icon: Wrench,
    apiRole: 'WORKER',
    next: '/worker/profile',
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Find the right person for your job.',
    icon: Briefcase,
    apiRole: 'EMPLOYER',
    next: '/employer/search',
  },
  {
    id: 'apprentice',
    title: 'Apprentice',
    description: 'Learn a trade with a trainer.',
    icon: BookOpen,
    apiRole: 'APPRENTICE',
    next: '/apprentice/dashboard',
  },
  {
    id: 'trainer',
    title: 'Trainer',
    description: 'Share your experience. Train others.',
    icon: Users,
    apiRole: 'WORKER',
    next: '/trainer/profile',
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
      setMode(option.id === 'trainer' ? 'trainer' : null);
      navigate(option.next, { replace: true });
    },
  });

  const selected = roleOptions.find((option) => option.id === selectedId);

  return (
    <AuthLayout
      bare
      wide
      title="Choose your role"
      subtitle="How do you want to use SkillPadi?"
    >
      <div role="radiogroup" aria-label="Choose your role" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <RoleCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selectedId === option.id}
            disabled={mutation.isPending}
            onSelect={() => setSelectedId(option.id)}
          />
        ))}
      </div>

      {mutation.isError && (
        <FeedbackBanner tone="error" className="mt-4">
          {getApiErrorMessage(mutation.error, 'Failed to set your role. Please try again.')}
        </FeedbackBanner>
      )}

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        loading={mutation.isPending}
        disabled={!selected}
        rightIcon={ArrowRight}
        onClick={() => mutation.mutate(selected)}
      >
        Continue
      </Button>
    </AuthLayout>
  );
}