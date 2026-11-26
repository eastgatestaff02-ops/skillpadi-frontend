import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { GraduationCap, Plus, Users, Briefcase } from 'lucide-react';
import { trainingApi } from '@/lib/api/training';
import { apiClient } from '@/lib/api/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function TrainerDashboard() {
  const { user, setUser } = useAuthStore();
  const [selectedListingId, setSelectedListingId] = useState(null);
  
  // 1. Check role
  const isTrainer = user?.role === 'trainer' || user?.roles?.includes('trainer');

  // 2. Fetch Listings (Only if trainer)
  const { data: listings, isLoading: loadingListings } = useQuery({
    queryKey: ['trainerListings'],
    queryFn: () => trainingApi.getMyListings().then(res => res.data.data || res.data),
    enabled: isTrainer, 
  });

  // 3. Fetch Applicants for a specific listing
  const { data: applicants, isLoading: loadingApplicants } = useQuery({
    queryKey: ['listingApplicants', selectedListingId],
    queryFn: () => trainingApi.getApplicantsForListing(selectedListingId).then(res => res.data.data || res.data),
    enabled: !!selectedListingId, // Only fetch if a listing is clicked
  });

  // 4. Upgrade to Trainer Mutation
  const becomeTrainerMutation = useMutation({
    mutationFn: () => apiClient.post('/api/me/roles', { role: 'trainer' }),
    onSuccess: (res) => {
      setUser(res.data.data || res.data);
      alert('You are now a trainer!');
      window.location.reload(); 
    },
    onError: (err) => alert(err.response?.data?.error?.message || 'Failed to upgrade.'),
  });

  // --- RENDER: If not a trainer ---
  if (!isTrainer) {
    return (
      <div className="mx-auto max-w-xl text-center py-10">
        <Card className="p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ochre-100 mb-4">
            <GraduationCap size={32} className="text-ochre-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-500 mb-2">Become a Trainer</h2>
          <p className="text-body2 text-navy-500/70 mb-6">
            Upgrade your account to start creating apprenticeship listings and manage apprentices.
          </p>
          <Button 
            onClick={() => becomeTrainerMutation.mutate()} 
            loading={becomeTrainerMutation.isPending}
            size="lg" fullWidth
          >
            Upgrade to Trainer
          </Button>
        </Card>
      </div>
    );
  }

  // --- RENDER: Trainer Dashboard ---
  return (
    <div className="mx-auto max-w-4xl text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h2 font-bold text-navy-500">Trainer Dashboard</h1>
        <Button as={Link} to="/worker/training/listings/new" leftIcon={Plus}>
          New Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: My Listings */}
        <Card className="p-5">
          <h2 className="text-h3 font-bold text-navy-500 mb-4 flex items-center gap-2">
            <Briefcase size={20} /> My Listings
          </h2>
          {loadingListings ? (
            <LoadingSpinner label="Loading..." />
          ) : !listings || listings.length === 0 ? (
            <p className="text-sm text-navy-500/70">You haven't created any listings yet.</p>
          ) : (
            <div className="space-y-3">
              {listings.map(listing => (
                <button
                  key={listing.id}
                  onClick={() => setSelectedListingId(listing.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedListingId === listing.id ? 'border-ochre-500 bg-ochre-50' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-navy-500">{listing.trade?.name || 'Trade'}</p>
                  <p className="text-xs text-navy-500/70">{listing.duration} • {listing.location}</p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Right Side: Applicants */}
        <Card className="p-5">
          <h2 className="text-h3 font-bold text-navy-500 mb-4 flex items-center gap-2">
            <Users size={20} /> Applicants
          </h2>
          {!selectedListingId ? (
            <p className="text-sm text-navy-500/70 italic">Select a listing to view its applicants.</p>
          ) : loadingApplicants ? (
            <LoadingSpinner label="Loading applicants..." />
          ) : !applicants || applicants.length === 0 ? (
            <p className="text-sm text-navy-500/70 italic">No one has applied to this listing yet.</p>
          ) : (
            <div className="space-y-3">
              {applicants.map(app => (
                <div key={app.id} className="p-3 border border-gray-100 rounded-lg bg-white">
                  <p className="font-bold text-navy-500">{app.apprentice?.firstName} {app.apprentice?.lastName}</p>
                  <p className="text-xs text-navy-500/70 mt-1">{app.apprentice?.email}</p>
                  <span className="inline-block mt-2 text-xs font-bold uppercase text-ochre-600 bg-ochre-50 px-2 py-1 rounded">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}