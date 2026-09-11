import { useState } from 'react';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function GradeForm({ enrollment, onSubmit, onCancel, isSubmitting }) {
  const [grade, setGrade] = useState(enrollment?.grade ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(grade);
    if (grade === '' || Number.isNaN(value) || value < 0 || value > 100) {
      setError('Enter a grade between 0 and 100.');
      return;
    }
    onSubmit(value);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
        <strong style={{ color: 'var(--color-text)' }}>{enrollment?.studentName}</strong> · {enrollment?.courseName}
      </p>

      <FormField label="Grade (0–100)" error={error} required>
        {({ id }) => (
          <Input
            id={id}
            type="number"
            min="0"
            max="100"
            autoFocus
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            error={error}
            placeholder="e.g. 87"
          />
        )}
      </FormField>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save grade
        </Button>
      </div>
    </form>
  );
}
