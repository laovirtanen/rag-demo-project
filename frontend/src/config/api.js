// API-konfiguraatio
// Käyttää ympäristömuuttujaa tuotannossa ja localhostia kehityksessä
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// API-endpoint URL:ien muodostus
export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/upload`,
  query: `${API_BASE_URL}/query`,
  health: `${API_BASE_URL}/health`
};
