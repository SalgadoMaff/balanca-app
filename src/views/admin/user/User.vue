<template>
    <v-container class="pt-10">
        <CreateUser />
        <ListUser />
    </v-container>
</template>

<script>
import CreateUser from "./CreateUser.vue"
import ListUser from "./ListUser.vue"
export default {
    name: "User",
    components: {
        CreateUser,
        ListUser
    }
}
</script>