import { createStore } from 'vuex';
import user from './user';
import advertissement from './advertissement';
import conversation from './conversation';
import message from './message';

const store = createStore({
  modules: {
    user,
    advertissement,
    conversation,
    message
  },
});

export default store;
