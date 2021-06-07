import Home from "@/views/common/Home"
import Login from "@/views/common/Login"
import Logout from "@/views/common/Logout"
import NotAuthorized from "@/views/common/NotAuthorized"

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
    }
]

export default routes