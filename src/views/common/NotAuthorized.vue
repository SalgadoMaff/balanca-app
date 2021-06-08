<template>
    <v-container class="text-center">
        <div class="pb-4">
            <h2>Desculpe, você não tem acesso a esta página.</h2>
        </div>
        <v-btn text @click="back">
            <v-icon>mdi-arrow-left</v-icon>
            <span>Voltar</span>
        </v-btn>
    </v-container>
</template>

<script>
export default {
    name: "NotAuthorized",
    methods: {
        back() {
            this.$router.go(-1)
        }
    }
}
</script>