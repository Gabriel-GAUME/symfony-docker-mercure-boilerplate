import axiosClient from './axiosClient';

const apiMessage = {
  async sendMessage(payload) {
    console.log(payload)
    return axiosClient.post('/messages', payload);
  },

};

export default apiMessage;
