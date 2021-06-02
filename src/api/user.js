import api from "@/api/config"

export default {
    login(username, password) {
        return api.post("users/login", { username, password })
    },
    findCurrent() {
        return api.get("users/session")
    }
}
