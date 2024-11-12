// store/modules/authModule.js
import axios from 'axios';

const authModule = {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    userDetails: null,
  },
  getters: {
    user: (state) => state.user,
    userId: (state) => state.userId,
    userDetails: (state) => state.userDetails,
    isLoggedIn: (state) => !!state.token, // Changed to check token instead of user
  },
  actions: {
    setUserData({ commit }, userId) {
      commit('SET_USER_DATA', { userId });
    },
    async fetchUserDetails({ commit, state }) {
      try {
        const response = await axios.get(`show-user/${state.userId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        console.log(response.data);
        commit('SET_USER_DETAILS', response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Add error handling action
      }
    },
    logout({ commit }) {
      commit('CLEAR_USER_DATA');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId'); // Remove userId from localStorage
    },
    clearUserData({ commit }) {
      commit('CLEAR_USER_DATA');
      localStorage.removeItem('user');
      localStorage.removeItem('userId'); // Remove userId from localStorage
    },
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
    },
    SET_USER_DETAILS(state, userDetails) {
      state.userDetails = userDetails;
    },
    CLEAR_USER_DATA(state) {
      state.user = null;
      state.userDetails = null;
      state.userId = null; // Reset userId
    },
  },
};

export default authModule;