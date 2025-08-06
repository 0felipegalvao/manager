import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Se o token expirou, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'CONTADOR' | 'ASSISTENTE';
}

// Funções da API de Autenticação
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  validateToken: async () => {
    const response = await api.post('/auth/validate');
    return response.data;
  },
};

// Funções da API de Usuários
export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: RegisterRequest) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: Partial<RegisterRequest>) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Funções da API de Clientes
export const clientsApi = {
  getAll: async (all?: boolean) => {
    const response = await api.get('/clients', { params: { all } });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  getByCnpj: async (cnpj: string) => {
    const response = await api.get(`/clients/cnpj/${cnpj}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/clients/stats');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

// Funções da API de Documentos
export const documentsApi = {
  getAll: async (clientId?: number) => {
    const response = await api.get('/documents', { params: { clientId } });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  getByType: async (type: string, clientId?: number) => {
    const response = await api.get(`/documents/type/${type}`, { params: { clientId } });
    return response.data;
  },

  getStats: async (clientId?: number) => {
    const response = await api.get('/documents/stats', { params: { clientId } });
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/documents', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/documents/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

// Funções da API Fiscal
export const fiscalApi = {
  getObligations: async (clientId?: number) => {
    const response = await api.get('/fiscal/obligations', { params: { clientId } });
    return response.data;
  },

  getObligationById: async (id: number) => {
    const response = await api.get(`/fiscal/obligations/${id}`);
    return response.data;
  },

  getObligationStats: async (clientId?: number) => {
    const response = await api.get('/fiscal/obligations/stats', { params: { clientId } });
    return response.data;
  },

  getUpcomingObligations: async (days?: number, clientId?: number) => {
    const response = await api.get('/fiscal/obligations/upcoming', { params: { days, clientId } });
    return response.data;
  },

  getOverdueObligations: async (clientId?: number) => {
    const response = await api.get('/fiscal/obligations/overdue', { params: { clientId } });
    return response.data;
  },

  getCalendarData: async (year: number, month: number, clientId?: number) => {
    const response = await api.get('/fiscal/calendar', { params: { year, month, clientId } });
    return response.data;
  },

  createObligation: async (data: any) => {
    const response = await api.post('/fiscal/obligations', data);
    return response.data;
  },

  updateObligation: async (id: number, data: any) => {
    const response = await api.patch(`/fiscal/obligations/${id}`, data);
    return response.data;
  },

  deleteObligation: async (id: number) => {
    const response = await api.delete(`/fiscal/obligations/${id}`);
    return response.data;
  },
};

// Funções da API de Notificações
export const notificationsApi = {
  getAll: async (userId?: number) => {
    const response = await api.get('/notifications', { params: { userId } });
    return response.data;
  },

  getUnread: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/notifications/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Funções da API de Relatórios
export const reportsApi = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getClientsByStatus: async () => {
    const response = await api.get('/reports/clients/by-status');
    return response.data;
  },

  getClientsByTaxRegime: async () => {
    const response = await api.get('/reports/clients/by-tax-regime');
    return response.data;
  },

  getDocumentsByType: async () => {
    const response = await api.get('/reports/documents/by-type');
    return response.data;
  },

  getDocumentsByStatus: async () => {
    const response = await api.get('/reports/documents/by-status');
    return response.data;
  },

  getObligationsByStatus: async () => {
    const response = await api.get('/reports/obligations/by-status');
    return response.data;
  },

  getObligationsByType: async () => {
    const response = await api.get('/reports/obligations/by-type');
    return response.data;
  },

  getMonthlyStats: async (year: number) => {
    const response = await api.get('/reports/monthly', { params: { year } });
    return response.data;
  },

  getTopClients: async (limit?: number) => {
    const response = await api.get('/reports/clients/top', { params: { limit } });
    return response.data;
  },

  getRevenueReport: async (year: number) => {
    const response = await api.get('/reports/revenue', { params: { year } });
    return response.data;
  },
};

export default api;
