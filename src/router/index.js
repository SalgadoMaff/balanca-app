import Vue from "vue";
import VueRouter from "vue-router";
import NewMeal from "../views/NewMeal.vue";
import History from "../views/History.vue";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path:"/",
    name:"Home",
    component: Home,
  },{
    path: "/new-meal",
    name: "Nova_refeicao",
    component: NewMeal,
  },{
    path: "/history",
    name: "Historico",
    component: History,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
