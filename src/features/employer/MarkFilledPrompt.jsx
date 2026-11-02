import { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const OUTSIDE = 'outside';

function PromptBody({ job, applicants, loading, error, completed, onConfirm, onCancel, onRate }) {
  const [selectedId, setSelectedId] = useState(applicants.length === 1 ? applicants[0].id : '');

  if (completed) {
    const hired = completed.hired;
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
          <CheckCircle2 size={28} className="text-success-500" />
        </span>
        <p className="mt-3 text-body2 font-bold text-navy-500">{job.title}</p>
        {hired ? (
          <>
            <p className="mt-2 text-body2 text-navy-500/70">
              Hired {hired.name}? Share a rating and written review to help others choose.
            </p>
            <div className="mt-5 space-y-3">
              <Button fullWidth onClick={() => onRate(hired)}>
                Rate worker
              </Button>
              <Button variant="outlined" fullWidth onClick={onCancel}>
                Maybe later
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-body2 text-navy-500/70">
              Your job is now closed to new applicants.
            </p>
            <Button fullWidth className="mt-5" onClick={onCancel}>
              Done
            </Button>
          </>
        )}
      </div>
    );
  }

  const needsChoice = applicants.length > 0;
  const hired = applicants.find((applicant) => applicant.id === selectedId) || null;
  const canConfirm = !needsChoice || selectedId !== '';

  const options = [
    ...applicants.map((applicant) => ({
      id: applicant.id,
      label: applicant.name || 'Applicant',
      detail: applicant.trade?.name || applicant.trade,
    })),
    { id: OUTSIDE, label: 'Someone outside SkillPadi', detail: '' },
  ];

  return (
    <>
      <p className="text-body2 font-bold text-navy-500">{job.title}</p>
      <p className="mt-2 text-body2 text-navy-500/70">
        This moves your job out of Open jobs. Workers will no longer see it.
      </p>

      {needsChoice && (
        <div className="mt-4">
          <p className="mb-2 text-caption font-bold text-navy-500">Who did you hire?</p>
          <div role="radiogroup" aria-label="Who did you hire?" className="space-y-2">
            {options.map((option) => {
              const selected = selectedId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedId(option.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-body2 text-navy-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-500 ${
                    selected ? 'border-ochre-500 bg-ochre-50' : 'border-navy-100 bg-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected ? 'border-ochre-500 bg-ochre-200' : 'border-navy-200 bg-white'
                    }`}
                  >
                    {selected && <Check size={12} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{option.label}</span>
                    {option.detail && (
                      <span className="block text-caption text-navy-500/70">{option.detail}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <FeedbackBanner tone="error" className="mt-4">
          {error}
        </FeedbackBanner>
      )}

      <div className="mt-5 space-y-3">
        <Button
          fullWidth
          loading={loading}
          disabled={!canConfirm}
          onClick={() => onConfirm(job, hired)}
        >
          Mark as filled
        </Button>
        <Button variant="outlined" fullWidth disabled={loading} onClick={onCancel}>
          Keep job open
        </Button>
      </div>
    </>
  );
}

export default function MarkFilledPrompt({
  job,
  applicants = [],
  loading,
  error,
  completed,
  onConfirm,
  onCancel,
  onRate,
}) {
  return (
    <Modal
      open={!!job}
      onClose={onCancel}
      title={completed ? 'Job marked as filled' : 'Mark this job as filled?'}
    >
      {job && (
        <PromptBody
          job={job}
          applicants={applicants}
          loading={loading}
          error={error}
          completed={completed}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onRate={onRate}
        />
      )}
    </Modal>
  );
}