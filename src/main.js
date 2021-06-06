import Vue from "vue"
import "./registerServiceWorker"
import vuetify from "./plugins/vuetify"
import router from "./router"
import store from "./store"
import App from "./App.vue"

import date from "./mixins/date"

Vue.config.productionTip = false
Vue.mixin(date)

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount("#app")
