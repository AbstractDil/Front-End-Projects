// store/index.js
/*import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
    user: null,
  },
  mutations: {
    setAuth(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    login({ commit }, userData) {
      commit('setAuth', { isAuthenticated: true, user: userData.user });
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    userFirstLetter: state => state.user?.name ? state.user.name.charAt(0).toUpperCase() : '',
  }
});

*/