import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Vtuber from "../views/Vtuber.vue";
import Webcam from "../views/Webcam.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/vtuber",
    name: "Vtuber",
    component: Vtuber,
  },
  {
    path: "/webcam",
    name: "Webcam",
    component: Webcam,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
