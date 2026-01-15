import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== MENU APIs =====
export const getMenus = (params = {}) => api.get("/menus/", { params });
export const getMenuById = (id) => api.get(`/menus/${id}/`);
export const createMenu = (data) => api.post("/menus/", data);
export const updateMenu = (id, data) => api.put(`/menus/${id}/`, data);
export const deleteMenu = (id) => api.delete(`/menus/${id}/`);

// ===== CATEGORY APIs =====
export const getCategories = () => api.get("/categories/");
export const getMenusByCategory = (categoryId) =>
  api.get(`/categories/${categoryId}/menus/`);

// ===== SEARCH =====
export const searchMenus = (query) =>
  api.get("/search/", { params: { q: query } });

export default api;
