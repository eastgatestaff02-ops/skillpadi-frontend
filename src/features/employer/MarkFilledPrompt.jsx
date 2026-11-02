import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function MarkFilledPrompt({ job, loading, error, onConfirm, onCancel }) {
  return (
    <Modal open={!!job} onClose={onCancel} title="Mark this job as filled?">
      {job && (
        <>
          <p className="text-body2 font-bold text-navy-500">{job.title}</p>
          <p className="mt-2 text-body2 text-navy-500/70">
            This moves your job out of Open jobs. Workers will no longer see it.
          </p>

          {error && (
            <FeedbackBanner tone="error" className="mt-4">
              {error}
            </FeedbackBanner>
          )}

          <div className="mt-5 space-y-3">
            <Button fullWidth loading={loading} onClick={() => onConfirm(job)}>
              Mark as filled
            </Button>
            <Button variant="outlined" fullWidth disabled={loading} onClick={onCancel}>
              Keep job open
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}