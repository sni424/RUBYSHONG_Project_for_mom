import api from '@/api/axios';

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (data: LoginPayload) => {
  const response = await api.post('/api/admin/login', data);
  return response.data;
};
