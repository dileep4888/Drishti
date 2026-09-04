import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("drishti_token", data.access_token);
      localStorage.setItem("drishti_role", data.role);
      localStorage.setItem("drishti_name", data.name);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please verify your official email and password."
      );
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
          <div className="system-tag">Official Portal</div>
          <h1 className="login-title">DRISHTI Login</h1>
          <p className="login-subtitle">
            Smart Real-Time Monitoring & Inspection Command Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            <span>Official Email Address <span className="req">*</span></span>
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
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />
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
            {loading ? "Authenticating with Secure Server…" : "Secure Sign In"}
          </button>
        </form>

        <div className="login-card__footer">
          <p className="login-switch">
            New official / Field Inspector? <Link to="/register">Register here</Link>
          </p>
          <div className="security-notice">
            🔒 256-bit Encrypted Government Session
          </div>
        </div>
      </div>
    </div>
  );
}
