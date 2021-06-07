import Vue from "vue"

import vuetify from "./plugins/vuetify"
import router from "./router"
import store from "./store"
import App from "./App.vue"

import "./registerServiceWorker"
import "./plugins/mixins"

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount("#app")
