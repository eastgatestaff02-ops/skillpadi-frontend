import { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TextAreaField from '@/components/ui/TextAreaField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const REASONS = [
  { value: 'fraud', label: 'Suspected fraud or scam' },
  { value: 'false_information', label: 'False profile information' },
  { value: 'other', label: 'Other concern' },
];

function ReportForm({ onSubmit, onClose }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || status === 'submitting') return;
    setStatus('submitting');
    setError('');
    try {
      await onSubmit({ reason, details: details.trim() });
      setStatus('done');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not send your report. Please try again.'));
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
          <CheckCircle2 size={28} className="text-success-500" />
        </span>
        <p className="mt-3 text-h3 font-bold text-navy-500">Report received</p>
        <p className="mt-1 text-body2 text-navy-500/70">
          Thank you for flagging this profile. Our moderation team will review your report manually.
        </p>
        <p className="mt-2 text-caption text-navy-500/60">
          A report does not automatically remove a profile.
        </p>
        <Button fullWidth className="mt-6" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-body2 text-navy-500/70">
        Help us understand what is wrong with this profile.
      </p>

      <div role="radiogroup" aria-label="Reason for report" className="space-y-2">
        {REASONS.map((item) => {
          const selected = reason === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setReason(item.value)}
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
              {item.label}
            </button>
          );
        })}
      </div>

      <TextAreaField
        label="Additional details (optional)"
        placeholder="Tell us what happened"
        helper="Do not include sensitive personal information."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}

      <div className="space-y-3">
        <Button
          type="submit"
          tone="error"
          fullWidth
          loading={status === 'submitting'}
          disabled={!reason}
        >
          Submit report
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose} disabled={status === 'submitting'}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function ReportProfileSheet({ open, onClose, onSubmit }) {
  return (
    <Modal open={open} onClose={onClose} title="Report this profile">
      <ReportForm onSubmit={onSubmit} onClose={onClose} />
    </Modal>
  );
}