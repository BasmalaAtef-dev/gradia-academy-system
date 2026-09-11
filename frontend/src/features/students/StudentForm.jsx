import { useState } from 'react';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const emptyForm = { fullName: '', email: '', dateOfBirth: '', phone: '', address: '' };

export function StudentForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initialValues);

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!isEdit) {
      if (!form.password || !form.password.trim()) next.password = 'Password is required.';
      else if (form.password.trim().length < 6) next.password = 'Password must be at least 6 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form id="student-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <FormField label="Full name" error={errors.fullName} required>
        {({ id }) => (
          <Input
            id={id}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            error={errors.fullName}
            placeholder="e.g. Aiko Tanaka"
          />
        )}
      </FormField>

      <FormField label="Email" error={errors.email} required>
        {({ id }) => (
          <Input
            id={id}
            type="email"
            disabled={isEdit}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
            placeholder="student@school.edu"
          />
        )}
      </FormField>

      {!isEdit && (
        <FormField label="Temporary password" error={errors.password} required>
          {({ id }) => (
            <Input
              id={id}
              type="password"
              value={form.password || ''}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={errors.password}
             placeholder="At least 6 characters"
            />
          )}
        </FormField>
      )}

      <FormField label="Date of birth">
        {({ id }) => (
          <Input
            id={id}
            type="date"
            value={form.dateOfBirth || ''}
            onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
          />
        )}
      </FormField>

      <FormField label="Phone">
        {({ id }) => (
          <Input
            id={id}
            value={form.phone || ''}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+1 555 000 1234"
          />
        )}
      </FormField>

      <FormField label="Address">
        {({ id }) => (
          <Input
            id={id}
            value={form.address || ''}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="City, Country"
          />
        )}
      </FormField>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Add student'}
        </Button>
      </div>
    </form>
  );
}
