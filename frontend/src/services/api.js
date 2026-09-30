/**
 * API service for HumanTwin AI frontend.
 * Communicates with FastAPI backend with error handling and fallback support.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Profile & Twin Overview
  getProfile: () => request('/profile'),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getTwinOverview: () => request('/twin'),

  // Goals
  getGoals: () => request('/goals'),
  createGoal: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),

  // Tasks
  getTasks: () => request('/tasks'),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Preferences & Routine
  getPreferences: () => request('/preferences'),
  getRoutines: () => request('/routines'),
  getPatterns: () => request('/patterns'),

  // What-If Simulation
  simulateWhatIf: (query, scenarioAFocus, scenarioBFocus, daysHorizon = 2) =>
    request('/what-if', {
      method: 'POST',
      body: JSON.stringify({
        query,
        scenario_a_focus: scenarioAFocus,
        scenario_b_focus: scenarioBFocus,
        days_horizon: daysHorizon,
      }),
    }),

  // Feedback & Learning Loop
  submitFeedback: ({ simulationId, wasUseful, userChoice, reasonCategory, customReason }) =>
    request('/feedback', {
      method: 'POST',
      body: JSON.stringify({
        simulation_id: simulationId,
        was_useful: wasUseful,
        user_choice: userChoice,
        reason_category: reasonCategory,
        custom_reason: customReason,
      }),
    }),

  // Permissions & Privacy
  getPermissions: () => request('/permissions'),
  updatePermission: (id, enabled) =>
    request(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),
  clearHistory: () => request('/permissions/clear-history', { method: 'POST' }),

  // Reset & Demo Loading
  resetTwin: () => request('/twin/reset', { method: 'POST' }),
  loadDemoStudent: () => request('/demo/load', { method: 'POST' }),

  // Conversational AI Chat
  chatWithTwin: (message, history = []) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};
