import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { ActivityFeed } from '../../components/ui/ActivityFeed';
import { LoadingState, ErrorState } from '../../components/ui/StateScreens';
import { PerformanceTrendChart } from '../../components/ui/charts/PerformanceTrendChart';
import { GradeDistributionChart } from '../../components/ui/charts/GradeDistributionChart';
import { IconUsers, IconChalkboard, IconBook, IconClipboard, IconGraduationCap } from '../../components/ui/icons';
import { dashboardService } from '../../services/api/dashboardService';
import { enrollmentService } from '../../services/api/enrollmentService';
import { useAuth } from '../../hooks/useAuth';
import '../../components/ui/Panel.css';

export function AdminDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [trend, setTrend] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [status, setStatus] = useState('loading');

  async function loadData() {
    setStatus('loading');
    try {
      const [summaryRes, activityRes, trendRes, distributionRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRecentActivity(),
        enrollmentService.getGradeTrend(),
        enrollmentService.getGradeDistribution(),
      ]);
      setSummary(summaryRes.success ? summaryRes.data : null);
      setActivity(activityRes.success ? activityRes.data : []);
      setTrend(trendRes.success ? trendRes.data : []);
      setDistribution(distributionRes.success ? distributionRes.data : []);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (status === 'loading') return <LoadingState label="Loading dashboard..." />;
  if (status === 'error') return <ErrorState onRetry={loadData} />;

  return (
    <>
      <div className="welcome-card">
        <div className="welcome-card__left">
          <div className="welcome-card__eyebrow">Overview</div>
          <h1 className="welcome-card__title">Welcome back, {session?.fullName?.split(' ')[0]}</h1>
          <p className="welcome-card__subtitle">Here&rsquo;s what&rsquo;s happening across GRADIA today.</p>
          <div className="welcome-card__actions">
            <Button size="sm" variant="primary" onClick={() => navigate('/courses')}>
              Go to Courses
            </Button>
          </div>
        </div>
        <div className="welcome-card__illustration">
          <img src="\src\assets\admin_avatar.png" alt="" className="welcome-card__image" />
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--stats">
        <StatCard
          label="Total Students"
          value={summary.totalStudents}
          icon={<IconUsers />}
        />
        <StatCard
          label="Total Teachers"
          value={summary.totalTeachers}
          icon={<IconChalkboard />}
        />
        <StatCard
          label="Total Courses"
          value={summary.totalCourses}
          icon={<IconBook />}
        />
        <StatCard
          label="Total Enrollments"
          value={summary.totalEnrollments}
          icon={<IconClipboard />}
        />
        <StatCard
          label="Average Grade"
          value={summary.averageGrade != null ? `${summary.averageGrade.toFixed(2)}%` : '—'}
          icon={<IconGraduationCap />}
        />
      </div>

      <div className="dashboard-grid dashboard-grid--charts">
        <Panel title="Academic Performance Trend" subtitle="Average grade across all courses">
          <PerformanceTrendChart data={trend} />
        </Panel>
        <Panel title="Grade Distribution" subtitle="Current term, all courses">
          <GradeDistributionChart data={distribution} />
        </Panel>
      </div>

      <Panel title="Recent Activity" subtitle="Latest changes across the platform" flushBody>
        <ActivityFeed items={activity} />
      </Panel>
    </>
  );
}