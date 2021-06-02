import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

import error from "@/store/error"
import user from "@/store/user"
import food from "@/store/food"

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    modules: {
        error,
        user,
        food
    }
})
