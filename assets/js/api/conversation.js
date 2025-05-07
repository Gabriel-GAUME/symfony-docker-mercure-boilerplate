import axiosClient from './axiosClient';

const apiConversation = {

  async getConversation(userId) {
    return axiosClient.get(`/api/conversation/${userId}`);
  },
  async getAllConversations() {
    return axiosClient.get(`/api/conversations`);
  },
};

export default apiConversation;
