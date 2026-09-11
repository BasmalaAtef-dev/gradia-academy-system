import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EnrollForm } from './EnrollForm';
import { GradeForm } from './GradeForm';
import { enrollmentService } from '../../services/api/enrollmentService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, gradeToLetter, gradeToVariant } from '../../utils/formatters';
import { ROLES, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { IconPlus, IconEdit, IconTrash } from '../../components/ui/icons';

export function EnrollmentsPage() {
  const { role } = useAuth();
  const toast = useToast();
  const isAdmin = role === ROLES.ADMIN;

  const [data, setData] = useState({ items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalCount: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState('loading');

  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [gradingEnrollment, setGradingEnrollment] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [deletingEnrollment, setDeletingEnrollment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await enrollmentService.getAll({
        pageNumber,
        pageSize: DEFAULT_PAGE_SIZE,
        searchTerm,
      });
      setData(res.data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [pageNumber, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  async function handleEnroll(values) {
    setIsEnrolling(true);
    const res = await enrollmentService.create(values);
    setIsEnrolling(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setIsEnrollOpen(false);
    loadData();
  }

  async function handleGradeSubmit(grade) {
    setIsGrading(true);
    const res = await enrollmentService.updateGrade(gradingEnrollment.enrollmentId, grade);
    setIsGrading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setGradingEnrollment(null);
    loadData();
  }

  async function handleDelete() {
    setIsDeleting(true);
    const res = await enrollmentService.remove(deletingEnrollment.enrollmentId);
    setIsDeleting(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setDeletingEnrollment(null);
    loadData();
  }

  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => <span className="table__cell-title">{r.studentName}</span> },
    { key: 'courseName', label: 'Course' },
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
          <Badge variant="neutral">Not graded</Badge>
        ),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="table__actions">
          <button className="table__icon-btn" onClick={() => setGradingEnrollment(r)} aria-label={`Grade ${r.studentName}`}>
            <IconEdit />
          </button>
          {isAdmin && (
            <button
              className="table__icon-btn table__icon-btn--danger"
              onClick={() => setDeletingEnrollment(r)}
              aria-label={`Remove enrollment for ${r.studentName}`}
            >
              <IconTrash />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Enrollments & Grades"
        subtitle={isAdmin ? 'Manage enrollments and grades across all courses.' : 'Manage grades for students in your courses.'}
        actions={
          isAdmin && (
            <Button onClick={() => setIsEnrollOpen(true)} icon={<IconPlus />}>
              Enroll student
            </Button>
          )
        }
      />

      <Panel flushBody>
        <div className="table-toolbar">
          <div className="table-toolbar__search">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by student or course..." />
          </div>
        </div>

        <Table
          columns={columns}
          rows={data.items}
          rowKey="enrollmentId"
          isLoading={status === 'loading'}
          error={status === 'error' ? 'Could not load enrollments.' : null}
          onRetry={loadData}
          emptyMessage={searchTerm ? 'No enrollments match your search.' : 'No enrollments yet.'}
        />

        <div className="table-footer">
          <Pagination
            pageNumber={data.pageNumber}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            totalPages={data.totalPages}
            onPageChange={setPageNumber}
          />
        </div>
      </Panel>

      {isAdmin && (
        <Modal isOpen={isEnrollOpen} onClose={() => setIsEnrollOpen(false)} title="Enroll student in a course">
          <EnrollForm onSubmit={handleEnroll} onCancel={() => setIsEnrollOpen(false)} isSubmitting={isEnrolling} />
        </Modal>
      )}

      <Modal isOpen={Boolean(gradingEnrollment)} onClose={() => setGradingEnrollment(null)} title="Update grade">
        <GradeForm
          enrollment={gradingEnrollment}
          onSubmit={handleGradeSubmit}
          onCancel={() => setGradingEnrollment(null)}
          isSubmitting={isGrading}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingEnrollment)}
        onClose={() => setDeletingEnrollment(null)}
        onConfirm={handleDelete}
        title="Remove enrollment"
        description={`This will remove ${deletingEnrollment?.studentName} from ${deletingEnrollment?.courseName}. This action cannot be undone.`}
        confirmLabel="Remove enrollment"
        isLoading={isDeleting}
      />
    </>
  );
}