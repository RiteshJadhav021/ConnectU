// Production API Configuration
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://connectu-backend.onrender.com/api'
  : 'http://localhost:5000/api';

export const SOCKET_URL = import.meta.env.PROD 
  ? 'https://connectu-backend.onrender.com'
  : 'http://localhost:5000';

console.log('Environment:', import.meta.env.MODE);
console.log('API Base URL:', API_BASE_URL);
console.log('Socket URL:', SOCKET_URL);