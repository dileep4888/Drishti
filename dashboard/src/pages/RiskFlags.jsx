import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { MOCK_RISK_FLAGS } from "../mockData";
import "./ListPage.css";

const SEVERITY_PILL = {
  high: "pill--red",
  medium: "pill--amber",
  low: "pill--gray",
};

export default function RiskFlags() {
  const { ready } = useAuth();
  if (!ready) return null;

  return (
    <Layout>
      <header className="list-page-header">
        <h2>Risk flags</h2>
        <p>Automated flags raised across attendance, reports, and CCTV checks.</p>
      </header>

      {MOCK_RISK_FLAGS.length === 0 ? (
        <div className="empty-state">No risk flags raised.</div>
      ) : (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Institute</th>
              <th>Flag type</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RISK_FLAGS.map((flag) => (
              <tr key={flag.id}>
                <td>{flag.institute_name}</td>
                <td style={{ textTransform: "capitalize" }}>
                  {flag.flag_type.replace(/_/g, " ")}
                </td>
                <td>
                  <span className={`pill ${SEVERITY_PILL[flag.severity] || "pill--gray"}`}>
                    {flag.severity}
                  </span>
                </td>
                <td>
                  <span className={`pill ${flag.resolved ? "pill--green" : "pill--amber"}`}>
                    {flag.resolved ? "resolved" : "open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
