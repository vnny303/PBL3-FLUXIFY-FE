export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
// Mock delay helper function
export const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
