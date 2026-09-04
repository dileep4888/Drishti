import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Layout.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Institute Register", icon: "🏛️" },
  { to: "/inspections", label: "Live Inspections", icon: "🔍" },
  { to: "/vc-calls", label: "Video Call Log", icon: "📹" },
  { to: "/risk-flags", label: "Risk Flags", icon: "⚠️" },
];

export default function Layout({ children }) {
  const { name, role, logout } = useAuth();

  return (
    <>
      {/* Government Header */}
      <header className="gov-header">
        <div className="gov-header__container">
          <div className="gov-header__left">
            <div className="gov-emblem">
              <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ashoka Chakra simplified */}
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
            <div className="gov-header__titles">
              <div className="gov-header__org">भारत सरकार • Government of India</div>
              <div className="gov-header__dept">Department of Social Justice & Empowerment</div>
              <div className="gov-header__system">
                <span className="system-name-hindi">दृष्टि</span>
                <span className="system-name-divider">|</span>
                <span className="system-name-en">DRISHTI</span>
              </div>
            </div>
          </div>
          <div className="gov-header__right">
            <div className="user-info">
              <div className="user-info__name">{name}</div>
              <div className="user-info__role">{role?.replace("_", " ").toUpperCase()}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "sidebar-nav__item" + (isActive ? " sidebar-nav__item--active" : "")
                }
              >
                <span className="sidebar-nav__icon">{item.icon}</span>
                <span className="sidebar-nav__label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-footer__badge">
              <span className="badge-tricolor"></span>
              <div className="badge-text">
                <div className="badge-motto">सत्यमेव जयते</div>
                <div className="badge-motto-en">Truth Alone Triumphs</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="content-wrapper">{children}</div>
        </main>
      </div>
    </>
  );
}
