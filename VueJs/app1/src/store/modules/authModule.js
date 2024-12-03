const authModule = {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    userDetails: JSON.parse(localStorage.getItem('userDetails')) || null,
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.userId,
    userDetails: (state) => state.userDetails,
    userType: (state) => (state.userDetails ? state.userDetails.user_type : null),
    token : (state) =>state.token,
  },
  actions: {
    setToken({ commit }, token) {
      commit('SET_TOKEN', token);
      localStorage.setItem('token', token);
    },
    setUserData({ commit }, userId) {
      commit('SET_USER_DATA', userId);
      localStorage.setItem('userId', userId);
    },
    setUserDetails({ commit }, userDetails) {
      commit('SET_USER_DETAILS', userDetails);
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
    },
    logout({ commit }) {
      commit('CLEAR_AUTH_DATA');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userDetails');
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
