/**
 * Shared Axios instance for the whole frontend. Handles:
 *  - Attaching the access token to every request
 *  - Transparently refreshing an expired access token once, then retrying
 *  - Redirecting to /login when the session truly can't be recovered
 */
const MFI = (() => {
  const ACCESS_KEY = 'mfi_access_token';
  const REFRESH_KEY = 'mfi_refresh_token';
  const USER_KEY = 'mfi_user';

  const api = axios.create({
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' },
  });

  function getAccessToken() {
    return localStorage.getItem(ACCESS_KEY);
  }
  function getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY);
  }
  function setSession({ access_token, refresh_token, user }) {
    if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
    if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  function clearSession() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  let refreshingPromise = null;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response ? error.response.status : null;

      if (status === 401 && !originalRequest._retry && getRefreshToken()) {
        originalRequest._retry = true;

        try {
          refreshingPromise = refreshingPromise || axios.post('/api/v1/auth/refresh', {
            refresh_token: getRefreshToken(),
          });
          const { data } = await refreshingPromise;
          refreshingPromise = null;

          setSession(data.data);
          originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          refreshingPromise = null;
          clearSession();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      if (status === 401) {
        clearSession();
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return { api, getAccessToken, getRefreshToken, setSession, clearSession, getUser };
})();
