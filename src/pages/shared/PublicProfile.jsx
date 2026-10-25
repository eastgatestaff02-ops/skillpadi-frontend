import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workerApi } from '@/lib/api/worker';
import { Star, MapPin, Briefcase, MessageCircle } from 'lucide-react';

export default function PublicProfile() {
  const { id } = useParams();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: () => workerApi.getPublicProfile(id).then(res => res.data),
  });

  if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center">Worker not found.</div>;

  // WhatsApp Deep Link (MVP Core Requirement)
  const whatsappMessage = encodeURIComponent(`Hi ${profile.name}, I found your profile on SkillPadi and I'd like to hire you for a job.`);
  const whatsappLink = `https://wa.me/${profile.phone.replace('+', '')}?text=${whatsappMessage}`;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-lg text-teal-700 font-medium flex items-center gap-2 mt-1">
              <Briefcase size={18} /> {profile.trade}
            </p>
            <p className="text-gray-500 flex items-center gap-2 mt-2">
              <MapPin size={16} /> {profile.location} • {profile.yearsOfExperience} years exp.
            </p>
          </div>
          
          <div className="text-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center text-yellow-600 font-bold text-2xl">
              {profile.rating || 'New'} <Star size={20} className="ml-1 fill-current" />
            </div>
            <p className="text-xs text-yellow-700 mt-1">{profile.reviewCount || 0} reviews</p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
        >
          <MessageCircle size={20} />
          Contact via WhatsApp
        </a>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Portfolio</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profile.portfolio?.length > 0 ? (
            profile.portfolio.map((img, idx) => (
              <img key={idx} src={img} alt="Portfolio" className="w-full h-32 object-cover rounded border" />
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No portfolio images uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}