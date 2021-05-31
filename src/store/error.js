const state = {
  error: null,
}

const getters = {
  getError: (state) => state.error,
}

const mutations = {
  setError: (state, error) => {
    state.error = error
    },
}

export default { state, getters, mutations, namespaced: true }
