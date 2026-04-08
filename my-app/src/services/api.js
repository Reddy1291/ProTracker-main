import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// USER / AUTH APIs
// ========================

export const userAPI = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  // Get all users
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user profile
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Test connection
  test: async () => {
    const response = await api.get('/users/test');
    return response.data;
  },

  // Forgot password - verify email exists
  forgotPassword: async (email) => {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (email, newPassword) => {
    const response = await api.post('/users/reset-password', { email, newPassword });
    return response.data;
  },
};

// ========================
// PROJECT APIs
// ========================

export const projectAPI = {
  // Get all projects
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get project by ID
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Get projects by owner
  getByOwner: async (ownerId) => {
    const response = await api.get(`/projects/owner/${ownerId}`);
    return response.data;
  },

  // Get published projects (Discover)
  getPublished: async () => {
    const response = await api.get('/projects/published');
    return response.data;
  },

  // Create project
  create: async (projectData, ownerId) => {
    const response = await api.post(`/projects?ownerId=${ownerId}`, projectData);
    return response.data;
  },

  // Update project
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Upload document with progress tracking
  uploadDocument: async (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/projects/${id}/document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress || undefined,
    });
    return response.data;
  },
};

// ========================
// MILESTONE APIs
// ========================

export const milestoneAPI = {
  // Get milestones by project
  getByProject: async (projectId) => {
    const response = await api.get(`/milestones/project/${projectId}`);
    return response.data;
  },

  // Get milestone by ID
  getById: async (id) => {
    const response = await api.get(`/milestones/${id}`);
    return response.data;
  },

  // Create milestone
  create: async (milestoneData, projectId) => {
    const response = await api.post(`/milestones?projectId=${projectId}`, milestoneData);
    return response.data;
  },

  // Update milestone
  update: async (id, milestoneData) => {
    const response = await api.put(`/milestones/${id}`, milestoneData);
    return response.data;
  },

  // Delete milestone
  delete: async (id) => {
    const response = await api.delete(`/milestones/${id}`);
    return response.data;
  },
};

// ========================
// FEEDBACK APIs
// ========================

export const feedbackAPI = {
  // Get feedback by project
  getByProject: async (projectId) => {
    const response = await api.get(`/feedback/project/${projectId}`);
    return response.data;
  },

  // Get feedback by author
  getByAuthor: async (authorId) => {
    const response = await api.get(`/feedback/author/${authorId}`);
    return response.data;
  },

  // Create feedback
  create: async (feedbackData, projectId) => {
    const response = await api.post(`/feedback?projectId=${projectId}`, feedbackData);
    return response.data;
  },

  // Update feedback
  update: async (id, feedbackData) => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  // Delete feedback
  delete: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },
};

// ========================
// HELPER: Transform backend data to frontend format
// ========================

export const transformProject = (backendProject) => {
  return {
    id: String(backendProject.id),
    ownerId: String(backendProject.ownerId),
    title: backendProject.title,
    abstract: backendProject.abstractText,
    tags: backendProject.tags ? backendProject.tags.split(',').map(t => t.trim()) : [],
    coverImageURL: backendProject.coverImageURL || '',
    media: backendProject.media ? backendProject.media.split(',').map(m => m.trim()) : [],
    repoLink: backendProject.repoLink || '',
    demoLink: backendProject.demoLink || '',
    published: backendProject.published,
    visibility: backendProject.visibility,
    createdAt: backendProject.createdAt,
    updatedAt: backendProject.updatedAt,
    progress: backendProject.progress,
    techStack: backendProject.techStack ? backendProject.techStack.split(',').map(t => t.trim()) : [],
    features: backendProject.features ? backendProject.features.split(',').map(f => f.trim()) : [],
    documentURL: backendProject.documentURL ? `http://localhost:8080${backendProject.documentURL}` : null,
    documentName: backendProject.documentName || null,
  };
};

export const transformUser = (backendUser) => {
  return {
    id: String(backendUser.id),
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role,
    department: backendUser.department,
    year: backendUser.year,
    avatarURL: backendUser.avatarURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
    bio: backendUser.bio,
    publicProfile: backendUser.publicProfile,
  };
};

