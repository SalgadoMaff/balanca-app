import ListUser from "@/views/admin/user/ListUser"

const routes = [
    {
        path: "/users",
        name: "ListUser",
        component: ListUser,
        meta: {
            authorizationRequired: true,
            role: "ADMIN"
        }
    }
]

export default routes