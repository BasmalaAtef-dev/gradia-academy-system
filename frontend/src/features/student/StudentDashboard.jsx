import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { Panel } from '../../components/ui/Panel';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState, ErrorState } from '../../components/ui/StateScreens';
import { PerformanceTrendChart } from '../../components/ui/charts/PerformanceTrendChart';
import { IconBook, IconGraduationCap, IconTrendUp, IconClipboard } from '../../components/ui/icons';
import { enrollmentService } from '../../services/api/enrollmentService';
import { gradeToLetter, gradeToVariant } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import '../../components/ui/Panel.css';

export function StudentDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [trend, setTrend] = useState([]);
  const [status, setStatus] = useState('loading');

  async function loadData() {
    setStatus('loading');
    try {
      const [enrollmentsRes, trendRes] = await Promise.all([
        enrollmentService.getMyGrades(),
        enrollmentService.getGradeTrend(),
      ]);
      setEnrollments(enrollmentsRes.success ? enrollmentsRes.data : []);
      setTrend(trendRes.success ? trendRes.data : []);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') return <LoadingState label="Loading your dashboard..." />;
  if (status === 'error') return <ErrorState onRetry={loadData} />;

  const graded = enrollments.filter((e) => e.grade != null);
  const avgGrade = graded.length
    ? Math.round((graded.reduce((sum, e) => sum + e.grade, 0) / graded.length) * 10) / 10
    : null;
  const bestGrade = graded.length ? Math.max(...graded.map((e) => e.grade)) : null;

  return (
    <>
      <div className="welcome-card">
        <div className="welcome-card__left">
          <div className="welcome-card__eyebrow">My Overview</div>
          <h1 className="welcome-card__title">Welcome back, {session?.fullName?.split(' ')[0]}</h1>
          <p className="welcome-card__subtitle">Here&rsquo;s a snapshot of your academic progress.</p>
          <div className="welcome-card__actions">
            <Button size="sm" variant="primary" onClick={() => navigate('/courses')}>
              View My Courses
            </Button>
          </div>
        </div>
        <div className="welcome-card__illustration">
          <img src="\src\assets\student_avatar.png" alt="" className="welcome-card__image" />
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--stats">
        <StatCard label="My Courses" value={enrollments.length} icon={<IconBook />} />
        <StatCard
          label="Average Grade"
          value={avgGrade != null ? `${avgGrade.toFixed(2)}%` : '—'}
          icon={<IconGraduationCap />}
        />
        <StatCard label="Best Grade" value={bestGrade != null ? `${bestGrade}%` : '—'} icon={<IconTrendUp />} />
        <StatCard label="Ungraded" value={enrollments.filter((e) => e.grade == null).length} icon={<IconClipboard />} />
      </div>

      <div className="dashboard-grid dashboard-grid--charts">
        <Panel title="Performance Trend" subtitle="Your average grade over time">
          <PerformanceTrendChart data={trend} />
        </Panel>

        <Panel title="Course Progress" subtitle="Enrollment snapshot" flushBody>
          <Table
            columns={[
              { key: 'courseName', label: 'Course', render: (r) => <strong>{r.courseName}</strong> },
              {
                key: 'grade',
                label: 'Status',
                render: (r) =>
                  r.grade != null ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="info">In progress</Badge>
                  ),
              },
            ]}
            rows={enrollments}
            rowKey="enrollmentId"
            emptyMessage="You are not enrolled in any courses yet."
          />
        </Panel>
      </div>

      <Panel
        title="Recent Grades"
        subtitle="Your latest results"
        actions={
          <Button size="sm" variant="outline" onClick={() => navigate('/grades')}>
            View all grades
          </Button>
        }
        flushBody
      >
        <Table
          columns={[
            { key: 'courseName', label: 'Course', render: (r) => <strong>{r.courseName}</strong> },
            {
              key: 'grade',
              label: 'Grade',
              render: (r) =>
                r.grade != null ? (
                  <Badge variant={gradeToVariant(r.grade)}>
                    {r.grade}% · {gradeToLetter(r.grade)}
                  </Badge>
                ) : (
                  <Badge variant="neutral">Pending</Badge>
                ),
            },
          ]}
          rows={enrollments}
          rowKey="enrollmentId"
          emptyMessage="No grades to show yet."
        />
      </Panel>
    </>
  );
}