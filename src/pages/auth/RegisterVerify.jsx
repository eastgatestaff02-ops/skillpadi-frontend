import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../lib/api/auth';

export default function RegisterVerify() {
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get phone from state passed from Signup, or fallback to local storage
  const phone = location.state?.phone || localStorage.getItem('reg_phone');

  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyOtp({ phone, otp }),
    onSuccess: (res) => {
      // Save the registration token to use in the next step
      if (res.data.registration_token) {
        localStorage.setItem('reg_token', res.data.registration_token);
      }
      navigate('/auth/register/complete');
    },
    onError: (err) => {
      const error = err.response?.data?.error;
      if (error?.code === 'OTP_INVALID') setErrorMsg('Incorrect code. Please try again.');
      else if (error?.code === 'OTP_EXPIRED') setErrorMsg('Code expired. Please request a new one.');
      else if (error?.code === 'OTP_ATTEMPTS_EXCEEDED') setErrorMsg('Too many attempts. Try again later.');
      else setErrorMsg('Verification failed. Please try again.');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded bg-white p-8 shadow">
        <h2 className="mb-2 text-2xl font-bold text-teal-700">Verify Phone</h2>
        <p className="mb-6 text-sm text-gray-500">Enter the 6-digit code sent to {phone || 'your phone'}</p>
        
        <input 
          type="text" 
          placeholder="123456" 
          maxLength={6}
          className="mb-2 w-full rounded border p-2 text-center text-lg tracking-widest" 
          value={otp} 
          onChange={(e) => {
            setOtp(e.target.value);
            setErrorMsg('');
          }} 
        />
        {errorMsg && <p className="mb-4 text-sm text-red-500">{errorMsg}</p>}
        
        <button 
          onClick={() => verifyMutation.mutate()}
          disabled={verifyMutation.isPending || otp.length < 6}
          className="mt-2 w-full rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
}