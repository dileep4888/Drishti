import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";
import "./Login.css"; // reuses the same card/form styling as Login

const ROLES = [
  { value: "inspector", label: "Field Inspector" },
  { value: "ngo_incharge", label: "NGO Incharge" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("inspector");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    setLoading(true);
    try {
      const data = await register({ name, email, password, role, phone: phone || null });
      localStorage.setItem("drishti_token", data.access_token);
      localStorage.setItem("drishti_role", data.role);
      localStorage.setItem("drishti_name", data.name);
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        // Pydantic validation errors
        setError(detail.map(e => e.msg).join(". "));
      } else {
        setError(detail || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-banner">
        <div className="login-banner__content">
          <div className="gov-emblem-large">
            <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#000080" />
              <circle cx="50" cy="50" r="35" fill="white" />
              <circle cx="50" cy="50" r="30" stroke="#000080" strokeWidth="1" fill="none" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x1 = 50 + 10 * Math.cos(rad);
                const y1 = 50 + 10 * Math.sin(rad);
                const x2 = 50 + 30 * Math.cos(rad);
                const y2 = 50 + 30 * Math.sin(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="1.5" />;
              })}
              <circle cx="50" cy="50" r="8" fill="#000080" />
            </svg>
          </div>
          <div className="login-banner__text">
            <h2 className="login-banner__hindi">भारत सरकार</h2>
            <h3 className="login-banner__en">Government of India</h3>
            <p className="login-banner__dept">Department of Social Justice & Empowerment</p>
          </div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-card__header">
          <div className="system-tag">Official Registration</div>
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">
            Register as Field Inspector or NGO Incharge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            <span>Full Name <span className="req">*</span></span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              maxLength={120}
            />
          </label>
          <label className="login-label">
            <span>Official Email <span className="req">*</span></span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@dosje.gov.in"
              required
              autoComplete="username"
            />
          </label>
          <label className="login-label">
            <span>Password <span className="req">*</span></span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <label className="login-label">
            <span>Mobile Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX or 9XXXXXXXXX"
              pattern="^\+?[6-9]\d{9}$"
            />
          </label>
          <label className="login-label">
            <span>Role <span className="req">*</span></span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <div className="login-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creating Account…" : "Register"}
          </button>
        </form>

        <div className="login-card__footer">
          <p className="login-switch">
            Already registered? <Link to="/login">Sign in here</Link>
          </p>
          <div className="security-notice">
            ℹ️ Admin roles require department approval
          </div>
        </div>
      </div>
    </div>
  );
}
