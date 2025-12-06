import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error("API error", error);
    }
    return Promise.reject(error);
  }
);

export async function warmBackend() {
  try {
    await api.get("/health", { timeout: 5000 });
  } catch {
    // Best-effort warmup; ignore errors (cold start or sleeping dyno).
  }
}
