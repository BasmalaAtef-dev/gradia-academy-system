import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StudentForm } from './StudentForm';
import { studentService } from '../../services/api/studentService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';
import { ROLES, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { IconPlus, IconEdit, IconTrash } from '../../components/ui/icons';

export function StudentsPage() {
  const { role } = useAuth();
  const toast = useToast();
  const canManage = role === ROLES.ADMIN;

  const [data, setData] = useState({ items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalCount: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState('loading');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await studentService.getAll({ pageNumber, pageSize: DEFAULT_PAGE_SIZE, searchTerm });
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

  function openCreate() {
    setEditingStudent(null);
    setIsFormOpen(true);
  }

  function openEdit(student) {
    setEditingStudent(student);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    const res = editingStudent
      ? await studentService.update(editingStudent.studentId, values)
      : await studentService.create(values);
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
    const res = await studentService.remove(deletingStudent.studentId);
    setIsDeleting(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setDeletingStudent(null);
    loadData();
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Student',
      render: (r) => (
        <div className="table__cell-primary">
          <Avatar name={r.fullName} size="sm" />
          <div>
            <div className="table__cell-title">{r.fullName}</div>
            <div className="table__cell-subtitle">{r.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
    { key: 'dateOfBirth', label: 'Date of Birth', render: (r) => formatDate(r.dateOfBirth) },
    { key: 'address', label: 'Address', render: (r) => r.address || '—' },
  ];

  if (canManage) {
    columns.push({
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="table__actions">
          <button className="table__icon-btn" onClick={() => openEdit(r)} aria-label={`Edit ${r.fullName}`}>
            <IconEdit />
          </button>
          <button
            className="table__icon-btn table__icon-btn--danger"
            onClick={() => setDeletingStudent(r)}
            aria-label={`Delete ${r.fullName}`}
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
        eyebrow="Directory"
        title="Students"
        subtitle="Manage student profiles and academic records."
        actions={
          canManage && (
            <Button onClick={openCreate} icon={<IconPlus />}>
              Add student
            </Button>
          )
        }
      />

      <Panel flushBody>
        <div className="table-toolbar">
          <div className="table-toolbar__search">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search students by name or email..." />
          </div>
        </div>

        <Table
          columns={columns}
          rows={data.items}
          rowKey="studentId"
          isLoading={status === 'loading'}
          error={status === 'error' ? 'Could not load students.' : null}
          onRetry={loadData}
          emptyMessage={searchTerm ? 'No students match your search.' : 'No students have been added yet.'}
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingStudent ? 'Edit student' : 'Add student'}>
        <StudentForm
          initialValues={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDelete}
        title="Delete student"
        description={`This will permanently remove ${deletingStudent?.fullName} and their enrollment records. This action cannot be undone.`}
        confirmLabel="Delete student"
        isLoading={isDeleting}
      />
    </>
  );
}
