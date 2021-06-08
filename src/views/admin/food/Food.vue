<template>
    <v-container class="pt-10">
        <CreateFood />
        <ListFood />
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
    }
}
</script>