<template>
    <v-container class="pt-10">
        <CreateFood :data="foodToEdit"/>
        <ListFood @edit="editFood"/>
    </v-container>
</template>

<script>
import ListFood from "./ListFood.vue"
import CreateFood from "./CreateFood.vue"
export default {
    name: "Food",
    components: {
        ListFood,
        CreateFood
    },
    data: () => ({
        foodToEdit: {}
    }),
    methods: {
        editFood(food) {
            this.foodToEdit = food
        }
    }
}
</script>