<template>
    <calendar :events="meals" @change="findMeals"/>
</template>

<script>
import Calendar from "@/components/Calendar"
import {mapActions, mapGetters} from "vuex"
export default {
    name: "History",
    components: {
        Calendar
    },
    data: () => ({
        meals: [],
    }),
    computed: {
        ...mapGetters("meal", ["getMeals"]),
        ...mapGetters("user", ["getUser"])
    },
    methods: {
        ...mapActions("meal", ["findAllMealsByUser"]),
        async findMeals() {
            await this.findAllMealsByUser(this.getUser._id)
            this.createEvents()
        },
        createEvents() {
            this.meals = []
            this.getMeals.map(meal => {
                this.meals.push({
                    color: "cyan",
                    start: this.formatDateTime(meal.createdAt),
                    end: this.formatDateTime(meal.createdAt),
                    timed: true,
                    details: this.formatDetails(meal)
                })
            })
        },
        formatDetails(meal) {
            return meal.plate.reduce(this.formatDetailsText, "")
        },
        formatDetailsText(text, plate) {
            if (text) {
                return `${text}<br>${plate.foodId.name} - quantidade: ${plate.quantity}`
            }
            return `${plate.foodId.name} - quantidade: ${plate.quantity}`
        }
    }
}
</script>
