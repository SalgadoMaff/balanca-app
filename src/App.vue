<template>
  <v-app id="inspire">
    <v-navigation-drawer v-if="validateShowApp()" v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Balança </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in menu" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="validateShowApp()" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-snackbar
        v-model="showErrorAlert"
        dense
        elevation="4"
        transition="fade"
        color="error"
        timeout="3000"
        top
        right
      >
        {{ errorMessage }}
        <v-btn slot="action" icon x-small @click="toggleErrorAlert">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('error', ['getError']),
    ...mapGetters('user', ['getUser']),
  },
  data: () => ({
    errorMessage: '',
    showErrorAlert: false,
    drawer: true,
    menu: [
      { title: 'Home', icon: 'mdi-home', to: '/' },
      { title: 'Histórico de Refeições', icon: 'mdi-history', to: '/history' },
      { title: 'Nova Refeição', icon: 'mdi-newspaper-plus', to: '/new-meal' },
    ],
  }),
  methods: {
    validateShowApp() {
      return this.getUser && this.getUser._id
        },
    toggleErrorAlert() {
      this.showErrorAlert = !this.showErrorAlert
        },
  },
  watch: {
    getError() {
      if (this.getError) {
        this.errorMessage = this.getError.message
                this.showErrorAlert = true
            }
    },
  },
}
</script>
