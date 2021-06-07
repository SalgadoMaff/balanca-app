import Vue from "vue"

import "./registerServiceWorker"
import "./plugins/mixins"
import "./plugins/router"
import "./plugins/vuex"
import vuetify from "./plugins/vuetify"
import store from "./store"
import router from "./router"
import App from "./App.vue"

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount("#app")
