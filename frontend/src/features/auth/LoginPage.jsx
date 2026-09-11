import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { AuthBackground, AuthBrand } from './AuthBackground';
import { DEMO_ACCOUNTS } from '../../utils/demoAccounts';import './auth.css';

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

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(form);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    const redirectTo = location.state?.from?.pathname || '/dashboard';
    navigate(redirectTo, { replace: true });
  }

  function fillDemo(account) {
    setForm({ email: account.email, password: account.password });
    setErrors({});
    setFormError('');
  }




  return (
    
    <div className="auth-screen">
      <AuthBackground />
      <div className="auth-card">
        <AuthBrand />

        <h1 className="auth-card__heading">Welcome back!</h1>
        <p className="auth-card__subheading">Sign in to view grades, courses, and performance insights.</p>

        {formError && (
          <div className="auth-alert" role="alert">
            {formError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <FormField label="Password" error={errors.password} required>
            {({ id }) => (
              <Input
                id={id}
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                iconLeft={<LockIcon />}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                error={errors.password}
              />
            )}
          </FormField>

          <div className="auth-form__row">
            <label className="auth-form__remember">
              <input type="checkbox" defaultChecked />
              Remember me
            </label>
            <Link to="/forgot-password" className="auth-form__forgot">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <div className="auth-demo">
          <strong>Demo access</strong> — tap a role to autofill credentials.
          <div className="auth-demo__list">
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.role} type="button" className="auth-demo__chip" onClick={() => fillDemo(acc)}>
                {acc.role} — {acc.email}
              </button>
            ))}
          </div>
        </div>

        <p className="auth-card__footer">
          Don&rsquo;t have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
