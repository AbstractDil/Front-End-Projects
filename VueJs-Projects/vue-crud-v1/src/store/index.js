import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,  // Stores the entire user object (including userId, name, etc.)
  },
  getters: {
    user: (state) => state.user,  // Returns the user object from the state
    userId: (state) => state.user ? state.user.id : null,  // Returns the user ID from the user object
  },
  actions: {

    setUserId({ commit }, userId) {
      commit('SET_USER_ID', userId);  // Commits the userId to the mutation
    },

    setUserData({ commit }, userData) {
      commit('SET_USER_DATA', userData);  // Commits the entire user object to the mutation
    },
    clearUserData({ commit }) {
      commit('CLEAR_USER_DATA');  // Clears the user data from the state
    },
    logout({ commit }) {
      // Clear the user data from the state
      commit('CLEAR_USER_DATA');
      // Optionally clear any tokens or other session data stored in localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;  // Updates the state with the user object
    },
    CLEAR_USER_DATA(state) {
      state.user = null;  // Resets the user object in the state
    },
    SET_USER_ID(state, userId) {
      // Ensure user object exists before assigning the userId
      if (!state.user) {
        state.user = {};
      }
      state.user.id = userId;  // Updates the userId in the user object
    },
  },
});

export default store;
