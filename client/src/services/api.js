import axios from "axios";

// ✅ Base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // needed for cookies if you use them later
});

// ✅ Automatically attach token to requests
API.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired tokens or 401s
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ API endpoints
export const loginUser = (data) => API.post("/user/login", data);
export const signupUser = (data) => API.post("/user/signup", data);
export const getUserProfile = () => API.get("/user/profile");

export default API;
