<template>
    <v-app id="inspire" class="app-container">
        <v-navigation-drawer v-if="validateShowApp()" v-model="drawer" app>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        Balança
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
                <v-list-item v-for="item in menu" v-show="hasAccess(item.to)" :key="item.title" :to="item.to" link>
                    <v-list-item-icon>
                        <v-icon :class="item.iconClass">{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title :class="item.textClass">
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar v-if="validateShowApp()" app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title></v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-snackbar v-model="showAlert" :color="alertColor" elevation="4" transition="fade" timeout="3000" dense top
                        right>
                {{ alertMessage }}
                <v-btn slot="action" icon x-small @click="toggleAlert">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-snackbar>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    name: "App",
    computed: {
        ...mapGetters("error", ["getError", "getSuccess"]),
        ...mapGetters("user", ["getUser"])
    },
    data: () => ({
        alertColor: "",
        alertMessage: "",
        showAlert: false,
        drawer: true,
        menu: [
            {
                title: "Home",
                icon: "mdi-home",
                to: "/"
            },
            {
                title: "Histórico de Refeições",
                icon: "mdi-history",
                to: "/history"
            },
            {
                title: "Nova Refeição",
                icon: "mdi-newspaper-plus",
                to: "/new-meal"
            },
            {
                title: "Usuários",
                icon: "mdi-account-group",
                to: "/users"
            },
            {
                title: "Alimentos",
                icon: "mdi-chef-hat",
                to: "/foods"
            },
            {
                title: "Sair",
                icon: "mdi-logout-variant",
                to: "/logout",
                iconClass: "flipped",
                textClass: "text-red"
            }
        ]
    }),
    methods: {
        validateShowApp() {
            return this.getUser && this.getUser._id
        },
        toggleAlert() {
            this.showAlert = !this.showAlert
        }
    },
    watch: {
        getError() {
            if (this.getError) {
                this.alertMessage = this.getError.message
                this.alertColor = "error"
                this.showAlert = true
            }
        },
        getSuccess() {
            if (this.getSuccess) {
                this.alertMessage = this.getSuccess.message
                this.alertColor = "success"
                this.showAlert = true
            }
        }
    }
}
</script>

<style lang="sass">
.app-container
    height: 100%

.flipped
    transform: rotate(180deg)
    color: #EF5350 !important

.text-red
    color: #EF5350 !important
</style>