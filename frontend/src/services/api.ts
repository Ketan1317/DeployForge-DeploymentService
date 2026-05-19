import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

function getErrorMessage(error: AxiosError): string {
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const data = error.response.data as ApiErrorResponse;
  const status = error.response.status;

  switch (status) {
    case 400:
      return data.message || data.error || 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication failed. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'The resource already exists.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return data.message || data.error || 'An error occurred. Please try again.';
  }
}

// Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors with user-friendly messages
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const userMessage = getErrorMessage(error);
    const errorWithMessage = new Error(userMessage);
    return Promise.reject(errorWithMessage);
  }
);

export const authAPI = {
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  },
  getMe: () => apiClient.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

export const deploymentAPI = {
  createDeployment: (gitUrl: string, title: string, connectionString: string, userId: string) =>
    apiClient.post('/project', { gitUrl, title, connectionString, userId }),
  getDeployments: () => apiClient.get('/project'),
};

export default apiClient;
