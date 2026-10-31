import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/authStore';

export default function CompleteRegistration() {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  const phone = localStorage.getItem('reg_phone');
  const regToken = localStorage.getItem('reg_token');

  const completeMutation = useMutation({
    mutationFn: () => authApi.completeRegistration({ 
      phone, 
      otp_token: regToken, 
      pin, 
      name: 'New User' // You might want to add a First Name input to your form
    }),
    onSuccess: (res) => {
      const { access_token, refresh_token, user } = res.data;
      setAuth(access_token, refresh_token, user);
      navigate('/auth/select-role');
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to complete registration');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded bg-white p-8 shadow">
        <h2 className="mb-4 text-2xl font-bold text-teal-700">Create a PIN</h2>
        <p className="mb-6 text-sm text-gray-500">Secure your account with a 4-digit PIN.</p>
        
        <input 
          type="password" 
          placeholder="****" 
          maxLength={4}
          className="mb-4 w-full rounded border p-2 text-center text-lg" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
        />
        
        <button 
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending || pin.length < 4}
          className="w-full rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {completeMutation.isPending ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}