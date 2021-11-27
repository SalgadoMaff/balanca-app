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
    createMeal: async ({ commit }, meal) => {
        const response = await mealApi.create(meal)
        if (!(response instanceof Error)) {
            return true
        }
        return false
    },
    findAllMealsByUser: async ({ commit }) => {
        commit("setMeals", [])
        const response = await mealApi.findAllByUser()
        if (!(response instanceof Error)) {
            commit("setMeals", response.data)
        }
    }
}

export default { state, getters, mutations, actions, namespaced: true }
