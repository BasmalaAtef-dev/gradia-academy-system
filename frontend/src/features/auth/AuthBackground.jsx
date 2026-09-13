import logo from "src/assets/logo.png";
export function AuthBackground() {
  return (
    <>
      <div className="auth-blob auth-blob--1" aria-hidden="true" />
      <div className="auth-blob auth-blob--2" aria-hidden="true" />
      <div className="auth-blob auth-blob--3" aria-hidden="true" />
      <div className="auth-blob auth-blob--4" aria-hidden="true" />
    </>
  );
}

export function AuthBrand() {
  return (
    <div className="auth-card__brand">

      <div className="auth-card__brand-text">
              <img src={logo} alt="Logo" className="auth__logo" />
        <span className="auth-card__brand-tagline">Academic Performance Platform</span>
      </div>
    </div>
  );
}
