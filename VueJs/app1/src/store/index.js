// store/index.js
import { createStore } from 'vuex';
import authModule from './modules/authModule';  // Import the auth module
import ui from './modules/ui';

const store = createStore({
  modules: {
    auth:authModule, // Register the auth module
    ui
  },
});

export default store;
