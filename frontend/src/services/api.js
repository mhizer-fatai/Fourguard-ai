import axios from 'axios';
import config from '../config';

// --- API Service for FourGuard AI ---
// Now completely decoupled from localhost for production readiness.

export const fetchTokens = async (category = 'trending') => {
  try {
    const res = await axios.get(`${config.BACKEND_URL}/api/tokens`);
    if (res.data && res.data.trending) {
      return res.data;
    }
    throw new Error('Backend data structure invalid');
  } catch (error) {
    console.error("Critical: Backend connection failed.", error.message);
    throw error; // Let the UI handle the error state
  }
};
