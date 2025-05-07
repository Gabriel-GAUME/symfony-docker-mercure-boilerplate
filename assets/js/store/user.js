import apiUser from '../api/user';
import AuthManager from '../api/authManager';

const state = {
  user: null,
  token: AuthManager.getAccessToken() || null,
  isAuthenticated: !!AuthManager.getAccessToken(),
  error: null,
  users: [],
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
    state.isAuthenticated = true;
  },
  setError(state, error) {
    state.error = error;
  },
  logout(state) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
  },
  setUsers(state, users) {
    state.users = users;
  },
};

const actions = {

  async register({ commit }, payload) {
    try {
      let data = await apiUser.register(payload);
      return data;
    } catch (errors) {
      commit('setError', error.message);
      throw error;
    }
  },

  async login({ commit }, credentials) {
    console.log("Données envoyées :", credentials);
    try {
      const data = await apiUser.login(credentials);
      AuthManager.storeTokens(data);
      commit('setToken', data.access_token);

      console.log('Access token récupéré :', AuthManager.getAccessToken());


      // Charger le profil utilisateur après la connexion
      const user = await apiUser.getProfile();
      console.log(user)
      commit('setUser', user);
    } catch (error) {
      commit('setError', error.message);
      throw error;
    }
  },

  async loadUser({ commit }) {
    if (state.token) {
      try {
        const user = await apiUser.getProfile();
        commit('setUser', user);
      } catch (error) {
        console.error('Erreur lors du chargement du profil :', error);
        commit('logout');
      }
    }
  },

  async refreshToken({ commit }) {
    try {
      const newToken = await AuthManager.refreshToken();
      commit('setToken', newToken);
      const user = await apiUser.getProfile();
      commit('setUser', user);
    } catch (error) {
      commit('logout');
    }
  },

  async fetchUsers({ commit }) {
    try {
      const users = await apiUser.getUsers();
      console.log(users)
      commit('setUsers', users);
    } catch (error) {
      console.error('1 Erreur lors de la récupération des utilisateurs :', error);
    }
  },

  logout({ commit }) {
    AuthManager.logout();
    commit('logout');
  },
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
  token: (state) => state.token,
  users: (state) => state.users,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
