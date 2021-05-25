import Vue from "vue";
import VueRouter from "vue-router";
import New_meal from "../views/New_meal.vue";
import History from "../views/History.vue";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path:"/",
    name:"Home",
    component: Home,
  },{
    path: "/New_meal",
    name: "Nova_refeicao",
    component: New_meal,
  },{
    path: "/History",
    name: "Historico",
    component: History,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
