import axiosClient from './axiosClient';

const apiUser = {

    async getProfile() {
        try {
            const response = await axiosClient.get('/api/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    // Inscription
    async register(userData) {
        try {
            const response = await axiosClient.post('/api/register', userData);
            return response.data; // Retourne les données utilisateur
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    // Connexion
    async login(credentials) {
        console.log("Données envoyées à l'API:", credentials); 
        try {
            const response = await axiosClient.post('/api/login', credentials);
            return response.data; // Retourne l'objet { token, refresh_token }
        } catch (error) {
            console.error('Error logging in:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    // Rafraîchir le token (si tu as une route dédiée)
    async refreshToken(refreshToken) {
        try {
            const response = await axiosClient.post('/api/token/refresh', {
                refresh_token: refreshToken,
            });
            return response.data; // Retourne le nouveau token
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw new Error('Refresh token failed');
        }
    },

    // Exemple : récupérer le profil utilisateur
    async getProfile() {
        try {
            const response = await axiosClient.get('/api/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw new Error('Failed to fetch profile');
        }
    },

    async getUsers() {
        try {
            const response = await axiosClient.get('/api/users');
            console.log(response)
            return response.data; 
        } catch (error) {
            console.error('2 Erreur lors de la récupération des utilisateurs :', error);
            throw error;
        }
    },
};

export default apiUser;
