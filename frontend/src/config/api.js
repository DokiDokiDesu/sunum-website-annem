// API Configuration - Production deployment
const PRODUCTION_API_URL = "https://sunum-website-backend.onrender.com";
const API_BASE_URL = import.meta.env.VITE_API_URL || PRODUCTION_API_URL;

// Debug log - remove after verification
console.log("🔧 API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  mode: import.meta.env.MODE,
});

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,

  // Seminars
  seminars: `${API_BASE_URL}/api/seminars`,
  seminarById: (id) => `${API_BASE_URL}/api/seminars/${id}`,
  voteSeminar: (id) => `${API_BASE_URL}/api/seminars/${id}/vote`,
  cancelSchedule: (id) => `${API_BASE_URL}/api/seminars/${id}/cancel-schedule`,

  // Categories
  categories: `${API_BASE_URL}/api/categories`,
  categoryById: (id) => `${API_BASE_URL}/api/categories/${id}`,

  // Admins
  admins: `${API_BASE_URL}/api/admins`,
  adminById: (id) => `${API_BASE_URL}/api/admins/${id}`,
  adminToggle: (id) => `${API_BASE_URL}/api/admins/${id}/toggle`,

  // Logs
  logs: `${API_BASE_URL}/api/logs`,

  // Voting
  voting: `${API_BASE_URL}/api/voting`,
  votingById: (id) => `${API_BASE_URL}/api/voting/${id}`,
  votingVote: (id) => `${API_BASE_URL}/api/voting/${id}/vote`,
  votingToggle: (id) => `${API_BASE_URL}/api/voting/${id}/toggle`,

  // Health check
  health: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
