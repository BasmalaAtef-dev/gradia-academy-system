import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { Panel } from '../../components/ui/Panel';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState, ErrorState } from '../../components/ui/StateScreens';
import { PerformanceTrendChart } from '../../components/ui/charts/PerformanceTrendChart';
import { IconBook, IconUsers, IconGraduationCap, IconClipboard } from '../../components/ui/icons';
import { courseService } from '../../services/api/courseService';
import { enrollmentService } from '../../services/api/enrollmentService';
import { gradeToLetter, gradeToVariant } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import '../../components/ui/Panel.css';
import avatar from '../../assets/teacher_avatar.png';


export function TeacherDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [trend, setTrend] = useState([]);
  const [status, setStatus] = useState('loading');

  async function loadData() {
    setStatus('loading');
    try {
      const [coursesRes, enrollmentsRes, trendRes] = await Promise.all([
        courseService.getAll({ pageSize: 50 }),
        enrollmentService.getAll({ pageSize: 6 }),
        enrollmentService.getGradeTrend(),
      ]);
      setCourses(coursesRes.success ? coursesRes.data.items : []);
      setEnrollments(enrollmentsRes.success ? enrollmentsRes.data.items : []);
      setTrend(trendRes.success ? trendRes.data : []);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (status === 'loading') return <LoadingState label="Loading your dashboard..." />;
  if (status === 'error') return <ErrorState onRetry={loadData} />;

  const totalStudents = new Set(enrollments.map((e) => e.studentId)).size;
  const graded = enrollments.filter((e) => e.grade != null);
  const avgGrade = graded.length
    ? Math.round((graded.reduce((sum, e) => sum + e.grade, 0) / graded.length) * 10) / 10
    : null;

  return (
    <>
      <div className="welcome-card">
        <div className="welcome-card__left">
          <div className="welcome-card__eyebrow">Teacher Overview</div>
          <h1 className="welcome-card__title">Welcome back, {session?.fullName?.split(' ')[0]}</h1>
          <p className="welcome-card__subtitle">
            {courses.length} active course{courses.length === 1 ? '' : 's'}
          </p>
          <div className="welcome-card__actions">
            <Button size="sm" variant="primary" onClick={() => navigate('/courses')}>
              Manage My Courses
            </Button>
          </div>
        </div>
        <div className="welcome-card__illustration">
          <img src={avatar} alt="" className="welcome-card__image" />
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--stats">
        <StatCard label="My Courses" value={courses.length} icon={<IconBook />} />
        <StatCard label="Enrolled Students" value={totalStudents} icon={<IconUsers />} />
        <StatCard
          label="Average Grade"
          value={avgGrade != null ? `${avgGrade.toFixed(2)}%` : '—'}
          icon={<IconGraduationCap />}
        />
        <StatCard label="Ungraded Submissions" value={enrollments.filter((e) => e.grade == null).length} icon={<IconClipboard />} />
      </div>

      <div className="dashboard-grid dashboard-grid--split">
        <Panel title="My Courses" subtitle="Courses you currently teach" flushBody>
          <Table
            columns={[
              { key: 'courseName', label: 'Course', render: (r) => <strong>{r.courseName}</strong> },
              { key: 'credits', label: 'Credits' },
              {
                key: 'action',
                label: '',
                render: () => (
                  <Button size="sm" variant="ghost" onClick={() => navigate('/courses')}>
                    View
                  </Button>
                ),
              },
            ]}
            rows={courses}
            rowKey="courseId"
          />
        </Panel>

        <Panel title="Class Performance Trend" subtitle="Average grade across your courses">
          <PerformanceTrendChart data={trend} height={220} />
        </Panel>
      </div>

      <Panel
        title="Recent Grades"
        subtitle="Latest grade activity across your courses"
        actions={
          <Button size="sm" variant="outline" onClick={() => navigate('/enrollments')}>
            Manage all grades
          </Button>
        }
        flushBody
      >
        <Table
          columns={[
            {
              key: 'studentName',
              label: 'Student',
              render: (r) => <span className="table__cell-title">{r.studentName}</span>,
            },
            { key: 'courseName', label: 'Course' },
            {
              key: 'grade',
              label: 'Grade',
              render: (r) =>
                r.grade != null ? (
                  <Badge variant={gradeToVariant(r.grade)}>
                    {r.grade}% · {gradeToLetter(r.grade)}
                  </Badge>
                ) : (
                  <Badge variant="neutral">Not graded</Badge>
                ),
            },
          ]}
          rows={enrollments}
          rowKey="enrollmentId"
        />
      </Panel>
    </>
  );
}