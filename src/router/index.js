import VueRouter from "vue-router"

import common from "@/router/routes/common"
import admin from "@/router/routes/admin"
import user from "@/router/routes/user"

import store from "@/store"

const router = new VueRouter({
    routes: [
        ...common,
        ...admin,
        ...user
    ]
})

router.beforeEach((to, from, next) => {
    if (!to.path.match(/^\/login/)) {
        const token = localStorage.getItem("token")

        if (!token) {
            return next({ path: "/login" })
        }
    }
    return next()
})

router.beforeEach((to, from, next) => {
    if (to.meta.authorizationRequired) {
        const requiredRole = to.meta.role
        const userRole = store.state.user.user.role

        if (requiredRole != userRole) {
            return next({ path: "/not-authorized" })
        }
    }
    return next()
})

export default router
