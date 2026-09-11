import { useEffect, useState } from 'react';
import { FormField } from '../../components/ui/FormField';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { studentService } from '../../services/api/studentService';
import { courseService } from '../../services/api/courseService';

export function EnrollForm({ onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState({ studentId: '', courseId: '' });
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    studentService.getAllUnpaged().then((res) => {
      if (res.success) setStudents(res.data);
    });
    courseService.getAllUnpaged().then((res) => {
      if (res.success) setCourses(res.data);
    });
  }, []);

  function validate() {
    const next = {};
    if (!form.studentId) next.studentId = 'Select a student.';
    if (!form.courseId) next.courseId = 'Select a course.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ studentId: Number(form.studentId), courseId: Number(form.courseId) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <FormField label="Student" error={errors.studentId} required>
        {({ id }) => (
          <Select
            id={id}
            value={form.studentId}
            onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
            error={errors.studentId}
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.fullName}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField label="Course" error={errors.courseId} required>
        {({ id }) => (
          <Select
            id={id}
            value={form.courseId}
            onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
            error={errors.courseId}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseName}
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
          Enroll student
        </Button>
      </div>
    </form>
  );
}