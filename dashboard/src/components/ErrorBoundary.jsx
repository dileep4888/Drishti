import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
          padding: "24px"
        }}>
          <div style={{
            maxWidth: "500px",
            background: "var(--surface)",
            padding: "40px",
            borderRadius: "8px",
            border: "2px solid var(--status-error)",
            textAlign: "center"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 20px",
              background: "#FFEBEE",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px"
            }}>
              ⚠️
            </div>
            <h2 style={{
              margin: "0 0 12px",
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--text-primary)"
            }}>
              Application Error
            </h2>
            <p style={{
              margin: "0 0 24px",
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.6"
            }}>
              An unexpected error occurred. This has been logged and will be reviewed by the technical team.
            </p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              style={{
                padding: "12px 24px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                marginRight: "12px"
              }}
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={{
                marginTop: "24px",
                textAlign: "left",
                fontSize: "12px",
                padding: "12px",
                background: "#f5f5f5",
                borderRadius: "4px"
              }}>
                <summary style={{ cursor: "pointer", fontWeight: "600", marginBottom: "8px" }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ margin: "0", overflow: "auto", whiteSpace: "pre-wrap" }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
