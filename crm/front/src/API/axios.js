import axios from 'axios';

const URL = window.location.origin;
let server = '';
URL.includes('localhost') ? (server = 'http://localhost:3000') : (server = `${URL}/api`);

const api = axios.create({
  baseURL: server,
});

// Добавляем interceptor для автоматического подставления токена
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Добавляем interceptor для обработки 401 Unauthorized
// api.interceptors.response.use(
//     (response) => response, // Пропускаем успешные ответы
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             sessionStorage.removeItem("accessToken"); // Очищаем токен
//             window.location.href = "/"; // Перенаправляем на главную
//         }
//         return Promise.reject(error);
//     }
// );

export default api;
