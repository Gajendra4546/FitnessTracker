import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signup = (data: any) => API.post('/auth/signup', data);
export const login = (data: any) => API.post('/users/signin', data);
export const getPlans = () => API.get('/plans');
export const selectPlan = (planId: string) => API.post('/users/select-plan', { planId });
export const logExercise = (data: any) => API.post('/users/log-exercise', data);