export const transformMilestone = (backendMilestone) => {
  return {
    id: String(backendMilestone.id),
    projectId: String(backendMilestone.projectId),
    title: backendMilestone.title,
    description: backendMilestone.description,
    dueDate: backendMilestone.dueDate,
    status: backendMilestone.status,
    percentComplete: backendMilestone.percentComplete,
  };
};

export const transformFeedback = (backendFeedback) => {
  return {
    id: String(backendFeedback.id),
    projectId: String(backendFeedback.projectId),
    authorId: String(backendFeedback.authorId),
    timestamp: backendFeedback.timestamp,
    content: backendFeedback.content,
    type: backendFeedback.type,
    status: backendFeedback.status,
    rating: backendFeedback.rating,
  };
};

// Transform frontend project data to backend format
export const toBackendProject = (frontendProject) => {
  return {
    title: frontendProject.title,
    abstractText: frontendProject.abstract,
    tags: Array.isArray(frontendProject.tags) ? frontendProject.tags.join(', ') : frontendProject.tags,
    coverImageURL: frontendProject.coverImageURL,
    media: Array.isArray(frontendProject.media) ? frontendProject.media.join(', ') : frontendProject.media,
    repoLink: frontendProject.repoLink,
    demoLink: frontendProject.demoLink,
    published: frontendProject.published,
    visibility: frontendProject.visibility,
    progress: frontendProject.progress,
    techStack: Array.isArray(frontendProject.techStack) ? frontendProject.techStack.join(', ') : frontendProject.techStack,
    features: Array.isArray(frontendProject.features) ? frontendProject.features.join(', ') : frontendProject.features,
  };
};

// ========================
// ASSIGNMENT APIs
// ========================

export const assignmentAPI = {
  // Student requests a faculty mentor
  requestMentor: async (studentId, facultyId) => {
    const response = await api.post(`/assignments/request?studentId=${studentId}&facultyId=${facultyId}`);
    return response.data;
  },

  // Faculty accepts a request
  accept: async (assignmentId) => {
    const response = await api.put(`/assignments/${assignmentId}/accept`);
    return response.data;
  },

  // Faculty rejects a request
  reject: async (assignmentId) => {
    const response = await api.put(`/assignments/${assignmentId}/reject`);
    return response.data;
  },

  // Get all assignments for a student
  getByStudent: async (studentId) => {
    const response = await api.get(`/assignments/student/${studentId}`);
    return response.data;
  },

  // Get all assignments for a faculty
  getByFaculty: async (facultyId) => {
    const response = await api.get(`/assignments/faculty/${facultyId}`);
    return response.data;
  },

  // Get pending requests for faculty
  getPendingForFaculty: async (facultyId) => {
    const response = await api.get(`/assignments/faculty/${facultyId}/pending`);
    return response.data;
  },

  // Get accepted mentees for faculty
  getAcceptedForFaculty: async (facultyId) => {
    const response = await api.get(`/assignments/faculty/${facultyId}/accepted`);
    return response.data;
  },

  // Get accepted mentor for student
  getMentor: async (studentId) => {
    const response = await api.get(`/assignments/student/${studentId}/mentor`);
    return response.data;
  },

  // Check if faculty is assigned to student
  checkAssignment: async (facultyId, studentId) => {
    const response = await api.get(`/assignments/check?facultyId=${facultyId}&studentId=${studentId}`);
    return response.data;
  },

  // Get all faculty list
  getFacultyList: async () => {
    const response = await api.get('/assignments/faculty-list');
    return response.data;
  },

  // Delete assignment
  delete: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
};

export const transformAssignment = (a) => ({
  id: String(a.id),
  studentId: String(a.studentId),
  facultyId: String(a.facultyId),
  studentName: a.studentName,
  facultyName: a.facultyName,
  studentEmail: a.studentEmail,
  facultyEmail: a.facultyEmail,
  studentDepartment: a.studentDepartment,
  studentYear: a.studentYear,
  facultyDepartment: a.facultyDepartment,
  studentAvatarURL: a.studentAvatarURL,
  facultyAvatarURL: a.facultyAvatarURL,
  status: a.status,
  requestedAt: a.requestedAt,
  respondedAt: a.respondedAt,
});

export default api;
