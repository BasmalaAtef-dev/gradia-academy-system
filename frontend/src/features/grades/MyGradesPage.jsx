import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingState, ErrorState } from '../../components/ui/StateScreens';
import { GradeDistributionChart } from '../../components/ui/charts/GradeDistributionChart';
import { enrollmentService } from '../../services/api/enrollmentService';
import { formatDate, gradeToLetter, gradeToVariant } from '../../utils/formatters';
import { IconGraduationCap, IconTrendUp, IconBook } from '../../components/ui/icons';
import '../../components/ui/Panel.css';

export function MyGradesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState('loading');

  async function loadData() {
    setStatus('loading');
    try {
      const res = await enrollmentService.getMyGrades();
      setEnrollments(res.data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (status === 'loading') return <LoadingState label="Loading your grades..." />;
  if (status === 'error') return <ErrorState onRetry={loadData} />;

  const graded = enrollments.filter((e) => e.grade != null);
  const avgGrade = graded.length
    ? Math.round((graded.reduce((sum, e) => sum + e.grade, 0) / graded.length) * 10) / 10
    : null;
  const bestGrade = graded.length ? Math.max(...graded.map((e) => e.grade)) : null;

  const distribution = ['90-100', '80-89', '70-79', '60-69', '<60'].map((band, i) => {
    const labels = ['A', 'B', 'C', 'D', 'F'];
    const [min, max] = band === '<60' ? [0, 59] : band.split('-').map(Number);
    return {
      band,
      label: labels[i],
      count: graded.filter((e) => e.grade >= min && e.grade <= max).length,
    };
  });

  return (
    <>
      <PageHeader eyebrow="Academics" title="My Grades" subtitle="A full record of your grades across all courses." />

      <div className="dashboard-grid dashboard-grid--stats">
        <StatCard label="Graded Courses" value={graded.length} icon={<IconBook />} />
        <StatCard label="Average Grade" value={avgGrade != null ? `${avgGrade}%` : '—'} icon={<IconGraduationCap />} />
        <StatCard label="Best Grade" value={bestGrade != null ? `${bestGrade}%` : '—'} icon={<IconTrendUp />} />
      </div>

      <div className="dashboard-grid dashboard-grid--split">
        <Panel title="All Grades" flushBody>
          <Table
            columns={[
              { key: 'courseName', label: 'Course', render: (r) => <strong>{r.courseName}</strong> },
              { key: 'enrollmentDate', label: 'Enrolled', render: (r) => formatDate(r.enrollmentDate) },
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

        <Panel title="Grade Distribution" subtitle="Your grades by letter band">
          <GradeDistributionChart data={distribution} height={280} />
        </Panel>
      </div>
    </>
  );
}