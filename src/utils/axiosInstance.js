import axios from 'axios';

// Build base URL safely from env with sensible defaults
const API_BASE = (import.meta?.env?.VITE_APP_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const API_PREFIX = (import.meta?.env?.VITE_API_PREFIX || '/api/v1').startsWith('/')
  ? (import.meta.env.VITE_API_PREFIX || '/api/v1')
  : `/${import.meta.env.VITE_API_PREFIX || 'api/v1'}`;
// console.log('[blog_frontend/src/utils/axiosInstance.js]:',API_BASE,API_PREFIX);
const axiosInstance = axios.create({
  baseURL: `${API_BASE}${API_PREFIX}`,
  withCredentials: true,
});

// Request interceptor to add auth headers if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from "axios";


// // server ka url hai base url
// // console.log("pricess>>");

// const BASE_URL=import.meta.env.VITE_APP_BASE_URL;
// // const BASE_URL='http:// localhost:5014/api/v1';

// // axois.create() create the instance of axios
// const axiosInstance=axios.create();

// axiosInstance.defaults.baseURL=BASE_URL;
// axiosInstance.defaults.withCredentials=true;

// // you can read axios.intance
// export default axiosInstance;



