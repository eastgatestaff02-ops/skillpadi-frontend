import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Briefcase, MessageCircle, Phone, Flag } from 'lucide-react';
import { workerApi } from '@/lib/api/worker';
import { reportsApi } from '@/lib/api/reports';
import { useWorkerContact } from '@/lib/hooks/useWorkerContact';
import { useWorkerReviews } from '@/lib/hooks/useReviews';
import { resolveContact, buildWhatsappLink, buildCallLink } from '@/lib/utils/contact';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { queryDefaults } from '@/lib/utils/network';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import { StarDisplay } from '@/components/ui/StarRating';
import ReviewCard from '@/features/trust/ReviewCard';
import ReportProfileSheet from '@/features/trust/ReportProfileSheet';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

const WHATSAPP_MESSAGE =
  "Hi, I found your profile on SkillPadi and I'd like to hire you for a job.";

const imageUrl = (item) => {
  if (typeof item === 'string') return item;
  return item?.url || item?.imageUrl || item?.image_url || null;
};

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState(null);
  const [contactError, setContactError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: () => workerApi.getPublicProfile(id).then((res) => res.data?.data ?? res.data),
    ...queryDefaults,
  });

  const reviewsQuery = useWorkerReviews(id);
  const contact = useWorkerContact();

  const handleContact = (mode) => {
    setContactError('');
    const popup = mode === 'whatsapp' ? window.open('about:blank', '_blank') : null;

    const finish = (info) => {
      const target =
        mode === 'call'
          ? buildCallLink(info.phone)
          : info.url || buildWhatsappLink(info.phone, WHATSAPP_MESSAGE);

      if (!target) {
        popup?.close();
        setContactError('Contact details are not available for this worker.');
        return;
      }

      if (mode === 'call') window.location.href = target;
      else if (popup) popup.location.href = target;
      else window.location.assign(target);
    };

    if (contactInfo) {
      finish(contactInfo);
      return;
    }

    contact.mutate(id, {
      onSuccess: (body) => {
        const info = resolveContact(body);
        setContactInfo(info);
        finish(info);
      },
      onError: (err) => {
        popup?.close();
        setContactError(
          getApiErrorMessage(err, 'Could not get contact details. Please try again.')
        );
      },
    });
  };

  const handleReport = (payload) => reportsApi.reportProfile({ targetId: id, ...payload });

  let body;

  if (isLoading) {
    body = <LoadingSpinner label="Loading profile..." />;
  } else if (isError || !profile) {
    body = <ErrorState message="We could not load this profile." onRetry={refetch} />;
  } else {
    const trade = profile.trade?.name || profile.trade;
    const location =
      [profile.lga?.name, profile.state?.name].filter(Boolean).join(', ') ||
      (typeof profile.location === 'string' ? profile.location : '');
    const years = profile.yearsExperience ?? profile.yearsOfExperience;
    const name = profile.name || trade || 'Skilled worker';
    const skills = (profile.skills || []).map((skill) =>
      typeof skill === 'string' ? skill : skill.name
    );
    const portfolio = (profile.portfolio || profile.portfolioImages || [])
      .map(imageUrl)
      .filter(Boolean);
    const rating = Number(profile.rating ?? profile.averageRating) || 0;
    const reviewCount = profile.reviewCount ?? profile.reviewsCount ?? 0;
    const reviews = reviewsQuery.data || [];

    let reviewsContent;
    if (reviewsQuery.isLoading) {
      reviewsContent = <LoadingSpinner label="Loading reviews..." />;
    } else if (reviewsQuery.isError) {
      reviewsContent = (
        <ErrorState message="We could not load reviews." onRetry={reviewsQuery.refetch} />
      );
    } else if (reviews.length === 0) {
      reviewsContent = <p className="text-body2 text-navy-500/70">No reviews yet.</p>;
    } else {
      reviewsContent = (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      );
    }

    body = (
      <>
        <Card className="p-5">
          <div className="flex items-start gap-4">
            <Avatar name={name} src={profile.avatarUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="text-h2 font-bold text-navy-500">{name}</h1>
              {trade && name !== trade && (
                <p className="mt-1 flex items-center gap-1.5 text-body2 text-navy-500">
                  <Briefcase size={14} className="shrink-0" /> {trade}
                </p>
              )}
              {location && (
                <p className="mt-1 flex items-center gap-1.5 text-body2 text-navy-500/70">
                  <MapPin size={14} className="shrink-0" /> {location}
                </p>
              )}
              {typeof years === 'number' && (
                <p className="mt-1 text-body2 text-navy-500/70">
                  {years} {years === 1 ? 'year' : 'years'} of experience
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                {rating > 0 ? (
                  <>
                    <StarDisplay value={rating} size={14} />
                    <span className="text-caption text-navy-500/70">
                      {rating.toFixed(1)} ({reviewCount})
                    </span>
                  </>
                ) : (
                  <span className="text-caption text-navy-500/60">New on SkillPadi</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Button
              size="lg"
              fullWidth
              leftIcon={MessageCircle}
              loading={contact.isPending}
              onClick={() => handleContact('whatsapp')}
            >
              Contact on WhatsApp
            </Button>
            <Button
              variant="outlined"
              size="lg"
              fullWidth
              leftIcon={Phone}
              disabled={contact.isPending}
              onClick={() => handleContact('call')}
            >
              Call
            </Button>
          </div>

          {contactError && (
            <FeedbackBanner tone="error" className="mt-4">
              {contactError}
            </FeedbackBanner>
          )}
        </Card>

        {skills.length > 0 && (
          <Card>
            <h2 className="text-h3 font-bold text-navy-500">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h2 className="text-h3 font-bold text-navy-500">Work photos</h2>
          {portfolio.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {portfolio.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Previous work"
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-body2 text-navy-500/70">No work photos yet.</p>
          )}
        </Card>

        <section>
          <h2 className="mb-3 text-h3 font-bold text-navy-500">Reviews</h2>
          {reviewsContent}
        </section>

        <div className="pt-2 text-center">
          <Button
            variant="text"
            tone="error"
            size="sm"
            leftIcon={Flag}
            onClick={() => setReportOpen(true)}
          >
            Report this profile
          </Button>
        </div>

        <ReportProfileSheet
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          onSubmit={handleReport}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-10">
      <header className="border-b border-navy-50 bg-cream">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <Button variant="text" size="sm" leftIcon={ArrowLeft} onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 text-left">{body}</main>
    </div>
  );
}