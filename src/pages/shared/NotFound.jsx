import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <Card className="w-full max-w-sm p-6 text-center">
        <p className="text-title font-bold text-ochre-500">404</p>
        <h1 className="mt-2 text-h2 font-bold text-navy-500">Page not found</h1>
        <p className="mt-1 text-body2 text-navy-500/70">
          The page you are looking for does not exist or has moved.
        </p>
        <Button to="/" size="lg" fullWidth className="mt-6">
          Go to the start
        </Button>
      </Card>
    </div>
  );
}