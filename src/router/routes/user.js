import NewMeal from "@/views/user/NewMeal"
import History from "@/views/user/History"

const routes = [
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

export default routes