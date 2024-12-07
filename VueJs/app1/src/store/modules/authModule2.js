import axios from "axios";

const authModule = {
    namespaced: true,
    state: {
      token: localStorage.getItem('token') || null,
      userId: localStorage.getItem('userId') || null,
      userDetails: null,
    },
    getters: {
      isLoggedIn: (state) => !!state.token,
      userId: (state) => state.userId,
      userDetails: (state) => state.userDetails,
      userType: (state) => (state.userDetails ? state.userDetails.user_type : null),
      token: (state) => state.token,
    },
    actions: {
      async setToken({ commit }, token) {
        commit('SET_TOKEN', token);
        localStorage.setItem('token', token);
      },
      setUserData({ commit, dispatch }, userId) {
        commit('SET_USER_DATA', userId);
        localStorage.setItem('userId', userId);
  
        // Fetch user details after setting the UID
        dispatch('setUserDetails', userId);
      },
      async setUserDetails({ commit, state }, userId) {
        try {
          // Replace `/user/details` with your actual API endpoint
          const response = await axios.get(`/show-user/${userId}`, {
            headers: {
              Authorization: `Bearer ${state.token}`, // Send token if required
            },
          });
  
          if (response?.data.data) {
            commit('SET_USER_DETAILS', response.data.data);
          } else {
            console.error('Failed to fetch user details: Invalid response');
          }
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      },
      logout({ commit }) {
        commit('CLEAR_AUTH_DATA');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      },
    },
    mutations: {
      SET_TOKEN(state, token) {
        state.token = token;
      },
      SET_USER_DATA(state, userId) {
        state.userId = userId;
      },
      SET_USER_DETAILS(state, userDetails) {
        state.userDetails = userDetails;
      },
      CLEAR_AUTH_DATA(state) {
        state.token = null;
        state.userId = null;
        state.userDetails = null;
      },
    },
  };
  
  export default authModule;
  