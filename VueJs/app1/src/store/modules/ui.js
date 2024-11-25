// store/modules/ui.js
const state = {
    isLoading: false,
  };
  
  const mutations = {
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
  };
  
  const actions = {
    setLoading({ commit }, status) {
      commit('SET_LOADING', status);
    },
  };
  
  const getters = {
    isLoading: (state) => state.isLoading,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  