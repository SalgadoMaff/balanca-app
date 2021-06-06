import api from "@/api/config"

export default {
    create(userId, meal) {
        return api.post(`users/${userId}/meals`, meal)
    },
    findAllByUser(userId) {
        return api.get(`users/${userId}/meals`)
    }
}
