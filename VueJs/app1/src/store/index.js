// store/index.js
import { createStore } from 'vuex';
import authModule from './modules/authModule';  // Import the auth module

const store = createStore({
  modules: {
    auth:authModule  // Register the auth module
  },
});

export default store;
