<template>
    <v-container>
        <div class="text-center">
            <h2>Bem vindo ao TCC da Balança{{ user }}!</h2>
        </div>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    name: "Home",
    computed: {
        ...mapGetters("user", ["getUser"]),
        user() {
            return `, ${this.getUser.name}`
        }
    }
}
</script>
