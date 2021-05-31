import user from '@/api/user';

const state = {
  user: {
    _id: '',
  },
}

const getters = {
  getUser: (state) => state.user,
}

const mutations = {
  setUser: (state, user) => {
    state.user = user
    },
}

const actions = {
  login: async (context, { username, password }) => {
    const response = await user.login(username, password)
        if (!(response instanceof Error)) {
      localStorage.setItem('token', response.data.accessToken)
            return true
        }
    return false
    },
  findUser: async ({ commit }) => {
    const response = await user.findUser()
        if (!(response instanceof Error)) {
      commit('setUser', response.data)
        }
  },
}

export default { state, getters, mutations, actions, namespaced: true }
