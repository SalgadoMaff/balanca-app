import mealApi from "@/api/meal"

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
    createMeal: async ({ commit }, { userId, meal }) => {
        const response = await mealApi.create(userId, meal)
        if (!(response instanceof Error)) {
            return true
        }
        return false
    }
}

export default { state, getters, mutations, actions, namespaced: true }
