import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-2xl text-left">
        <Link to="/auth/sign-up" className="text-body2 font-bold text-ochre-900 hover:underline">
          Back to sign up
        </Link>
        <Card className="mt-4 space-y-4 p-6">
          <h1 className="text-h2 font-bold text-navy-500">Privacy notice</h1>
          <p className="text-body2 text-navy-500">
            SkillPadi collects your name, phone number or email, trade, location, work photos and
            reviews so we can create your account and connect workers, employers and apprentices.
          </p>
          <p className="text-body2 text-navy-500">
            Your phone number is only shared with an employer when you are contacted through
            WhatsApp or a call. We do not sell your personal data.
          </p>
          <p className="text-body2 text-navy-500">
            You can ask us to correct or delete your data at any time. You can withdraw your
            consent in your privacy settings.
          </p>
        </Card>
      </div>
    </div>
  );
}