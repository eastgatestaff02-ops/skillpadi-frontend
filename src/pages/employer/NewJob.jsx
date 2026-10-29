import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../../lib/api/jobs';
import { catalogApi } from '../../lib/api/catalog';

export default function NewJob() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { data: trades } = useQuery({ queryKey: ['trades'], queryFn: catalogApi.getTrades });

  const createMutation = useMutation({
    mutationFn: (data) => jobsApi.createJob(data),
    onSuccess: () => {
      alert('Job posted successfully!');
      navigate('/employer/dashboard'); 
    },
    onError: (err) => alert(err.response?.data?.error?.message || 'Failed to post job'),
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Post a New Job</h1>
      
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input type="text" {...register('title')} required className="w-full border p-2 rounded" placeholder="e.g. Fix wiring in 3-bedroom flat" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea {...register('description')} required className="w-full p-2 border rounded h-24" placeholder="Provide details about the job..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Trade Needed</label>
            <select {...register('tradeId')} required className="w-full border p-2 rounded">
              <option value="">Select Trade</option>
              {trades?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" {...register('location')} required className="w-full border p-2 rounded" placeholder="e.g. Ikeja, Lagos" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Budget (₦)</label>
          <input type="number" {...register('budget')} required className="w-full border p-2 rounded" placeholder="15000" />
        </div>

        <button type="submit" disabled={createMutation.isPending} className="w-full bg-teal-600 text-white py-2 rounded shadow hover:bg-teal-700 disabled:opacity-50">
          {createMutation.isPending ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}