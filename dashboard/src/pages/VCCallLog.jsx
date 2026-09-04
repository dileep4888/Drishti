import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { MOCK_VC_CALLS } from "../mockData";
import "./ListPage.css";

const STATUS_PILL = {
  completed: "pill--green",
  scheduled: "pill--amber",
  ongoing: "pill--amber",
  missed: "pill--red",
};

export default function VCCallLog() {
  const { ready } = useAuth();
  if (!ready) return null;

  return (
    <Layout>
      <header className="list-page-header">
        <h2>VC call log</h2>
        <p>Video calls placed to institute incharges, staff and beneficiaries.</p>
      </header>

      {MOCK_VC_CALLS.length === 0 ? (
        <div className="empty-state">No VC calls logged yet.</div>
      ) : (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Institute</th>
              <th>Target</th>
              <th>Status</th>
              <th>Started</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_VC_CALLS.map((call) => (
              <tr key={call.id}>
                <td>{call.institute_name}</td>
                <td style={{ textTransform: "capitalize" }}>{call.target_role}</td>
                <td>
                  <span className={`pill ${STATUS_PILL[call.call_status] || "pill--gray"}`}>
                    {call.call_status}
                  </span>
                </td>
                <td style={{ fontFamily: "var(--font-mono)" }}>{call.call_started_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
