/**
 * FourGuard AI - Global Configuration
 * 
 * This file centralizes the connection logic for the backend.
 * In production, it uses the VITE_BACKEND_URL environment variable.
 * In development, it defaults to your local server on port 3001.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default {
  BACKEND_URL,
  SOCKET_URL: BACKEND_URL, // Consistent for both REST and Sockets
};
