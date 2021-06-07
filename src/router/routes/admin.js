import ListUser from "@/views/admin/user/ListUser"
import ListFood from "@/views/admin/food/ListFood"

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
        path: "/food",
        name: "ListFood",
        component: ListFood,
        meta: {
            authorizationRequired: true,
            role: "ADMIN"
        }
    }
    
]

export default routes