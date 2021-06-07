import VueRouter from "vue-router"

import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue"
import Logout from "@/views/Logout.vue"
import NotAuthorized from "@/views/NotAuthorized.vue"
import NewMeal from "@/views/NewMeal.vue"
import History from "@/views/History.vue"

import store from "@/store"

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/logout",
        name: "Logout",
        component: Logout
    },
    {
        path: "/not-authorized",
        name: "NotAuthorized",
        component: NotAuthorized
    },
    {
        path: "/new-meal",
        name: "NewMeal",
        component: NewMeal,
        meta: {
            authorizationRequired: true,
            role: "USER"
        }
    },
    {
        path: "/history",
        name: "History",
        component: History,
        meta: {
            authorizationRequired: true,
            role: "USER"
        }
    }
]

const router = new VueRouter({
    routes
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
