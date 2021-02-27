import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";

import augma from "augma";
import "augma/style";

const app = createApp(App);
app.use(augma);
app.use(store).use(router).mount("#app");
