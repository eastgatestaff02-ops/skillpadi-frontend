import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { apiClient } from '@/lib/api/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function WorkerTraining() {
  const { user } = useAuthStore();
  const isTrainer = user?.roles?.includes('trainer');

  // 1. Fetch Trainer Listings (only if user is a trainer)
  const { data: listings, isLoading: listingsLoading, isError: listingsError } = useQuery({
    queryKey: ['trainerListings'],
    queryFn: () => apiClient.get('/api/training/listings/mine').then(res => res.data.data || res.data),
    enabled: isTrainer,
    retry: 1,
  });

  // 2. Fetch Trainer Profile (only if user is a trainer)
  const { data: trainerProfile } = useQuery({
    queryKey: ['trainerProfile'],
    queryFn: () => apiClient.get('/api/training/trainer/me').then(res => res.data.data || res.data),
    enabled: isTrainer,
    retry: 1,
  });

  // Fallback if the user hasn't been granted the 'trainer' role yet
  if (!isTrainer) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-navy-500">Trainer Dashboard</h1>
        <Card className="p-8 text-center">
          <Users size={48} className="mx-auto text-ochre-500 mb-4" />
          <h2 className="text-xl font-bold text-navy-500 mb-2">Become a Trainer</h2>
          <p className="text-navy-500/70 mb-6 max-w-md mx-auto">
            You are currently registered as a Worker. To train apprentices and create listings, you need to upgrade your account.
          </p>
          <Button>Apply to become a Trainer</Button>
        </Card>
      </div>
    );
  }

  const listingArray = Array.isArray(listings) ? listings : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">My Apprentices (Trainer Dashboard)</h1>
          <p className="text-navy-500/70 mt-1">
            {trainerProfile?.trade?.name ? `Training in ${trainerProfile.trade.name}` : 'Manage your listings and applicants'}
          </p>
        </div>
        <Link to="/worker/training/listings/new">
          <Button className="bg-ochre-500 hover:bg-ochre-600 text-white border-none flex items-center gap-2">
            <Plus size={18} /> New Listing
          </Button>
        </Link>
      </div>

      {/* Listings Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-navy-500">My Training Listings</h2>
        
        {listingsLoading ? (
          <LoadingSpinner label="Loading your listings..." />
        ) : listingsError || listingArray.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
            <BookOpen size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-navy-500 font-medium">You haven't created any training listings yet.</p>
            <p className="text-sm text-navy-500/70 mt-1 mb-4">Create a listing to start receiving applications from apprentices.</p>
            <Link to="/worker/training/listings/new">
              <Button variant="outlined">Create Your First Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listingArray.map((listing) => (
              <div key={listing.id} className="border border-gray-100 rounded-lg p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white hover:shadow-sm transition">
                <div>
                  <p className="font-bold text-navy-500 text-lg">{listing.title || listing.trade?.name || 'Apprenticeship Listing'}</p>
                  <p className="text-sm text-navy-500/70 mt-1">
                    {listing.duration || '6 months'} • {listing.location || 'Lagos'}
                  </p>
                </div>
                <Link to={`/worker/training/listings/${listing.id}/applicants`}>
                  <Button variant="outlined" size="sm">View Applicants</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}