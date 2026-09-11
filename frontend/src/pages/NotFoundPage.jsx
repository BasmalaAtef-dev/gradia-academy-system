import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        textAlign: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
        404
      </div>
      <h1 style={{ fontSize: 'var(--fs-lg)' }}>Page not found</h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
      </p>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
