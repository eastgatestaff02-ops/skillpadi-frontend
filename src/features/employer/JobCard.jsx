import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wallet, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { JOB_STATUS } from '@/lib/utils/constants';

const urgencyStyles = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  urgent: 'bg-red-100 text-red-700',
};

const urgencyLabels = {
  low: 'Low priority',
  normal: 'Normal',
  urgent: 'Urgent',
};

const formatBudget = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);

export default function JobCard({ job, onMarkFilled, isUpdating }) {
  const [showApplicants, setShowApplicants] = useState(false);
  const isOpen = job.status === JOB_STATUS.OPEN;
  const applicants = job.applicants || [];

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 text-left shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <p className="mt-1 font-medium text-teal-700">{job.trade}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isOpen ? 'Open' : 'Filled'}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600">{job.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Wallet size={14} /> {job.budget ? formatBudget(job.budget) : 'No budget set'}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            urgencyStyles[job.urgency] || urgencyStyles.normal
          }`}
        >
          {urgencyLabels[job.urgency] || urgencyLabels.normal}
        </span>
        <span>Posted {new Date(job.createdAt).toLocaleDateString('en-NG')}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <button
          type="button"
          onClick={() => setShowApplicants((value) => !value)}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <Users size={16} />
          {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
          {showApplicants ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isOpen && (
          <button
            type="button"
            onClick={() => onMarkFilled(job.id)}
            disabled={isUpdating}
            className="rounded bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Mark as filled'}
          </button>
        )}
      </div>

      {showApplicants && (
        <ul className="mt-4 space-y-2">
          {applicants.length === 0 ? (
            <li className="text-sm italic text-gray-500">No applicants yet.</li>
          ) : (
            applicants.map((applicant) => (
              <li key={applicant.id}>
                <Link
                  to={`/profile/${applicant.id}`}
                  className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{applicant.name}</span>
                  <span className="text-gray-500">
                    {applicant.trade} - {applicant.location}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}