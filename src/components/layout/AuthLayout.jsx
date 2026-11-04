import Card from '@/components/ui/Card';
import Logo from '@/components/ui/Logo';

export default function AuthLayout({ title, subtitle, footer, bare = false, wide = false, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-sm'}`}>
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-1 text-body2 text-navy-500/70">From Apprentice to Master.</p>
        </div>

        {bare ? (
          <div>
            <h1 className="text-center text-h2 font-bold text-navy-500">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-center text-body2 text-navy-500/70">{subtitle}</p>
            )}
            <div className="mt-6">{children}</div>
          </div>
        ) : (
          <Card className="p-6">
            <h1 className="text-h2 font-bold text-navy-500">{title}</h1>
            {subtitle && <p className="mt-1 text-body2 text-navy-500/70">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </Card>
        )}

        {footer && <div className="mt-6 text-center text-body2 text-navy-500/70">{footer}</div>}
      </div>
    </div>
  );
}