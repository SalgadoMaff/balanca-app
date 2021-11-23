import api from "@/api/config"

export default {
    findAll() {
        return api.get("nutrients")
    },
    create(nutrient) {
        return api.post("nutrients", nutrient)
    }
}
