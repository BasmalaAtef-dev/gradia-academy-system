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
import { CourseForm } from './CourseForm';
import { courseService } from '../../services/api/courseService';
import { enrollmentService } from '../../services/api/enrollmentService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { IconPlus, IconEdit, IconTrash } from '../../components/ui/icons';
import { gradeToLetter, gradeToVariant } from '../../utils/formatters';

export function CoursesPage() {
  const { role } = useAuth();
  const toast = useToast();
  const isAdmin = role === ROLES.ADMIN;
  const isTeacher = role === ROLES.TEACHER;
  const isStudent = role === ROLES.STUDENT;

  const [data, setData] = useState({ items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalCount: 0, totalPages: 1 });
  const [studentCourses, setStudentCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState('loading');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setStatus('loading');
    try {
      if (isStudent) {
        const res = await enrollmentService.getMyGrades();
        setStudentCourses(res.data);
      } else {
        const res = await courseService.getAll({
          pageNumber,
          pageSize: DEFAULT_PAGE_SIZE,
          searchTerm,
        });
        setData(res.data);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [pageNumber, searchTerm, isStudent]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  function openCreate() {
    setEditingCourse(null);
    setIsFormOpen(true);
  }

  function openEdit(course) {
    setEditingCourse(course);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    const res = editingCourse
      ? await courseService.update(editingCourse.courseId, values)
      : await courseService.create(values);
    setIsSubmitting(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setIsFormOpen(false);
    loadData();
  }

  async function handleDelete() {
    setIsDeleting(true);
    const res = await courseService.remove(deletingCourse.courseId);
    setIsDeleting(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setDeletingCourse(null);
    loadData();
  }

  if (isStudent) {
    return (
      <>
        <PageHeader eyebrow="Academics" title="My Courses" subtitle="Courses you're currently enrolled in." />
        <Panel flushBody>
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
                    <Badge variant="info">In progress</Badge>
                  ),
              },
            ]}
            rows={studentCourses}
            rowKey="enrollmentId"
            isLoading={status === 'loading'}
            error={status === 'error' ? 'Could not load your courses.' : null}
            onRetry={loadData}
            emptyMessage="You are not enrolled in any courses yet."
          />
        </Panel>
      </>
    );
  }

  const columns = [
    { key: 'courseName', label: 'Course', render: (r) => <strong>{r.courseName}</strong> },
    { key: 'description', label: 'Description', render: (r) => r.description || '—' },
    { key: 'credits', label: 'Credits', render: (r) => r.credits ?? '—' },
    { key: 'teacherName', label: 'Teacher', render: (r) => <Badge variant="primary">{r.teacherName}</Badge> },
  ];

  if (isAdmin) {
    columns.push({
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="table__actions">
          <button className="table__icon-btn" onClick={() => openEdit(r)} aria-label={`Edit ${r.courseName}`}>
            <IconEdit />
          </button>
          <button
            className="table__icon-btn table__icon-btn--danger"
            onClick={() => setDeletingCourse(r)}
            aria-label={`Delete ${r.courseName}`}
          >
            <IconTrash />
          </button>
        </div>
      ),
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title={isTeacher ? 'My Courses' : 'Courses'}
        subtitle={isTeacher ? 'Courses you currently teach.' : 'Manage the course catalog.'}
        actions={
          isAdmin && (
            <Button onClick={openCreate} icon={<IconPlus />}>
              Add course
            </Button>
          )
        }
      />

      <Panel flushBody>
        <div className="table-toolbar">
          <div className="table-toolbar__search">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search courses..." />
          </div>
        </div>

        <Table
          columns={columns}
          rows={data.items}
          rowKey="courseId"
          isLoading={status === 'loading'}
          error={status === 'error' ? 'Could not load courses.' : null}
          onRetry={loadData}
          emptyMessage={searchTerm ? 'No courses match your search.' : 'No courses have been added yet.'}
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
        <>
          <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingCourse ? 'Edit course' : 'Add course'}>
            <CourseForm
              initialValues={editingCourse}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isSubmitting={isSubmitting}
            />
          </Modal>

          <ConfirmDialog
            isOpen={Boolean(deletingCourse)}
            onClose={() => setDeletingCourse(null)}
            onConfirm={handleDelete}
            title="Delete course"
            description={`This will permanently remove ${deletingCourse?.courseName} and its enrollment records. This action cannot be undone.`}
            confirmLabel="Delete course"
            isLoading={isDeleting}
          />
        </>
      )}
    </>
  );
}
