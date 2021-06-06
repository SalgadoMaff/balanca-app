import mealApi from "@/api/meal"

const state = {
    meals: []
}

const getters = {
    getMeals: (state) => state.meals
}

const mutations = {
    setMeals: (state, meals) => {
        state.meals = meals
    }
}

const actions = {
    createMeal: async ({ commit }, { userId, meal }) => {
        const response = await mealApi.create(userId, meal)
        if (!(response instanceof Error)) {
            return true
        }
        return false
    },
    findAllMealsByUser: async ({ commit }, userId) => {
        commit("setMeals", [])
        const response = await mealApi.findAllByUser(userId)
        if (!(response instanceof Error)) {
            commit("setMeals", response.data.meals)
        }
    }
}

export default { state, getters, mutations, actions, namespaced: true }
