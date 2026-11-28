import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, GraduationCap, Clock, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    DECLINED: 'bg-red-100 text-red-700',
    GRADUATED: 'bg-blue-100 text-blue-700',
  };
  // Handle both uppercase and lowercase statuses
  const normalizedStatus = status?.toUpperCase() || 'PENDING'; 
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${styles[normalizedStatus] || styles.pending}`}>
      {normalizedStatus}
    </span>
  );
};

export default function ApprenticeDashboard() {
  const { user } = useAuthStore();

  // Fetch the apprentice's applications (Correct endpoint from Swagger)
  const { data: applications, isLoading } = useQuery({
    queryKey: ['apprenticeApplications'],
    queryFn: () => apiClient.get('/api/training/applications/mine').then((res) => res.data.data || res.data),
    retry: 1,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-500">Welcome, {user?.firstName || 'Apprentice'}</h1>
        <p className="text-navy-500/70 mt-1">Track your applications and find new trainers to learn from.</p>
      </div>

      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm">
        <img 
          src="/onboarding_worker.jpg" 
          alt="Apprentice Learning" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/40 flex items-center p-6 md:p-10">
          <div className="max-w-md text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to learn?</h2>
            <p className="text-sm md:text-base opacity-90 mb-4">Find a master trainer in your area and start your journey.</p>
            <Link to="/apprentice/listings">
              <Button variant="primary" className="bg-ochre-500 hover:bg-ochre-600 text-white border-none">
                Browse Apprenticeships
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/apprentice/listings" className="block">
          <Card className="p-6 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-cream rounded-lg">
                <BookOpen className="text-ochre-500" size={24} />
              </div>
              <h2 className="font-bold text-lg text-navy-500">Find Trainers</h2>
            </div>
            <p className="text-navy-500/70 text-sm">Browse listings and apply to learn a new trade.</p>
          </Card>
        </Link>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-cream rounded-lg">
              <GraduationCap className="text-ochre-500" size={24} />
            </div>
            <h2 className="font-bold text-lg text-navy-500">My Applications</h2>
          </div>
          <p className="text-navy-500/70 text-sm">You have applied to {applications?.length || 0} listings.</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-navy-500 mb-6">Recent Applications</h2>

        {isLoading ? (
          <LoadingSpinner label="Loading your applications..." />
        ) : !applications || applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-navy-500/70 text-sm mb-4">You haven't applied to any apprenticeships yet.</p>
            <Link to="/apprentice/listings">
              <Button variant="outlined">Find a Trainer</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="font-bold text-navy-500 text-lg">{app.listing?.trade?.name || 'Trade'}</p>
                  <p className="text-sm text-navy-500/70 flex items-center gap-1 mt-1">
                    <Clock size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-navy-500/70 mt-1">
                    Trainer: {app.listing?.trainer?.firstName} {app.listing?.trainer?.lastName}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}