// TODO: replace every export here with real calls to the backend once those
// endpoints exist (GET /institutes, /inspections, /vc-calls, /risk-flags).
// Field names match the tables in db/schema.sql so swapping in real API
// responses later is a drop-in change.

export const MOCK_INSTITUTES = [
  { id: 1, name: "Asha Rehabilitation Centre", district: "Jaipur", risk_score: 82, last_inspected_at: "2026-08-14", status: "flagged", cctv_stream_url: "demo-stream-1" },
  { id: 2, name: "Sunrise Old Age Home", district: "Udaipur", risk_score: 41, last_inspected_at: "2026-08-20", status: "under_review", cctv_stream_url: "demo-stream-2" },
  { id: 3, name: "Divyang Skill Development Institute", district: "Kota", risk_score: 12, last_inspected_at: "2026-08-25", status: "active", cctv_stream_url: "demo-stream-3" },
  { id: 4, name: "Sanjeevani NGO Trust", district: "Jodhpur", risk_score: 68, last_inspected_at: "2026-07-30", status: "flagged", cctv_stream_url: "demo-stream-4" },
  { id: 5, name: "Pragati Scholarship Cell", district: "Ajmer", risk_score: 5, last_inspected_at: "2026-08-27", status: "active", cctv_stream_url: null },
];

export const MOCK_INSPECTIONS = [
  { id: 101, institute_name: "Asha Rehabilitation Centre", inspector_name: "R. Meena", assignment_type: "triggered_by_flag", status: "in_progress", assigned_at: "2026-08-29" },
  { id: 102, institute_name: "Sanjeevani NGO Trust", inspector_name: "K. Solanki", assignment_type: "manual", status: "assigned", assigned_at: "2026-08-29" },
  { id: 103, institute_name: "Sunrise Old Age Home", inspector_name: "P. Chouhan", assignment_type: "random", status: "submitted", assigned_at: "2026-08-27" },
  { id: 104, institute_name: "Divyang Skill Development Institute", inspector_name: "R. Meena", assignment_type: "random", status: "reviewed", assigned_at: "2026-08-24" },
];

export const MOCK_VC_CALLS = [
  { id: 201, institute_name: "Asha Rehabilitation Centre", target_role: "incharge", call_status: "missed", call_started_at: "2026-08-28 11:00" },
  { id: 202, institute_name: "Sunrise Old Age Home", target_role: "staff", call_status: "completed", call_started_at: "2026-08-27 15:30" },
  { id: 203, institute_name: "Sanjeevani NGO Trust", target_role: "beneficiary", call_status: "scheduled", call_started_at: "2026-08-30 10:00" },
  { id: 204, institute_name: "Divyang Skill Development Institute", target_role: "incharge", call_status: "completed", call_started_at: "2026-08-25 09:15" },
];

export const MOCK_RISK_FLAGS = [
  { id: 301, institute_name: "Asha Rehabilitation Centre", flag_type: "attendance_mismatch", severity: "high", resolved: false },
  { id: 302, institute_name: "Sanjeevani NGO Trust", flag_type: "cctv_anomaly", severity: "medium", resolved: false },
  { id: 303, institute_name: "Sunrise Old Age Home", flag_type: "missed_vc", severity: "low", resolved: true },
];
