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
    },
    createFood: async ({}, { name, calPerGram }) => {
        const response = await food.create({ name, calPerGram })
        if (!(response instanceof Error)) {
            return true
        }
        return false
    }
}

export default { state, getters, mutations, actions, namespaced: true }
