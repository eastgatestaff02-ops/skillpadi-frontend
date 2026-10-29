import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const navigate = useNavigate();
  
  // We need setAuth to save both access and refresh tokens
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: () => authApi.login({ identifier, password: credential }),
    onSuccess: (res) => {
      // Backend returns tokens and user object directly
      const { access_token, refresh_token, user } = res.data;
      
      // Save to Zustand store
      setAuth(access_token, refresh_token, user);
      
      // Redirect based on role
      if (!user.role) {
        navigate('/auth/select-role');
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Invalid credentials');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded bg-white p-8 shadow">
        <h2 className="mb-4 text-2xl font-bold text-teal-700">Welcome Back</h2>
        <p className="mb-6 text-sm text-gray-500">Log in with your phone/email and PIN.</p>
        
        <input 
          type="text" 
          placeholder="Phone or Email" 
          className="mb-3 w-full rounded border p-2" 
          value={identifier} 
          onChange={(e) => setIdentifier(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="PIN / Password" 
          className="mb-4 w-full rounded border p-2" 
          value={credential} 
          onChange={(e) => setCredential(e.target.value)} 
        />
        
        <button 
          onClick={() => loginMutation.mutate()}
          disabled={loginMutation.isPending}
          className="w-full rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}