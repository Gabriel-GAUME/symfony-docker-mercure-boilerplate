import axios from 'axios';

const AuthManager = {
  storeTokens({ access_token, refresh_token }) {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        console.error("Aucun refresh token disponible.");
        this.logout();
        return null;
      }

      const response = await axios.post('/api/token/refresh', {
        refresh_token: refreshToken,
      });

      if (response.data.access_token && response.data.refresh_token) {
        this.storeTokens(response.data);
        return response.data.access_token; // Retourne le nouveau token
      } else {
        throw new Error("Réponse invalide lors du rafraîchissement du token.");
      }

    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token :', error);
      this.logout(); // Déconnecte si le refresh échoue
      return null;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

export default AuthManager;
