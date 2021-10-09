<template>
    <v-container class="login-container">
        <v-flex xs12 sm6 md4>
            <v-card @keyup.enter="authenticate">
                <v-card-title class="justify-center">Balança Inteligente</v-card-title>

                <v-card-text class="text-primary">
                    <v-text-field v-model="authData.username" label="Usuário" />
                    <v-text-field
                        v-model="authData.password"
                        label="Senha"
                        :append-icon="passwordIcon"
                        :type="passwordType"
                        @click:append="toggleShowPassword"
                    />
                </v-card-text>

                <v-card-actions class="justify-center">
                    <v-btn
                        class="primary"
                        @click="authenticate"
                        :loading="loading"
                        :disabled="loading"
                    >
                        <span>Entrar</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
    name: "Login",
    data() {
        return {
            authData: {
                username: "",
                password: ""
            },
            loading: false,
            showPassword: false
        }
    },
    computed: {
        ...mapGetters("user", ["getUser"]),
        passwordIcon() {
            return this.showPassword ? "mdi-eye-off" : "mdi-eye"
        },
        passwordType() {
            return this.showPassword ? "text" : "password"
        }
    },
    methods: {
        ...mapActions("user", ["login", "findUser"]),
        async authenticate() {
            this.loading = true
            const success = await this.login(this.authData)
            if (success) {
                await this.findUser()
                this.$router.push({ path: "/" })
            }
            this.loading = false
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword
        }
    }
}
</script>

<style scoped lang="sass">
.login-container
    height: 100%
    display: flex
    justify-content: center
    align-items: center
</style>