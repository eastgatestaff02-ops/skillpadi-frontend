import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import { Link } from 'react-router-dom';
import { User, FileText, Settings } from 'lucide-react';

export default function WorkerDashboard() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => jobsApi.getMyApplications().then(res => res.data),
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Worker Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/worker/profile" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <User className="text-teal-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">My Profile</h2>
          <p className="text-gray-500 text-sm">Update your skills and portfolio</p>
        </Link>
        <Link to="/worker/jobs" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <FileText className="text-teal-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">Find Jobs</h2>
          <p className="text-gray-500 text-sm">Browse open opportunities</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">My Applications</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : applications?.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="divide-y">
            {applications?.map(app => (
              <div key={app.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{app.job.title}</p>
                  <p className="text-sm text-gray-500">{app.job.employer.companyName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}