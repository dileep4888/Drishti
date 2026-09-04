import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LiveInspections from "./pages/LiveInspections";
import VCCallLog from "./pages/VCCallLog";
import RiskFlags from "./pages/RiskFlags";
import LiveFeed from "./pages/LiveFeed";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inspections" element={<LiveInspections />} />
          <Route path="/vc-calls" element={<VCCallLog />} />
          <Route path="/risk-flags" element={<RiskFlags />} />
          <Route path="/institutes/:id/live" element={<LiveFeed />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
