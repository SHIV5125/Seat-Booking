import axios from "axios";

// Axios instance with base URL
const api = axios.create({
  baseURL: "https://seat-booking-1.onrender.com/api",
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
