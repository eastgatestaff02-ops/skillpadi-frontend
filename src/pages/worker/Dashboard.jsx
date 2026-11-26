import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

export default function WorkerDashboard() {
  const { user } = useAuthStore();
  
  const { data: applications, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => jobsApi.getMyApplications().then(res => res.data.data || res.data),
    retry: 1,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-500">Welcome, {user?.firstName || 'Worker'}</h1>
        <p className="text-navy-500/70 mt-1">Here is an overview of your job applications and profile.</p>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm">
        <img src="/worker_tools.jpg" alt="Worker Tools" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 to-transparent flex items-center p-6 md:p-8">
          <div className="max-w-md text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to work?</h2>
            <p className="text-sm opacity-90">Complete your profile and find new jobs in Lagos today.</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy-500">Home</h2>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/worker/profile" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-cream rounded-lg"><User className="text-ochre-500" size={24} /></div>
            <h3 className="font-bold text-lg text-navy-500">My Profile</h3>
          </div>
          <p className="text-navy-500/70 text-sm">Update your skills and work photos.</p>
        </Link>

        <Link to="/worker/jobs" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-cream rounded-lg"><Briefcase className="text-ochre-500" size={24} /></div>
            <h3 className="font-bold text-lg text-navy-500">Find Jobs</h3>
          </div>
          <p className="text-navy-500/70 text-sm">Browse open work near you.</p>
        </Link>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-navy-500">My Applications</h2>
          <Link to="/worker/jobs" className="text-ochre-500 text-sm font-bold flex items-center gap-1 hover:underline">
            Find more <ChevronRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading applications..." />
        ) : !applications || applications.length === 0 ? (
          <EmptyState 
            title="No applications yet" 
            message="Apply to a job and you can follow its progress here." 
            action={<Link to="/worker/jobs" className="text-ochre-600 font-bold hover:underline">Find Jobs</Link>} 
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy-500">{app.job?.title || 'Job Title'}</p>
                  <p className="text-sm text-navy-500/70">{app.job?.employer?.companyName || 'Employer'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {app.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}