import axios from 'axios';
import AuthManager from './authManager';

// Définir l'URL de base en fonction des variables d'environnement
const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // Dynamique selon l'environnement
});

// ➤ Intercepteur pour inclure le token dans chaque requête
axiosClient.interceptors.request.use(async (config) => {
  const token = AuthManager.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// ➤ Intercepteur pour gérer le rafraîchissement des tokens
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await AuthManager.refreshToken();

        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(error.config);
        }
      } catch (refreshError) {
        console.error('Erreur lors du renouvellement du token :', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
