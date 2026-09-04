-- DRISHTI: DoSJE Smart Monitoring & Inspection App
-- Core database schema (PostgreSQL / Neon optimized)
-- Converted from db/schema.sql (MySQL) — run this one on Neon.

CREATE TYPE user_role AS ENUM ('inspector', 'pmu_admin', 'department_official', 'ngo_incharge');
CREATE TYPE institute_type AS ENUM ('ngo', 'institute', 'project');
CREATE TYPE institute_status AS ENUM ('active', 'flagged', 'under_review');
CREATE TYPE assignment_type AS ENUM ('random', 'manual', 'triggered_by_flag');
CREATE TYPE inspection_status AS ENUM ('assigned', 'in_progress', 'submitted', 'reviewed');
CREATE TYPE evidence_file_type AS ENUM ('photo', 'video');
CREATE TYPE vc_target_role AS ENUM ('incharge', 'staff', 'beneficiary');
CREATE TYPE vc_call_status AS ENUM ('scheduled', 'ongoing', 'completed', 'missed');
CREATE TYPE risk_flag_type AS ENUM ('attendance_mismatch', 'report_similarity', 'cctv_anomaly', 'missed_vc');
CREATE TYPE severity_type AS ENUM ('low', 'medium', 'high');

-- Postgres has no "ON UPDATE CURRENT_TIMESTAMP" — this trigger function replaces it.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_phone_format CHECK (phone IS NULL OR phone ~ '^[+]?[6-9][0-9]{9,14}$')
);
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE institutes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type institute_type NOT NULL,
    scheme_name VARCHAR(200),
    district VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    incharge_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    cctv_stream_url VARCHAR(500),        -- RTSP/HLS url, simulated for demo
    last_inspected_at TIMESTAMP NULL,
    risk_score DECIMAL(5, 2) DEFAULT 0,  -- 0-100, higher = more suspicious
    status institute_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_risk_score CHECK (risk_score >= 0 AND risk_score <= 100)
);
CREATE TRIGGER trg_institutes_updated_at BEFORE UPDATE ON institutes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE inspections (
    id SERIAL PRIMARY KEY,
    institute_id INT NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    inspector_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assignment_type assignment_type DEFAULT 'random',
    status inspection_status DEFAULT 'assigned',
    checklist_data JSONB,                 -- form answers
    inspector_latitude DECIMAL(10, 8),
    inspector_longitude DECIMAL(11, 8),
    gps_verified BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_inspections_updated_at BEFORE UPDATE ON inspections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    inspection_id INT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    file_type evidence_file_type NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    file_hash VARCHAR(128) NOT NULL       -- SHA-256, for tamper-proofing
);

CREATE TABLE vc_calls (
    id SERIAL PRIMARY KEY,
    institute_id INT NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    initiated_by INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    target_role vc_target_role NOT NULL,
    call_status vc_call_status DEFAULT 'scheduled',
    call_started_at TIMESTAMP NULL,
    call_ended_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_vc_calls_updated_at BEFORE UPDATE ON vc_calls
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE risk_flags (
    id SERIAL PRIMARY KEY,
    institute_id INT NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    flag_type risk_flag_type NOT NULL,
    severity severity_type DEFAULT 'low',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_risk_flags_updated_at BEFORE UPDATE ON risk_flags
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Performance indexes for dashboard queries
CREATE INDEX idx_institute_risk ON institutes(risk_score DESC);
CREATE INDEX idx_institute_status ON institutes(status);
CREATE INDEX idx_inspection_status ON inspections(status);
CREATE INDEX idx_inspection_institute ON inspections(institute_id);
CREATE INDEX idx_inspection_inspector ON inspections(inspector_id);
CREATE INDEX idx_evidence_inspection ON evidence(inspection_id);
CREATE INDEX idx_vc_institute ON vc_calls(institute_id);
CREATE INDEX idx_vc_initiated ON vc_calls(initiated_by);
CREATE INDEX idx_flags_institute ON risk_flags(institute_id, resolved);
CREATE INDEX idx_flags_severity ON risk_flags(severity, resolved);
