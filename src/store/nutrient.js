import nutrient from "@/api/nutrient"

const state = {
    nutrients: []
}

const getters = {
    getNutrients: (state) => state.nutrients
}

const mutations = {
    setNutrients: (state, nutrients) => {
        state.nutrients = nutrients
    }
}

const actions = {
    findAllNutrients: async ({ commit }) => {
        const response = await nutrient.findAll()
        if (!(response instanceof Error)) {
            commit("setNutrients", response.data)
        }
    },
    createNutrient: async ({}, { name, type }) => {
        const response = await nutrient.create({ name, type })
        if (!(response instanceof Error)) {
            return true
        }
        return false
    }
}

export default { state, getters, mutations, actions, namespaced: true }
