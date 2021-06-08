import User from "@/views/admin/user/User"
import Food from "@/views/admin/food/Food"

const routes = [
    {
        path: "/users",
        name: "User",
        component: User,
        meta: {
            authorizationRequired: true,
            role: "ADMIN"
        }
    },
    {
        path: "/foods",
        name: "Food",
        component: Food,
        meta: {
            authorizationRequired: true,
            role: "ADMIN"
        }
    }
    
]

export default routes