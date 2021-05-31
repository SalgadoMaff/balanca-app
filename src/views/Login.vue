<template>
  <v-container>
    <v-layout class="justify-center align-self-center">
      <v-col cols="6">
        <v-card @keyup.enter="authenticate">
          <v-card-title class="justify-center">Entrar</v-card-title>

          <v-card-text class="text-primary">
            <v-text-field v-model="authData.username" label="Usuário" />
            <v-text-field
              v-model="authData.password"
              label="Senha"
              type="password"
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
      </v-col>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'Login',
  data() {
    return {
      authData: {
        username: '',
        password: '',
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters('user', ['getUser']),
  },
  methods: {
    ...mapActions('user', ['login', 'findUser']),
    async authenticate() {
      this.loading = true
            const success = await this.login(this.authData)
            if (success) {
        await this.findUser()
                this.$router.push({ path: '/' })
            }
      this.loading = false
        },
  },
}
</script>
