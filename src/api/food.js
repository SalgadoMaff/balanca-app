import api from "@/api/config"

export default {
    findAll() {
        return api.get("foods")
    },
    create(food) {
        return api.post("foods", food)
    },
    update(id, food) {
        return api.put(`foods/${id}`, food)
    }
}
