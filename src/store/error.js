const state = {
    error: null,
    success: null
}

const getters = {
    getError: (state) => state.error,
    getSuccess: (state) => state.success
}

const mutations = {
    setError: (state, error) => {
        state.error = error
    },
    setSuccess: (state, success) => {
        state.success = success
    }
}

export default { state, getters, mutations, namespaced: true }
