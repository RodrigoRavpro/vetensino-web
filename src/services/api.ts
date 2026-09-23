import axios from 'axios';

const resolveBaseURL = (): string => {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return configured;
  // Em dev o Vite faz proxy de /api para a porta 18001.
  return '/api/rest';
};

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 30_000,
  // Sessão trafega em cookie httpOnly; nada de token no localStorage.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // Exigido pela proteção CSRF da API em toda mutação.
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default api;
