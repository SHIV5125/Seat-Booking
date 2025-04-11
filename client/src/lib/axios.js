import axios from "axios";

// Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with live URL on deployment
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
