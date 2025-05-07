import apiConversation from '../api/conversation';

const state = {
  conversations: [],
  conversation: [],
  topic: '',
  messages: []
};

const mutations = {
  setConversations(state, conversations) {
    state.conversations = conversations;
  },
  setConversation(state, conversation) {
    state.conversation = conversation;
    state.messages = conversation.messages
  },
  setTopic(state, topic) {
    state.topic = topic;
  },
  addMessage(state, message) {
    state.messages.push(message);
  }
};

const actions = {
  async fetchConversation({ commit }, userId) {
    const conversation = await apiConversation.getConversation(userId);
    commit('setConversation', conversation.data.conversation);
    commit('setTopic', conversation.data.topic);
  },

  async fetchAllConversations({ commit }) {
    const conversations = await apiConversation.getAllConversations();
    console.log(conversations.data)
    commit('setConversations', conversations.data);
  },

  appendMessage({ commit }, message) {
    commit('addMessage', message);
  },


};

const getters = {
  conversation: (state) => state.conversation,
  conversations: (state) => state.conversations,
  topic: (state) => state.topic,
  messages: (state) => state.messages,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
