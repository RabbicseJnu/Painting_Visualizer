
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api/',
// });

// export default API;




// frontend/src/api/index.js
import axios from "axios";

/** ---- Storage helpers ---- */
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
};
const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};
export const getMe = getUser;
export const isAuthed = () => !!localStorage.getItem("access");
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};

/** ---- Axios instance ---- */
const api = axios.create({
  // keep the trailing slash since your backend is mounted at /api/
  baseURL: "http://localhost:5000/api/",
  withCredentials: false,
});

/** ---- Attach access token on every request ---- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** ---- 401 handler: try refresh once, then retry original request ----
 * Backend endpoints assumed:
 *   POST /api/token/refresh/  { "refresh": "<refresh_token>" } -> { "access": "<new_access>" }
 * If your URL is different, change REFRESH_URL below.
 */
const REFRESH_URL = "token/refresh/";
let isRefreshing = false;
let refreshWaitlist = [];

const processWaitlist = (newAccess, error) => {
  refreshWaitlist.forEach(({ resolve, reject, originalRequest }) => {
    if (newAccess) {
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      resolve(api(originalRequest));
    } else {
      reject(error);
    }
  });
  refreshWaitlist = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config: originalRequest, response } = error || {};
    if (!response) return Promise.reject(error); // network error, timeouts, etc.

    // Only handle 401 once per request and avoid infinite loops
    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      // queue requests while a refresh is in-flight
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshWaitlist.push({ resolve, reject, originalRequest });
        });
      }

      try {
        isRefreshing = true;
        const { data } = await axios.post(
          // use a plain axios call to avoid hitting this interceptor loop
          "http://localhost:5000/api/" + REFRESH_URL,
          { refresh }
        );
        const newAccess = data?.access;
        if (!newAccess) throw new Error("No access token in refresh response");

        setTokens({ access: newAccess }); // keep old refresh
        // update default header for next requests
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        // retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        // resolve all queued requests
        processWaitlist(newAccess, null);
        return api(originalRequest);
      } catch (err) {
        // refresh failed: flush queue with error and logout
        processWaitlist(null, err);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
