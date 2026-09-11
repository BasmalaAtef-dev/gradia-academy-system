import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TeacherForm } from './TeacherForm';
import { teacherService } from '../../services/api/teacherService';import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatters';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { IconPlus, IconEdit, IconTrash } from '../../components/ui/icons';

export function TeachersPage() {
  const toast = useToast();

  const [data, setData] = useState({ items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalCount: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState('loading');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await teacherService.getAll({ pageNumber, pageSize: DEFAULT_PAGE_SIZE, searchTerm });
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
    setEditingTeacher(null);
    setIsFormOpen(true);
  }

  function openEdit(teacher) {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    const res = editingTeacher
      ? await teacherService.update(editingTeacher.teacherId, values)
      : await teacherService.create(values);
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
    const res = await teacherService.remove(deletingTeacher.teacherId);
    setIsDeleting(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setDeletingTeacher(null);
    loadData();
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Teacher',
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
    {
      key: 'specialization',
      label: 'Specialization',
      render: (r) => (r.specialization ? <Badge variant="primary">{r.specialization}</Badge> : '—'),
    },
    { key: 'hireDate', label: 'Hire Date', render: (r) => formatDate(r.hireDate) },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="table__actions">
          <button className="table__icon-btn" onClick={() => openEdit(r)} aria-label={`Edit ${r.fullName}`}>
            <IconEdit />
          </button>
          <button
            className="table__icon-btn table__icon-btn--danger"
            onClick={() => setDeletingTeacher(r)}
            aria-label={`Delete ${r.fullName}`}
          >
            <IconTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Teachers"
        subtitle="Manage teacher profiles and assignments."
        actions={
          <Button onClick={openCreate} icon={<IconPlus />}>
            Add teacher
          </Button>
        }
      />

      <Panel flushBody>
        <div className="table-toolbar">
          <div className="table-toolbar__search">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search teachers by name or specialization..." />
          </div>
        </div>

        <Table
          columns={columns}
          rows={data.items}
          rowKey="teacherId"
          isLoading={status === 'loading'}
          error={status === 'error' ? 'Could not load teachers.' : null}
          onRetry={loadData}
          emptyMessage={searchTerm ? 'No teachers match your search.' : 'No teachers have been added yet.'}
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingTeacher ? 'Edit teacher' : 'Add teacher'}>
        <TeacherForm
          initialValues={editingTeacher}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingTeacher)}
        onClose={() => setDeletingTeacher(null)}
        onConfirm={handleDelete}
        title="Delete teacher"
        description={`This will permanently remove ${deletingTeacher?.fullName} from the platform. This action cannot be undone.`}
        confirmLabel="Delete teacher"
        isLoading={isDeleting}
      />
    </>
  );
}
