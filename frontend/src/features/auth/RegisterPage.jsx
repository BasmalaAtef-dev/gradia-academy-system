import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { AuthBackground, AuthBrand } from './AuthBackground';
import './auth.css';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const initialForm = { fullName: '', email: '', password: '', confirmPassword: '' };

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    setSuccessMessage(result.message);
    setForm(initialForm);
    setTimeout(() => navigate('/login'), 1400);
  }

  return (
    <div className="auth-screen">
      <AuthBackground />
      <div className="auth-card">
        <AuthBrand />

        <h1 className="auth-card__heading">Create your account</h1>
        <p className="auth-card__subheading">Join GRADIA to track your courses, grades, and progress.</p>

        {formError && (
          <div className="auth-alert" role="alert">
            {formError}
          </div>
        )}
        {successMessage && (
          <div className="auth-alert auth-alert--success" role="status">
            {successMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <FormField label="Full name" error={errors.fullName} required>
            {({ id }) => (
              <Input
                id={id}
                autoComplete="name"
                placeholder="Jordan Ellis"
                iconLeft={<UserIcon />}
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                error={errors.fullName}
              />
            )}
          </FormField>

          <FormField label="Email" error={errors.email} required>
            {({ id }) => (
              <Input
                id={id}
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                iconLeft={<MailIcon />}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                error={errors.email}
              />
            )}
          </FormField>

          <FormField label="Password" error={errors.password} required hint="At least 6 characters">
            {({ id }) => (
              <Input
                id={id}
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                iconLeft={<LockIcon />}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                error={errors.password}
              />
            )}
          </FormField>

          <FormField label="Confirm password" error={errors.confirmPassword} required>
            {({ id }) => (
              <Input
                id={id}
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                iconLeft={<LockIcon />}
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                error={errors.confirmPassword}
              />
            )}
          </FormField>

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
