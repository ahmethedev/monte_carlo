import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/auth';

export const register = (email: string, password: string) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

export const login = (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    return axios.post(`${API_URL}/token`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const getCurrentUser = (token: string) => {
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
