import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { MapPin, Briefcase, Search } from 'lucide-react';

export default function JobsSearch() {
  const [filters, setFilters] = useState({ trade: '', location: '' });
  const [searchTrigger, setSearchTrigger] = useState(null);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['openJobs', searchTrigger],
    queryFn: () => jobsApi.getOpenJobs(searchTrigger).then(res => res.data),
    enabled: !!searchTrigger,
  });

  const applyMutation = useMutation({
    mutationFn: (jobId) => jobsApi.applyForJob(jobId, { message: 'I am interested' }),
    onSuccess: () => alert('Application submitted!'),
    onError: () => alert('Failed to apply. You may have already applied.'),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTrigger(filters);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Find Jobs</h1>

      <form onSubmit={handleSearch} className="flex gap-4 mb-8 bg-white p-4 rounded shadow-sm">
        <input 
          type="text" 
          placeholder="Trade (e.g. Electrician)" 
          value={filters.trade}
          onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
          className="flex-1 border p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="Location" 
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2">
          <Search size={18} /> Search
        </button>
      </form>

      {isLoading ? (
        <div className="text-center py-10">Loading jobs...</div>
      ) : jobs?.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No jobs found.</div>
      ) : (
        <div className="space-y-4">
          {jobs?.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                <p className="text-teal-700 font-medium flex items-center gap-1 mt-1">
                  <Briefcase size={16} /> {job.trade}
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={16} /> {job.location} • Budget: ₦{job.budget}
                </p>
              </div>
              <button 
                onClick={() => applyMutation.mutate(job.id)}
                disabled={applyMutation.isPending}
                className="bg-teal-50 text-teal-700 border border-teal-200 px-4 py-2 rounded hover:bg-teal-100 font-medium"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}