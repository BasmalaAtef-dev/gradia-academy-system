import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState, ErrorState } from '../../components/ui/StateScreens';
import { profileService } from '../../services/api/profileService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';
import './profile.css';

export function ProfilePage() {
  const { logout } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');

  async function loadData() {
    setStatus('loading');
    try {
       const res = await profileService.getMyProfile();
      if (!res.success) {
        setStatus('error');
        return;
      }
      setProfile(res.data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') return <LoadingState label="Loading your profile..." />;
  if (status === 'error') return <ErrorState onRetry={loadData} />;

  return (
    <>
      <PageHeader eyebrow="Account" title="Profile & Settings" subtitle="Your personal information and account details." />

      <div className="profile-header">
        <Avatar name={profile.fullName} size="lg" />
        <div className="profile-header__info">
          <h2>{profile.fullName}</h2>
          <p>{profile.email}</p>
          <div style={{ marginTop: 8 }}>
            <Badge variant="primary">{profile.role}</Badge>
          </div>
        </div>
      </div>

      <Panel title="Account details">
        <div className="profile-detail-grid">
          <div className="profile-detail-item">
            <span className="profile-detail-label">Full name</span>
            <span className="profile-detail-value">{profile.fullName}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-detail-label">Email</span>
            <span className="profile-detail-value">{profile.email}</span>
          </div>

          {profile.role === ROLES.STUDENT && (
            <>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Date of birth</span>
                <span className="profile-detail-value">{formatDate(profile.dateOfBirth)}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Phone</span>
                <span className="profile-detail-value">{profile.phone || '—'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Address</span>
                <span className="profile-detail-value">{profile.address || '—'}</span>
              </div>
            </>
          )}

          {profile.role === ROLES.TEACHER && (
            <>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Specialization</span>
                <span className="profile-detail-value">{profile.specialization || '—'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Hire date</span>
                <span className="profile-detail-value">{formatDate(profile.hireDate)}</span>
              </div>
            </>
          )}
        </div>
      </Panel>

      <div style={{ marginTop: 'var(--space-5)' }}>
        <Button variant="outline" onClick={() => { logout(); toast.info('Signed out.'); }}>
          Sign out
        </Button>
      </div>
    </>
  );
}
