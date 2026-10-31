import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/authStore';
import { Briefcase, User, GraduationCap } from 'lucide-react';

export default function SelectRole() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (role) => authApi.updateRole(role),
    onSuccess: (_, role) => {
      // Update user role in state
      setUser({ ...user, role });
      
      // Navigate to the correct dashboard
      if (role === 'worker') navigate('/worker/profile');
      else if (role === 'employer') navigate('/employer/search');
      else navigate(`/${role}/dashboard`);
    },
    onError: (err) => {
      alert('Failed to set role. Please try again.');
    }
  });

  const roles = [
    { id: 'worker', title: 'Skilled Worker', desc: 'Offer your trade services', icon: <Briefcase size={32} className="text-teal-600 mb-3" /> },
    { id: 'employer', title: 'Employer', desc: 'Hire skilled workers', icon: <User size={32} className="text-teal-600 mb-3" /> },
    { id: 'apprentice', title: 'Apprentice', desc: 'Learn a trade', icon: <GraduationCap size={32} className="text-teal-600 mb-3" /> },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-teal-700">Choose your role</h1>
        <p className="text-center text-gray-500 mb-8">How do you want to use SkillPadi?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => mutation.mutate(r.id)}
              disabled={mutation.isPending}
              className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-teal-500 hover:shadow-md transition text-left flex flex-col items-center text-center"
            >
              {r.icon}
              <h2 className="font-bold text-lg text-gray-900 mb-1">{r.title}</h2>
              <p className="text-sm text-gray-500">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}