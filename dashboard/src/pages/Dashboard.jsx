import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import RiskStamp from "../components/RiskStamp";
import { useAuth } from "../hooks/useAuth";
import { MOCK_INSTITUTES } from "../mockData";
import "./Dashboard.css";

export default function Dashboard() {
  const { ready } = useAuth();
  if (!ready) return null;

  const flaggedCount = MOCK_INSTITUTES.filter((i) => i.risk_score >= 70).length;
  const watchCount = MOCK_INSTITUTES.filter((i) => i.risk_score >= 35 && i.risk_score < 70).length;

  return (
    <Layout>
      <header className="dashboard-header">
        <h2>Institute register</h2>
        <p>Live status across all onboarded projects, NGOs and institutes.</p>
      </header>

      <section className="summary-row">
        <div className="summary-card">
          <span className="summary-number">{MOCK_INSTITUTES.length}</span>
          <span className="summary-label">Onboarded institutes</span>
        </div>
        <div className="summary-card summary-card--amber">
          <span className="summary-number">{watchCount}</span>
          <span className="summary-label">Under watch</span>
        </div>
        <div className="summary-card summary-card--red">
          <span className="summary-number">{flaggedCount}</span>
          <span className="summary-label">Flagged this week</span>
        </div>
      </section>

      <section className="institute-list">
        {MOCK_INSTITUTES.map((inst) => (
          <div className="institute-row" key={inst.id}>
            <RiskStamp score={inst.risk_score} />
            <div className="institute-details">
              <h3>{inst.name}</h3>
              <p className="institute-meta">
                {inst.district} · Last inspected {inst.last_inspected_at}
              </p>
            </div>
            <Link className="institute-action" to={`/institutes/${inst.id}/live`}>
              View live feed
            </Link>
          </div>
        ))}
      </section>
    </Layout>
  );
}
