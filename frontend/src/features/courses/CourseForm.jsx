import { useState, useEffect } from 'react';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { teacherService } from '../../services/api/teacherService';

const emptyForm = { courseName: '', description: '', credits: '', teacherId: '' };

export function CourseForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    teacherService.getAllUnpaged().then((res) => {
      if (res.success) setTeachers(res.data);
    });
   }, []);
  useEffect(() => {
    teacherService.getAll({ pageNumber: 1, pageSize: 100 }).then((res) => {
      if (res.success) setTeachers(res.data.items);
     });
   }, []);

  function validate() {
    const next = {};
    if (!form.courseName.trim()) next.courseName = 'Course name is required.';
    if (!form.teacherId) next.teacherId = 'Assign a teacher.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, credits: form.credits ? Number(form.credits) : null, teacherId: Number(form.teacherId) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <FormField label="Course name" error={errors.courseName} required>
        {({ id }) => (
          <Input
            id={id}
            value={form.courseName}
            onChange={(e) => setForm((f) => ({ ...f, courseName: e.target.value }))}
            error={errors.courseName}
            placeholder="e.g. Linear Algebra"
          />
        )}
      </FormField>

      <FormField label="Description">
        {({ id }) => (
          <Input
            id={id}
            value={form.description || ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief course description"
          />
        )}
      </FormField>

      <FormField label="Credits">
        {({ id }) => (
          <Input
            id={id}
            type="number"
            min="1"
            max="12"
            value={form.credits ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, credits: e.target.value }))}
            placeholder="e.g. 3"
          />
        )}
      </FormField>

      <FormField label="Teacher" error={errors.teacherId} required>
        {({ id }) => (
          <Select
            id={id}
            value={form.teacherId || ''}
            onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value }))}
            error={errors.teacherId}
          >
            <option value="">Select a teacher</option>
            {teachers.map((t) => (
              <option key={t.teacherId} value={t.teacherId}>
                {t.fullName} — {t.specialization}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Save changes' : 'Add course'}
        </Button>
      </div>
    </form>
  );
}
