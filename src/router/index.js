import { createRouter, createWebHashHistory } from "vue-router";
import viewPage from "../views/viewPage.vue";
import addPage from "../views/addPage.vue";
import homeView from "@/views/homeView";

const routes = [
  {
    path: "/",
    name: "homeView",
    component: homeView,
  },
  {
    path: "/viewPage",
    name: "viewPage",
    component: viewPage,
  },
  {
    path: "/addPage",
    name: "addPage",
    component: addPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
