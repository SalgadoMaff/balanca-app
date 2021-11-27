<template>
    <v-container class="pt-10">
        <CreateNutrient :data="nutrient" @done="clearNutrient" />
        <ListNutrient @edit="editNutrient" />
    </v-container>
</template>

<script>
import ListNutrient from "./ListNutrient.vue"
import CreateNutrient from "./CreateNutrient.vue"

export default {
    name: "Nutrient",
    components: {
        ListNutrient,
        CreateNutrient
    },
    data: () => ({
        nutrient: {}
    }),
    methods: {
        clearNutrient() {
            this.nutrient = {}
        },
        editNutrient(nutrient) {
            this.nutrient = nutrient
        }
    }
}
</script>

<style scoped>

</style>