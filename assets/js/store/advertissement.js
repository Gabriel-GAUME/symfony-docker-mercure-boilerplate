import apiAdvertissement from '../api/advertissement';

const state = {
    advertissement: null,
    error: null,
    advertissements: [],
};

const mutations = {
    setAdvertissement(state, advertissement) {
        state.advertissement = advertissement;
    },
    setError(state, error) {
        state.error = error;
    },
    setAdvertissements(state, advertissements) {
        state.advertissements = advertissements;
    },
    setNewAdvertissement(state, advertissement) {
        state.error = null;
        state.advertissement = advertissement;
        state.advertissements.push(advertissement);
    },
};

const actions = {

    async create({ commit }, payload) {
        try {
            let response = await apiAdvertissement.create(payload);
            console.log(response)
            commit('setNewAdvertissement', response.data);
            return response.data;
        } catch (error) {
            commit('setError', error.message);
            return null;
        }
    },

    async getAll({ commit }, payload) {
        try {
            let response = await apiAdvertissement.getAll();
            console.log(response)
            commit('setAdvertissements', response.data);
            return response.data;
        } catch (error) {
            commit('setError', error.message);
            return null;
        }
    },

};

const getters = {
    advertissement: (state) => state.advertissement,
    advertissements: (state) => state.advertissements,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
