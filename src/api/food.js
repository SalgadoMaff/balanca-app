import api from "@/api/config"

export default {
    findAll() {
        return api.get("foods")
    }
}
