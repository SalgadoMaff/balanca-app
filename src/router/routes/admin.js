import User from "@/views/admin/user/User"
import Food from "@/views/admin/food/Food"
import Nutrient from "@/views/admin/nutrient/Nutrient"

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
    },
    {
        path: "/nutrients",
        name: "Nutrient",
        component: Nutrient,
        meta: {
            authorizationRequired: true,
            role: "ADMIN"
        }
    }

]

export default routes