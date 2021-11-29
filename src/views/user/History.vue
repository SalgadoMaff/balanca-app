<template>
    <calendar :events="meals" @change="findMeals" />
</template>

<script>
import Calendar from "@/components/Calendar"
import { mapActions, mapGetters } from "vuex"

export default {
    name: "History",
    components: {
        Calendar
    },
    data: () => ({
        meals: []
    }),
    computed: {
        ...mapGetters("meal", ["getMeals"])
    },
    methods: {
        ...mapActions("meal", ["findAllMealsByUser"]),
        async findMeals() {
            await this.findAllMealsByUser()
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
                    hour: this.formatTime(meal.createdAt),
                    details: this.formatDetails(meal)
                    
                })
            })
        },
        formatDetails(meal) {
            return meal.foods.reduce(this.formatDetailsText, "")
        },
        formatDetailsText(text, food) {
            let strNutritionFacts=""
                food.ProportionalNutritionFacts.forEach(element => {
                    if(element==food.ProportionalNutritionFacts[food.ProportionalNutritionFacts.length-1]){
                        strNutritionFacts+=element.nutrient+": "+element.amount.value+element.amount.unit
                    }else{
                        strNutritionFacts+=element.nutrient+": "+element.amount.value+element.amount.unit+" - "
                    }
                })
            if (text) {
                return `${text}<br>${food.foodId.name} - Calorias: ${food.ProportionalCal} - ${food.quantity.value}${food.quantity.unit} - ${strNutritionFacts}`
            }
            return `${food.foodId.name} - Calorias: ${food.ProportionalCal} - ${food.quantity.value}${food.quantity.unit} - ${strNutritionFacts}`
        }
    }
}
</script>
