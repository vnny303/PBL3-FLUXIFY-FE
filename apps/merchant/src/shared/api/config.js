export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
// Mock delay helper function
export const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5119';
export const AUTH_BASE_PATH = import.meta.env.VITE_AUTH_BASE_PATH || '/api/auth';
