import api from "@/api/config"

export default {
    create(meal) {
        return api.post(`meals`, meal)
    },
    findAllByUser() {
        return api.get(`meals`)
    }
}
