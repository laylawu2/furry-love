import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    // Get token from auth context/localStorage
    const token = "2";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
