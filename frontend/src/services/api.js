import axios from "axios";
import { auth } from "../config/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach Firebase ID Token and user context
api.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["x-user-id"] = currentUser.uid;
        config.headers["x-user-email"] = currentUser.email || "";
        config.headers["x-user-name"] = currentUser.displayName || "";
      }
    } catch (err) {
      console.warn("[API Interceptor] Could not fetch user auth token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Curriculum APIs
export const getUniversities = async () => {
  const response = await api.get("/curriculum/universities");
  return response.data;
};

export const getCourses = async () => {
  const response = await api.get("/curriculum/courses");
  return response.data;
};

export const getBranches = async () => {
  const response = await api.get("/curriculum/branches");
  return response.data;
};

export const getSubjects = async (params = {}) => {
  const response = await api.get("/curriculum/subjects", { params });
  return response.data;
};

export const getSubjectByCode = async (code) => {
  const response = await api.get(`/curriculum/subjects/${code}`);
  return response.data;
};

// Material APIs (Handwritten Notes, PYQ, Syllabus, Important Topics)
export const getMaterials = async (params = {}) => {
  const response = await api.get("/materials", { params });
  return response.data;
};

export const getMaterialById = async (id) => {
  const response = await api.get(`/materials/${id}`);
  return response.data;
};

export const recordMaterialView = async (id) => {
  const response = await api.post(`/materials/${id}/view`);
  return response.data;
};

export const recordMaterialDownload = async (id) => {
  const response = await api.post(`/materials/${id}/download`);
  return response.data;
};

export const uploadMaterial = async (data) => {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };
  const response = await api.post("/materials/upload", data, { headers });
  return response.data;
};

export const saveMaterialUrl = async (payload) => {
  const response = await api.post("/materials/save-url", payload);
  return response.data;
};

// Bookmark APIs
export const fetchUserBookmarks = async (type = "all") => {
  const response = await api.get("/bookmarks", { params: { type } });
  return response.data;
};

export const toggleServerBookmark = async (bookmarkItem) => {
  const response = await api.post("/bookmarks/toggle", bookmarkItem);
  return response.data;
};

export const syncServerBookmarks = async (bookmarksList) => {
  const response = await api.post("/bookmarks/sync", { bookmarks: bookmarksList });
  return response.data;
};

export const clearServerBookmarks = async () => {
  const response = await api.delete("/bookmarks/clear");
  return response.data;
};

// Feedback APIs
export const submitServerFeedback = async (feedbackData) => {
  const response = await api.post("/feedback", feedbackData);
  return response.data;
};

export const fetchFeedbacks = async () => {
  const response = await api.get("/feedback");
  return response.data;
};

// User Profile APIs
export const syncUserProfile = async (preferences = {}) => {
  const response = await api.post("/users/sync", { preferences });
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

// ImageKit Client Token API
export const getImageKitAuthParams = async () => {
  const response = await api.get("/imagekit/auth");
  return response.data;
};

export default api;
