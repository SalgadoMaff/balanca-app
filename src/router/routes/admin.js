import ListUser from "@/views/admin/user/ListUser"
import Food from "@/views/admin/food/Food"

const routes = [
    {
        path: "/users",
        name: "ListUser",
        component: ListUser,
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