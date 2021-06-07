import user from "@/api/user"

const state = {
    user: {
        _id: ""
    },
    users: []
}

const getters = {
    getUser: (state) => state.user,
    getUsers: (state) => state.users
}

const mutations = {
    setUser: (state, user) => {
        state.user = user
    },
    setUsers: (state, users) => {
        state.users = users
    }
}

const actions = {
    login: async (context, { username, password }) => {
        const response = await user.login(username, password)
        if (!(response instanceof Error)) {
            localStorage.setItem("token", response.data.accessToken)
            return true
        }
        return false
    },
    findUser: async ({ commit }) => {
        const response = await user.findCurrent()
        if (!(response instanceof Error)) {
            commit("setUser", response.data)
        }
    },
    clearUserData: ({ commit }) => {
        commit("setUser", { _id: "" })
    },
    findAllUsers: async ({ commit }) => {
        commit("setUsers", [])
        const response = await user.findAll()
        if (!(response instanceof Error)) {
            commit("setUsers", response.data)
        }
    }
}

export default { state, getters, mutations, actions, namespaced: true }
