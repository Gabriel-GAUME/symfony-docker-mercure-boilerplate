import apiMessage from '../api/message';

const state = {
  messages: [],
};

const mutations = {
  addMessage(state, payload) {
    state.messages.push(payload);
  },
};

const actions = {
  async sendMessage({ commit }, payload) {
    await apiMessage.sendMessage(payload);
    commit('addMessage', { payload });
  },
};

const getters = {
  messages: (state) => state.messages,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
