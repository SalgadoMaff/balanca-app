import food from "@/api/food"

const state = {
    foods: []
}

const getters = {
    getFoods: (state) => state.foods
}

const mutations = {
    setFoods: (state, foods) => {
        state.foods = foods
    }
}

const actions = {
    findAllFoods: async ({ commit }) => {
        const response = await food.findAll()
        if (!(response instanceof Error)) {
            commit("setFoods", response.data)
        }
    }
}

export default { state, getters, mutations, actions, namespaced: true }
