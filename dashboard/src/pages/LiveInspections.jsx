import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { MOCK_INSPECTIONS } from "../mockData";
import "./ListPage.css";

const STATUS_PILL = {
  assigned: "pill--gray",
  in_progress: "pill--amber",
  submitted: "pill--green",
  reviewed: "pill--green",
};

export default function LiveInspections() {
  const { ready } = useAuth();
  if (!ready) return null;

  return (
    <Layout>
      <header className="list-page-header">
        <h2>Live inspections</h2>
        <p>Inspections currently assigned, in progress, or awaiting review.</p>
      </header>

      {MOCK_INSPECTIONS.length === 0 ? (
        <div className="empty-state">No inspections in progress.</div>
      ) : (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Institute</th>
              <th>Inspector</th>
              <th>Type</th>
              <th>Status</th>
              <th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INSPECTIONS.map((insp) => (
              <tr key={insp.id}>
                <td>{insp.institute_name}</td>
                <td>{insp.inspector_name}</td>
                <td style={{ textTransform: "capitalize" }}>
                  {insp.assignment_type.replace(/_/g, " ")}
                </td>
                <td>
                  <span className={`pill ${STATUS_PILL[insp.status] || "pill--gray"}`}>
                    {insp.status.replace("_", " ")}
                  </span>
                </td>
                <td style={{ fontFamily: "var(--font-mono)" }}>{insp.assigned_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
