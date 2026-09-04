import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import RiskStamp from "../components/RiskStamp";
import { useAuth } from "../hooks/useAuth";
import { MOCK_INSTITUTES } from "../mockData";
import "./ListPage.css";
import "./LiveFeed.css";

export default function LiveFeed() {
  const { ready } = useAuth();
  const { id } = useParams();
  if (!ready) return null;

  const institute = MOCK_INSTITUTES.find((i) => String(i.id) === id);

  if (!institute) {
    return (
      <Layout>
        <div className="empty-state">
          Institute not found. <Link to="/dashboard">Back to institute register</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="list-page-header">
        <Link to="/dashboard" className="live-feed-back">
          ← Institute register
        </Link>
        <h2>{institute.name}</h2>
        <p>
          {institute.district} · Last inspected {institute.last_inspected_at}
        </p>
      </header>

      <div className="live-feed-stamp">
        <RiskStamp score={institute.risk_score} />
      </div>

      <div className="live-feed-frame">
        {institute.cctv_stream_url ? (
          <div className="live-feed-placeholder">
            <span className="live-feed-dot" />
            Simulated feed — {institute.cctv_stream_url}
          </div>
        ) : (
          <div className="live-feed-placeholder live-feed-placeholder--offline">
            No CCTV stream registered for this institute
          </div>
        )}
      </div>
    </Layout>
  );
}
