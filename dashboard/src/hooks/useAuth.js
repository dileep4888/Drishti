import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Shared by every protected page (Dashboard, Live Inspections, VC Call Log,
// Risk Flags, Live Feed) so "am I logged in" is checked the same way
// everywhere instead of being copy-pasted per page.
export function useAuth() {
  const [authState, setAuthState] = useState(() => ({
    name: localStorage.getItem("drishti_name") || "",
    role: localStorage.getItem("drishti_role") || "",
    token: localStorage.getItem("drishti_token") || null,
  }));
  const navigate = useNavigate();

  const hasToken = Boolean(authState.token);

  useEffect(() => {
    if (!hasToken) {
      navigate("/login");
    }
  }, [hasToken, navigate]);

  function logout() {
    localStorage.removeItem("drishti_token");
    localStorage.removeItem("drishti_role");
    localStorage.removeItem("drishti_name");
    setAuthState({ name: "", role: "", token: null });
    navigate("/login");
  }

  return {
    name: authState.name,
    role: authState.role,
    ready: hasToken,
    logout,
  };
}
