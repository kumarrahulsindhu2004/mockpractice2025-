import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const AUTH_PATHS = ["/user/login", "/user/signup", "/user/verify-email", "/user/resend-otp"];

const safeParseToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

API.interceptors.request.use(
  (config) => {
    const token = safeParseToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isAuthRequest = AUTH_PATHS.some((path) => url.includes(path));

    // Only clear session on 401 for protected routes — never on login/signup failures
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = (data) => API.post("/user/login", data);
export const signupUser = (data) => API.post("/user/signup", data);
export const getUserProfile = () => API.get("/user/profile");
export const verifyEmailOtp = (data) => API.post("/user/verify-email", data);
export const resendOtp = (data) => API.post("/user/resend-otp", data);

export default API;
