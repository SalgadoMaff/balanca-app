import VueRouter from "vue-router"

import Home from "@/views/Home.vue"
import NewMeal from "@/views/NewMeal.vue"
import History from "@/views/History.vue"
import Login from "@/views/Login.vue"
import Logout from "@/views/Logout.vue"

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/new-meal",
        name: "NewMeal",
        component: NewMeal
    },
    {
        path: "/history",
        name: "History",
        component: History
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

export default router
