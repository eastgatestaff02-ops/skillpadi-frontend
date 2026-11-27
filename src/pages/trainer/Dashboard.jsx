import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { trainingApi } from '@/lib/api/training';
import { Briefcase, Users, GraduationCap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function TrainerDashboard() {
  const { user } = useAuthStore();
  
  // 1. Check if the backend has granted them the trainer role
  const isTrainer = user?.roles?.includes('trainer') || user?.role === 'trainer';

  // 2. Fetch Listings (Only fires if isTrainer is true)
  const { data: listings = [], isLoading: loadingListings, isError: listingsError } = useQuery({
    queryKey: ['trainerListings'],
    queryFn: () => trainingApi.getMyListings().then(res => res.data.data || res.data),
    enabled: isTrainer, 
  });

  // 3. If they are NOT a trainer, show the setup screen
  if (!isTrainer) {
    return (
      <div className="mx-auto max-w-xl text-center py-10">
        <Card className="p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ochre-100 mb-4">
            <GraduationCap size={32} className="text-ochre-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-500 mb-2">Become a Trainer</h2>
          <p className="text-body2 text-navy-500/70 mb-6">
            To create apprenticeship listings, you first need to set up a trainer profile.
          </p>
          
          {/* FIXED: Using React Router Link */}
          <Button as={Link} to="/worker/training/profile" size="lg" fullWidth>
            Set up Trainer Profile
          </Button>
        </Card>
      </div>
    );
  }

  // 4. Render the actual Dashboard
  return (
    <div className="mx-auto max-w-4xl text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h2 font-bold text-navy-500">Trainer Dashboard</h1>
        <Button as={Link} to="/worker/training/listings/new">New Listing</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-h3 font-bold text-navy-500 mb-4 flex items-center gap-2">
            <Briefcase size={20} /> My Listings
          </h2>
          {loadingListings ? (
            <LoadingSpinner />
          ) : listingsError ? (
            <p className="text-red-500 text-sm">Failed to load listings. Token may have expired.</p>
          ) : listings.length === 0 ? (
            <p className="text-sm text-navy-500/70">You haven't created any listings yet.</p>
          ) : (
            <div className="space-y-3">
              {listings.map(listing => (
                <div key={listing.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="font-bold text-navy-500">{listing.trade?.name || 'Trade'}</p>
                  <p className="text-xs text-navy-500/70">{listing.location}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
           <h2 className="text-h3 font-bold text-navy-500 mb-4 flex items-center gap-2">
            <Users size={20} /> Applicants
          </h2>
          <p className="text-sm text-navy-500/70 italic">Select a listing to view applicants.</p>
        </Card>
      </div>
    </div>
  );
}